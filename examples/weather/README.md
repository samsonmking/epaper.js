# Example Weather Station

Displays current weather from [OpenWeather](https://openweathermap.org/) for a US zip code.

## Usage

1. Install [http-server](https://www.npmjs.com/package/http-server)
2. [Register for free API Key from OpenWeather](https://openweathermap.org/appid)
3. In this directory execute: `http-server`
4. Open `http://localhost:8080/?zip=<us_zip_code>&apiKey=<open_weather_api_key>`

## Query Parameters

| Parameter | Allowed Values      |
| --------- | ------------------- |
| zip       | US 5 digit zip code |
| apiKey    | OpenWeather Api Key |
