import { CommandContext, Middlewares, Options, SubCommand, createChannelOption, Declare } from "seyfert";
import { ChannelType } from "seyfert/lib/common";
import Guilds from "../models/Guilds";

const options = {
    channel: createChannelOption({
        description: 'The channel which the notifications will be sent',
        required: true,
        channel_types: [ChannelType.GuildText]
    })
}

@Declare({
    name: 'add',
    description: 'Set the channels where the stream notifications will be sent'
})

@Options(options)

@Middlewares(['DeferReply'])

export default class AddChannel extends SubCommand {
    async run(ctx: CommandContext<typeof options, never>) {
        
        const data = await Guilds.findOne({ id: ctx.guildId })

        const { channel } = ctx.options;

        if(!data){

            await Guilds.create({
                id: ctx.guildId,
                channelID: channel.id
            })

            return ctx.editOrReply({ content: `Now I will send stream notifications within <#${channel.id}>`})

        }

        data.channelID = channel.id

        await data.save();

        return ctx.editOrReply({ content: `Now I will send stream notifications within <#${channel.id}>`})        

    }
}