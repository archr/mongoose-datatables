# mongoose-datatables

Server side table request.

[![Build Status](https://travis-ci.org/archr/mongoose-datatables.svg)](https://travis-ci.org/archr/mongoose-datatables)

## Installation
```sh
$ npm install mongoose-datatables
```

## Configuration
plugin(schema, options)
* `totalKey` (String) - Default total
* `dataKey` (String) - Default data

```javascript
var mongoose = require(‘mongoose’);
var dataTables = require(‘mongoose-datatables’);
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  first_name: String,
  last_name: String,
  username: String
});

UserSchema.plugin(dataTables, {
  totalKey: 'recordsTotal',
  dataKey: 'data'
});
```

## Usage
dataTable(parmas, callback)

The available parmas are:
* `limit` (Number) - Specifies mongo limit.
* `skip` (Number) - Specifies mongo skip.
* `find` (Object) - Specifies selection criteria.
* `select` (Object) - Specifies the fields to return.
* `sort` (Object) - Specifies the order in which the query returns matching documents.
* `search` (Object) - Search.
* `populate` (Object) - Specifies models to populate.


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
  }, function (err, table) {
    res.json(table); // table.total, table.data
  });
});
```