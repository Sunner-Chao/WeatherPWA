<script setup lang="ts">
import { computed } from 'vue'
import type { WeatherCondition } from '@/types/weather'

interface Props {
  condition: WeatherCondition
  isDay?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDay: true,
  size: 'md',
  animated: false
})

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96
}

const iconSize = computed(() => sizeMap[props.size])

// Icon SVG paths based on condition
const iconPaths = computed(() => {
  const icons: Record<WeatherCondition, { sun?: string; cloud?: string; rain?: string; snow?: string; bolt?: string }> = {
    clear: { sun: 'sun' },
    partly_cloudy: { sun: 'sun', cloud: 'cloud-small' },
    cloudy: { cloud: 'cloud-large' },
    overcast: { cloud: 'cloud-large' },
    fog: { cloud: 'cloud-fog' },
    drizzle: { cloud: 'cloud-large', rain: 'rain-light' },
    rain: { cloud: 'cloud-large', rain: 'rain' },
    heavy_rain: { cloud: 'cloud-dark', rain: 'rain-heavy' },
    thunderstorm: { cloud: 'cloud-dark', bolt: 'bolt' },
    snow: { cloud: 'cloud-large', snow: 'snow' },
    heavy_snow: { cloud: 'cloud-large', snow: 'snow-heavy' },
    sleet: { cloud: 'cloud-large', rain: 'rain-light', snow: 'snow-light' },
    hail: { cloud: 'cloud-dark', snow: 'hail' }
  }
  return icons[props.condition] || icons.clear
})
</script>

<template>
  <div
    class="weather-icon"
    :class="{ 'weather-icon--animated': animated }"
    :style="{ width: `${iconSize}px`, height: `${iconSize}px` }"
  >
    <!-- Sun -->
    <svg
      v-if="iconPaths.sun"
      class="icon-sun"
      :class="{ 'icon-sun--rotate': animated }"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="4" fill="#ffd93d" />
      <g stroke="#ffd93d" stroke-width="2" stroke-linecap="round">
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="4" y1="12" x2="2" y2="12" />
        <line x1="22" y1="12" x2="20" y2="12" />
        <line x1="6" y1="6" x2="4" y2="4" />
        <line x1="18" y1="18" x2="20" y2="20" />
        <line x1="18" y1="6" x2="20" y2="4" />
        <line x1="6" y1="18" x2="4" y2="20" />
      </g>
    </svg>

    <!-- Cloud -->
    <svg
      v-if="iconPaths.cloud"
      class="icon-cloud"
      :class="{
        'icon-cloud--float': animated,
        'icon-cloud--dark': iconPaths.cloud === 'cloud-dark'
      }"
      viewBox="0 0 24 24"
    >
      <path
        d="M18 10a4 4 0 00-4-4 4 4 0 00-3.5 2A3 3 0 008 5a3 3 0 100 6h10a3 3 0 100-6z"
        :fill="iconPaths.cloud === 'cloud-dark' ? '#636e72' : '#dfe6e9'"
      />
    </svg>

    <!-- Rain drops -->
    <g v-if="iconPaths.rain" class="icon-rain" :class="{ 'icon-rain--fall': animated }">
      <line
        v-for="i in (iconPaths.rain === 'rain-heavy' ? 5 : 3)"
        :key="i"
        :x1="6 + i * 3"
        :y1="14 + (i % 2) * 2"
        :x2="5 + i * 3"
        :y2="18 + (i % 2) * 2"
        stroke="#74b9ff"
        stroke-width="2"
        stroke-linecap="round"
      />
    </g>

    <!-- Snowflakes -->
    <g v-if="iconPaths.snow" class="icon-snow" :class="{ 'icon-snow--fall': animated }">
      <circle
        v-for="i in (iconPaths.snow === 'snow-heavy' ? 4 : 2)"
        :key="i"
        :cx="7 + i * 4"
        :cy="16 + (i % 2) * 2"
        r="1.5"
        fill="#fff"
      />
    </g>

    <!-- Thunder bolt -->
    <svg
      v-if="iconPaths.bolt"
      class="icon-bolt"
      :class="{ 'icon-bolt--flash': animated }"
      viewBox="0 0 24 24"
    >
      <path
        d="M13 2L9 9h4l-1 7 5-9h-4l1-5z"
        fill="#ffd93d"
      />
    </svg>
  </div>
</template>

<style scoped>
.weather-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.weather-icon svg {
  position: absolute;
  width: 100%;
  height: 100%;
}

/* Sun rotation animation */
.icon-sun--rotate {
  animation: rotate-sun 10s linear infinite;
}

@keyframes rotate-sun {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Cloud float animation */
.icon-cloud--float {
  animation: float-cloud 3s ease-in-out infinite;
}

@keyframes float-cloud {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); }
}

/* Rain fall animation */
.icon-rain--fall line {
  animation: rain-fall 0.5s ease-in infinite;
}

@keyframes rain-fall {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(4px); }
}

/* Snow fall animation */
.icon-snow--fall circle {
  animation: snow-fall 1s ease-in-out infinite;
}

@keyframes snow-fall {
  0%, 100% { opacity: 1; transform: translateY(0); }
  50% { opacity: 0.6; transform: translateY(2px); }
}

/* Thunder flash animation */
.icon-bolt--flash {
  animation: bolt-flash 2s ease-in-out infinite;
}

@keyframes bolt-flash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>