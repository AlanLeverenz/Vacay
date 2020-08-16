$(document).ready(function () {
  // INVENTORY FIREBASE ====================================================

  // FIREBASE CODE FOR STORING INVENTORY TABLE ITEMS
  var firebaseConfig = {
    apiKey: firebaseApiKey,
    authDomain: firebaseAuthDomain,
    databaseURL: firebaseDatabaseURL,
    projectId: firebaseProjectId,
    storageBucket: '',
    messagingSenderId: firebaseMessagingSenderId,
    appId: firebaseAppId,
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
}); // end doc ready
