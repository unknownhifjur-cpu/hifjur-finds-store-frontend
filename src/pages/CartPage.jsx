import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl mb-4">Your cart is empty</h2>
        <Link to="/products" className="bg-blue-500 text-white px-6 py-3 rounded">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {cart.map((item) => (
            <div key={item.productId} className="flex items-center border-b py-4">
              <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="w-20 h-20 object-cover mr-4" />
              <div className="flex-1">
                <h3 className="font-bold">{item.name}</h3>
                <p>${item.price}</p>
                <div className="flex items-center mt-2">
                  <label className="mr-2">Qty:</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                    className="border rounded p-1 w-16"
                  />
                </div>
              </div>
              <button onClick={() => removeFromCart(item.productId)} className="text-red-500">Remove</button>
            </div>
          ))}
        </div>
        <div className="lg:w-1/3 bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="border-t pt-4">
            <Link to="/checkout" className="bg-green-500 text-white w-full py-3 rounded-lg block text-center">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;