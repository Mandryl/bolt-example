const {setMetadataToView} = require("../model/message-metadata-model");
const {msecToMinutesAndSeconds} = require("../time-util");

exports.settingsModal = (callbackId, currentSettings, groups, metadata) => {
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
                    initial_time: currentSettings.reminderTime ? currentSettings.reminderTime : "09:00",
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
                    initial_time: currentSettings.reportTime ? currentSettings.reportTime : "10:30",
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
                    initial_time: msecToMinutesAndSeconds(currentSettings.meetingDurationMsec ? currentSettings.meetingDurationMsec : "900000"),
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
                    initial_user: currentSettings.scrumMasterUserId,
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
                    initial_option: currentSettings.memberGroupHandle,
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
            },
            {
                type: "actions",
                block_id: "expand_settings",
                elements: [
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "Expand",
                            emoji: true
                        },
                        value: "expand_settings",
                        action_id: "expand_settings"
                    }
                ]
            }
        ]
    }
    setMetadataToView(modal, metadata);

    return modal;
};

exports.expandedSettingsModal = (callbackId, currentSettings, groups, metadata) => {
    const settingsView = exports.settingsModal(callbackId, currentSettings, groups, metadata);
    console.log(settingsView);
    // get settings blocks excluding expand button
    const settingsBlocks = settingsView.blocks.filter((block) => {
        return block.block_id !== "expand_settings";
    });
    const extraBlocks = [
        {
            type: "input",
            block_id: "call_api_key",
            element: {
                type: "plain_text_input",
                initial_value: currentSettings.callApiKey ? currentSettings.callApiKey : "",
                action_id: "call_api_key"
            },
            label: {
                type: "plain_text",
                text: "Zoom API key",
                emoji: true
            }
        },
        {
            type: "input",
            block_id: "call_api_secret",
            element: {
                type: "plain_text_input",
                initial_value: currentSettings.callApiKey ? currentSettings.callApiKey : "",
                action_id: "call_api_secret"
            },
            label: {
                type: "plain_text",
                text: "Zoom API secret",
                emoji: true
            }
        }
    ];
    settingsView.blocks = settingsBlocks.concat(extraBlocks);

    return settingsView;
};
