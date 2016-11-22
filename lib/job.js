var kue = require('kue');
var trip = require('./trip');

queue = kue.createQueue();

queue.process('driver_movement', function(job, done) {
  job_driver_movement(job.data.id_driver, job.data.step_index, job.data.position, job.data.brng, done);
});

var job_driver_movement = function(id_driver, step_index, position, brng, done) {
  var io = require('./socket');
  io.emit('notification', { id: id_driver, position: position, brng: brng});
  done();
};

queue.process('driver_new_trip', function(job, done) {
  job_driver_new_trip(job.data.id_driver, job.data.position, done);
});

var job_driver_new_trip = function(id_driver, origin, done) {
  var trip = require('./trip');
  var Bot = require('../models/bot');
  Bot.findOne({ drivers: id_driver })
  .exec()
  .then(function(bot) {
    if(bot.active) {
      var current_delay = bot.precision;
      trip.generate_trip(bot, origin, function(steps) {
        var io = require('./socket');
        io.emit('trip', { id: bot.id, ride: steps});
        var last_step_index = steps.length - 1;

        steps.forEach(function(step, index) {

          if(index != 0) {
            var lat1 = step.lat
            var lng1 = step.lng
            var lat = steps[index-1].lat
            var lng = steps[index-1].lng
            var y = Math.sin(lng1-lng) * Math.cos(lat1);
            var x = Math.cos(lat)*Math.sin(lat1) -Math.sin(lat)*Math.cos(lat1)*Math.cos(lng1-lng);
            var brng = Math.atan2(y, x) * (180/Math.PI);
          } else {
            var brng = 0;
          }

          queue.create('driver_movement', {
            id_driver: id_driver,
            position: step,
            step_index: index,
            brng: brng
          })
          .delay(current_delay)
          .removeOnComplete(true)
          .save();

          if(index === last_step_index) {
            queue.create('driver_new_trip', {
              id_driver: id_driver,
              position: step
            })
            .delay(current_delay)
            // .removeOnComplete(true)
            .save();
          }

          current_delay += bot.precision;
        });
        done();
      });
    } else {
      io.emit('bot_deactivate', {id_bot: bot.id, id_driver: id_driver});
      done();
    }
  })
  .catch(function(err) {
    console.log(err);
    done();
  });

};

job = {};

job.driver_new_trip = function(id_driver) {
  queue.create('driver_new_trip', {
    id_driver: id_driver
  })
  .save();
}

module.exports = job;
