(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const keys = {
  googleMapsApikey: 'AIzaSyAAXRzfOEywj2IQRnUNL42XHdT43bu0VUg',
  accuApiKey: 'ocHoKYTrdtOpop5PXtp2BNKuyqkBfUlk',
  nytApiKey: 'GAN5Vuqp6dyl6vNHxlmwbLizhaZMVVf6',
  fixerApiKey: '231d60d3c3c46df524fec57f238b3a02',
  firebaseApiKey: 'AIzaSyD5TgHMFez2lODS4UgYrIobJSWGPtf0bI8',
  firebaseAuthDomain: 'bcs-vacay-p1.firebaseapp.com',
  firebaseDatabaseURL: 'https://bcs-vacay-p1.firebaseio.com',
  firebaseProjectId: 'bcs-vacay-p1',
  firebaseMessagingSenderId: '1029877283379',
  firebaseAppId: '1:1029877283379:web:7e7ee570b829e6699cc146',
};

exports.keys = keys;

},{}],2:[function(require,module,exports){
// require api key data
const chain = require('./apikeys');

$(document).ready(function () {
  // onclick CLEAR ==============================================

  $('#clear-results-button').on('click', function (event) {
    event.preventDefault();

    // empty the current top-articles div
    $('#top-articles').empty();
  }); // end clear-results-button

  // onclick SEARCH =============================================

  $('#search-button').on('click', function (event) {
    event.preventDefault();
    // empty the current top-articles div
    $('#top-articles').empty();
    $('.toggle-news').show();

    // fetch form values
    var search = $('#search-term').val().trim();
    var records = 5;
    var startYear = '&start_date=01012019';

    // build queryURL
    // get api key
    const nytApiKey = chain.keys.nytApiKey;
    var queryURL =
      'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' +
      search +
      startYear +
      '&api-key=' +
      nytApiKey;
    $.ajax({
      url: queryURL,
      method: 'GET',
    }).then(function (results) {
      for (var i = 0; i < records; i++) {
        //  keys to capture
        var topArticlesDiv = $('#top-articles');
        var headline = results.response.docs[i].headline.main;
        var leadPara = results.response.docs[i].lead_paragraph;
        var pubDate = new Date(results.response.docs[i].pub_date);
        var webURL = results.response.docs[i].web_url;

        var aWebURL =
          "<a href='" + webURL + "' target='_blank'>" + headline + '</a>';
        var pHeadline = $('<h5>').html(headline);
        var pArticle = $('<p>').html(leadPara + ' ' + pubDate + ' ' + aWebURL);
        // append to the top-articles div
        topArticlesDiv.append(pHeadline).append(pArticle);
      } // end for loop
    }); // end then
  }); // end onclick event
}); // end document.ready

},{"./apikeys":1}]},{},[2]);
