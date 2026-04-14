import type { OpenMeteoResponse, WeatherData, CurrentWeather, HourlyForecast, DailyForecast, WeatherCondition } from '@/types/weather'

const BASE_URL = 'https://api.open-meteo.com/v1'

// Weather code to condition mapping
const WEATHER_CODE_MAP: Record<number, WeatherCondition> = {
  0: 'clear',
  1: 'partly_cloudy',
  2: 'partly_cloudy',
  3: 'overcast',
  45: 'fog',
  48: 'fog',
  51: 'drizzle',
  53: 'drizzle',
  55: 'drizzle',
  61: 'rain',
  63: 'rain',
  65: 'heavy_rain',
  66: 'sleet',
  67: 'sleet',
  71: 'snow',
  73: 'snow',
  75: 'heavy_snow',
  77: 'snow',
  80: 'rain',
  81: 'rain',
  82: 'heavy_rain',
  85: 'snow',
  86: 'heavy_snow',
  95: 'thunderstorm',
  96: 'thunderstorm',
  99: 'thunderstorm'
}

function mapWeatherCode(code: number): WeatherCondition {
  return WEATHER_CODE_MAP[code] || 'clear'
}

function getWindDirectionText(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    timezone: 'auto',
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation_probability',
      'rain',
      'showers',
      'snowfall',
      'cloud_cover',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'visibility',
      'pressure_msl',
      'uv_index',
      'dew_point_2m',
      'weather_code'
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'precipitation_probability',
      'weather_code',
      'cloud_cover',
      'wind_speed_10m',
      'wind_direction_10m',
      'is_day'
    ].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'weather_code',
      'sunrise',
      'sunset',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'uv_index_max'
    ].join(','),
    forecast_days: '7',
    forecast_hours: '48'
  })

  const response = await fetch(`${BASE_URL}/forecast?${params}`)
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`)
  }

  const data: OpenMeteoResponse = await response.json()
  return transformWeatherData(data)
}

function transformWeatherData(data: OpenMeteoResponse): WeatherData {
  // Current weather
  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    windGusts: data.current.wind_gusts_10m,
    pressure: data.current.pressure_msl,
    visibility: data.current.visibility,
    uvIndex: data.current.uv_index,
    dewPoint: data.current.dew_point_2m,
    condition: mapWeatherCode(data.current.weather_code),
    conditionCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    precipitationProbability: data.current.precipitation_probability,
    cloudCover: data.current.cloud_cover
  }

  // Hourly forecast (next 24 hours)
  const now = new Date()
  const currentHourIndex = data.hourly.time.findIndex(t => new Date(t).getHours() === now.getHours())
  const startIndex = Math.max(0, currentHourIndex)
  const endIndex = Math.min(data.hourly.time.length, startIndex + 24)

  const hourly: HourlyForecast[] = data.hourly.time
    .slice(startIndex, endIndex)
    .map((time, i) => ({
      time,
      temperature: data.hourly.temperature_2m[startIndex + i],
      condition: mapWeatherCode(data.hourly.weather_code[startIndex + i]),
      conditionCode: data.hourly.weather_code[startIndex + i],
      precipitationProbability: data.hourly.precipitation_probability[startIndex + i],
      windSpeed: data.hourly.wind_speed_10m[startIndex + i],
      windDirection: data.hourly.wind_direction_10m[startIndex + i],
      isDay: data.hourly.is_day[startIndex + i] === 1
    }))

  // Daily forecast
  const daily: DailyForecast[] = data.daily.time.map((date, i) => ({
    date,
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    condition: mapWeatherCode(data.daily.weather_code[i]),
    conditionCode: data.daily.weather_code[i],
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
    precipitationSum: data.daily.precipitation_sum[i],
    precipitationProbability: data.daily.precipitation_probability_max[i],
    windSpeedMax: data.daily.wind_speed_10m_max[i],
    windGustsMax: data.daily.wind_gusts_10m_max[i],
    uvIndexMax: data.daily.uv_index_max[i]
  }))

  return {
    current,
    hourly,
    daily,
    timezone: data.timezone,
    timezoneOffset: data.utc_offset_seconds
  }
}

export { mapWeatherCode, getWindDirectionText }