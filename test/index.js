var mongoose = require('mongoose');
var expect = require('chai').expect;
var User = require('./User');
var users = require('./fixtures/users').users;



describe('mongoose-datatables', function () {
  before(function (done) {
    mongoose.connect('mongodb://localhost/mongoose-datatables', function (err) {
      User.remove({}, function (err) {
        User.create(users, done);
      });
    });
  });

  it('find', function (done) {
    User.dataTables({
      start: 0,
      length: 10
    }, function (err, info) {
      expect(info.data.length).equal(2);
      expect(info.recordsTotal).equal(2);
      expect(info.recordsFiltered).equal(2);
      done();
    });
  });

  it('sort', function (done) {
    User.dataTables({
      start: 0,
      length: 10,
    }, {
      sort: {
        username: -1
      }
    }, function (err, info) {
      expect(info.data[0].username).equal('berser');
      done();
    });
  });

  it('limit', function (done) {
    User.dataTables({
      start: 0,
      length: 1,
    }, function (err, info) {
      expect(info.data.length).equal(1);
      expect(info.recordsTotal).equal(2);
      expect(info.recordsFiltered).equal(2);
      done();
    });
  });
});
