<script setup lang="ts">
import WeatherIcon from '../weather/WeatherIcon.vue'
import type { HourlyForecast } from '@/types/weather'

interface Props {
  forecast: HourlyForecast[]
}

defineProps<Props>()

function formatTime(time: string): string {
  const date = new Date(time)
  const hours = date.getHours()
  const now = new Date().getHours()

  if (hours === now) return '现在'
  return `${hours}:00`
}

function isNow(time: string): boolean {
  return new Date().getHours() === new Date(time).getHours()
}
</script>

<template>
  <div class="hourly-forecast">
    <div class="forecast-scroll">
      <div
        v-for="hour in forecast"
        :key="hour.time"
        class="hour-item"
        :class="{ now: isNow(hour.time) }"
      >
        <div class="hour-time">{{ formatTime(hour.time) }}</div>
        <WeatherIcon
          :condition="hour.condition"
          :is-day="hour.isDay"
          size="sm"
          class="hour-icon"
        />
        <div class="hour-temp">{{ Math.round(hour.temperature) }}°</div>
        <div v-if="hour.precipitationProbability > 20" class="hour-precip">
          💧 {{ hour.precipitationProbability }}%
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hourly-forecast {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.forecast-scroll {
  display: flex;
  gap: 0.75rem;
  padding-bottom: 0.5rem;
}

.hour-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 56px;
  padding: 0.75rem 0.5rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 1rem;
  transition: all 0.2s ease;
}

.hour-item.now {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hour-time {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
}

.hour-item.now .hour-time {
  color: #fff;
}

.hour-icon {
  margin: 0.25rem 0;
}

.hour-temp {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
}

.hour-precip {
  font-size: 0.65rem;
  color: #74b9ff;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>