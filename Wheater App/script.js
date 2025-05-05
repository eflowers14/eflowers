document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const locationElement = document.getElementById('location');
    const dateElement = document.getElementById('date');
    const temperatureElement = document.getElementById('temperature');
    const weatherElement = document.getElementById('weather');
    const weatherIconElement = document.getElementById('weather-icon');
    const humidityElement = document.getElementById('humidity');
    const windElement = document.getElementById('wind');
    
    // API Key de OpenWeatherMap (reemplaza con tu propia API key)
    const API_KEY = "e7257f015c82da1dedff303829e66287";
    
    // Función para formatear la fecha
    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };
    
    // Función para obtener el icono del clima
    const getWeatherIcon = (weatherMain) => {
        const iconMap = {
            'Clear': 'fa-sun',
            'Clouds': 'fa-cloud',
            'Rain': 'fa-cloud-rain',
            'Snow': 'fa-snowflake',
            'Thunderstorm': 'fa-bolt',
            'Drizzle': 'fa-cloud-rain',
            'Mist': 'fa-smog',
            'Smoke': 'fa-smog',
            'Haze': 'fa-smog',
            'Dust': 'fa-smog',
            'Fog': 'fa-smog',
            'Sand': 'fa-smog',
            'Ash': 'fa-smog',
            'Squall': 'fa-wind',
            'Tornado': 'fa-wind'
        };
        
        return iconMap[weatherMain] || 'fa-cloud';
    };
    
    // Función para obtener datos del clima
    const fetchWeatherData = async (city) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=es`
            );
            
            if (!response.ok) {
                throw new Error('Ciudad no encontrada');
            }
            
            const data = await response.json();
            displayWeatherData(data);
        } catch (error) {
            alert(error.message);
            console.error('Error al obtener datos del clima:', error);
        }
    };
    
    // Función para mostrar los datos del clima
    const displayWeatherData = (data) => {
        const { name, sys, main, weather, wind, dt } = data;
        
        locationElement.textContent = `${name}, ${sys.country}`;
        dateElement.textContent = formatDate(new Date(dt * 1000));
        temperatureElement.textContent = `${Math.round(main.temp)}°C`;
        weatherElement.textContent = weather[0].description;
        
        const weatherIcon = getWeatherIcon(weather[0].main);
        weatherIconElement.innerHTML = `<i class="fas ${weatherIcon}"></i>`;
        
        humidityElement.textContent = `${main.humidity}%`;
        windElement.textContent = `${Math.round(wind.speed * 3.6)} km/h`;
    };
    
    // Evento de búsqueda al hacer clic en el botón
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
        } else {
            alert('Por favor ingresa una ciudad');
        }
    });
    
    // Evento de búsqueda al presionar Enter
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                fetchWeatherData(city);
            } else {
                alert('Por favor ingresa una ciudad');
            }
        }
    });
    
    // Cargar datos iniciales (opcional)
    fetchWeatherData('Madrid');
});

