import { onMounted, onUnmounted, type Ref } from 'vue'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import type { Positions } from '@/types'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

export function useAnimations(
  position: Ref<number[]>,
  lookAtTarget: Ref<number[]>,
  positions: Ref<Positions>,
) {
  let ctx: gsap.Context

  const scrollToSection = (target: string) => {
    gsap.to(window, {
      duration: 4.5,
      scrollTo: target,
      ease: 'power3.inOut',
    })
  }

  onMounted(() => {
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
            z: positions.value.elephant.points.z + (!isMobile ? 0.5 : 0.9),
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
            x: positions.value.rhinoceros.points.x + (!isMobile ? 0.3 : 1),
            y: 1,
            z: 10,
            lookX: positions.value.rhinoceros.points.x - 1,
            lookZ: positions.value.rhinoceros.points.z - 0.6,
            ease: 'power1.inOut',
            duration: 3,
          })
          tl.to(cameraData, {
            y: positions.value.rhinoceros.points.y + 0.1,
            z: positions.value.rhinoceros.points.z + (!isMobile ? 0.5 : 0.9),
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
    ctx?.revert() // Destruye el ScrollTrigger al desmontar el componente
  })

  return {
    scrollToSection,
  }
}
