import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'

import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ProductsPage from './pages/ProductsPage'
import ProductPage from './pages/ProductPage'
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage'
import FAQPage from './pages/FAQPage'
import DeliveryPage from './pages/DeliveryPage'

import AdminLayout from './pages/admin/AdminLayout'
import AdminProducts from './pages/admin/AdminProducts'
import AdminDiscounts from './pages/admin/AdminDiscounts'
import AdminSettings from './pages/admin/AdminSettings'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
            <Navbar />
            <CartDrawer />

            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/delivery" element={<DeliveryPage />} />

                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminProducts />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="discounts" element={<AdminDiscounts />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
