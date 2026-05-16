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

  const orderStatusStyle = {
    Placed: "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    Packed: "bg-amber-50 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
    Shipped: "bg-purple-50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
    Delivered: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    Cancelled: "bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 transition-colors duration-300">
      <div className="theme-section rounded-[36px] p-8 mb-8">
        <p className="theme-accent font-bold">ADMIN</p>
        <h1 className="text-5xl font-black text-slate-900 dark:text-white">MGRM Control Panel</h1>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="card rounded-3xl p-6 transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400">Products</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{products.length}</h2>
        </div>
        <div className="card rounded-3xl p-6 transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400">Orders</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{orders.length}</h2>
        </div>
        <div className="card rounded-3xl p-6 transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400">Revenue</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">₹{revenue}</h2>
        </div>
        <div className="card rounded-3xl p-6 transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400">Upload</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Cloudinary</h2>
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
          <form onSubmit={submitProduct} className="card rounded-[36px] p-8 mb-10 transition-colors duration-300">
            <h2 className="text-3xl font-black mb-6 text-slate-900 dark:text-white">
              {editId ? "Edit Product" : "Add Product"}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="theme-panel rounded-2xl px-4 py-4 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-colors duration-300" />
              <input required placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="theme-panel rounded-2xl px-4 py-4 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-colors duration-300" />
              <input placeholder="Body Part" value={form.bodyPart} onChange={(e) => setForm({ ...form, bodyPart: e.target.value })} className="theme-panel rounded-2xl px-4 py-4 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-colors duration-300" />
              <select
  value={form.activity}
  onChange={(e) => setForm({ ...form, activity: e.target.value })}
  className="theme-panel rounded-2xl px-4 py-4 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-colors duration-300"
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
              <input required placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="theme-panel rounded-2xl px-4 py-4 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-colors duration-300" />
              <input required placeholder="Discount Price" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="theme-panel rounded-2xl px-4 py-4 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-colors duration-300" />
              <input placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="theme-panel rounded-2xl px-4 py-4 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-colors duration-300" />
              <input placeholder="Sizes comma separated: S, M, L" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="theme-panel rounded-2xl px-4 py-4 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-colors duration-300" />
              <input placeholder="Colors comma separated" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} className="theme-panel rounded-2xl px-4 py-4 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-colors duration-300" />
            </div>

            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="theme-panel rounded-2xl px-4 py-4 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-colors duration-300 w-full mt-4 min-h-28" />

            <input placeholder="Features comma separated" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="theme-panel rounded-2xl px-4 py-4 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-colors duration-300 w-full mt-4" />

            <div className="mt-5 flex gap-4 items-center">
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {uploading && <span className="font-bold text-slate-700 dark:text-gray-300">Uploading...</span>}
            </div>

            <div className="flex gap-3 flex-wrap mt-4">
              {form.images.map((img) => (
                <img key={img} src={img} className="w-24 h-24 rounded-2xl object-cover border border-slate-200 dark:border-white/10" />
              ))}
            </div>

            <div className="flex gap-6 mt-5">
              <label className="font-bold text-slate-800 dark:text-gray-200 flex items-center gap-2">
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
              <div key={product._id} className="card rounded-3xl p-4 flex items-center gap-4 transition-colors duration-300">
                <img src={product.images?.[0] || "/products/knee.png"} className="w-20 h-20 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-black text-slate-900 dark:text-white">{product.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">{product.category} • ₹{product.discountPrice}</p>
                </div>
                <button onClick={() => editProduct(product)} className="btn-soft px-4 py-2 rounded-xl font-bold">Edit</button>
                <button onClick={() => deleteProduct(product._id)} className="text-red-500 font-bold">Delete</button>
              </div>
            ))}
          </div>
          <section className="mt-12">
  <h2 className="text-3xl font-black mb-5 text-slate-900 dark:text-white">Support Requests</h2>

  <div className="grid gap-4">
    {supportMessages.map((msg) => (
      <div
        key={msg._id}
        className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow border border-slate-100 dark:border-white/10 transition-colors duration-300"
      >
        <div className="flex justify-between gap-4">
          <div>
            <p className="font-black text-xl text-slate-900 dark:text-white">{msg.name}</p>
            <p className="text-gray-500 dark:text-zinc-400 text-sm">
              {msg.email || "No email"} • {msg.phone || "No phone"}
            </p>
          </div>

          <span className="bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-black h-fit">
            {msg.type}
          </span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mt-4">{msg.message}</p>

        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-3">
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
            <div key={order._id} className="card rounded-3xl p-6 transition-colors duration-300">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-slate-900 dark:text-white">Order #{order._id.slice(-6)}</h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${orderStatusStyle[order.status] || orderStatusStyle.Placed}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">{order.userName} • {order.userEmail}</p>
                  <p className="font-black mt-2 text-slate-900 dark:text-white">₹{order.total}</p>
                </div>

                <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} className="theme-panel rounded-xl px-3 py-2 h-fit text-slate-900 dark:text-white border border-slate-200 dark:border-white/10">
                  <option>Placed</option>
                  <option>Packed</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div className="mt-4 border-t border-slate-200 dark:border-white/10 pt-4 text-slate-700 dark:text-zinc-300">
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