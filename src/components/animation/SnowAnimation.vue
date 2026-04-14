<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAnimation } from '@/composables/useAnimation'

interface Props {
  intensity?: 'light' | 'moderate' | 'heavy'
}

const props = withDefaults(defineProps<Props>(), {
  intensity: 'moderate'
})

const canvas = ref<HTMLCanvasElement | null>(null)
const animation = useAnimation()

animation.setIntensity(props.intensity)

interface Snowflake {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  drift: number
  driftSpeed: number
}

let snowflakes: Snowflake[] = []
let animationFrame: number | null = null

const snowflakeCount = computed(() => animation.particleCount.value)

function initSnowflakes() {
  if (!canvas.value) return
  snowflakes = []
  for (let i = 0; i < snowflakeCount.value; i++) {
    snowflakes.push({
      x: Math.random() * canvas.value.width,
      y: Math.random() * canvas.value.height,
      size: 2 + Math.random() * 4,
      speed: 0.5 + Math.random() * 2 * animation.animationSpeed.value,
      opacity: 0.5 + Math.random() * 0.5,
      drift: Math.random() * Math.PI * 2,
      driftSpeed: 0.02 + Math.random() * 0.03
    })
  }
}

function draw() {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  snowflakes.forEach(flake => {
    // Draw snowflake
    ctx.beginPath()
    ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
    ctx.fill()

    // Add glow effect
    ctx.shadowBlur = 5
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)'

    // Move down with drift
    flake.y += flake.speed
    flake.drift += flake.driftSpeed
    flake.x += Math.sin(flake.drift) * 0.5

    // Reset if off screen
    if (flake.y > canvas.value!.height) {
      flake.y = -flake.size
      flake.x = Math.random() * canvas.value!.width
    }
  })

  if (animation.enabled.value) {
    animationFrame = requestAnimationFrame(draw)
  }
}

function resize() {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  initSnowflakes()
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
  draw()
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <canvas
    ref="canvas"
    class="snow-animation"
  />
</template>

<style scoped>
.snow-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
</style>