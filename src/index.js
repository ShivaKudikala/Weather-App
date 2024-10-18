const DisplayDiv = document.querySelector(".info-div");

const InputValue = document.querySelector("#input");

const SearchBtn = document.querySelector(".search-btn");

const LocationName = document.querySelector(".location-name");

const LocationTemp = document.querySelector(".location-temp");

const LocationWind = document.querySelector(".location-wind");

const LocationHumidity = document.querySelector(".location-humidity");


SearchBtn.addEventListener("click", GetWeather);

async function GetWeather() {
    const ApiKey = '2ef9063df0f763a1f287353c9ca53e46';
    const Location = InputValue.value;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${Location}&APPID=2ef9063df0f763a1f287353c9ca53e46&units=metric`;

    try{

        const Response = await fetch(url);
        const data = await Response.json();

        if(data.cod === "404" || data.cod === "401"){
            alert("City not found!");
            return;
        }

        LocationName.innerHTML = `Location: ${data.name}, ${data.sys.country}`;
        LocationTemp.innerHTML = `Temperature: ${data.main.temp} C`;
        LocationWind.innerHTML = `Wind Speed: ${data.wind.speed} m/s`;
        LocationHumidity.innerHTML = `Humidity: ${data.main.humidity}`;

        const LocationIcon = document.querySelector(".weather-icon");
        const iconCode = data.weather[0].icon; // Icon code from API response
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Construct the icon URL
        LocationIcon.src = iconUrl;
        document.querySelector(".weather-condition").innerHTML = data.weather[0].description;


    }catch(error){
        console.log(error);
        LocationName.innerHTML = error;
    }
}