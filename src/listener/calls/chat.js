const chatUtil = (client, channelID) => {
  if (client && channelID) {
    return {
      post: async (text, blocks) => {
        const config = {
          token: process.env.SLACK_BOT_TOKEN,
          channel: channelID,
          text: text,
        };
        if (blocks) config.blocks = blocks;

        return client.chat.postMessage(config);
      },
      delete: async (ts) => {
        client.chat.delete({
          token: process.env.SLACK_BOT_TOKEN,
          channel: channelID,
          ts: ts,
        });
      },
    };
  } else {
    return null;
  }
};

module.exports = chatUtil;