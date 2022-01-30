const BaseModel = require("./base-model");

module.exports = class UserGroup extends BaseModel {
    constructor(groupId, displayName) {
        super();

        this.groupId = groupId;
        this.displayName = displayName;
    }
}
