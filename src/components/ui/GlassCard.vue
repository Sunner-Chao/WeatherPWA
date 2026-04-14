<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'accent' | 'dark'
  padding?: 'sm' | 'md' | 'lg'
  blur?: number
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  blur: 20,
  hover: false
})

const glassStyles = computed(() => {
  const opacityMap = {
    default: 0.1,
    accent: 0.15,
    dark: 0.2
  }

  const paddingMap = {
    sm: 'var(--space-sm)',
    md: 'var(--space-md)',
    lg: 'var(--space-lg)'
  }

  return {
    backdropFilter: `blur(${props.blur}px)`,
    WebkitBackdropFilter: `blur(${props.blur}px)`,
    background: `rgba(255, 255, 255, ${opacityMap[props.variant]})`,
    padding: paddingMap[props.padding]
  }
})
</script>

<template>
  <div
    class="glass-card"
    :class="{ 'glass-card--hover': hover }"
    :style="glassStyles"
  >
    <slot />
  </div>
</template>

<style scoped>
.glass-card {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-xl);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all var(--duration-normal) var(--ease-out);
}

.glass-card--hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.15);
}
</style>