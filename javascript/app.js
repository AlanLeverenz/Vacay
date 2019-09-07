// === code for gathering data from countriesREST

$(document).ready(function() {
    //Google maps API key
    var googleMapsApikey = "AIzaSyAAXRzfOEywj2IQRnUNL42XHdT43bu0VUg";
    // Temporary variable for current place search country value
    var userInputCountry;

    // onclick CLEAR ==============================================
    $("#clear-results-button").on("click", function(event) {
        event.preventDefault();
        // empty the current top-articles div
        $("#country-information").empty();
        $("#googleMapsIframeDiv").hide();
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

        // -----------
        // ALANNNNN
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
    // onclick SEARCH ======================================
    $("#search-button").on("click", function(event) {
        event.preventDefault();
        // empty the current top-articles div
        $("#country-information").empty();

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
            flagImg.attr("src", flagSRC);
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
        }); // end ajax
    }); // end click

    // var firebaseConfig = {
    //   apiKey: "AIzaSyAcPU6hT3d3dhhypK3w3sJOOFTM9-ZQQV4",
    //   authDomain: "vacay-project1.firebaseapp.com",
    //   databaseURL: "https://vacay-project1.firebaseio.com",
    //   projectId: "vacay-project1",
    //   storageBucket: "",
    //   messagingSenderId: "1002876054986",
    //   appId: "1:1002876054986:web:5e247e0ba1f7218504f333"
    // };

    // var firebaseConfig = {
    //   apiKey: "AIzaSyD5TgHMFez2lODS4UgYrIobJSWGPtf0bI8",
    //   authDomain: "bcs-vacay-p1.firebaseapp.com",
    //   databaseURL: "https://bcs-vacay-p1.firebaseio.com",
    //   projectId: "bcs-vacay-p1",
    //   storageBucket: "",
    //   messagingSenderId: "1029877283379",
    //   appId: "1:1029877283379:web:7e7ee570b829e6699cc146"
    // };

    // // Initialize Firebase
    // firebase.initializeApp(firebaseConfig);

    // // Initialize Firebase
    // firebase.initializeApp(firebaseConfig);

    // var vacayData = firebase.database();

    //
    //
    // FIREBASE CODING HERE
    //
    //   //

    //             var callingCodes = results[0].callingCodes[0];
    //             var pCallingCodes = $("<p>").html(
    //                 "<b>Calling Code(s):</b> " + callingCodes
    //             );

    //             // append to the country info div
    //             countryInfoDiv
    //                 .append(pName)
    //                 .append(pCapital)
    //                 .append(pSubRegion)
    //                 .append(pRegion)
    //                 .append(pBorders)
    //                 .append(pCurrency)
    //                 .append(pLanguages)
    //                 .append(pPopulation)
    //                 .append(pTimeZone)
    //                 .append(pCallingCodes);
    //         }); // end ajax
    //     }); // end click

    //     var firebaseConfig = {
    //         apiKey: "AIzaSyAcPU6hT3d3dhhypK3w3sJOOFTM9-ZQQV4",
    //         authDomain: "vacay-project1.firebaseapp.com",
    //         databaseURL: "https://vacay-project1.firebaseio.com",
    //         projectId: "vacay-project1",
    //         storageBucket: "",
    //         messagingSenderId: "1002876054986",
    //         appId: "1:1002876054986:web:5e247e0ba1f7218504f333"
    //     };
    //     // Initialize Firebase
    //     firebase.initializeApp(firebaseConfig);

    //     // Initialize Firebase
    //     firebase.initializeApp(firebaseConfig);

    //     var vacayData = firebase.database();

    //     //
    //     //
    //     // FIREBASE CODING HERE
    //     //
    //     //
}); // end document.ready
