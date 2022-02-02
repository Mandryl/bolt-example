const {surveyBlocks} = require("../blocks/survey");
const {surveyModal} = require("../blocks/survey-modal");
const {surveyCreateJson,surveyModalJson} = require("../blocks/surveyCreate.js");
const Survey = require("../model/survey-model");
const {insertTo, settingOf} = require("../db-util");
const {v4: uuidv4} = require("uuid");
const MessageMetadata = require("../model/message-metadata-model");

exports.SURVEY_MODAL_VIEW_NAME = 'survey_modal';
const REPORT_YESTERDAY_ACTION = 'report_yesterday';
const REPORT_TODAY_ACTION = 'report_today';
const REPORT_IMPEDIMENT_ACTION = 'report_impediment';
const REPORT_HEALTH_ACTION = 'report_health';

exports.getSendSurvey = (app) => {
    return async (req, res) => {
        const channelId = req.body["channel_id"];
        const setting = settingOf(channelId);
        const memberGroupId = await setting.get("member_group_id");

        await app.client.chat.postMessage({
            token: app.client.token,
            channel: req.body["channel_id"],
            blocks: surveyBlocks(channelId, memberGroupId)
        });
        await res.status(200).send('OK');
    };
};

exports.openSurveyModal = async ({ack, body, client, logger}) => {
    await ack();
    try {
        const metadata = new MessageMetadata(body["container"]["channel_id"]);
        const result = await client.views.open({
            trigger_id: body.trigger_id,
            view: surveyModal(exports.SURVEY_MODAL_VIEW_NAME, metadata)
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

    // get channelId in metadata
    const metadata = MessageMetadata.fromDoc(JSON.parse(body["view"]["private_metadata"]));
    survey.channelId = metadata.channelId;

    // get user display name
    const userId = body["user"]["id"];
    const profile = await client.users.profile.get({
        token: context.botToken,
        user: userId
    });
    survey.userId = userId;
    survey.displayName = profile["profile"]["display_name"];
    survey.profileUrl = profile["profile"]["image_512"];

    // get survey content
    const blocks = view["state"]["values"];
    survey.reportYesterday = blocks[REPORT_YESTERDAY_ACTION][REPORT_YESTERDAY_ACTION]["value"];
    survey.reportToday = blocks[REPORT_TODAY_ACTION][REPORT_TODAY_ACTION]["value"];
    survey.reportImpediment = blocks[REPORT_IMPEDIMENT_ACTION][REPORT_IMPEDIMENT_ACTION]["value"];
    survey.reportHealth = blocks[REPORT_HEALTH_ACTION][REPORT_HEALTH_ACTION]["selected_option"]["value"];

    // insert to db
    await insertTo("survey", survey.toDoc());
};

