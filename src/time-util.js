module.exports.minutesAndSecondsToMsec = (minutesAndSeconds) => {
    const [min, sec] = minutesAndSeconds.split(":");
    return min * 60000 + sec * 1000;
};

module.exports.timeStrToCron = (str) => {
    const [hour, min] = str.split(":");
    return `${min} ${hour} * * 1-5`
};
