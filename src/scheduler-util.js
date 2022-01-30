const scheduler = require("@google-cloud/scheduler");
const JobRequest = require("./model/job-model");
const {findFrom, insertTo, updateTo} = require("./db-util");
const Job = require("./model/job-model");
const {timeStrToCron} = require("./time-util");

const JOB_TABLE_NAME = "job";

module.exports.ScheduleType = {
    survey: "survey",
    report: "survey-report"
};

module.exports.upsertJob = async (channelId, type, time) => {
    const client = new scheduler.CloudSchedulerClient();

    const jobs = await findFrom(JOB_TABLE_NAME, {channel_id: channelId, type: type});
    if (jobs.length > 2) {
        throw new Error(`There are more than 2 jobs(channel_id: ${channelId}, type: ${type})`);
    }

    if (jobs.length < 1) {
        const parent = client.locationPath(process.env.GCP_PROJECT_ID, process.env.GCP_LOCATION_ID);

        // FIXME: Workaround for avoiding excessive billing
        // if number of jobs is more than 3, do not create a job
        const existsJobs = await client.listJobs({
            parent: parent
        });
        if (existsJobs[0].length >= 3) {
            throw new Error(`There are ${existsJobs[0].length} jobs in GCP`);
        }

        // create job
        const httpRequest = new JobRequest(channelId);
        const [response] = await client.createJob({
            parent: parent,
            job: {
                httpTarget: {
                    uri: `${process.env.SLACK_BOLT_URL}/${type}`,
                    httpMethod: "POST",
                    body: Buffer.from(JSON.stringify(httpRequest.toDoc())),
                    headers: {"Content-Type": "application/json"}
                },
                schedule: timeStrToCron(time),
                timeZone: "Asia/Tokyo"
            }
        });

        // insert job to db
        const job = new Job(channelId, type, response.name, time);
        await insertTo(JOB_TABLE_NAME, job.toDoc());
    } else {
        const jobDoc = jobs[0];
        if (jobDoc["time"] === time) {
            return;
        }

        // update job
        const jobPath = client.jobPath(process.env.GCP_PROJECT_ID, process.env.GCP_LOCATION_ID, jobDoc["job_name"]);
        const [response] = await client.updateJob({
            job: {
                name: jobPath,
                schedule: timeStrToCron(time)
            },
            updateMask: {
                paths: ["schedule"]
            }
        });
    }
};
