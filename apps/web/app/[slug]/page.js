async function fetchProduct(slug) {
  const res = await fetch(
    `http://localhost:1337/api/products?filters[slug][$eq]=${slug}&populate=*`,
    { next: { revalidate: 60 } }
  );
  const json = await res.json();
  const item = json.data?.[0];

  if (!item) return null;

  const attrs = item;
  const mediaField = attrs.media?.data ?? attrs.media ?? [];

  const mediaUrls = Array.isArray(mediaField)
    ? mediaField
        .map((m) => {
          const url = m?.attributes?.url ?? m?.url;
          return url
            ? url.startsWith("http")
              ? url
              : `http://localhost:1337${url}`
            : null;
        })
        .filter(Boolean)
    : [];
  const detailMediaField = attrs.detailMedia ?? [];

  const detailMediaUrls = Array.isArray(detailMediaField)
    ? detailMediaField
        .map((m) => {
          const url = m?.url;
          return url
            ? url.startsWith("http")
              ? url
              : `http://localhost:1337${url}`
            : null;
        })
        .filter(Boolean)
    : [];

  return {
    title: attrs.title,
    description: attrs.description,
    price: attrs.price,
    inStock: attrs.inStock,
    category: attrs.category,
    media: mediaUrls,
    detailMedia: detailMediaUrls,
  };
}

export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.slug);

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <main>
      <h1>{product.title}</h1>

      <div>
        {product.detailMedia?.map((img, i) => (
          <div key={i}>
            <img
              src={img}
              alt={`${product.title} detail`}
              width={400}
              height={450}
            />
          </div>
        ))}
      </div>

      <p>{product.description}</p>
      <p>💰 {product.price.toLocaleString("sv-SE")} kr</p>
      <p>{product.inStock ? "In stock" : "Out of stock"}</p>
      <p>Category: {product.category || "Uncategorized"}</p>
    </main>
  );
}
