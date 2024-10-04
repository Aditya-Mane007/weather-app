import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"

function App() {
  const [isEvening, setIsEvening] = useState(false)
  const [position, setPosition] = useState({
    lat: "",
    long: "",
  })
  const [inputText, setInputText] = useState("")

  const [weatherReport, setWeatherReport] = useState()

  console.log(position)
  console.log(weatherReport)

  const fetchWeather = async (lat, long) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=75b4bb3633207fbf9ecc498c498a5bbd&units=metric`
      )

      if (!res.ok || res.status === 404) {
        throw new Error("Enable To fetch weather report")
      }

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
      // toast.success("Weather report fetched successfully")
    } catch (error) {
      toast.warning(error)
    }
    setInputText("")
  }

  const fetchWeatherByCity = async (city) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=75b4bb3633207fbf9ecc498c498a5bbd&units=metric`
      )

      if (!res.ok) {
        throw new Error("Enable To fetch weather report")
      }

      const data = await res.json()

      if (data && data.cod == "404") {
        throw new Error(data.message)
      } else {
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
        toast.success("Weather report fetched successfully")
      }
    } catch (error) {
      toast.error(error)
    }
    setInputText("")
  }

  const submitHandler = (e) => {
    e.preventDefault()
    fetchWeatherByCity(inputText)
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

      const d = new Date()

      if (d.getHours() >= 18) {
        setInputText(true)
      } else {
        setInputText(false)
      }
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
      <div className={isEvening ? "wrapper dark" : "wrapper light"}>
        <div className="formDiv">
          <form onSubmit={submitHandler}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. goregaon"
              required
              className={isEvening ? "dark" : "light"}
            />
            <button type="submit" className={isEvening ? "dark" : "light"}>
              Search
            </button>
          </form>
        </div>
        <div className="main-wether-info">
          {weatherReport.name + ", " + weatherReport.country}
          <h1 className="temprature">
            {weatherReport.weatherData.main.temp} c
          </h1>
          <h2 className="main">{weatherReport.weather.main}</h2>
          <h2 className="description">{weatherReport.weather.description}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weatherReport.weather.icon}@2x.png`}
            alt=""
          />
        </div>
        <div
          className={
            isEvening ? "sub-wether-info  dark" : "sub-wether-info  light"
          }
        >
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
