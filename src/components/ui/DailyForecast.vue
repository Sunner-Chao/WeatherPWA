<script setup lang="ts">
import WeatherIcon from '../weather/WeatherIcon.vue'
import type { DailyForecast } from '@/types/weather'

interface Props {
  forecast: DailyForecast[]
}

const props = defineProps<Props>()

function formatDate(date: string): string {
  const d = new Date(date)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (d.toDateString() === today.toDateString()) return '今天'
  if (d.toDateString() === tomorrow.toDateString()) return '明天'

  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekdays[d.getDay()]
}

// Calculate temperature range bar
function getTempBarStyle(forecast: DailyForecast): { left: string; width: string } {
  const allTemps = props.forecast.flatMap(f => [f.tempMin, f.tempMax])
  const minTemp = Math.min(...allTemps)
  const maxTemp = Math.max(...allTemps)
  const range = maxTemp - minTemp || 1

  return {
    left: `${((forecast.tempMin - minTemp) / range) * 100}%`,
    width: `${((forecast.tempMax - forecast.tempMin) / range) * 100}%`
  }
}
</script>

<template>
  <div class="daily-forecast">
    <div v-for="day in forecast" :key="day.date" class="day-row">
      <div class="day-date">{{ formatDate(day.date) }}</div>
      <WeatherIcon :condition="day.condition" :is-day="true" size="sm" />
      <div class="day-temps">
        <span class="temp-low">{{ Math.round(day.tempMin) }}°</span>
        <div class="temp-bar">
          <div class="temp-range" :style="getTempBarStyle(day)"></div>
        </div>
        <span class="temp-high">{{ Math.round(day.tempMax) }}°</span>
      </div>
      <div v-if="day.precipitationProbability > 20" class="day-precip">
        💧
      </div>
    </div>
  </div>
</template>

<style scoped>
.daily-forecast {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.day-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  transition: background 0.2s;
}

.day-row:hover {
  background: rgba(255, 255, 255, 0.08);
}

.day-date {
  min-width: 48px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #fff;
}

.day-temps {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.temp-low, .temp-high {
  min-width: 32px;
  font-size: 0.85rem;
  font-weight: 500;
}

.temp-low {
  color: rgba(255, 255, 255, 0.5);
  text-align: right;
}

.temp-high {
  color: #fff;
}

.temp-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  position: relative;
  min-width: 60px;
}

.temp-range {
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, #74b9ff, #f39c12);
  border-radius: 3px;
}

.day-precip {
  font-size: 0.8rem;
}
</style>