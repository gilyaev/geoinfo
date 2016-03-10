#!/usr/bin/env node

var fs       = require('fs'),
    split    = require("split"),
    geonames = require('../lib/geonames'),
    request  = require('request');

request.get('http://download.geonames.org/export/dump/admin1CodesASCII.txt')
	.pipe(split())
	.pipe(geonames.admin1CodesASCII())
	.on('data', function (record) {
		console.log(record);
	})
	.on('error', function(e){

	})	
	.on('end', function() {

	});

request.get('http://download.geonames.org/export/dump/admin1CodesASCII.txt')
	.pipe(split())
	.pipe(geonames.admin1CodesASCII())
	.pipe(geonames.filter(function(record) {
		return record.codes.indexOf('US.') != -1;
	}))
	.on('data', function (record) {
		console.log(record);
	})
	.on('error', function(e){

	})	
	.on('end', function() {
		
	});

request.get('http://download.geonames.org/export/dump/admin2Codes.txt')
	.pipe(split())
	.pipe(geonames.admin1CodesASCII())
	.on('data', function (record) {
		console.log(record);
	})
	.on('error', function(e){

	})	
	.on('end', function() {
		
	});