const UserGroup = require("../model/user-group-model");
const {settingsModal, expandedSettingsModal} = require("../blocks/settings-modal");
const MessageMetadata = require("../model/message-metadata-model");
const Settings = require("../model/settings-model");
const {minutesAndSecondsToMsec} = require("../time-util");
const {settingOf} = require("../db-util");
const {upsertJob, ScheduleType} = require("../scheduler-util");
const {initialSettingsBlocks} = require("../blocks/initial-settings");

exports.SETTINGS_MODAL_VIEW_NAME = 'settings_modal';
const MEMBER_GROUP_ID_ACTION = "member_group_id";
const SCRUM_MASTER_USER_ID_ACTION = "scrum_master_user_id";
const REMINDER_TIME_ACTION = "reminder_time";
const REPORT_TIME_ACTION = "report_time";
const MEETING_DURATION_MSEC_ACTION = "meeting_duration";
const CALL_API_KEY_ACTION = "call_api_key";
const CALL_API_SECRET_ACTION = "call_api_secret";

exports.initializeSettings =async ({body, client, context}) => {
    if (body.event.user === context.botUserId) {
        await client.chat.postEphemeral({
            token: context.botToken,
            channel: body.event.channel,
            user: body.event.inviter,
            text: "",
            blocks: initialSettingsBlocks()
        });
    }
};

const prepareSettingsModal = async (body, client, context) => {
    // get user groups
    const response = await client.usergroups.list({
        token: context.botToken
    });
    const userGroups = response["usergroups"].map(({id, handle}) => {
        return new UserGroup(id, handle);
    });

    // get current settings
    // if channel id in body, get from body, else get from private_metadata
    let channelId;
    if ("channel_id" in body) {
        // from /dss_setting
        channelId = body["channel_id"];
    } else if ("view" in body && "private_metadata" in body["view"]) {
        // from expand_settings
        channelId = MessageMetadata.fromDoc(JSON.parse(body["view"]["private_metadata"])).channelId;
    } else {
        // from initial_settings
        channelId = body["channel"]["id"];
    }

    const settings = settingOf(channelId);
    let currentSettings = new Settings();
    try {
        const currentSettingsDoc = await settings.getAll();
        currentSettings = Settings.fromDoc(currentSettingsDoc);
    } catch (_) {  // if there are no settings, ignore error
    }

    // get channel id as metadata
    const metadata = new MessageMetadata(channelId);

    return [userGroups, currentSettings, metadata];
};

exports.openSettingsModal = async ({ack, body, client, context, logger}) => {
    await ack();

    const [userGroups, currentSettings, metadata] = await prepareSettingsModal(body, client, context);

    try {
        const result = await client.views.open({
            trigger_id: body.trigger_id,
            view: settingsModal(exports.SETTINGS_MODAL_VIEW_NAME, currentSettings, userGroups, metadata)
        });
        logger.info(result);
    } catch (error) {
        logger.error(error);
    }
};

exports.openExpandedSettingsModal = async ({ack, body, client, context, logger}) => {
    await ack();

    const [userGroups, currentSettings, metadata] = await prepareSettingsModal(body, client, context);

    try {
        const result = await client.views.update({
            view_id: body.view.id,
            hash: body.view.hash,
            view: expandedSettingsModal(exports.SETTINGS_MODAL_VIEW_NAME, currentSettings, userGroups, metadata)
        });
        logger.info(result);
    } catch (error) {
        logger.error(error);
    }
};

const saveSettings = async (body, view) => {
    const settings = new Settings();

    const blocks = view["state"]["values"];
    console.log(blocks[MEMBER_GROUP_ID_ACTION][MEMBER_GROUP_ID_ACTION]["selected_option"]);
    settings.reminderTime = blocks[REMINDER_TIME_ACTION][REMINDER_TIME_ACTION]["selected_time"];
    settings.reportTime = blocks[REPORT_TIME_ACTION][REPORT_TIME_ACTION]["selected_time"];
    settings.scrumMasterUserId = blocks[SCRUM_MASTER_USER_ID_ACTION][SCRUM_MASTER_USER_ID_ACTION]["selected_user"];
    settings.memberGroupId = blocks[MEMBER_GROUP_ID_ACTION][MEMBER_GROUP_ID_ACTION]["selected_option"]["value"];
    settings.memberGroupHandle = blocks[MEMBER_GROUP_ID_ACTION][MEMBER_GROUP_ID_ACTION]["selected_option"]["text"]["text"];
    const meetingDurationStr = blocks[MEETING_DURATION_MSEC_ACTION][MEETING_DURATION_MSEC_ACTION]["selected_time"];
    settings.meetingDurationMsec = minutesAndSecondsToMsec(meetingDurationStr);

    // set expand settings
    if (CALL_API_KEY_ACTION in blocks) {
        settings.callApiKey = blocks[CALL_API_KEY_ACTION][CALL_API_KEY_ACTION]["value"];
    }
    if (CALL_API_SECRET_ACTION in blocks) {
        settings.callApiSecret = blocks[CALL_API_SECRET_ACTION][CALL_API_SECRET_ACTION]["value"];
    }

    // get channelId in metadata
    const channelId = MessageMetadata.fromDoc(JSON.parse(body["view"]["private_metadata"])).channelId;
    const setting = settingOf(channelId);
    await setting.set(settings.toDoc());
};

const updateScheduler = async (body, view) => {
    const channelId = MessageMetadata.fromDoc(JSON.parse(body["view"]["private_metadata"])).channelId;

    const blocks = view["state"]["values"];
    const reminderTime = blocks[REMINDER_TIME_ACTION][REMINDER_TIME_ACTION]["selected_time"];
    await upsertJob(channelId, ScheduleType.survey, reminderTime);

    const reportTime = blocks[REPORT_TIME_ACTION][REPORT_TIME_ACTION]["selected_time"];
    await upsertJob(channelId, ScheduleType.report, reportTime);
};

exports.receiveSettings = async ({ack, body, view, logger}) => {
    await ack();

    await saveSettings(body, view);
    await updateScheduler(body, view);
};
