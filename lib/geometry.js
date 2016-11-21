//***************************************************//
//******************* Geometry **********************//
//***************************************************//

//-- Define radius function
var numberToRad = function(value) {
  return value * Math.PI / 180;
}

/**
 * Define distance between two points function
 *
 * @param {float} lat1
 * @param {float} lng1
 * @param {float} lat2
 * @param {float} lng2
 *
 * @return {float} distance
 */
var getDistance = function(startPoint, endPoint) {

  var R = 6371000; // meters
  //-- Latitude / Longitude differences

  var dLat = numberToRad(endPoint.lat - startPoint.lat);
  var dLng = numberToRad(endPoint.lng - endPoint.lng);

  //-- Convert to radians
  var lat1 = numberToRad(endPoint.lat);
  var lat2 = numberToRad(endPoint.lat);

  //-- Get distance
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2) * Math.sin(dLng/2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  var d = R * c;

  //-- Return result
  return d;
};

/**
 * Generate multiple random point inside a polygon
 *
 * @param polygon [{'lat':50.604,'lng':2.908}, {'lat':50.6043,'lng':2.90}, {'lat':50.60,'lng':2.9086}]
 * @param bbox {'_southWest':{'lat':50.60459528287801,'lng':2.9086303710937496},'_northEast':{'lat':50.66426095751329,'lng':3.1963348388671875}}
 *
 * @return points [{'lat': 50.60459528287801,'lng': 2.9086303710937496 }]
 */
var randomPointsInPolygon = function(polygon, bbox, nb_points) {
  var i = 0;
  var points = [];
  while (i < nb_points) {
    var point = randomPointInBbox(bbox);
    if (insidePolygon(point,polygon)) {
      i++;
      points.push(point);
    }
  }
  return points;
};

/**
 * Generate a random point inside a polygon
 *
 * @param {Array} polygon [{'lat':50.604,'lng':2.908}, {'lat':50.6043,'lng':2.90}, {'lat':50.60,'lng':2.9086}]
 * @param {Object} bbox {'_southWest':{'lat':50.60459528287801,'lng':2.9086303710937496},'_northEast':{'lat':50.66426095751329,'lng':3.1963348388671875}}
 *
 * @return {Object} point {'lat': 50.60459528287801,'lng': 2.9086303710937496 }
 */
var randomPointInPolygon = function(polygon, bbox) {
  var point = randomPointInBbox(bbox);
  while (!insidePolygon(point,polygon)) {
    point = randomPointInBbox(bbox);
  }
  return point;
};

var randomPointInBbox = function(bbox) {
  return { 'lat': Math.random() * (bbox._northEast.lat - bbox._southWest.lat) + bbox._southWest.lat, 'lng': Math.random() * (bbox._northEast.lng - bbox._southWest.lng) + bbox._southWest.lng }
};

var insidePolygon = function(point, polygon) {
  for(var c = false, i = -1, l = polygon.length, j = l - 1; ++i < l; j = i) {
      if(
          (
              (polygon[i].lng <= point.lng && point.lng < polygon[j].lng) ||
              (polygon[j].lng <= point.lng && point.lng < polygon[i].lng)
          ) &&
          (
              point.lat < (polygon[j].lat - polygon[i].lat) *
              (point.lng - polygon[i].lng) /
              (polygon[j].lng - polygon[i].lng) +
              polygon[i].lat
          )
      ) {
          c = !c;
      }
  }
  return c;
};

var splitTrip = function(steps, minimumDistance) {
  var finalSteps = [];

  for (var i = 0; i < steps.length - 1; i++) {
    finalSteps.push(steps[i]);

    if (getDistance(steps[i], steps[i+1]) > minimumDistance) {
      var interPoints = getIntermediatePoints(steps[i], steps[i+1], minimumDistance);
      finalSteps = finalSteps.concat(interPoints);
    }
  }
  finalSteps.push(steps[steps.length - 1])
  return finalSteps;
}

