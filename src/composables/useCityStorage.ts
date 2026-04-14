import { ref, watch, computed } from 'vue'
import type { City, CitySearchResult } from '@/types/city'

const STORAGE_KEY = 'weather_pwa_cities'

function generateId(result: CitySearchResult): string {
  return `${result.id}-${result.latitude}-${result.longitude}`
}

function loadFromStorage(): City[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    console.warn('Failed to load cities from storage')
  }
  return []
}

function saveToStorage(cities: City[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities))
  } catch {
    console.warn('Failed to save cities to storage')
  }
}

export function useCityStorage() {
  const cities = ref<City[]>(loadFromStorage())
  const currentCity = ref<City | null>(null)

  const favoriteCities = computed(() => cities.value.filter(c => c.isFavorite))
  const hasCities = computed(() => cities.value.length > 0)

  // Persist cities on change
  watch(cities, (newCities) => {
    saveToStorage(newCities)
  }, { deep: true })

  function addCity(result: CitySearchResult): City {
    const id = generateId(result)

    // Check if already exists
    const existing = cities.value.find(c => c.id === id)
    if (existing) {
      currentCity.value = existing
      return existing
    }

    const city: City = {
      id,
      name: result.name,
      country: result.country,
      countryCode: result.countryCode,
      latitude: result.latitude,
      longitude: result.longitude,
      isFavorite: false,
      addedAt: Date.now()
    }

    cities.value.push(city)
    currentCity.value = city
    return city
  }

  function removeCity(cityId: string) {
    const index = cities.value.findIndex(c => c.id === cityId)
    if (index !== -1) {
      cities.value.splice(index, 1)
      if (currentCity.value?.id === cityId) {
        currentCity.value = cities.value[0] || null
      }
    }
  }

  function setCurrentCity(cityId: string) {
    const city = cities.value.find(c => c.id === cityId)
    if (city) {
      currentCity.value = city
    }
  }

  function toggleFavorite(cityId: string) {
    const city = cities.value.find(c => c.id === cityId)
    if (city) {
      city.isFavorite = !city.isFavorite
    }
  }

  function setCurrentLocationAsCity(lat: number, lon: number, name?: string) {
    const city: City = {
      id: `current-location`,
      name: name || '当前位置',
      country: '',
      countryCode: '',
      latitude: lat,
      longitude: lon,
      isFavorite: false,
      addedAt: Date.now()
    }

    // Remove old current location if exists
    const existingIndex = cities.value.findIndex(c => c.id === 'current-location')
    if (existingIndex !== -1) {
      cities.value.splice(existingIndex, 1)
    }

    cities.value.unshift(city)
    currentCity.value = city
    return city
  }

  function clearCities() {
    cities.value = []
    currentCity.value = null
  }

  return {
    cities,
    currentCity,
    favoriteCities,
    hasCities,
    addCity,
    removeCity,
    setCurrentCity,
    toggleFavorite,
    setCurrentLocationAsCity,
    clearCities
  }
}