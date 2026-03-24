import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, Store, MapPin, Calendar, DollarSign, Receipt } from 'lucide-react';
import API from '../services/api';
import Loader from '../components/Loader';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        setError('Failed to load order details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!order) return <div className="text-center text-gray-400 py-10">Order not found</div>;

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
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back button */}
        <Link to="/myorders" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl border border-gray-700 p-6"
        >
          <h1 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-indigo-400" />
            Order Details
          </h1>

          {/* Order ID & Status */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-400 text-sm">Order ID</p>
              <p className="text-white font-mono text-lg">{order.orderId || order._id.slice(-10)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-gray-300 mb-6">
            <Calendar className="w-4 h-4" />
            <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Items */}
          <div className="border-t border-gray-700 pt-4 mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Items</h2>
            <div className="space-y-3">
              {order.products?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <div>
                    <p className="text-white">{item.name}</p>
                    <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-white font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border-t border-gray-700 pt-4 mb-6">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-400" />
              Shipping Address
            </h2>
            <div className="text-gray-300 space-y-1">
              <p>{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.phone}</p>
              <p>{order.shippingAddress?.address}, {order.shippingAddress?.area}</p>
              <p>{order.shippingAddress?.city} - {order.shippingAddress?.pincode}</p>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="border-t border-gray-700 pt-4 mb-6">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              {order.deliveryType === 'HOME' ? <Truck className="w-5 h-5 text-indigo-400" /> : <Store className="w-5 h-5 text-indigo-400" />}
              Delivery Method
            </h2>
            <p className="text-gray-300">
              {order.deliveryType === 'HOME' ? 'Home Delivery' : 'Store Pickup'}
            </p>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-700 pt-4">
            <h2 className="text-lg font-semibold text-white mb-3">Price Summary</h2>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>₹{order.deliveryCharge?.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-₹{order.discountAmount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-bold text-lg pt-2">
                <span>Total</span>
                <span>₹{order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;