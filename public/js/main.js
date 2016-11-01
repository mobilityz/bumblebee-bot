var mapboxKey = "pk.eyJ1IjoiZWNvdGFjbyIsImEiOiJjaXYwMG1vN3cwMDNqMm5yMXdmMnRma3NpIn0.2C4J5O3_Lc_mXBZSZ8MNBA";
L.mapbox.accessToken = mapboxKey;
var options = {zoomControl: false, attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a>',
        unloadInvisibleTiles: true, detectRetina: true}
var map = L.map('map', options).setView([50.632854, 3.021342], 11);
var styleLayer = L.mapbox.styleLayer('mapbox://styles/ecotaco/civ00flry01gx2jl8d3pugthb').addTo(map);

$('#load-close').click(function(){
	$('#load').addClass('animated slideOutUp');
	map.addControl(L.control.zoom({position: 'topright'}));
});

$('#add').click(function() {
	if (drawControl === undefined) {
		var featureGroup = L.featureGroup().addTo(map);
		var drawControl = new L.Control.Draw({
		  edit: {
		    featureGroup: featureGroup,
		    edit: {   // this property shouldn't be needed
            selectedPathOptions: { // this property should be one level up
                color: '#F8D45C',
                fillColor: '#F8D45C'
            }
        } 
		  },
		  position: 'topright',
		  draw: {
		  	polyline: false,
		  	marker: false,
		  	circle: false,
		  	polygon: {
		  		shapeOptions: {
                	color: '#F8D45C'
            	}
            }
		  }
		}).addTo(map);

		map.on('draw:created', function(e) {
		    featureGroup.addLayer(e.layer);
		});
	}
});