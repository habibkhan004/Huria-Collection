import { useState } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/Hero'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar></Navbar>
    <HeroSection></HeroSection>

    <Footer></Footer>
    </>
  )
}

export default App
