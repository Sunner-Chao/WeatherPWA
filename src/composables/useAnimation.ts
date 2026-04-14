import { ref, computed } from 'vue'
import type { AnimationIntensity } from '@/types/weather'

export function useAnimation() {
  const enabled = ref(true)
  const intensity = ref<AnimationIntensity>('moderate')
  const fps = ref(60)

  const particleCount = computed(() => {
    if (!enabled.value) return 0
    switch (intensity.value) {
      case 'light': return 30
      case 'moderate': return 60
      case 'heavy': return 100
      default: return 60
    }
  })

  const animationSpeed = computed(() => {
    switch (intensity.value) {
      case 'light': return 0.5
      case 'moderate': return 1
      case 'heavy': return 1.5
      default: return 1
    }
  })

  const frameInterval = computed(() => 1000 / fps.value)

  function setIntensity(newIntensity: AnimationIntensity) {
    intensity.value = newIntensity
  }

  function toggle() {
    enabled.value = !enabled.value
  }

  function setFps(newFps: number) {
    fps.value = Math.max(30, Math.min(60, newFps))
  }

  return {
    enabled,
    intensity,
    fps,
    particleCount,
    animationSpeed,
    frameInterval,
    setIntensity,
    toggle,
    setFps
  }
}