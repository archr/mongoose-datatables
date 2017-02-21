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

### dataTables([options], [callback])
* `options.limit` (Number) - Specifies mongo limit.
* `options.skip` (Number) - Specifies mongo skip.
* `options.find` (Object) - Specifies selection criteria.
* `options.select` (Object) - Specifies the fields to return.
* `options.sort` (Object) - Specifies the order in which the query returns matching documents.
* `options.search` (Object) - Search.
* `options.populate` (Object) - Specifies models to populate.

## License
MIT 
