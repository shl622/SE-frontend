import { useCart } from "../../context/cart-context"

export const Cart = () => {

    const { cartItems, addToCart, removeFromCart, clearCart } = useCart()
    const total = cartItems.reduce((sum, item) => sum + item.price, 0)
    return (
        <div>
            <h1>Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.id}>
                                {item.name} - ${item.price.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                    <p>Total: ${total.toFixed(2)}</p>
                </>
            )}
        </div>
    )
}