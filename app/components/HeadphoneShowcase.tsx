'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing'
import Scene from './Scene'

export default function HeadphoneShowcase() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#000' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
          <EffectComposer>
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.3}
              luminanceSmoothing={0.9}
            />
            <DepthOfField
              focusDistance={0}
              focalLength={0.02}
              bokehScale={2}
              height={480}
            />
            <Vignette eskil={false} offset={0.1} darkness={0.9} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
