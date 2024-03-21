// import * as cron from 'cron';
const cron = require('cron');

const schedule = (time, callback) => {
  const job = new cron.CronJob(time, callback);
  job.start();
};

module.exports = schedule;