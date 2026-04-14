<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { searchCities } from '@/services/geocodingApi'
import type { CitySearchResult } from '@/types/city'

const emit = defineEmits<{
  select: [city: CitySearchResult]
  locate: []
}>()

const query = ref('')
const results = ref<CitySearchResult[]>([])
const loading = ref(false)
const showResults = ref(false)
const searched = ref(false)

const hasQuery = computed(() => query.value.trim().length > 0)
const noResults = computed(() => searched.value && !loading.value && results.value.length === 0)

const debouncedSearch = useDebounceFn(async (searchQuery: string) => {
  if (!searchQuery.trim()) {
    results.value = []
    showResults.value = false
    searched.value = false
    return
  }

  loading.value = true
  searched.value = false
  showResults.value = true

  try {
    results.value = await searchCities(searchQuery)
    searched.value = true
  } catch (error) {
    console.error('搜索失败:', error)
    results.value = []
    searched.value = true
  } finally {
    loading.value = false
  }
}, 300)

watch(query, debouncedSearch)

function handleSelect(city: CitySearchResult) {
  emit('select', city)
  query.value = ''
  results.value = []
  showResults.value = false
  searched.value = false
}

function handleLocate() {
  emit('locate')
  query.value = ''
  results.value = []
  showResults.value = false
  searched.value = false
}

function handleFocus() {
  if (hasQuery.value) {
    showResults.value = true
  }
}

function handleBlur() {
  setTimeout(() => { showResults.value = false }, 300)
}
</script>

<template>
  <div class="city-search">
    <div class="search-header">
      <h3>添加城市</h3>
      <p class="search-tip">输入城市名称或使用GPS定位</p>
    </div>

    <!-- GPS Location Button -->
    <button class="locate-btn" @click="handleLocate">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>
        <circle cx="12" cy="12" r="10" stroke-opacity="0.3"/>
      </svg>
      <span>使用GPS定位当前位置</span>
    </button>

    <div class="search-divider">
      <span>或搜索城市</span>
    </div>

    <div class="search-input-wrapper">
      <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        v-model="query"
        type="text"
        placeholder="例如：杭州、Hangzhou..."
        class="search-input"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div v-if="loading" class="search-loading">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinning">
          <path d="M21 12a9 9 1 1 1-6-6"/>
        </svg>
      </div>
    </div>

    <!-- Search Results -->
    <Transition name="slide">
      <div v-if="showResults && hasQuery" class="results-container">
        <!-- Loading -->
        <div v-if="loading" class="loading-state">
          <span>正在搜索...</span>
        </div>

        <!-- Results -->
        <div v-else-if="results.length > 0" class="search-results">
          <div class="results-count">找到 {{ results.length }} 个城市</div>
          <div
            v-for="city in results"
            :key="city.id"
            class="result-item"
            @mousedown.prevent="handleSelect(city)"
          >
            <div class="result-main">
              <span class="result-name">{{ city.name }}</span>
              <span class="result-full">{{ city.fullName }}</span>
            </div>
            <div class="result-add">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else-if="noResults" class="no-results">
          <div class="no-results-icon">🔍</div>
          <div class="no-results-text">未找到 "{{ query }}"</div>
          <div class="no-results-tip">
            <p>小城市可能不在数据库中，建议：</p>
            <ul>
              <li>点击上方"使用GPS定位"获取当前位置</li>
              <li>搜索附近的大城市</li>
              <li>输入拼音或英文名称</li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.city-search {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.search-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.search-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #fff;
}

.search-tip {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.locate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: rgba(52, 152, 219, 0.2);
  border: 1px solid rgba(52, 152, 219, 0.3);
  border-radius: 1rem;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.locate-btn:hover {
  background: rgba(52, 152, 219, 0.3);
  border-color: rgba(52, 152, 219, 0.4);
}

.search-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
}

.search-divider span {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: rgba(255, 255, 255, 0.5);
}

.search-input {
  width: 100%;
  padding: 0.875rem 2.5rem 0.875rem 3rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-loading {
  position: absolute;
  right: 1rem;
  color: rgba(255, 255, 255, 0.5);
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.results-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.loading-state {
  padding: 1rem;
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.results-count {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  padding: 0.25rem 0;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.result-item:hover {
  background: rgba(255, 255, 255, 0.15);
}

.result-main {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.result-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
}

.result-full {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.result-add {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #fff;
}

.no-results {
  padding: 1.5rem;
  text-align: center;
}

.no-results-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.no-results-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
}

.no-results-tip {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.no-results-tip p {
  margin-bottom: 0.5rem;
}

.no-results-tip ul {
  list-style: none;
  padding: 0;
}

.no-results-tip li {
  padding: 0.25rem 0;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>