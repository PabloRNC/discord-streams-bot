import { Client, Embed } from "seyfert";
import { StreamOnlineMessage, WebhookConnection } from "@twitchapi/eventsub";
import Guilds from "../models/Guilds";
import Streams from "../models/Streams";
import { EmbedColors } from "seyfert/lib/common";



export default async function handleStreamOnline(this: { client: Client, twitch: WebhookConnection }, message: StreamOnlineMessage<WebhookConnection>){

    const stream = await Streams.findOne({ userID: message.broadcaster.id })

    if(!stream) return;

    const data = await this.twitch.helixClient.getChannel(message.broadcaster.id);

    const userData = await this.twitch.helixClient.getUser(message.broadcaster.id);

    for(const guild of stream.subscribedGuilds){

        const guildData = await Guilds.findOne({ id: guild })

        if(!guildData) continue;

        const embed = new Embed()
        .setTitle(`${data.broadcaster_login} has gone online!`)
        .setDescription(`[${data.title}](https://twitch.tv/${data.broadcaster_login})`)
        .setURL(`https://twitch.tv/${data.broadcaster_login}`)
        .setColor(EmbedColors.Blurple)
        .setFooter({ text: data.game_name, iconUrl: userData.profile_image_url })
        .setThumbnail(userData.profile_image_url)
        .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${data.broadcaster_login}-1280x720.jpg`)
        .setTimestamp()

        await this.client.messages.write(guildData.channelID, { embeds: [embed] })

        continue;
    }

}