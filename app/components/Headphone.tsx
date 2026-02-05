'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Mesh } from 'three'
import { MeshStandardMaterial } from 'three'

interface HeadphoneProps {
  scene: number
  time: number
}

export default function Headphone({ scene, time }: HeadphoneProps) {
  const groupRef = useRef<Group>(null)

  // Materials
  const matteBlack = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#1a1a1a',
        roughness: 0.6,
        metalness: 0.2,
      }),
    []
  )

  const glossyBlack = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#000000',
        roughness: 0.1,
        metalness: 0.9,
      }),
    []
  )

  const leather = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#2a2a2a',
        roughness: 0.8,
        metalness: 0.1,
      }),
    []
  )

  const metal = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#8899aa',
        roughness: 0.2,
        metalness: 0.95,
      }),
    []
  )

  const accent = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#4080ff',
        roughness: 0.3,
        metalness: 0.8,
        emissive: '#2050aa',
        emissiveIntensity: 0.3,
      }),
    []
  )

  // Calculate exploded positions
  const getExplodedOffset = (partIndex: number) => {
    if (scene !== 3) return [0, 0, 0]

    const t = Math.min((time - 12) / 3, 1)
    const eased = 1 - Math.pow(1 - t, 3)

    const offsets = [
      [0, 2, 0],      // headband
      [-1.5, 0, 0],   // left cup
      [1.5, 0, 0],    // right cup
      [-1.8, -0.5, 0.3], // left speaker
      [1.8, -0.5, 0.3],  // right speaker
      [0, -1.5, 0],   // battery
      [-0.5, 0.5, -0.5], // chipset
      [0.5, 0.5, -0.5],  // noise cancellation
      [0, 1, -0.5],   // wiring
    ]

    return offsets[partIndex]?.map(v => v * eased) || [0, 0, 0]
  }

  // Calculate reassembly
  const getReassemblyOffset = (partIndex: number) => {
    if (scene !== 4) return [0, 0, 0]

    const t = Math.min((time - 18) / 2, 1)
    const eased = t * t * (3 - 2 * t)

    const explodedOffsets = [
      [0, 2, 0],
      [-1.5, 0, 0],
      [1.5, 0, 0],
      [-1.8, -0.5, 0.3],
      [1.8, -0.5, 0.3],
      [0, -1.5, 0],
      [-0.5, 0.5, -0.5],
      [0.5, 0.5, -0.5],
      [0, 1, -0.5],
    ]

    return explodedOffsets[partIndex]?.map(v => v * (1 - eased)) || [0, 0, 0]
  }

  const getOffset = (partIndex: number) => {
    if (scene === 3) return getExplodedOffset(partIndex)
    if (scene === 4) return getReassemblyOffset(partIndex)
    return [0, 0, 0]
  }

  // Clone effect in Scene 5
  const showClone = scene === 4 && time > 20

  // Opacity for Scene 1
  const opacity = scene === 0 ? Math.min((time - 1) / 2, 1) : 1
  const visible = scene > 0 || time > 1

  useFrame(() => {
    if (groupRef.current && scene === 1) {
      groupRef.current.rotation.y += 0.003
    }
  })

  if (!visible) return null

  const renderHeadphone = (offsetX = 0, alpha = 1) => {
    const [hbX, hbY, hbZ] = getOffset(0)
    const [lcX, lcY, lcZ] = getOffset(1)
    const [rcX, rcY, rcZ] = getOffset(2)
    const [lsX, lsY, lsZ] = getOffset(3)
    const [rsX, rsY, rsZ] = getOffset(4)
    const [btX, btY, btZ] = getOffset(5)
    const [cpX, cpY, cpZ] = getOffset(6)
    const [ncX, ncY, ncZ] = getOffset(7)
    const [wrX, wrY, wrZ] = getOffset(8)

    return (
      <group position={[offsetX, 0, 0]}>
        {/* Headband */}
        <mesh
          position={[hbX, 1.2 + hbY, hbZ]}
          material={matteBlack}
          castShadow
          receiveShadow
        >
          <torusGeometry args={[1.2, 0.12, 16, 32, Math.PI]} />
        </mesh>

        {/* Headband padding */}
        <mesh
          position={[hbX, 1.2 + hbY, hbZ]}
          material={leather}
          castShadow
        >
          <torusGeometry args={[1.2, 0.08, 16, 32, Math.PI]} />
        </mesh>

        {/* Left ear cup */}
        <group position={[-1 + lcX, lcY, lcZ]}>
          <mesh material={glossyBlack} castShadow receiveShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.15, 32]} />
          </mesh>
          <mesh
            position={[0, 0, 0.1]}
            material={leather}
            castShadow
          >
            <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
          </mesh>
          {/* Accent ring */}
          <mesh position={[0, 0, 0.08]} material={accent}>
            <torusGeometry args={[0.55, 0.02, 16, 32]} />
          </mesh>
        </group>

        {/* Right ear cup */}
        <group position={[1 + rcX, rcY, rcZ]}>
          <mesh material={glossyBlack} castShadow receiveShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.15, 32]} />
          </mesh>
          <mesh
            position={[0, 0, 0.1]}
            material={leather}
            castShadow
          >
            <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
          </mesh>
          {/* Accent ring */}
          <mesh position={[0, 0, 0.08]} material={accent}>
            <torusGeometry args={[0.55, 0.02, 16, 32]} />
          </mesh>
        </group>

        {/* Adjustment sliders (metal) */}
        <mesh
          position={[-1 + lcX, 0.8 + lcY, lcZ]}
          material={metal}
          castShadow
        >
          <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        </mesh>
        <mesh
          position={[1 + rcX, 0.8 + rcY, rcZ]}
          material={metal}
          castShadow
        >
          <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        </mesh>

        {/* Left speaker (internal) */}
        <mesh
          position={[-1 + lsX, lsY, 0.2 + lsZ]}
          material={metal}
          castShadow
        >
          <cylinderGeometry args={[0.35, 0.35, 0.05, 32]} />
        </mesh>

        {/* Right speaker (internal) */}
        <mesh
          position={[1 + rsX, rsY, 0.2 + rsZ]}
          material={metal}
          castShadow
        >
          <cylinderGeometry args={[0.35, 0.35, 0.05, 32]} />
        </mesh>

        {/* Battery (internal) */}
        <mesh
          position={[btX, -0.5 + btY, btZ]}
          material={accent}
          castShadow
        >
          <boxGeometry args={[0.8, 0.15, 0.3]} />
        </mesh>

        {/* Chipset (internal) */}
        <mesh
          position={[-0.3 + cpX, 0.2 + cpY, -0.1 + cpZ]}
          material={accent}
          castShadow
        >
          <boxGeometry args={[0.2, 0.2, 0.05]} />
        </mesh>

        {/* Noise cancellation module (internal) */}
        <mesh
          position={[0.3 + ncX, 0.2 + ncY, -0.1 + ncZ]}
          material={accent}
          castShadow
        >
          <boxGeometry args={[0.2, 0.2, 0.05]} />
        </mesh>

        {/* Wiring (internal) */}
        <mesh
          position={[wrX, 0.5 + wrY, -0.2 + wrZ]}
          material={metal}
          castShadow
        >
          <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
        </mesh>

        {/* Control buttons */}
        <mesh
          position={[1 + rcX, 0.3 + rcY, 0.15 + rcZ]}
          material={matteBlack}
        >
          <sphereGeometry args={[0.05, 16, 16]} />
        </mesh>
        <mesh
          position={[1 + rcX, 0.15 + rcY, 0.15 + rcZ]}
          material={matteBlack}
        >
          <sphereGeometry args={[0.05, 16, 16]} />
        </mesh>

        {/* USB-C port */}
        <mesh
          position={[1 + rcX, -0.3 + rcY, 0.15 + rcZ]}
          material={metal}
        >
          <cylinderGeometry args={[0.03, 0.03, 0.08, 16]} />
        </mesh>
      </group>
    )
  }

  return (
    <group ref={groupRef}>
      {renderHeadphone(0, opacity)}
      {showClone && renderHeadphone(3, Math.min((time - 20) / 1.5, 0.8))}
    </group>
  )
}
