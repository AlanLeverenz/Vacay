const googleMapsApikey = 'AIzaSyAAXRzfOEywj2IQRnUNL42XHdT43bu0VUg';

// require('./ourApiKeys.js');

// const googleMapsApikey = require(googleMapsApikey);

// import googleMapsApikey from './ourApiKeys.js';

// import env file
// require('dotenv').config();
// const googleMapsApikey = process.env.googleMapsApikey;

// AJAX SETUP
$.ajaxSetup({
  cache: true,
});

$(document).ready(function () {
  // fade in effect to Vacay title
  $('h1').fadeIn(4000);

  //Google maps API key
  // var googleMapsApikey = "AIzaSyAAXRzfOEywj2IQRnUNL42XHdT43bu0VUg";
  // Temporary variable for current place search country value
  var userInputCountry = '';
  var userinputLatLng = [];

  // GOOGLE MAPS PLACES QUERY VAR
  var placesQuery =
    'https://maps.googleapis.com/maps/api/js?key=' +
    googleMapsApikey +
    '&libraries=places';
  jQuery.cachedScript = function (url, options) {
    // Allow user to set any option except for dataType, cache, and url
    options = $.extend(options || {}, {
      dataType: 'script',
      cache: true,
      url: url,
    });

    // console.log('googleMapsApiKey = ' + googleMapsApikey);

    // Use $.ajax() since it is more flexible than $.getScript
    // Return the jqXHR object so we can chain callbacks
    return jQuery.ajax(options);
  };
  $.cachedScript(placesQuery).done(function (script, textStatus) {
    // The input element
    var input = document.getElementById('search-term');
    // Autocomplete result restrictions
    var options = { types: ['(regions)'] };
    //Create autocomplete object
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    // Field IDK
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

    // GET COUNTRY NAME FROM AUTOCMPLETE INPUT
    autocomplete.addListener('place_changed', function () {
      var currentPlace = autocomplete.getPlace();

      if (currentPlace.address_components) {
        userInputCountry =
          currentPlace.address_components[
            currentPlace.address_components.length - 1
          ].long_name;
        userinputLatLng = [
          currentPlace.geometry.location.lat.call(),
          currentPlace.geometry.location.lng.call(),
        ];
      } // end if
    }); // end autocomlete listener
  }); // end cachedScript

  // ON CLICK EVENTS ================================================

  // onclick CLEAR ==========================================
  $('#clear-results-button').on('click', function (event) {
    event.preventDefault();
    latlng = [];
    // empty the API search results
    $('#country-information').empty();
    $('#currencyConverter').empty();
    $('#weatherRender').empty();
    $('#currencyNameCode').empty();
    $('#exchangeRateDisplay').empty();
    $('#source-code').text('');
    $('#target-code').text('');
    $('#calc-quote').text('');
    $('#googleMapsIframeDiv').hide();
    $('#itinerary-table tbody').empty();
    $('#baseCurrencyAmount').val('');
    $('#targetCurrencyAmount').val('');
    $('#search-term').val('');
    $('#flag').empty();
  }); // end clear-results-button

  // onclick ADD INVENTORY ITEM (FORM) =====================
  $('#add-itinerary-button').on('click', function (event) {
    event.preventDefault();
    $('.toggle-itinerary-form').show();
  });

  // onclick HIDE FORM =====================
  $('#hide-itinerary-form-button').on('click', function (event) {
    event.preventDefault();
    $('.toggle-itinerary-form').hide();
  });

  // onclick REMOVE ALL ITINERARY ITEMS ==============
  $('#remove-all-itinerary-button').on('click', function (event) {
    event.preventDefault();
    // empty the tbody rows
    $('#itinerary-table > tbody').empty();
    // clear the Firebase database
    vacayData.ref().remove();
  });

  // onclick to toggle weather unit type
  $(document).on('click', '#toggle-unit', function (event) {
    event.preventDefault();
    var pText = $('#unit-name').text();
    var gotUnit = pText.includes('Imperial');
    if (gotUnit == true) {
      // load weather weather
      $('#weatherRender').empty();
      loadMetricWeather();
    } else {
      // load imperial weather
      $('#weatherRender').empty();
      loadImperialWeather();
    }
  });

  // SEARCH COUNTRY, CURRENCY, WEATHER  =============================

  // function to add commas in long integers (for population, currencies)
  function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  } // end addCommas function

  $('#search-button').on('click', function (event) {
    event.preventDefault();

    // empty the country, currency, and weather child elements
    $('#country-information').empty();
    // $("#currencyConverter").empty();
    $('#weatherRender').empty();

    // remove text from currency tags
    $('#calc-quote').text('');
    $('#baseCurrencyAmount').val('');
    $('#targetCurrencyAmount').val('');
    // clear itinerary items from html table
    $('#itinerary-table > tbody').empty();
    // show cards
    $('.toggle-country').show();
    $('.toggle-currency').show();
    $('.toggle-weather').show();
    $('.toggle-news').show();
    $('.toggle-itinerary-table').show();

    //search var
    var search = '';
    // Check if user didn't use google autocomplete
    if (userInputCountry === '') {
      // fetch form values
      search = $('#search-term').val().trim();
    } else {
      search = userInputCountry;
    }

    //reset user input country
    userInputCountry = '';

    //Show google maps map thing
    $('#googleMapsIframe').attr(
      'src',
      'https://www.google.com/maps/embed/v1/place?key=' +
        googleMapsApikey +
        '&q=' +
        search
    );
    $('#googleMapsIframeDiv').show();

    // Parse search-term to get country
    if (search.includes(', ')) {
      searchArr = search.split(', ');
      search = searchArr[1];
    }

    // REST COUNTRIES API QUERY ==========================================

    var queryURL = 'https://restcountries.eu/rest/v2/name/' + search;
    $.ajax({
      url: queryURL,
      method: 'GET',
    }).then(function (results) {
      var latlng = results[0].latlng;
      var latlnglng = latlng.length;
      if (userInputCountry !== '') {
        getWeatherLatLng(userinputLatLng);
        userinputLatLng = [];
      } else if (latlnglng != 0) {
        var latlng = results[0].latlng;
        getWeatherLatLng(latlng);
      } else {
        getWeatherLatLng([40.804496782, -73.957162838]);
      }

      //  keys to capture
      var countryInfoDiv = $('#country-information');

      // insert flag in Country Information header
      $('#flag').empty();
      var flagInsert = $('#flag');
      var flagSRC = results[0].flag;
      var flagImg = $('<img>');
      flagImg.attr('src', flagSRC);
      flagImg.attr('width', '82px');
      flagImg.attr('height', '82px');
      flagImg.attr('style', 'float:right');
      flagInsert.append(flagImg);

      var name = results[0].name;
      var pName = $('<h4>').html(name);
      pName.attr('clear', 'both');

      var capital = results[0].capital;
      var pCapital = $('<p>').html('<b>Capital:</b> ' + capital);

      var subRegion = results[0].subregion;
      var pSubRegion = $('<p>').html('<b>Subregion:</b> ' + subRegion);

      var region = results[0].region;
      var pRegion = $('<p>').html('<b>Region:</b> ' + region);

      var borders = results[0].borders;
      var pBorders = $('<p>').html('<b>Borders With:</b> ' + borders);

      var currency = results[0].currencies[0]['name'];
      var code = results[0].currencies[0]['code'];
      var pCurrency = $('<p>').html(
        '<b>Currency:</b> ' + currency + ' (' + code + ')'
      );

      var languages = results[0].languages[0]['name'];
      var pLanguages = $('<p>').html('<b>Language:</b> ' + languages);

      var population = results[0].population;
      var cPopulation = addCommas(population);
      var pPopulation = $('<p>').html('<b>Population:</b> ' + cPopulation);

      var timeZone = results[0].timezones.join(', ');
      var pTimeZone = $('<p>').html('<b>Time Zones:</b> ' + timeZone);

      var callingCodes = results[0].callingCodes[0];
      var pCallingCodes = $('<p>').html(
        '<b>Calling Code(s):</b> ' + callingCodes
      );

      // append to the country information column
      countryInfoDiv
        .append(pName)
        .append(pCapital)
        .append(pSubRegion)
        .append(pRegion)
        .append(pBorders)
        .append(pCurrency)
        .append(pLanguages)
        .append(pPopulation)
        .append(pTimeZone)
        .append(pCallingCodes);

      // Display the currency name and code gathered from countries api

      $('#currencyNameCode').empty();
      var currencyDiv = $('#currencyNameCode');
      var currencyString =
        currency +
        '<span class="badge badge-light" id="select-code">' +
        code +
        '</span>';
      var currencyNameCode = $('<h4>').html(currencyString);
      currencyDiv.append(currencyNameCode);

      // hard-code the source currency as USD
      source = 'USD';
      // set and display currency quote
      displayCountryCurrency(source, code);

      // show the itinerary table
      $('#toggle-itinerary-table').show();

      // Create Firebase listener event to add a snapshot of items to the html table
      vacayData.ref().on('child_added', function (childSnapshot) {
        // Store everything in a variable
        var tDestination = childSnapshot.val().destination;
        var tArriveDate = childSnapshot.val().arriveDate;
        var tArriveVia = childSnapshot.val().arriveVia;
        var tAccommodations = childSnapshot.val().accommodations;
        var tCarRental = childSnapshot.val().carRental;
        var tDepartDate = childSnapshot.val().departDate;
        var tDepartVia = childSnapshot.val().departVia;

        // append to the itinerary table
        $('#itinerary-table > tbody').append(
          $('<tr>').append(
            $("<th scope='row'>").text(tDestination),
            $('<td>').text(tArriveDate),
            $('<td>').text(tArriveVia),
            $('<td>').text(tAccommodations),
            $('<td>').text(tCarRental),
            $('<td>').text(tDepartDate),
            $('<td>').text(tDepartVia)
          ) // end append tbody
        ); // end append tr
      }); //on child_added
    }); // end countriesREST ajax
  }); // end Search button click

  // WEATHER API ========================================

  function getWeatherLatLng(latlng) {
    var API_key = 'ocHoKYTrdtOpop5PXtp2BNKuyqkBfUlk';
    var latlengQueryURL =
      'https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=' +
      API_key +
      '&q=' +
      latlng[0] +
      '%2C' +
      latlng[1];
    $.ajax({
      url: latlengQueryURL,
      method: 'GET',
    }).then(function (results) {
      var lockey = results['Key'];
      actuallyGetWeather(lockey);
    });
  } // end getWeatherLatLng function

  // ACCUWEATHER API QUERY STORE IN LOCAL STORAGE ====================

  function actuallyGetWeather(lockey) {
    var API_key = 'ocHoKYTrdtOpop5PXtp2BNKuyqkBfUlk';
    var actualWeatherURL =
      'https://dataservice.accuweather.com/currentconditions/v1/' +
      lockey +
      '?apikey=' +
      API_key +
      '&details=true';
    $.ajax({
      url: actualWeatherURL,
      method: 'GET',
    }).then(function (results) {
      var data = results[0];

      // put data in session storage
      localStorage.setItem('period', 'Current');
      // temperature
      var iTemp = data['Temperature']['Imperial']['Value'];
      var mTemp = data['Temperature']['Metric']['Value'];
      localStorage.setItem('iTemp', iTemp);
      localStorage.setItem('mTemp', mTemp);
      // high temperature
      var iTempHigh =
        data['TemperatureSummary']['Past6HourRange']['Maximum']['Imperial'][
          'Value'
        ];
      var mTempHigh =
        data['TemperatureSummary']['Past6HourRange']['Maximum']['Metric'][
          'Value'
        ];
      localStorage.setItem('iTempHigh', iTempHigh);
      localStorage.setItem('mTempHigh', mTempHigh);
      // low temperature
      var iTempLow =
        data['TemperatureSummary']['Past6HourRange']['Minimum']['Imperial'][
          'Value'
        ];
      var mTempLow =
        data['TemperatureSummary']['Past6HourRange']['Minimum']['Metric'][
          'Value'
        ];
      localStorage.setItem('iTempLow', iTempLow);
      localStorage.setItem('mTempLow', mTempLow);
      // humidity
      var humidity = data['RelativeHumidity'];
      localStorage.setItem('humidity', humidity);
      // pressure
      var iPressure = data['Pressure']['Imperial']['Value'];
      var mPressure = data['Pressure']['Metric']['Value'];
      localStorage.setItem('iPressure', iPressure);
      localStorage.setItem('mPressure', mPressure);
      // clouds
      var clouds = data['CloudCover'];
      localStorage.setItem('clouds', clouds);
      // wind
      var iWind = data['WindGust']['Speed']['Imperial']['Value'];
      var mWind = data['WindGust']['Speed']['Metric']['Value'];
      localStorage.setItem('iWind', iWind);
      localStorage.setItem('mWind', mWind);
      // precipitation
      var iPrecipitation =
        data['PrecipitationSummary']['Past6Hours']['Imperial']['Value'];
      var mPrecipitation =
        data['PrecipitationSummary']['Past6Hours']['Metric']['Value'];
      localStorage.setItem('iPrecipitation', iPrecipitation);
      localStorage.setItem('mPrecipitation', mPrecipitation);

      // call loadImperialWeather
      loadImperialWeather();
    });
  } // end function for ActuallyGetWeather

  // LOAD WEATHER OBJECT FROM LOCAL STORAGE - IMPERIAL

  function loadImperialWeather() {
    // MEASUREMENT TYPE - IMPERIAL
    var period = 'Current';
    var pPeriod = $('<h4>').html(period);

    // SET BUTTON
    var unit = 'Imperial';
    var buttonTag = $('<button>');
    buttonTag.attr('class', 'btn btn-light click');
    buttonTag.attr('name', 'Imperial');
    buttonTag.attr('id', 'toggle-unit');
    var faTag = $('<i>');
    faTag.attr('class', 'fas fa-sync-alt');
    buttonTag.append(faTag);
    var pUnit = $('<p>').html('<b>Unit:</b> ' + unit);
    pUnit.attr('id', 'unit-name');
    pUnit.append(buttonTag);

    // TEMPERATURE
    var temp = localStorage.getItem('iTemp');
    var ptemp = $('<p>').html('<b>Temperature: </b>' + temp + ' F');

    // TEMPERATURE HIGH
    var tempHigh = localStorage.getItem('iTempHigh');
    var ptempHigh = $('<p>').html('<b>Todays high: </b>' + tempHigh + ' F');

    // TEMPERATURE LOW
    var tempLow = localStorage.getItem('iTempLow');
    var ptempLow = $('<p>').html('<b>Todays low: </b>' + tempLow + ' F');

    // HUMIDITY
    var humidity = localStorage.getItem('humidity');
    var phumidity = $('<p>').html('<b>Humidity: </b>' + humidity + '%');

    // PRESSURE
    var pressure = localStorage.getItem('iPressure');
    var ppressure = $('<p>').html('<b>Pressure: </b>' + pressure + ' inHg');

    // CLOUDS
    var clouds = localStorage.getItem('clouds');
    var pclouds = $('<p>').html('<b>Cloud Cover: </b>' + clouds);

    // WIND
    var wind = localStorage.getItem('iWind');
    var pwind = $('<p>').html('<b>Wind Gusts: </b>' + wind + ' mi/h');

    // PRECIPITATION
    var precipitation = localStorage.getItem('iPrecipitation');
    var pPrecipitation = $('<p>').html(
      '<b>Precipitation: </b>' + precipitation + ' in'
    );

    // ASSIGNING VARS TO THE APPENDING OF RETRIEVED DATA TO THE HTML CONTAINER
    var weatherRender = $('#weatherRender');
    weatherRender
      .append(pPeriod)
      .append(pUnit)
      .append(ptemp)
      .append(ptempHigh)
      .append(ptempLow)
      .append(phumidity)
      .append(ppressure)
      .append(pclouds)
      .append(pwind)
      .append(pPrecipitation);
  } // end function load imperial weather

  // LOAD WEATHER OBJECT FROM LOCAL STORAGE - METRIC

  function loadMetricWeather() {
    // MEASUREMENT TYPE - IMPERIAL
    var period = 'Current';
    var pPeriod = $('<h4>').html(period);

    // SET BUTTON
    var unit = 'Metric';
    var buttonTag = $('<button>');
    buttonTag.attr('class', 'btn btn-light click');
    buttonTag.attr('name', 'Metric');
    buttonTag.attr('id', 'toggle-unit');
    var faTag = $('<i>');
    faTag.attr('class', 'fas fa-sync-alt');
    buttonTag.append(faTag);
    var pUnit = $('<p>').html('<b>Unit:</b> ' + unit);
    pUnit.attr('id', 'unit-name');
    pUnit.append(buttonTag);

    // TEMPERATURE
    var temp = localStorage.getItem('mTemp');
    var ptemp = $('<p>').html('<b>Temperature: </b>' + temp + ' C');

    // TEMPERATURE HIGH
    var tempHigh = localStorage.getItem('mTempHigh');
    var ptempHigh = $('<p>').html('<b>Todays high: </b>' + tempHigh + ' C');

    // TEMPERATURE LOW
    var tempLow = localStorage.getItem('mTempLow');
    var ptempLow = $('<p>').html('<b>Todays low: </b>' + tempLow + ' C');

    // HUMIDITY
    var humidity = localStorage.getItem('humidity');
    var phumidity = $('<p>').html('<b>Humidity: </b>' + humidity + '%');

    // PRESSURE
    var pressure = localStorage.getItem('mPressure');
    var ppressure = $('<p>').html('<b>Pressure: </b>' + pressure + ' mbar');

    // CLOUDS
    var clouds = localStorage.getItem('clouds');
    var pclouds = $('<p>').html('<b>Cloud Cover: </b>' + clouds);

    // WIND
    var wind = localStorage.getItem('mWind');
    var pwind = $('<p>').html('<b>Wind Gusts: </b>' + wind + ' km/h');

    // PRECIPITATION
    var precipitation = localStorage.getItem('mPrecipitation');
    var pPrecipitation = $('<p>').html(
      '<b>Precipitation: </b>' + precipitation + ' mm'
    );

    // ASSIGNING VARS TO THE APPENDING OF RETRIEVED DATA TO THE HTML CONTAINER
    var weatherRender = $('#weatherRender');
    weatherRender
      .append(pPeriod)
      .append(pUnit)
      .append(ptemp)
      .append(ptempHigh)
      .append(ptempLow)
      .append(phumidity)
      .append(ppressure)
      .append(pclouds)
      .append(pwind)
      .append(pPrecipitation);
  } // end function load metric Weather

  // GET RATE FOR CURRENCY CODE ======================================
  function setCurrency(base, other) {
    var url_base = 'https://data.fixer.io/api/';
    var API_key = '231d60d3c3c46df524fec57f238b3a02';
    var endpoint = 'latest';
    var currencyURL =
      url_base +
      endpoint +
      '?access_key=' +
      API_key +
      '&base=' +
      base +
      '&symbols=' +
      other;
    $.ajax({
      url: currencyURL,
      method: 'GET',
    }).then(function (results) {
      var currencyDivID = $('#calc-quote');
      var currencyQuote = $('<p>');
      var myQuote =
        '<b>' + results.rates[Object.keys(results.rates)[0]] + '</b>';
      currencyQuote.html(myQuote);
      currencyDivID.append(currencyQuote);
    }); // end then
  } // end function setCurrency

  // DISPLAY COUNTRY CURRENCY FUNCTION ==============================
  var displayCountryCurrency = function (source, target) {
    $('#source-code').empty();
    var sourceDiv = $('#source-code');
    var currencySource = $('<p>');
    currencySource.attr('id', 'source-code-attr');
    var mySource = '<b>' + source + '</b>';
    currencySource.html(mySource);
    sourceDiv.append(currencySource);

    $('#target-code').empty();
    var targetDiv = $('#target-code');
    var currencyTarget = $('<p>');
    currencyTarget.attr('id', 'target-code-attr');
    var myTarget = '<b>' + target + '</b>';
    currencyTarget.html(myTarget);
    targetDiv.append(currencyTarget);

    setCurrency(source, target); // function call
  }; // end displayCountryCurrency

  // array of currency codes (collapsed) ----------
  var options = [
    'AED: United Arab Emirates Dirham',
    'AFN: Afghan Afghani',
    'ALL: Albanian Lek',
    'AMD: Armenian Dram',
    'ANG: Netherlands Antillean Guilder',
    'AOA: Angolan Kwanza',
    'ARS: Argentine Peso',
    'AUD: Australian Dollar',
    'AWG: Aruban Florin',
    'AZN: Azerbaijani Manat',
    'BAM: Bosnia-Herzegovina Convertible Mark',
    'BBD: Barbadian Dollar',
    'BDT: Bangladeshi Taka',
    'BGN: Bulgarian Lev',
    'BHD: Bahraini Dinar',
    'BIF: Burundian Franc',
    'BMD: Bermudan Dollar',
    'BND: Brunei Dollar',
    'BOB: Bolivian Boliviano',
    'BRL: Brazilian Real',
    'BSD: Bahamian Dollar',
    'BTC: Bitcoin',
    'BTN: Bhutanese Ngultrum',
    'BWP: Botswanan Pula',
    'BYR: Belarusian Ruble',
    'BYN: New Belarusian Ruble',
    'BZD: Belize Dollar',
    'CAD: Canadian Dollar',
    'CDF: Congolese Franc',
    'CHF: Swiss Franc',
    'CLF: Chilean Unit of Account (UF)',
    'CLP: Chilean Peso',
    'CNY: Chinese Yuan',
    'COP: Colombian Peso',
    'CRC: Costa Rican Colon',
    'CUC: Cuban Convertible Peso',
    'CUP: Cuban Peso',
    'CVE: Cape Verdean Escudo',
    'CZK: Czech Republic Koruna',
    'DJF: Djiboutian Franc',
    'DKK: Danish Krone',
    'DOP: Dominican Peso',
    'DZD: Algerian Dinar',
    'EGP: Egyptian Pound',
    'ERN: Eritrean Nakfa',
    'ETB: Ethiopian Birr',
    'EUR: Euro',
    'FJD: Fijian Dollar',
    'FKP: Falkland Islands Pound',
    'GBP: British Pound Sterling',
    'GEL: Georgian Lari',
    'GGP: Guernsey Pound',
    'GHS: Ghanaian Cedi',
    'GIP: Gibraltar Pound',
    'GMD: Gambian Dalasi',
    'GNF: Guinean Franc',
    'GTQ: Guatemalan Quetzal',
    'GYD: Guyanaese Dollar',
    'HKD: Hong Kong Dollar',
    'HNL: Honduran Lempira',
    'HRK: Croatian Kuna',
    'HTG: Haitian Gourde',
    'HUF: Hungarian Forint',
    'IDR: Indonesian Rupiah',
    'ILS: Israeli New Sheqel',
    'IMP: Manx pound',
    'INR: Indian Rupee',
    'IQD: Iraqi Dinar',
    'IRR: Iranian Rial',
    'ISK: Icelandic Króna',
    'JEP: Jersey Pound',
    'JMD: Jamaican Dollar',
    'JOD: Jordanian Dinar',
    'JPY: Japanese Yen',
    'KES: Kenyan Shilling',
    'KGS: Kyrgystani Som',
    'KHR: Cambodian Riel',
    'KMF: Comorian Franc',
    'KPW: North Korean Won',
    'KRW: South Korean Won',
    'KWD: Kuwaiti Dinar',
    'KYD: Cayman Islands Dollar',
    'KZT: Kazakhstani Tenge',
    'LAK: Laotian Kip',
    'LBP: Lebanese Pound',
    'LKR: Sri Lankan Rupee',
    'LRD: Liberian Dollar',
    'LSL: Lesotho Loti',
    'LTL: Lithuanian Litas',
    'LVL: Latvian Lats',
    'LYD: Libyan Dinar',
    'MAD: Moroccan Dirham',
    'MDL: Moldovan Leu',
    'MGA: Malagasy Ariary',
    'MKD: Macedonian Denar',
    'MMK: Myanma Kyat',
    'MNT: Mongolian Tugrik',
    'MOP: Macanese Pataca',
    'MRO: Mauritanian Ouguiya',
    'MUR: Mauritian Rupee',
    'MVR: Maldivian Rufiyaa',
    'MWK: Malawian Kwacha',
    'MXN: Mexican Peso',
    'MYR: Malaysian Ringgit',
    'MZN: Mozambican Metical',
    'NAD: Namibian Dollar',
    'NGN: Nigerian Naira',
    'NIO: Nicaraguan Córdoba',
    'NOK: Norwegian Krone',
    'NPR: Nepalese Rupee',
    'NZD: New Zealand Dollar',
    'OMR: Omani Rial',
    'PAB: Panamanian Balboa',
    'PEN: Peruvian Nuevo Sol',
    'PGK: Papua New Guinean Kina',
    'PHP: Philippine Peso',
    'PKR: Pakistani Rupee',
    'PLN: Polish Zloty',
    'PYG: Paraguayan Guarani',
    'QAR: Qatari Rial',
    'RON: Romanian Leu',
    'RSD: Serbian Dinar',
    'RUB: Russian Ruble',
    'RWF: Rwandan Franc',
    'SAR: Saudi Riyal',
    'SBD: Solomon Islands Dollar',
    'SCR: Seychellois Rupee',
    'SDG: Sudanese Pound',
    'SEK: Swedish Krona',
    'SGD: Singapore Dollar',
    'SHP: Saint Helena Pound',
    'SLL: Sierra Leonean Leone',
    'SOS: Somali Shilling',
    'SRD: Surinamese Dollar',
    'STD: Sao Tome and Principe Dobra',
    'SVC: Salvadoran Colón',
    'SYP: Syrian Pound',
    'SZL: Swazi Lilangeni',
    'THB: Thai Baht',
    'TJS: Tajikistani Somoni',
    'TMT: Turkmenistani Manat',
    'TND: Tunisian Dinar',
    'TOP: Tongan Pa’anga',
    'TRY: Turkish Lira',
    'TTD: Trinidad and Tobago Dollar',
    'TWD: New Taiwan Dollar',
    'TZS: Tanzanian Shilling',
    'UAH: Ukrainian Hryvnia',
    'UGX: Ugandan Shilling',
    'USD: United States Dollar',
    'UYU: Uruguayan Peso',
    'UZS: Uzbekistan Som',
    'VEF: Venezuelan Bolívar Fuerte',
    'VND: Vietnamese Dong',
    'VUV: Vanuatu Vatu',
    'WST: Samoan Tala',
    'XAF: CFA Franc BEAC',
    'XAG: Silver (troy ounce)',
    'XAU: Gold (troy ounce)',
    'XCD: East Caribbean Dollar',
    'XDR: Special Drawing Rights',
    'XOF: CFA Franc BCEAO',
    'XPF: CFP Franc',
    'YER: Yemeni Rial',
    'ZAR: South African Rand',
    'ZMK: Zambian Kwacha (pre-2013)',
    'ZMW: Zambian Kwacha',
    'ZWL: Zimbabwean Dollar',
  ];

  // build dropdown list of currency codes --------
  // source button
  $('#select1').empty();
  $.each(options, function (i, p) {
    $('#select1').append(
      $('<a class="dropdown-item" href="#"></a>').val(p).html(p)
    );
  });

  // quote button
  $('#select2').empty();
  $.each(options, function (i, p) {
    $('#select2').append(
      $('<a class="dropdown-item" href="#"></a>').val(p).html(p)
    );
  });

  // CONVERT CURRENCY AMOUNT =================================
  function convertAmount(from, to, amount) {
    var url_base = 'https://data.fixer.io/api/';
    var API_key = '231d60d3c3c46df524fec57f238b3a02';
    var endpoint = 'convert';
    var convertURL =
      url_base +
      endpoint +
      '?access_key=' +
      API_key +
      '&from=' +
      from +
      '&to=' +
      to +
      '&amount=' +
      amount;
    $.ajax({
      url: convertURL,
      method: 'GET',
    }).then(function (results) {
      // display amount result (with commas)
      var newAmount = results.result;
      var cNewAmount = addCommas(newAmount);
      $('#targetCurrencyAmount').val(cNewAmount);
    }); // end function
  } // end function convertAmount

  // CLICK ON CURRENCY CONVERSION BUTTONS ===========================

  // currency source
  $(document).on('click', '#select1 a', function (event) {
    event.preventDefault();
    // get Source code
    var str = $(this).text();
    var codeArr = str.split(':');
    var source = codeArr[0];
    $('#source-code').empty();
    var sourceDiv = $('#source-code');
    var currencySource = $('<p>');
    currencySource.attr('id', 'source-code-attr');
    var mySource = '<b>' + source + '</b>';
    currencySource.html(mySource);
    sourceDiv.append(currencySource);
  });

  // currency target
  $(document).on('click', '#select2 a', function (event) {
    event.preventDefault();
    // get target code
    var str = $(this).text();
    var codeArr = str.split(':');
    var target = codeArr[0];
    $('#target-code').empty();
    var targetDiv = $('#target-code');
    var currencyTarget = $('<p>');
    currencyTarget.attr('id', 'target-code-attr');
    var myTarget = '<b>' + target + '</b>';
    currencyTarget.html(myTarget);
    targetDiv.append(currencyTarget);
  });

  // button to get currency rate
  $(document).on('click', '#exchangeRateCalc', function (event) {
    event.preventDefault();
    // get source and target codes from html
    var mySource = $('#source-code p').text();
    var myTarget = $('#target-code p').text();
    // remove existing value
    $('#calc-quote').text('');
    setCurrency(mySource, myTarget);
  });

  // convert currency amount from base to target
  $(document).on('click', '#convertBaseAmount', function (event) {
    event.preventDefault();
    var from = $('#source-code').text();
    var to = $('#target-code').text();
    var amount = $('#baseCurrencyAmount').val();
    convertAmount(from, to, amount);
  });

  // button to switch currency codes and rate
  $(document).on('click', '#reverseCodesCalc', function (event) {
    event.preventDefault();
    // get source and target codes from html
    var mySource = $('#target-code p').text();
    var myTarget = $('#source-code p').text();
    // remove existing value and replace with new
    $('#calc-quote').text('');
    // setCurrency(mySource, myTarget);
    // switch the codes on the page
    displayCountryCurrency(mySource, myTarget);
  });

  // INVENTORY FIREBASE ====================================================

  // FIREBASE CODE FOR STORING INVENTORY TABLE ITEMS
  var firebaseConfig = {
    apiKey: 'AIzaSyD5TgHMFez2lODS4UgYrIobJSWGPtf0bI8',
    authDomain: 'bcs-vacay-p1.firebaseapp.com',
    databaseURL: 'https://bcs-vacay-p1.firebaseio.com',
    projectId: 'bcs-vacay-p1',
    storageBucket: '',
    messagingSenderId: '1029877283379',
    appId: '1:1029877283379:web:7e7ee570b829e6699cc146',
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // assign database to variable
  var vacayData = firebase.database();

  // ON CLICK EVENT FOR ADDING AN ITINERARY ITEM ==================

  $('#submit-itinerary-button').on('click', function (event) {
    // Prevent the default form submit behavior
    event.preventDefault();

    // Store user input in variables
    var destination = $('#destination-input').val().trim();
    var arriveDate = $('#arrive-date-input').val().trim();
    var arriveVia = $('#arrive-via-input').val().trim();
    var accommodations = $('#accommodations-input').val().trim();
    var carRental = $('#car-rental-input').val().trim();
    var departDate = $('#departure-date-input').val().trim();
    var departVia = $('#depart-via-input').val().trim();

    // Create a local "temporary" object for holding itinerary
    var newItinerary = {
      destination: destination,
      arriveDate: arriveDate,
      arriveVia: arriveVia,
      accommodations: accommodations,
      carRental: carRental,
      departDate: departDate,
      departVia: departVia,
    };

    // push the new itinerary into the referenced location in Firebase
    vacayData.ref().push(newItinerary);

    // empties the table body
    $('#itinerary-table tbody').empty();

    // clears all of the form text boxes
    $('#destination-input').val('');
    $('#arrive-date-input').val('');
    $('#arrive-via-input').val('');
    $('#accommodations-input').val('');
    $('#car-rental-input').val('');
    $('#departure-date-input').val('');
    $('#depart-via-input').val('');

    // Create Firebase listener event for adding itineraries to the database
    vacayData.ref().on('child_added', function (childSnapshot) {
      // Store everything in a variable
      var tDestination = childSnapshot.val().destination;
      var tArriveDate = childSnapshot.val().arriveDate;
      var tArriveVia = childSnapshot.val().arriveVia;
      var tAccommodations = childSnapshot.val().accommodations;
      var tCarRental = childSnapshot.val().carRental;
      var tDepartDate = childSnapshot.val().departDate;
      var tDepartVia = childSnapshot.val().departVia;

      // add a table in the html file
      $('#itinerary-table tbody').append(
        $('<tr>').append(
          $("<th scope='row'>").text(tDestination),
          $('<td>').text(tArriveDate),
          $('<td>').text(tArriveVia),
          $('<td>').text(tAccommodations),
          $('<td>').text(tCarRental),
          $('<td>').text(tDepartDate),
          $('<td>').text(tDepartVia)
        ) // end append tbody
      ); // end append tr
    }); // end vacay.ref
  }); // end submit
}); // end document.ready
