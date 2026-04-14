// City type definitions

export interface City {
  id: string
  name: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
  timezone?: string
  population?: number
  elevation?: number
  isFavorite: boolean
  addedAt: number // timestamp
}

// Geocoding API response (Open-Meteo format)
export interface GeocodingResponse {
  results?: GeocodingResult[]
}

export interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  elevation: number
  feature_code: string
  country_code: string
  country: string
  admin1?: string
  admin2?: string
  timezone: string
  population: number
}

// Search result for UI
export interface CitySearchResult {
  id: string
  name: string
  fullName: string // name + country + admin1 if available
  country: string
  countryCode: string
  latitude: number
  longitude: number
}