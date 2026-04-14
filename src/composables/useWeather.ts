import { ref, computed } from 'vue'
import type { WeatherData } from '@/types/weather'
import { fetchWeather } from '@/services/weatherApi'

const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

export function useWeather() {
  const weather = ref<WeatherData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)
  const hasData = computed(() => weather.value !== null)

  const currentWeather = computed(() => weather.value?.current)
  const hourlyForecast = computed(() => weather.value?.hourly)
  const dailyForecast = computed(() => weather.value?.daily)

  async function loadWeather(lat: number, lon: number, forceRefresh = false) {
    const cacheKey = `${lat}-${lon}`
    const cached = weatherCache.get(cacheKey)

    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      weather.value = cached.data
      lastUpdated.value = new Date(cached.timestamp)
      return cached.data
    }

    loading.value = true
    error.value = null

    try {
      const data = await fetchWeather(lat, lon)
      weather.value = data
      lastUpdated.value = new Date()
      weatherCache.set(cacheKey, { data, timestamp: Date.now() })
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load weather data'
      throw e
    } finally {
      loading.value = false
    }
  }

  function clearWeather() {
    weather.value = null
    error.value = null
    lastUpdated.value = null
  }

  return {
    weather,
    loading,
    error,
    lastUpdated,
    isLoading,
    hasError,
    hasData,
    currentWeather,
    hourlyForecast,
    dailyForecast,
    loadWeather,
    clearWeather
  }
}