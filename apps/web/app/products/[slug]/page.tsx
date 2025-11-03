import { fetchProduct } from "@repo/shared/products";

interface ProductPageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProduct(params.slug);

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <main className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

      <div className="flex flex-wrap gap-4">
        {product.detailMedia?.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`${product.title} detail`}
            className="w-80 h-auto rounded-md object-cover"
          />
        ))}
      </div>

      <p className="mt-4 text-gray-800">{product.description}</p>
      <p className="mt-2 font-medium">
        💰 {product.price?.toLocaleString("sv-SE")} kr
      </p>
      <p>{product.inStock ? "In stock" : "Out of stock"}</p>
      <p>Category: {product.category || "Uncategorized"}</p>
    </main>
  );
}
