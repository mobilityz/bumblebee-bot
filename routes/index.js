var express = require('express');
var kue = require('kue');
var Bot = require('../models/bot');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/destroy_jobs', function(req, res, next) {
  kue.Job.rangeByState('delayed', 0, 10000, 'asc', function( err, jobs ) {
    jobs.forEach(function(job) {
      job.remove(function() {});
    });
    res.send();
  });
});

router.post('/destroy_all_the_things', function(req, res, next) {
  var deleteJob = function(state) {
    kue.Job.rangeByState(state, 0, 999999, 'asc', function( err, jobs ) {
      jobs.forEach(function(job) {
        job.remove(function(err) {
          if (err) console.log(err);
        });
      });
    });
  }
  deleteJob('complete');
  deleteJob('delayed');
  Bot.remove({})
  .then(function(result) {
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
  res.send();
});

module.exports = router;
