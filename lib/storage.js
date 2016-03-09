'use strict';

var mysql    = require("mysql"),
	Promise  = require('bluebird'),
	nconf    = require('nconf');

nconf.file({file: '../config/config.json'});

module.exports = storage;

function roughSizeOfObject( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isFunction(fn) {
	return typeof fn === 'function';
}

function storage(data, options) {
	this.data   = data;
	this.table  = options.table;
	this.fields = options.fields;
}

function getConnection() {
	return mysql.createConnection(nconf.get('database'));
}

function destroyConnection(connection) {
	connection.destroy();
}

/**
* return promise
*/
storage.prototype.calcBulkSize = function(bytes) {
	return new Promise(function(resolve, reject){
		var connection = getConnection();
		connection.query("SHOW VARIABLES where Variable_name = 'max_allowed_packet'" ,function(err, result) {
			var bulkSize = null;			
			if (err) throw err;
			if(result.length != 0) {
				bulkSize = (result[0]['Value']/bytes).toFixed(0);
			}
			destroyConnection(connection);
			resolve(bulkSize);
		});
  	})
}

storage.prototype.buildInsertQuery = function() {
	var fields = [];
	for(var prop in this.fields) {
		fields.push('`' + prop + '`');
	}
	return "INSERT INTO `"+this.table+"` ("+fields.join(',')+") VALUES ?";
}

storage.query = function(sql, data, cb) {
	var connection = getConnection();

	connection.config.queryFormat = function (query, values) {
	  if (!values) return query;
	  return query.replace(/\:(\w+)/g, function (txt, key) {
	    if (values.hasOwnProperty(key)) {
	      return this.escape(values[key]);
	    }
	    return txt;
	  }.bind(this));
	};

	connection.query(
		sql,
		data,
		function(error, result) {
			destroyConnection(connection);
			if (typeof cb === 'function') {
				cb(error, result);
			} else {
				throw error;
			}
		}
	);
};

/*
* arguments(bulkSize, cb) | arguments(bulkSize) | arguments(cb)
*/
storage.prototype.save = function save() {
	var query = this.buildInsertQuery(),
		len = this.data.length,
		dataSets = this.data,
		save, saveToDB, getData, prepareRow,
		context = this, cb, bulkSize;

	if (arguments.length > 1) {
		bulkSize = isNumeric(arguments[0]) ? arguments[0] : null;
		cb = arguments[1];
	} else {
		if (isFunction(arguments[0])) {
			cb = arguments[0];
		} else {
			bulkSize = isNumeric(arguments[0]) ? arguments[0] : null;
		}
	}
	

	console.time(this.table + ' saving');
	saveToDB = function(data, cb) {
		return new Promise(function(resolve, reject){
			var connection = getConnection();
			connection.query(
				query,
				[data],
				function(err, result) {
					destroyConnection(connection);
			  		if (err) {
			  			return reject(err);
			  		}
			  		setTimeout(function(){resolve()}, 100);
				}
			);
	  	})
	};

	prepareRow = function(item) {
		var fields = this.fields,
			prop, row = [], field;

		for(prop in fields) {
			field = fields[prop];

			switch (typeof field) {
				case 'function':
					row.push(field(item));
					break;
				default:
					if (!item.hasOwnProperty(fields[prop])) {
						return null;
					}
					row.push(item[fields[prop]]);
			}
		}
		return row;
	};

	getData = function(start, bulk) {
		var dataset = [],
			item    = [];

		for(start; start < bulk; start++) {
			item = dataSets[start];
			if (item === void 0 || start == len) {
				break
			}
			item = prepareRow.call(context, item);
			if (item) {
				dataset.push(item);	
			}
		}

		if(start < len) {
			saveToDB(dataset).then(function(){
				getData(start, (start+bulkSize));
			}).catch(function(error) {
				getData(start, (start+bulkSize));
				console.log(error);
			});
		} else {
			saveToDB(dataset).then(function(){
				console.timeEnd(context.table + ' saving');
				if (isFunction(cb)) cb();
			}).catch(function(error) {
				console.log(error);
				if (isFunction(cb)) cb();
			});
			return;
		}
	};

	if (len > 0) {
		if (null == bulkSize) {
			this.calcBulkSize((roughSizeOfObject(context.data[0]) * 3)).then(function(size) {
				if(size !== null) {
					bulkSize = size;
				}
				getData(0, bulkSize);
			});
		} else {
			getData(0, bulkSize);
		}
	}
}

storage.prototype.flushI8n = function() {
	switch(this.table) {
		case 'cities_i18n':
			console.time('Flushing cities_i18n');
			return new Promise(function(resolve, reject){
				var connection = getConnection();
				connection.query(
					'DELETE FROM `cities_i18n` WHERE cities_i18n.id NOT IN (SELECT id FROM `cities`);',
					function(err, result) {
						destroyConnection(connection);
				  		if (err) throw err;
				  		setTimeout(function(){
				  			resolve();
				  			console.timeEnd('Flushing cities_i18n');
				  		}, 100);
					}
				);
	  		});
	  		break;
  		case 'admin_codes_i18n':
			console.time('Flushing cities_i18n');
			return new Promise(function(resolve, reject){
				var connection = getConnection();
				connection.query(
					'DELETE FROM `admin_codes_i18n` WHERE admin_codes_i18n.id NOT IN (SELECT id FROM `admin_codes`);',
					function(err, result) {
						destroyConnection(connection);
				  		if (err) throw err;
				  		setTimeout(function(){
				  			resolve();
				  			console.timeEnd('Flushing cities_i18n');
				  		}, 100);
					}
				);
	  		});
	  		break;  		
	}
};

storage.countries = function(data, options) {
	options || (options = {});
	options.table  = 'countries';
	options.fields = {
		'id'  : 'geonameid',
		'iso' : 'iso',
		'iso3': 'iso3',
		'name': 'country',
		'area': 'area',
		'population': 'population',
		'currency_code': 'currencyCode',
		'currency_name': 'currencyName',
		'phone': 'phone',
		'postal_code_format': 'postalCodeFormat',
		'postal_code_regex': 'postalCodeRegex',
		'languages': 'languages',
		'neighbours': 'neighbours'
	};
	return new storage(data, options);
}

storage.countriesI18n = function(data, options) {
	options || (options = {});
	options.table  = 'countries_i18n';
	options.fields = {
		'locale': 'locale',
		'iso2': 'iso',
		'name': 'name'
	};
	return new storage(data, options);
}

storage.cities = function(data, options) {
	options || (options = {});
	options.table  = 'cities';
	options.fields = {
		'id'  : 'geonameid',
		'name': 'name',
		'admin_code': 'adminCode1',
		'lat': 'lat',
		'lng': 'lng',
		'country_iso2': 'countryCode',
		'timezone': 'timezone'
	};
	return new storage(data, options);
};

storage.citiesI18n = function(data, options) {
	options || (options = {});
	options.table  = 'cities_i18n';
	options.fields = {
		'id': 'geonameid',
		'locale': 'isolanguage',
		'name': 'alternateName'
	};
	return new storage(data, options);
};

storage.adminCodes = function(data, options) {
	options || (options = {});
	options.table  = 'admin_codes';
	options.fields = {
		'id': 'geonameid',
		'name': 'name',
		'iso31662': function() {return null},
		'asciiname': 'asciiname',
		'code': function(item) {
			if(!item.hasOwnProperty('codes')) {
				return null;
			}
			return item.codes.split('.')[1];
		},
		'country_iso2': function(item) {
			if(!item.hasOwnProperty('codes')) {
				return null;
			}
			return item.codes.split('.')[0];
		}
	};
	return new storage(data, options);
};

storage.admin1CodesASCIII18n = function(data, options) {
	options || (options = {});
	options.table  = 'admin_codes_i18n';
	options.fields = {
		'id': 'geonameid',
		'locale': 'isolanguage',
		'name': 'alternateName'
	};
	return new storage(data, options);
};