var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var botSchema = new Schema({
  name: String,
  zone: Array,
  nb_driver: Number,
  api_key: String,
  json_to_send: String,
  header_to_send: String,
  url: String,
  http_method: String,
  speed: Number,
  precision: Number,
  created_at: Date,
  updated_at: Date
});

var Bot = mongoose.model('Bot', botSchema);

// make this available to our users in our Node applications
module.exports = Bot;
