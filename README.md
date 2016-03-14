GEO infromation parser from [geonames service](http://www.geonames.org). For more information please check [Info](http://download.geonames.org/export/dump/readme.txt) and [documentation](http://www.geonames.org/export/web-services.html) topics.

#Installation
```
$ npm install geoinfo
```

##Examples
* Get countries with population more 1 million
    ```javascript
    var request  = require('request'),
        split    = require('split'),
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
        split    = require('split'),
        geoinfo  = require('geoinfo');

    fs.createReadStream('./countryInfo.txt')
        .pipe(split())
        .pipe(geoinfo.range(52)) //start parse file from 52 line
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
        split    = require('split'),
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

* Get cities informations

```javascript
    var fs      = require('fs'),
        split   = require('split'),
        geoinfo = require('geoinfo');

    fs.createReadStream('./cities15000.txt')
        .pipe(split())
        .pipe(geoinfo.city())
        .pipe(geoinfo.filter(function(record) {
            //filter cities by admin and country code
            return record.adminCode1  == 16 && record.countryCode == 'UA';
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

* Get admin code information (admin1CodesASCII.txt and admin2Codes.txt) 
```javascript
    var split    = require('split'),
        geoinfo  = require('geoinfo'),
        request  = require('request');

    request.get('http://download.geonames.org/export/dump/admin1CodesASCII.txt')
        .pipe(split())
        .pipe(geoinfo.admin1CodesASCII())
        .on('data', function (record) {
            console.log(record);
        })
        .on('error', function(e){

        })  
        .on('end', function() {

        });

    request.get('http://download.geonames.org/export/dump/admin1CodesASCII.txt')
        .pipe(split())
        .pipe(geoinfo.admin1CodesASCII())
        .pipe(geoinfo.filter(function(record) {
            //filter admin code by codes field (get information for USA admin code)
            return record.codes.indexOf('US.') != -1;
        }))
        .on('data', function (record) {
            console.log(record);
        })
        .on('error', function(e){

        })  
        .on('end', function() {
            
        });

    //code for the second administrative division, a county in the US
    request.get('http://download.geonames.org/export/dump/admin2Codes.txt')
        .pipe(split())
        .pipe(geoinfo.admin1CodesASCII())
        .on('data', function (record) {
            console.log(record);
        })
        .on('error', function(e){

        })  
        .on('end', function() {
            
        });
```

##API

##geoinfo.filter(callback)

####Parameters

**callback**

Function to test each element of the data collection. Invoked with arguments (record). Return true to keep the element, false otherwise.

####Example
```js
    geoinfo.filter(function(country) {
        return country.iso2 = 'US';
    });
```

##geoinfo.range(start, length)

####Parameters

**start**

An integer greater than or equal to zero representing the offset for the start of the Range  

**length**

An integer greater than or equal to zero representing the count of row that should be taken. If length not specified the data will taken from start to end of collection.

####Example
```js
    geoinfo.range(2, 10); //gets 10 records from line 2 to line 12
```

### geoinfo.city()

Parse city information from files: *cities1000.txt, cities5000.txt, cities15000.text*. Returns the city object. 

####Example of city object
```js
{
    geonameid: '4046704',
    name: 'Fort Hunt',
    asciiname: 'Fort Hunt',
    alternatenames: '',
    lat: '38.73289',
    lng: '-77.05803',
    featureClass: 'P',
    featureCode: 'PPL',
    countryCode: 'US',
    cc2: '',
    adminCode1: 'VA',
    adminCode2: '059',
    adminCode3: '',
    adminCode4: '',
    population: '16045',
    elevation: '10',
    dem: '16',
    timezone: 'America/New_York',
    updated: '2011-05-14'
}
```

### geoinfo.country()

Parse country information from file *countryInfo.txt*. Returns the country object. 

####Example of country object
```js
{
    iso2: 'AD',
    iso3: 'AND',
    isoNumeric: '020',
    fips: 'AN',
    country: 'Andorra',
    capital: 'Andorra la Vella',
    area: '468',
    population: '84000',
    continent: 'EU',
    tld: '.ad',
    currencyCode: 'EUR',
    currencyName: 'Euro',
    phone: '376',
    postalCodeFormat: 'AD###',
    postalCodeRegex: '^(?:AD)*(\\d{3})$',
    languages: 'ca',
    geonameid: '3041565',
    neighbours: 'ES,FR'
}
```

### geoinfo.admin1CodesASCII()

Parse admin code information from files: *admin1CodesASCII.txt, admin2Codes.txt*. Returns the admin code object. 

####Example of admin code object
```js
{
    codes: 'AD.06',
    name: 'Sant Julià de Loria',
    asciiname: 'Sant Julia de Loria',
    geonameid: '3039162'
}
```

### geoinfo.countryI18n()

Parse country alternates names from http://ws.geonames.org/countryInfoCSV endpoint (for more details please check [geonames documentation](http://www.geonames.org/export/web-services.html). Returns i18n object

####Example of i18n object
```js
{
    iso: 'AI',
    iso3: 'AIA',
    isoNumeric: '660',
    fips: 'AV',
    name: '安圭拉',
    capital: '山谷市',
    area: '102.0',
    population: '13254',
    continent: 'NA',
    languages: 'en-AI',
    currency: 'XCD',
    geonameid: '3573511'
}
```

### geoinfo.i18n()

Parse alternates names from alternateNames.zip file.

####Example returns object
```js
{
    alternateNameId: '1556376',
    geonameid: '49518',
    isolanguage: 'es',
    alternateName: 'Ruanda',
    isPreferredName: '1',
    isShortName: '1',
    isColloquial: ''
}
```