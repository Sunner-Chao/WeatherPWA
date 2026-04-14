<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useWeather } from '@/composables/useWeather'
import { useGeolocation } from '@/composables/useGeolocation'
import { useCityStorage } from '@/composables/useCityStorage'
import { useWeatherBackground } from '@/composables/useWeatherBackground'

import CurrentWeather from '@/components/ui/CurrentWeather.vue'
import HourlyForecast from '@/components/ui/HourlyForecast.vue'
import DailyForecast from '@/components/ui/DailyForecast.vue'
import WeatherDetails from '@/components/ui/WeatherDetails.vue'
import CitySearch from '@/components/search/CitySearch.vue'
import CityList from '@/components/search/CityList.vue'

import RainAnimation from '@/components/animation/RainAnimation.vue'
import SnowAnimation from '@/components/animation/SnowAnimation.vue'
import CloudAnimation from '@/components/animation/CloudAnimation.vue'
import SunRays from '@/components/animation/SunRays.vue'

import type { CitySearchResult } from '@/types/city'

// State
const showSearch = ref(false)
const showDetails = ref(false)
const showForecast = ref(false)
const showHourly = ref(false)
const locating = ref(false)

// Composables
const weather = useWeather()
const geolocation = useGeolocation()
const cityStorage = useCityStorage()
const background = useWeatherBackground()

// Computed
const cityName = computed(() => cityStorage.currentCity.value?.name || '')
const hasWeather = computed(() => weather.hasData.value)
const currentCondition = computed(() => weather.currentWeather.value?.condition || 'clear')
const isDay = computed(() => weather.currentWeather.value?.isDay ?? true)

// Background gradient
const gradientStyle = computed(() => ({
  background: background.gradient.value,
  transition: 'background 1s ease-out'
}))

// Animation type based on weather
const particleType = computed(() => background.theme.value.particleType)
const particleIntensity = computed(() => background.theme.value.particleIntensity)

// Watch weather changes to update background
watch([currentCondition, isDay], ([condition, day]) => {
  background.setWeather(condition, day)
})

// Initialize - start with Beijing immediately
onMounted(async () => {
  // Set default city Beijing first and load weather
  cityStorage.currentCity.value = {
    id: 'beijing-default',
    name: '北京',
    country: '中国',
    countryCode: 'CN',
    latitude: 39.9042,
    longitude: 116.4074,
    isFavorite: false,
    addedAt: Date.now()
  }
  cityStorage.cities.value = [cityStorage.currentCity.value]

  // Load Beijing weather first
  await weather.loadWeather(39.9042, 116.4074)

  // Then try to get user's actual location in background
  tryGetLocation()
})

// Try to get location (can be called manually)
async function tryGetLocation() {
  locating.value = true
  try {
    const location = await geolocation.getCurrentLocation()
    if (location) {
      // Use reverse geocoding to get city name
      const cityNameFromCoords = await getCityNameFromCoords(location.lat, location.lon)
      cityStorage.setCurrentLocationAsCity(location.lat, location.lon, cityNameFromCoords)
      await weather.loadWeather(location.lat, location.lon)
    }
  } catch (e) {
    console.warn('定位失败:', e)
  } finally {
    locating.value = false
  }
}

