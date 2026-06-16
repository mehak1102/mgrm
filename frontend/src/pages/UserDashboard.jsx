import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  User,
  MapPin,
  Package,
  Heart,
  HeartPulse,
  Camera,
  Loader2,
  Trash2,
  Download,
  ShoppingCart,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { productPriceSaleProps } from "../utils/productPriceStyle";
import FloatingMedicalBg from "../components/FloatingMedicalBg";
import BeforeAfterSlider from "../components/product/BeforeAfterSlider";

const TABS = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "recovery", label: "Recovery Stories", icon: HeartPulse },
];

const STATUS_LABELS = {
  pending: "Pending Review",
  approved: "Approved",
  published: "Published",
  rejected: "Rejected",
};

const orderStatusStyle = {
  Placed: "bg-blue-50 text-blue-700",
  Packed: "bg-amber-50 text-amber-800",
  Shipped: "bg-purple-50 text-purple-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700",
};

function downloadInvoice(order) {
  const html = `<!DOCTYPE html><html><head><title>Invoice #${order._id.slice(-6)}</title>
  <style>body{font-family:sans-serif;padding:40px;max-width:700px;margin:auto}h1{color:#4f46e5}
  table{width:100%;border-collapse:collapse;margin-top:20px}td,th{border:1px solid #ddd;padding:8px;text-align:left}
  </style></head><body>
  <h1>MGRM Medicare Invoice</h1>
  <p><strong>Order:</strong> #${order._id.slice(-6)}</p>
  <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
  <p><strong>Customer:</strong> ${order.userName} (${order.userEmail})</p>
  <table><tr><th>Item</th><th>Qty</th><th>Amount</th></tr>
  ${(order.items || []).map((i) => `<tr><td>${i.name}</td><td>${i.qty}</td><td>₹${(i.discountPrice || i.price) * i.qty}</td></tr>`).join("")}
  </table><h3>Total: ₹${order.total}</h3><p>Status: ${order.status}</p>
  </body></html>`;
  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
  w.print();
}

