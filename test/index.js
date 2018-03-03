var mongoose = require('mongoose')
var expect = require('chai').expect
var User = require('./User')
var users = require('./fixtures/users').users

mongoose.Promise = global.Promise

describe('mongoose-datatables', function () {
  before(function (done) {
    mongoose.connect('mongodb://localhost/mongoose-datatables', function (err) {
      User.remove({}, function (err) {
        User.create(users, done)
      })
    })
  })

  it('callback compatibily', function (done) {
    User
      .dataTables({
        skip: 0,
        limit: 10,
      }, (err, table) => {
        expect(table.data.length).equal(2)
        expect(table.total).equal(2)
        done()
      })
  })

  it('no options', function (done) {
    User
      .dataTables({
        skip: 0,
        limit: 10,
      }).then(table => {
        expect(table.data.length).equal(2)
        expect(table.total).equal(2)
        done()
      }).catch(done)
  })

  it('find', function (done) {
    User.dataTables({
      skip: 0,
      limit: 10,
      find: {
        username: 'berser'
      }
    }).then(table => {
      expect(table.data[0].username).equal('berser')
      done()
    }).catch(done)
  })

  it('select', function (done) {
    User.dataTables({
      skip: 0,
      limit: 10,
      select: {
        first_name: 1
      }
    }).then(table => {
      expect(table.data[0].username).undefined
      expect(table.data[0].last_name).undefined
      expect(table.data[0].first_name).exist
      done()
    }).catch(done)
  })

  it('sort', function (done) {
    User.dataTables({
      skip: 0,
      limit: 10,
      sort: {
        username: -1
      }
    }).then(table => {
      expect(table.data[0].username).equal('berser')
      done()
    }).catch(done)
  })

  it('search', function (done) {
    User.dataTables({
      skip: 0,
      limit: 10,
      search: {
        value: 'archr',
        fields: ['username']
      },
    }).then(table => {
      expect(table.data.length).equal(1)
      expect(table.data[0].username).equal('archr')
      done()
    }).catch(done)
  })

  it('limit', function (done) {
    User.dataTables({
      skip: 0,
      limit: 1,
    }).then(table => {
      expect(table.data.length).equal(1)
      expect(table.total).equal(2)
      expect(table.total).equal(2)
      done()
    }).catch(done)
  })

  it('formatter from call', function (done) {
    User.dataTables({
      formatter: function(user) {
        return {
          name: user.first_name + ' ' + user.last_name
        }
      }
    }).then(table => {
      expect(table.data.length).equal(2)
      expect(table.data[0].name).equal('Jorge Sandoval')
      expect(table.data[1].name).equal('Antonio Garcia')
      done()
    }).catch(done)
  })

  it('formatter from options', function (done) {
    User.dataTables({
      formatter: 'toPublic',
    }).then(table => {
      expect(table.data.length).equal(2)
      expect(table.data[0].name).equal('Jorge Sandoval')
      expect(table.data[1].name).equal('Antonio Garcia')
      done()
    }).catch(done)
  })
})

