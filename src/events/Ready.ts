import { createEvent } from 'seyfert';

export default createEvent({
    data: {
        name: 'botReady'
    },
    run(user, client, shard){
        client.logger.info(`${user.username} is ready in shard #${shard}`)
    }
})