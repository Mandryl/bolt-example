const toCamel = (str) => {
    return str.split("_").map((word, index) => {
        if (index === 0) {
            return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');
};

exports.toCamelObj = (obj) => {
    const result = {};
    Object.keys(obj).forEach(key => {
        result[toCamel(key)] = obj[key];
    });
    return result;
};

const toSnake = (str) =>{
    return str.split(/(?=[A-Z])/).join('_').toLowerCase();
};

exports.toSnakeObj = (obj) => {
    const result = {};
    Object.keys(obj).forEach(key => {
        result[toSnake(key)] = obj[key];
    });
    return result;
};
