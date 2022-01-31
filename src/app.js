const {App, ExpressReceiver} = require("@slack/bolt");
const bodyParser = require("body-parser");
const {
    getSendSurvey,
    openSurveyModal,
    receiveSurvey,
    SURVEY_MODAL_VIEW_NAME
} = require("./listener/survey-listener");
const dbUtil = require("./db-util")
const {
    openSettingsModal,
    receiveSettings,
    SETTINGS_MODAL_VIEW_NAME
} = require("./listener/settings-listener");
const {
    getReportSurvey,
    openReportModal
} = require("./listener/report-listener.js")
require("dotenv").config()


const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    logLevel: "debug",
});
receiver.router.use(bodyParser.json());

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
app.action("actionbtn_id", openReportModal);

app.command("/dss_setting", openSettingsModal);
app.view(SETTINGS_MODAL_VIEW_NAME, receiveSettings);

(async () => {
    await dbUtil.init();
    await app.start(process.env.PORT || 3000);

    console.log("⚡️ Bolt app is running!");
})();