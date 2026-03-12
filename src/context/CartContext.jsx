import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  // Ensure state always has an items array
  const currentItems = state?.items || [];
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = currentItems.find(item => item.productId === action.payload.productId);
      if (existing) {
        return {
          ...state,
          items: currentItems.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { ...state, items: [...currentItems, action.payload] };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: currentItems.filter(item => item.productId !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: currentItems.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state || { items: [] };
  }
};

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, null, () => {
    try {
      const local = localStorage.getItem('cart');
      if (local) {
        const parsed = JSON.parse(local);
        // Validate that parsed has an items array
        if (parsed && Array.isArray(parsed.items)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage', error);
    }
    return { items: [] }; // Safe fallback
  });

  useEffect(() => {
    // Save to localStorage whenever state changes, but only if valid
    if (state && Array.isArray(state.items)) {
      localStorage.setItem('cart', JSON.stringify(state));
    }
  }, [state]);

  const addToCart = (product, quantity) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        quantity,
      },
    });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Safely compute totals
  const items = state?.items || [];
  const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart: items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};