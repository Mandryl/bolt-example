require('dotenv').config()
const {App, ExpressReceiver, WorkflowStep} = require('@slack/bolt');

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

// custom endpoint for posting survey
receiver.router.post('/survey', async (req, res) => {
    await app.client.chat.postMessage({
        token: app.client.token,
        channel: process.env.DEFAULT_CHANNEL,
        text: 'test survey'
    });

    await res.send('OK');
});

// custom workflow step
const ws = new WorkflowStep('send_survey', {
    edit: async ({ack, step, configure}) => {
        await ack();

        const blocks = [
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": "Send survey for daily scrum meeting.",
                    "emoji": true
                }
            }
        ];

        await configure({blocks})
    },
    save: async ({ack, step, update}) => {
        await ack();

        const inputs = {}
        const outputs = []

        await update({inputs, outputs});
    },
    execute: async ({step, complete, fail}) => {
        await app.client.chat.postMessage({
            token: app.client.token,
            channel: process.env.DEFAULT_CHANNEL,
            text: 'test survey'
        });

        const outputs = {}

        await complete({ outputs });
    },
});

(async () => {
    // set workflow step
    app.step(ws);

    // アプリを起動します
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();
