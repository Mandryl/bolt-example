const {surveyBlocks} = require("../blocks/survey");
const {surveyModal} = require("../blocks/survey-modal");
const {surveyCreateJson,surveyModalJson} = require("../blocks/surveyCreate.js");
const Survey = require("../model/survey-model");
const {insertTo, findFrom} = require("../db-util");
const {v4: uuidv4} = require("uuid");

exports.SURVEY_MODAL_VIEW_NAME = 'survey_modal';
const REPORT_YESTERDAY_ACTION = 'report_yesterday';
const REPORT_TODAY_ACTION = 'report_today';
const REPORT_IMPEDIMENT_ACTION = 'report_impediment';
const REPORT_HEALTH_ACTION = 'report_health';

exports.getSendSurvey = (app) => {
    return async (req, res) => {
        await app.client.chat.postMessage({
            token: app.client.token,
            channel: process.env.DEFAULT_CHANNEL,
            blocks: surveyBlocks()
        });

        await res.status(200).send('OK');
    };
};

exports.getReportSurvey = (app) => {
    return async (req, res) => {
        await app.client.chat.postMessage({
            token: app.client.token,
            channel: process.env.DEFAULT_CHANNEL,
            blocks: await surveyCreateJson()
        });
        // postmessageのresponse値をｄｂに入れる
        await res.status(200).send('OK');
        console.log(res.json());
    }
}

exports.openReportModal = async({payload,ack, body, view,client, logger})=>{
    await ack();
    console.log(payload);
    try {
        const result = await client.views.open({
            trigger_id: body.trigger_id,
            view: await surveyModalJson(payload)
        });
        logger.info(result);
    } catch (error) {
        logger.error(error);
    }
};


exports.openSurveyModal = async ({ack, body, client, logger}) => {
    await ack();
    try {
        const result = await client.views.open({
            trigger_id: body.trigger_id,
            view: surveyModal(exports.SURVEY_MODAL_VIEW_NAME)
        });
        logger.info(result);
    } catch (error) {
        logger.error(error);
    }
};

exports.receiveSurvey = async ({ack, body, view, client, context, logger}) => {
    await ack({response_action: "clear"});

    const survey = new Survey();

    survey.surveyId = uuidv4();
    survey.postDate = new Date().toISOString().split('T')[0];

    // get user display name
    const profile = await client.users.profile.get({
        token: context.botToken,
        user: body["user"]["id"]
    });
    console.log(profile);
    survey.displayName = profile["profile"]["display_name"];
    survey.profileUrl = profile["profile"]["image_512"];

    // get survey content
    const blocks = view["state"]["values"];
    Object.keys(blocks).forEach(key => {
        switch (key) {
            case REPORT_YESTERDAY_ACTION:
                survey.reportYesterday = blocks[key][REPORT_YESTERDAY_ACTION]["value"];
                break;
            case REPORT_TODAY_ACTION:
                survey.reportToday = blocks[key][REPORT_TODAY_ACTION]["value"];
                break;
            case REPORT_IMPEDIMENT_ACTION:
                survey.reportImpediment = blocks[key][REPORT_IMPEDIMENT_ACTION]["value"];
                break;
            case REPORT_HEALTH_ACTION:
                survey.reportHealth = blocks[key][REPORT_HEALTH_ACTION]["selected_option"]["value"];
                break;
            default:
                break;
        }
    });

    // insert to db
    await insertTo("survey", survey.toDoc());

    // TEST
    console.log(await findFrom("survey"));
};
