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
    var startYear = '&start_date=01012018';

    // build queryURL
    var nytApiKey = 'GAN5Vuqp6dyl6vNHxlmwbLizhaZMVVf6';
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
