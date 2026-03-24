import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Package, ChevronRight, MapPin, Truck, Store } from 'lucide-react';
import API from '../services/api';
import Loader from '../components/Loader';

const OrderTrackingPage = () => {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trackOrders = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await API.get(`/orders/track/${phone}`);
      setOrders(data);
      if (data.length === 0) setError('No orders found for this phone number.');
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'confirmed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'out for delivery': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'delivered': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pickup ready': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-light text-white mb-8 flex items-center gap-3"
        >
          <Phone className="w-8 h-8 text-indigo-400" />
          Track Orders
        </motion.h1>

        <form onSubmit={trackOrders} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-lg font-medium transition"
            >
              Track
            </button>
          </div>
        </form>

        {loading && <Loader />}
        {error && <p className="text-red-400 text-center">{error}</p>}
        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-indigo-500/50 transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white font-mono text-sm">Order #{order.orderId?.slice(-8) || order._id.slice(-8)}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>Items: {order.products?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.deliveryType === 'HOME' ? (
                      <Truck className="w-4 h-4" />
                    ) : (
                      <Store className="w-4 h-4" />
                    )}
                    <span>{order.deliveryType === 'HOME' ? 'Home Delivery' : 'Store Pickup'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{order.shippingAddress?.city}, {order.shippingAddress?.pincode}</span>
                  </div>
                  <div className="font-medium text-white">
                    Total: ₹{order.totalPrice?.toFixed(2)}
                  </div>
                </div>

                {order.products && order.products.length > 0 && (
                  <div className="border-t border-gray-700 pt-3 mt-2">
                    <p className="text-gray-400 text-xs mb-2">Items:</p>
                    <div className="space-y-1">
                      {order.products.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="text-gray-300 text-sm flex justify-between">
                          <span>{item.name} x{item.quantity}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      {order.products.length > 3 && (
                        <p className="text-gray-500 text-xs">+{order.products.length - 3} more items</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-2">
                  <a
                    href={`/order/${order._id}`}
                    className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 text-sm"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;