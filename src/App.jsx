import { useState } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/Hero'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar></Navbar>
    <HeroSection></HeroSection>
    </>
  )
}

export default App
