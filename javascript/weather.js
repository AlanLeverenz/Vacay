var weatherToggle = $(".weathertoggle");

    // HIDES THE WEATHER WHEN DOC IS READY UNTIL SEARCH BUTTON SHOWS
    $(document).ready(function(){
    $(".weatherToggle").hide();
    });

        // SUBMIT EVENT TO INITIATE API REQUESTS AND CREATION OF DYNAMIC ELEMENTS
        var submit = 

        // SHOWS WEATHER CONTAINER
        $("#search-button").on("click", function(){
        $(".weatherToggle").show();

// USER ENTERED SEARCH TERM
var destination = $("#search-term").val();
var key = "2408bb648b3d59aedb72a072d155867d";

// AJAX API GET REQUESTS
$.ajax({
url: "http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=2408bb648b3d59aedb72a072d155867d",
dataType: "json",
type: 'GET',
data: {q:destination, appid: key, units: "imperial"}

// FUNCTIONS INITIATED UP REQUEST RETURN
}).then(function(data) {
console.log(data.list[0]);

// TEMPERATURE
  var temp = data.list[0].main.temp;
  var ptemp = $("<p>").html("<b>Current temperature: </b>" + temp);
// TEMPERATURE HIGH
  var tempHigh = data.list[0].main.temp_max;
  var ptempHigh = $("<p>").html("<b>Todays high: </b>" + tempHigh);
// TEMPERATURE LOW
  var tempLow = data.list[0].main.temp_min;
  var ptempLow = $("<p>").html("<b>Todays low: </b>" + tempLow);
// HUMIDITY
  var humidity = data.list[0].main.humidity;
  var phumidity = $("<p>").html("<b>Humidity: </b>" + humidity + "%");
// PRESSURE
  var pressure = data.list[0].main.pressure;
  var ppressure = $("<p>").html("<b>Pressure: </b>" + pressure + "mbar");
// CLOUDS
  var clouds = data.list[0].weather[0].description;
  var pclouds = $("<p>").html("<b>Clouds: </b>" + clouds);
// WIND
  var wind = data.list[0].wind.speed;
  var pwind = $("<p>").html("<b>Wind: </b>" + wind + "mph");
console.log(ptemp);


// ASSIGNING VARS TO THE APPENDING OF RETRIEVED DATA TO THE HTML CONTAINER
var weatherRender = $("#weatherRender");

weatherRender.append(ptemp).append(ptempHigh).append(ptempLow).append(phumidity).append(ppressure).append(pclouds).append(pwind);

});
})
