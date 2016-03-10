#!/usr/bin/env node

var fs       = require('fs'),
    split    = require("split"),
    geonames = require('../lib/geonames'),
    request  = require('request');

request.get('http://download.geonames.org/export/dump/countryInfo.txt')
	.pipe(split())
	.pipe(geonames.country())
	.pipe(geonames.filter(function(record) {
		return record.population > 500000000;
	}))
	.on('data', function (record) {
		console.log(record);
	})
	.on('error', function(e){

	})
	.on('end', function() {
		console.log('end');
	});

fs.createReadStream('./countryInfo.txt')
	.pipe(split())
	.pipe(geonames.country())
	.pipe(geonames.filter(function(record) {
		return record.population > 500000000;
	}))
	.on('data', function (record) {
		console.log(record);
	})
	.on('error', function(e){

	})
	.on('end', function() {
		console.log('end');
	});

fs.createReadStream('./countryInfo.txt')
	.pipe(split())
	.pipe(geonames.range(52))
	.pipe(geonames.country())
	.once('data', function (record) {
		console.log(record);
	})
	.on('error', function(e){

	})
	.on('end', function() {
		console.log('end');
	});

request.get('http://ws.geonames.org/countryInfoCSV?lang=ru&username=demo')
	.pipe(split())
	.pipe(geonames.range(2, 5))
	.pipe(geonames.countryI18n())
	.on('data', function (record) {
		console.log(record);
	})
	.on('error', function(e){

	})	
	.on('end', function() {
	});

