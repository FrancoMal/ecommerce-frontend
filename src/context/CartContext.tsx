import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem, Cart, CartContextType, Product } from '../types';
import { useAuth } from './AuthContext';

// Cart state type
interface CartState {
  cart: Cart;
  loading: boolean;
}

// Cart actions
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' };

// Initial state
const initialState: CartState = {
  cart: {
    items: [],
    total: 0,
  },
  loading: false,
};

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    
    case 'SET_CART':
      return {
        ...state,
        cart: action.payload,
        loading: false,
      };
    
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.cart.items.findIndex(
        (item) => item.productId === product.id
      );

      let newItems: CartItem[];
      if (existingItemIndex > -1) {
        // Update existing item
        newItems = state.cart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.images[0]?.imageUrl || '',
          stock: product.stock,
        };
        newItems = [...state.cart.items, newItem];
      }

      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      return {
        ...state,
        cart: {
          items: newItems,
          total,
        },
      };
    }
    
    case 'REMOVE_ITEM': {
      const productId = action.payload;
      const newItems = state.cart.items.filter((item) => item.productId !== productId);
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      return {
        ...state,
        cart: {
          items: newItems,
          total,
        },
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: productId });
      }
      
      const newItems = state.cart.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      );
      
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      return {
        ...state,
        cart: {
          items: newItems,
          total,
        },
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: {
          items: [],
          total: 0,
        },
      };
    
    default:
      return state;
  }
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Load cart from localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          dispatch({ type: 'SET_CART', payload: cart });
        } catch (error) {
          console.error('Failed to load cart from localStorage:', error);
        }
      }
    }
  }, [isAuthenticated, user]);

  // Save cart to localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(state.cart));
    }
  }, [state.cart, isAuthenticated, user]);

  const addToCart = (product: Product, quantity: number) => {
    if (quantity > product.stock) {
      throw new Error('No hay suficiente stock disponible');
    }
    
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity },
    });
  };

  const removeFromCart = (productId: number) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: productId,
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const item = state.cart.items.find((item) => item.productId === productId);
    if (item && quantity > item.stock) {
      throw new Error('No hay suficiente stock disponible');
    }
    
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const checkout = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simulate API call for checkout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Clear cart after successful checkout
      dispatch({ type: 'CLEAR_CART' });
      
      // Clear cart from localStorage
      if (user) {
        localStorage.removeItem(`cart_${user.id}`);
      }
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value: CartContextType = {
    cart: state.cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    loading: state.loading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}