//***************************************************//
//******************* Geometry **********************//
//***************************************************//

//-- Define radius function
if (typeof (Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function () {
    return this * Math.PI / 180;
  }
}

//-- Define degrees function
if (typeof (Number.prototype.toDeg) === "undefined") {
  Number.prototype.toDeg = function () {
    return this * (180 / Math.PI);
  }
}

/**
 * Define middle point
 *
 * @param {float} lat1
 * @param {float} lng1
 * @param {float} lat2
 * @param {float} lng2
 *
 * @return point [50.60459528287801,2.9086303710937496]
 */
var middlePoint = function(startPoint, endPoint) {

  //-- Longitude difference
  // var dLng = (endPoint.lng - startPoint.lng).toRad();

  //-- Convert to radians
  // lat1 = endPoint.lat.toRad();
  // lat2 = endPoint.lat.toRad();
  // lng1 = endPoint.lng.toRad();

  // var bX = Math.cos(lat2) * Math.cos(dLng);
  // var bY = Math.cos(lat2) * Math.sin(dLng);
  // var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
  // var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

  //-- Return result
  // return {"lng": lng3.toDeg(), "lat": lat3.toDeg()};
  var dlng = (startPoint.lng + endPoint.lng)/2
  var dlat = (startPoint.lat + endPoint.lat)/2

  return { lat: dlat, lng: dlng };
};

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
var getDistance = function(startPoint,endPoint) {

  var R = 6371000; // meters
  //-- Latitude / Longitude differences
  var dLat = (endPoint.lat-startPoint.lat).toRad();
  var dLng = (endPoint.lng-endPoint.lng).toRad();
  //-- Convert to radians
  var lat1 = (endPoint.lat).toRad();
  var lat2 = (endPoint.lat).toRad();

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
 * @param polygon [{"lat":50.604,"lng":2.908}, {"lat":50.6043,"lng":2.90}, {"lat":50.60,"lng":2.9086}]
 * @param bbox {"_southWest":{"lat":50.60459528287801,"lng":2.9086303710937496},"_northEast":{"lat":50.66426095751329,"lng":3.1963348388671875}}
 *
 * @return points [{"lat": 50.60459528287801,"lng": 2.9086303710937496 }]
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
 * @param {Array} polygon [{"lat":50.604,"lng":2.908}, {"lat":50.6043,"lng":2.90}, {"lat":50.60,"lng":2.9086}]
 * @param {Object} bbox {"_southWest":{"lat":50.60459528287801,"lng":2.9086303710937496},"_northEast":{"lat":50.66426095751329,"lng":3.1963348388671875}}
 *
 * @return {Object} point {"lat": 50.60459528287801,"lng": 2.9086303710937496 }
 */
var randomPointInPolygon = function(polygon, bbox) {
  var point = randomPointInBbox(bbox);
  while (!insidePolygon(point,polygon)) {
    point = randomPointInBbox(bbox);
  }
  return point;
};

var randomPointInBbox = function(bbox) {
  return { "lat": Math.random() * (bbox._northEast.lat - bbox._southWest.lat) + bbox._southWest.lat, "lng": Math.random() * (bbox._northEast.lng - bbox._southWest.lng) + bbox._southWest.lng }
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

var splitTrip = function(tripPoints, minimumDistance) {

  console.log(tripPoints.length + "  points");
  console.log(minimumDistance + "  m maximum");

  var numPoints = tripPoints.length - 1;
  var indexes = [];

    for (var i = 0; i < numPoints; i++) {
      if (getDistance(tripPoints[i],tripPoints[i+1]) > minimumDistance) {
        indexes.push(i+1);
      }
    }
    console.log(indexes);
    indexes.forEach(function(index) {
      tripPoints.splice(index, 0, middlePoint(tripPoints[index-1],tripPoints[index]));
    });

  console.log(tripPoints.length);
  return tripPoints;
};

var splitTripLoop = function(tripPoints, minimumDistance) {

  var points = tripPoints;
  var newPoints = splitTrip(points, minimumDistance);

  do {
    points = newPoints;
    newPoints = splitTrip(newPoints, minimumDistance);
  } while (points.length < newPoints.length);

  console.log(newPoints.length);
  return newPoints;
};


geometry = {

  /**
   * Define middle point
   *
   * @param {Object} {"lat": lat, "lng: lng"}
   * @param {Object} {"lat": lat, "lng: lng"}
   *
   * @return {Object} {"lat": lat, "lng: lng"}
   */
  middlePoint: middlePoint,

  /**
   * Define distance between two points function
   *
   * @param {Object} {"lat": lat, "lng: lng"}
   * @param {Object} {"lat": lat, "lng: lng"}
   *
   * @return {float} distance
   */
  getDistance: getDistance,

  /**
   * Generate multiple random point inside a polygon
   *
   * @param polygon [{"lat":50.604,"lng":2.908}, {"lat":50.6043,"lng":2.90}, {"lat":50.60,"lng":2.9086}]
   * @param bbox {"_southWest":{"lat":50.60459528287801,"lng":2.9086303710937496},"_northEast":{"lat":50.66426095751329,"lng":3.1963348388671875}}
   *
   * @return points [{"lat": 50.60459528287801,"lng": 2.9086303710937496 }]
   */
  randomPointsInPolygon: randomPointsInPolygon,

  /**
   * Generate a random point inside a polygon
   *
   * @param {Array} polygon [{"lat":50.604,"lng":2.908}, {"lat":50.6043,"lng":2.90}, {"lat":50.60,"lng":2.9086}]
   * @param {Object} bbox {"_southWest":{"lat":50.60459528287801,"lng":2.9086303710937496},"_northEast":{"lat":50.66426095751329,"lng":3.1963348388671875}}
   *
   * @return {Object} point {"lat": 50.60459528287801,"lng": 2.9086303710937496 }
   */
  randomPointInPolygon: randomPointInPolygon,

  randomPointInBbox: randomPointInBbox,

  insidePolygon: insidePolygon,

  splitTripLoop: splitTripLoop

};

module.exports = geometry;



// Geometry test

// var startPoint = {"lat":50,"lng":2.90};
// var endPoint = {"lat":51,"lng":3.0};
// console.log(getDistance(startPoint,endPoint));
// console.log(getDistance(startPoint,middlePoint(startPoint,endPoint))*2);
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
//     lng: 2.9704544999999993,
//     placeId: 'ChIJMdlbZRct3UcR9IlTOvTPH4o' },
//   { lat: 50.523089399999996,
//     lng: 3.000387,
//     placeId: 'ChIJW_SzFS_TwkcR1pZ8RM5KeoU' },
//   { lat: 50.5098036,
//     lng: 3.0163886999999994,
//     placeId: 'ChIJ7YEZ4ObSwkcRK3mqvymg1kk' },
//   { lat: 50.498633399999996,
//     lng: 3.0289577999999997,
//     placeId: 'ChIJCVSwlvPSwkcR-agVBJlzX9w' },
//   { lat: 50.498589300000006,
//     lng: 3.0288766000000003,
//     placeId: 'ChIJCVSwlvPSwkcR-agVBJlzX9w' },
//   { lat: 50.498553400000006,
//     lng: 3.0288201999999997,
//     placeId: 'ChIJCVSwlvPSwkcR-agVBJlzX9w' },
//   { lat: 50.4985162,
//     lng: 3.0287669999999998,
//     placeId: 'ChIJCVSwlvPSwkcR-agVBJlzX9w' },
//   { lat: 50.498302699999996,
//     lng: 3.0284917,
//     placeId: 'ChIJCVSwlvPSwkcR-agVBJlzX9w' },
//   { lat: 50.498302699999996,
//     lng: 3.0284917,
//     placeId: 'ChIJvalSovPSwkcRu9ywZ8bLeIo' },
//   { lat: 50.498043,
//     lng: 3.028209,
//     placeId: 'ChIJvalSovPSwkcRu9ywZ8bLeIo' },
//   { lat: 50.497710999999995,
//     lng: 3.027806,
//     placeId: 'ChIJvalSovPSwkcRu9ywZ8bLeIo' },
//   { lat: 50.497710999999995,
//     lng: 3.027806,
//     placeId: 'ChIJn1AMCPPSwkcRu6aqXPE_rz0' },
//   { lat: 50.49730399999999,
//     lng: 3.027316,
//     placeId: 'ChIJn1AMCPPSwkcRu6aqXPE_rz0' },
//   { lat: 50.49730399999999,
//     lng: 3.027316,
//     placeId: 'ChIJU9M-HfPSwkcRL6zSfaA2TM8' },
//   { lat: 50.496472000000004,
//     lng: 3.026317,
//     placeId: 'ChIJU9M-HfPSwkcRL6zSfaA2TM8' },
//   { lat: 50.496472000000004,
//     lng: 3.026317,
//     placeId: 'ChIJzdMh6PLSwkcRYG0mgzi6X60' },
//   { lat: 50.496424,
//     lng: 3.02628,
//     placeId: 'ChIJzdMh6PLSwkcRYG0mgzi6X60' },
//   { lat: 50.496363,
//     lng: 3.026218,
//     placeId: 'ChIJzdMh6PLSwkcRYG0mgzi6X60' },
//   { lat: 50.496306000000004,
//     lng: 3.026119,
//     placeId: 'ChIJzdMh6PLSwkcRYG0mgzi6X60' },
//   { lat: 50.4962692,
//     lng: 3.0260179999999997,
//     placeId: 'ChIJzdMh6PLSwkcRYG0mgzi6X60' },
//   { lat: 50.496252999999996,
//     lng: 3.025897,
//     placeId: 'ChIJzdMh6PLSwkcRYG0mgzi6X60' },
//   { lat: 50.496243,
//     lng: 3.025654,
//     placeId: 'ChIJzdMh6PLSwkcRYG0mgzi6X60' },
//   { lat: 50.496241,
//     lng: 3.0255328999999995,
//     placeId: 'ChIJzdMh6PLSwkcRYG0mgzi6X60' },
//   { lat: 50.496206,
//     lng: 3.0252849,
//     placeId: 'ChIJzdMh6PLSwkcRYG0mgzi6X60' },
//   { lat: 50.496206,
//     lng: 3.0252849,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.496094,
//     lng: 3.02534,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.495746999999994,
//     lng: 3.0254209999999992,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.495644,
//     lng: 3.0254629,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.495408999999995,
//     lng: 3.025518,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.495200999999994,
//     lng: 3.025671,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.495048,
//     lng: 3.0257469999999995,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.494794,
//     lng: 3.025813,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.494746899999996,
//     lng: 3.0258430000000005,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.494658,
//     lng: 3.0259199999999993,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.494578,
//     lng: 3.026047,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.494371,
//     lng: 3.0262800000000003,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.494322999999994,
//     lng: 3.0262349,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.494251999999996,
//     lng: 3.0261860000000005,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.494121,
//     lng: 3.0260379000000004,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.493987,
//     lng: 3.0257369999999995,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.493941899999996,
//     lng: 3.0255199999999998,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.493934,
//     lng: 3.0254350000000003,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' },
//   { lat: 50.493925999999995,
//     lng: 3.0251179999999995,
//     placeId: 'ChIJdf1OzfLSwkcRXIWvZIeFQ5s' } ];

// splitTripLoop(tripPoints, 20);
