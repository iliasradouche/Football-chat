document.addEventListener('DOMContentLoaded', () => {
    getWeatherByLocation();
});

async function getWeatherByLocation() {
    try {
        // Get user's current location
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;

        // Fetch weather data
        const apiKey = '3c5e6f678149f7545923ad489658d6d9';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (response.ok) {
            displayWeather(data);
        } else {
            throw new Error(data.message || 'Failed to fetch weather data.');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('weather-info').innerText = 'Error fetching weather data. Please try again.';
    }
}

function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function getWeatherIcon(data) {
    weatherValues= ['Clear sky', 
    'Few clouds',
    'Scattered clouds',
    'Broken clouds',
    'Overcast clouds',
    'Light rain',
    'Moderate rain',
    'Heavy rain',
    'Light snow',
    'Moderate snow',
    'Heavy snow',
    'Thunderstorm',
    'Mist',
    'Fog',
    'Haze',
    'Smoke',
    'Sand',
    'Dust',
    'Tornado',
    'Squalls',
    'Drizzle'];

    paths= ['./images/clear.png', 
    './images/clouds.png',
    './images/clouds.png',
    './images/clouds.png',
    './images/clouds.png',
    './images/rain.png',
    './images/rain.png',
    './images/rain.png',
    './images/snow.png',
    './images/snow.png',
    './images/snow.png',
    './images/wind.png',
    './images/mist.png',
    './images/clouds.png',
    './images/clouds.png',
    './images/clouds.png',
    './images/clouds.png',
    './images/clouds.png',
    './images/clouds.png',
    './images/clouds.png',
    './images/drizzle.png',
];
    path = './images/mist.png'
    for (i in weatherValues){
        if (weatherValues[i] === data.toLowerCase()){
            path = paths[i];
        } 
    }
    return path;
}

function displayWeather(data) {
    document.getElementById('location-value').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('weather-value').textContent = data.weather[0].description;
    document.getElementById('temperature-value').textContent = `${Math.round(data.main.temp)}°`;
    const weatherIcon = getWeatherIcon(data.weather[0].main);
    document.getElementById('weather-icon').src = weatherIcon;
}