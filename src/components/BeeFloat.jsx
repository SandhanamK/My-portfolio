import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'

const MODEL_URL = new URL('../bee/honey-bee/source/bee.glb', import.meta.url)
const BEE_SCALE = 0.7
const SECTION_TARGETS = [
  {
    id: 'hero',
    selector: '.pf-hero-section',
    position: { x: 1.5, y: 0.3, z: -1.0 },
    rotation: { x: 0.05, y: -1.5, z: 0 }
  },
  {
    id: 'about-me',
    selector: '#about-me',
    position: { x: -1.1, y: -0.30, z: 3.1 },
    rotation: { x: 0.20, y: 1.2, z: 1.05 }
  },
  {
    id: 'skills',
    selector: '#skills',
    position: { x: 1.80, y: -1.0, z: -2.5 },
    rotation: { x: 0.2, y: -3.1, z: 0.05 }
  },
  {
    id: 'projects',
    selector: '#projects',
    position: { x: -1.30, y: -0.03, z: 3 },
    rotation: { x: 0.25, y: -1.25, z: 0 }
  },
  {
    id: 'experience',
    selector: '#experience',
    position: { x: 0.80, y: -0.5, z: 5.0 },
    rotation: { x: -6.3, y: -2.5, z: 0 }
  },
  {
    id: 'contacts',
    selector: '#contacts',
    position: { x: 1.1, y: 0.1, z: 0 },
    rotation: { x: 1.6, y: 2.5, z: 125.5 }
  }
]

export default function BeeFloat({ accent = '#f3c653' }) {
  const mountRef = useRef(null)
  const rendererRef = useRef(null)
  const mixerRef = useRef(null)
  const beeGroupRef = useRef(null)
  const currentSectionRef = useRef('hero')
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let isMounted = true
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 13)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    mount.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const hemi = new THREE.HemisphereLight(0xffffff, 0x080820, 2.5)
    scene.add(hemi)
    const dir = new THREE.DirectionalLight(0xffffff, 8)
    dir.position.set(6, 8, 10)
    scene.add(dir)

    const beeGroup = new THREE.Group()
    scene.add(beeGroup)
    beeGroupRef.current = beeGroup

    const loader = new GLTFLoader()
    const accentColor = new THREE.Color(accent)
    const texLoader = new THREE.TextureLoader()

    // Load textures
    const textures = {
      base: texLoader.load(new URL('../bee/honey-bee/textures/gltf_embedded_0.png', import.meta.url).href),
      normal: texLoader.load(new URL('../bee/honey-bee/textures/gltf_embedded_2.png', import.meta.url).href),
      ao: texLoader.load(new URL('../bee/honey-bee/textures/gltf_embedded_1@channels=A.png', import.meta.url).href),
      metalRough: texLoader.load(new URL('../bee/honey-bee/textures/gltf_embedded_3@channels=R.png', import.meta.url).href)
    }

    loader.load(
      MODEL_URL.href,
      (gltf) => {
        if (!isMounted) return

        const bee = gltf.scene
        bee.scale.set(BEE_SCALE, BEE_SCALE, BEE_SCALE)
        bee.rotation.set(0, Math.PI / 2, 0)

        bee.traverse((child) => {
          if (child.isMesh && child.material) {
            const applyTo = (mat) => {
              if (!mat.map && textures.base) mat.map = textures.base
              if (!mat.normalMap && textures.normal) mat.normalMap = textures.normal
              if (!mat.aoMap && textures.ao) mat.aoMap = textures.ao
              if (!mat.metalnessMap && textures.metalRough) mat.metalnessMap = textures.metalRough

              mat.roughness = mat.roughness !== undefined ? mat.roughness : 0.35
              mat.metalness = mat.metalness !== undefined ? mat.metalness : 0.2
              if (mat.emissive) {
                mat.emissive.lerp(accentColor.clone().multiplyScalar(0.15), 0.35)
              } else {
                mat.emissive = accentColor.clone().multiplyScalar(0.15)
              }
              mat.needsUpdate = true
            }

            if (Array.isArray(child.material)) {
              child.material.forEach(applyTo)
            } else {
              applyTo(child.material)
            }
          }
        })
        beeGroup.add(bee)

        if (gltf.animations?.length) {
          const mixer = new THREE.AnimationMixer(bee)
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip)
            action.reset().play()
          })
          mixerRef.current = mixer
        }

        // Initialize position based on current section (which might have been set by scroll handler already)
        moveBeeToSection(currentSectionRef.current, true)
      },
      undefined,
      (err) => console.error('Failed to load bee model', err)
    )

    const clock = new THREE.Clock()
    const animate = () => {
      const delta = clock.getDelta()
      if (mixerRef.current) mixerRef.current.update(delta)
      renderer.render(scene, camera)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    const handleScroll = () => {
      const active = getActiveSection()
      if (active && active !== currentSectionRef.current) {
        currentSectionRef.current = active
        moveBeeToSection(active)
      }
    }
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    }

    // Run once to set initial state
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      isMounted = false
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)

      // Cleanup GSAP and Three resources
      if (beeGroupRef.current) {
        gsap.killTweensOf(beeGroupRef.current.position)
        gsap.killTweensOf(beeGroupRef.current.rotation)
      }

      mixerRef.current?.stopAllAction()
      renderer.dispose()
      if (mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [accent])

  const getActiveSection = () => {
    // Check if we are at the very top
    if (window.scrollY < 100) return 'hero'

    for (const target of SECTION_TARGETS) {
      if (target.id === 'hero') continue // Skip hero in loop, handled by fallback/top check
      const el = document.querySelector(target.selector)
      if (!el) continue
      const rect = el.getBoundingClientRect()
      // Adjust trigger zone for better UX
      if (rect.top <= window.innerHeight * 0.6 && rect.bottom >= window.innerHeight * 0.2) {
        return target.id
      }
    }
    return 'hero'
  }

  const moveBeeToSection = (sectionId, immediate = false) => {
    const beeGroup = beeGroupRef.current
    if (!beeGroup) return
    const target = SECTION_TARGETS.find((s) => s.id === sectionId)
    // Fallback to hero if target not found
    const dest = target || SECTION_TARGETS[0]

    const duration = immediate ? 0 : 2

    gsap.killTweensOf(beeGroup.position)
    gsap.killTweensOf(beeGroup.rotation)

    gsap.to(beeGroup.position, {
      x: dest.position.x,
      y: dest.position.y,
      z: dest.position.z,
      duration,
      ease: 'power2.out'
    })
    gsap.to(beeGroup.rotation, {
      x: dest.rotation.x,
      y: dest.rotation.y,
      z: dest.rotation.z,
      duration,
      ease: 'power2.out'
    })
  }

  return <div className="pf-bee-root" ref={mountRef} aria-hidden="true" />
}