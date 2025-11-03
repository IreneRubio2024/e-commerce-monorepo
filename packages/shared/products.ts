export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  inStock: boolean;
  slug: string;
  media: string[];
};

const API_URL = "http://localhost:1337/api/products?populate=*"; // update with your Strapi host

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error(`Failed to fetch products. Status: ${res.status}`);
    }

    const json = await res.json();

    const products: Product[] = (json.data || []).map((item: any) => {
      const attrs = item.attributes ?? item;

      const mediaUrls: string[] =
        attrs.media
          ?.map((m: any) =>
            m?.url
              ? m.url.startsWith("http")
                ? m.url
                : `http://localhost:1337${m.url}`
              : ""
          )
          .filter(Boolean) || [];

      return {
        id: item.id,
        title: attrs.title || "No title",
        description: attrs.description || "",
        price: attrs.price || 0,
        inStock: attrs.inStock ?? false,
        slug: attrs.slug || "",
        media: mediaUrls,
      };
    });

    return products;
  } catch (err: any) {
    console.error("Error fetching products:", err);
    return [];
  }
}
