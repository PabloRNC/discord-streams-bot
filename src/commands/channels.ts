import { Command, Declare, Options } from "seyfert";
import AddChannel from "./add_channel";

@Declare({
    name: 'channel',
    description: 'Manage the channel where notifications will be sent'
})

@Options([AddChannel])

export default class ChannelCommand extends Command {}