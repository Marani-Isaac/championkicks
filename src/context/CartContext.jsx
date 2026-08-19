import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'ck_cart'
const BUY_NOW_KEY = 'ck_buy_now'

function readCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function readBuyNow() {
  try {
    const raw = sessionStorage.getItem(BUY_NOW_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) && parsed.length ? parsed : null
  } catch {
    return null
  }
}

function toLineItem(product, quantity = 1) {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price) || 0,
    image_url: product.image_url,
    category: product.category,
    stock: product.stock,
    quantity,
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart)
  const [buyNowItems, setBuyNowItems] = useState(readBuyNow)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: Math.min((i.quantity || 1) + quantity, product.stock ?? 99) }
            : i,
        )
      }
      return [...prev, toLineItem(product, quantity)]
    })
  }

  const startBuyNow = (product, quantity = 1) => {
    const next = [toLineItem(product, quantity)]
    sessionStorage.setItem(BUY_NOW_KEY, JSON.stringify(next))
    setBuyNowItems(next)
  }

  const clearBuyNow = () => {
    sessionStorage.removeItem(BUY_NOW_KEY)
    setBuyNowItems(null)
  }

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id))

  const updateQuantity = (id, quantity) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id !== id) return i
          const next = Math.max(1, Math.min(quantity, i.stock ?? 99))
          return { ...i, quantity: next }
        })
        .filter((i) => i.quantity > 0),
    )
  }

  const clearCart = () => setItems([])

  const value = useMemo(() => {
    const itemCount = items.reduce((sum, i) => sum + (i.quantity || 0), 0)
    const subtotal = items.reduce((sum, i) => sum + Number(i.price) * (i.quantity || 0), 0)
    const isBuyNow = Boolean(buyNowItems?.length)
    const checkoutItems = isBuyNow ? buyNowItems : items
    const checkoutSubtotal = checkoutItems.reduce(
      (sum, i) => sum + Number(i.price) * (i.quantity || 0),
      0,
    )
    return {
      items,
      itemCount,
      subtotal,
      buyNowItems,
      isBuyNow,
      checkoutItems,
      checkoutSubtotal,
      addItem,
      startBuyNow,
      clearBuyNow,
      removeItem,
      updateQuantity,
      clearCart,
    }
  }, [items, buyNowItems])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
