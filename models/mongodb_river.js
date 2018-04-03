var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var RiverSchema = new mongoose.Schema({
  river_id: {
    type: Number,
    // unique: true,
    required: true,
    trim: true
  },
  sort: {
    type: Number,
    required: true,
    trim: true
  },
  lat: {
    type: String,
    required: true,
  },
  lng: {
    type: String,
    required: true,
  }
});

var MongoDBRiver = mongoose.model('River', RiverSchema);
module.exports = MongoDBRiver;