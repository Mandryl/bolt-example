module.exports.minutesAndSecondsToMsec = (minutesAndSeconds) => {
    const [min, sec] = minutesAndSeconds.split(":");
    return min * 60000 + sec * 1000;
};

module.exports.msecToMinutesAndSeconds = (msec) => {
    const min = Math.floor(msec / 60000);
    const sec = Math.floor((msec % 60000) / 1000);
    return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
};

module.exports.timeStrToCron = (str) => {
    const [hour, min] = str.split(":");
    return `${min} ${hour} * * 1-5`
};
