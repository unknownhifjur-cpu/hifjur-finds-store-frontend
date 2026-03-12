import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <motion.div
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-700"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="relative overflow-hidden h-48">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-5">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-indigo-400 font-bold text-xl mb-4">${product.price}</p>
        <Link 
          to={`/product/${product._id}`}
          className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;