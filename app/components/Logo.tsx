'use client'

import { useRef } from 'react'
import { Text } from '@react-three/drei'
import { Group } from 'three'

interface LogoProps {
  scene: number
  time: number
}

export default function Logo({ scene, time }: LogoProps) {
  const groupRef = useRef<Group>(null)

  // Scene 1: Fade in from 0-2s
  const scene1Opacity = scene === 0 ? Math.min(time / 2, 1) : 0

  // Scene 6: Fade in from 23-25s
  const scene6Opacity = scene === 5 ? Math.min((time - 23) / 2, 1) : 0

  const opacity = scene === 0 ? scene1Opacity : scene6Opacity

  if (opacity === 0) return null

  return (
    <group ref={groupRef} position={[0, scene === 0 ? 2.5 : -2.5, 0]}>
      <Text
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fillOpacity={opacity}
        outlineWidth={0.02}
        outlineColor="#4080ff"
        outlineOpacity={opacity * 0.5}
      >
        {scene === 0 ? 'AUDIO' : 'PREMIUM SOUND'}
      </Text>
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.3}
        color="#4080ff"
        anchorX="center"
        anchorY="middle"
        fillOpacity={opacity}
      >
        {scene === 0 ? 'PRO' : 'REDEFINED'}
      </Text>

      {/* Glow effect */}
      <pointLight
        position={[0, 0, 0.5]}
        intensity={opacity * 2}
        color="#4080ff"
        distance={3}
      />
    </group>
  )
}
