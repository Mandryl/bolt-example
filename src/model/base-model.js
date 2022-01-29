const {toSnakeObj} = require("./mode-util");

module.exports = class BaseModel {
    fromDoc(json) {
        return Object.assign(this, json);
    }

    toDoc() {
        return toSnakeObj(this);
    }
}
