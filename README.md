# mongoose-datatables

Server side dataTable request.

## Install
```sh
$ npm install mongoose-datatables
```

## Usage

```javascript
var mongoose = require(‘mongoose’);
var dataTables = require(‘mongoose-datatables’);
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  first_name: String,
  last_name: String,
  username: String
});

UserSchema.plugin(dataTables);
```

```javascript
function users (req, res) {
  User.dataTables(req.body, {
    sort: {
      username: 1
    }
  }, function (err, table) {
    res.json(table);
  });
}
```

## API

dataTable(query, options, callback)

The available options are:
* `find` (Object) - Specifies selection criteria.
* `select` (Object) - Specifies the fields to return.
* `sort` (Object) - Specifies the order in which the query returns matching documents.
* `search` (Array) - Search in fields.
* `populate` (Object) - Specifies models to populate.
