<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  intensity?: 'light' | 'moderate' | 'heavy'
}

const props = withDefaults(defineProps<Props>(), {
  intensity: 'moderate'
})

const canvas = ref<HTMLCanvasElement | null>(null)

interface Cloud {
  x: number
  y: number
  width: number
  height: number
  speed: number
  opacity: number
}

let clouds: Cloud[] = []
let animationFrame: number | null = null

const cloudCount = props.intensity === 'light' ? 3 : props.intensity === 'moderate' ? 5 : 8

function initClouds() {
  if (!canvas.value) return
  clouds = []
  for (let i = 0; i < cloudCount; i++) {
    clouds.push({
      x: Math.random() * canvas.value.width,
      y: Math.random() * canvas.value.height * 0.5,
      width: 100 + Math.random() * 200,
      height: 40 + Math.random() * 60,
      speed: 0.2 + Math.random() * 0.5,
      opacity: 0.2 + Math.random() * 0.3
    })
  }
}

function drawCloud(ctx: CanvasRenderingContext2D, cloud: Cloud) {
  ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`

  // Draw cloud as multiple overlapping circles
  const centerX = cloud.x + cloud.width / 2
  const centerY = cloud.y + cloud.height / 2

  ctx.beginPath()
  ctx.arc(centerX - cloud.width * 0.3, centerY, cloud.height * 0.6, 0, Math.PI * 2)
  ctx.arc(centerX, centerY - cloud.height * 0.2, cloud.height * 0.8, 0, Math.PI * 2)
  ctx.arc(centerX + cloud.width * 0.3, centerY, cloud.height * 0.5, 0, Math.PI * 2)
  ctx.arc(centerX + cloud.width * 0.1, centerY + cloud.height * 0.2, cloud.height * 0.4, 0, Math.PI * 2)
  ctx.fill()
}

function draw() {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  clouds.forEach(cloud => {
    drawCloud(ctx, cloud)

    // Move cloud
    cloud.x += cloud.speed

    // Reset if off screen
    if (cloud.x > canvas.value!.width + cloud.width) {
      cloud.x = -cloud.width
      cloud.y = Math.random() * canvas.value!.height * 0.5
    }
  })

  animationFrame = requestAnimationFrame(draw)
}

function resize() {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  initClouds()
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
    class="cloud-animation"
  />
</template>

<style scoped>
.cloud-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.8;
}
</style>