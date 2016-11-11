var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var User = require('./models/User');

var app = express();


app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));


mongoose.connect('mongodb://localhost/mongoose-datatables-example', function (err) {
  User.find({}, function (err, users) {
    if (!users.length) {
      var data = []
      for (var i = 1; i <= 20 ; i++) {
        data.push({
          username: 'username' + i,
          name: 'User ' + i,
          email: 'user' + i + '@gmail.com'
        });
      };
      User.create(data, function (err){console.log(err)});
    }
  });
});

app.post('/', function (req, res) {
  User.dataTables({
    limit: req.body.length,
    skip: req.body.start
  }, function (err, table) {
    res.json({
      data: table.data,
      recordsFiltered: table.recordsTotal,
      recordsTotal: table.recordsTotal
    });
  });
});

app.listen(3000, function () {
  console.log('server running ...');
});
