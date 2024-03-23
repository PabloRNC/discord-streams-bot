import { Schema, model, type Document } from "mongoose";

export interface IStream extends Document {
    userID: string
    username: string
    subscribedGuilds: string[]
}

const StreamsSchema = new Schema<IStream>({
    userID: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    subscribedGuilds: {
        type: [String],
        required: true
    }
}) 

export default model('Streams', StreamsSchema)