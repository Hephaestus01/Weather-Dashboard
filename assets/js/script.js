var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-name");
var cityDataContainer = document.querySelector("#current-data-container");
var cityButtons = document.querySelector("#city-buttons");
var apiKey = "a52564ca373841dba4bd849cb5b4969e";


// to handle city search submission
var formSubmitHandler = function (event) {
    event.preventDefault();

    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getCityData(cityName);
        createHistory(cityName);

        // clear old content
        cityDataContainer.textContent = "";
        searchFormEl.value = "";
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
                                        // displayCityForecast(data,city)
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
    currWindEl.textContent = `Wind: ${currentWind} mph`
    currContEl.appendChild(currWindEl);

    var currHumEl = document.createElement("p")
    currHumEl.textContent = `Humidity: ${currentHumidity}%`
    currContEl.appendChild(currHumEl);

    var currUviEl = document.createElement("p")
    currUviEl.textContent = `UV Index: ${currentUvi}`
    currContEl.appendChild(currUviEl);
}

// TODO: Display city forecast information
// var displayCityForecast = function (data, city) {
//     for (let i = 0; i < 4; i++) {
//         var cardSectionEl = document.querySelector(".card-section")
//         var dailyEl = document.createElement("div")
//         dailyEl.className("daily-card")


//     }
// }

// TODO: Create history items as buttons
var createHistory = function (city) {
    var buttonList = document.querySelector("#city-buttons");
    if (buttonList.hasChildNodes()) {
        for (var i = 0; i < buttonList.children.length; i++) {
            console.log("children: ", buttonList.children[i].textContent)
            if (buttonList.children[i].textContent == city) {
                console.log("already included in history");
            }
            else {
                var cityButton = document.createElement("button")
                cityButton.className = "btn"
                cityButton.setAttribute("data-city", city)
                cityButton.textContent = city;
                document.querySelector("#city-buttons").appendChild(cityButton);
                break;
            }
        }
    } else {
        var cityButton = document.createElement("button")
        cityButton.className = "btn"
        cityButton.setAttribute("data-city", city)
        cityButton.textContent = city;
        document.querySelector("#city-buttons").appendChild(cityButton);
    }
}




searchFormEl.addEventListener("submit", formSubmitHandler);
cityButtons.addEventListener("click", buttonClickHandler);