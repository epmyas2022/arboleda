<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, GLTFModel } from '@tresjs/cientos'
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParticlesComponent from './components/ParticlesComponent.vue'
import { SplitText } from 'gsap/SplitText'
import CharacterComponent from './components/CharacterComponent.vue'
import ControlsModelComponent from './components/ControlsModelComponent.vue'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const scrollToSection = (target: string) => {
  gsap.to(window, {
    duration: 4.5,
    scrollTo: target,
    ease: 'power3.inOut',
  })
}

// Configuración de la cámara inicial
const position = ref([5, -0.2, 7])
const lookAtTarget = ref([4, -0.2, 2])

const modelRef = ref<typeof GLTFModel | null>(null) // Referencia al modelo 3D para los controles de posición

const debug = ref(false) // Para activar los controles de la cámara y ver el modelo en detalle

const positions = ref({
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

let ctx: gsap.Context

onMounted(() => {
  // GSAP Context asegura que podamos limpiar todo al desmontar el componente
  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

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

    const split = [
      '.subtitle-1',
      '.subtitle-2',
      '.subtitle-3',
      '.subtitle-4',
      '.subtitle-5',
      '.subtitle-6',
    ].reduce(
      (acc, title) => {
        acc[title] = SplitText.create(title, {
          type: 'chars, words, lines',
        })
        return acc
      },
      {} as Record<string, SplitText>,
    )

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isTablet: '(min-width: 768px) and (max-width: 1023px)',
        isMobile: '(max-width: 767px)',
      },
      function (context) {
        const { isMobile } = context.conditions as {
          isDesktop: boolean
          isTablet: boolean
          isMobile: boolean
        }

        console.log('isMobile:', isMobile)

        // ==========================================
        // 1. BOSQUE
        // ==========================================
        tl.to(cameraData, {
          x: 0,
          z: 3,
          lookX: -7,
          lookZ: -7,
          ease: 'power1.inOut',
          duration: 6,
        })
        tl.to(cameraData, { x: '+=0', duration: 4 })

        // ==========================================
        // 2. ZORRO
        // ==========================================
        tl.to(cameraData, {
          x: positions.value.fox.points.x - 0.02,
          y: positions.value.fox.points.y + 0.1,
          z: positions.value.fox.points.z - (!isMobile ? 0.3 : 0.8),
          lookX: positions.value.fox.points.x,
          lookY: positions.value.fox.points.y + positions.value.fox.scale / 2,
          lookZ: positions.value.fox.points.z,
          ease: 'power1.inOut',
          duration: 6,
        })
        tl.to(cameraData, { x: '+=0.02', z: '+=0.02', duration: 4, ease: 'none' })

        // ==========================================
        // 3. CIERVO
        // ==========================================
        tl.to(cameraData, {
          x: positions.value.deer.points.x - 0.5,
          y: positions.value.deer.points.y + 0.1,
          z: positions.value.deer.points.z + 1.5,
          lookX: positions.value.deer.points.x,
          lookY: positions.value.deer.points.y,
          lookZ: positions.value.deer.points.z,
          ease: 'power1.inOut',
          duration: 3,
        })
        tl.to(cameraData, {
          x: positions.value.deer.points.x - 0.1,
          y: positions.value.deer.points.y + 0.05,
          z: positions.value.deer.points.z + 0.5,
          ease: 'power1.out',
          duration: 3,
        })
        tl.to(cameraData, { x: '+=0.02', z: '-=0.02', duration: 4, ease: 'none' })

        // ==========================================
        // 4. ELEFANTE
        // ==========================================
        tl.to(cameraData, {
          x: positions.value.elephant.points.x - 0.5,
          y: -0.5,
          lookX: positions.value.elephant.points.x,
          lookZ: positions.value.elephant.points.z,
          ease: 'power1.inOut',
          duration: 3,
        })
        tl.to(cameraData, {
          x: positions.value.elephant.points.x + 0.3,
          y: positions.value.elephant.points.y + 0.4,
          z: positions.value.elephant.points.z + 0.5,
          ease: 'power1.out',
          duration: 3,
        })
        tl.to(cameraData, { x: '+=0.02', lookX: '+=0.02', duration: 4, ease: 'none' })

        // ==========================================
        // 5. CONEJO
        // ==========================================
        tl.to(cameraData, {
          x: positions.value.rabbit.points.x + 0.7,
          y: 1,
          lookX: positions.value.rabbit.points.x - 10,
          lookZ: positions.value.rabbit.points.z - 0.5,
          ease: 'power1.inOut',
          duration: 3,
        })
        tl.to(cameraData, {
          y: positions.value.rabbit.points.y + 0.1,
          z: positions.value.rabbit.points.z + 0.1,
          ease: 'power1.out',
          duration: 3,
        })
        tl.to(cameraData, { x: '-=0.02', lookZ: '-=0.02', duration: 4, ease: 'none' })

        // ==========================================
        // 6. RINOCERONTE
        // ==========================================
        tl.to(cameraData, {
          x: positions.value.rhinoceros.points.x + 0.3,
          y: 1,
          z: 10,
          lookX: positions.value.rhinoceros.points.x - 1,
          lookZ: positions.value.rhinoceros.points.z - 0.6,
          ease: 'power1.inOut',
          duration: 3,
        })
        tl.to(cameraData, {
          y: positions.value.rhinoceros.points.y + 0.1,
          z: positions.value.rhinoceros.points.z + 0.5,
          ease: 'power1.out',
          duration: 3,
        })
        tl.to(cameraData, { x: '+=0.02', z: '-=0.02', duration: 4, ease: 'none' })

        // ==========================================
        // Animaciones independientes para los subtítulos
        // ==========================================
        const subtitleClasses = [
          '.subtitle-1',
          '.subtitle-2',
          '.subtitle-3',
          '.subtitle-4',
          '.subtitle-5',
          '.subtitle-6',
        ]

        subtitleClasses.forEach((subClass) => {
          gsap.from(split[subClass]!.chars, {
            scrollTrigger: {
              trigger: subClass,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            y: 50,
            opacity: 0,
            stagger: 0.05,
            duration: 1,
            ease: 'back.out(1.7)',
          })
        })
      },
    )
  })
})

