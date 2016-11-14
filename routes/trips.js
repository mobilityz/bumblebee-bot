var express = require('express');
var router = express.Router();
var trip = require('../lib/trip');

router.post('/', function(req, res, next) {
	var coords = { origin: req.body.startPoint, destination: req.body.endPoint };
	trip.generate_trip(coords, function(tripPath){
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({tripPath}), null, 2);
	});
});

module.exports = router;
