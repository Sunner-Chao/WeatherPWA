<script setup lang="ts">
import { computed } from 'vue'
import WeatherIcon from '../weather/WeatherIcon.vue'
import type { CurrentWeather } from '@/types/weather'

interface Props {
  weather: CurrentWeather
  cityName?: string
}

const props = defineProps<Props>()

const temperatureDisplay = computed(() => Math.round(props.weather.temperature))
const feelsLikeDisplay = computed(() => Math.round(props.weather.feelsLike))

const conditionText = computed(() => {
  const conditionMap: Record<string, string> = {
    clear: '晴朗',
    partly_cloudy: '多云',
    cloudy: '阴天',
    overcast: '阴沉',
    fog: '雾',
    drizzle: '小雨',
    rain: '雨',
    heavy_rain: '大雨',
    thunderstorm: '雷暴',
    snow: '雪',
    heavy_snow: '大雪',
    sleet: '雨夹雪',
    hail: '冰雹'
  }
  return conditionMap[props.weather.condition] || '未知'
})

// Time greeting with weather suggestion
const greeting = computed(() => {
  const hour = new Date().getHours()
  const condition = props.weather.condition

  // Weather suggestions based on condition
  const weatherTips: Record<string, string> = {
    clear: '阳光正好',
    partly_cloudy: '云淡风轻',
    cloudy: '今日多云',
    overcast: '天色阴沉',
    fog: '雾气弥漫',
    drizzle: '细雨绵绵',
    rain: '注意雨具',
    heavy_rain: '大雨来袭',
    thunderstorm: '雷电交加',
    snow: '雪花飘飘',
    heavy_snow: '大雪纷飞',
    sleet: '雨雪交加',
    hail: '小心冰雹'
  }

  const tip = weatherTips[condition] || '今日天气'

  if (hour < 6) return `夜深了，${tip}`
  if (hour < 9) return `清晨${tip}`
  if (hour < 12) return `上午${tip}`
  if (hour < 14) return `中午${tip}`
  if (hour < 18) return `下午${tip}`
  if (hour < 21) return `傍晚${tip}`
  return `夜深了，${tip}`
})
</script>

<template>
  <div class="current-weather-card">
    <!-- Header with greeting and city -->
    <div class="weather-header">
      <div class="greeting">{{ greeting }}</div>
      <div class="city-name">{{ cityName || '未知位置' }}</div>
      <div class="datetime">
        {{ new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' }) }}
      </div>
    </div>

    <!-- Main temperature display -->
    <div class="temperature-main">
      <div class="temp-container">
        <WeatherIcon
          :condition="weather.condition"
          :is-day="weather.isDay"
          size="xl"
          animated
          class="weather-icon-main"
        />
        <div class="temp-number">{{ temperatureDisplay }}</div>
        <div class="temp-unit">°</div>
      </div>
      <div class="condition-row">
        <span class="condition-text">{{ conditionText }}</span>
        <span class="feels-like">体感 {{ feelsLikeDisplay }}°</span>
      </div>
    </div>

    <!-- Stats grid -->
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-icon">💧</div>
        <div class="stat-content">
          <div class="stat-value">{{ weather.humidity }}%</div>
          <div class="stat-label">湿度</div>
        </div>
        <div class="stat-bar">
          <div class="stat-bar-fill humidity" :style="{ width: weather.humidity + '%' }"></div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon">💨</div>
        <div class="stat-content">
          <div class="stat-value">{{ Math.round(weather.windSpeed) }}</div>
          <div class="stat-label">风速 km/h</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon">🌡️</div>
        <div class="stat-content">
          <div class="stat-value">{{ Math.round(weather.pressure) }}</div>
          <div class="stat-label">气压 hPa</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon">☀️</div>
        <div class="stat-content">
          <div class="stat-value uv-{{ weather.uvIndex <= 2 ? 'low' : weather.uvIndex <= 5 ? 'mid' : 'high' }}">{{ weather.uvIndex }}</div>
          <div class="stat-label">紫外线</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.current-weather-card {
  padding: 2rem 1.5rem;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 2rem;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.weather-header {
  text-align: center;
  margin-bottom: 2rem;
}

.greeting {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  letter-spacing: 0.5px;
}

.city-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  margin: 0.5rem 0;
  letter-spacing: -0.5px;
}

.datetime {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 300;
}

.temperature-main {
  text-align: center;
  margin-bottom: 2rem;
}

.temp-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.weather-icon-main {
  margin-top: 1rem;
}

.temp-number {
  font-size: clamp(5rem, 20vw, 8rem);
  font-weight: 200;
  color: #fff;
  line-height: 1;
  letter-spacing: -4px;
}

.temp-unit {
  font-size: 2rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 1rem;
}

.condition-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.condition-text {
  font-size: 1.25rem;
  font-weight: 500;
  color: #fff;
}

.feels-like {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  transition: all 0.2s ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.12);
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #fff;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.stat-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: 0.5rem;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.stat-bar-fill.humidity {
  background: linear-gradient(90deg, #74b9ff, #0984e3);
}

/* UV Index colors */
.stat-value[class*="uv-low"] { color: #27ae60; }
.stat-value[class*="uv-mid"] { color: #f39c12; }
.stat-value[class*="uv-high"] { color: #e74c3c; }
</style>