const {toSnakeObj, toCamelObj} = require("./model-util");

module.exports = class BaseModel {
    static fromDoc(json) {
        return Object.assign(this, toCamelObj(json));
    }

    toDoc() {
        return toSnakeObj(this);
    }
}
