exports.dailyScrumStart = (channelId) => {
    return [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: "Daily Scrum Supporter",
                emoji: true
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "Start daily scrum !"
            }
        },
        {
            type: "actions",
            block_id: channelId,
            elements: [
                {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "Start Daily Scrum",
                        emoji: true
                    },
                    value: "start_daily_scrum",
                    action_id: "start_daily_scrum",
                    style: "primary"
                }
            ]
        }
    ];
};
