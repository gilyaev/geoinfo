#!/usr/bin/env node

'use strict';

var request  = require('request'),
    split    = require("split"),
    geonames = require('../lib/geonames'),
    storage  = require('../lib/storage'),
    Promise  = require('bluebird'),
	nconf    = require('nconf');

nconf.file({ file: '../config/config.json'});

console.time('Parse locales task');
function parseLocale(locale) {
	var dataSets = [],
		line = 0;
	return new Promise(function(resolve, reject){
		console.time('parse countrie locale info - ' + locale);
		request.get('http://ws.geonames.org/countryInfoCSV?lang='+locale+'&username=' + nconf.get('geonames:userName'))
			.pipe(split())
			.pipe(geonames.countryI18n())
		    .on('data', function (data) {
		    	var item = JSON.parse(data);
		    	++line;
		    	if (line > 1) {
					item['locale'] = locale;
					dataSets.push(item);
		    	}
		  	})
		  	.on('end', function() {
		  		resolve(dataSets);
		  		console.timeEnd('parse countrie locale info - ' + locale);
		  	});
  	}).then(function(data) {
  		return saveLocale(data);
  	});
}

function saveLocale(data) {
	return new Promise(function(resolve, reject) {
		storage.countriesI18n(data).save(function() {
			resolve();
		});
	});
}

Promise.mapSeries(nconf.get('locales'), function(locale) {
	console.log('**** LOCALE: ' + locale + ' ****');
    return parseLocale(locale);
}).then(function() {
	console.timeEnd('Parse locales task');
    console.log("FINISHED");
});