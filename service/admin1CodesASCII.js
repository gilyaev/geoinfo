#!/usr/bin/env node

'use strict';

var fs       = require('fs'),
    split    = require("split"),
    geonames = require('../lib/geonames'),
    storage  = require('../lib/storage'),
    line     = 0, 
    dataSets = [];

console.time('Parse Admin Code ASCII info');
var s = fs.createReadStream('../data/admin1CodesASCII.txt')
    .pipe(split())
    .pipe(geonames.admin1CodesASCII())
    .on('data', function (data) {
		  var item = JSON.parse(data);
		  dataSets.push(item);
    	++line;
  	})
  	.on('end', function() {
      storage.adminCodes(dataSets).save(function() {
        console.log('FINISHED');
      });
  		console.timeEnd('Parse Admin Code ASCII info');
  	});