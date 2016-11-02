var mapboxKey = "pk.eyJ1IjoiZWNvdGFjbyIsImEiOiJjaXYwMG1vN3cwMDNqMm5yMXdmMnRma3NpIn0.2C4J5O3_Lc_mXBZSZ8MNBA";
L.mapbox.accessToken = mapboxKey;
var options = {zoomControl: false, attributionControl: false,
        unloadInvisibleTiles: true, detectRetina: true}
var map = L.map('map', options).setView([50.632854, 3.021342], 11);
var styleLayer = L.mapbox.styleLayer('mapbox://styles/ecotaco/civ00flry01gx2jl8d3pugthb', options).addTo(map);

$('#load-close').click(function(){
  $('#load').addClass('animated slideOutUp');
  map.addControl(L.control.zoom({position: 'topright'}));
  map.addControl(L.control.attribution({position: 'bottomright'}));
});

$('li').click(function() {
  $("li.active").removeClass("active");
  $(this).addClass('active');
});

$('#home').click(function() {
  
});

$('#add').click(function() {
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
      rectangle: false,
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
});

$('#list').click(function() {
  
});
