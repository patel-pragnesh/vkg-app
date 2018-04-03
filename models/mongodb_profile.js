var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var ProfileSchema = new mongoose.Schema({
  river_id: {
    type: Number,
    // unique: true,
    required: true,
    trim: true
  },
  profile: {
    type: String,
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

var MongoDBProfile = mongoose.model('Profile', ProfileSchema);
module.exports = MongoDBProfile;