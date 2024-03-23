import { Schema, model, type Document } from "mongoose";

export interface IGuild extends Document {
    id: string
    channelID: string
}

const GuildsSchema = new Schema<IGuild>({
    id: {
        type: String,
        required: true
    },
    channelID: {
        type: String,
        required: true
    }
}) 

export default model('Guilds', GuildsSchema)