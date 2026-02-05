'use client'

import dynamic from 'next/dynamic'

const HeadphoneShowcase = dynamic(() => import('./components/HeadphoneShowcase'), {
  ssr: false,
})

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <HeadphoneShowcase />
    </main>
  )
}
