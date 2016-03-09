#!/usr/bin/env node

'use strict';

var fs       = require('fs'),
    split    = require("split"),
    geonames = require('../lib/geonames'),
    storage  = require('../lib/storage'),
    line = 0, dataSets = [];

console.time('parse cities info');
var s = fs.createReadStream('../data/cities15000.txt')
    .pipe(split())
    .pipe(geonames.city())
    .on('data', function (data) {
	  	var item = JSON.parse(data);
  		dataSets.push(item);
		++line;
  	})
  	.on('end', function() {
  		console.timeEnd('parse cities info');
  		storage.cities(dataSets).save();
  	});