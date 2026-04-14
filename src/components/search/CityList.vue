<script setup lang="ts">
import { computed } from 'vue'
import type { City } from '@/types/city'

interface Props {
  cities: City[]
  currentCityId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [cityId: string]
  remove: [cityId: string]
}>()

const sortedCities = computed(() => {
  return [...props.cities].sort((a, b) => b.addedAt - a.addedAt)
})
</script>

<template>
  <div class="city-list-section">
    <div class="section-header">
      <h3>已添加城市</h3>
      <span class="city-count">{{ cities.length }}</span>
    </div>

    <div class="city-list">
      <div
        v-for="city in sortedCities"
        :key="city.id"
        class="city-item"
        :class="{ active: city.id === currentCityId }"
        @click="emit('select', city.id)"
      >
        <div class="city-info">
          <span class="city-name">{{ city.name }}</span>
          <span v-if="city.country" class="city-country">{{ city.country }}</span>
        </div>

        <div class="city-actions">
          <button
            v-if="cities.length > 1"
            class="remove-btn"
            @click.stop="emit('remove', city.id)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.city-list-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
}

.city-count {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

.city-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.city-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.city-item:hover {
  background: rgba(255, 255, 255, 0.12);
}

.city-item.active {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

.city-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.city-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
}

.city-country {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.city-actions {
  opacity: 0.5;
  transition: opacity 0.2s;
}

.city-item:hover .city-actions {
  opacity: 1;
}

.remove-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}
</style>