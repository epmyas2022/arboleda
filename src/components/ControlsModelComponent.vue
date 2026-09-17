<template>
  <div class="coordinates-panel">
    <h3>Ubicación del Marcador</h3>
    <p><strong>X:</strong> {{ coordinates.x }}</p>
    <p><strong>Y:</strong> {{ coordinates.y }}</p>
    <p><strong>Z:</strong> {{ coordinates.z }}</p>
  </div>
</template>

<script setup lang="ts">
import { GLTFModel } from '@tresjs/cientos'
import { ref, watch } from 'vue'

const model = defineModel<typeof GLTFModel | null>()

const coordinates = ref({ x: 0, y: 0, z: 0 })

watch(
  () => model?.value?.position,
  (newPos) => {
    if (newPos) {
      coordinates.value = {
        x: newPos.x.toFixed(2),
        y: newPos.y.toFixed(2),
        z: newPos.z.toFixed(2),
      }
    }
  },
  { deep: true },
)
</script>

<style>
.coordinates-panel {
  position: fixed;
  top: 10px;
  right: 10px;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
}
</style>
