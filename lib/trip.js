var maps = require('@google/maps')
var config = require('dotenv').config();
var googleMapsClient = maps.createClient({
  key: process.env.GOOGLE_API_KEY
});



var tripPoints = [];

/**
 * Generate a trip with params
 *
 * @param {Object} params {bot: {}, origin: {}}
 * @param {Function} callback
 *
 * @return {Array} point {"lat": 50.60459528287801,"lng": 2.9086303710937496 }
 */
var generate_trip = function(bot, origin, callback) {
    var latLngs = bot.zone.properties.latLngs;
    var bbox = bot.zone.properties.bbox;
    if (origin === undefined) {
      var start_points = geometry.randomPointInPolygon(latLngs, bbox);
    } else {
      var start_points = origin
    }
    var end_points = geometry.randomPointInPolygon(latLngs, bbox);

    var coords = { origin: start_points, destination: end_points };
    trip.generate_directions(coords, function(directions){
      trip.generate_road(directions, callback);
    });
  };

var generate_directions = function(coords, callback) {
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
        callback(tripPoints);
        return true;
      }
    });
  };

var generate_road = function(directions, callback) {
    googleMapsClient.snapToRoads({path: directions, interpolate: true}, function(err, response) {
      if (err) {
        console.log(err)
        return false; // Should also return err
      } else {
        tripPoints = [];
        var steps = response.json.snappedPoints;
        steps.forEach(function(step, index) {
          var lat, lng;
          lat = step.location.latitude;
          lng = step.location.longitude;
          var stepLatLng = { lat: lat, lng: lng, placeId: step.placeId};
          tripPoints.push(stepLatLng);
        });
        callback(geometry.splitTripLoop(tripPoints));
        return true;
      }
    });
  }

trip = {

  tripPoints: tripPoints,

  /**
   * Generate a trip with params
   *
   * @param {Object} params {bot: {}, origin: {"lat": 50.6045,"lng": 2.9086 }}
   * @param {Function} callback
   *
   * @return {Array} points [{"lat": 50.6045,"lng": 2.9086 }, {"lat": 50.6045,"lng": 2.9086 }, {"lat": 50.6045,"lng": 2.9086 }]
   */
  generate_trip: generate_trip,

  generate_directions: generate_directions,

  generate_road: generate_road
};

module.exports = trip;
