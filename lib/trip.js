var maps = require('@google/maps')
var config = require('dotenv').config();

var googleMapsClient = maps.createClient({
  key: process.env.GOOGLE_API_KEY
});

trip = {

  generate_trip: function(coords, callback) {
    var tripPoints = []
    googleMapsClient.directions(coords, function(err, response) {
      if (err) {
        console.log(err)
        return false; // Should also return err
      } else {
        var steps = response.json.routes[0].legs[0].steps;
        steps.forEach(function(step, index) {
          var lat, lng;
          if (index == steps.length) {
            lat = step.end_location.lat;
            lng = step.end_location.lng;
          } else {
            lat = step.start_location.lat;
            lng = step.start_location.lng;
          }
          var stepLatLng = { lat: lat, lng: lng };
          tripPoints.push(stepLatLng);
        });
        callback(tripPoints);
        return true;
      }
    });
  }
};

module.exports = trip;
