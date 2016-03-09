#!/usr/bin/env node

'use strict';

var fs       = require('fs'),
    split    = require("split"),
    geonames = require('../lib/geonames'),
    line = 0, dataSets = [];

console.time('Smash I18n');
var s = fs.createReadStream('../data/alternateNames.txt')
    .pipe(split())
    .pipe(geonames.smashI18n())
    .on('data', function (data) {
      ++line;
    })
    .on('end', function() {
      console.log(line);
      console.timeEnd('Smash I18n');
    });    