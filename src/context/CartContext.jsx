import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
    const { user } = useAuth()
    const [cartItems, setCartItems] = useState([])
    const [cartOpen, setCartOpen] = useState(false)

    // Load cart from Supabase when user logs in
    const loadCart = useCallback(async () => {
        if (!user) {
            setCartItems([])
            return
        }
        const { data, error } = await supabase
            .from('cart_items')
            .select('*, products(*)')
            .eq('user_id', user.id)
        if (!error && data) {
            setCartItems(data)
        }
    }, [user])

    useEffect(() => {
        loadCart()
    }, [loadCart])

    const addToCart = async (product, quantity = 1) => {
        if (!user) return { error: 'Please login to add items to cart' }

        // Check if already in cart
        const existing = cartItems.find(ci => ci.product_id === product.id)

        if (existing) {
            const newQty = existing.quantity + quantity
            const { error } = await supabase
                .from('cart_items')
                .update({ quantity: newQty })
                .eq('id', existing.id)
            if (!error) {
                setCartItems(prev => prev.map(ci =>
                    ci.id === existing.id ? { ...ci, quantity: newQty } : ci
                ))
            }
            return { error }
        } else {
            const { data, error } = await supabase
                .from('cart_items')
                .insert({ user_id: user.id, product_id: product.id, quantity })
                .select('*, products(*)')
                .single()
            if (!error && data) {
                setCartItems(prev => [...prev, data])
            }
            return { error }
        }
    }

    const removeFromCart = async (cartItemId) => {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', cartItemId)
        if (!error) {
            setCartItems(prev => prev.filter(ci => ci.id !== cartItemId))
        }
    }

    const updateQuantity = async (cartItemId, quantity) => {
        if (quantity <= 0) {
            return removeFromCart(cartItemId)
        }
        const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', cartItemId)
        if (!error) {
            setCartItems(prev => prev.map(ci =>
                ci.id === cartItemId ? { ...ci, quantity } : ci
            ))
        }
    }

    const clearCart = async () => {
        if (!user) return
        await supabase.from('cart_items').delete().eq('user_id', user.id)
        setCartItems([])
    }

    const cartCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0)

    const cartTotal = cartItems.reduce((sum, ci) => {
        const p = ci.products
        if (!p) return sum
        const price = p.discount_percent > 0
            ? p.price * (1 - p.discount_percent / 100)
            : p.price
        return sum + price * ci.quantity
    }, 0)

    return (
        <CartContext.Provider value={{
            cartItems, cartCount, cartTotal,
            cartOpen, setCartOpen,
            addToCart, removeFromCart, updateQuantity, clearCart,
            loadCart
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}
