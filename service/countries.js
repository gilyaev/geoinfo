#!/usr/bin/env node

'use strict';

var fs       = require('fs'),
    split    = require("split"),
    geonames = require('../lib/geonames'),
    storage = require('../lib/storage'),
    line = 0, dataSets = [];

console.time('parse countrie info');
var s = fs.createReadStream('../data/countryInfo.txt')
    .pipe(split())
    .pipe(geonames.country())
    .on('data', function (data) {
		  var item = JSON.parse(data);
		  dataSets.push(item);
    	++line;
  	})
  	.on('end', function() {
      storage.countries(dataSets).save(1000);
  		console.timeEnd('parse countrie info');
  	});