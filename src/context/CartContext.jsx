import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { productsApi, normalizeProducts } from '../lib/api'
import { isCartItemAvailable, isProductAvailable } from '../lib/format'

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
  const available = product.available !== false && isProductAvailable(product.available)
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price) || 0,
    image_url: product.image_url,
    category: product.category,
    available,
    stock: available ? product.stock ?? 99 : 0,
    quantity,
  }
}

function mergeCatalogItem(item, catalog) {
  const live = catalog.find((p) => String(p.id) === String(item.id))
  if (!live) {
    return { ...item, available: false, stock: 0 }
  }
  const available = live.available !== false
  return {
    ...item,
    name: live.name || item.name,
    price: Number(live.price) || item.price,
    image_url: live.image_url || item.image_url,
    category: live.category || item.category,
    available,
    stock: available ? live.stock ?? 99 : 0,
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart)
  const [buyNowItems, setBuyNowItems] = useState(readBuyNow)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const { data } = await productsApi.getAll()
        if (!active) return
        const catalog = normalizeProducts(data)
        setItems((prev) => prev.map((item) => mergeCatalogItem(item, catalog)))
        setBuyNowItems((prev) =>
          prev ? prev.map((item) => mergeCatalogItem(item, catalog)) : prev,
        )
      } catch {
        /* keep stored cart if catalog cannot be loaded */
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const addItem = (product, quantity = 1) => {
    if (product.available === false || (product.stock ?? 99) <= 0) return
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

  const adjustItem = (product, delta) => {
    setItems((prev) => {
      const max = product.stock ?? 99
      const existing = prev.find((i) => i.id === product.id)
      if (!existing) {
        if (delta <= 0) return prev
        return [...prev, toLineItem(product, Math.min(Math.max(delta, 1), max))]
      }
      const nextQty = (existing.quantity || 0) + delta
      if (nextQty <= 0) return prev.filter((i) => i.id !== product.id)
      return prev.map((i) =>
        i.id === product.id ? { ...i, quantity: Math.min(nextQty, i.stock ?? max) } : i,
      )
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
          const next = Math.max(0, Math.min(quantity, i.stock ?? 99))
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
    const unavailableItems = items.filter((item) => !isCartItemAvailable(item))
    const unavailableCheckoutItems = checkoutItems.filter((item) => !isCartItemAvailable(item))
    return {
      items,
      itemCount,
      subtotal,
      unavailableItems,
      hasUnavailable: unavailableItems.length > 0,
      buyNowItems,
      isBuyNow,
      checkoutItems,
      checkoutSubtotal,
      unavailableCheckoutItems,
      hasUnavailableCheckout: unavailableCheckoutItems.length > 0,
      addItem,
      adjustItem,
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
