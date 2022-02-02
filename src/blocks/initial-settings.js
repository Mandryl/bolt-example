exports.initialSettingsBlocks = (channelId) => {
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
                text: "Please configure app in this channel !"
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
                        text: "Configuration :gear:",
                        emoji: true
                    },
                    value: "report",
                    action_id: "initial_settings"
                }
            ]
        }
    ]
};
