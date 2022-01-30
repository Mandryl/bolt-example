const {setMetadataToView} = require("../model/message-metadata-model");

exports.settingsModal = (callbackId, groups, metadata) => {
    const groupSelectOptions = groups.map(group => {
        return {
            text: {
                type: "plain_text",
                text: group.displayName,
                emoji: true
            },
            value: group.groupId
        };
    });

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
            text: "Save",
            emoji: true
        },
        close: {
            type: "plain_text",
            text: "Cancel",
            emoji: true
        },
        blocks: [
            {
                block_id: "reminder_time",
                type: "input",
                element: {
                    type: "timepicker",
                    initial_time: "09:00",
                    placeholder: {
                        type: "plain_text",
                        text: "Select time",
                        emoji: true
                    },
                    action_id: "reminder_time"
                },
                label: {
                    type: "plain_text",
                    text: "Remind you to submit your report at",
                    emoji: true
                }
            },
            {
                block_id: "report_time",
                type: "input",
                element: {
                    type: "timepicker",
                    initial_time: "10:30",
                    placeholder: {
                        type: "plain_text",
                        text: "Select time",
                        emoji: true
                    },
                    action_id: "report_time"
                },
                label: {
                    type: "plain_text",
                    text: "You need to submit your report by",
                    emoji: true
                }
            },
            {
                block_id: "meeting_duration",
                type: "input",
                element: {
                    type: "timepicker",
                    initial_time: "15:00",
                    placeholder: {
                        type: "plain_text",
                        text: "Set duration",
                        emoji: true
                    },
                    action_id: "meeting_duration"
                },
                label: {
                    type: "plain_text",
                    text: "The daily scrum duration (MM:SS)",
                    emoji: true
                }
            },
            {
                block_id: "scrum_master_user_id",
                type: "input",
                element: {
                    type: "users_select",
                    action_id: "scrum_master_user_id",
                    placeholder: {
                        type: "plain_text",
                        text: "Who is Scrum Master?"
                    }
                },
                label: {
                    type: "plain_text",
                    text: "Scrum Master"
                }
            },
            {
                block_id: "member_group_id",
                type: "input",
                element: {
                    type: "static_select",
                    placeholder: {
                        type: "plain_text",
                        text: "Which group do you want to mention?",
                        emoji: true
                    },
                    options: groupSelectOptions,
                    action_id: "member_group_id"
                },
                label: {
                    type: "plain_text",
                    text: "User group",
                    emoji: true
                }
            }
        ]
    }
    setMetadataToView(modal, metadata);

    return modal;
};
