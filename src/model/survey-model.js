const BaseModel = require("./base-model");

module.exports = class Survey extends BaseModel {
    constructor(surveyId, postDate, displayName, profileUrl, reportYesterday, reportToday, reportImpediment, reportHealth) {
        super();

        this.surveyId = surveyId;
        this.postDate = postDate;
        this.displayName = displayName;
        this.profileUrl = profileUrl;
        this.reportYesterday = reportYesterday;
        this.reportToday = reportToday;
        this.reportImpediment = reportImpediment;
        this.reportHealth = reportHealth;
    }
}
