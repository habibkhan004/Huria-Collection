import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProductDetail from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
