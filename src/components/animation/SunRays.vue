<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)

interface SunRay {
  angle: number
  length: number
  width: number
  opacity: number
  speed: number
}

let rays: SunRay[] = []
let animationFrame: number | null = null

function initRays() {
  rays = []
  for (let i = 0; i < 12; i++) {
    rays.push({
      angle: i * 30,
      length: 150 + Math.random() * 100,
      width: 2 + Math.random() * 3,
      opacity: 0.1 + Math.random() * 0.2,
      speed: 0.05 + Math.random() * 0.1
    })
  }
}

function draw() {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  const centerX = canvas.value.width * 0.7
  const centerY = canvas.value.height * 0.3

  // Draw sun glow
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200)
  gradient.addColorStop(0, 'rgba(255, 217, 61, 0.3)')
  gradient.addColorStop(0.5, 'rgba(255, 217, 61, 0.1)')
  gradient.addColorStop(1, 'rgba(255, 217, 61, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)

  // Draw rays
  rays.forEach(ray => {
    const radians = ray.angle * Math.PI / 180
    const endX = centerX + Math.cos(radians) * ray.length
    const endY = centerY + Math.sin(radians) * ray.length

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(endX, endY)
    ctx.strokeStyle = `rgba(255, 217, 61, ${ray.opacity})`
    ctx.lineWidth = ray.width
    ctx.stroke()

    // Rotate ray
    ray.angle += ray.speed
    if (ray.angle >= 360) ray.angle = 0
  })

  animationFrame = requestAnimationFrame(draw)
}

function resize() {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
}

onMounted(() => {
  initRays()
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
    class="sun-rays-animation"
  />
</template>

<style scoped>
.sun-rays-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
</style>