onUnmounted(() => {
  ctx.revert() // Destruye el ScrollTrigger al cambiar de página
})
</script>

<template>
  <main class="scrollable-page">
    <div class="canvas-bg" :style="{ zIndex: debug ? 1 : -1 }">
      <TresCanvas clear-color="#b1e1ff" shadows>
        <!-- Niebla con muchísima más profundidad -->
        <TresFog :args="['#b1e1ff', 3, 10]" />

        <!-- Miramos de forma dinámica siguiendo la ruta del dron -->
        <TresPerspectiveCamera :position="position" :look-at="lookAtTarget" make-default />

        <!-- Luciérnagas -->
        <ParticlesComponent :total-fireflies="2000" />

        <CharacterComponent
          v-model="modelRef"
          model-path="/fox.glb"
          :position="positions.fox.points"
          :scale="positions.fox.scale"
          :debug="debug"
        />

        <CharacterComponent
          model-path="/deer.glb"
          v-model="modelRef"
          :position="positions.deer.points"
          :scale="positions.deer.scale"
          :debug="debug"
        />

        <CharacterComponent
          model-path="/elephant.glb"
          v-model="modelRef"
          :position="positions.elephant.points"
          :scale="positions.elephant.scale"
          :debug="debug"
        />

        <CharacterComponent
          model-path="/rabbit.glb"
          v-model="modelRef"
          :position="positions.rabbit.points"
          :scale="positions.rabbit.scale"
          :debug="debug"
        />

        <CharacterComponent
          model-path="/rhinoceros.glb"
          v-model="modelRef"
          :position="positions.rhinoceros.points"
          :scale="positions.rhinoceros.scale"
          :debug="debug"
        />

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

        <OrbitControls
          v-if="false"
          make-default
          :target="[
            modelRef?.value?.position.x ?? 0,
            modelRef?.value?.position.y ?? 0,
            modelRef?.value?.position.z ?? 0,
          ]"
          :min-distance="0.01"
          :max-distance="50"
        />
        - -
        <!-- 3. Luz de rebote (Relleno): Azul puro del otro lado para contrastar fuerte -->
        <TresDirectionalLight :position="[-15, 10, -15]" :intensity="1.5" color="#0055ff" />
      </TresCanvas>
    </div>

    <ControlsModelComponent v-if="debug" v-model="modelRef"></ControlsModelComponent>

    -
    <!-- Contenedor con múltiples secciones scrolleables -->
    <div class="sections-container">
      <section class="content-section align-left" id="arboleda">
        <div class="text hero-text">
          <h1>Arboleda.</h1>
          <p class="text-secondary">Desarrollo interactivo y geometría low poly.</p>
          <div class="action-wrap">
            <a href="#el-bosque" @click.prevent="scrollToSection('#el-bosque')" class="btn-minimal"
              >Descubrir</a
            >
          </div>
        </div>
      </section>

      <section class="content-section align-right" id="el-bosque">
        <div class="text">
          <h2 class="subtitle-1"><span class="text-number">01 </span>El<br />Bosque</h2>
          <p class="text-secondary">
            Una experiencia inmersiva guiada por el scroll. Sin cajas, sin distracciones. Solo el
            contenido y el modelo.
          </p>
          <div class="action-wrap">
            <a href="#el-zorro" @click.prevent="scrollToSection('#el-zorro')" class="btn-minimal"
              >Conocer mas</a
            >
          </div>
        </div>
      </section>

      <section class="content-section align-left" id="el-zorro">
        <div class="text">
          <h2 class="subtitle-2"><span class="text-number">02 </span>El<br />Zorro</h2>
          <p class="text-secondary">
            Astucia salvaje. Silencio, agilidad y elegancia en un solo diseño.
          </p>
          <div class="action-wrap">
            <a href="#el-ciervo" @click.prevent="scrollToSection('#el-ciervo')" class="btn-minimal"
              >Conocer mas</a
            >
          </div>
        </div>
      </section>

      <section class="content-section align-right" id="el-ciervo">
        <div class="text">
          <h2 class="subtitle-3"><span class="text-number">03 </span>El<br />Ciervo</h2>
          <p class="text-secondary">Elegancia natural. Serenidad y belleza en movimiento.</p>
          <div class="action-wrap">
            <a
              href="#el-elefante"
              @click.prevent="scrollToSection('#el-elefante')"
              class="btn-minimal"
              >Conocer mas</a
            >
          </div>
        </div>
      </section>

      <section class="content-section align-left" id="el-elefante">
        <div class="text">
          <h2 class="subtitle-4"><span class="text-number">04 </span>El<br />Elefante</h2>
          <p class="text-secondary">Fuerza y sabiduría. Imponente presencia en el bosque.</p>
          <div class="action-wrap">
            <a href="#el-conejo" @click.prevent="scrollToSection('#el-conejo')" class="btn-minimal"
              >Conocer mas</a
            >
          </div>
        </div>
      </section>

      <section class="content-section align-left" id="el-conejo">
        <div class="text">
          <h2 class="subtitle-5"><span class="text-number">05 </span>El<br />Conejo</h2>
          <p class="text-secondary">Rapidez y destreza. Movimientos ágiles entre la maleza.</p>
          <div class="action-wrap">
            <a href="#el-rino" @click.prevent="scrollToSection('#el-rino')" class="btn-minimal"
              >Conocer mas</a
            >
          </div>
        </div>
      </section>

      <section class="content-section align-left" id="el-rino">
        <div class="text">
          <h2 class="subtitle-6"><span class="text-number">06 </span>El<br />Rino</h2>
          <p class="text-secondary">Poder absoluto. Una armadura natural e inquebrantable.</p>
          <div class="action-wrap">
            <a href="#arboleda" @click.prevent="scrollToSection('#arboleda')" class="btn-minimal"
              >Volver al inicio</a
            >
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
  text-decoration: none;
  color: inherit;
  transition:
    opacity 0.3s ease,
    padding-bottom 0.3s ease;
  text-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.btn-minimal:hover {
  opacity: 0.7;
  padding-bottom: 4px;
}

.text-number {
  font-size: 6rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -2px;
  color: #ff7a00;
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
    align-items: center;
    padding-bottom: 12vh;
    justify-content: center;
    text-align: left;
  }

  .text {
    align-items: flex-start;
  }
}
</style>
