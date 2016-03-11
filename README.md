#Installation
```
$ npm install geoinfo
```

#Examples
* Get countries with population more 1 million
    ```javascript
    var request  = require('request'),
        split    = require("split"),
        geoinfo  = require('geoinfo');


    request.get('http://download.geonames.org/export/dump/countryInfo.txt')
        .pipe(split())
        .pipe(geoinfo.country())
        .pipe(geoinfo.filter(function(record) {
            return record.population > 1000000;
        }))
        .on('data', function (record) {
            console.log(record);
        })
        .on('error', function(e){

        })
        .on('end', function() {
            console.log('end');
        });
    ```
* Get countries information from [countryInfo.txt](http://download.geonames.org/export/dump/countryInfo.txt) file
```javascript
    var fs       = require('fs'),
        split    = require("split"),
        geoinfo  = require('geoinfo');

    fs.createReadStream('./countryInfo.txt')
        .pipe(split())
        .pipe(geoinfo.range(52))
        .pipe(geoinfo.country())
        .once('data', function (record) {
            console.log(record);
        })
        .on('error', function(e){

        })
        .on('end', function() {
            console.log('end');
        });
```

* Get Countries translations ([see](http://www.geonames.org/export/web-services.html))
    ```javascript
    var request  = require('request'),
        split    = require("split"),
        geoinfo  = require('geoinfo');

    request.get('http://ws.geonames.org/countryInfoCSV?lang=ru&username=demo')
        .pipe(split())
        .pipe(geoinfo.range(2, 5))
        .pipe(geoinfo.countryI18n())
        .on('data', function (record) {
            console.log(record);
        })
        .on('error', function(e){

        })  
        .on('end', function() {
        });
    ```