var mapboxKey = "pk.eyJ1IjoiZWNvdGFjbyIsImEiOiJjaXYwMG1vN3cwMDNqMm5yMXdmMnRma3NpIn0.2C4J5O3_Lc_mXBZSZ8MNBA";
L.mapbox.accessToken = mapboxKey;
var options = {zoomControl: false, attributionControl: false,
        unloadInvisibleTiles: true, detectRetina: true}
var map = L.map('map', options).setView([50.632854, 3.021342], 11);
var styleLayer = L.mapbox.styleLayer('mapbox://styles/ecotaco/civ00flry01gx2jl8d3pugthb', options).addTo(map);
var featureGroup = L.featureGroup().addTo(map);
var polygon = null;
var bbox = null;
var drivers = [];
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
        '<input id="bot_name" name="bot_name" class="swal2-input" autofocus placeholder="Bot name" required />' +
        '<input id="nb_driver" name="nb_driver" class="swal2-input" type="number" min="0" value="5" placeholder="Number of generated bot" required />',
      confirmButtonText: 'Generate',
      showCancelButton: true,
      preConfirm: function() {
        return new Promise(function(resolve) {
          resolve([
            $('#bot_name').val(),
            $('#nb_driver').val()
          ])
        })
      }
    },
  ]

  var s = swal.queue(steps).then(
    function(result) {
      createBot(result)
    }, function() {
      swal.resetDefaults();
  })

  map.on('draw:created', function(e) {
    featureGroup.addLayer(e.layer);
    showSwal();
    polygon = e.layer._latlngs;
    bbox = e.layer.getBounds();
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

function createBot(result) {

  swal.resetDefaults()
  swal({
    title: 'All done!',
    html:
      'Your answers: <pre>' +
        JSON.stringify(result) +
      '</pre>',
    imageUrl: '/images/bumblebee_transformation.gif',
    background: '#333',
    confirmButtonColor: '#F8D45C',
    confirmButtonText: 'Lovely!',
    showCancelButton: false
  })

  result_form = result[2];
  console.log(result_form);

  var start_points = randomPointsInPolygon(polygon, bbox, result_form[1]);
  var end_points = randomPointsInPolygon(polygon, bbox, result_form[1]);
  
  var i = 0;

  while (i < result_form[1]) {
    var driver = {
      startPoint: {lat: start_points[i].lat, lng:start_points[i].lng},
      endPoint: {lat: end_points[i].lat, lng:end_points[i].lng},
      tripSteps: [],
      currentStep: {index: 0, position: {lat: start_points[i].lat, lng:start_points[i].lng}}
    };
    drivers.push(driver);
    
    i++;
  }

  console.log(drivers);

  var markers = [];

  drivers.forEach(function(driver) {
    wayPoints(driver.startPoint, driver.endPoint, function(stepsLatLng) {  

      var marker = L.marker(L.latLng(driver.startPoint.lat, driver.startPoint.lng)).addTo(map);
      markers.push(marker);

      var line_points = []
      stepsLatLng.tripPath.forEach(function(step) {
        line_points.push([step.lat, step.lng]);
        window.setTimeout(function() {
          // Making a lissajous curve just for fun.
          // Create your own animated path here.
          marker.setLatLng(L.latLng(step.lat, step.lng));
        }, 500);
      });
      driver.tripSteps = line_points;
      var polyline_options = {
        color: '#F8D45C'
      };
      var polyline = L.polyline(line_points, polyline_options).addTo(map);
    });
  });

   
}