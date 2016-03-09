#!/usr/bin/env node

'use strict';

var fs       = require('fs'),
    split    = require("split"),
    geonames = require('../lib/geonames'),
    storage  = require('../lib/storage'),
    Promise  = require('bluebird'),
    line     = 0,
    dataSets = [];

function updateISO(item) {
  return new Promise(function(resolve, reject){
    var sql = 'UPDATE admin_codes SET iso31662 = :iso31662 WHERE code = :code AND country_iso2 = :countryIso';
    item['iso31662'] = item.countryIso + '-' + item.iso31662;

    storage.query(sql, item, function(error, result) {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    })
  });
}

console.time('Parse Admin Code ASCII ISO info');
var s = fs.createReadStream('../data/iso3166-2.txt')
    .pipe(split())
    .pipe(geonames.admin1CodesASCIIISO())
    .on('data', function (data) {
		  var item = JSON.parse(data);
		  dataSets.push(item);
    	++line;
  	})
  	.on('end', function() {
      Promise.mapSeries(dataSets, function(item) {
          return updateISO(item);
      }).then(function() {
          console.timeEnd('Parse Admin Code ASCII ISO info');
      })
  	});