var googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_API_KEY,
  //clientId: process.env.GOOGLE_API_CLIENT_ID,
  //clientSecret: process.env.GOOGLE_API_CLIENT_SECRET,
});
const https = require('https');
var map = require('google_directions');
 


module.exports = function generate_trip(startPoint, endPoint) {
  console.log("test");
  
  /*var params = {
    // REQUIRED 
    origin: "Lille",
    destination: "Dunkerque",
    key: process.env.GOOGLE_API_KEY,
};
map.getDirections(params, function (err, data) {
    if (err) {
        console.log(err);
        return 1;
    }
    console.log(data);
});*/

  /*var baseUrl = "https://maps.googleapis.com"
  var keyParam = "key=" + process.env.GOOGLE_API_KEY
  var originParam = "origin=" + startPoint.lat + "," + startPoint.lng
  var destinationParam = "destination=" + endPoint.lat + "," + endPoint.lng

  https.get(baseUrl + '/maps/api/directions/json?' + keyParam + "&" + originParam + "&" + destinationParam, (res) => {
    console.log(res)
    // Do stuff with response
  });*/


  /*googleMapsClient.directions({
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
  });*/
}
