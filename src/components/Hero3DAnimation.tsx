import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'

export function Hero3DAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene?: THREE.Scene
    camera?: THREE.PerspectiveCamera
    renderer?: THREE.WebGLRenderer
    animationId?: number
    floatingObjects?: THREE.Mesh[]
  }>({})

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    })

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    camera.position.z = 8

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0xa855f7, 2, 100)
    pointLight1.position.set(5, 5, 5)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xec4899, 2, 100)
    pointLight2.position.set(-5, -5, 5)
    scene.add(pointLight2)

    const floatingObjects: THREE.Mesh[] = []

    const createCube = (x: number, y: number, z: number, size: number, color: number) => {
      const geometry = new THREE.BoxGeometry(size, size, size)
      const material = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3,
        shininess: 100,
        transparent: true,
        opacity: 0.8
      })
      const cube = new THREE.Mesh(geometry, material)
      cube.position.set(x, y, z)
      return cube
    }

    const createSphere = (x: number, y: number, z: number, radius: number, color: number) => {
      const geometry = new THREE.SphereGeometry(radius, 32, 32)
      const material = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3,
        shininess: 100,
        transparent: true,
        opacity: 0.8
      })
      const sphere = new THREE.Mesh(geometry, material)
      sphere.position.set(x, y, z)
      return sphere
    }

    const createTorus = (x: number, y: number, z: number, color: number) => {
      const geometry = new THREE.TorusGeometry(0.7, 0.3, 16, 100)
      const material = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3,
        shininess: 100,
        transparent: true,
        opacity: 0.8
      })
      const torus = new THREE.Mesh(geometry, material)
      torus.position.set(x, y, z)
      return torus
    }

    const createOctahedron = (x: number, y: number, z: number, size: number, color: number) => {
      const geometry = new THREE.OctahedronGeometry(size)
      const material = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3,
        shininess: 100,
        transparent: true,
        opacity: 0.8
      })
      const octahedron = new THREE.Mesh(geometry, material)
      octahedron.position.set(x, y, z)
      return octahedron
    }

    floatingObjects.push(
      createCube(-3, 2, 0, 1.2, 0xa855f7),
      createSphere(3, -1, -2, 0.8, 0xec4899),
      createTorus(0, 2.5, -1, 0xdb2777),
      createOctahedron(-2, -2, -1, 0.9, 0xc026d3),
      createCube(2.5, 1.5, -2, 0.8, 0xe879f9),
      createSphere(-1, -1.5, 1, 0.6, 0xa855f7),
      createOctahedron(1, -2.5, 0, 0.7, 0xec4899)
    )

    floatingObjects.forEach(obj => scene.add(obj))

    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 100
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20
      positions[i + 1] = (Math.random() - 0.5) * 20
      positions[i + 2] = (Math.random() - 0.5) * 10
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xa855f7,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    sceneRef.current = { scene, camera, renderer, floatingObjects }

    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)

    const clock = new THREE.Clock()

    const animate = () => {
      const animationId = requestAnimationFrame(animate)
      sceneRef.current.animationId = animationId

      const elapsedTime = clock.getElapsedTime()

      targetX = mouseX * 0.5
      targetY = mouseY * 0.5

      floatingObjects.forEach((obj, index) => {
        const speed = 0.5 + index * 0.1
        const amplitude = 0.3 + index * 0.1
        
        obj.position.y += Math.sin(elapsedTime * speed + index) * 0.002
        obj.rotation.x = elapsedTime * 0.3 * (index % 2 === 0 ? 1 : -1)
        obj.rotation.y = elapsedTime * 0.2 * (index % 2 === 0 ? -1 : 1)
        obj.rotation.z = elapsedTime * 0.1
        
        const scale = 1 + Math.sin(elapsedTime * 0.5 + index) * 0.1
        obj.scale.set(scale, scale, scale)
      })

      camera.position.x += (targetX - camera.position.x) * 0.05
      camera.position.y += (targetY - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      particles.rotation.y = elapsedTime * 0.05
      particles.rotation.x = elapsedTime * 0.03

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!containerRef.current) return
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }
      
      floatingObjects.forEach(obj => {
        obj.geometry.dispose()
        if (obj.material instanceof THREE.Material) {
          obj.material.dispose()
        }
      })
      
      particleGeometry.dispose()
      particleMaterial.dispose()
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
