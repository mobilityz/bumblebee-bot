var express = require('express');
var router = express.Router();
var trip = require('../lib/trip')

router.post('/', function(req, res, next) {
  var trip_path = trip.generate_trip(req.body.startPoint, req.body.endPoint);
  res.send(trip_path);
});

module.exports = router;
