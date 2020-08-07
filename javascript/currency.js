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
    var myQuote = '<b>' + results.rates[Object.keys(results.rates)[0]] + '</b>';
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
