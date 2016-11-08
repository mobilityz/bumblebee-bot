var express = require('express');
var router = express.Router();
var googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_API_KEY
});
var bot = require('../models/bot');

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
  bot.find({})
  .then(function(bots) {
    res.send(bots);
  })
  .catch(function(err) {
    res.status(500).err(err);
  });
});

router.post('/', function(req, res, next) {
  var newBot = bot(req.body);

  newBot.save()
  .then(function(bot) {
    res.send(bot);
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
});

router.put('/:id', function(req, res, next) {
  bot.update({_id: req.params.id}, req.body)
  .then(function(result) {
    res.send();
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
});

router.delete('/:id', function(req, res, next) {
  bot.remove({ _id: req.params.id })
  .then(function(result) {
    res.send();
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
});

router.post('/generate_trip', function(req, res, next) {
  console.log(req.body)
  console.log(req.is('application/json'));
  generate_trip(req.body.startPoint, req.body.endPoint)
  //res.sendStatus(200);
});

module.exports = router;
