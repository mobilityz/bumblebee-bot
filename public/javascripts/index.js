var mapboxKey = "pk.eyJ1IjoiZWNvdGFjbyIsImEiOiJjaXYwMG1vN3cwMDNqMm5yMXdmMnRma3NpIn0.2C4J5O3_Lc_mXBZSZ8MNBA";
L.mapbox.accessToken = mapboxKey;
var options = {zoomControl: false, attributionControl: false,
        unloadInvisibleTiles: true, detectRetina: true}
var map = L.map('map', options).setView([50.632854, 3.021342], 11);
var styleLayer = L.mapbox.styleLayer('mapbox://styles/ecotaco/civ00flry01gx2jl8d3pugthb', options).addTo(map);
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
  });

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
  if ($('.leaflet-draw').is(':visible')) {
    drawControl.removeFrom(map);
  }
});

$('#add').click(function() {
  if ($('.leaflet-draw').is(':visible')) {
    drawControl.removeFrom(map);
  }
  drawControl.addTo(map);



  swal.setDefaults({
    animation: false,
    customClass: 'animated bounceInLeft',
    progressSteps: ['1', '2', '3'],
    background: '#333',
    confirmButtonColor: '#F8D45C'
  })

  var steps = [
    {
      title: 'Draw the area',
      text: 'Draw the area where the vehicles will be generated.',
      confirmButtonText: 'Draw &rarr;',
      showCancelButton: true,
      preConfirm: function() {
        return new Promise(function(resolve) {
          setTimeout(function() {
            hideSwal();
          }, 100)
          resolve();
        })
      }
    },
    {
      title: 'Confirm this area',
      text: 'Do you confirm this area ?',
      confirmButtonText: 'Yes &rarr;',
      showCancelButton: true,
      cancelButtonText: 'Modify',
    },
    {
      title: 'Generate the bot',
      html:
        '<input id="swal-input1" class="swal2-input" autofocus>' +
        '<input id="swal-input2" class="swal2-input">',
      confirmButtonText: 'Generate',
      showCancelButton: true,
    },
  ]

  var s = swal.queue(steps).then(function(result) {
    swal.resetDefaults()
    swal({
      title: 'All done!',
      /*html:
        'Your answers: <pre>' +
          JSON.stringify(result) +
        '</pre>',*/
      imageUrl: '/images/bumblebee_transformation.gif',
      background: '#333',
      confirmButtonColor: '#F8D45C',
      confirmButtonText: 'Lovely!',
      showCancelButton: false
    })
  }, function() {
    swal.resetDefaults()
  })

  map.on('draw:created', function(e) {
    featureGroup.addLayer(e.layer);
    showSwal();
    var polygon = e.layer._latlngs;
    var bbox = e.layer.getBounds();

    var points = randomPointsInPolygon(polygon, bbox, 2);

    points.forEach(function(point) {
      L.marker(L.latLng(point.lat,point.lng)).addTo(map);
    });


    var stepsLatLng = wayPoints(points[0],points[1]);
    L.polyline(stepsLatLng).addTo(map);

  });

  map.on('draw:editstop', function(e) {
    //featureGroup.addLayer(e.layer);
    showSwal();
  });

});

$('#newBotForm').submit(function(e) {
  e.preventDefault();
  $.ajax({
      url: $(e.currentTarget).attr('action'),
      type: $(e.currentTarget).attr('method'),
      data: $(e.currentTarget).serialize(),
      success: function(html) {
        alert(html);
      }
  });
});

$('#list').click(function() {
  if ($('.leaflet-draw').is(':visible')) {
    drawControl.removeFrom(map);
  }
});

var hideSwal = function() {
  $('.swal2-container').removeClass('swal2-in')
  $('.swal2-modal').addClass('swal2-hide')
  $('.swal2-modal').hide();
}
var showSwal = function() {
  $('.swal2-container').addClass('swal2-in')
  $('.swal2-modal').removeClass('swal2-hide')
  $('.swal2-modal').show();
}
