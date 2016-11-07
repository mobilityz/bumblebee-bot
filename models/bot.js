var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var Schema = mongoose.Schema;

var botSchema = new Schema({
  name: {type: String, unique: true, required: true},
  zone: Array,
  nb_driver: {type: Number, default: 1},
  api_key: String,
  json_to_send: String,
  header_to_send: String,
  url: String,
  http_method: String,
  speed: Number,
  precision: Number
});

botSchema.plugin(timestamps);

var Bot = mongoose.model('Bot', botSchema);

module.exports = Bot;
