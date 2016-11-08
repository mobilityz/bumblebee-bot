var express = require('express');
var router = express.Router();
var googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_API_KEY
});

function generate_trip(startPoint, endPoint) {
  console.log("test");
  googleMapsClient.directions({
    origin: startPoint,
    destination: endPoint
    }, function(err, response) {
    if (err) {
      console.log(response.status);
    } else {
      console.log(response.status);
      var points = [];
      var steps = response.json["routes"]["legs"][0]["steps"];
      steps.forEach(function(step, index) {
        if (index == steps.length()){
          var stepLatLng = {lat: step["end_location"].lat, lng: step["end_location"].lng};
          points.push(stepLatLng);
        } else {
          var stepLatLng = {lat: step["start_location"].lat, lng: step["start_location"].lng};
          points.push(stepLatLng);
        }
      });
      console.log(points)
      return points;
    }
  });
}
/* GET bots listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  res.sendStatus(200);
});

router.post('/generate_trip', function(req, res, next) {
  console.log(req.body)
  console.log(req.is('application/json'));
  generate_trip(req.body.startPoint, req.body.endPoint)
  //res.sendStatus(200);
});

module.exports = router;
