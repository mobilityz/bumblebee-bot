var mapboxKey = "pk.eyJ1IjoiZWNvdGFjbyIsImEiOiJjaXYwMG1vN3cwMDNqMm5yMXdmMnRma3NpIn0.2C4J5O3_Lc_mXBZSZ8MNBA";
L.mapbox.accessToken = mapboxKey;
var options = {zoomControl: false, attributionControl: false,
        unloadInvisibleTiles: true, detectRetina: true}
var map = L.map('map', options).setView([50.632854, 3.021342], 11);
var styleLayer = L.mapbox.styleLayer('mapbox://styles/ecotaco/civ00flry01gx2jl8d3pugthb', options).addTo(map);
var featureGroup = L.featureGroup().addTo(map);
var polygon = null;
var drivers = [];
var socket = io('http://localhost:3000');
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

$('#fullscreen').click(function() {
  if (screenfull.enabled) {
    screenfull.request();
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
            $('.leaflet-draw-draw-polygon')[0].click();
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
          resolve({
            name: $('#bot_name').val(),
            nb_driver: parseInt($('#nb_driver').val()),
            zone: polygon,
          })
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
    polygon = e.layer.toGeoJSON().geometry;
    polygon.properties = {bbox: e.layer.getBounds(), latLngs: e.layer._latlngs};
  });

  map.on('draw:editstop', function(e) {
    //featureGroup.addLayer(e.layer);
    showSwal();
  });

});

$('#list').click(function() {
  if ($('.leaflet-draw').is(':visible')) {
    drawControl.removeFrom(map);
  }

  swal({
    animation: false,
    customClass: 'animated bounceInLeft',
    width: 'auto',
    background: '#333',
    confirmButtonColor: '#F8D45C',
    title: 'List of bots',
    html: "<div id='list-bots'><table><thead><tr>" +
     "<th>Bot</th><th>Drivers</th><th>Accuracy</th><th>Speed</th><th>ID</th><th>Action</th>" +
     "</thead></tr><tbody></tbody></table></div>"
  })

  $.ajax({
    url : 'http://localhost:3000/bots',
    success : function(data){
      var html = "";
      data.forEach(function(bot){
        console.log(bot);
        html += "<tr><td>" + bot.name + "</td><td>" +
          bot.nb_driver + "</td><td>" +
          bot.precision + "</td><td>" +
          bot.speed + "</td><td>" +
          bot._id + "</td>" + "<td><input type='checkbox' name='show' checked></td></tr>"
        // Display bots polygons
        var points = bot.zone.coordinates[0];
        var polygon = [];
        points.forEach(function(point){
          polygon.push({lat: point[1], lng: point[0]});
        });
        L.polygon(polygon, {color: '#F8D45C'}).addTo(map);
      })
      $('#list-bots tbody').html(html);

    }
  });


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

  var baseUrl = "/bots/";

  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: baseUrl,
    data: JSON.stringify(result[2]),
    dataType: 'json',
    success: function(qq) {
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
      return true;
    },
    error: function(jqXHR, textStatus, errorThrown) {
      swal.resetDefaults()
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
      swal({
        title: 'Error!',
        html:
          'Your answers: <pre>' +
            jqXHR.responseJSON.errmsg +
          '</pre>',
        background: '#333',
        confirmButtonColor: '#F8D45C',
        confirmButtonText: 'retry!',
        showCancelButton: false
      })
    }
  });
var LeafIcon = L.Icon.extend({options: {
  iconSize: [38, 95]
}});
carIcon = new LeafIcon({iconUrl: '/images/car.svg'}),
socket.on('notification', function (data) {
  function byID(element) {
    return element.id === this.id;
  }
  if (drivers.find(byID, data) !== undefined ) {
    var driver = drivers.find(byID, data)
    driver.marker.setLatLng(L.latLng(data.position.lat, data.position.lng));
  }
  else {
    var marker = L.marker(L.latLng(data.position.lat, data.position.lng), {icon: carIcon}).addTo(map);
    var driver = {id: data.id, marker: marker}
    drivers.push(driver)
  }
  
});
  /*
  
  marker.setLatLng(L.latLng(step.lat, step.lng));

  var polyline_options = {
    color: '#F8D45C'
  };
  var polyline = L.polyline(line_points, polyline_options).addTo(map);

  var driver = {
    startPoint: {lat: start_points[i].lat, lng:start_points[i].lng},
    endPoint: {lat: end_points[i].lat, lng:end_points[i].lng},
    tripSteps: [],
    currentStep: {index: 0, position: {lat: start_points[i].lat, lng:start_points[i].lng}}
  };
  */

}
