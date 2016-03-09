'use strict';

module.exports = [
  { field: 'iso'},
  { field: 'iso3'},
  { field: 'isoNumeric'},
  { field: 'fips'},
  { field: 'country'},
  { field: 'capital'},
  { field: 'area'},
  { field: 'population'},
  { field: 'continent'},
  { field: 'tld'},
  { field: 'currencyCode'},
  { field: 'currencyName'},
  { field: 'phone'},
  { field: 'postalCodeFormat'},
  { field: 'postalCodeRegex'},
  { field: 'languages'},
  { field: 'geonameid'},
  { field: 'neighbours'},
  { field: 'equivalentFipsCode'}
];

function bool(val) {
  return val === 1;
}