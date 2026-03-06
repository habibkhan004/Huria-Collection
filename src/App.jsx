import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

// Public layout
import PublicLayout from "./layouts/PublicLayout";

// Admin
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";

// Public pages
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./components/About";
import ContactUs from "./components/Contact";
import Shoes from "./pages/Shoes";
import Cosmetics from "./pages/Cosmetics";
import Sale from "./pages/Sales";

// Admin pages
import Dashboard from "./admin/Dashboard";
import ManageProducts from "./admin/ManageProducts";
import Orders from "./admin/Orders";
import Reports from "./admin/Reports";
import ContactForm from "./admin/ContactForm";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Public Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/shoes" element={<Shoes />} />
          <Route path="/cosmetics" element={<Cosmetics />} />
          <Route path="/sale" element={<Sale />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Layout (Protected) */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products/add" element={<ManageProducts mode="add" />} />
          <Route path="products/manage" element={<ManageProducts mode="manage" />} />
          {/* default products route → manage */}
          <Route path="products" element={<ManageProducts mode="manage" />} />
          
          <Route path="orders" element={<Orders />} />
          <Route path="reports" element={<Reports />} />
          <Route path="contact-form" element={<ContactForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;