import React from 'react'
import HomeNavbar from '../../components/HomeNavbar' // <-- MODIFIED
import Hero from './sections/Hero'
import Shop from './sections/Shop'
import Footer from './sections/Footer'
export default function HomePage() {
  return (
    <div className='min-h-screen bg-white'>
      <HomeNavbar /> {/* <-- MODIFIED */}
      <Hero />
      <Shop />
      <Footer />
    </div>
  )
}