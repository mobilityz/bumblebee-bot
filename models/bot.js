var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var Schema = mongoose.Schema;

var botSchema = new Schema({
  name: {type: String, unique: true, required: true},
  zone: {
    type: { type: String, default: 'Polygon'},
    coordinates: {type: Array, required: true},
    properties: {type: Object}
  },
  active: {type: Boolean, default: true},
  nb_driver: {type: Number, default: 1, min: 1},
  drivers: [{ type: Schema.ObjectId }],
  api_key: String,
  json_to_send: String,
  header_to_send: String,
  url: String,
  http_method: String,
  speed: {type: Number, default: 30, min: 1},
  precision: {type: Number, default: 20, min: 1}
});

botSchema.index({ zone : '2dsphere' });

botSchema.plugin(timestamps);

botSchema.pre('save', function(next) {
  if (this.isNew) {
    var drivers = [];
    for(var i = 0; i < this.nb_driver; i++) {
      var id_driver = mongoose.Types.ObjectId();
      drivers.push(id_driver);
    }
    this.drivers = drivers;
  }
  next();
});

var Bot = mongoose.model('Bot', botSchema);

module.exports = Bot;
