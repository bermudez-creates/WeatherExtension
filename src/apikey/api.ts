const OPEN_WEATHER_API_KEY = 'b9f5f022c1e0195a8a3b75d6bf2d2200'

export interface OpenWeatherData {
  name: string
  main: {
    feels_like: number
    humidity: number
    pressure: number
    sea_level: number
    temp: number
    temp_max: number
    temp_min: number
  }
  weather: {
    description: string
    icon: string
    id: string
    main: string
  }[]
  wind: {
    deg: number
    speed: number
  }
}

export type OpenWeatherTempScale = 'metric' | 'imperial'

export async function fetchOpenWeatherData(
  city: string,
  tempScale: OpenWeatherTempScale
): Promise<OpenWeatherData> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${tempScale}&appid=${OPEN_WEATHER_API_KEY}`
  )

  if (!res.ok) {
    throw new Error('City not found')
  }

  const OpenWeatherData = await res.json()
  return OpenWeatherData
}

export function getWeatherIconSrc(iconCode: string) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}
