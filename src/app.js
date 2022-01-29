const {App, ExpressReceiver} = require("@slack/bolt");
const {getReportSurvey,getSendSurvey, openSurveyModal, receiveSurvey, SURVEY_MODAL_VIEW_NAME} = require("./listener/survey-listener");

const dbUtil = require("./db-util")
const {openSettingsModal} = require("./listener/app-home-listener");
require("dotenv").config()


const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    logLevel: "debug",
});

const app = new App({
    logLevel: "debug",
    token: process.env.SLACK_BOT_TOKEN,
    receiver
});

// custom endpoint for posting survey
receiver.router.post('/survey', getSendSurvey(app));
receiver.router.post('/survey-report', getReportSurvey(app));

app.action("open_survey_modal", openSurveyModal);


app.view(SURVEY_MODAL_VIEW_NAME, receiveSurvey);

app.action("open_settings", openSettingsModal);

// custom workflow step
// const ws = new WorkflowStep("send_survey", {
//     edit: async ({ack, step, configure}) => {
//         await ack();
//
//         const blocks = [
//             {
//                 "type": "section",
//                 "text": {
//                     "type": "plain_text",
//                     "text": "Send survey for daily scrum meeting.",
//                     "emoji": true
//                 }
//             }
//         ];
//
//         await configure({blocks})
//     },
//     save: async ({ack, step, update}) => {
//         await ack();
//
//         const inputs = {}
//         const outputs = []
//
//         await update({inputs, outputs});
//     },
//     execute: async ({step, complete, fail}) => {
//         await app.client.chat.postMessage({
//             token: app.client.token,
//             channel: process.env.DEFAULT_CHANNEL,
//             text: "test survey"
//         });
//
//         const outputs = {}
//
//         await complete({ outputs });
//     },
// });

(async () => {
    // set workflow step
    // app.step(ws);

    await dbUtil.init();

    await app.start(process.env.PORT || 3000);

    console.log("⚡️ Bolt app is running!");
})();
