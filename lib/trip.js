var maps = require('@google/maps')
var config = require('dotenv').config();

var googleMapsClient = maps.createClient({
  key: process.env.GOOGLE_API_KEY
});

trip = {};

trip.generate_trip = function(startPoint, endPoint) {
  var coords = { origin: startPoint, destination: endPoint };

  googleMapsClient.directions(coords, function(err, response) {
    if (err) {
      return false; // Should also return err
    } else {
      var points = [];
      var steps = response.json["routes"]["legs"][0]["steps"];
      steps.forEach(function(step, index) {
        var lat, lng;
        if (index == steps.length()) {
          lat = step["end_location"].lat;
          lng = step["end_location"].lng;
        } else {
          lat = step["start_location"].lat;
          lng = step["start_location"].lng;
        }
        var stepLatLng = { lat: lat, lng: lng };
        points.push(stepLatLng);
      });
      return points;
    }
  });
}

module.exports = trip;
