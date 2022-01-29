exports.surveyBlocks = () => {
    return [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: "Daily Scrum Support",
                emoji: true
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "Jot down and share your progress !"
            }
        },
        {
            type: "actions",
            elements: [
                {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "Report",
                        emoji: true
                    },
                    value: "report",
                    action_id: "open_survey_modal"
                }
            ]
        }
    ]
};
