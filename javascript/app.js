// AJAX SETUP
$.ajaxSetup({
    cache: true
});

$(document).ready(function() {

    //Google maps API key
    var googleMapsApikey = "AIzaSyAAXRzfOEywj2IQRnUNL42XHdT43bu0VUg";
    // Temporary variable for current place search country value
    var userInputCountry = "";
    var userinputLatLng = [];

    // GOOGLE MAPS PLACES QUERY VAR
    var placesQuery =
        "https://maps.googleapis.com/maps/api/js?key=" +
        googleMapsApikey +
        "&libraries=places";
    jQuery.cachedScript = function(url, options) {
        // Allow user to set any option except for dataType, cache, and url
        options = $.extend(options || {}, {
            dataType: "script",
            cache: true,
            url: url
        }); 

        // Use $.ajax() since it is more flexible than $.getScript
        // Return the jqXHR object so we can chain callbacks
        return jQuery.ajax(options);
    };
    $.cachedScript(placesQuery).done(function(script, textStatus) {
        // The input element
        var input = document.getElementById("search-term");
        // Autocomplete result restrictions
        var options = { types: ["(regions)"] };
        //Create autocomplete object
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        // Field IDK
        autocomplete.setFields([
            "address_components",
            "geometry",
            "icon",
            "name"
        ]);

        // GET COUNTRY NAME FROM AUTOCMPLETE INPUT
        autocomplete.addListener("place_changed", function() {
            var currentPlace = autocomplete.getPlace();

            if (currentPlace.address_components) {
                // console.log(currentPlace.address_components);
                userInputCountry =
                    currentPlace.address_components[
                        currentPlace.address_components.length - 1
                    ].long_name;
                userinputLatLng = [
                    currentPlace.geometry.location.lat.call(),
                    currentPlace.geometry.location.lng.call()
                ];
                console.log("userinput latlng", userinputLatLng);
            } // end if
        }); // end autocomlete listener
    }); // end cachedScript

    // onclick CLEAR ==========================================
    $("#clear-results-button").on("click", function(event) {
        event.preventDefault();
        latlng = [];
        // empty the API search results
        $("#country-information").empty();
        $("#currencyConverter").empty();
        $("#weatherRender").empty();
        $("#currencyNameCode").empty();
        $("#exchangeRateDisplay").empty();
        $("#source-code").text("");
        $("#target-code").text("");
        $("#calc-quote").text("");
        $("#googleMapsIframeDiv").hide();
    }); // end clear-results-button

    // onclick ADD INVENTORY ITEM (FORM) =======================
    $("#add-itinerary-button").on("click", function(event) {
        event.preventDefault();
        $(".toggle-itinerary-form").show();
    });

    // onclick HIDE FORM =====================
    $("#hide-itinerary-form-button").on("click", function(event) {
        event.preventDefault();
        $(".toggle-itinerary-form").hide();
    });

    // onclick REMOVE LAST ITINERARY ITEM ==============
    $("#remove-last-itinerary-button").on("click", function(event) {
        event.preventDefault();

// code here to remove the "last" itinerary item. Needs to be sorted by date.

    });


    // SEARCH COUNTRY, CURRENCY, WEATHER  ========================
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
        $(".toggle-news").show();
        $(".toggle-itinerary-table").show();

        //search var
        var search = "";
        // Check if user didn't use google autocomplete
        if (userInputCountry === "") {
            // fetch form values
            search = $("#search-term")
                .val()
                .trim();
            console.log(search);
        } else {
            search = userInputCountry;
        }
        console.log("search country result", search);

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
        if (search.includes(", ")) {
            searchArr = search.split(", ");
            search = searchArr[1];
        }
        console.log("SEARCH COUNTRY = " + search);


        // REST COUNTRIES API QUERY ==========================================

        var queryURL = "https://restcountries.eu/rest/v2/name/" + search;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(results) {
            var latlng = results[0].latlng;
            var latlnglng = latlng.length;
            console.log("latlng leng", latlng.length);
            if (userInputCountry !== "") {
                getWeatherLatLng(userinputLatLng);
                userinputLatLng = [];
            } else if (latlnglng != 0) {
                console.log(results[0]);
                var latlng = results[0].latlng;
                console.log("latlng", latlng);
                getWeatherLatLng(latlng);
            } else {
                getWeatherLatLng([40.804496782, -73.957162838]);
            }

            //  keys to capture
            var countryInfoDiv = $("#country-information");

            // insert flag in Country Information header
            $("#flag").empty();
            var flagInsert = $("#flag");
            var flagSRC = results[0].flag;
            var flagImg = $("<img>");
            flagImg.attr("src", flagSRC);
            flagImg.attr("width", "82px");
            flagImg.attr("height", "82px");
            flagImg.attr("style", "float:right");
            flagInsert.append(flagImg);

            var name = results[0].name;
            var pName = $("<h4>").html(name);
            pName.attr("clear", "both");

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
            var pCurrency = $("<p>").html(
                "<b>Currency:</b> " + currency + " (" + code + ")"
            );

            var languages = results[0].languages[0]["name"];
            var pLanguages = $("<p>").html("<b>Language:</b> " + languages);

            var population = results[0].population;
            var pPopulation = $("<p>").html("<b>Population:</b> " + population);

            var timeZone = results[0].timezones[0];
            var pTimeZone = $("<p>").html("<b>Time Zone:</b> " + timeZone);

            var callingCodes = results[0].callingCodes[0];
            var pCallingCodes = $("<p>").html(
                "<b>Calling Code(s):</b> " + callingCodes
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

            // Get currency name and code ===============================

            $("#currencyNameCode").empty();
            var currencyDiv = $("#currencyNameCode");
            var currencyString =
                currency +
                '<span class="badge badge-light" id="select-code">' +
                code +
                "</span>";
            var currencyNameCode = $("<h4>").html(currencyString);
            currencyDiv.append(currencyNameCode);

            // hard-code the source currency as USD
            source = "USD";
            // // set jQuery DOM location for quote to be displayed
            // var display = $("#exchangeRateDisplay");
            // call function that uses the apilayer.net API to get exchange rate quotes
            displayCountryCurrency(source, code);
        }); // end countriesREST ajax
    }); // end Search button click


    // FUNCTION FOR GETTING LATTITUE AND LONGITUDE COORDINATES ===========

    function getWeatherLatLng(latlng) {
        var latlengQueryURL =
            "https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=ocHoKYTrdtOpop5PXtp2BNKuyqkBfUlk&q=" +
            latlng[0] +
            "%2C" +
            latlng[1];
        $.ajax({
            url: latlengQueryURL,
            method: "GET"
        }).then(function(results) {
            var lockey = results["Key"];
            actuallyGetWeather(lockey);
        });
    } // end getWeatherLatLng function

    // ACCUWEATHER API QUERY FUNCTION ================================

    function actuallyGetWeather(lockey) {
        var actualWeatherURL =
            "https://dataservice.accuweather.com/currentconditions/v1/" +
            lockey +
            "?apikey=ocHoKYTrdtOpop5PXtp2BNKuyqkBfUlk&details=true";
        $.ajax({
            url: actualWeatherURL,
            method: "GET"
        }).then(function(results) {
            var data = results[0];
            var period = "Current";
            var pPeriod = $("<h4>").html(period);
            // TEMPERATURE
            var temp = data["Temperature"]["Imperial"]["Value"];
            var ptemp = $("<p>").html("<b>Temperature: </b>" + temp);
            // TEMPERATURE HIGH
            var tempHigh =
                data["TemperatureSummary"]["Past6HourRange"]["Maximum"][
                    "Imperial"
                ]["Value"];
            var ptempHigh = $("<p>").html("<b>Todays high: </b>" + tempHigh);
            // TEMPERATURE LOW
            var tempLow =
                data["TemperatureSummary"]["Past6HourRange"]["Minimum"][
                    "Imperial"
                ]["Value"];
            var ptempLow = $("<p>").html("<b>Todays low: </b>" + tempLow);
            // HUMIDITY
            var humidity = data["RelativeHumidity"];
            var phumidity = $("<p>").html("<b>Humidity: </b>" + humidity + "%");
            // PRESSURE
            var pressure = data["Pressure"]["Imperial"]["Value"];
            var ppressure = $("<p>").html(
                "<b>Pressure: </b>" + pressure + "mbar"
            );
            // CLOUDS
            var clouds = data["CloudCover"];
            var pclouds = $("<p>").html("<b>Clouds: </b>" + clouds);
            // WIND
            var wind = data["WindGust"]["Speed"]["Imperial"]["Value"];
            var pwind = $("<p>").html("<b>Wind: </b>" + wind + "mph");

            // ASSIGNING VARS TO THE APPENDING OF RETRIEVED DATA TO THE HTML CONTAINER
            var weatherRender = $("#weatherRender");
            weatherRender
                .append(pPeriod)
                .append(ptemp)
                .append(ptempHigh)
                .append(ptempLow)
                .append(phumidity)
                .append(ppressure)
                .append(pclouds)
                .append(pwind);
        }); // end then response
    } // end function for ActuallyGetWeather


    // TEST NEW CURRENCY - EXCHANGE RATES API QUERY ======================

    function setCurrency(source, other) {
        var currencyTestURl =
            "https://api.exchangeratesapi.io/latest?base=" +
            source +
            "&symbols=" +
            other;
        $.ajax({
            url: currencyTestURl,
            method: "GET"
        }).then(function(results) {
            console.log(results);
            var currencyDivID = $("#calc-quote");
            var currencyQuote = $("<p>");
            var myQuote =
                "<b>" + results.rates[Object.keys(results.rates)[0]] + "</b>";
            currencyQuote.html(myQuote);
            currencyDivID.append(currencyQuote);
        });
    } // end function testNewCurrency

        // DISPLAY COUNTRY CURRENCY FUNCTION ==============================
        var displayCountryCurrency = function (source,target) {

            $("#source-code").empty();
            var sourceDiv = $("#source-code");
            var currencySource = $("<p>");
            currencySource.attr("id", "source-code-attr");
            var mySource = "<b>" + source + "</b>";
            currencySource.html(mySource);
            sourceDiv.append(currencySource);
    
            $("#target-code").empty();
            var targetDiv = $("#target-code");
            var currencyTarget = $("<p>");
            currencyTarget.attr("id", "target-code-attr");
            var myTarget = "<b>" + target + "</b>";
            currencyTarget.html(myTarget);
            targetDiv.append(currencyTarget);
    
            setCurrency(source, target);
    
        }; // end displayCountryCurrency

    // array of currency codes
    var options = [
        "AUD",
        "BGN",
        "BRL",
        "CAD",
        "CHF",
        "CNY",
        "CZK",
        "DKK",
        "EUR",
        "GBP",
        "HKD",
        "HRK",
        "HUF",
        "IDR",
        "ILS",
        "INR",
        "ISK",
        "JPY",
        "KRW",
        "MXN",
        "MYR",
        "NOK",
        "NZD",
        "PHP",
        "PLN",
        "RON",
        "RUB",
        "SEK",
        "SGD",
        "THB",
        "TRY",
        "USD",
        "ZAR"
    ];

    // INSERT ARRAY INTO BUTTON DROPDOWNS --------
    // source button
    $("#select1").empty();
    $.each(options, function(i, p) {
        $("#select1").append(
            $('<a class="dropdown-item" href="#"></a>')
                .val(p)
                .html(p)
        );
    });

    // quote button
    $("#select2").empty();
    $.each(options, function(i, p) {
        $("#select2").append(
            $('<a class="dropdown-item" href="#"></a>')
                .val(p)
                .html(p)
        );
    });



    // CLICK ON CURRENCY CONVERSION BUTTONS ===========================

    // currency source
    $(document).on("click", "#select1 a", function() {
        // get Source code
        var source = $(this).text();
        // console.log("source = " + source);

        $("#source-code").empty();
        var sourceDiv = $("#source-code");
        var currencySource = $("<p>");
        currencySource.attr("id", "source-code-attr");
        var mySource = "<b>" + source + "</b>";
        currencySource.html(mySource);
        sourceDiv.append(currencySource);
    });

    // currency target
    $(document).on("click", "#select2 a", function() {
        // get target code
        var target = $(this).text();
        // console.log("source = " + target);

        $("#target-code").empty();
        var targetDiv = $("#target-code");
        var currencyTarget = $("<p>");
        currencyTarget.attr("id", "target-code-attr");
        var myTarget = "<b>" + target + "</b>";
        currencyTarget.html(myTarget);
        targetDiv.append(currencyTarget);
    });

    // currency target
    $(document).on("click", "#exchangeRateCalc", function() {
        // get source and target codes from html
        var mySource = $("#source-code p").text();
        var myTarget = $("#target-code p").text();

        setCurrency(mySource, myTarget);

    });

    // INVENTORY FIREBASE ====================================================

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

    // ON CLICK EVENT FOR ADDING AN ITINERARY ITEM ==================

    $("#add-itinerary-btn").on("click", function(event) {
        // Prevent the default form submit behavior
        event.preventDefault();

        // Grabs user input
        var destination = $("#destination-input")
            .val()
            .trim();
        var arriveDate = $("#arrive-date-input")
            .val()
            .trim();
        var arriveVia = $("#arrive-via-input")
            .val()
            .trim();
        var accommodations = $("#accommodations-input")
            .val()
            .trim();
        var carRental = $("#car-rental-input")
            .val()
            .trim();
        var departDate = $("#departure-date-input")
            .val()
            .trim();
        var departVia = $("#depart-via-input")
            .val()
            .trim();

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

        // hide the itinerary form
        $("#toggle-itinerary-form").hide();

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
        vacayData
            .ref()
            .on("child_added", function(childSnapshot, prevChildKey) {
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
                        $("<td>").text(tDepartVia)
                    ) // end append tbody
                ); // end append tr
            }); // end vacay.ref
    }); // END ADD ITINERARY BUTTON
}); // end document.ready

// ref.child("Users").child("User1").setvalue("User 1");
// ref.child("Users").child("User2").setvalue("User 2");
// ref.child("Users").child("User3").setvalue("User 3");
// Now if you want to remove a specific user from the database you have to use this code:

// ref.child("Users").child("User2").removeValue();
