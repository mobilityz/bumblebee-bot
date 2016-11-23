var maps = require('@google/maps');
var polylineLib = require('polyline');
var config = require('dotenv').config();
var googleMapsClient = maps.createClient({
  key: process.env.GOOGLE_API_KEY
});

var geometry = require('./geometry');

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
  generate_directions(coords, function(directions) {
    // generate_road(directions, callback);
    // var steps = geometry.splitTrip(directions, 40);
    directions.forEach(function(step, index) {
      if(index != 0) {
        var brng = geometry.calcBearing(step, directions[index-1]);
      } else {
        var brng = 0;
      }
      step.brng = brng;
    });
    callback(directions);
  });
};

var generate_directions = function(coords, callback) {
  googleMapsClient.directions(coords, function(err, response) {
    if (err) {
      console.log(err)
      return false; // Should also return err
    } else {
      var encodePolyline = response.json.routes[0].overview_polyline.points;
      var polyline = polylineLib.decode(encodePolyline);
      tripPoints = [];
      polyline.forEach(function(step) {
        var stepLatLng = { lat: step[0], lng: step[1] };
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
      callback(tripPoints);
      return true;
    }
  });
};

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
