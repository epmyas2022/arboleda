<template>
  <TresPoints ref="firefliesRef">
    <TresBufferGeometry :position="[firefliesPositions, 3]" />
    <!-- En ThreeJS AdditiveBlending es el número 2 -->
    <TresPointsMaterial
      color="#e3ff00"
      :size="0.1"
      :size-attenuation="true"
      transparent
      :opacity="0.8"
      :blending="2"
    />
  </TresPoints>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef } from 'vue'

const props = defineProps<{
  totalFireflies?: number
}>()

let rafId: number

const firefliesRef = shallowRef<{ rotation: { y: number }; position: { y: number } } | null>(null)

const firefliesCount = props.totalFireflies || 1000

const firefliesPositions = new Float32Array(firefliesCount * 3)

for (let i = 0; i < firefliesCount * 3; i += 3) {
  firefliesPositions[i] = (Math.random() - 0.5) * 40 // X (ancho)
  firefliesPositions[i + 1] = Math.random() * 5 // Y (altura entre 0 y 5)
  firefliesPositions[i + 2] = (Math.random() - 0.5) * 40 // Z (profundidad)
}

onMounted(() => {
  const animateFireflies = () => {
    if (firefliesRef.value) {
      const time = performance.now() * 0.001
      firefliesRef.value.rotation.y = time * 0.05
      firefliesRef.value.position.y = Math.sin(time * 0.5) * 0.5
    }
    rafId = requestAnimationFrame(animateFireflies)
  }
  animateFireflies()
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})
</script>

<style></style>
