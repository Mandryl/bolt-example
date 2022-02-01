const moment = require("moment");

const notifyTimes = (durationMsec) => {
  const duration = moment.duration(durationMsec);
  const durationMin = duration.asMinutes();
  if (durationMin <= 20) {
    return [half(durationMsec), before(durationMsec, 1)];
  } else if (durationMin <= 40) {
    return [
      half(durationMsec),
      before(durationMsec, 5),
      before(durationMsec, 1),
    ];
  } else {
    return [
      half(durationMsec),
      before(durationMsec, 10),
      before(durationMsec, 1),
    ];
  }
};

const half = (durationMsec) => {
  const halfTime = Math.floor(durationMsec / 2);
  const remain = moment.duration(halfTime).asMinutes();
  return {
    half: true,
    time: Math.floor(durationMsec / 2),
    remain: remain,
  };
};

const before = (durationMsec, beforeMinutes) => {
  const duration = moment.duration(durationMsec);
  const beforeDuration = moment.duration(beforeMinutes, "minutes");
  return {
    half: false,
    time: duration.subtract(beforeDuration).asMilliseconds(),
    remain: beforeMinutes,
  };
};

module.exports = notifyTimes;
