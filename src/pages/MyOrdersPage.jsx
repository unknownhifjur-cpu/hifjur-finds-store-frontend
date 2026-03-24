import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';               // ✅ added import
import { motion } from 'framer-motion';
import { Package, Calendar, DollarSign, ChevronRight, ShoppingBag } from 'lucide-react';
import API from '../services/api';
import Loader from '../components/Loader';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'processing':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'shipped':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'delivered':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-light text-white mb-8 flex items-center gap-3"
        >
          <Package className="w-8 h-8 text-indigo-400" />
          My Orders
        </motion.h1>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center bg-gray-800 rounded-2xl p-12 border border-gray-700"
          >
            <ShoppingBag className="w-20 h-20 text-indigo-400 mx-auto mb-6" />
            <h2 className="text-2xl font-light text-white mb-4">No orders yet</h2>
            <p className="text-gray-400 mb-8">Start shopping to place your first order.</p>
            <a
              href="/products"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-lg transition-colors"
            >
              Browse Products
              <ChevronRight className="w-5 h-5" />
            </a>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-indigo-500/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left side */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-indigo-400" />
                      <span className="text-white font-mono text-sm">#{order._id.slice(-8)}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium text-white">${order.totalPrice?.toFixed(2)}</span>
                      </div>
                    </div>
                    {order.products && (
                      <div className="text-sm text-gray-400">
                        {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
                      </div>
                    )}
                  </div>

                  {/* Right side */}
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus || 'Pending'}
                    </span>
                    {/* ✅ replaced <a> with <Link> */}
                    <Link
                      to={`/order/${order._id}`}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors p-2"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Product preview */}
                {order.products && order.products.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {order.products.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                          {item.name} x{item.quantity}
                        </span>
                      ))}
                      {order.products.length > 3 && (
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                          +{order.products.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;