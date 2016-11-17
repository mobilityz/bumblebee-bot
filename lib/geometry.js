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

  return { "lat": dlat, "lng": dlng }
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
  console.log(startPoint);
  console.log(endPoint);
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

geometry = {

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
  middlePoint: middlePoint,

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

  insidePolygon: insidePolygon

};

module.exports = geometry;



// Geometry test

// var startPoint = {"lat":50,"lng":2.90};
// var endPoint = {"lat":51,"lng":3.0};
// console.log(getDistance(startPoint,endPoint));
// console.log(getDistance(startPoint,middlePoint(startPoint,endPoint))*2);



