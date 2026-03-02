import { useState } from 'react'
import HeroSection from '../components/Hero'
import FeaturedProducts from './FeatureProducts'
import ContactUs from '../components/Contact'
import WhySections from './Why'


function Home() {


  return (
    <>
    <HeroSection></HeroSection>
    <FeaturedProducts></FeaturedProducts>
    <WhySections></WhySections>
     <ContactUs></ContactUs>
    </>
  )
}

export default Home
