// lib/analytics.ts

// Declare gtag on window
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Page view tracking (automatically tracked by GA4, but you can manually trigger if needed)
export const trackPageView = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'page_view', {
      page_path: url,
    });
  }
};

// Product view tracking
export const trackProductView = (productId: string, productName: string, price?: number) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'product_view', {
      product_id: productId,
      product_name: productName,
      price: price,
      currency: 'SEK',
    });
  }
};

// Add to cart tracking
export const trackAddToCart = (
  productId: string,
  productName: string,
  price: number,
  quantity: number = 1
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'add_to_cart', {
      product_id: productId,
      product_name: productName,
      price: price,
      quantity: quantity,
      currency: 'SEK',
    });
  }
};

// Generic event tracking (for custom events)
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, parameters);
  }
};
