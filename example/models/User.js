var mongoose = require('mongoose');
var dataTables = require('../../');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  name: String,
  email: String
});

UserSchema.plugin(dataTables);

var User = mongoose.model('User', UserSchema);

module.exports = User;
