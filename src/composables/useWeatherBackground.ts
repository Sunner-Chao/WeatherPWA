import { ref, computed } from 'vue'
import type { WeatherCondition, BackgroundTheme, AnimationIntensity } from '@/types/weather'

// Weather-based gradients
const WEATHER_GRADIENTS: Record<string, { gradient: string[]; particleType: BackgroundTheme['particleType']; particleIntensity: AnimationIntensity }> = {
  clear_day: {
    gradient: ['#667eea', '#764ba2'],
    particleType: 'sun-rays',
    particleIntensity: 'light'
  },
  clear_night: {
    gradient: ['#0f0c29', '#302b63', '#24243e'],
    particleType: 'none',
    particleIntensity: 'light'
  },
  partly_cloudy_day: {
    gradient: ['#4facfe', '#00f2fe'],
    particleType: 'clouds',
    particleIntensity: 'light'
  },
  partly_cloudy_night: {
    gradient: ['#141e30', '#243b55'],
    particleType: 'clouds',
    particleIntensity: 'light'
  },
  cloudy: {
    gradient: ['#606c88', '#3f4c6b'],
    particleType: 'clouds',
    particleIntensity: 'moderate'
  },
  overcast: {
    gradient: ['#2d3436', '#636e72'],
    particleType: 'clouds',
    particleIntensity: 'heavy'
  },
  fog: {
    gradient: ['#bdc3c7', '#2c3e50'],
    particleType: 'clouds',
    particleIntensity: 'heavy'
  },
  drizzle: {
    gradient: ['#34495e', '#6b7b8c'],
    particleType: 'rain',
    particleIntensity: 'light'
  },
  rain: {
    gradient: ['#2c3e50', '#4ca1af'],
    particleType: 'rain',
    particleIntensity: 'moderate'
  },
  heavy_rain: {
    gradient: ['#1a1a2e', '#16213e', '#0f3460'],
    particleType: 'rain',
    particleIntensity: 'heavy'
  },
  thunderstorm: {
    gradient: ['#0d0d0d', '#1a1a2e', '#4a4a4a'],
    particleType: 'rain',
    particleIntensity: 'heavy'
  },
  snow: {
    gradient: ['#e6d9f0', '#dfe6e9'],
    particleType: 'snow',
    particleIntensity: 'moderate'
  },
  heavy_snow: {
    gradient: ['#d5d8dc', '#f8f9fa'],
    particleType: 'snow',
    particleIntensity: 'heavy'
  },
  sleet: {
    gradient: ['#8e9eab', '#eef2f3'],
    particleType: 'rain',
    particleIntensity: 'moderate'
  },
  hail: {
    gradient: ['#2d3436', '#636e72'],
    particleType: 'rain',
    particleIntensity: 'heavy'
  },
  default: {
    gradient: ['#667eea', '#764ba2'],
    particleType: 'none',
    particleIntensity: 'light'
  }
}

function getGradientKey(condition: WeatherCondition, isDay: boolean): string {
  if (condition === 'clear') {
    return isDay ? 'clear_day' : 'clear_night'
  }
  if (condition === 'partly_cloudy') {
    return isDay ? 'partly_cloudy_day' : 'partly_cloudy_night'
  }
  return condition || 'default'
}

export function useWeatherBackground() {
  const currentCondition = ref<WeatherCondition>('clear')
  const isDay = ref(true)
  const animationEnabled = ref(true)

  const gradient = computed(() => {
    const key = getGradientKey(currentCondition.value, isDay.value)
    const config = WEATHER_GRADIENTS[key] || WEATHER_GRADIENTS.default
    const colors = config.gradient

    if (colors.length === 2) {
      return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`
    }
    return `linear-gradient(135deg, ${colors.join(', ')})`
  })

  const theme = computed<BackgroundTheme>(() => {
    const key = getGradientKey(currentCondition.value, isDay.value)
    const config = WEATHER_GRADIENTS[key] || WEATHER_GRADIENTS.default

    return {
      gradient: [gradient.value],
      particleType: config.particleType,
      particleIntensity: config.particleIntensity,
      textColor: '#FFFFFF',
      glassOpacity: 0.15
    }
  })

  const particleIntensity = computed<AnimationIntensity>(() => {
    if (!animationEnabled.value) return 'light'
    return theme.value.particleIntensity
  })

  function setWeather(condition: WeatherCondition, day: boolean) {
    currentCondition.value = condition
    isDay.value = day
  }

  function toggleAnimation() {
    animationEnabled.value = !animationEnabled.value
  }

  return {
    currentCondition,
    isDay,
    animationEnabled,
    gradient,
    theme,
    particleIntensity,
    setWeather,
    toggleAnimation
  }
}