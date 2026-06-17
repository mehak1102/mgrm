import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Camera,
  Loader2,
  Trash2,
  Download,
  ShoppingCart,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { productPriceSaleProps } from "../../utils/productPriceStyle";
import ThemeSelector from "../ThemeSelector";

const STATUS_LABELS = {
  pending: "Pending Review",
  approved: "Approved",
  published: "Published",
  rejected: "Rejected",
};

const orderStatusStyle = {
  Placed: "bg-blue-500/20 text-blue-200",
  Packed: "bg-amber-500/20 text-amber-200",
  Shipped: "bg-purple-500/20 text-purple-200",
  Delivered: "bg-emerald-500/20 text-emerald-200",
  Cancelled: "bg-red-500/20 text-red-200",
};

function downloadInvoice(order) {
  const html = `<!DOCTYPE html><html><head><title>Invoice</title></head><body style="font-family:sans-serif;padding:40px">
  <h1>MGRM Medicare Invoice</h1><p>Order #${order._id.slice(-6)}</p>
  <p>${new Date(order.createdAt).toLocaleString()}</p>
  <h3>Total: ₹${order.total}</h3></body></html>`;
  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
  w.print();
}

function SectionShell({ subtitle, dt, children }) {
  return (
    <section>
      {subtitle && <p className={`text-sm mb-5 ${dt.muted}`}>{subtitle}</p>}
      <div className={`rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 ${dt.card}`}>{children}</div>
    </section>
  );
}