export default function UserDashboard() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "profile";
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isBlue } = useTheme();

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [myStories, setMyStories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [storyUploading, setStoryUploading] = useState("");
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });
  const [storyForm, setStoryForm] = useState({
    productId: "",
    title: "",
    story: "",
    recoveryDuration: "",
    beforeImage: "",
    afterImage: "",
  });

  const setTab = (id) => setParams({ tab: id });

  const loadProfile = async () => {
    const res = await API.get("/users/me");
    setProfile(res.data);
  };

  const loadOrders = async () => {
    const res = await API.get("/orders/my");
    setOrders(res.data || []);
  };

  const loadStories = async () => {
    const res = await API.get("/recovery-stories/my");
    setMyStories(res.data.stories || []);
  };

  const loadProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data.products || []);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await Promise.all([loadProfile(), loadOrders(), loadStories(), loadProducts()]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/users/me", {
        name: profile.name,
        phone: profile.phone,
        profileImage: profile.profileImage,
      });
      setProfile(res.data);
      toast.success("Profile updated");
    } catch {
      toast.error("Could not save profile");
    }
  };

  const uploadProfileImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await API.post("/upload/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile((p) => ({ ...p, profileImage: res.data.url }));
      toast.success("Photo uploaded — save profile to keep");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submitAddress = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users/me/addresses", addressForm);
      await loadProfile();
      setAddressForm({
        label: "Home",
        name: "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
      toast.success("Address added");
    } catch {
      toast.error("Could not add address");
    }
  };

  const deleteAddress = async (id) => {
    await API.delete(`/users/me/addresses/${id}`);
    await loadProfile();
    toast.success("Address removed");
  };

  const setDefaultAddress = async (id) => {
    await API.put(`/users/me/addresses/${id}`, { isDefault: true });
    await loadProfile();
  };

  const uploadStoryImage = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStoryUploading(field);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await API.post("/upload/recovery-user", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStoryForm((p) => ({ ...p, [field]: res.data.url }));
    } catch {
      toast.error("Image upload failed");
    } finally {
      setStoryUploading("");
    }
  };

  const submitStory = async (e) => {
    e.preventDefault();
    try {
      await API.post("/recovery-stories", storyForm);
      setStoryForm({
        productId: "",
        title: "",
        story: "",
        recoveryDuration: "",
        beforeImage: "",
        afterImage: "",
      });
      await loadStories();
      toast.success("Story submitted for review");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Could not submit story");
    }
  };

  const deleteStory = async (id) => {
    if (!confirm("Delete this story?")) return;
    await API.delete(`/recovery-stories/${id}`);
    await loadStories();
    toast.success("Story deleted");
  };

  const validWishlist = useMemo(
    () => wishlist.filter((p) => p?._id && p?.name),
    [wishlist]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-app p-10">
        <div className="max-w-6xl mx-auto h-64 card rounded-3xl animate-pulse" />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-app dark:bg-zinc-950">
      <FloatingMedicalBg />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
        <p className="text-brand font-black tracking-widest text-sm">MY ACCOUNT</p>
        <h1 className="text-4xl font-black text-fg mt-1">Dashboard</h1>
        <p className="text-fg-muted mt-1">Welcome back, {user?.name || profile?.name}</p>

        <div className="mt-8 flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-56 shrink-0">
            <nav className="card rounded-2xl p-3 space-y-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                    tab === id ? "bg-purple-600 text-white" : "text-fg hover:bg-surface-hover"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 min-w-0">
            {tab === "profile" && profile && (
              <form onSubmit={saveProfile} className="card rounded-2xl p-6 space-y-5">
                <h2 className="text-xl font-black text-fg">My Profile</h2>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-surface-hover border border-edge">
                    {profile.profileImage ? (
                      <img src={profile.profileImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-fg-muted">
                        <User size={32} />
                      </div>
                    )}
                  </div>
                  <label className="btn-soft px-4 py-2 rounded-xl font-bold text-sm cursor-pointer flex items-center gap-2">
                    <Camera size={16} />
                    {uploading ? "Uploading..." : "Change photo"}
                    <input type="file" accept="image/*" className="hidden" onChange={uploadProfileImage} />
                  </label>
                </div>
                <input
                  className="theme-panel w-full rounded-xl px-4 py-3 text-fg"
                  value={profile.name || ""}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Name"
                />
                <input
                  className="theme-panel w-full rounded-xl px-4 py-3 text-fg opacity-70"
                  value={profile.email || ""}
                  disabled
                />
                <input
                  className="theme-panel w-full rounded-xl px-4 py-3 text-fg"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="Phone"
                />
                <button type="submit" className="btn-primary px-6 py-3 rounded-xl font-black">
                  Save Profile
                </button>
              </form>
            )}

            {tab === "addresses" && (
              <div className="space-y-6">
                <form onSubmit={submitAddress} className="card rounded-2xl p-6 space-y-3">
                  <h2 className="text-xl font-black text-fg mb-2">Add Address</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      ["label", "Label (Home/Work)"],
                      ["name", "Full name"],
                      ["phone", "Phone"],
                      ["line1", "Address line 1"],
                      ["line2", "Address line 2"],
                      ["city", "City"],
                      ["state", "State"],
                      ["pincode", "Pincode"],
                    ].map(([key, ph]) => (
                      <input
                        key={key}
                        required={!["line2", "state"].includes(key)}
                        className="theme-panel rounded-xl px-4 py-3 text-fg"
                        placeholder={ph}
                        value={addressForm[key]}
                        onChange={(e) => setAddressForm({ ...addressForm, [key]: e.target.value })}
                      />
                    ))}
                  </div>
                  <label className="flex items-center gap-2 text-sm font-bold text-fg">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    />
                    Set as default
                  </label>
                  <button type="submit" className="btn-primary px-6 py-3 rounded-xl font-black">
                    Add Address
                  </button>
                </form>

                <div className="grid gap-3">
                  {(profile?.addresses || []).map((addr) => (
                    <div key={addr._id} className="card rounded-2xl p-5 flex justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-black text-fg">{addr.label}</p>
                          {addr.isDefault && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-fg-muted mt-1">
                          {addr.name}, {addr.line1}
                          {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city} {addr.pincode}
                        </p>
                        <p className="text-xs text-fg-muted">{addr.phone}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => setDefaultAddress(addr._id)}
                            className="btn-soft text-xs px-3 py-1.5 rounded-lg font-bold"
                          >
                            Make default
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteAddress(addr._id)}
                          className="text-red-500 text-xs font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "orders" && (
              <div className="space-y-4">
                <h2 className="text-xl font-black text-fg">Order History</h2>
                {orders.length === 0 ? (
                  <div className="card rounded-2xl p-8 text-center text-fg-muted">No orders yet.</div>
                ) : (
                  orders.map((order) => (
                    <div key={order._id} className="card rounded-2xl p-5">
                      <div className="flex flex-wrap justify-between gap-3">
                        <div>
                          <p className="font-black text-fg">Order #{order._id.slice(-6)}</p>
                          <p className="text-xs text-fg-muted">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full h-fit ${orderStatusStyle[order.status] || ""}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="mt-3 space-y-1">
                        {order.items?.map((item) => (
                          <p key={`${item._id}-${item.selectedSize}`} className="text-sm text-fg-muted">
                            {item.name} × {item.qty} — ₹{(item.discountPrice || item.price) * item.qty}
                          </p>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-edge">
                        <p className="font-black text-fg">₹{order.total}</p>
                        <button
                          type="button"
                          onClick={() => downloadInvoice(order)}
                          className="btn-soft px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                        >
                          <Download size={16} /> Invoice
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === "wishlist" && (
              <div>
                <h2 className="text-xl font-black text-fg mb-4">Wishlist ({validWishlist.length})</h2>
                {validWishlist.length === 0 ? (
                  <div className="card rounded-2xl p-8 text-center">
                    <p className="text-fg-muted">No saved products.</p>
                    <Link to="/shop" className="text-brand font-bold mt-2 inline-block">
                      Browse shop
                    </Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {validWishlist.map((p) => (
                      <div key={p._id} className="card rounded-2xl p-4 flex gap-4">
                        <img
                          src={p.images?.[0] || "/products/knee.png"}
                          alt=""
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${p.slug}`} className="font-black text-fg line-clamp-2 hover:text-brand">
                            {p.name}
                          </Link>
                          <span {...productPriceSaleProps(isBlue, "text-sm font-black block mt-1")}>
                            ₹{p.discountPrice || p.price}
                          </span>
                          <div className="flex gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => addToCart(p)}
                              className="text-xs font-bold text-purple-600 flex items-center gap-1"
                            >
                              <ShoppingCart size={14} /> Add
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleWishlist(p)}
                              className="text-xs font-bold text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "recovery" && (
              <div className="space-y-6">
                <form onSubmit={submitStory} className="card rounded-2xl p-6 space-y-4">
                  <h2 className="text-xl font-black text-fg">Share Your Recovery Story</h2>
                  <p className="text-sm text-fg-muted">
                    Submit before/after photos and your journey. Stories are reviewed before publishing.
                  </p>
                  <select
                    required
                    value={storyForm.productId}
                    onChange={(e) => setStoryForm({ ...storyForm, productId: e.target.value })}
                    className="theme-panel w-full rounded-xl px-4 py-3 text-fg"
                  >
                    <option value="">Select product used</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <input
                    required
                    placeholder="Story title"
                    value={storyForm.title}
                    onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                    className="theme-panel w-full rounded-xl px-4 py-3 text-fg"
                  />
                  <input
                    placeholder="Recovery duration (e.g. 6 weeks)"
                    value={storyForm.recoveryDuration}
                    onChange={(e) => setStoryForm({ ...storyForm, recoveryDuration: e.target.value })}
                    className="theme-panel w-full rounded-xl px-4 py-3 text-fg"
                  />
                  <textarea
                    placeholder="Tell your recovery story..."
                    value={storyForm.story}
                    onChange={(e) => setStoryForm({ ...storyForm, story: e.target.value })}
                    className="theme-panel w-full rounded-xl px-4 py-3 text-fg min-h-24"
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    {["beforeImage", "afterImage"].map((field) => (
                      <div key={field}>
                        <p className="text-sm font-bold text-fg mb-2 capitalize">
                          {field === "beforeImage" ? "Before" : "After"} image
                        </p>
                        <label className="btn-soft px-4 py-2 rounded-xl text-sm font-bold cursor-pointer inline-flex items-center gap-2">
                          {storyUploading === field ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Camera size={16} />
                          )}
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => uploadStoryImage(e, field)}
                          />
                        </label>
                        {storyForm[field] && (
                          <img src={storyForm[field]} alt="" className="mt-2 w-full h-32 object-cover rounded-xl" />
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={!storyForm.beforeImage || !storyForm.afterImage}
                    className="btn-primary px-6 py-3 rounded-xl font-black disabled:opacity-50"
                  >
                    Submit for Review
                  </button>
                </form>

                <div>
                  <h3 className="font-black text-fg mb-3">My Submissions</h3>
                  {myStories.length === 0 ? (
                    <p className="text-fg-muted text-sm">No stories submitted yet.</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {myStories.map((story) => (
                        <div key={story._id} className="card rounded-2xl overflow-hidden">
                          <BeforeAfterSlider
                            beforeImage={story.beforeImage}
                            afterImage={story.afterImage}
                            compact
                          />
                          <div className="p-4">
                            <div className="flex justify-between gap-2">
                              <p className="font-black text-sm text-fg">{story.title}</p>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-fg-muted shrink-0">
                                {STATUS_LABELS[story.status]}
                              </span>
                            </div>
                            <p className="text-xs text-fg-muted mt-1">{story.productId?.name}</p>
                            {["pending", "rejected"].includes(story.status) && (
                              <button
                                type="button"
                                onClick={() => deleteStory(story._id)}
                                className="text-red-500 text-xs font-bold mt-2 flex items-center gap-1"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
