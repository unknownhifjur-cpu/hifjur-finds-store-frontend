import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, User, Home, Building2, Mail, Package, Truck, Store, Ticket } from 'lucide-react';
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
  const [deliveryType, setDeliveryType] = useState('HOME');
  const [referralCode, setReferralCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [referralValid, setReferralValid] = useState(false);
  const [referralMessage, setReferralMessage] = useState('');

  const deliveryCharge = deliveryType === 'HOME' ? 50 : 0;
  const subtotal = cartTotal;
  const total = subtotal + deliveryCharge - discount;

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validateReferral = async () => {
    if (!referralCode) {
      setDiscount(0);
      setReferralValid(false);
      setReferralMessage('');
      return;
    }
    try {
      const res = await API.post('/referrals/validate', {
        code: referralCode,
        phone: address.phone,
      });
      if (res.data.valid) {
        const maxDiscount = res.data.maxDiscount;
        const calculated = Math.min(subtotal * (res.data.discountPercent / 100), maxDiscount);
        setDiscount(calculated);
        setReferralValid(true);
        setReferralMessage('Referral applied!');
      } else {
        setDiscount(0);
        setReferralValid(false);
        setReferralMessage(res.data.message);
      }
    } catch (error) {
      console.error(error);
      setDiscount(0);
      setReferralValid(false);
      setReferralMessage('Error validating code');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        guestName: address.name,
        phoneNumber: address.phone,
        shippingAddress: {
          name: address.name,
          phone: address.phone,
          address: address.address,
          area: address.area,
          city: address.city,
          pincode: address.pincode,
        },
        products: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        deliveryType,
        paymentMethod: 'COD',
        referralCode: referralValid ? referralCode : null,
      };
      await API.post('/orders', orderData);
      clearCart();
      navigate('/myorders'); // or navigate to confirmation page
    } catch (error) {
      alert(error.response?.data?.message || 'Order failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-light text-white mb-8"
        >
          Checkout
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-2/3"
          >
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-400" />
                Shipping Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={address.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={address.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-2">Address</label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="address"
                        value={address.address}
                        onChange={handleChange}
                        required={deliveryType === 'HOME'}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Street address"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Area / Locality</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="area"
                        value={address.area}
                        onChange={handleChange}
                        required={deliveryType === 'HOME'}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Area name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">City</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="City"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Pincode</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="pincode"
                        value={address.pincode}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="123456"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Type */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Delivery Method</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('HOME')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-colors ${
                        deliveryType === 'HOME'
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Truck className="w-5 h-5" />
                      Home Delivery (+₹50)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('STORE')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-colors ${
                        deliveryType === 'STORE'
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Store className="w-5 h-5" />
                      Store Pickup (Free)
                    </button>
                  </div>
                </div>

                {/* Referral Code */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Referral Code (Optional)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Ticket className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter code"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={validateReferral}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg"
                    >
                      Apply
                    </button>
                  </div>
                  {referralMessage && (
                    <p className={`text-sm mt-1 ${referralValid ? 'text-green-400' : 'text-red-400'}`}>
                      {referralMessage}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Place Order (Cash on Delivery)
                </button>
              </form>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/3"
          >
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-400" />
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between text-gray-300">
                    <span>{item.name} x {item.quantity}</span>
                    <span className="font-medium text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Delivery</span>
                  <span>{deliveryCharge === 0 ? 'Free' : `+$${deliveryCharge}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg text-white font-bold pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;