function CompactStoryCard({ story, onDelete, dt }) {
  return (
    <div className={`rounded-xl p-3 flex gap-3 ${dt.chip}`}>
      <div className="flex gap-1 shrink-0">
        <img src={story.beforeImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
        <img src={story.afterImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-1">
          <p className={`text-xs font-black truncate ${dt.stat}`}>{story.title}</p>
          <span className={`text-[9px] font-bold shrink-0 ${dt.secondary || dt.muted}`}>
            {STATUS_LABELS[story.status]}
          </span>
        </div>
        <p className={`text-[10px] truncate ${dt.muted}`}>{story.productId?.name}</p>
        {story.recoveryDuration && (
          <p className={`text-[10px] ${dt.muted}`}>{story.recoveryDuration}</p>
        )}
        {["pending", "rejected"].includes(story.status) && (
          <button type="button" onClick={() => onDelete(story._id)} className="text-red-400 text-[10px] font-bold mt-1 flex items-center gap-1">
            <Trash2 size={10} /> Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default function DashboardSections({ dt, onRoute, section }) {
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isBlue } = useTheme();

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [myStories, setMyStories] = useState([]);
  const [products, setProducts] = useState([]);
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
  const inputClass =
    dt.input ||
    "w-full rounded-xl px-3 py-2.5 text-sm bg-black/10 border border-white/10 text-inherit";
  const secondaryText = dt.secondary || dt.muted;
  const subtleActionClass = dt.subtleAction || "text-brand hover:opacity-90";

  useEffect(() => {
    API.get("/users/me").then((r) => setProfile(r.data)).catch(() => {});
    API.get("/orders/my").then((r) => setOrders(r.data || [])).catch(() => {});
    API.get("/recovery-stories/my").then((r) => setMyStories(r.data.stories || [])).catch(() => {});
    API.get("/products").then((r) => setProducts(r.data.products || [])).catch(() => {});
  }, []);

  const validWishlist = useMemo(
    () => wishlist.filter((p) => p?._id && p?.name),
    [wishlist]
  );

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
      toast.success("Photo uploaded");
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
      const res = await API.get("/users/me");
      setProfile(res.data);
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
    const res = await API.get("/users/me");
    setProfile(res.data);
  };

  const setDefaultAddress = async (id) => {
    await API.put(`/users/me/addresses/${id}`, { isDefault: true });
    const res = await API.get("/users/me");
    setProfile(res.data);
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
      toast.error("Upload failed");
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
      const res = await API.get("/recovery-stories/my");
      setMyStories(res.data.stories || []);
      toast.success("Submitted for review");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Submit failed");
    }
  };

  const deleteStory = async (id) => {
    if (!confirm("Delete?")) return;
    await API.delete(`/recovery-stories/${id}`);
    const res = await API.get("/recovery-stories/my");
    setMyStories(res.data.stories || []);
  };

  if (!profile) {
    return <div className={`mt-10 h-40 rounded-2xl animate-pulse ${dt.card}`} />;
  }

  return (
    <>
      {section === "profile" && (
      <SectionShell subtitle={user?.email} dt={dt}>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-black/20 border border-white/10">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center">
                  <User size={24} className={dt.muted} />
                </div>
              )}
            </div>
            <label className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${dt.chip}`}>
              <Camera size={14} className="inline mr-1" />
              {uploading ? "..." : "Photo"}
              <input type="file" accept="image/*" className="hidden" onChange={uploadProfileImage} />
            </label>
          </div>
          <input
            className={inputClass}
            value={profile.name || ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Name"
          />
          <input
            className={inputClass}
            value={profile.phone || ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            placeholder="Phone"
          />
          <button type="submit" className="btn-primary px-5 py-2.5 rounded-xl text-sm font-black">
            Save
          </button>
        </form>
      </SectionShell>
      )}

      {section === "addresses" && (
      <SectionShell dt={dt}>
        <form onSubmit={submitAddress} className="grid sm:grid-cols-2 gap-2 mb-4">
          {[
            ["label", "Label"],
            ["name", "Name"],
            ["phone", "Phone"],
            ["line1", "Address"],
            ["city", "City"],
            ["pincode", "Pincode"],
          ].map(([key, ph]) => (
            <input
              key={key}
              required={key !== "label"}
              placeholder={ph}
              value={addressForm[key]}
              onChange={(e) => setAddressForm({ ...addressForm, [key]: e.target.value })}
              className={inputClass}
            />
          ))}
          <button type="submit" className="sm:col-span-2 btn-primary py-2.5 rounded-xl text-sm font-black">
            Add Address
          </button>
        </form>
        <div className="space-y-2">
          {(profile.addresses || []).map((addr) => (
            <div key={addr._id} className={`rounded-xl p-3 flex justify-between gap-2 ${dt.chip}`}>
              <div>
                <p className={`text-xs font-black ${dt.stat}`}>
                  {addr.label} {addr.isDefault && "• Default"}
                </p>
                <p className={`text-[10px] ${dt.muted}`}>
                  {addr.line1}, {addr.city} {addr.pincode}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                {!addr.isDefault && (
                  <button type="button" onClick={() => setDefaultAddress(addr._id)} className={`text-[10px] font-bold px-1 rounded ${subtleActionClass}`}>
                    Default
                  </button>
                )}
                <button type="button" onClick={() => deleteAddress(addr._id)} className="text-[10px] font-bold text-red-400">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>
      )}

      {section === "orders" && (
      <SectionShell dt={dt}>
        {orders.length === 0 ? (
          <p className={`text-sm ${dt.muted}`}>No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order._id} className={`rounded-xl p-3 ${dt.chip}`}>
                <div className="flex justify-between">
                  <p className={`text-xs font-black ${dt.stat}`}>#{order._id.slice(-6)}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${orderStatusStyle[order.status] || ""}`}>
                    {order.status}
                  </span>
                </div>
                <p className={`text-[10px] ${dt.muted}`}>{new Date(order.createdAt).toLocaleDateString()}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-sm font-black ${dt.stat}`}>₹{order.total}</span>
                  <button type="button" onClick={() => downloadInvoice(order)} className={`text-[10px] font-bold flex items-center gap-1 ${secondaryText}`}>
                    <Download size={12} /> Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionShell>
      )}

      {section === "wishlist" && (
      <SectionShell dt={dt}>
        {validWishlist.length === 0 ? (
          <p className={`text-sm ${dt.muted}`}>No saved products.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2">
            {validWishlist.map((p) => (
              <div key={p._id} className={`rounded-xl p-2 flex gap-2 ${dt.chip}`}>
                <img src={p.images?.[0] || "/products/knee.png"} alt="" className="w-14 h-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <button type="button" onClick={() => onRoute(`/product/${p.slug}`)} className={`text-xs font-black line-clamp-2 text-left ${dt.stat}`}>
                    {p.name}
                  </button>
                  <span {...productPriceSaleProps(isBlue, "text-[10px] font-black")}>₹{p.discountPrice || p.price}</span>
                  <div className="flex gap-2 mt-1">
                    <button type="button" onClick={() => addToCart(p)} className={`text-[10px] font-bold px-1 rounded ${subtleActionClass}`}>
                      <ShoppingCart size={10} className="inline" /> Add
                    </button>
                    <button type="button" onClick={() => toggleWishlist(p)} className="text-[10px] font-bold text-red-400">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionShell>
      )}

      {section === "recovery" && (
      <SectionShell subtitle="Compact submissions — reviewed before publish" dt={dt}>
        <form onSubmit={submitStory} className="space-y-3 mb-4 pb-4 border-b border-white/10">
          <select
            required
            value={storyForm.productId}
            onChange={(e) => setStoryForm({ ...storyForm, productId: e.target.value })}
            className={inputClass}
          >
            <option value="">Product used</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <input
            required
            placeholder="Title"
            value={storyForm.title}
            onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
            className={inputClass}
          />
          <input
            placeholder="Recovery duration"
            value={storyForm.recoveryDuration}
            onChange={(e) => setStoryForm({ ...storyForm, recoveryDuration: e.target.value })}
            className={inputClass}
          />
          <textarea
            placeholder="Your story"
            value={storyForm.story}
            onChange={(e) => setStoryForm({ ...storyForm, story: e.target.value })}
            className={`${inputClass} min-h-20`}
          />
          <div className="flex gap-2 flex-wrap">
            {["beforeImage", "afterImage"].map((field) => (
              <label key={field} className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${dt.chip}`}>
                {storyUploading === field ? <Loader2 className="animate-spin inline" size={12} /> : null}
                {field === "beforeImage" ? "Before" : "After"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadStoryImage(e, field)} />
              </label>
            ))}
          </div>
          <button
            type="submit"
            disabled={!storyForm.beforeImage || !storyForm.afterImage}
            className="btn-primary px-5 py-2 rounded-xl text-sm font-black disabled:opacity-50"
          >
            Submit
          </button>
        </form>
        <div className="grid sm:grid-cols-2 gap-2">
          {myStories.map((story) => (
            <CompactStoryCard key={story._id} story={story} onDelete={deleteStory} dt={dt} />
          ))}
        </div>
      </SectionShell>
      )}

      {section === "settings" && (
      <SectionShell dt={dt}>
        <div className="flex items-center gap-3">
          <Settings size={18} className={dt.muted} />
          <span className={`text-sm ${dt.muted}`}>Theme</span>
          <ThemeSelector />
        </div>
        {user?.role === "admin" && (
          <Link to="/admin" className={`text-sm font-bold mt-4 inline-block ${dt.accent}`}>
            Admin panel →
          </Link>
        )}
      </SectionShell>
      )}
    </>
  );
}
