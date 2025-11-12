'use client';

import { useEffect } from 'react';
import { trackProductView, trackAddToCart } from '../lib/analytics';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  // Track product view when component mounts
  useEffect(() => {
    trackProductView(product.id, product.name, product.price);
  }, [product.id, product.name, product.price]);

  const handleAddToCart = () => {
    // Track add to cart event
    trackAddToCart(product.id, product.name, product.price, 1);
    
    // Your actual add to cart logic here
    console.log('Added to cart:', product);
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="price">{product.price} SEK</p>
      <button onClick={handleAddToCart}>
        Lägg till i varukorg
      </button>
    </div>
  );
}
