import { SubscriptionTypes } from "@twitchapi/eventsub";
import { SubCommand, Declare, Options, createStringOption, CommandContext, Middlewares } from "seyfert";
import handleStreamOnline from "../functions/handleStreamOnline";
import Streams from "../models/Streams";

const options = {
    username: createStringOption({
        description: 'The username of the streamer you want to be quit from notifications when he starts a stream',
        required: true
    })
}

@Declare({
    name: 'remove',
    description: 'Removes a stream to the notifications system.'
})

@Options(options)

@Middlewares(['DeferReply', 'CheckDB'])


export default class RemoveStream extends SubCommand {

    async run(ctx: CommandContext<typeof options, 'DeferReply' | 'CheckDB'>) {

        const db = ctx.metadata.CheckDB;

        if (!db.stream || !db.stream.subscribedGuilds.some((x) => x === ctx.guildId)) {

            return await ctx.editOrReply({ content: `You are not receiving this user streams notifications` })

        }else {

            
            const index = db.stream.subscribedGuilds.findIndex((x) => x === ctx.guildId)

            db.stream.subscribedGuilds.splice(index, 1);

            await db.stream.save();

            if(!db.stream.subscribedGuilds.length){

                const subscription = ctx.twitch.subscriptions.exist(SubscriptionTypes.StreamOnline, { broadcaster_user_id: db.stream.userID });

                await subscription.delete();

                await db.stream.deleteOne()

            }

            return ctx.editOrReply({ content: `\`${ctx.options.username}\`'s stream notification won't be sent in <#${db.guild.channelID}> for now`})

        }


    }
}