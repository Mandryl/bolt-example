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
    openExpandedSettingsModal,
    SETTINGS_MODAL_VIEW_NAME, initializeSettings
} = require("./listener/settings-listener");
const {
    getReportSurvey,
    openReportModal
} = require("./listener/report-listener.js");
const {
    homeView,
    openHomeModal,
    openDetailReportModal
} = require("./listener/home-listener.js")
const calls = require("./listener/calls/calls");
const {initialSettingsBlocks} = require("./blocks/initial-settings");

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
app.action("home_survey_modal", openHomeModal);
app.action("start_daily_scrum", calls);
app.view(SURVEY_MODAL_VIEW_NAME, receiveSurvey);
app.action("actionbtn_id", openReportModal);
app.command("/dss_setting", openSettingsModal);
app.action("initial_settings", openSettingsModal);
app.action("expand_settings", openExpandedSettingsModal);
app.view(SETTINGS_MODAL_VIEW_NAME, receiveSettings);
app.event('app_home_opened',homeView);
app.event("member_joined_channel", initializeSettings);
app.action("modalbtn_id", openDetailReportModal);
(async () => {
    await dbUtil.init();
    await app.start(process.env.PORT || 3000);

    console.log("⚡️ Bolt app is running!");
})();
