![Vacay](/images/readme-images/vacay-horse-title.png)

## What it does

Vacay is an app that provides travelers with a snapshot of information about countries they plan to visit. The categories of information offered using API connections are basic country statistics, a dynamic map (Google), weather (AccuWeather), and currency (DataFixer). A New York Times API provides 5 articles pertaining to the selected country. An itinerary form allows the user to store information about their trip plans.

![Categories](/images/readme-images/categories.png)

## How it works

After clicking "Let's Go" in the splash page, the app presents a search box to enter a country, or a city. Once a search occurs, all the categories of country information are returned and displayed.

### Search

The user can enter a city or country and Google will list matching search terms from its database. After setting the search query, press the Return key or click the **Search** button.

![Search](/images/readme-images/search-buttons.png)

### Country data

![Country Data](/images/readme-images/country-weather-currency-columns.png)

**Country stats.** Lists basic information and statistics, such as language, population, capitol city, bordering countries, and currency.

**Weather.** The weather's geographic location is the region of the capitol city. The user can switch between Metric and Imperial measurements, i.e., Celsius versus Fahrenheit temperatures, kilometers versus miles.

**Currency.** The country's currency rate is measured against the US dollar. The user can actually select their own base and target rate currencies. The currency calculator applies the current base/target currencies.

![Currency](/images/readme-images/currency-converter.png)

### News

![News](images/readme-images/nytimes-articles.png)

Five New York Times articles are returned from the country search query. These are intended to give the user current information that may be relevant to their travels.

### Itinerary

![Itinerary](images/readme-images/itinerary-columns.png)

![Itinerary](images/readme-images/itinerary-list.png)

Click **Add Itinerary** button to create an itinerary item.

Click **Submit** to save the itinerary item.

Other buttons to click are:

**Remove All**. Removes all itinerary items from the Firebase database.

**Hide Form**. Hides the form to reduce the size of the web page.

## Technology

### API's

There are six API's at work in this web app.

1. Country Data. https://restcountries.eu

2. Google Maps. https://www.google.com/maps

3. AcccuWeather. https://dataservice.accuweather.com.

4. Currency. https://data.fixer.io.

5. NY Times. https://api.nytimes.com/

6. Google Firebase. https://firebase.google.com

### NoSQL Database

The itinerary uses Google's Firebase noSQL database.

### Browserify

API key management made it necessary to install Browserify as a NodeJS dependency.

https://github.com/browserify/browserify

Browserify supports client-side browsers by bundling JavaScript files with 'require' declarations that import external modules. This is useful in the absence of a nodeJS server that normally handles module imports/exports.

Browersify uses the following CLI to generate a bundle file, which is inserted in the HTML file's script tag, e.g.:

```
$ browserify app.js > bundle.js

<script type="text/javascript" src="bundle.js"></script>

```

The URL to the app is https://alanleverenz.github.io/Vacay/
