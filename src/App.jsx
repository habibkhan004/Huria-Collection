import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProductDetail from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ScrollToTop from './components/ScrollToTop'
import ContactUs from './components/Contact'
import WhatsAppFloat from './components/WhatsappFloat'
import Shoes from './pages/Shoes'
import Cosmetics from './pages/Cosmetics'
import Sale from './pages/Sales'
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
        <Route path="/contact" element={<ContactUs />} />
        <Route path='/shoes' element={<Shoes />} />
        <Route path='/cosmetics' element ={<Cosmetics />} />
        <Route path='/sale' element={<Sale />} />
      </Routes>
      <Footer />
      <WhatsAppFloat />
    </BrowserRouter>
  )
}

export default App
