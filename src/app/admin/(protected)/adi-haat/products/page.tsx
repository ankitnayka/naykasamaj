import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Artisan from "@/models/Artisan";
import ProductManager from "../ProductManager";
import Link from "next/link";

export default async function ManageProducts() {
  await connectDB();
  
  // Fetch products with populated artisan info
  const products = await Product.find().populate("artisanId", "name").sort({ createdAt: -1 });
  const artisans = await Artisan.find({}, "name").sort({ name: 1 });
  
  // Transform to plain objects for client component
  const plainProducts = products.map(p => ({
    _id: p._id.toString(),
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    artisanId: p.artisanId ? { _id: p.artisanId._id.toString(), name: p.artisanId.name } : null,
    images: p.images || [],
    inStock: p.inStock
  }));

  const plainArtisans = artisans.map(a => ({
    _id: a._id.toString(),
    name: a.name
  }));

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/admin/adi-haat" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.9rem" }}>← Back to Adi Haat Hub</Link>
      </div>
      <ProductManager initialProducts={plainProducts as any} artisans={plainArtisans} />
    </div>
  );
}
