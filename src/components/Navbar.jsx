import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, LogOut, Package, Home, Grid } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/products', label: 'Products', icon: Grid },
  ];

  const authLinks = user
    ? [
        { to: '/cart', label: 'Cart', icon: ShoppingCart, badge: itemCount },
        { to: '/profile', label: 'Profile', icon: User },
        { to: '/myorders', label: 'My Orders', icon: Package },
      ]
    : [
        { to: '/login', label: 'Login' },
        { to: '/register', label: 'Register' },
      ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-indigo-500/20'
            : 'bg-gray-900'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo - matching homepage hero */}
            <Link
              to="/"
              className="text-2xl md:text-3xl font-bold text-white hover:text-indigo-400 transition-colors"
            >
              Hifzo
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-300 hover:text-indigo-400 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  {authLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-gray-300 hover:text-indigo-400 transition-colors font-medium flex items-center gap-1"
                    >
                      {link.icon && <link.icon className="w-4 h-4" />}
                      {link.label}
                      {link.badge > 0 && (
                        <span className="ml-1 bg-indigo-500 text-white text-xs rounded-full px-2 py-0.5">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                  <button
                    onClick={logout}
                    className="text-gray-300 hover:text-indigo-400 transition-colors font-medium flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                authLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-gray-300 hover:text-indigo-400 transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-300 hover:text-indigo-400 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMenu}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-gray-900 shadow-2xl z-50 md:hidden border-l border-gray-800"
            >
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-gray-800">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-indigo-400 hover:bg-gray-800 transition-colors"
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-800 my-2"></div>
                  {user ? (
                    <>
                      {authLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={closeMenu}
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-indigo-400 hover:bg-gray-800 transition-colors"
                        >
                          {link.icon && <link.icon className="w-5 h-5" />}
                          {link.label}
                          {link.badge > 0 && (
                            <span className="ml-auto bg-indigo-500 text-white text-xs rounded-full px-2 py-1">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                      <button
                        onClick={() => {
                          logout();
                          closeMenu();
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-indigo-400 hover:bg-gray-800 transition-colors w-full text-left"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-indigo-400 hover:bg-gray-800 transition-colors"
                      >
                        <User className="w-5 h-5" />
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={closeMenu}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-indigo-400 hover:bg-gray-800 transition-colors"
                      >
                        <User className="w-5 h-5" />
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;