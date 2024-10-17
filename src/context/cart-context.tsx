import React, { createContext, ReactNode, useContext, useState } from "react";

interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    options?: Record<string, string[]>
}

interface CartContextType {
    cartItems: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)


export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
  
    const addToCart = (item: CartItem) => {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.id === item.id)
        if (existingItem) {
          return prevItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        }
        return [...prevItems, item]
      })
    }
  
    const removeFromCart = (id: string) => {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
    }
  
    const updateQuantity = (id: string, quantity: number) => {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    }

    const clearCart = () => {
        setCartItems([])
    }

    const contextValue: CartContextType = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    }

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (context === undefined) {
      throw new Error('useCart must be used within a CartProvider')
    }
    return context
  }
    