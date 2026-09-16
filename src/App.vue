<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { /* OrbitControls, */ GLTFModel } from '@tresjs/cientos'
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import ParticlesComponent from './components/ParticlesComponent.vue'

// Configuración de la cámara inicial
const position = ref([5, -0.2, 7])
const lookAtTarget = ref([4, -0.2, 2])

let ctx: gsap.Context

onMounted(() => {
  // GSAP Context asegura que podamos limpiar todo al desmontar el componente
  ctx = gsap.context(() => {
    const cameraData = {
      x: 5,
      y: -0.2,
      z: 7,
      lookX: 4,
      lookY: -0.2,
      lookZ: 2,
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.sections-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
      onUpdate: () => {
        position.value = [cameraData.x, cameraData.y, cameraData.z]
        lookAtTarget.value = [cameraData.lookX, cameraData.lookY, cameraData.lookZ]
      },
    })

    // Paso 1: Avanzamos recto hasta la mitad del bosque (Llegada a "El Bosque")
    tl.to(cameraData, {
      x: 0,
      z: 3,
      lookX: -1,
      lookZ: -7,
      ease: 'none',
    })

    // Paso 2: Frenamos el avance y ROTAMOS la cámara hacia la derecha para admirar el paisaje
    tl.to(cameraData, {
      x: 0,
      z: -3,
      lookX: 10,
      lookZ: -7,
      ease: 'power2.inOut',
      duration: 0.5, // Hace que este paso dure la mitad de un tramo normal
    })

    // Paso 3: Retomamos la vista al frente y caminamos hasta el final (Llegada a "Mis Obras")
    tl.to(cameraData, {
      x: 0,
      z: -4,
      lookX: 15,
      lookZ: -7,
      ease: 'none',
    })
  })
})

onUnmounted(() => {
  ctx.revert() // Destruye el ScrollTrigger al cambiar de página
})
</script>

<template>
  <main class="scrollable-page">
    <div class="canvas-bg">
      <TresCanvas clear-color="#b1e1ff" shadows>
        <!-- Niebla con muchísima más profundidad -->
        <TresFog :args="['#b1e1ff', 3, 10]" />

        <!-- Miramos de forma dinámica siguiendo la ruta del dron -->
        <TresPerspectiveCamera :position="position" :look-at="lookAtTarget" make-default />

        <!-- Luciérnagas -->
        <ParticlesComponent :total-fireflies="2000" />

        <Suspense>
          <GLTFModel
            path="/forest.glb"
            :position="[0, -1.5, 0]"
            :scale="[3.5, 3.5, 3.5]"
            cast-shadow
            receive-shadow
          />
        </Suspense>

        <!-- 1. Luz ambiente fría (celeste oscuro) para pintar las sombras -->
        <TresAmbientLight :intensity="0.5" color="#527fa6" />

        <!-- 2. Luz principal (Sol): Naranja saturado bien de costado para exagerar las formas geométricas -->
        <TresDirectionalLight
          :position="[20, 15, 10]"
          :intensity="3.5"
          color="#ff7a00"
          cast-shadow
        />

        <!-- 3. Luz de rebote (Relleno): Azul puro del otro lado para contrastar fuerte -->
        <TresDirectionalLight :position="[-15, 10, -15]" :intensity="1.5" color="#0055ff" />
      </TresCanvas>
    </div>

    <!-- Contenedor con múltiples secciones scrolleables -->
    <div class="sections-container">
      <section class="content-section align-left">
        <div class="text hero-text">
          <h1>Portfolio.</h1>
          <p class="text-secondary">Desarrollo interactivo y geometría low poly.</p>
          <div class="action-wrap">
            <span class="btn-minimal">Descubrir</span>
          </div>
        </div>
      </section>

      <section class="content-section align-right">
        <div class="text">
          <h2>El<br />Bosque</h2>
          <p class="text-secondary">
            Una experiencia inmersiva guiada por el scroll. Sin cajas, sin distracciones. Solo el
            contenido y el modelo.
          </p>
        </div>
      </section>

      <section class="content-section align-left">
        <div class="text">
          <h2>Mis<br />Obras</h2>
          <p class="text-secondary">Minimalismo puro. Dejá que el arte 3D hable por sí solo.</p>
          <div class="action-wrap">
            <span class="btn-minimal">Ver proyectos</span>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
/* Layout Base */
.scrollable-page {
  position: relative;
}

.canvas-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100svh;
  z-index: -1;
}

.sections-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  pointer-events: none;
}

.content-section {
  height: 100svh;
  display: flex;
  align-items: center;
  padding: 0 8%;
  font-family: 'Fredoka', Helvetica, Arial, sans-serif;
  color: #ffffff;
}

/* Alineaciones */
.align-center {
  justify-content: center;
  text-align: center;
}
.align-right {
  justify-content: flex-end;
  text-align: right;
}
.align-left {
  justify-content: flex-start;
  text-align: left;
}

/* --- ESTILO MINIMALISTA / EDITORIAL --- */
.text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  pointer-events: auto;
}

.hero-text {
  margin-top: -5vh; /* Lo subimos apenas para equilibrar */
}

/* Tipografía Gigante */
h1 {
  font-size: 8rem;
  margin: 0;
  font-weight: 900;
  text-transform: uppercase;
  line-height: 0.85;
  letter-spacing: -3px;
  text-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
}

h2 {
  font-size: 6rem;
  margin: 0;
  font-weight: 900;
  text-transform: uppercase;
  line-height: 0.9;
  letter-spacing: -2px;
  text-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
}

.text-secondary {
  font-size: 1.5rem;
  line-height: 1.4;
  font-weight: 400;
  max-width: 450px;
  margin: 0;
  text-shadow: 0px 4px 15px rgba(0, 0, 0, 0.4);
}

/* --- BOTÓN MINIMALISTA --- */
.action-wrap {
  margin-top: 1rem;
}

.btn-minimal {
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding-bottom: 8px;
  border-bottom: 3px solid #ffffff;
  cursor: pointer;
  transition:
    opacity 0.3s ease,
    padding-bottom 0.3s ease;
  text-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.btn-minimal:hover {
  opacity: 0.7;
  padding-bottom: 4px;
}

/* --- RESPONSIVE MOBILE --- */
@media (max-width: 768px) {
  /* Achicamos drásticamente la tipografía para que no desborde la pantalla */
  h1 {
    font-size: 4rem;
    letter-spacing: -1px;
  }

  h2 {
    font-size: 3.5rem;
    letter-spacing: -1px;
  }

  .text-secondary {
    font-size: 1.1rem;
    max-width: 100%;
  }

  /* Forzamos que todas las secciones se alineen a la izquierda en mobile para mejor lectura */
  .content-section {
    padding: 0 5%;
    align-items: flex-start;
    justify-content: center !important;
    text-align: left !important;
  }

  .text {
    align-items: flex-start !important;
  }
}
</style>
