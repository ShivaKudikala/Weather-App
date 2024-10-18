const DisplayDiv = document.querySelector(".info-div");

const InputValue = document.querySelector("#input");

const SearchBtn = document.querySelector(".search-btn");

const LocationBtn = document.querySelector(".location-btn");

const LocationName = document.querySelector(".location-name");

const LocationTemp = document.querySelector(".location-temp");

const LocationWind = document.querySelector(".location-wind");

const LocationHumidity = document.querySelector(".location-humidity");

const ForecastDiv = document.querySelector("#forecast"); // For the 5-day forecast

const FullForecast = document.querySelector("#full-forecast");

const ApiKey = '2ef9063df0f763a1f287353c9ca53e46';
const today = new Date().toLocaleDateString("en-IN", {weekday: 'long', month: 'short', day: 'numeric'});

SearchBtn.addEventListener("click", GetWeatherByInput);
LocationBtn.addEventListener("click", GetWeatherByLocation)

async function GetWeatherByInput() {

    const Location = InputValue.value;

    if (!Location) {
        alert("Please Enter Location");
        return;
    }

    // URL for current weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${Location}&APPID=${ApiKey}&units=metric`;

    // URL for 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${Location}&appid=${ApiKey}&units=metric`;

    const today = new Date().toLocaleDateString("en-IN", {weekday: 'long', month: 'short', day: 'numeric'});

    FullForecast.classList.remove('hidden');
    // ***** Fetch Current Weather Report *******
    try {
       
        const response = await fetch(currentWeatherUrl);
        const data = await response.json();

        if (data.cod === "404" || data.cod === "401") {
            LocationName.innerHTML = "Location not found. Please enter a valid location!";
            return;
        }

        // Display Current Weather
        LocationName.innerHTML = `Location: ${data.name}, ${data.sys.country} (${today})`;
        LocationTemp.innerHTML = `Temperature: ${data.main.temp}°C`;
        LocationWind.innerHTML = `Wind Speed: ${data.wind.speed} m/s`;
        LocationHumidity.innerHTML = `Humidity: ${data.main.humidity}%`;

        // Display Weather Icon
        const LocationIcon = document.querySelector(".weather-icon");
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        LocationIcon.src = iconUrl;
        document.querySelector(".weather-condition").innerHTML = data.weather[0].description;
        
    } catch (error) {
        console.log(error);
        LocationName.innerHTML = error;
    }

    // ***** Fetch 5-Day Forecast ******
    try {
        const response2 = await fetch(forecastUrl);
        const data2 = await response2.json();

        if (response2.ok) {
            displayForecast(data2);  // Call the function to display 5-day forecast
        } else {
            alert("City not found or invalid API response.");
        }
    } catch (error) {
        console.error("Error fetching the weather data:", error);
        alert("Error fetching weather data. Please try again later.");
    }
}

// Function to display 5-day forecast
function displayForecast(data) {
    ForecastDiv.innerHTML = ''; // Clear any existing forecast data

    const daysMap = {};
    let daysCount = 0;
    const today = new Date().toLocaleDateString("en-IN", {weekday: 'long', month: 'short', day: 'numeric'});

    // Loop through the forecast data (3-hour intervals)
    data.list.forEach(item => {
        const date = new Date(item.dt_txt).toLocaleDateString("en-IN", {
            weekday: 'long', month: 'short', day: 'numeric'
        });

        // Skip the current day and limit to next 5 days
        if (date !== today && !daysMap[date] && daysCount < 5) {
            daysMap[date] = {
                date: date,
                temp: item.main.temp,
                humidity: item.main.humidity,
                wind: item.wind.speed,
                icon: item.weather[0].icon,
                description: item.weather[0].description
            };
            daysCount++;  // Increment the days counter
        }
    });

    // Iterate over the map and display the forecast for each of the next 5 days
    for (const day in daysMap) {
        const forecastData = daysMap[day];
        ForecastDiv.innerHTML += `
            <div class="w-1/5 m-2 md:m-1 p-2 lg:w-1/4 lg:m-2 bg-gray-400 flex flex-col justify-center items-center">
                <h3 class="font-bold">${forecastData.date}</h3>
                <img src="https://openweathermap.org/img/wn/${forecastData.icon}@2x.png" alt="${forecastData.description}">
                <p>Temp: ${forecastData.temp} °C</p>
                <p>Wind: ${forecastData.wind} m/s</p>
                <p>Humidity: ${forecastData.humidity}%</p>
            </div>`;
    }
}

    // Get weather by current location (geolocation)
async function GetWeatherByLocation() {


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${ApiKey}&units=metric`;
            const url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${ApiKey}&units=metric`;
            FullForecast.classList.remove('hidden');
            try {
                const Response = await fetch(url);
                const data = await Response.json();

                if (Response.ok) {
                    // Display Current Weather
                    LocationName.innerHTML = `Location: ${data.name}, ${data.sys.country} (${today})`;
                    LocationTemp.innerHTML = `Temperature: ${data.main.temp}°C`;
                    LocationWind.innerHTML = `Wind Speed: ${data.wind.speed} m/s`;
                    LocationHumidity.innerHTML = `Humidity: ${data.main.humidity}%`;

                    // Display Weather Icon
                    const LocationIcon = document.querySelector(".weather-icon");
                    const iconCode = data.weather[0].icon;
                    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                    LocationIcon.src = iconUrl;
                    document.querySelector(".weather-condition").innerHTML = data.weather[0].description;

                    // ***** Fetch 5-Day Forecast ******
                    try {
                        const response2 = await fetch(url2);
                        const data2 = await response2.json();

                        if (response2.ok) {
                            displayForecast(data2);  // Call the function to display 5-day forecast
                        } else {
                            alert("City not found or invalid API response.");
                        }
                    } catch (error) {
                        console.error("Error fetching the weather data:", error);
                        alert("Error fetching weather data. Please try again later.");
                    }

                } else {
                    alert("Error fetching weather data. Please try again.");
                }
            } catch (error) {
                console.error("Error fetching weather data:", error);
                alert("Error fetching weather data. Please try again.");
            }
        }, function (error) {
            alert("Unable to retrieve your location. Please check your browser permissions.");
        });
    } else {
            alert("Geolocation is not supported by this browser.");
    }
}

