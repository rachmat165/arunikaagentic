'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface TaskData {
  agent: string
  tasks: number
  completed: number
}

interface Chart3DProps {
  data?: TaskData[]
}

export function Chart3D({ data }: Chart3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !data) return

    // Scene setup
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    camera.position.z = 12
    camera.position.x = 3
    camera.position.y = 3

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 7)
    scene.add(directionalLight)

    // Create 3D bars for each agent
    const bars: THREE.Mesh[] = []
    const maxTasks = Math.max(...data.map((d) => d.tasks))

    data.forEach((item, index) => {
      const height = (item.completed / item.tasks) * 6
      const geometry = new THREE.BoxGeometry(0.8, height, 0.8)

      // Gradient material (completed tasks)
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.6 + index * 0.08, 0.8, 0.5),
        metalness: 0.3,
        roughness: 0.4,
      })

      const bar = new THREE.Mesh(geometry, material)
      bar.position.x = (index - data.length / 2) * 2.5
      bar.position.y = height / 2

      // Add outline
      const outline = new THREE.EdgesGeometry(geometry)
      const line = new THREE.LineSegments(outline, new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 }))
      bar.add(line)

      scene.add(bar)
      bars.push(bar)
    })

    // Add grid
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222)
    gridHelper.position.y = -0.5
    scene.add(gridHelper)

    // Animation
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Rotate bars
      bars.forEach((bar, index) => {
        bar.rotation.y += 0.01
        bar.position.y = Math.sin(Date.now() * 0.0005 + index * 0.5) * 0.3 + (data[index].completed / data[index].tasks) * 3
      })

      // Rotate camera
      camera.position.x = Math.cos(Date.now() * 0.0003) * 10
      camera.position.z = Math.sin(Date.now() * 0.0003) * 10
      camera.lookAt(0, 2, 0)

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width
      const newHeight = containerRef.current?.clientHeight || height

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [data])

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-dark-900 dark:to-dark-800 overflow-hidden"
    />
  )
}
