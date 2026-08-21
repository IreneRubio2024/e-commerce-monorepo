export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  inStock: boolean;
  slug: string;
  media: string[];
  detailMedia: string[];
  category: string;
};

const STRAPI_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:1337";

const API_URL = `${STRAPI_URL}/api/products?populate=*`;

// Free-tier hosts (e.g. Render) spin down after inactivity and can take
// 20-50s to wake back up, so retry a few times instead of giving up on the
// first slow/failed request.
async function fetchWithRetry(
  url: string,
  { retries = 4, timeoutMs = 15000, delayMs = 4000 } = {}
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (res.ok) return res;
      lastError = new Error(`Request failed with status ${res.status}`);
    } catch (err) {
      lastError = err;
    } finally {
      clearTimeout(timer);
    }
    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetchWithRetry(API_URL);

    const json = await res.json();

    const products: Product[] = (json.data || []).map((item: any) => {
      const mediaUrls: string[] = (item.media ?? [])
        .map((m: any) => {
          const url = m?.url;
          return url
            ? url.startsWith("http")
              ? url
              : `${STRAPI_URL}${url}`
            : null;
        })
        .filter(Boolean) as string[];

      const detailUrls: string[] = (item.detailMedia ?? [])
        .map((m: any) => {
          const url = m?.url;
          return url
            ? url.startsWith("http")
              ? url
              : `${STRAPI_URL}${url}`
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

export async function fetchProduct(slug: string): Promise<Product | null> {
  const res = await fetchWithRetry(
    `${STRAPI_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`
  );

  const json = await res.json();
  const item = json.data?.[0];
  if (!item) return null;

  const attrs = item.attributes ?? item;
  const mediaField = attrs.media?.data ?? attrs.media ?? [];
  const detailMediaField = attrs.detailMedia?.data ?? attrs.detailMedia ?? [];

  const toUrls = (field: any[]) =>
    Array.isArray(field)
      ? field
          .map((m) => {
            const url = m?.attributes?.url ?? m?.url;
            return url
              ? url.startsWith("http")
                ? url
                : `${STRAPI_URL}${url}`
              : null;
          })
          .filter(Boolean)
      : [];

  return {
    id: item.id,
    slug: attrs.slug,
    title: attrs.title,
    description: attrs.description,
    price: attrs.price,
    inStock: attrs.inStock,
    category: attrs.category,
    media: toUrls(mediaField),
    detailMedia: toUrls(detailMediaField),
  };
}
