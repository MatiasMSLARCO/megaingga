import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface BlueprintHeroProps {
  onOpenQuote: () => void
}

// Paleta de la escena
const LINE = 0xe6e1d4 // crema "blueprint"
const RED = 0xe31e24
const SOLID = 0x3b3830

interface Chapter {
  tag: string
  title: React.ReactNode
  body: string
}

// Textos reales extraídos de megaingga.com (docs/superpowers/docs-redesign/CONTENIDO-EXTRAIDO.md).
// Solo se recompone mayúsculas/puntuación y se compactan listas en frases — ningún servicio inventado.
const CHAPTERS: Chapter[] = [
  {
    tag: '01 / 04 · INICIO',
    title: (
      <>
        Diseñamos y construimos tu <span className="text-brand-red">clínica y hospital</span>.
      </>
    ),
    body: 'Especialistas en remodelación y construcción de clínicas y hospitales.',
  },
  {
    tag: '02 / 04 · QUIÉNES SOMOS',
    title: (
      <>
        Diseño y construcción de <span className="text-brand-red">infraestructura hospitalaria</span>.
      </>
    ),
    body: 'Instalación de tableros eléctricos, sistemas contra incendios y sistemas de vapor. Montaje de estructuras metálicas.',
  },
  {
    tag: '03 / 04 · DIVISIÓN PROYECTOS',
    title: <>Proyectos mecánicos, eléctricos y civiles.</>,
    body: 'Sistema contra incendio y de vapor, media y baja tensión, estructuras metálicas y cimentaciones.',
  },
  {
    tag: '04 / 04 · PROYECTOS HOSPITALARIOS',
    title: (
      <>
        Quirófanos, salas de UCI e <span className="text-brand-red">infraestructura hospitalaria</span>.
      </>
    ),
    body: 'Diseño y construcción de quirófanos, salas de UCI e infraestructura general hospitalaria.',
  },
]

