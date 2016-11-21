var express = require('express');
var kue = require('kue');
var Bot = require('../models/bot');

var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/destroy_jobs', (req, res, next) => {
  kue.Job.rangeByState('delayed', 0, 10000, 'asc', (err, jobs) => {
    jobs.forEach((job) => {
      job.remove(() => {});
    });
    res.send();
  });
});

router.post('/destroy_all_the_things', (req, res, next) => {
  ['Queued', 'Active', 'Failed', 'Complete', 'Delayed'].forEach((state) => {
    kue.Job.rangeByState(state, 0, 999999, 'asc', (err, jobs) => {
      jobs.forEach((job) => {
        job.remove((err) => {
          if (err) console.log(err);
        });
      });
    });
  });

  Bot.remove({})
  .then((result) => {
  })
  .catch((err) => {
    res.status(500).send(err);
  });
  res.send();
});

module.exports = router;
