const BaseModel = require("./base-model");

module.exports = class Settings extends BaseModel {
    constructor(mtgId, reportUrl, scrumMasterUserId, reporters) {
        super();
        this.mtgId = mtgId;
        this.channelId = channelId;
        this.reportUrl = reportUrl;
        this.scrumMasterUserId = scrumMasterUserId;
        this.reporters = reporters;
    }
}
