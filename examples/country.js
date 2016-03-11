#!/usr/bin/env node

var fs       = require('fs'),
    split    = require("split"),
    geoinfo  = require('../lib/geoinfo'),
    request  = require('request');

request.get('http://download.geonames.org/export/dump/countryInfo.txt')
	.pipe(split())
	.pipe(geoinfo.country())
	.pipe(geoinfo.filter(function(record) {
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
	.pipe(geoinfo.country())
	.pipe(geoinfo.filter(function(record) {
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
	.pipe(geoinfo.range(52))
	.pipe(geoinfo.country())
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
	.pipe(geoinfo.range(2, 5))
	.pipe(geoinfo.countryI18n())
	.on('data', function (record) {
		console.log(record);
	})
	.on('error', function(e){

	})	
	.on('end', function() {
	});

