const dbUtil = require("../../db-util");
const zoom = require("../../zoom");

const message = require("./message");
const notify = require("./notify");
const chatUtil = require("./chat");

const listener = async ({ ack, client, body }) => {
  await ack();

  const channelID = body.channel_id;
  const setting = await dbUtil.settingOf(channelID).getAll();

  const meeting = zoom(setting);
  const msgUtil = message(setting);
  const chat = chatUtil(client, channelID);

  const meetingInfo = await meeting.createMeeting();

  const callAddRes = await client.calls.add({
    token: process.env.SLACK_BOT_TOKEN,
    external_unique_id: meetingInfo.id,
    join_url: meetingInfo.url,
  });

  const meetingMsg = msgUtil.meeting(callAddRes.call.id);
  await chat.post(meetingMsg.text, meetingMsg.blocks);

  const meetingDuration = setting.meeting_duration_msec;
  const notifyTimes = notify(meetingDuration);
  notifyTimes.forEach((nt) => {
    const notifyMsg = msgUtil.notify(nt.half, nt.remain);

    setTimeout(async () => {
      const post = await chat.post(notifyMsg);
      setTimeout(chat.delete, 5000, post.ts);
    }, nt.time);
  });

  setTimeout(() => {
    meeting.endMeeting(meetingInfo.id);
    client.calls.end({
      token: process.env.SLACK_BOT_TOKEN,
      id: callAddRes.call.id,
    });
  }, meetingDuration);
};

module.exports = listener;
