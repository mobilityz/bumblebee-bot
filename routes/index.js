var express = require('express');
var kue = require('kue');

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

module.exports = router;
