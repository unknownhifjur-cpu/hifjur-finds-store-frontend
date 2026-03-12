import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/200';
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg">
      <img src={imageUrl} alt={product.name} className="w-full h-48 object-cover mb-4" />
      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-2">${product.price}</p>
      <Link to={`/product/${product._id}`} className="bg-blue-500 text-white px-4 py-2 rounded inline-block">
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;