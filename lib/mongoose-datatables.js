var debug = require('debug')('mongoose-datatables');

module.exports = exports = dataTablesPlugin;

function dataTablesPlugin (schema, options) {
  schema.statics.dataTables = function (query, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    var thisSchema = this;
    var limit = parseInt(query.length, 10);
    var skip = parseInt(query.start, 10);
    var keys = options.keys || [];
    var find = options.find || {};
    var sort = options.sort || {};


    if (query.search.value && options.search) {
      var arrSearch = options.search.split(" ");
      var searchQuery = {
        '$regex': query.search.value, 
        '$options': 'i'
      };

      if (arrSearch.length == 1) {
        find[arrSearch[0]] = searchQuery;
      } else if(arrSearch.length > 1) {
        find.$or = arrSearch.map(function (el){
          var obj = {};
          obj[el] = searchQuery;
          return obj;
        });
      }
    }

    parallel([
      function (done) {
        var query = thisSchema
          .find(find)
          .select(keys.join(" "))
          .skip(skip)
          .limit(limit)
          .sort(sort);
        
        if (options.populate) {
          query.populate(options.populate);
        }
        
        query.exec(done);
      },
      function (done) {
        thisSchema.count(find, done);
      }
    ], function (err, results) {
      if (err) {
        debug(err);
        callback(err);
      }

      callback(err, {
        recordsTotal: results[0],
        recordsFiltered: results[0],
        data: results[1]
      });
    });
  };
}

function parallel (fns, callback) {
  var results = [];
  var counter = fns.length;
  var error = null;

   fns.forEach(function (fn, i){
    fn(function (err){
      if (err) {
        error = err;
      } else {
        results[i] = arguments[1];
      }
      counter--;
      if (counter <= 0) {
        return callback(error, results);
      }
    });
  });
}


