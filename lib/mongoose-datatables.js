module.exports = exports = dataTablesPlugin;

function dataTablesPlugin (schema, options) {
  options = options || {};
  var totalKey = options.totalKey || 'total'
  var dataKey = options.dataKey || 'data';

  schema.statics.dataTables = function (params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }

    var thisSchema = this;
    var limit = parseInt(params.limit, 10);
    var skip = parseInt(params.skip, 10);
    var select = params.select || {};
    var find = params.find || {};
    var sort = params.sort || {};
    var search = params.search || {};

    if (search && search.value && search.fields && search.fields.length) {
      var searchQuery = {
        '$regex': search.value,
        '$options': 'i'
      };

      if (search.fields.length == 1) {
        find[search.fields[0]] = searchQuery;
      } else if(search.fields.length > 1) {
        if (!find.$or) {
          find.$or = [];
        }
        search.fields.forEach(function (el){
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

        if (params.populate) {
          query.populate(params.populate);
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

      var response = {};
      response[dataKey] = results[0];
      response[totalKey] = results[1];

      callback(err, response);
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


