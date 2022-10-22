const form = document.querySelector('form');
const suggestedCities = Array.from(document.querySelectorAll('.search-container li'));
const temperature = document.querySelector('#temperature');
const humidity = document.querySelector('#humidity');
const wind = document.querySelector('#wind');
const feltTemperature = document.querySelector('#felt-temperature');
const selectedCity = document.querySelector('.weather-city-container > h1');
const description = document.querySelector('.weather-container-card p');
const inputText = document.querySelector('#city');
const toggleSwitch = document.querySelector('.switch > input');
const weatherImg = document.querySelector('.weather-city-container img');

const getGeoData = async (city) => {
  try {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=d1e0911657547ca6bbdf52eba721f9e0`);
    const data = await response.json();
    return { cityLat: data[0].lat, cityLon: data[0].lon };
  } catch (err) {
    console.log(`ERROR : ${err}`);
    return err;
  }
};

const getWeatherData = async (city) => {
  try {
    let lat = 0;
    let lon = 0;
    await getGeoData(city).then((value) => {
      lat = value.cityLat;
      lon = value.cityLon;
    });
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d1e0911657547ca6bbdf52eba721f9e0`, {
      mode: 'cors',
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(`ERROR // + ${err}`);
    return err;
  }
};

const processDataFromJson = async (citySelected) => {
  try {
    const value = await getWeatherData(citySelected);
    const data = {
      city: citySelected,
      weatherMain: value.weather[0].main,
      weatherDescription: value.weather[0].description,
      temperature: value.main.temp,
      feltTemperature: value.main.feels_like,
      humidity: value.main.humidity,
      wind: value.wind.speed,
      country: value.sys.country,
      iconURL: `http://openweathermap.org/img/wn/${value.weather[0].icon}@2x.png`,
    };
    return data;
  } catch (err) {
    console.log(`ERROR // + ${err}`);
    return err;
  }
};

const convertTemperatureUnit = async (city) => {
  const data = await processDataFromJson(city);
  if (toggleSwitch.checked) {
    temperature.textContent = `${Math.round(((data.temperature - 273.25) * 9) / 5 + 32)} °F`;
    feltTemperature.textContent = `Felt temperature : ${Math.round(((data.feltTemperature - 273.25) * 9) / 5 + 32)} °F`;
  } else {
    temperature.textContent = `${Math.round(data.temperature - 273.25)} °C`;
    feltTemperature.textContent = `Felt temperature : ${Math.round(data.feltTemperature - 273.25)} °C`;
  }
};

const displayData = async (city) => {
  try {
    const data = await processDataFromJson(city);
    temperature.textContent = `${Math.round(data.temperature - 273.25)} °C`;
    humidity.textContent = `Humidity : ${data.humidity} %`;
    wind.textContent = `Wind speed : ${data.wind} km/h`;
    feltTemperature.textContent = `Felt temperature : ${Math.round(data.feltTemperature - 273.25)} °C`;
    selectedCity.textContent = `${data.city}, ${data.country}`;
    description.textContent = data.weatherDescription;
    weatherImg.src = data.iconURL;

    toggleSwitch.addEventListener('click', () => {
      convertTemperatureUnit(city);
    });
  } catch (err) {
    console.log(`ERROR // ${err}`);
  }
};

const resetInput = () => {
  inputText.value = '';
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formSelectedCity = inputText.value;
  displayData(formSelectedCity);
  resetInput();
});

suggestedCities.forEach((suggestedCity) => {
  suggestedCity.addEventListener('click', () => {
    displayData(suggestedCity.textContent);
  });
});

displayData('Paris');
