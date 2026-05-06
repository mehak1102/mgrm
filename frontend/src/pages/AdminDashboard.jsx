import { useEffect, useMemo, useState } from "react";
import API from "../api";


const emptyForm = {
  name: "",
  category: "",
  bodyPart: "",
  activity: "",
  price: "",
  discountPrice: "",
  description: "",
  features: "",
  sizes: "",
  colors: "",
  stock: "",
  isFeatured: false,
  isBestSeller: false,
  images: [],
  
};

export default function AdminDashboard() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [supportMessages, setSupportMessages] = useState([]);

  const revenue = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders]
  );

  const loadData = async () => {
    const productRes = await API.get("/products");
    setProducts(productRes.data.products || []);

    try {
      const orderRes = await API.get("/orders");
      setOrders(orderRes.data || []);
    } catch {
      setOrders([]);
    }
  };

  const fetchSupportMessages = async () => {
  const res = await API.get("/support");
  setSupportMessages(res.data.messages || []);
};

  useEffect(() => {
    loadData();
    fetchSupportMessages();
  }, []);


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("image", file);

      const res = await API.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, res.data.url],
      }));
    } catch (err) {
      alert("Image upload failed. Check Cloudinary env.");
    } finally {
      setUploading(false);
    }
  };

  const submitProduct = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      features: form.features.split(",").map((x) => x.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map((x) => x.trim()).filter(Boolean),
      colors: form.colors.split(",").map((x) => x.trim()).filter(Boolean),
      images: form.images,
    };

    if (editId) {
      await API.put(`/products/${editId}`, payload);
    } else {
      await API.post("/products", payload);
    }

    setForm(emptyForm);
    setEditId(null);
    loadData();
  };

  const editProduct = (product) => {
    setEditId(product._id);
    setForm({
      name: product.name || "",
      category: product.category || "",
      bodyPart: product.bodyPart || "",
          activity: product.activity || "",
      price: product.price || "",
      discountPrice: product.discountPrice || "",
      description: product.description || "",
      features: product.features?.join(", ") || "",
      sizes: product.sizes?.join(", ") || "",
      colors: product.colors?.join(", ") || "",
      stock: product.stock || "",
      isFeatured: !!product.isFeatured,
      isBestSeller: !!product.isBestSeller,
      images: product.images || [],
  
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await API.delete(`/products/${id}`);
    loadData();
  };

  const updateStatus = async (id, status) => {
    await API.put(`/orders/${id}/status`, { status });
    loadData();
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="theme-section rounded-[36px] p-8 mb-8">
        <p className="theme-accent font-bold">ADMIN</p>
        <h1 className="text-5xl font-black">MGRM Control Panel</h1>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="card rounded-3xl p-6">
          <p className="text-gray-500">Products</p>
          <h2 className="text-3xl font-black">{products.length}</h2>
        </div>
        <div className="card rounded-3xl p-6">
          <p className="text-gray-500">Orders</p>
          <h2 className="text-3xl font-black">{orders.length}</h2>
        </div>
        <div className="card rounded-3xl p-6">
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-3xl font-black">₹{revenue}</h2>
        </div>
        <div className="card rounded-3xl p-6">
          <p className="text-gray-500">Upload</p>
          <h2 className="text-3xl font-black">Cloudinary</h2>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button onClick={() => setTab("products")} className={`px-5 py-3 rounded-2xl font-black ${tab === "products" ? "btn-primary" : "btn-soft"}`}>
          Products
        </button>
        <button onClick={() => setTab("orders")} className={`px-5 py-3 rounded-2xl font-black ${tab === "orders" ? "btn-primary" : "btn-soft"}`}>
          Orders
        </button>
      </div>

      {tab === "products" && (
        <>
          <form onSubmit={submitProduct} className="card rounded-[36px] p-8 mb-10">
            <h2 className="text-3xl font-black mb-6">
              {editId ? "Edit Product" : "Add Product"}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="theme-panel rounded-2xl px-4 py-4" />
              <input required placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="theme-panel rounded-2xl px-4 py-4" />
              <input placeholder="Body Part" value={form.bodyPart} onChange={(e) => setForm({ ...form, bodyPart: e.target.value })} className="theme-panel rounded-2xl px-4 py-4" />
              <select
  value={form.activity}
  onChange={(e) => setForm({ ...form, activity: e.target.value })}
  className="theme-panel rounded-2xl px-4 py-4"
>
  <option value="">No Activity</option>
  <option value="Aerobics">Aerobics</option>
  <option value="Athletics">Athletics</option>
  <option value="Badminton">Badminton</option>
  <option value="Basketball">Basketball</option>
  <option value="Cricket">Cricket</option>
  <option value="Cycling">Cycling</option>
  <option value="Football">Football</option>
  <option value="Golf">Golf</option>
  <option value="Gym">Gym</option>
  <option value="Running">Running</option>
  <option value="Tennis">Tennis</option>
  <option value="Volleyball">Volleyball</option>
  <option value="Walking">Walking</option>
  <option value="Yoga">Yoga</option>
  <option value="Sleep">Sleep</option>
  <option value="Office">Office</option>
</select>
              <input required placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="theme-panel rounded-2xl px-4 py-4" />
              <input required placeholder="Discount Price" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="theme-panel rounded-2xl px-4 py-4" />
              <input placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="theme-panel rounded-2xl px-4 py-4" />
              <input placeholder="Sizes comma separated: S, M, L" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="theme-panel rounded-2xl px-4 py-4" />
              <input placeholder="Colors comma separated" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} className="theme-panel rounded-2xl px-4 py-4" />
            </div>

            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="theme-panel rounded-2xl px-4 py-4 w-full mt-4 min-h-28" />

            <input placeholder="Features comma separated" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="theme-panel rounded-2xl px-4 py-4 w-full mt-4" />

            <div className="mt-5 flex gap-4 items-center">
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {uploading && <span className="font-bold">Uploading...</span>}
            </div>

            <div className="flex gap-3 flex-wrap mt-4">
              {form.images.map((img) => (
                <img key={img} src={img} className="w-24 h-24 rounded-2xl object-cover border" />
              ))}
            </div>

            <div className="flex gap-6 mt-5">
              <label className="font-bold">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured
              </label>
              <label className="font-bold">
                <input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} /> Best Seller
              </label>
            </div>

            <button className="btn-primary px-8 py-4 rounded-2xl font-black mt-6">
              {editId ? "Update Product" : "Add Product"}
            </button>
          </form>

          <div className="grid gap-4">
            {products.map((product) => (
              <div key={product._id} className="card rounded-3xl p-4 flex items-center gap-4">
                <img src={product.images?.[0] || "/products/knee.png"} className="w-20 h-20 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-black">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category} • ₹{product.discountPrice}</p>
                </div>
                <button onClick={() => editProduct(product)} className="btn-soft px-4 py-2 rounded-xl font-bold">Edit</button>
                <button onClick={() => deleteProduct(product._id)} className="text-red-500 font-bold">Delete</button>
              </div>
            ))}
          </div>
          <section className="mt-12">
  <h2 className="text-3xl font-black mb-5">Support Requests</h2>

  <div className="grid gap-4">
    {supportMessages.map((msg) => (
      <div
        key={msg._id}
        className="bg-white rounded-3xl p-5 shadow border border-slate-100"
      >
        <div className="flex justify-between gap-4">
          <div>
            <p className="font-black text-xl">{msg.name}</p>
            <p className="text-gray-500 text-sm">
              {msg.email || "No email"} • {msg.phone || "No phone"}
            </p>
          </div>

          <span className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-black h-fit">
            {msg.type}
          </span>
        </div>

        <p className="text-gray-700 mt-4">{msg.message}</p>

        <p className="text-xs text-gray-400 mt-3">
          {new Date(msg.createdAt).toLocaleString()}
        </p>
      </div>
    ))}
  </div>
</section>
        </>
      )}

      {tab === "orders" && (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order._id} className="card rounded-3xl p-6">
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="font-black">Order #{order._id}</h3>
                  <p className="text-sm text-gray-500">{order.userName} • {order.userEmail}</p>
                  <p className="font-black mt-2">₹{order.total}</p>
                </div>

                <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} className="theme-panel rounded-xl px-3 py-2 h-fit">
                  <option>Placed</option>
                  <option>Packed</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div className="mt-4 border-t pt-4">
                {order.items?.map((item) => (
                  <p key={`${item._id}-${item.selectedSize}`} className="text-sm">
                    {item.name} × {item.qty} — ₹{item.discountPrice * item.qty}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}