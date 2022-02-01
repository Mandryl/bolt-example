const BaseModel = require("./base-model");

module.exports = class Report extends BaseModel {
    constructor(mtgId, reportUrl, channelId,scrumMasterUserId, reporters,postdate) {
        super();
        this.mtgId = mtgId;
        this.channelId = channelId;
        this.reportUrl = reportUrl;
        this.scrumMasterUserId = scrumMasterUserId;
        this.reporters = reporters;
        this.postdate = postdate;
    }
}
