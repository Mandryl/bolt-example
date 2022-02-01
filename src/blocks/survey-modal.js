const {setMetadataToView} = require("../model/message-metadata-model");
exports.surveyModal = (callbackId, metadata) => {
    const modal = {
        type: "modal",
        callback_id: callbackId,
        title: {
            type: "plain_text",
            text: "Daily Scrum Supporter",
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
                block_id: "report_yesterday",
                type: "input",
                element: {
                    type: "plain_text_input",
                    multiline: true,
                    action_id: "report_yesterday"
                },
                label: {
                    type: "plain_text",
                    text: "1. What have you done since the last daily scrum?",
                    emoji: true
                }
            },
            {
                block_id: "report_today",
                type: "input",
                element: {
                    type: "plain_text_input",
                    multiline: true,
                    action_id: "report_today"
                },
                label: {
                    type: "plain_text",
                    text: "2. What do you plan to finish today?",
                    emoji: true
                }
            },
            {
                block_id: "report_impediment",
                type: "input",
                element: {
                    type: "plain_text_input",
                    multiline: true,
                    action_id: "report_impediment"
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
                block_id: "report_health",
                type: "input",
                element: {
                    type: "radio_buttons",
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
                    ],
                    "action_id": "report_health"
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
    setMetadataToView(modal, metadata);

    return modal;
};
