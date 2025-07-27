import axios from "axios";

export async function getCurrentWeather(city: string): Promise<string> {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

  const res = await axios.get(url);
  const data = res.data;

  const description = data.weather[0].description;
  const temp = data.main.temp;
  const feelsLike = data.main.feels_like;

  //return `The weather in ${city} is ${description} with a temperature of ${temp}°C (feels like ${feelsLike}°C).`;
  return `${temp}°C`;
}
