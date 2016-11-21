var kue = require('kue');
var trip = require('./trip');

queue = kue.createQueue();

queue.process('driver_movement', (job, done) => {
  job_driver_movement(job.data.id_driver, job.data.step_index, job.data.position, done);
});

var job_driver_movement = (id_driver, step_index, position, done) => {
  var io = require('./socket');
  io.emit('notification', { id: id_driver, position: position});
  done();
};

queue.process('driver_new_trip', (job, done) => {
  job_driver_new_trip(job.data.id_driver, job.data.position, done);
});

var job_driver_new_trip = (id_driver, origin, done) => {
  var trip = require('./trip');
  var Bot = require('../models/bot');
  Bot.findOne({ drivers: id_driver })
  .exec()
  .then((bot) => {
    if(bot.active) {
      var current_delay = bot.precision;
      trip.generate_trip(bot, origin, (steps) => {
        var io = require('./socket');
        io.emit('trip', { id: bot.id, ride: steps});
        var last_step_index = steps.length - 1;

        steps.forEach((step, index) => {
          queue.create('driver_movement', {
            id_driver: id_driver,
            position: step,
            step_index: index
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
  .catch((err) => {
    console.log(err);
    done();
  });

};

job = {};

job.driver_new_trip = (id_driver) => {
  queue.create('driver_new_trip', {
    id_driver: id_driver
  })
  .save();
}

module.exports = job;
