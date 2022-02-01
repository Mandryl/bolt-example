const message = (setting) => {
  if (setting) {
    return {
      meeting: (callID) => {
        const meeingMentionStr = meetingMention(setting);
        const timeStr = timeFormat();
        const messageStr = `${meeingMentionStr}Daily Scrum Meeting of ${timeStr}`;
        return {
          text: messageStr,
          blocks: [textSection(messageStr), callSection(callID)],
        };
      },
      notify: (half, remain) => {
        const notifyMentionStr = notifyMention(setting);
        if (half) {
          return `${notifyMentionStr}This meeting was halfway through.`;
        } else {
          return `${notifyMentionStr}We have just ${remain} minutes left.`;
        }
      },
    };
  } else {
    return null;
  }
};

const textSection = (text) => {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: text,
    },
  };
};

const callSection = (callID) => {
  return {
    type: "call",
    call_id: callID,
  };
};

const meetingMention = (setting) => {
  if (setting.member_group_id) {
    return `<!subteam^${setting.member_group_id}> `;
  } else {
    return "<!here> ";
  }
};

const timeFormat = () => {
  const time = new Date().getTime();
  return `<!date^${Math.floor(time / 1000)}^{date_num}|Today>`;
};

const notifyMention = (setting) => {
  if (setting.member_group_id) {
    return `<!subteam^${setting.member_group_id}> `;
  } else if (setting.scrum_master_user_id) {
    return `<@${setting.scrum_master_user_id}> `;
  } else {
    return "<!here> ";
  }
};

module.exports = message;
