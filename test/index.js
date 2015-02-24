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

  it('no options', function (done) {
    User.dataTables({
      start: 0,
      length: 10,
    }, function (err, table) {
      expect(table.data.length).equal(2);
      expect(table.recordsTotal).equal(2);
      expect(table.recordsFiltered).equal(2);
      done();
    });
  });

  it('find', function (done) {
    User.dataTables({
      start: 0,
      length: 10,
    }, {
      find: {
        username: 'berser'
      }
    }, function (err, table) {
      expect(table.data[0].username).equal('berser');
      done();
    });
  });

  it('select', function (done) {
    User.dataTables({
      start: 0,
      length: 10,
    }, {
      select: {
        first_name: 1
      }
    }, function (err, table) {
      expect(table.data[0].username).undefined;
      expect(table.data[0].last_name).undefined;
      expect(table.data[0].first_name).exist;
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
    }, function (err, table) {
      expect(table.data[0].username).equal('berser');
      done();
    });
  });

    it('search', function (done) {
    User.dataTables({
      start: 0,
      length: 10,
      search: {
        value: 'archr'
      }
    }, {
      search: ['username']
    }, function (err, table) {
      expect(table.data.length).equal(1);
      expect(table.data[0].username).equal('archr');
      done();
    });
  });


  it('limit', function (done) {
    User.dataTables({
      start: 0,
      length: 1,
    }, function (err, table) {
      expect(table.data.length).equal(1);
      expect(table.recordsTotal).equal(2);
      expect(table.recordsFiltered).equal(2);
      done();
    });
  });
});
