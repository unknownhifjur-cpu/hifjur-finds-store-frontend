import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Animation */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'linear-gradient(120deg, #6366f1, #8b5cf6, #ec4899)',
              'linear-gradient(180deg, #8b5cf6, #ec4899, #6366f1)',
              'linear-gradient(240deg, #ec4899, #6366f1, #8b5cf6)',
              'linear-gradient(120deg, #6366f1, #8b5cf6, #ec4899)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative container mx-auto px-4 py-20 md:py-28 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="w-8 h-8 text-indigo-300" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
                Welcome to <span className="font-semibold text-indigo-300">Hifzo</span>
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Curated collection of modern essentials. Thoughtfully designed,
              carefully crafted.
            </p>
            <motion.div
              className="h-1 w-20 bg-indigo-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <h2 className="text-3xl md:text-4xl font-light text-gray-900">
              Featured Products
            </h2>
          </div>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Handpicked just for you. Explore our latest arrivals.
          </p>
          <div className="w-24 h-0.5 bg-indigo-400 mx-auto mt-4" />
        </motion.div>

        {/* Animated Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Hifzo. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;