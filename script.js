const weatherIcon = document.querySelector(".weather-icon");
const inputBox = document.querySelector(".input-box");
const search = document.querySelector(".search");
const errorMsg = document.querySelector(".error-msg");
const tempBtn = document.querySelector(".temp-btn");
const temperature = document.querySelector(".temperature");
const tempMinMax = document.querySelector(".temp-min-max");
const cityDiv = document.querySelector(".city");
const sunriseSunset = document.querySelector(".sunrise-sunset");
const sunset = document.querySelector(".sunset");
const forecastDiv = document.querySelector(".forecast");

let unit = "metric"; 
let city = "Debrecen";

search.addEventListener("click", function(){
    if (inputBox.value == ""){
        errorMsg.innerHTML = "Cannot be empty!"
    } else {
        errorMsg.innerHTML = "";
        city = inputBox.value;
        console.log(city);
        weatherApi();
    }
})

tempBtn.addEventListener("click", function(){
    if (unit == "imperial"){
        //tempBtn.innerHTML = `<span class="active">°C</span><span class="inactive"> / °F</span>`;
        tempBtn.innerHTML = "°F";
        unit = "metric";
    } else {
        //tempBtn.innerHTML = `<span class="inactive">°C / </span><span class="active">°F</span>`;
        tempBtn.innerHTML = "°C";
        unit = "imperial";
    }
    weatherApi();
})

weatherApi();
async function weatherApi(){
    try{ 
        errorMsg.innerHTML = "";   
        let response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=79c45abbb243e86334d566d4c608d84b&units=${unit}`, {mode : 'cors'});
        
        let weather = await response.json();
        response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=79c45abbb243e86334d566d4c608d84b`, {mode : 'cors'})
        let coordinate = await response.json();
        console.log(coordinate[0].lat);
        console.log(coordinate[0].lon);

        response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${coordinate[0].lat}&lon=${coordinate[0].lon}&appid=79c45abbb243e86334d566d4c608d84b&units=${unit}`)
        let forecast = await response.json();
        console.log(forecast);
        display(weather);
        

        //temp
        if (unit == "metric"){
            temperature.innerHTML = `${weather.main.temp.toFixed(1)}°C`;
            tempMinMax.innerHTML = `min: ${forecast.list[0].main.temp_min.toFixed(1)}°C<br>
            max: ${forecast.list[0].main.temp_max.toFixed(1)}°C`;
        } else {
            temperature.innerHTML = `${weather.main.temp.toFixed(1)}°F`;
            tempMinMax.innerHTML = `min: ${forecast.list[0].main.temp_min.toFixed(1)}°F<br>
            max: ${forecast.list[0].main.temp_max.toFixed(1)}°F`;
        }
        inputBox.style = "border: black 1px solid; border-radius: 3px;";
        //forecast
        forecastDiv.innerHTML = "";
        forecastFunction(forecast);
        
    } catch(error) {
        inputBox.style = "border: red 1px solid; border-radius: 3px;";
        temperature.innerHTML = "";
        tempMinMax.innerHTML = "";
        forecastDiv.innerHTML = "";
        display(null);
    }
}

function display(weather){
    if (weather) {
        //city name
        cityDiv.innerHTML = weather.name;

        
        console.log("weather: " + weather.weather[0].id);
        let weatherID = weather.weather[0].id;

        
        
        //sunrise sunset
        let temp = weather.sys.sunrise * 1000;
        let sunriseTime = new Date(temp);
        temp = weather.sys.sunset * 1000;
        let sunsetTime = new Date(temp);
        sunriseSunset.innerHTML = `Sunrise: ${sunriseTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} <br>
        Sunset: ${sunsetTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;


        //icon 
        weatherIcon.style = "display: flex";
        weatherIcon.src = "http://openweathermap.org/img/wn/" + weather.weather[0].icon + "@4x.png";
        console.log(weather);


        //time
        let time = weather.dt * 1000;
        time = new Date();
        console.log(time.toLocaleString("en-US", {year: "numeric"}));
    } else {
        cityDiv.innerHTML = "City Not Found!";
        sunriseSunset.innerHTML = "";
        weatherIcon.style = "display: none";
    } 



}

function forecastFunction(forecast){
        let temp;
        let time;
        for(let i = 0; i < forecast.list.length; i++){
            time = forecast.list[i].dt_txt.slice(10,16);
            //time = new Date();


            temp = document.createElement("div");
            temp.className = "temp-forecast";
            if (unit == "metric"){
            temp.innerHTML = `
                <span>${time}</span>
                <img src=http://openweathermap.org/img/wn/${forecast.list[i].weather[0].icon}@4x.png>
                <span>${forecast.list[i].main.temp.toFixed(1)}°C</span>
                `;
            } else {
                temp.innerHTML = `
                <span>${time}</span>
                <img src=http://openweathermap.org/img/wn/${forecast.list[i].weather[0].icon}@4x.png>
                <span>${forecast.list[i].main.temp.toFixed(1)}°F</span>
                `;
            }
            console.log(forecast);
            forecastDiv.appendChild(temp);

        }
}