import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product._id);

  const toggleWishlist = (e) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <motion.div
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-700"
      whileHover={{ y: -4 }}
    >
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden h-48">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 p-2 bg-gray-900/80 rounded-full hover:bg-gray-900 transition"
          >
            <Heart
              className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-300'}`}
            />
          </button>
        </div>
        <div className="p-5">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
          <p className="text-indigo-400 font-bold text-xl mb-4">${product.price}</p>
          <span className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200">
            View Details
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;