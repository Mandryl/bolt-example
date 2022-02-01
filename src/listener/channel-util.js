const channelUtil = (client)=>{
    return async (channelId) =>{
        const response = await client.conversations.info({
            token:process.env.SLACK_BOT_TOKEN,
            channel:channelId
        });

        return response.channel.name;
    };
}

module.exports = channelUtil;