export function BlueprintHero({ onOpenQuote }: BlueprintHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const [chapter, setChapter] = useState(0)

  // --- Escena Three.js ---
  useEffect(() => {
    const host = canvasHostRef.current
    if (!host) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, host.clientWidth / host.clientHeight, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(host.clientWidth, host.clientHeight)
    host.appendChild(renderer.domElement)

    // Luces (para la etapa sólida)
    scene.add(new THREE.HemisphereLight(0xf4efe2, 0x24201a, 1.15))
    const dir = new THREE.DirectionalLight(0xfff4e0, 2.1)
    dir.position.set(-7, 11, 8)
    scene.add(dir)
    const fill = new THREE.DirectionalLight(0xbcd0e8, 0.8)
    fill.position.set(9, 5, 10)
    scene.add(fill)

    const lineMat = new THREE.LineBasicMaterial({ color: LINE, transparent: true, opacity: 0.85 })
    const redMat = new THREE.LineBasicMaterial({ color: RED, transparent: true, opacity: 0.95 })
    const solidMat = new THREE.MeshStandardMaterial({
      color: SOLID,
      roughness: 0.62,
      metalness: 0.12,
      transparent: true,
      opacity: 0,
    })
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x16202b,
      roughness: 0.15,
      metalness: 0.5,
      emissive: 0x0a141f,
      transparent: true,
      opacity: 0,
    })

    const building = new THREE.Group()
    scene.add(building)

    // Pisos que se extruyen. Cada "bloque" = solid mesh + edges, pivote en la base.
    interface RisingBlock {
      group: THREE.Group
      start: number // progreso al que empieza a subir
    }
    const risers: RisingBlock[] = []
    const solids: THREE.Mesh[] = []

    function addBlock(
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      startP: number,
      accent = false,
      glass = false
    ) {
      const geo = new THREE.BoxGeometry(w, h, d)
      geo.translate(0, h / 2, 0) // base en y=0 -> crece hacia arriba al escalar
      const g = new THREE.Group()
      g.position.set(x, y, z)

      const mesh = new THREE.Mesh(geo, glass ? glassMat : solidMat)
      g.add(mesh)
      solids.push(mesh)

      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), accent ? redMat : lineMat)
      g.add(edges)

      g.scale.y = 0.001
      building.add(g)
      risers.push({ group: g, start: startP })
    }

    // Losa base / plano (plano del piso, plano siempre visible)
    {
      const slab = new THREE.BoxGeometry(11, 0.18, 7.5)
      slab.translate(0, 0.09, 0)
      const g = new THREE.Group()
      const mesh = new THREE.Mesh(slab, solidMat)
      g.add(mesh)
      solids.push(mesh)
      g.add(new THREE.LineSegments(new THREE.EdgesGeometry(slab), lineMat))
      building.add(g)
    }
    // Grilla del plano
    {
      const grid = new THREE.GridHelper(11, 16, LINE, LINE)
      const gm = grid.material as THREE.Material
      gm.transparent = true
      gm.opacity = 0.18
      grid.position.y = 0.02
      grid.scale.z = 7.5 / 11
      building.add(grid)
    }

    // Planta baja: muros perimetrales + particiones (suben primero)
    addBlock(11, 3, 0.18, 0, 0.18, -3.66, 0.12) // muro fondo
    addBlock(0.18, 3, 7.5, -5.41, 0.18, 0, 0.16) // muro izq
    addBlock(0.18, 3, 7.5, 5.41, 0.18, 0, 0.16) // muro der
    addBlock(4.5, 3, 0.18, -3.2, 0.18, 1.2, 0.2) // partición interior
    addBlock(0.18, 3, 4, 1.5, 0.18, -1.2, 0.22) // partición interior 2
    // Losa entrepiso
    addBlock(11, 0.2, 7.5, 0, 3.18, 0, 0.34)
    // Planta alta (voladizo): muros + franja de acento rojo
    addBlock(8.5, 2.6, 0.18, 1.2, 3.38, -3.66, 0.42)
    addBlock(0.18, 2.6, 7.5, 5.41, 3.38, 0, 0.44)
    addBlock(8.5, 0.35, 0.2, 1.2, 3.38, 3.7, 0.5, true) // dintel rojo (acento)
    addBlock(8.5, 2, 0.1, 1.2, 3.55, 3.75, 0.52, false, true) // vidrio fachada
    // Techo
    addBlock(9, 0.22, 7.9, 1, 5.98, 0, 0.6)

    // Mullions (líneas verticales de ventana) en la fachada frontal
    {
      const mull = new THREE.Group()
      for (let i = -3; i <= 5; i++) {
        const pts = [new THREE.Vector3(i, 3.5, 3.78), new THREE.Vector3(i, 5.5, 3.78)]
        mull.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat))
      }
      building.add(mull)
    }

    building.position.y = -2.4

    // Cámara: keyframes por progreso
    const camKeys = [
      { p: 0.0, pos: new THREE.Vector3(0.2, 13, 7.5), tgt: new THREE.Vector3(0, -1, 0) },
      { p: 0.4, pos: new THREE.Vector3(10.5, 7.5, 12), tgt: new THREE.Vector3(0, 1.2, 0) },
      { p: 1.0, pos: new THREE.Vector3(12.5, 6.5, 16.5), tgt: new THREE.Vector3(0.5, 1.4, 0) },
    ]
    const tmpPos = new THREE.Vector3()
    const tmpTgt = new THREE.Vector3()

    function sampleCam(p: number) {
      let a = camKeys[0]
      let b = camKeys[camKeys.length - 1]
      for (let i = 0; i < camKeys.length - 1; i++) {
        if (p >= camKeys[i].p && p <= camKeys[i + 1].p) {
          a = camKeys[i]
          b = camKeys[i + 1]
          break
        }
      }
      const span = b.p - a.p || 1
      const t = gsap.utils.clamp(0, 1, (p - a.p) / span)
      const e = gsap.parseEase('power2.inOut')(t)
      tmpPos.lerpVectors(a.pos, b.pos, e)
      tmpTgt.lerpVectors(a.tgt, b.tgt, e)
      camera.position.copy(tmpPos)
      camera.lookAt(tmpTgt)
    }

    let raf = 0
    function render() {
      const p = progressRef.current
      // Extrusión de cada bloque
      for (const r of risers) {
        const local = gsap.utils.clamp(0, 1, (p - r.start) / 0.14)
        const eased = gsap.parseEase('power3.out')(local)
        r.group.scale.y = Math.max(0.001, eased)
      }
      // Fundido a sólido en la etapa final
      const solidO = gsap.utils.clamp(0, 1, (p - 0.62) / 0.32)
      solidMat.opacity = solidO * 0.96
      glassMat.opacity = solidO * 0.85
      lineMat.opacity = 0.85 - solidO * 0.35
      // Rotación lenta del edificio para dar vida
      building.rotation.y = -0.15 + p * 0.25
      sampleCam(p)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(render)
    }
    render()

    function onResize() {
      if (!host) return
      camera.aspect = host.clientWidth / host.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(host.clientWidth, host.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      scene.traverse((o) => {
        const any = o as THREE.Mesh
        if (any.geometry) any.geometry.dispose()
      })
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }, [])

  // --- Scroll -> progreso + capítulo ---
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            progressRef.current = self.progress
            const idx = Math.min(CHAPTERS.length - 1, Math.floor(self.progress * CHAPTERS.length))
            setChapter(idx)
          },
        })
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        progressRef.current = 1
        setChapter(CHAPTERS.length - 1)
      })
    },
    { scope: sectionRef }
  )

  const ch = CHAPTERS[chapter]

  return (
    <section ref={sectionRef} id="inicio" className="relative" style={{ height: '420vh', background: '#0e0e0d' }}>
      {/* Lienzo 3D fijo mientras se scrollea el wrapper */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <div ref={canvasHostRef} className="absolute inset-0" />
        {/* viñeta para legibilidad */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55))]" />

        {/* Overlay técnico */}
        <div className="pointer-events-none absolute inset-0 text-[#e6e1d4]">
          <div className="mx-auto flex h-full max-w-7xl flex-col justify-between px-4 py-20 sm:px-6 lg:px-8">
            {/* fila superior */}
            <div className="flex items-start justify-between pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#e6e1d4]/70">
              <div className="flex items-center gap-3">
                <span>{ch.tag}</span>
                <span className="hidden h-px w-16 bg-[#e6e1d4]/40 sm:block" />
              </div>
              <div className="text-right leading-relaxed">
                <div>SHEET A-101</div>
                <div className="text-[#e6e1d4]/50">PLANO A OBRA · MEGAINGGA</div>
              </div>
            </div>

            {/* bloque inferior: titular + CTA + ficha */}
            <div className="flex flex-col gap-8 pb-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <h1
                  key={chapter}
                  className="animate-[fadeUp_0.6s_ease] font-serif text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
                >
                  {ch.title}
                </h1>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-[#e6e1d4]/70 sm:text-base">{ch.body}</p>

                <div className="pointer-events-auto mt-7 flex flex-wrap items-center gap-4">
                  <Button size="lg" onClick={onOpenQuote}>
                    <FileText className="h-5 w-5" />
                    Solicitar Cotización
                  </Button>
                  <a
                    href="#servicios"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-[#e6e1d4]/80 transition-colors hover:text-brand-red"
                  >
                    Ver catálogo técnico
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="text-right font-mono text-[11px] uppercase tracking-[0.2em] text-[#e6e1d4]/50">
                <div>ESCALA 1:100</div>
                <div>REV 2026.09</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sentinel para el estado del navbar (se vuelve sólido al terminar el hero) */}
      <div id="nav-hero-sentinel" className="absolute bottom-0 h-px w-full" />
    </section>
  )
}
