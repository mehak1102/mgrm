import { useEffect, useState } from "react";
import API from "../api";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    discountPrice: "",
    category: "",
    image: "",
    
  });

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();

    await API.post("/products", {
      ...form,
      images: [form.image],
    });

    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <main className="p-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-black mb-6">Admin Panel</h1>

      {/* ADD PRODUCT */}
      <form onSubmit={addProduct} className="card p-6 mb-10 rounded-2xl">
        <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})} />
        <input placeholder="Price" onChange={(e)=>setForm({...form,price:e.target.value})} />
        <input placeholder="Discount Price" onChange={(e)=>setForm({...form,discountPrice:e.target.value})} />
        <input placeholder="Category" onChange={(e)=>setForm({...form,category:e.target.value})} />
        <input placeholder="Image URL" onChange={(e)=>setForm({...form,image:e.target.value})} />

        <button className="btn-primary mt-4 px-5 py-2 rounded">Add Product</button>
      </form>

      {/* LIST */}
      <div className="grid gap-4">
        {products.map((p) => (
          <div key={p._id} className="card p-4 flex justify-between items-center">
            <span>{p.name}</span>
            <button onClick={() => deleteProduct(p._id)} className="text-red-500">
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}