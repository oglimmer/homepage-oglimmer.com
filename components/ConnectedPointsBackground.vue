<template>
  <canvas ref="canvasRef" class="fixed inset-0 z-0 bg-[#16213e]" />
</template>

<script setup lang="ts">
interface Point {
  x: number
  y: number
  vx: number
  vy: number
  fast?: boolean
  opacity: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const points: Point[] = []

const CONNECTION_DISTANCE = 100
const POINT_DENSITY = 5000 // One point per X square pixels

let animationId: number | null = null
let fastPointTimeout: ReturnType<typeof setTimeout> | null = null

function initPoints(canvas: HTMLCanvasElement) {
  const area = canvas.width * canvas.height
  const numPoints = Math.floor(area / POINT_DENSITY)

  points.length = 0
  for (let i = 0; i < numPoints; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 0.1 + Math.random() * 0.4
    points.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      opacity: 0, // Start invisible, will fade in
    })
  }
}

function spawnFastPoint(canvas: HTMLCanvasElement) {
  const fromLeft = Math.random() < 0.5
  const angle = (Math.random() - 0.5) * Math.PI * 0.5
  const speed = 4 + Math.random() * 4

  const point: Point = {
    x: fromLeft ? 0 : canvas.width,
    y: Math.random() * canvas.height,
    vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1),
    vy: Math.sin(angle) * speed,
    fast: true,
    opacity: 1, // Fast points appear immediately
  }
  points.push(point)

  const nextSpawn = 5000 + Math.random() * 10000
  fastPointTimeout = setTimeout(() => spawnFastPoint(canvas), nextSpawn)
}

function update(canvas: HTMLCanvasElement) {
  for (let i = points.length - 1; i >= 0; i--) {
    const point = points[i]
    if (!point) continue

    point.x += point.vx
    point.y += point.vy

    // Fade in effect - gradually increase opacity
    if (point.opacity < 1) {
      point.opacity = Math.min(1, point.opacity + 0.005) // ~3 seconds to fully fade in at 60fps
    }

    if (point.fast) {
      if (point.x < -50 || point.x > canvas.width + 50) {
        points.splice(i, 1)
      }
    }
    else {
      if (point.x < 0 || point.x > canvas.width) {
        point.vx *= -1
        point.x = Math.max(0, Math.min(canvas.width, point.x))
      }
      if (point.y < 0 || point.y > canvas.height) {
        point.vy *= -1
        point.y = Math.max(0, Math.min(canvas.height, point.y))
      }
    }
  }
}

function distance(p1: Point, p2: Point) {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  return Math.sqrt(dx * dx + dy * dy)
}

function draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.lineWidth = 1

  // Draw lines between close points
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i]
    if (!p1) continue

    for (let j = i + 1; j < points.length; j++) {
      const p2 = points[j]
      if (!p2) continue

      const dist = distance(p1, p2)
      if (dist < CONNECTION_DISTANCE) {
        const distOpacity = 1 - (dist / CONNECTION_DISTANCE)
        const pointOpacity = Math.min(p1.opacity, p2.opacity)
        const hasFast = p1.fast || p2.fast
        if (hasFast) {
          ctx.strokeStyle = `rgba(255, 200, 100, ${distOpacity * 0.7 * pointOpacity})`
        }
        else {
          ctx.strokeStyle = `rgba(99, 182, 255, ${distOpacity * 0.5 * pointOpacity})`
        }
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
      }
    }
  }

  // Draw regular points
  ctx.shadowBlur = 0
  for (const point of points) {
    if (!point.fast) {
      ctx.fillStyle = `rgba(99, 182, 255, ${point.opacity})`
      ctx.beginPath()
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Draw fast points with glow
  for (const point of points) {
    if (point.fast) {
      ctx.shadowBlur = 20
      ctx.shadowColor = '#ffdd44'
      ctx.fillStyle = `rgba(255, 255, 255, ${point.opacity})`
      ctx.beginPath()
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
      ctx.fill()

      ctx.shadowBlur = 40
      ctx.shadowColor = '#ff8800'
      ctx.fillStyle = `rgba(255, 200, 100, ${0.6 * point.opacity})`
      ctx.beginPath()
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.shadowBlur = 0
}

function animate(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  update(canvas)
  draw(ctx, canvas)
  animationId = requestAnimationFrame(() => animate(ctx, canvas))
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas)
    return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  initPoints(canvas)
}

onMounted(async () => {
  await nextTick()

  const canvas = canvasRef.value
  if (!canvas)
    return

  const ctx = canvas.getContext('2d')
  if (!ctx)
    return

  // Set canvas size immediately but delay spawning points
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  window.addEventListener('resize', resize)

  // Start animation loop (will be empty until points spawn)
  animate(ctx, canvas)

  // Spawn points after 3 seconds
  setTimeout(() => {
    initPoints(canvas)

    // Start spawning fast points 5-15 seconds after regular points appear
    const fastPointDelay = 5000 + Math.random() * 10000
    fastPointTimeout = setTimeout(() => spawnFastPoint(canvas), fastPointDelay)
  }, 3000)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (fastPointTimeout) {
    clearTimeout(fastPointTimeout)
  }
})
</script>
