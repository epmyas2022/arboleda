<template>
  <template v-if="scene">
    <TransformControls v-if="props.debug" :object="modelRef" mode="translate" />

    <primitive
      ref="modelRef"
      :object="scene"
      :scale="[scale, scale, scale]"
      :position="[props.position.x, props.position.y, props.position.z]"
    />
  </template>
</template>

<script setup lang="ts">
import { GLTFModel, TransformControls, useGLTF } from '@tresjs/cientos'
import { computed } from 'vue'

const props = defineProps<{
  modelPath: string
  debug: boolean
  position: { x: number; y: number; z: number }
  scale: number
}>()

const modelRef = defineModel<typeof GLTFModel | null>({ default: null })

const { state } = useGLTF(props.modelPath)

const scene = computed(() => state.value?.scene)
</script>

<style></style>
