import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Minus, Plus, Package, Tag, Layers, ArrowLeft } from 'lucide-react';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert('Added to cart!');
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) return <Loader />;

  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-indigo-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Image */}
            <div className="lg:w-1/2 p-6 lg:p-8 bg-gray-900/50">
              <motion.img
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                src={imageUrl}
                alt={product.name}
                className="w-full h-auto max-h-96 object-contain rounded-xl"
              />
            </div>

            {/* Right side - Details */}
            <div className="lg:w-1/2 p-6 lg:p-8">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-3xl md:text-4xl font-light text-white mb-3">{product.name}</h1>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full">
                      <Tag className="w-4 h-4" />
                      {product.category}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Layers className="w-4 h-4" />
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed">{product.description}</p>

                <div className="border-t border-b border-gray-700 py-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-white">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="space-y-4">
                  <label className="block text-gray-300 text-sm font-medium">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-5 h-5 text-white" />
                    </button>
                    <span className="w-12 text-center text-white text-lg font-medium">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-5 h-5 text-white" />
                    </button>
                    <span className="text-gray-400 text-sm ml-2">Max {product.stock}</span>
                  </div>
                </div>

                {/* Add to cart button */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;