const {App, ExpressReceiver} = require('@slack/bolt');

const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    logLevel: 'debug',
});

// ボットトークンとソケットモードハンドラーを使ってアプリを初期化します
const app = new App({
    logLevel: 'debug',
    token: process.env.SLACK_BOT_TOKEN,
    // appToken: process.env.SLACK_APP_TOKEN,
    // socketMode: true,
    receiver
});

app.message('hello', async ({message, say}) => {
    await say(`Hey there <@${message.user}>!`);
});

(async () => {
    // アプリを起動します
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();
