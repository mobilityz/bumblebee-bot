var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var Schema = mongoose.Schema;

var botSchema = new Schema({
  name: {type: String, unique: true, required: true},
  zone: {
    type: { type: String, default: 'Polygon'},
    coordinates: [[ {type: Number, required: true} ]]
  },
  active: {type: Boolean, default: true},
  nb_driver: {type: Number, default: 1, min: 1},
  api_key: String,
  json_to_send: String,
  header_to_send: String,
  url: String,
  http_method: String,
  speed: {type: Number, default: 30, min: 1},
  precision: {type: Number, default: 20, min: 1}
});

botSchema.index({ location : '2dsphere' });

botSchema.plugin(timestamps);

var Bot = mongoose.model('Bot', botSchema);

module.exports = Bot;
