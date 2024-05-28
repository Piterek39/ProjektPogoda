//const input = document.querySelector('input')
//const button = document.querySelector('button')
//const cityName = document.querySelector('.city-name')
//const warning = document.querySelector('.warning')
//const photo = document.querySelector('.photo')
//const weather = document.querySelector('.weather')
//const temperature = document.querySelector('.temperature')
//const humidity = document.querySelector('.humidity')

// https://openweathermap.org/
// https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL
const apiKey = 'd24a8078f06d1d158e682e4cc6b8f24b';
//const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric';
//const currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric';

document.querySelector('button').addEventListener('click', () => {
    const city = document.querySelector('input').value;
    if (city) {
        fetchWeatherData(city);
    } else {
        document.querySelector('.warning').textContent = 'Proszę wpisać nazwę miasta.';
    }
});

function fetchWeatherData(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    axios.get(currentWeatherUrl)
        .then(response => {
            displayCurrentWeather(response.data);
            fetchForecastData(city);
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
            document.querySelector('.warning').textContent = 'Nie udało się znaleźć miasta.';
        });
}

function fetchForecastData(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    axios.get(forecastUrl)
        .then(response => {
            displayForecast(response.data);
        })
        .catch(error => console.error('Error fetching forecast:', error));
}
function displayCurrentWeather(data) {
    document.querySelector('.city-name').textContent = data.name;
    document.querySelector('.weather').textContent = data.weather[0].description;
    document.querySelector('.temperature').textContent = `${data.main.temp} °C`;
    document.querySelector('.humidity').textContent = `${data.main.humidity}%`;

    const iconCode = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.querySelector('.photo').src = iconUrl;

    document.querySelector('.warning').textContent = '';
}
function displayForecast(data) {
    const forecastContainer = document.querySelector('.forecast-container');
    forecastContainer.innerHTML = '';

    
    const filteredData = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));

    filteredData.forEach(forecast => {
        const forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast-item');

        const date = new Date(forecast.dt_txt);
        const day = date.toLocaleDateString('en-GB', { weekday: 'long' });

        const iconCode = forecast.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

        forecastElement.innerHTML = `
            <p>${day}</p>
            <img src="${iconUrl}" alt="${forecast.weather[0].description}">
            <p>${forecast.weather[0].description}</p>
            <p>${forecast.main.temp} °C</p>
            <p>${forecast.main.humidity}%</p>
        `;

        forecastContainer.appendChild(forecastElement);
    });
}