'use strict';

var fs                  = require('fs'),
	city                = require('./models/city'),
	cityI18n            = require('./models/city.i18n.js'),
	admin1CodesASCII    = require('./models/admin1CodesASCII.js'),
	admin1CodesASCIIISO = require('./models/admin1CodesASCII.iso.js'),
	country             = require('./models/country.js'),
	countryI18n         = require('./models/country.i18n.js'),
	i18n                = require('./models/i18n.js'),
	through2            = require("through2");

module.exports = geonames;

function geonames(options) {
	return through2(function(chunk, enc, callback) {
		var data = geonames.parseRow(chunk),
			i = 0, len,
			fields = options.fields,
			field  = null, 
			item = {};

		if (data == null) {
			return callback();
		}

		len = data.length;
		for(i = 0; i < len; i++) {
			field = fields[i];
			if (field !== void 0) {
				item[field.field] = data[i];
			}
		}
		
		if (city !== null) {
			this.push(JSON.stringify(item));
		}
		callback();
    })
}

geonames.city = function(options) {
	options || (options = {});
	options.fields = city;
	return new geonames(options);
}

geonames.cityI18n = function(options) {
	options || (options = {});
	options.fields = cityI18n;
	return new geonames(options);
}

geonames.i18n = function(options) {
	options || (options = {});
	options.fields = i18n;
	return new geonames(options);
}

geonames.admin1CodesASCII = function(options) {
	options || (options = {});
	options.fields = admin1CodesASCII;
	return new geonames(options);
}

geonames.admin1CodesASCIIISO = function(options) {
	options || (options = {});
	options.fields = admin1CodesASCIIISO;
	return new geonames(options);
}

geonames.smashI18n = function () {
	return through2(function(chunk, enc, callback) {
		var data = geonames.parseRow(chunk),
			i = 0, len, self = this;

		if (data == null || data[2] == '' || data[2] == 'link') {
			return callback();
		}

		fs.appendFile(
			'../data/i18n/' + data[2] + '.txt',
			chunk + "\n", 
		 	function(err){
          		if (err) throw err;
          		self.push(chunk);
          		callback();
        	}
        );
	});
}

geonames.country = function(options) {
	options || (options = {});
	options.fields = country;
	return new geonames(options);
}

geonames.countryI18n = function(options) {
	options || (options = {});
	options.fields = countryI18n;
	return new geonames(options);
}

geonames.isValid = function(data) {
	if (data === null 
		|| ((Array.isArray(data) || toString.call(data) === '[object Array]') && data.length < 0)
	) {
		return false;
	}

	return true;
}

geonames.parseRow = function(line) {
	var data = [],
		reg = /(?:([^\t]+)\t?|(\t{1}))/g,
	 	match;

 	if (line == '') {
 		return null
 	}

	while (match = reg.exec(line)) {
		var i = match[2] === void 0 ? 1 : 2; 
		data.push(match[i].replace('\t',''));
	}
	return geonames.isValid(data) ? data : null;
}