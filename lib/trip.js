var maps = require('@google/maps')
var config = require('dotenv').config();

var googleMapsClient = maps.createClient({
  key: process.env.GOOGLE_API_KEY
});

var tripPoints = [];

var generate_trip = function(coords, callback) {
    trip.generate_directions(coords, function(directions){
      callback(directions);
      //trip.generate_road(directions.tripPath, callback);  
    });
  };

var generate_directions = function(coords, callback) {
    console.log("generate_directions");
    googleMapsClient.directions(coords, function(err, response) {
      if (err) {
        console.log(err)
        return false; // Should also return err
      } else {
        var steps = response.json.routes[0].legs[0].steps;
        tripPoints = [];
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
        console.log(tripPoints);
        callback(tripPoints);
        return true;
      }
    });
  };

var generate_road = function(directions, callback) {
    console.log("generate_road");
    googleMaps.snapToRoads({path: directions, interpolate: true}, function(err, response) {
      if (err) {
        console.log(err)
        return false; // Should also return err
      } else {
        tripPoints = [];
        var steps = response.json.snappedPoints;
        console.log(steps);
        /*steps.forEach(function(step, index) {
          console.log(step);
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
        });*/
        callback(tripPoints);
        return true;
      }
    });
  }

trip = {

  tripPoints: tripPoints,
  
  // coords = {"origin": {"lat": 50.6045,"lng": 2.9086 }, "destination": {"lat": 50.6045,"lng": 2.9086 }}
  // callback = function to execute
  //
  // return [{"lat": 50.6045,"lng": 2.9086 }, {"lat": 50.6045,"lng": 2.9086 }, {"lat": 50.6045,"lng": 2.9086 }]
  generate_trip: generate_trip,

  generate_directions: generate_directions,

  generate_road: generate_road
};

module.exports = trip;
