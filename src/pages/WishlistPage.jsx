import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-12 text-center">
        <p className="text-gray-400 text-lg">Your wishlist is empty.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-light text-white mb-8">Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;