//***************************************************
//******************* Geometry **********************
//***************************************************

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

  var middlePoint = function(lat1, lng1, lat2, lng2) {

    //-- Longitude difference
    var dLng = (lng2 - lng1).toRad();

    //-- Convert to radians
    lat1 = lat1.toRad();
    lat2 = lat2.toRad();
    lng1 = lng1.toRad();

    var bX = Math.cos(lat2) * Math.cos(dLng);
    var bY = Math.cos(lat2) * Math.sin(dLng);
    var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
    var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

    //-- Return result
    return [lng3.toDeg(), lat3.toDeg()];
  };

  //-- Define distance between two points function
  var getDistance = function(lat1, lng1, lat2, lng2) {

    var R = 6371000; // meters

      //-- Latitude / Longitude differences
    var dLat = this.toRad(lat2-lat1);
    var dLng = this.toRad(lng2-lng1);

      //-- Convert to radians
    var lat1 = this.toRad(lat1);
    var lat2 = this.toRad(lat2);

    //-- Get distance
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2) * Math.sin(dLng/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;

    //-- Return result
    return d;
  };

  // polygon [{"lat":50.604,"lng":2.908}, {"lat":50.6043,"lng":2.90}, {"lat":50.60,"lng":2.9086}]
  // bbox {"_southWest":{"lat":50.60459528287801,"lng":2.9086303710937496},"_northEast":{"lat":50.66426095751329,"lng":3.1963348388671875}}
  // point {"lat": 50.60459528287801,"lng": 2.9086303710937496 }

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

  //-- Define middle point function
  middlePoint: middlePoint,

  //-- Define distance between two points function
   getDistance: getDistance,

  // polygon [{"lat":50.604,"lng":2.908}, {"lat":50.6043,"lng":2.90}, {"lat":50.60,"lng":2.9086}]
  // bbox {"_southWest":{"lat":50.60459528287801,"lng":2.9086303710937496},"_northEast":{"lat":50.66426095751329,"lng":3.1963348388671875}}
  // point {"lat": 50.60459528287801,"lng": 2.9086303710937496 }

  randomPointsInPolygon: randomPointsInPolygon,

  randomPointInBbox: randomPointInBbox,

  insidePolygon: insidePolygon

};

module.exports = geometry;