// Reverse geocoding to get city name
async function getCityNameFromCoords(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=zh&format=json`
    )
    const data = await response.json()
    if (data.results && data.results[0]) {
      const name = data.results[0].name
      // 如果城市名在映射表中，使用映射的省份
      if (CITY_PROVINCE_MAP[name]) {
        return name
      }
      return name || '当前位置'
    }
  } catch {
    console.warn('获取城市名称失败')
  }
  return '当前位置'
}

// 城市省份映射（用于逆地理编码）
const CITY_PROVINCE_MAP: Record<string, string> = {
  '杭州': '浙江', '宁波': '浙江', '温州': '浙江', '绍兴': '浙江',
  '嘉兴': '浙江', '湖州': '浙江', '金华': '浙江', '台州': '浙江',
  '衢州': '浙江', '丽水': '浙江', '舟山': '浙江',
  // 其他城市...（复用 geocodingApi 中的映射）
}

// Handlers
async function handleCitySelect(city: CitySearchResult) {
  const addedCity = cityStorage.addCity(city)
  await weather.loadWeather(addedCity.latitude, addedCity.longitude)
  showSearch.value = false
}

// Handle GPS location request
async function handleLocate() {
  showSearch.value = false
  locating.value = true

  try {
    const location = await geolocation.getCurrentLocation()
    if (location) {
      // 如果是 IP 定位，可能直接带有城市名称
      const ipLocation = location as any
      if (ipLocation.city && geolocation.usingIPLocation.value) {
        // IP 定位成功，直接使用返回的城市名
        cityStorage.setCurrentLocationAsCity(location.lat, location.lon, ipLocation.city)
      } else {
        // GPS 定位，需要逆地理编码获取城市名
        const cityNameFromCoords = await getCityNameFromCoords(location.lat, location.lon)
        cityStorage.setCurrentLocationAsCity(location.lat, location.lon, cityNameFromCoords)
      }
      await weather.loadWeather(location.lat, location.lon)

      // 如果使用的是 IP 定位，给用户提示
      if (geolocation.usingIPLocation.value) {
        // 可以在这里显示一个toast提示用户使用的是IP定位（精度较低）
        console.log('使用了IP定位，精度可能较低')
      }
    } else {
      // 定位失败，显示详细提示
      const errorMsg = geolocation.error.value || '无法获取位置'
      alert(`${errorMsg}\n\n可能的解决方案：\n1. 在浏览器设置中允许定位权限\nn2. 使用HTTPS环境（部署到服务器后即可）\n3. 或直接搜索城市名称`)
    }
  } catch (e) {
    alert('定位失败: ' + (e instanceof Error ? e.message : '未知错误'))
  } finally {
    locating.value = false
  }
}

async function handleCityChange(cityId: string) {
  cityStorage.setCurrentCity(cityId)
  const city = cityStorage.currentCity.value
  if (city) {
    await weather.loadWeather(city.latitude, city.longitude)
  }
}

function handleCityRemove(cityId: string) {
  cityStorage.removeCity(cityId)
  if (cityStorage.currentCity.value) {
    weather.loadWeather(
      cityStorage.currentCity.value.latitude,
      cityStorage.currentCity.value.longitude
    )
  }
}

async function refreshWeather() {
  const city = cityStorage.currentCity.value
  if (city) {
    await weather.loadWeather(city.latitude, city.longitude, true)
  }
}
</script>

<template>
  <div class="app-container" :style="gradientStyle">
    <!-- Weather Animations -->
    <RainAnimation v-if="particleType === 'rain'" :intensity="particleIntensity" />
    <SnowAnimation v-if="particleType === 'snow'" :intensity="particleIntensity" />
    <CloudAnimation v-if="particleType === 'clouds'" :intensity="particleIntensity" />
    <SunRays v-if="particleType === 'sun-rays'" />

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <button class="header-btn location-btn" @click="showSearch = !showSearch">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </button>
        </div>
        <div class="header-center">
          <Transition name="fade" mode="out-in">
            <span class="header-city" :key="cityName">{{ cityName }}</span>
          </Transition>
        </div>
        <div class="header-right">
          <button class="header-btn refresh-btn" @click="refreshWeather" :disabled="weather.loading.value">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ spinning: weather.loading.value }">
              <path d="M23 4v6h-6M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- City Search Modal -->
      <Transition name="modal">
        <div v-if="showSearch" class="search-modal">
          <div class="search-modal-content">
            <CitySearch @select="handleCitySelect" @locate="handleLocate" />
            <CityList
              v-if="cityStorage.hasCities.value"
              :cities="cityStorage.cities.value"
              :current-city-id="cityStorage.currentCity.value?.id"
              @select="handleCityChange"
              @remove="handleCityRemove"
            />
            <button class="close-btn" @click="showSearch = false">
              <span>关闭</span>
            </button>
          </div>
        </div>
      </Transition>

      <!-- Loading State -->
      <Transition name="fade">
        <div v-if="weather.loading.value && !hasWeather" class="loading-state">
          <div class="loading-icon">
            <div class="loading-circle"></div>
          </div>
          <p class="loading-text">正在获取天气数据...</p>
        </div>
      </Transition>

      <!-- Error State -->
      <Transition name="fade">
        <div v-if="weather.hasError.value && !hasWeather" class="error-state">
          <div class="error-icon">⚠️</div>
          <p class="error-text">{{ weather.error.value }}</p>
          <button class="retry-btn" @click="refreshWeather">重试</button>
        </div>
      </Transition>

      <!-- Weather Content -->
      <Transition name="fade">
        <div v-if="hasWeather" class="weather-content">
          <!-- Current Weather Card -->
          <CurrentWeather
            v-if="weather.currentWeather.value"
            :weather="weather.currentWeather.value"
            :city-name="cityName"
          />

          <!-- Quick Access Buttons -->
          <div class="quick-actions">
            <button class="action-btn" :class="{ active: showHourly }" @click="showHourly = !showHourly; showForecast = false; showDetails = false">
              <span class="action-icon">⏰</span>
              <span class="action-label">24小时</span>
            </button>
            <button class="action-btn" :class="{ active: showForecast }" @click="showForecast = !showForecast; showHourly = false; showDetails = false">
              <span class="action-icon">📅</span>
              <span class="action-label">7天预报</span>
            </button>
            <button class="action-btn" :class="{ active: showDetails }" @click="showDetails = !showDetails; showHourly = false; showForecast = false">
              <span class="action-icon">📊</span>
              <span class="action-label">详细数据</span>
            </button>
          </div>

          <!-- Hourly Forecast -->
          <Transition name="slide-up">
            <div v-if="showHourly" class="section-card">
              <div class="section-header">
                <h3>24小时预报</h3>
              </div>
              <HourlyForecast v-if="weather.hourlyForecast.value" :forecast="weather.hourlyForecast.value" />
            </div>
          </Transition>

          <!-- Daily Forecast -->
          <Transition name="slide-up">
            <div v-if="showForecast" class="section-card">
              <div class="section-header">
                <h3>7天预报</h3>
              </div>
              <DailyForecast v-if="weather.dailyForecast.value" :forecast="weather.dailyForecast.value" />
            </div>
          </Transition>

          <!-- Weather Details -->
          <Transition name="slide-up">
            <div v-if="showDetails" class="section-card">
              <div class="section-header">
                <h3>详细数据</h3>
              </div>
              <WeatherDetails v-if="weather.currentWeather.value" :weather="weather.currentWeather.value" />
            </div>
          </Transition>
        </div>
      </Transition>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  min-height: 100dvh;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}

.main-content {
  position: relative;
  z-index: 10;
  max-width: 420px;
  margin: 0 auto;
  padding: 1rem;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  gap: 1rem;
}

.header-left, .header-right {
  flex: 0 0 auto;
}

.header-center {
  flex: 1;
  text-align: center;
  overflow: hidden;
}

.header-city {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
}

.header-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.header-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.header-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Search Modal */
.search-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1rem;
}

.search-modal-content {
  width: 100%;
  max-width: 420px;
  background: rgba(30, 30, 40, 0.95);
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.close-btn {
  width: 100%;
  padding: 0.875rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 1rem;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Loading & Error States */
.loading-state, .error-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
}

.loading-icon {
  width: 60px;
  height: 60px;
  position: relative;
}

.loading-circle {
  width: 100%;
  height: 100%;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text, .error-text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

.error-icon {
  font-size: 3rem;
}

.retry-btn {
  padding: 0.75rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 1rem;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Weather Content */
.weather-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.action-btn.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.action-icon {
  font-size: 1.5rem;
}

.action-label {
  font-weight: 500;
}

/* Section Card */
.section-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 1.5rem;
  padding: 1.25rem;
}

.section-header {
  margin-bottom: 1rem;
}

.section-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .search-modal-content,
.modal-leave-to .search-modal-content {
  transform: translateY(100%);
}
</style>