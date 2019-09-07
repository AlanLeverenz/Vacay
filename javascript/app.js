// === code for gathering data from countriesREST

$(document).ready(function() {
    // onclick CLEAR ==============================================

    $("#clear-results-button").on("click", function(event) {
        event.preventDefault();
        // empty the current top-articles div
        $("#country-information").empty();
        $("#googleMapsIframeDiv").hide();
    }); // end clear-results-button

    // onclick SEARCH ======================================
    $("#search-button").on("click", function(event) {
        event.preventDefault();
        // empty the current top-articles div
        $("#country-information").empty();

        // fetch form values
        var search = $("#search-term")
            .val()
            .trim();

        //Show google maps map thing
        $("#googleMapsIframe").attr(
            "src",
            "https://www.google.com/maps/embed/v1/place?key=AIzaSyA3L9poaBkBRy2xg-qvpF6Qyr7XTDe8gNM&q=" +
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
