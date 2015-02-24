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
    var select = options.select || {};
    var find = options.find || {};
    var sort = options.sort || {};
    var search = options.search || [];

    if (query.search && query.search.value && search) {
      var searchQuery = {
        '$regex': query.search.value,
        '$options': 'i'
      };

      if (search.length == 1) {
        find[search[0]] = searchQuery;
      } else if(search.length > 1) {
        if (!find.$or) {
          find.$or = [];
        }
        search.forEach(function (el){
          var obj = {};
          obj[el] = searchQuery;
          find.$or.push(obj);
        });
      }
    }

    parallel([
      function (done) {
        var query = thisSchema
          .find(find)
          .select(select)
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
        callback(err);
      }

      callback(err, {
        recordsTotal: results[1],
        recordsFiltered: results[1],
        data: results[0]
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


