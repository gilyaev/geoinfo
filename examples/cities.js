#!/usr/bin/env node

var fs       = require('fs'),
    split    = require("split"),
    geonames = require('../lib/geonames');

fs.createReadStream('./cities15000.txt')
	.pipe(split())
	.pipe(geonames.city())
	.pipe(geonames.filter(function(record) {
		return record.adminCode1  == 16 && record.countryCode == 'UA';
	}))
	.on('data', function (record) {
		console.log(record);
	})
	.on('error', function(e){

	})
	.on('end', function() {
		console.log('end');
	});