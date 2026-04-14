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

interface Drop {
  x: number
  y: number
  speed: number
  length: number
  opacity: number
}

let drops: Drop[] = []
let animationFrame: number | null = null

const dropCount = computed(() => animation.particleCount.value * 2)

function initDrops() {
  if (!canvas.value) return
  drops = []
  for (let i = 0; i < dropCount.value; i++) {
    drops.push({
      x: Math.random() * canvas.value.width,
      y: Math.random() * canvas.value.height,
      speed: 2 + Math.random() * 4 * animation.animationSpeed.value,
      length: 10 + Math.random() * 20,
      opacity: 0.3 + Math.random() * 0.5
    })
  }
}

function draw() {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  drops.forEach(drop => {
    ctx.beginPath()
    ctx.moveTo(drop.x, drop.y)
    ctx.lineTo(drop.x + 1, drop.y + drop.length)
    ctx.strokeStyle = `rgba(174, 194, 224, ${drop.opacity})`
    ctx.lineWidth = 1
    ctx.stroke()

    // Move drop down
    drop.y += drop.speed

    // Reset if off screen
    if (drop.y > canvas.value!.height) {
      drop.y = -drop.length
      drop.x = Math.random() * canvas.value!.width
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
  initDrops()
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
    class="rain-animation"
  />
</template>

<style scoped>
.rain-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
</style>