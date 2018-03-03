var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dataTables = require('..');

var UserSchema = new Schema({
  first_name: String,
  last_name: String,
  username: String
});

UserSchema.plugin(dataTables, {
  formatters: {
    toPublic : function (user) {
      return {
        name: user.first_name + ' ' + user.last_name
      }
    }
  }
});

var User = mongoose.model('User', UserSchema)

module.exports = User
