import React, { useEffect, useState } from "react"

function App() {
  const [position, setPosition] = useState({
    lat: "",
    long: "",
  })

  const [weatherReport, setWeatherReport] = useState()

  console.log(position)
  console.log(weatherReport)
  const fetchWeather = async (lat, long) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=75b4bb3633207fbf9ecc498c498a5bbd&units=metric`
    )

    const data = await res.json()

    console.log(data)

    const jsonData = {
      country: data.city.country,
      name: data.city.name,
      population: data.city.population,
      sunrise: data.city.sunrise,
      sunset: data.city.sunset,
      weatherData: data.list[0],
      weather: data.list[0].weather[0],
    }

    console.log(jsonData)

    setWeatherReport(jsonData)
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos, error) => {
      if (error) {
        alert(error)
        return false
      }
      setPosition({
        lat: pos.coords.latitude,
        long: pos.coords.longitude,
      })

      fetchWeather(pos.coords.latitude, pos.coords.longitude)
    })
  }, [])

  if (!weatherReport) {
    return (
      <div className="container">
        <div className="wrapper">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="wrapper">
        <div>
          <form>
            <input
              type="text"
              value={weatherReport.name + ", " + weatherReport.country}
              readOnly
            />
          </form>
        </div>
        <div className="main-wether-info">
          <h1 className="temprature">
            {weatherReport.weatherData.main.temp} c
          </h1>
          <h2 className="main">{weatherReport.weather.main}</h2>
          <h2 className="description">{weatherReport.weather.description}</h2>
          <img src={`https://openweathermap.org/img/wn/${weatherReport.weather.icon}@2x.png`} alt="" />
        </div>
        <div className="sub-wether-info">
          <div>
            <h3 className="title">Feels Like</h3>
            <h2 className="subtitle">
              {weatherReport.weatherData.main.feels_like}
            </h2>
          </div>
          <div>
            <h3 className="title">Pressure</h3>
            <h2 className="subtitle">
              {weatherReport.weatherData.main.pressure}
            </h2>
          </div>
          <div>
            <h3 className="title">Humidity</h3>
            <h2 className="subtitle">
              {weatherReport.weatherData.main.humidity}
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
