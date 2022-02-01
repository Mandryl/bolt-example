# Daily Scrum Supporter (DSS)

## Overview

DSS is a Slack App and focuses on managing daily scrums.

There are three features :

1. Sending survey forms
2. Publishing reports
3. Holding daily scrum meetings with keeping time

### **Sending survey forms**

DSS sends simple forms to team members. They can write down their progresses, plans, and troubles in this form.  

### **Publishing reports**

Once all team members have completed their surveys (or the set time comes,) the report including all members' forms is published. It would be used in a daily scrum meeting or for checking progress anytime.  

### **Holding daily scrum meetings with keeping time**

Once Scrum Master starts a meeting, DSS counts 15 minutes (by default, the duration is set to 15 minutes, but you can change it). The duration has passed, where upon the meeting is ended by DSS.

## Demo

Please see this youtube video.

[![youtube_thumbnail](https://img.youtube.com/vi/VNw8h-sL9vc/0.jpg)](https://www.youtube.com/watch?v=VNw8h-sL9vc)

## Install

### Bolt

[Bolt](https://github.com/slackapi/bolt-js) is used in the backend of the Slack App and requires the Bot User OAuth Access Token and Signing Secret for the Slack App.

Please refer to [Bolt's start guide](https://slack.dev/bolt-js/tutorial/getting-started) for information on how to obtain these.

After obtaining the two values, set the environment variables as follows.

```shell
export SLACK_BOT_TOKEN=xoxb-<your-bot-token>
export SLACK_SIGNING_SECRET=<your-signing-secret>
```

### Google Cloud Platform

This app use [Google Cloud Scheduler](https://cloud.google.com/scheduler) for scheduling sending some messages.

You need to set up Google Cloud Platform credentials.

Set an environment variable as following.
(See [the official documentation](https://cloud.google.com/docs/authentication/production) for details.)

```shell
export GOOGLE_APPLICATION_CREDENTIALS=authentication.json
```

And, you need to configure Google Cloud Scheduler instances information.

Set an environment variable as following. `GCP_LACATION_ID` is such as asia-northeast1.

```shell
export GCP_PROJECT_ID=your-project-id
export GCP_LOCATION_ID=your-location
```

### dotenv

In addition, [dotenv](https://github.com/motdotla/dotenv) is used in the backend.

You can also set environment variables by adding a .env file directly under the `/src` folder.

## Usage

After installing the app in your workspace, add it to the channels you want to use as well.

For more information, please refer to the following document

[Add apps to your Slack workspace](https://slack.com/help/articles/202035138-Add-apps-to-your-Slack-workspace)

[Adding your bot user to your Slack channel](https://www.ibm.com/docs/en/z-chatops/1.1.0?topic=slack-adding-your-bot-user-your-channel)

### Settings

When you install this app in a channel, you need to configure it.

* Remind you to submit your report at: Time of sending survey in the channel every day.  
* You need to submit your report by: Time of sending report in the channel every day.
* The daily scrum duration (MM:SS): Duration of daily scrum.  
* Scrum Master: User of scrum master in the channel.
* User group: User group for mentions in some messages.

### Extra settings

If you want to set up extra settings, you need to tap "Expand" button and configure it.  

* Zoom API Key: API key for Zoom meetings as daily scrum.
* Zoom API Secret: API secret for Zoom meetings as daily scrum.

For more information on how to get API key and API secret, please refer to [here](https://marketplace.zoom.us/docs/guides/build/jwt-app#generate-app-credentials).

### Additional information about the setting values

#### [Duration of daily scrum]

If not set, 15 minutes will be used as the default value.

#### [Notification of the start of Daily Scrum Meeting]

If the group name is not set, the notification will be sent by @here.

#### [Notification of remaining time for Daily Scrume Meeting]

If the group name is not set, the notification will be sent to the scrum master by @(scrum-master-usename).

If the scrum master is not registered, it will be notified by @here.

#### [Zoom API key and API secret]

You can also set it in `Process.env.ZOOM_API_KEY`, but this setting takes precedence.
