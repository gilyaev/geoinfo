'use strict';

var through2            = require("through2"),
	helper				= require("./helper"),
	city                = require('./models/city'),
	admin1CodesASCII    = require('./models/admin1CodesASCII.js'),
	country             = require('./models/country.js'),
	countryI18n         = require('./models/country.i18n.js'),
	i18n                = require('./models/i18n.js');

module.exports = geoinfo;

function geoinfo(options) {	
	return through2.obj(function(chunk, enc, callback) {
		var data = geoinfo.parseRow(chunk),
			i = 0, len,
			fields = options.fields,
			field  = null, 
			item = {};

		if (helper.isNull(data)) {
			return callback();
		}

		len = data.length;
		for(i = 0; i < len; i++) {
			field = fields[i];
			if (field !== void 0) {
				item[field.field] = data[i];
			}
		}
		
		if (!helper.isNull(city)) {
			this.push(item);
		}
		callback();
    })
}

geoinfo.filter = function(fn) {
	return through2.obj(function(chunk, enc, callback) {
		if (fn(chunk)) {
			this.push(chunk);
		}
		callback();
    });
}

geoinfo.range = function(start, length) {
	var line = 0;
	return through2.obj(function(chunk, enc, callback) {
		++line;
		if (line >= start && (line < (length + start) || helper.isUndefined(length))) {
			this.push(chunk);
		}
		callback();
    });
}

geoinfo.city = function(options) {
	options || (options = {});
	options.fields = city;
	return new geoinfo(options);
}

geoinfo.i18n = function(options) {
	options || (options = {});
	options.fields = i18n;
	return new geoinfo(options);
}

geoinfo.admin1CodesASCII = function(options) {
	options || (options = {});
	options.fields = admin1CodesASCII;
	return new geoinfo(options);
}

geoinfo.country = function(options) {
	options || (options = {});
	options.fields = country;
	return new geoinfo(options);
}

geoinfo.countryI18n = function(options) {
	options || (options = {});
	options.fields = countryI18n;
	return new geoinfo(options);
}

geoinfo.isValid = function(data) {
	return !(helper.isNull(data) || (helper.isArray(data) && data.length < 0));
}

geoinfo.parseRow = function(line) {
	var data = [],
		reg = /(?:([^\t]+)\t?|(\t{1}))/g,
	 	match;

 	if (line == '') {
 		return null
 	}

	while (match = reg.exec(line)) {
		var i = (helper.isUndefined(match[2])) ? 1 : 2; 
		data.push(match[i].replace('\t',''));
	}
	return geoinfo.isValid(data) ? data : null;
}