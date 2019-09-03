$(document).ready(function() {

  // onclick CLEAR ==============================================

  $("#clear-results-button").on("click", function(event) {
    event.preventDefault();
    // empty the current top-articles div
    $("#country-information").empty();
  }); // end clear-results-button

// onclick SEARCH ======================================
  $("#search-button").on("click", function(event) {
      event.preventDefault();
      // empty the current top-articles div
      $("#country-information").empty();

      // fetch form values
      var search = $("#search-term").val().trim();

    // build queryURL
    var queryURL = "https://restcountries.eu/rest/v2/name/" + search;
      console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(results) {
        
        console.log(results[0]);

            //  keys to capture
            var countryInfoDiv = $("#country-information");

            // insert flag in Country Information header
            var flagInsert = $("#flag");
            var flagSRC = results[0].flag;
            console.log(flagSRC);
            var flagImg = $("<img>");
            flagImg.attr("src",flagSRC);
            flagInsert.append(flagImg);

            var name = results[0].name;
            var pName = $("<h4>").html(name);
 
            var capital = results[0].capital;
            var pCapital = $("<p>").html("<b>Capital:</b> " + capital);

            var subRegion = results[0].subregion;
            var pSubRegion = $("<p>").html("<b>Subregion:</b> " + subRegion);

            var region = results[0].region;
            var pRegion = $("<p>").html("<b>Region:</b> " + region);

            var borders = results[0].borders;
            var pBorders = $("<p>").html("<b>Borders With:</b> " + borders);
            
            var currency = results[0].currencies[0]["name"];
            var pCurrency = $("<p>").html("<b>Currency:</b> " + currency);

            var languages = results[0].languages[0]["name"];
            var pLanguages = $("<p>").html("<b>Language:</b> " + languages);

            var population = results[0].population;
            var pPopulation = $("<p>").html("<b>Population:</b> " + population);

            var timeZone = results[0].timezones[0];
            var pTimeZone = $("<p>").html("<b>Time Zone:</b> " + timeZone);
            
            var callingCodes = results[0].callingCodes[0];
            var pCallingCodes = $("<p>").html("<b>Calling Code(s):</b> " + callingCodes);

        // append to the country info div
        countryInfoDiv.append(pName).append(pCapital).append(pSubRegion).append(pRegion).append(pBorders).append(pCurrency).append(pLanguages).append(pPopulation).append(pTimeZone).append(pCallingCodes);
        
    }); // end ajax

  }); // end click

}); // end document.ready
