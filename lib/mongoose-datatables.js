module.exports = exports = dataTablesPlugin

function dataTablesPlugin (schema, options) {
  options = options || {}
  var totalKey = options.totalKey || 'total'
  var dataKey = options.dataKey || 'data'

  schema.statics.dataTables = function (params, callback) {
    if (typeof params === 'function') {
      callback = params
      params = {}
    }

    callback = callback || function () {}

    var thisSchema = this
    var limit = parseInt(params.limit, 10)
    var skip = parseInt(params.skip, 10)
    var select = params.select || {}
    var find = params.find || {}
    var sort = params.sort || {}
    var search = params.search || {}
    var order = params.order || []
    var columns = params.columns || []

    if (search && search.value && search.fields && search.fields.length) {
      var searchQuery = {
        '$regex': search.value,
        '$options': 'i'
      }

      if (search.fields.length == 1) {
        find[search.fields[0]] = searchQuery
      } else if(search.fields.length > 1) {
        if (!find.$or) {
          find.$or = []
        }
        search.fields.forEach(function (el){
          var obj = {}
          obj[el] = searchQuery
          find.$or.push(obj)
        })
      }
    }

    if (order && columns) {
      var sortStr = ''
      sortStr = order.reduce((acc, col) => (acc+' '+((col.dir === 'asc')?'':'-')+columns[col.column].data),'')

      if(sortStr !== '') {
        sort = sortStr
      }
    }
    
    var query = thisSchema
      .find(find)
      .select(select)
      .skip(skip)
      .limit(limit)
      .sort(sort)

    if (params.populate) {
      query.populate(params.populate)
    }

    query.exec()

    return new Promise((resolve, reject) => {
      Promise
        .all([query.exec(), thisSchema.count(find)])
        .then(function (results) {
          var response = {}
          response[dataKey] = results[0]
          response[totalKey] = results[1]

          resolve(response)
          callback(null, response)
        })
        .catch(function (err) {
          reject(err)
          callback(err)
        })
    })

  }
}
