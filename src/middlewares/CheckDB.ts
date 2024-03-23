import { createMiddleware } from "seyfert";
import { Types } from "mongoose";
import Guilds, { IGuild } from "../models/Guilds";
import Streams, { IStream } from "../models/Streams";

type CheckDBGuild = IGuild & { _id: Types.ObjectId }
type CheckDBUser = IStream & { _id: Types.ObjectId }


export default createMiddleware<{ guild: CheckDBGuild, stream: CheckDBUser | null }>(async(data) => {

    const { context } = data

    if (context.isChat()) {

        const guild = await Guilds.findOne({ id: context.guildId })

        if(!guild){
            
            context.editOrReply({ content: 'You have to set a channel for the stream notifications to be sent.' })

            return data.stop(`No config for guild ${context.guildId}`);

        }

        if (!('username' in context.options)) return data.stop('No username option') //this won't happen lol

        const username = (context.options.username as string).toLowerCase();

        const stream = await Streams.findOne({ username });

        return data.next({ guild, stream })


    }

    return data.stop('Not in ChatInput Command') //this will never happen lol;

})