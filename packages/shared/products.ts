export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  inStock: boolean;
  slug: string;
  media: string;
  detailMedia: string[];
  category: string;
};

const STRAPI_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:1337";

const API_URL = `${STRAPI_URL}/api/products?populate=*`;

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error(`Failed to fetch products. Status: ${res.status}`);
    }

    const json = await res.json();

    const products: Product[] = (json.data || []).map((item: any) => {
      const mediaUrls: string[] = (item.media ?? [])
        .map((m: any) => {
          const url = m?.url;
          return url
            ? url.startsWith("http")
              ? url
              : `http://localhost:1337${url}`
            : null;
        })
        .filter(Boolean) as string[];
      const detailUrls: string[] = (item.detailMedia ?? [])
        .map((m: any) => {
          const url = m?.url;
          return url
            ? url.startsWith("http")
              ? url
              : `http://localhost:1337${url}`
            : null;
        })
        .filter(Boolean) as string[];

      return {
        id: item.id,
        title: item.title || "No title",
        description: item.description || "",
        price: item.price || 0,
        inStock: item.inStock ?? false,
        slug: item.slug || "",
        media: mediaUrls,
        detailMedia: detailUrls,
        category: item.category || "Uncategorized",
      };
    });

    return products;
  } catch (err: any) {
    console.error("Error fetching products:", err);
    return [];
  }
}
