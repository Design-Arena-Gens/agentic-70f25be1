'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import Headphone from './Headphone'
import Logo from './Logo'
import { Environment, PerspectiveCamera } from '@react-three/drei'

export default function Scene() {
  const [scene, setScene] = useState(0)
  const headphoneRef = useRef<Group>(null)
  const cameraRef = useRef<any>(null)
  const timeRef = useRef(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setScene(1), 3000),   // Scene 2 at 3s
      setTimeout(() => setScene(2), 8000),   // Scene 3 at 8s
      setTimeout(() => setScene(3), 12000),  // Scene 4 at 12s
      setTimeout(() => setScene(4), 18000),  // Scene 5 at 18s
      setTimeout(() => setScene(5), 22000),  // Scene 6 at 22s
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  useFrame((state, delta) => {
    timeRef.current += delta

    if (cameraRef.current) {
      // Scene 1: Camera push-in (0-3s)
      if (scene === 0) {
        const t = Math.min(timeRef.current / 3, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        cameraRef.current.position.z = 12 - eased * 4
      }
      // Scene 2: Orbit (3-8s)
      else if (scene === 1) {
        const t = (timeRef.current - 3) / 5
        cameraRef.current.position.x = Math.sin(t * Math.PI * 0.5) * 3
        cameraRef.current.position.y = Math.sin(t * Math.PI) * 0.5
        cameraRef.current.lookAt(0, 0, 0)
      }
      // Scene 3: Close orbit for 360 (8-12s)
      else if (scene === 2) {
        const t = (timeRef.current - 8) / 4
        cameraRef.current.position.x = Math.sin(t * Math.PI * 2) * 4
        cameraRef.current.position.z = Math.cos(t * Math.PI * 2) * 4
        cameraRef.current.position.y = 0.5
        cameraRef.current.lookAt(0, 0, 0)
      }
      // Scene 4 & 5: Static view for exploded and reassembly (12-22s)
      else if (scene === 3 || scene === 4) {
        cameraRef.current.position.x += (2 - cameraRef.current.position.x) * 0.05
        cameraRef.current.position.y += (1 - cameraRef.current.position.y) * 0.05
        cameraRef.current.position.z += (7 - cameraRef.current.position.z) * 0.05
        cameraRef.current.lookAt(0, 0, 0)
      }
      // Scene 6: Hero shot (22-25s)
      else if (scene === 5) {
        cameraRef.current.position.x += (0 - cameraRef.current.position.x) * 0.03
        cameraRef.current.position.y += (0.3 - cameraRef.current.position.y) * 0.03
        cameraRef.current.position.z += (8 - cameraRef.current.position.z) * 0.03
        cameraRef.current.lookAt(0, 0, 0)
      }
    }

    // Headphone rotation for Scene 3
    if (headphoneRef.current && scene === 2) {
      const t = (timeRef.current - 8) / 4
      headphoneRef.current.rotation.y = t * Math.PI * 2
    }
    // Gentle float for Scene 2
    else if (headphoneRef.current && scene === 1) {
      headphoneRef.current.position.y = Math.sin(timeRef.current * 0.5) * 0.1
    }
  })

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 12]} fov={45} />

      <ambientLight intensity={0.3} />

      {/* Key light */}
      <spotLight
        position={[5, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={scene === 0 ? 0.5 : 1.5}
        castShadow
      />

      {/* Fill light */}
      <spotLight
        position={[-5, 2, -5]}
        angle={0.5}
        penumbra={1}
        intensity={0.5}
      />

      {/* Rim light */}
      <spotLight
        position={[0, -3, -5]}
        angle={0.4}
        penumbra={1}
        intensity={0.8}
        color="#4080ff"
      />

      {/* Scene-specific lighting */}
      {scene === 5 && (
        <spotLight
          position={[2, 3, 8]}
          angle={0.2}
          penumbra={1}
          intensity={2}
        />
      )}

      <Environment preset="city" />

      <group ref={headphoneRef}>
        <Headphone scene={scene} time={timeRef.current} />
      </group>

      {/* Logo in Scene 1 and Scene 6 */}
      {(scene === 0 || scene === 5) && (
        <Logo scene={scene} time={timeRef.current} />
      )}
    </>
  )
}
