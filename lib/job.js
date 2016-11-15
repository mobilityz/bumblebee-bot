var kue = require('kue');
var trip = require('./trip');
// var socket = require('socket')

queue = kue.createQueue();

queue.process('driver_movement', function(job, done) {
  job_driver_movement(job.data.id_driver, job.data.step_index, job.data.position, done);
});

var job_driver_movement = function(id_driver, step_index, position, done) {
  // socket.emit('movement', id_driver, position);
  console.log(Date.now() + ' Driver ' + id_driver + ' make move ' + step_index + ' to ' + JSON.stringify(position));
  done();
};

queue.process('driver_new_trip', function(job, done) {
  job_driver_new_trip(job.data.id_driver, job.data.origin, done);
});

var job_driver_new_trip = function(id_driver, origin, done) {
  var trip = require('./trip');
  var Bot = require('../models/bot');

  Bot.find({id_driver})
  .then(function(bot) {
    if (bot.active) {
      return trip.generate_trip(bot, origin);
    } else {
      return false;
    }
  })
  .then(function(steps) {

    var current_delay = bot.delay;
    var last_step_index = steps.length - 1;

    steps.forEach(function(step, index) {
      queue.create('driver_movement', {
        id_driver: id_driver,
        position: step,
        step_index: index
      })
      .delay(current_delay)
      .removeOnComplete(true)
      .save();

      if(index === last_step_index) {
        queue.create('driver_new_course', {
          id_driver: id_driver,
          position: step
        })
        .delay(current_delay)
        .removeOnComplete(true)
        .save();
      }

      current_delay += delay;
    });

  });

};

job = {};

job.driver_new_trip = function(id_driver) {
  queue.create('driver_new_trip', {
    id_driver: id_driver
  })
  .delay(current_delay)
  .removeOnComplete(true)
  .save();
}

module.exports = job;
