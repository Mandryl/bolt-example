const BaseModel = require("./base-model");

module.exports = class MessageMetadata extends BaseModel {
    constructor(channelId) {
        super();

        this.channelId = channelId;
    }
}

module.exports.setMetadataToView = (view, metadata) => {
    view["private_metadata"] = JSON.stringify(metadata.toDoc());
};
