import { SubscriptionTypes } from "@twitchapi/eventsub";
import { SubCommand, Declare, Options, createStringOption, CommandContext, Middlewares } from "seyfert";
import handleStreamOnline from "../functions/handleStreamOnline";
import Streams from "../models/Streams";

const options = {
    username: createStringOption({
        description: 'The username of the streamer you want to be notified if he starts a stream',
        required: true
    })
}

@Declare({
    name: 'add',
    description: 'Adds a stream to the notifications system.'
})

@Options(options)

@Middlewares(['DeferReply', 'CheckDB'])


export default class AddStream extends SubCommand {

    async run(ctx: CommandContext<typeof options, 'DeferReply' | 'CheckDB'>) {

        const db = ctx.metadata.CheckDB;

        if (!db.stream) {

            const username = ctx.options.username.toLowerCase();

            try {

                const user = await ctx.twitch.helixClient.getUser(ctx.options.username);

                const subscription = await ctx.twitch.subscribe({
                    type: SubscriptionTypes.StreamOnline, options: {
                        broadcaster_user_id: user.id
                    }
                })

                const fn = handleStreamOnline.bind({ client: ctx.client, twitch: ctx.twitch })

                subscription.onMessage(fn);

                await Streams.create({ 
                    userID: user.id,
                    username: user.login,
                    subscribedGuilds: [ctx.guildId]
                })

                return ctx.editOrReply({ content: `\`${ctx.options.username}\`'s stream notification will be sent in <#${db.guild.channelID}> `})

            } catch (err) {
                return ctx.editOrReply({ content: `User \`${username}\` isn't a real Twitch's username. Please check it.` })
            }

        }else {

            if(db.stream.subscribedGuilds.find((x) => x === ctx.guildId)) return ctx.editOrReply({ content: `You have been already subscribed to this user stream notifications.`})

            db.stream.subscribedGuilds.push(ctx.guildId);

            await db.stream.save();

            return ctx.editOrReply({ content: `\`${ctx.options.username}\`'s stream notification will be sent in <#${db.guild.channelID}> `})

        }


    }
}