# mongoose-datatables

Server side table request.

[![Build Status](https://travis-ci.org/archr/mongoose-datatables.svg)](https://travis-ci.org/archr/mongoose-datatables)

## Installation
```sh
$ npm install mongoose-datatables
```

## Usage
Configure the plugin in your model

```javascript
var mongoose = require('mongoose')
var dataTables = require('mongoose-datatables')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  first_name: String,
  last_name: String,
  username: String
})

UserSchema.plugin(dataTables)
```
Use plugin in your route

```javascript
app.post('/table', (req, res) {
  User.dataTables({
    limit: req.body.length,
    skip: req.body.start,
    search: {
      value: req.body.search.value,
      fields: ['username']
    },
    sort: {
      username: 1
    }
  }).then(function (table) {
    res.json(table); // table.total, table.data
  })
});
```

## API

### plugin([options])
* `options.totalKey` (String) - Default total
* `options.dataKey` (String) - Default data
* `options.formatters` (Object) - Specifies multiple formatters that can be used in the query

### dataTables([options], [callback])
* `options.limit` (Number) - Specifies mongo limit.
* `options.skip` (Number) - Specifies mongo skip.
* `options.find` (Object) - Specifies selection criteria.
* `options.select` (Object) - Specifies the fields to return.
* `options.sort` (Object) - Specifies the order in which the query returns matching documents.
* `options.search` (Object) - Search.
* `options.populate` (Object) - Specifies models to populate.
* `options.formatter` (String|Function) - Specifies formatter to use after the query.


### Formaters

At query level
```javascript
User.dataTables({
  limit: 20,
  formatter: function(user) {
    return {
      name: user.first_name + ' ' + user.last_name
    }
  }
})
```

At schema level
```javascript
UserSchema.plugin(dataTables, {
  formatters: {
    toPublic : function (user) {
      return {
        name: user.first_name + ' ' + user.last_name
      }
    }
  }
});
```

Use by doing this at query level
```javascript
User.dataTables({
  limit: 20,
  formatter: 'toPublic',
})
```
**Note:** if you use formatters you get an array of objects on data, instead of the model instance.


## License
MIT 
