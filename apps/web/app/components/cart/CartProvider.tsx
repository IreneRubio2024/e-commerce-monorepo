// components/cart/CartProvider.tsx
"use client";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { Product } from "@repo/shared/products";

type CartItem = {
    product: Product;
    quantity: number;
};

type State = {
    items: CartItem[];
};

type Action =
    | { type: "INITIALIZE"; payload: State }
    | { type: "ADD_ITEM"; payload: { product: Product; qty?: number } }
    | { type: "REMOVE_ITEM"; payload: { productId: number } }
    | { type: "UPDATE_QTY"; payload: { productId: number; qty: number } }
    | { type: "CLEAR" };

const CartContext = createContext<
    { state: State; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

const LOCAL_KEY = "my-ecom-cart-v1";

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "INITIALIZE":
            return action.payload;
        case "ADD_ITEM": {
            const { product, qty = 1 } = action.payload;
            const existing = state.items.find((it) => it.product.id === product.id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map((it) =>
                        it.product.id === product.id
                            ? { ...it, quantity: it.quantity + qty }
                            : it
                    ),
                };
            }
            return { ...state, items: [...state.items, { product, quantity: qty }] };
        }
        case "REMOVE_ITEM":
            return { ...state, items: state.items.filter((it) => it.product.id !== action.payload.productId) };
        case "UPDATE_QTY":
            return {
                ...state,
                items: state.items
                    .map((it) =>
                        it.product.id === action.payload.productId ? { ...it, quantity: action.payload.qty } : it
                    )
                    .filter((it) => it.quantity > 0),
            };
        case "CLEAR":
            return { items: [] };
        default:
            return state;
    }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, { items: [] });

    // load from localStorage once
    useEffect(() => {
        try {
            const raw = localStorage.getItem(LOCAL_KEY);
            if (raw) {
                const parsed: State = JSON.parse(raw);
                dispatch({ type: "INITIALIZE", payload: parsed });
            }
        } catch (e) {
            console.error("Failed to read cart from localStorage", e);
        }
    }, []);

    // save on change
    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
        } catch (e) {
            console.error("Failed to write cart to localStorage", e);
        }
    }, [state]);

    return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCartContext() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCartContext must be used within CartProvider");
    return ctx;
}

// convenience hook with actions
export function useCart() {
    const { state, dispatch } = useCartContext();

    const addItem = (product: Product, qty = 1) => {
        dispatch({ type: "ADD_ITEM", payload: { product, qty } });
    };

    const removeItem = (productId: number) =>
        dispatch({ type: "REMOVE_ITEM", payload: { productId } });

    const updateQty = (productId: number, qty: number) =>
        dispatch({ type: "UPDATE_QTY", payload: { productId, qty } });

    const clear = () => dispatch({ type: "CLEAR" });

    const itemCount = state.items.reduce((s, it) => s + it.quantity, 0);
    const subtotal = state.items.reduce((s, it) => s + it.quantity * (it.product.price || 0), 0);

    return { items: state.items, addItem, removeItem, updateQty, clear, itemCount, subtotal };
}
