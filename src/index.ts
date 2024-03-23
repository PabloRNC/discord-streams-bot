import { WebhookConnection, MongoAdapter, Events, SubscriptionTypes } from "@twitchapi/eventsub";
import { HelixClient } from '@twitchapi/helix'
import { connect } from "mongoose";
import { Client, OptionsRecord, ParseMiddlewares, ExtendContext } from "seyfert";
import express from 'express'
import localtunnel from 'localtunnel';
import { config } from "dotenv";
import middlewares from "./middlewares";
import handleStreamOnline from "./functions/handleStreamOnline";

config()


async function init() {

    const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, WEBHOOK_SECRET, MONGO_URI, LOCALTUNNEL_SUBDOMAIN, PORT } = process.env

    await connect(MONGO_URI)

    console.log('Connected to database');

    const baseURL = (await localtunnel({ port: Number(PORT), subdomain: LOCALTUNNEL_SUBDOMAIN })).url;

    const app = express();

    app.get("/", (req, res) => {
        res.send('Hello World')
    })

    const appToken = await HelixClient.generateAppToken({ clientID: TWITCH_CLIENT_ID, clientSecret: TWITCH_CLIENT_SECRET })

    const connection = new WebhookConnection({ clientID: TWITCH_CLIENT_ID, clientSecret: TWITCH_CLIENT_SECRET, appToken, secret: WEBHOOK_SECRET, baseURL, storage: {
        adapter: new MongoAdapter<WebhookConnection>(),
    }, debug: true }, app)

    connection.on(Events.ConnectionReady, () => {
        client.logger.info('Connected to Twitch EventSub. We are ready!')
    })

    connection.on(Events.SubscriptionReload, (subscription) => {
        if(subscription.checkSubscriptionType(SubscriptionTypes.StreamOnline)){
         
            const fn = handleStreamOnline.bind({ client, twitch: connection })
            
            subscription.onMessage(fn)

        }
    })

    const client = new Client({
        context: () => {
            return {
                twitch: connection
            }
        }
    });

    client.setServices({
        middlewares 
    })

    await connection.start(Number(PORT), () => client.logger.info(`Connected to ${PORT}. URL: ${baseURL}`))

    await client.start()

    await client.uploadCommands();

}

init()

declare module 'seyfert' {

    interface CommandContext<T extends OptionsRecord = {}, M extends keyof RegisteredMiddlewares = never> extends ExtendContext {
        twitch: WebhookConnection
    }

    interface RegisteredMiddlewares extends ParseMiddlewares<typeof middlewares> {}
}

declare global {

    namespace NodeJS {

        interface ProcessEnv {
            BOT_TOKEN: string
            TWITCH_CLIENT_ID: string
            TWITCH_CLIENT_SECRET: string
            WEBHOOK_SECRET: string
            LOCALTUNNEL_SUBDOMAIN: string
            MONGO_URI: string
            PORT: string
        }
    }
}