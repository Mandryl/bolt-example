const BaseModel = require("./base-model");

module.exports = class Settings extends BaseModel {
    constructor(channelId, memberGroupId, scrumMasterUserId, reminderTime, reportTime, meetingDurationMsec, callApiKey, callApiSecret) {
        super();

        this.channelId = channelId;
        this.memberGroupId = memberGroupId;
        this.scrumMasterUserId = scrumMasterUserId;
        this.reminderTime = reminderTime;
        this.reportTime = reportTime;
        this.meetingDurationMsec = meetingDurationMsec;
        this.callApiKey = callApiKey;
        this.callApiSecret = callApiSecret;
    }
}
