var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dataTables = require('..');

var PostSchema = new Schema({
  title: String,
  description: String,
  url: String
});

PostSchema.plugin(dataTables, {
  totalKey: 'amount',
  dataKey: 'posts',
  formatters: {
    toPublic : function (post) {
      return {
        item: post.title
      }
    }
  }
});

var Post = mongoose.model('Post', PostSchema)

module.exports = Post
