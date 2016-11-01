$('#load-close').click(function(){
	$('#load').addClass('animated slideOutUp');
});

L.mapbox.accessToken = '';
var map = L.mapbox.map('map')
    .setView([38.89399, -77.03659], 17);
L.tileLayer('https://api.mapbox.com/styles/v1/ecotaco/cisg4kbkt006c2xp8kerbz7nn/tiles/256/{z}/{x}/{y}?access_token=').addTo(map);

var featureGroup = L.featureGroup().addTo(map);
var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: featureGroup
  }
}).addTo(map);

map.on('draw:created', function(e) {
    featureGroup.addLayer(e.layer);
});