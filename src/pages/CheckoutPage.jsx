import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../services/api';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    address: '',
    area: '',
    city: '',
    pincode: '',
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        products: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        totalPrice: cartTotal,
      };
      await API.post('/orders', orderData);
      clearCart();
      navigate('/myorders');
    } catch (error) {
      alert(error.response?.data?.message || 'Order failed');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="Full Name" value={address.name} onChange={handleChange} required className="border p-2 rounded" />
              <input type="tel" name="phone" placeholder="Phone Number" value={address.phone} onChange={handleChange} required className="border p-2 rounded" />
              <input type="text" name="address" placeholder="Address" value={address.address} onChange={handleChange} required className="border p-2 rounded" />
              <input type="text" name="area" placeholder="Area/Locality" value={address.area} onChange={handleChange} required className="border p-2 rounded" />
              <input type="text" name="city" placeholder="City" value={address.city} onChange={handleChange} required className="border p-2 rounded" />
              <input type="text" name="pincode" placeholder="Pincode" value={address.pincode} onChange={handleChange} required className="border p-2 rounded" />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">Place Order (Cash on Delivery)</button>
          </form>
        </div>
        <div className="lg:w-1/3 bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          {cart.map((item) => (
            <div key={item.productId} className="flex justify-between mb-2">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;