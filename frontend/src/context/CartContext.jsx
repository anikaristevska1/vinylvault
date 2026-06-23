import { createContext, useContext, useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext.jsx'

const CartContext = createContext(null)

const STORAGE_KEY = 'vinylvault_cart'
const API_BASE = import.meta.env.VITE_API_URL || ''

const loadLocalCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveLocalCart = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const clearLocalCart = () => {
  localStorage.removeItem(STORAGE_KEY)
}

export function CartProvider({ children }) {
  const { isAuthenticated, token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const mergedRef = useRef(false)

  // Load cart whenever auth state changes
  useEffect(() => {
    const load = async () => {
      if (isAuthenticated) {
        // 1. On first authenticated load, merge guest cart with server cart
        if (!mergedRef.current) {
          const localItems = loadLocalCart()
          if (localItems.length > 0) {
            try {
              const mergePayload = {
                items: localItems.map(i => ({
                  recordId: i.id,
                  quantity: i.quantity,
                })),
              }
              const { data } = await axios.post(`${API_BASE}/api/cart/merge`, mergePayload)
              setItems(data.items)
              clearLocalCart()
              mergedRef.current = true
              return
            } catch (err) {
              console.error('Cart merge failed:', err)
            }
          }
          mergedRef.current = true
        }

        // 2. Otherwise just load from server
        try {
          setLoading(true)
          const { data } = await axios.get(`${API_BASE}/api/cart`)
          setItems(data.items)
        } catch (err) {
          console.error('Failed to load cart:', err)
        } finally {
          setLoading(false)
        }
      } else {
        // Not authenticated - load from localStorage
        mergedRef.current = false
        setItems(loadLocalCart())
      }
    }
    load()
  }, [isAuthenticated, token])

  // For guests: persist items to localStorage whenever they change
  useEffect(() => {
    if (!isAuthenticated) {
      saveLocalCart(items)
    }
  }, [items, isAuthenticated])

  const add = async (record) => {
    if (isAuthenticated) {
      try {
        const { data } = await axios.post(`${API_BASE}/api/cart/items`, {
          recordId: record.id,
          quantity: 1,
        })
        setItems(data.items)
      } catch (err) {
        console.error('Failed to add to cart:', err)
      }
    } else {
      setItems(prev => {
        const existing = prev.find(i => i.id === record.id)
        if (existing) {
          return prev.map(i => i.id === record.id
            ? { ...i, quantity: i.quantity + 1 }
            : i)
        }
        return [...prev, {
          id: record.id,
          recordId: record.id,
          albumTitle: record.albumTitle,
          artist: record.artist,
          price: record.price,
          coverImagePath: record.coverImagePath,
          coverImageUrl: record.coverImageUrl,
          stockQuantity: record.stockQuantity,
          quantity: 1,
        }]
      })
    }
  }

  const updateQty = async (recordId, quantity) => {
    const newQty = Math.max(1, quantity)
    if (isAuthenticated) {
      try {
        const { data } = await axios.put(`${API_BASE}/api/cart/items/${recordId}`, {
          quantity: newQty,
        })
        setItems(data.items)
      } catch (err) {
        console.error('Failed to update cart:', err)
      }
    } else {
      setItems(prev => prev.map(i => i.id === recordId ? { ...i, quantity: newQty } : i))
    }
  }

  const remove = async (recordId) => {
    if (isAuthenticated) {
      try {
        const { data } = await axios.delete(`${API_BASE}/api/cart/items/${recordId}`)
        setItems(data.items)
      } catch (err) {
        console.error('Failed to remove from cart:', err)
      }
    } else {
      setItems(prev => prev.filter(i => i.id !== recordId))
    }
  }

  const clear = async () => {
    if (isAuthenticated) {
      try {
        const { data } = await axios.delete(`${API_BASE}/api/cart`)
        setItems(data.items)
      } catch (err) {
        console.error('Failed to clear cart:', err)
      }
    } else {
      setItems([])
    }
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)

  const value = {
    items,
    itemCount,
    subtotal,
    loading,
    add,
    remove,
    updateQty,
    clear,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
