const UserGroup = require("../model/user-group-model");
const {settingsModal} = require("../blocks/settings-modal");
const MessageMetadata = require("../model/message-metadata-model");
const Settings = require("../model/settings-model");
const {minutesAndSecondsToMsec} = require("../time-util");
const {settingOf} = require("../db-util");
const {upsertJob, ScheduleType} = require("../scheduler-util");

exports.SETTINGS_MODAL_VIEW_NAME = 'settings_modal';
const MEMBER_GROUP_ID_ACTION = "member_group_id";
const SCRUM_MASTER_USER_ID_ACTION = "scrum_master_user_id";
const REMINDER_TIME_ACTION = "reminder_time";
const REPORT_TIME_ACTION = "report_time";
const MEETING_DURATION_MSEC_ACTION = "meeting_duration";

exports.openSettingsModal = async ({ack, body, client, context, logger}) => {
    await ack();

    // create user groups
    const response = await client.usergroups.list({
        token: context.botToken
    });
    const userGroups = response["usergroups"].map(({id, handle}) => {
        return new UserGroup(id, handle);
    });

    const metadata = new MessageMetadata(body["channel_id"]);

    try {
        const result = await client.views.open({
            trigger_id: body.trigger_id,
            view: settingsModal(exports.SETTINGS_MODAL_VIEW_NAME, userGroups, metadata)
        });
        logger.info(result);
    } catch (error) {
        logger.error(error);
    }
};

const saveSettings = async (body, view) => {
    const settings = new Settings();

    const blocks = view["state"]["values"];
    settings.reminderTime = blocks[REMINDER_TIME_ACTION][REMINDER_TIME_ACTION]["selected_time"];
    settings.reportTime = blocks[REPORT_TIME_ACTION][REPORT_TIME_ACTION]["selected_time"];
    settings.scrumMasterUserId = blocks[SCRUM_MASTER_USER_ID_ACTION][SCRUM_MASTER_USER_ID_ACTION]["selected_user"];
    settings.memberGroupId = blocks[MEMBER_GROUP_ID_ACTION][MEMBER_GROUP_ID_ACTION]["selected_option"]["value"];
    const meetingDurationStr = blocks[MEETING_DURATION_MSEC_ACTION][MEETING_DURATION_MSEC_ACTION]["selected_time"];
    settings.meetingDurationMsec = minutesAndSecondsToMsec(meetingDurationStr);

    // get channelId in metadata
    const channelId = MessageMetadata.fromDoc(JSON.parse(body["view"]["private_metadata"])).channelId;
    const setting = settingOf(channelId);
    await setting.set(settings.toDoc());

    console.log(await setting.getAll());
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
