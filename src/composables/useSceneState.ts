import { ref } from 'vue'
import type { GLTFModel } from '@tresjs/cientos'

export interface Point3D {
  x: number
  y: number
  z: number
}

export interface AnimalPosition {
  scale: number
  points: Point3D
}

export interface Positions {
  fox: AnimalPosition
  deer: AnimalPosition
  elephant: AnimalPosition
  rabbit: AnimalPosition
  rhinoceros: AnimalPosition
}

export function useSceneState() {
  const position = ref([5, -0.2, 7])
  const lookAtTarget = ref([4, -0.2, 2])

  const modelRef = ref<typeof GLTFModel | null>(null) // Referencia al modelo 3D para los controles de posición

  const debug = ref(false) // Para activar los controles de la cámara y ver el modelo en detalle

  const positions = ref<Positions>({
    fox: {
      scale: 0.04,
      points: { x: 0.2, y: -1.65, z: 0.81 },
    },

    deer: {
      scale: 0.002,
      points: { x: 0.5, y: -1.57, z: -2.78 },
    },

    elephant: {
      scale: 0.04,
      points: { x: -2.33, y: -1.68, z: -0.12 },
    },

    rabbit: {
      scale: 0.17,
      points: { x: 1.76, y: -1.65, z: 1.18 },
    },

    rhinoceros: {
      scale: 0.002,
      points: { x: -3.51, y: -1.55, z: -3.04 },
    },
  })

  return {
    position,
    lookAtTarget,
    modelRef,
    debug,
    positions,
  }
}
