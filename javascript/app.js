$(document).ready(function() {

    //Google maps API key
    var googleMapsApikey = "AIzaSyAAXRzfOEywj2IQRnUNL42XHdT43bu0VUg";
    // Temporary variable for current place search country value
    var userInputCountry;

    // onclick CLEAR ==============================================
    $("#clear-results-button").on("click", function(event) {
        event.preventDefault();
        // empty the API search results
        $("#country-information").empty();
        $("#currencyConverter").empty();
        $("#weatherRender").empty();
        $("#googleMapsIframeDiv").hide();
        // NOTE: Itinerary requires both html and Firebase childSnapshot values removed
    }); // end clear-results-button
    var placesQuery =
        "https://maps.googleapis.com/maps/api/js?key=" +
        googleMapsApikey +
        "&libraries=places";
    $.getScript({
        url: placesQuery,
        dataType: "script"
    }).then(function(data, textStatus) {
        // console.log(data);
        //autocomplete search

        // The input element
        var input = document.getElementById("search-term");
        // Autocomplete result restrictions
        var options = { types: ["(regions)"] };
        //Create autocomplete object
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        //Feilds IDK
        autocomplete.setFields([
            "address_components",
            "geometry",
            "icon",
            "name"
        ]);

        // --------
        // ALAN
        // --------
        // GET COUNTRY NAME FROM AUTOCMPLETE INPUT
        autocomplete.addListener("place_changed", function() {
            var currentPlace = autocomplete.getPlace();

            if (currentPlace.address_components) {
                console.log(currentPlace.address_components);
                userInputCountry =
                    currentPlace.address_components[
                        currentPlace.address_components.length - 1
                    ].long_name;

                console.log("autocomplete", userInputCountry);
            }
        });
    });

    // onclick ADD INVENTORY ITEM (FORM) =====================
    $("#add-itinerary-button").on("click", function(event) {
        event.preventDefault();
        $(".toggle-itinerary-form").show();
    });

    // onclick SEARCH =========================================
    $("#search-button").on("click", function(event) {
        event.preventDefault();
        // empty the country, currency, and weather child elements
        $("#country-information").empty();
        // $("#currencyConverter").empty();
        $("#weatherRender").empty();
        // show cards
        $(".toggle-country").show();
        $(".toggle-currency").show();
        $(".toggle-weather").show();
        $(".toggle-itinerary-table").show();

        //search var
        var search;
        // Check if user didn't use google autocomplete
        if (userInputCountry === "") {
            // fetch form values
            search = $("#search-term")
                .val()
                .trim();
        } else {
            search = userInputCountry;
        }
        console.log(search);
        //reset user input country
        userInputCountry = "";
        //Show google maps map thing
        $("#googleMapsIframe").attr(
            "src",
            "https://www.google.com/maps/embed/v1/place?key=" +
                googleMapsApikey +
                "&q=" +
                search
        );
        $("#googleMapsIframeDiv").show();

        // parse search-term to get country
        if ( search.includes(', ')) {
            searchArr = search.split(", ")
            search = searchArr[1];
        } console.log("SEARCH COUNTRY = " + search);

        // build queryURL
        var queryURL = "https://restcountries.eu/rest/v2/name/" + search;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(results) {

            //  keys to capture
            var countryInfoDiv = $("#country-information");

            // insert flag in Country Information header
            $("#flag").empty();
            var flagInsert = $("#flag");
            var flagSRC = results[0].flag;
            var flagImg = $("<img>");
            flagImg.attr("src", flagSRC);
            flagImg.attr("width","82px");
            flagImg.attr("height","82px");
            flagImg.attr("style","float:right");
            flagInsert.append(flagImg);

            var name = results[0].name;
            var pName = $("<h4>").html(name);
            pName.attr("clear","both");

            var capital = results[0].capital;
            var pCapital = $("<p>").html("<b>Capital:</b> " + capital);

            var subRegion = results[0].subregion;
            var pSubRegion = $("<p>").html("<b>Subregion:</b> " + subRegion);

            var region = results[0].region;
            var pRegion = $("<p>").html("<b>Region:</b> " + region);

            var borders = results[0].borders;
            var pBorders = $("<p>").html("<b>Borders With:</b> " + borders);

            var currency = results[0].currencies[0]["name"];
            var code = results[0].currencies[0]["code"];
            var pCurrency = $("<p>").html("<b>Currency:</b> " + currency + " (" + code + ")");

            var languages = results[0].languages[0]["name"];
            var pLanguages = $("<p>").html("<b>Language:</b> " + languages);

            var population = results[0].population;
            var pPopulation = $("<p>").html("<b>Population:</b> " + population);

            var timeZone = results[0].timezones[0];
            var pTimeZone = $("<p>").html("<b>Time Zone:</b> " + timeZone);

            var callingCodes = results[0].callingCodes[0];
            var pCallingCodes = $("<p>").html("<b>Calling Code(s):</b> " + callingCodes
            );

        // append to the country info div
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

            // Get currency name and code -------------------------------------

            $("#currencyNameCode").empty();
            var currencyDiv = $("#currencyNameCode");
            var currencyString = currency + '<span class="badge badge-light" id="select-code">' + code + '</span>';
            var currencyNameCode = $("<h4>").html(currencyString);
            currencyDiv.append(currencyNameCode);
            
            // hard-code the source currency as USD
            source = "USD";
            // call function that uses the apilayer.net API to get exchange rate quotes
            getCurrency(source,code);

        }); // end countriesREST ajax
    }); // end Search button click


    // CURRENCY FUNCTION (gets a quote and displays it on vacay.html

    var getCurrency = function(source,code) {
        var endpoint = 'live';
        var format = "1";
        var access_key = '01b52c666cbce3e38e9f5458de93fd6c';
        var url = "http://apilayer.net/api/" + endpoint + "?access_key=" + access_key + "&currencies=" + code + "&source=" + source + "&format=" + format;
        $.ajax({
            url: url,
            dataType: 'jsonp',
            success: function(response) {
                var sourceCode  = source + code;
                var quote = response.quotes[sourceCode];
                $("#exchangeRateDisplay").empty();
                var currencyDivID = $("#exchangeRateDisplay");
                var currencyQuote = $("<p>");
                var myQuote = "<b>Exchange Rate:</b> " + quote;
                currencyQuote.html(myQuote);
                currencyDivID.append(currencyQuote);
            } // end response function
        }); // end ajax
    } // end getCurrency function


    // INVENTORY FIREBASE =============================================

    // FIREBASE CODE FOR STORING INVENTORY TABLE ITEMS
    var firebaseConfig = {
      apiKey: "AIzaSyD5TgHMFez2lODS4UgYrIobJSWGPtf0bI8",
      authDomain: "bcs-vacay-p1.firebaseapp.com",
      databaseURL: "https://bcs-vacay-p1.firebaseio.com",
      projectId: "bcs-vacay-p1",
      storageBucket: "",
      messagingSenderId: "1029877283379",
      appId: "1:1029877283379:web:7e7ee570b829e6699cc146"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // assign database to variable
    var vacayData = firebase.database();

    // Button for adding trains
  $("#add-itinerary-btn").on("click", function(event) {
    // Prevent the default form submit behavior
    event.preventDefault();

        // Grabs user input
        var destination = $("#destination-input").val().trim();
        var arriveDate = $("#arrive-date-input").val().trim();
        var arriveVia = $("#arrive-via-input").val().trim();
        var accommodations = $("#accommodations-input").val().trim();
        var carRental = $("#car-rental-input").val().trim();
        var departDate = $("#departure-date-input").val().trim();
        var departVia = $("#depart-via-input").val().trim();
        
    // Creates local "temporary" object for holding itinerary
    var newItinerary = {
        destination: destination,
        arriveDate: arriveDate,
        arriveVia: arriveVia,
        accommodations: accommodations,
        carRental: carRental,
        departDate: departDate,
        departVia: departVia
      };

    vacayData.ref().push(newItinerary);

    // logs everything to console
    console.log(newItinerary.destination);
    console.log(newItinerary.arriveDate);
    console.log(newItinerary.arriveVia);
    console.log(newItinerary.accommodations);
    console.log(newItinerary.carRental);
    console.log(newItinerary.departDate);
    console.log(newItinerary.departVia);

    console.log("Itinerary successfully added.");

    // clears all of the text boxes
    $("#destination-input").val("");
    $("#arrive-date-input").val("");
    $("#arrive-via-input").val("");
    $("#accommodations-input").val("");
    $("#car-rental-input").val("");
    $("#departure-date-input").val("");
    $("#depart-via-input").val("");

    // Create Firebase event for adding itineraries to the database and a table row
    vacayData.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    // Store everything in a variable
    var tDestination = childSnapshot.val().destination;
    var tArriveDate = childSnapshot.val().arriveDate;
    var tArriveVia = childSnapshot.val().arriveVia;
    var tAccommodations = childSnapshot.val().accommodations;
    var tCarRental = childSnapshot.val().carRental;
    var tDepartDate = childSnapshot.val().departDate;
    var tDepartVia = childSnapshot.val().departVia;

    $("#itinerary-table tbody").append(
        $("<tr>").append(
            $("<th scope='row'>").text(tDestination),
            $("<td>").text(tArriveDate),
            $("<td>").text(tArriveVia),
            $("<td>").text(tAccommodations),
            $("<td>").text(tCarRental),
            $("<td>").text(tDepartDate),
            $("<td>").text(tDepartVia),
        ) // end append tbody
    ) // end append tr
}); // end

}); // END ADD ITINERARY BUTTON

// Lets take an example in a user db:

// ref.child("Users").child("User1").setvalue("User 1");
// ref.child("Users").child("User2").setvalue("User 2");
// ref.child("Users").child("User3").setvalue("User 3");
// Now if you want to remove a specific user from the database you have to use this code:

// ref.child("Users").child("User2").removeValue();


}); // end document.ready