var getIntermediatePoints = function(firstPosition, secondPosition, distance) {
  var distancePoints = getDistance(firstPosition, secondPosition);
  var nbSteps = Math.trunc(distancePoints/distance);

  var lngArray = getSteps(firstPosition.lng, secondPosition.lng, nbSteps);
  var latArray = getSteps(firstPosition.lat, secondPosition.lat, nbSteps);

  var res = [];
  for (var i = 0; i <= nbSteps; i++) {
    res[i] = { lat: latArray[i], lng: lngArray[i] };
  }
  return res;
}

var getSteps = function(firstPosition, secondPosition, nbSteps) {
  var res = [];
  var interval = (secondPosition - firstPosition)/nbSteps;
  for (var i = 0; i <= nbSteps; i++) {
    res[i] = firstPosition + interval * i;
  }
  return res;
};

geometry = {

  /**
   * Define distance between two points function
   *
   * @param {Object} {'lat': lat, 'lng: lng'}
   * @param {Object} {'lat': lat, 'lng: lng'}
   *
   * @return {float} distance
   */
  getDistance: getDistance,

  /**
   * Generate multiple random point inside a polygon
   *
   * @param polygon [{'lat':50.604,'lng':2.908}, {'lat':50.6043,'lng':2.90}, {'lat':50.60,'lng':2.9086}]
   * @param bbox {'_southWest':{'lat':50.60459528287801,'lng':2.9086303710937496},'_northEast':{'lat':50.66426095751329,'lng':3.1963348388671875}}
   *
   * @return points [{'lat': 50.60459528287801,'lng': 2.9086303710937496 }]
   */
  randomPointsInPolygon: randomPointsInPolygon,

  /**
   * Generate a random point inside a polygon
   *
   * @param {Array} polygon [{'lat':50.604,'lng':2.908}, {'lat':50.6043,'lng':2.90}, {'lat':50.60,'lng':2.9086}]
   * @param {Object} bbox {'_southWest':{'lat':50.60459528287801,'lng':2.9086303710937496},'_northEast':{'lat':50.66426095751329,'lng':3.1963348388671875}}
   *
   * @return {Object} point {'lat': 50.60459528287801,'lng': 2.9086303710937496 }
   */
  randomPointInPolygon: randomPointInPolygon,

  randomPointInBbox: randomPointInBbox,

  insidePolygon: insidePolygon,

  splitTrip: splitTrip

};

module.exports = geometry;



// Geometry test

// var startPoint = {lat: 50, lng:2.90};
// var endPoint = {lat: 51, lng:3.0};

// console.log(getDistance(startPoint, endPoint));

// var tripPoints = [ { lat: 50.4755849,
//     lng: 2.8469608,
//     placeId: 'ChIJWdaRFNQx3UcRsKt0X5Jao8Y' },
//   { lat: 50.47820329999999,
//     lng: 2.8369014999999997,
//     placeId: 'ChIJkbj4Hysw3UcRvbXFBxHJdmM' },
//   { lat: 50.48412,
//     lng: 2.8576940000000004,
//     placeId: 'ChIJ86jwLiQu3UcRLELnnD-D-Tg' },
//   { lat: 50.4905019,
//     lng: 2.8963017000000004,
//     placeId: 'ChIJLSC2d-Mt3UcRgclYFZIEAwk' },
//   { lat: 50.4985398,
//     lng: 2.936785499999994,
//     placeId: 'ChIJD9iDSqAt3UcRkL6H-SWKNJk' },
//   { lat: 50.505055999999996,
//     lng: 2.9500230000000003,
//     placeId: 'ChIJf3Qhsg8t3UcRI9E7xIqDTmk' },
//   { lat: 50.505991599999994,
//     lng: 2.9704544999999993 }];

// console.log('tripPoints.length', tripPoints);
// console.log('split tripPoints.length', splitTrip(tripPoints, 20));
