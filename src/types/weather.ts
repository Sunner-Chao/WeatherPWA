// Weather condition types
export type WeatherCondition =
  | 'clear'
  | 'partly_cloudy'
  | 'cloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavy_rain'
  | 'thunderstorm'
  | 'snow'
  | 'heavy_snow'
  | 'sleet'
  | 'hail'

// Current weather data
export interface CurrentWeather {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDirection: number
  windGusts: number
  pressure: number
  visibility: number
  uvIndex: number
  dewPoint: number
  condition: WeatherCondition
  conditionCode: number
  isDay: boolean
  precipitationProbability: number
  cloudCover: number
}

// Hourly forecast
export interface HourlyForecast {
  time: string
  temperature: number
  condition: WeatherCondition
  conditionCode: number
  precipitationProbability: number
  windSpeed: number
  windDirection: number
  isDay: boolean
}

// Daily forecast
export interface DailyForecast {
  date: string
  tempMax: number
  tempMin: number
  condition: WeatherCondition
  conditionCode: number
  sunrise: string
  sunset: string
  precipitationSum: number
  precipitationProbability: number
  windSpeedMax: number
  windGustsMax: number
  uvIndexMax: number
}

// Complete weather response
export interface WeatherData {
  current: CurrentWeather
  hourly: HourlyForecast[]
  daily: DailyForecast[]
  timezone: string
  timezoneOffset: number
}

// Weather API raw response (Open-Meteo format)
export interface OpenMeteoResponse {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current_units: {
    time: string
    interval: string
    temperature_2m: string
    relative_humidity_2m: string
    apparent_temperature: string
    is_day: string
    precipitation_probability: string
    rain: string
    showers: string
    snowfall: string
    cloud_cover: string
    cloud_cover_low: string
    cloud_cover_mid: string
    cloud_cover_high: string
    wind_speed_10m: string
    wind_direction_10m: string
    wind_gusts_10m: string
    visibility: string
    pressure_msl: string
    uv_index: string
    dew_point_2m: string
    weather_code: string
  }
  current: {
    time: string
    interval: number
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    is_day: number
    precipitation_probability: number
    rain: number
    showers: number
    snowfall: number
    cloud_cover: number
    cloud_cover_low: number
    cloud_cover_mid: number
    cloud_cover_high: number
    wind_speed_10m: number
    wind_direction_10m: number
    wind_gusts_10m: number
    visibility: number
    pressure_msl: number
    uv_index: number
    dew_point_2m: number
    weather_code: number
  }
  hourly_units: Record<string, string>
  hourly: {
    time: string[]
    temperature_2m: number[]
    relative_humidity_2m: number[]
    apparent_temperature: number[]
    precipitation_probability: number[]
    weather_code: number[]
    cloud_cover: number[]
    wind_speed_10m: number[]
    wind_direction_10m: number[]
    is_day: number[]
  }
  daily_units: Record<string, string>
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weather_code: number[]
    sunrise: string[]
    sunset: string[]
    precipitation_sum: number[]
    precipitation_probability_max: number[]
    wind_speed_10m_max: number[]
    wind_gusts_10m_max: number[]
    uv_index_max: number[]
  }
}

// Animation intensity levels
export type AnimationIntensity = 'light' | 'moderate' | 'heavy'

// Background theme based on weather
export interface BackgroundTheme {
  gradient: string[]
  particleType: 'rain' | 'snow' | 'clouds' | 'sun-rays' | 'none'
  particleIntensity: AnimationIntensity
  textColor: string
  glassOpacity: number
}