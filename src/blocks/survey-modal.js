exports.surveyModal = (callbackId) => {
    return {
        type: "modal",
        callback_id: callbackId,
        title: {
            type: "plain_text",
            text: "Daily Scrum Support",
            emoji: true
        },
        submit: {
            type: "plain_text",
            text: "Submit",
            emoji: true
        },
        close: {
            type: "plain_text",
            text: "Cancel",
            emoji: true
        },
        blocks: [
            {
                type: "section",
                text: {
                    type: "plain_text",
                    text: "Please fill out this form to report your progress. :pencil:",
                    emoji: true
                }
            },
            {
                type: "divider"
            },
            {
                type: "input",
                element: {
                    type: "plain_text_input",
                    multiline: true,
                    action_id: "plain_text_input-action"
                },
                label: {
                    type: "plain_text",
                    text: "1. What have you done since the last daily scrum?",
                    emoji: true
                }
            },
            {
                type: "input",
                element: {
                    type: "plain_text_input",
                    multiline: true,
                    action_id: "plain_text_input-action"
                },
                label: {
                    type: "plain_text",
                    text: "2. What do you plan to finish today?",
                    emoji: true
                }
            },
            {
                type: "input",
                element: {
                    type: "plain_text_input",
                    multiline: true,
                    action_id: "plain_text_input-action"
                },
                label: {
                    type: "plain_text",
                    text: "3. Are there any impediments to your progress?",
                    emoji: true
                }
            },
            {
                type: "divider"
            },
            {
                type: "input",
                element: {
                    type: "checkboxes",
                    options: [
                        {
                            text: {
                                type: "plain_text",
                                text: ":smile:",
                                emoji: true
                            },
                            value: "good"
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: ":slightly_smiling_face:",
                                emoji: true
                            },
                            value: "soso"
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: ":mask:",
                                emoji: true
                            },
                            value: "bad"
                        }
                    ]
                },
                label: {
                    type: "plain_text",
                    text: "Btw, how are you today?",
                    emoji: true
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "Thank you for sharing. See you later!:wave:"
                }
            }
        ]
    }
};
