var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-name");
var cityDataContainer = document.querySelector("#current-data-container");
var cityButtons = document.querySelector("#city-buttons");
var apiKey = "db0954743f17bba3e12033c19f3cab1f";


// to handle city search submission
var formSubmitHandler = function (event) {
    event.preventDefault();

    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getCityData(cityName);
        createHistory(cityName);
        // clear old content
        cityDataContainer.textContent = "";
        cityInputEl.value = '';
    } else {
        alert("Please enter a city name");
    }
};

var buttonClickHandler = function (event) {
    var city = event.target.getAttribute("data-city");
    if (city) {
        getCityData(city);

        // clear old content
        cityDataContainer.textContent = "";
    }
}

var getCityData = function (city) {
    //format the weather api url
    var apiUrl_1 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    // make a get request to url
    fetch(apiUrl_1)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    var cityLon = data.coord.lon;
                    var cityLat = data.coord.lat;
                    if (apiUrl_1) {
                        var apiUrl_2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=${apiKey}`
                        fetch(apiUrl_2)
                            .then(function (response) {
                                if (response.ok) {
                                    response.json().then(function (data) {
                                        displayCityCurrent(data, city)
                                        displayCityForecast(data, city)
                                    })
                                }
                            })
                    }
                })
            }
        })
};

var displayCityCurrent = function (data, city) {
    var currContEl = document.querySelector("#current-data-container")
    var rawDate = new Date((data.current.dt * 1000))
    var formatOption = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    var formatDate = new Intl.DateTimeFormat('en-US', formatOption).format(rawDate);

    var iconCode = (data.current.weather[0].icon);
    var iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`

    var currentTemp = data.current.temp
    var currentWind = data.current.wind_speed
    var currentHumidity = data.current.humidity
    var currentUvi = data.current.uvi

    var cityNameEl = document.createElement("h2")
    cityNameEl.innerHTML = `${city} (${formatDate})<span><img src="${iconUrl}"></img><span>`
    currContEl.appendChild(cityNameEl);

    var currTempEl = document.createElement("p")
    currTempEl.textContent = `Temperature: ${currentTemp} \u00B0F`
    currContEl.appendChild(currTempEl);

    var currWindEl = document.createElement("p")
    currWindEl.textContent = `Wind: ${currentWind} MPH`
    currContEl.appendChild(currWindEl);

    var currHumEl = document.createElement("p")
    currHumEl.textContent = `Humidity: ${currentHumidity}%`
    currContEl.appendChild(currHumEl);

    var currUviEl = document.createElement("p")
    currUviEl.innerHTML = `UV Index: <span id="uvi-display">${currentUvi}<span>`

    currContEl.appendChild(currUviEl);
    var uviDisplay = document.querySelector("#uvi-display")
    console.log(currUviEl, uviDisplay.textContent)
    if (uviDisplay.textContent > 5) {
        uviDisplay.className = "uvi-danger"
    } else if (uviDisplay.textContent < 5 && uviDisplay.textContent > 2) {
        uviDisplay.className = "uvi-warning"
    } else {
        uviDisplay.className = "uvi-success"
    }
}

// Display city forecast information
var displayCityForecast = function (data) {
    var cardSectionEl = document.querySelector(".card-section")
    cardSectionEl.textContent = "";

    for (let i = 1; i < 6; i++) {

        var rawDate = new Date((data.daily[i].dt * 1000))
        var formatOption = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }
        var formatDate = new Intl.DateTimeFormat('en-US', formatOption).format(rawDate);

        var dailyEl = document.createElement("div")
        dailyEl.className = "daily-card card col-12 col-md-2"

        var dailyDateEl = document.createElement("h6")
        dailyDateEl.innerHTML = `${formatDate}`
        dailyEl.appendChild(dailyDateEl);

        var iconCode = (data.daily[i].weather[0].icon)
        var iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`
        var dailyIconEl = document.createElement("div")
        dailyIconEl.innerHTML = `<span><img src="${iconUrl}"</img></span>`
        dailyEl.appendChild(dailyIconEl);

        var dailyTemp = (data.daily[i].temp.day)
        var dailyTempEl = document.createElement("div")
        dailyTempEl.textContent = `Temp: ${dailyTemp} \u00B0F`
        dailyEl.appendChild(dailyTempEl);

        var dailyWind = (data.daily[i].wind_speed)
        var dailyWindEl = document.createElement("div")
        dailyWindEl.textContent = `Wind: ${dailyWind} MPH`
        dailyEl.appendChild(dailyWindEl);

        var dailyHumidity = (data.daily[i].humidity)
        var dailyHumEl = document.createElement("div")
        dailyHumEl.textContent = `Humidity: ${dailyHumidity}%`
        dailyEl.appendChild(dailyHumEl);

        cardSectionEl.appendChild(dailyEl);
    }
}

//Create history items as buttons
var createHistory = function (city) {
    cityArray = []
    for (var i = 0; i < cityButtons.children.length; i++) {
        var cityAdd = (cityButtons.children[i].textContent);
        cityArray.push(cityAdd);
    }
    if (!cityArray.includes(city)) {
        createButton(city);
    }
}

var createButton = function (city) {
    var cityButton = document.createElement("button")
    cityButton.className = "btn btn-secondary"
    cityButton.setAttribute("data-city", city)
    cityButton.textContent = city;
    document.querySelector("#city-buttons").appendChild(cityButton);
}


searchFormEl.addEventListener("submit", formSubmitHandler)
cityButtons.addEventListener("click", buttonClickHandler)