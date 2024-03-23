import { Command, Declare, Options } from "seyfert";
import AddStream from "./add_stream";
import RemoveStream from "./remove_stream";


@Declare({
    name: 'streams',
    description: 'Manage streams notifications'
})

@Options([AddStream, RemoveStream])

export default class StreamsCommand extends Command {}