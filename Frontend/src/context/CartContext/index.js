import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);

const initialState = {
  items: [],   // [{_id, name, price, image, qty}]
};

function cartReducer(state, action) {
  switch (action.type) {
    case "INIT_FROM_STORAGE": {
      return action.payload || initialState;
    }
    case "ADD_ITEM": {
      const { product, qty } = action.payload;
      const id = product._id || product.id;
      const name = product.name || product.title; // support both names
      const price = Number(product.price) || 0;
      const image =
        product.image ||
        product.thumbnail ||
        product.images?.[0] ||
        product.photo ||
        "";

      const existing = state.items.find(i => i._id === id);
      let items;
      if (existing) {
        items = state.items.map(i =>
          i._id === id ? { ...i, qty: Math.min(i.qty + qty, 99) } : i
        );
      } else {
        items = [...state.items, { _id: id, name, price, image, qty: Math.min(qty, 99) }];
      }
      return { ...state, items };
    }
    case "REMOVE_ITEM": {
      const id = action.payload;
      return { ...state, items: state.items.filter(i => i._id !== id) };
    }
    case "SET_QTY": {
      const { id, qty } = action.payload;
      return {
        ...state,
        items: state.items.map(i => (i._id === id ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i)),
      };
    }
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load from localStorage on first mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("aura_mosaic_cart"));
      if (stored && stored.items) {
        dispatch({ type: "INIT_FROM_STORAGE", payload: stored });
      }
    } catch {}
  }, []);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem("aura_mosaic_cart", JSON.stringify(state));
  }, [state]);

  const totals = useMemo(() => {
    const count = state.items.reduce((a, i) => a + i.qty, 0);
    const subtotal = state.items.reduce((a, i) => a + i.price * i.qty, 0);
    return { count, subtotal, shipping: 0, grandTotal: subtotal };
  }, [state.items]);

  const value = {
    items: state.items,
    totals,
    addItem: (product, qty = 1) => dispatch({ type: "ADD_ITEM", payload: { product, qty } }),
    removeItem: id => dispatch({ type: "REMOVE_ITEM", payload: id }),
    setQty: (id, qty) => dispatch({ type: "SET_QTY", payload: { id, qty } }),
    clear: () => dispatch({ type: "CLEAR" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
