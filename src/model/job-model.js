const BaseModel = require("./base-model");

module.exports = class Job extends BaseModel {
    constructor(channelId, type, jobName, time) {
        super();

        this.channelId = channelId;
        this.type = type;
        this.jobName = jobName;
        this.time = time;
    }
};

module.exports = class JobRequest extends BaseModel {
    constructor(channelId) {
        super();

        this.channelId = channelId;
    }
};
