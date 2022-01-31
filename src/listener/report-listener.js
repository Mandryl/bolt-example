const {surveyBlocks} = require("../blocks/survey");
const {surveyModal} = require("../blocks/survey-modal");
const {surveyCreateJson,surveyModalJson} = require("../blocks/surveyCreate.js");
const Report = require("../model/report-model");
const {insertTo,findFrom, settingOf} = require("../db-util");
const {v4: uuidv4} = require("uuid");
const {dailyScrumStart} = require("../blocks/daily-scrum-start");

const SURVEY_TABLE_NAME = "survey";
const SETTING_TABLE_NAME = "setting";

exports.getReportSurvey = (app) => {
    return async (req, res) => {
        const channelId = req.body["channel_id"];

        await app.client.chat.postMessage({
            token: app.client.token,
            channel: channelId,
            blocks: await surveyCreateJson()
        });

        const setting = settingOf(channelId);
        await app.client.chat.postEphemeral({
            token: app.client.token,
            channel: channelId,
            user: await setting.get("scrum_master_user_id"),
            text: "test",
            blocks: dailyScrumStart(channelId)
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

const receiveReport = async(surveyid) =>{
    const mtgid = uuidv4();

    // get channel
    const survey = await findFrom(SURVEY_TABLE_NAME, {survey_id: surveyid});
    if (survey.length > 2) {
        throw new Error(`There are more than 2 surveys(survey_id: ${surveyid})`);
    }else if (survey.length < 0){
        throw new Error(`There are more than 0 survey`);
    }
    else{
        let channel = survey["channel"]
    }

    // get reporters
    channel = survey["channel"]
    let reporters = []
    const date = new Date().toISOString().split('T')[0];
    const surveyreporters = await findFrom(SURVEY_TABLE_NAME, {post_date: survey["post_date"]});
    surveyreporters.forEach((elem,index)=>{
        reporters.append(elem["display_name"])
    })

    // get scrummaster
    const settingdata  = await findFrom(SETTING_TABLE_NAME, {channel_id: channelId});
    if (settingdata.length > 2) {
        throw new Error(`There are more than 2 settings(channel_id: ${channelId})`);
    }else if(settingdata.length < 0){
        throw new Error(`There are more than 0 setting)`);
    }else{
        scrummaster = settingdata[""]
    }

    // get reportUrl(未実装)
    let reporturl = ""
    // const settingdata  = await findFrom(JOB_TABLE_NAME, {channel_id: channelId, type: type});
    // if (settingdata.length > 2) {
    //     throw new Error(`There are more than 2 settings(channel_id: ${channelId}, type: ${type})`);
    // }else if(settingdata.length < 0){
    //     throw new Error(`There are more than 0 setting)`);
    // }else{
    //     scrummaster = settingdata[""]
    // }

    const report = new Report(mtgid,reporturl,channel,scrummaster,reporters);
    await insertTo(JOB_TABLE_NAME, report.toDoc());
}
