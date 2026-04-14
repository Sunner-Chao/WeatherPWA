<script setup lang="ts">
import type { CurrentWeather } from '@/types/weather'

interface Props {
  weather: CurrentWeather
}

const props = defineProps<Props>()

function windDirection(degrees: number): string {
  const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北']
  return directions[Math.round(degrees / 45) % 8]
}

function uvLevel(index: number): { text: string; color: string } {
  if (index <= 2) return { text: '低', color: '#27ae60' }
  if (index <= 5) return { text: '中等', color: '#f39c12' }
  if (index <= 7) return { text: '高', color: '#e67e22' }
  return { text: '很高', color: '#e74c3c' }
}

function visibilityLevel(meters: number): string {
  if (meters >= 10000) return '极佳'
  if (meters >= 5000) return '良好'
  if (meters >= 2000) return '一般'
  return '较差'
}
</script>

<template>
  <div class="weather-details">
    <div class="details-grid">
      <!-- Wind -->
      <div class="detail-card">
        <div class="detail-icon">💨</div>
        <div class="detail-info">
          <div class="detail-value">{{ Math.round(props.weather.windSpeed) }} km/h</div>
          <div class="detail-label">风速 · {{ windDirection(props.weather.windDirection) }}</div>
        </div>
      </div>

      <!-- Gusts -->
      <div class="detail-card">
        <div class="detail-icon">🌀</div>
        <div class="detail-info">
          <div class="detail-value">{{ Math.round(props.weather.windGusts) }} km/h</div>
          <div class="detail-label">阵风</div>
        </div>
      </div>

      <!-- Humidity -->
      <div class="detail-card">
        <div class="detail-icon">💧</div>
        <div class="detail-info">
          <div class="detail-value">{{ props.weather.humidity }}%</div>
          <div class="detail-label">湿度</div>
        </div>
        <div class="detail-bar">
          <div class="bar-fill humidity" :style="{ width: props.weather.humidity + '%' }"></div>
        </div>
      </div>

      <!-- Pressure -->
      <div class="detail-card">
        <div class="detail-icon">📊</div>
        <div class="detail-info">
          <div class="detail-value">{{ Math.round(props.weather.pressure) }}</div>
          <div class="detail-label">气压 hPa</div>
        </div>
      </div>

      <!-- Visibility -->
      <div class="detail-card">
        <div class="detail-icon">👁️</div>
        <div class="detail-info">
          <div class="detail-value">{{ (props.weather.visibility / 1000).toFixed(1) }} km</div>
          <div class="detail-label">能见度 · {{ visibilityLevel(props.weather.visibility) }}</div>
        </div>
      </div>

      <!-- UV Index -->
      <div class="detail-card">
        <div class="detail-icon">☀️</div>
        <div class="detail-info">
          <div class="detail-value" :style="{ color: uvLevel(props.weather.uvIndex).color }">
            {{ props.weather.uvIndex }}
          </div>
          <div class="detail-label">紫外线 · {{ uvLevel(props.weather.uvIndex).text }}</div>
        </div>
      </div>

      <!-- Dew Point -->
      <div class="detail-card">
        <div class="detail-icon">❄️</div>
        <div class="detail-info">
          <div class="detail-value">{{ Math.round(props.weather.dewPoint) }}°</div>
          <div class="detail-label">露点温度</div>
        </div>
      </div>

      <!-- Cloud Cover -->
      <div class="detail-card">
        <div class="detail-icon">☁️</div>
        <div class="detail-info">
          <div class="detail-value">{{ props.weather.cloudCover }}%</div>
          <div class="detail-label">云量</div>
        </div>
        <div class="detail-bar">
          <div class="bar-fill cloud" :style="{ width: props.weather.cloudCover + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-details {
  width: 100%;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.detail-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  transition: background 0.2s;
}

.detail-card:hover {
  background: rgba(255, 255, 255, 0.1);
}

.detail-icon {
  font-size: 1.25rem;
  width: 28px;
  text-align: center;
}

.detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.detail-value {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
}

.detail-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
}

.detail-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: 0.5rem;
}

.bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.bar-fill.humidity {
  background: linear-gradient(90deg, #74b9ff, #0984e3);
}

.bar-fill.cloud {
  background: linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.5));
}
</style>