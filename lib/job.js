var kue = require('kue');
var trip = require('./trip');
// var socket = require('socket')

queue = kue.createQueue();

queue.process('driver_movement', function(job, done) {
  driver_movement(job.data.id, job.data.step_index, job.data.position, done);
});

queue.process('driver_new_course', function(job, done) {
  driver_new_course(job.data.id, job.data.position, done);
});

var driver_movement = function(id, step_index, position, done) {
  // socket.emit('movement', id, position);
  console.log(Date.now() + ' Driver ' + id + ' make move ' + step_index + ' to ' + JSON.stringify(position));
  done();
};

var driver_new_course = function(id, position, done) {
  var trip = require('./trip');
  var destination;
  if (Math.random() < 0.5) {
    destination = { lat:50.63201781065358, lng:2.8528832478236685 };
  } else {
    destination = { lat:50.606654463956616, lng:2.95814846407037 };
  };
  var coords = {
    origin: position,
    destination: destination
  };

  trip.generate_trip(id, coords, function() {
    console.log('NEW TRIP FOR ' + id)
    done();
  });
};

job = {};

job.create_driver_job = function(id, steps, delay) {
  var current_delay = delay;
  var last_step_index = steps.length - 1;

  steps.forEach(function(step, index) {
    queue.create('driver_movement', {
      id: id,
      position: step,
      step_index: index
    })
    .delay(current_delay)
    .removeOnComplete(true)
    .save();

    if (index === last_step_index) {
      queue.create('driver_new_course', {
        id: id,
        position: step
      })
      .delay(current_delay)
      .removeOnComplete(true)
      .save();
    }

    current_delay += delay;
  });
}

module.exports = job;
