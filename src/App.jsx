import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProductDetail from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ScrollToTop from './components/ScrollToTop'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './components/About'

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
