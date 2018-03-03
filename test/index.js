var mongoose = require('mongoose')
var expect = require('chai').expect
var User = require('./User')
var Post = require('./Post')
var users = require('./fixtures/users').users
var posts = require('./fixtures/posts').posts

mongoose.Promise = global.Promise

describe('mongoose-datatables', function () {
  before(function (done) {
    mongoose.connect('mongodb://localhost/mongoose-datatables', function (err) {
      Promise.all([User.remove({}), Post.remove({})]).then(function () {
        Promise.all([User.create(users), Post.create(posts)]).then(function () {
          done()
        })
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

  describe('Datakey and totalKey', function () {
    it('no options', function (done) {
      Post.dataTables({}).then(table => {
        expect(table.amount).equal(2)
        expect(table.posts[0].title).equal('Top Node Links of the Week')
        expect(table.posts[1].title).equal('React’s new Context API')
        done()
      }).catch(done)
    })

    it('find', function (done) {
      Post.dataTables({
        find: {
          title: 'Top Node Links of the Week'
        }
      }).then(table => {
        expect(table.posts.length).equal(1)
        expect(table.amount).equal(1)
        expect(table.posts[0].title).equal('Top Node Links of the Week')
        done()
      }).catch(done)
    })

    it('should call formatter from query', function (done) {
      Post.dataTables({
        formatter: function(post) {
          return {
            item: post.title
          }
        }
      }).then(table => {
        expect(table.posts.length).equal(2)
        expect(table.amount).equal(2)
        expect(table.posts[0].item).equal('Top Node Links of the Week')
        expect(table.posts[1].item).equal('React’s new Context API')
        done()
      }).catch(done)
    })

    it('formatter from options', function (done) {
      Post.dataTables({
        formatter: 'toPublic',
      }).then(table => {
        expect(table.posts.length).equal(2)
        expect(table.amount).equal(2)
        expect(table.posts[0].item).equal('Top Node Links of the Week')
        expect(table.posts[1].item).equal('React’s new Context API')
        done()
      }).catch(done)
    })
  })

  describe('Formatters', function () {
    it('should call formatter from query', function (done) {
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

    it('should throw error for invalid string name for a formatter', function (done) {
      User.dataTables({
        formatter: 'invalid'
      }).then(table => {
        done(new Error('Error wasn\'t throw for invalid formatter'))
      }).catch(function (err) {
        expect(err.message).equal('Invalid formatter')
        done()
      })
    })

    it('should throw error for invalid formatter type', function (done) {
      User.dataTables({
        formatter: {}
      }).then(table => {
        done(new Error('Error wasn\'t throw for invalid formatter'))
      }).catch(function (err) {
        expect(err.message).equal('Invalid formatter')
        done()
      })
    })
  })
})

