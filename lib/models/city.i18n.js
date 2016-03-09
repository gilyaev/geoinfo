'use strict';

module.exports = [
  { field: 'alternateNameId' },
  { field: 'geonameid' },
  { field: 'isolanguage' },
  { field: 'alternateName' },
  { field: 'isPreferredName', get: bool },
  { field: 'isShortName', get: bool },
  { field: 'isColloquial', get: bool },
  { field: 'isHistoric', get: bool }
];

function bool(val) {
  return val === 1;
}