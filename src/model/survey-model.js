const BaseModel = require("./base-model");

module.exports = class Survey extends BaseModel {
    constructor(surveyId, channelId, postDate, userId, displayName, profileUrl, reportYesterday, reportToday, reportImpediment, reportHealth) {
        super();

        this.surveyId = surveyId;
        this.channelId = channelId;
        this.postDate = postDate;
        this.userId = userId;
        this.displayName = displayName;
        this.profileUrl = profileUrl;
        this.reportYesterday = reportYesterday;
        this.reportToday = reportToday;
        this.reportImpediment = reportImpediment;
        this.reportHealth = reportHealth;
    }
}