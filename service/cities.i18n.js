#!/usr/bin/env node

'use strict';

var fs       = require('fs'),
    split    = require("split"),
    storage  = require('../lib/storage'),
    geonames = require('../lib/geonames'),
    Promise  = require('bluebird'),
	nconf    = require('nconf');

nconf.file({ file: '../config/config.json'});

console.time('Parse locales task');

function parseLocale(locale) {
	var dataSets = [],
		line = 0,
		path = '../data/i18n/',
		ids  = [],
		duplicate = 0;

	return new Promise(function(resolve, reject){
		console.time('parse countrie locale info - ' + locale);
		var s = fs.createReadStream(path + locale + '.txt')
			.pipe(split())
			.pipe(geonames.i18n())
		    .on('data', function (data) {
		    	try {
		    		var item = JSON.parse(data);

		    		if (ids.indexOf(item.geonameid) != -1) {
		    			++duplicate;
		    			ids = [];
		    		} else {
		    			dataSets.push(item);
		    			++line;
		    		}

		    		ids.push(item.geonameid);
		    	} catch(e) {
	    			console.log(data);
		    	}
		  	})
		  	.on('end', function() {
		  		console.log('Duplicates: ' + duplicate);
		  		resolve(dataSets);
		  		console.timeEnd('parse countrie locale info - ' + locale);
		  	});
  	}).then(function(data) {
  		return saveLocale(data);
  	});
}

function saveLocale(data) {
	var citiesI18n = storage.citiesI18n(data);
	return new Promise(function(resolve, reject) {
		citiesI18n.save(function() {
			resolve();
		});
	}).then(function() {
		return citiesI18n.flushI8n();
	});
}

Promise.mapSeries(nconf.get('locales'), function(locale) {
	console.log('**** LOCALE: ' + locale + ' ****');
    return parseLocale(locale);
}).then(function() {
	console.timeEnd('Parse locales task');
    console.log("FINISHED");
});