var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dataTables = require('..');

var UserSchema = new Schema({
  first_name: String,
  last_name: String,
  username: String
});

UserSchema.plugin(dataTables);

var User = mongoose.model('User', UserSchema);

module.exports = User;
