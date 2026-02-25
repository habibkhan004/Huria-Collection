import { useState } from 'react'
import HeroSection from '../components/Hero'
import FeaturedProducts from './FeatureProducts'
import ContactUs from '../components/Contact'


function Home() {


  return (
    <>
    <HeroSection></HeroSection>
    <FeaturedProducts></FeaturedProducts>
    <ContactUs></ContactUs>
    </>
  )
}

export default Home
