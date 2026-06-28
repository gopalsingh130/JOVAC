const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const newsContainer = document.getElementById("newsContainer");
const loadingIndicator = document.getElementById("loadingIndicator");
const errorMessage = document.getElementById("errorMessage");

const WEATHER_API_KEY = "7613373bd67d609ab73b97117b6327ff";
const NEWS_API_KEY = "25a039dcccd04795aa3c18275ffd6e94";

function showLoading() {
    loadingIndicator.classList.remove("hidden");
    errorMessage.classList.add("hidden");
}

function hideLoading() {
    loadingIndicator.classList.add("hidden");
}

function showError(message) {
    hideLoading();
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}

function renderWeather(data) {

    weatherCard.innerHTML = `
        <div class="weather-box">

            <img
                src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
                alt="weather"
            >

            <h1>${Math.round(data.main.temp)}°C</h1>

            <h2>${data.name}, ${data.sys.country}</h2>

            <p>${data.weather[0].description}</p>

            <div class="weather-info">
                <div>
                    <h3>Humidity</h3>
                    <p>${data.main.humidity}%</p>
                </div>

                <div>
                    <h3>Wind</h3>
                    <p>${data.wind.speed} m/s</p>
                </div>
            </div>

        </div>
    `;
}

function renderNews(articles) {

    newsContainer.innerHTML = "";

    if (articles.length === 0) {
        newsContainer.innerHTML = "<p>No news found.</p>";
        return;
    }

    articles.slice(0, 6).forEach(article => {

        const card = document.createElement("div");

        card.className = "news-card";

        card.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.source.name}</p>
        `;

        newsContainer.appendChild(card);
    });
}

async function fetchWeather(city) {

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
        throw new Error("City not found");
    }

    const data = await response.json();

    renderWeather(data);
}

async function fetchNews(city) {

    const response = await fetch(
        `https://newsapi.org/v2/everything?q=${city}&apiKey=${NEWS_API_KEY}`
    );

    const data = await response.json();

    renderNews(data.articles || []);
}

async function searchCity(city) {

    showLoading();

    try {

        await fetchWeather(city);

        await fetchNews(city);

        hideLoading();

    } catch (error) {

        console.log(error);

        showError(error.message);
    }
}

searchBtn.addEventListener("click", () => {

    const city = searchInput.value.trim();

    if (city) {
        searchCity(city);
    }
});

searchInput.addEventListener("keyup", (event) => {

    if (event.key === "Enter") {

        const city = searchInput.value.trim();

        if (city) {
            searchCity(city);
        }
    }
});

searchCity("Mathura");