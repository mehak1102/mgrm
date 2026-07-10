import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  User,
  Camera,
  Loader2,
  Trash2,
  ShoppingCart,
  Settings,
} from "lucide-react";
import OrdersSection from "./OrdersSection";
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

function SectionShell({ subtitle, dt, children }) {
  return (
    <section>
      {subtitle && <p className={`text-sm mb-5 ${dt.muted}`}>{subtitle}</p>}
      <div className={`rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 ${dt.card}`}>{children}</div>
    </section>
  );
}

function CompactStoryCard({ story, onDelete, dt, statusLabel, deleteLabel }) {
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
            {statusLabel(story.status)}
          </span>
        </div>
        <p className={`text-[10px] truncate ${dt.muted}`}>{story.productId?.name}</p>
        {story.recoveryDuration && (
          <p className={`text-[10px] ${dt.muted}`}>{story.recoveryDuration}</p>
        )}
        {["pending", "rejected"].includes(story.status) && (
          <button type="button" onClick={() => onDelete(story._id)} className="text-red-400 text-[10px] font-bold mt-1 flex items-center gap-1">
            <Trash2 size={10} /> {deleteLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default function DashboardSections({ dt, onRoute, section }) {
  const { t } = useTranslation();
  const statusLabel = (status) => t(`dashboard.status.${status}`, { defaultValue: status });
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isBlue } = useTheme();

  const [profile, setProfile] = useState(null);
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
      window.dispatchEvent(new Event("mgrm:profile-updated"));
      toast.success(t("dashboard.toast.profileUpdated"));
    } catch {
      toast.error(t("dashboard.toast.profileSaveFailed"));
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
      window.dispatchEvent(new Event("mgrm:profile-updated"));
      toast.success(t("dashboard.toast.photoUploaded"));
    } catch {
      toast.error(t("dashboard.toast.uploadFailed"));
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
      toast.success(t("dashboard.toast.addressAdded"));
    } catch {
      toast.error(t("dashboard.toast.addressFailed"));
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
      toast.error(t("dashboard.toast.uploadFailed"));
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
      toast.success(t("dashboard.toast.submittedReview"));
    } catch (err) {
      toast.error(err.response?.data?.msg || t("dashboard.toast.submitFailed"));
    }
  };

  const deleteStory = async (id) => {
    if (!confirm(t("dashboard.confirmDelete"))) return;
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
              {uploading ? "..." : t("dashboard.grid.photo")}
              <input type="file" accept="image/*" className="hidden" onChange={uploadProfileImage} />
            </label>
          </div>
          <input
            className={inputClass}
            value={profile.name || ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder={t("common.name")}
          />
          <input
            className={inputClass}
            value={profile.phone || ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            placeholder={t("common.phone")}
          />
          <button type="submit" className="btn-primary px-5 py-2.5 rounded-xl text-sm font-black">
            {t("common.save")}
          </button>
        </form>
      </SectionShell>
      )}

      {section === "addresses" && (
      <SectionShell dt={dt}>
        <form onSubmit={submitAddress} className="grid sm:grid-cols-2 gap-2 mb-4">
          {[
            ["label", t("dashboard.grid.label")],
            ["name", t("common.name")],
            ["phone", t("common.phone")],
            ["line1", t("dashboard.grid.address")],
            ["city", t("dashboard.grid.city")],
            ["pincode", t("dashboard.grid.pincode")],
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
            {t("dashboard.grid.addAddress")}
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

      {section === "orders" && <OrdersSection dt={dt} onRoute={onRoute} />}

      {section === "wishlist" && (
      <SectionShell dt={dt}>
        {validWishlist.length === 0 ? (
          <p className={`text-sm ${dt.muted}`}>{t("dashboard.grid.noWishlist")}</p>
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
                      <ShoppingCart size={10} className="inline" /> {t("dashboard.addCartShort")}
                    </button>
                    <button type="button" onClick={() => toggleWishlist(p)} className="text-[10px] font-bold text-red-400">
                      {t("dashboard.removeWishlist")}
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
      <SectionShell subtitle={t("dashboard.recoveryCompactSubtitle")} dt={dt}>
        <form onSubmit={submitStory} className="space-y-3 mb-4 pb-4 border-b border-white/10">
          <select
            required
            value={storyForm.productId}
            onChange={(e) => setStoryForm({ ...storyForm, productId: e.target.value })}
            className={inputClass}
          >
            <option value="">{t("dashboard.productUsed")}</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <input
            required
            placeholder={t("dashboard.storyTitle")}
            value={storyForm.title}
            onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
            className={inputClass}
          />
          <input
            placeholder={t("dashboard.recoveryDuration")}
            value={storyForm.recoveryDuration}
            onChange={(e) => setStoryForm({ ...storyForm, recoveryDuration: e.target.value })}
            className={inputClass}
          />
          <textarea
            placeholder={t("dashboard.yourStory")}
            value={storyForm.story}
            onChange={(e) => setStoryForm({ ...storyForm, story: e.target.value })}
            className={`${inputClass} min-h-20`}
          />
          <div className="flex gap-2 flex-wrap">
            {["beforeImage", "afterImage"].map((field) => (
              <label key={field} className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${dt.chip}`}>
                {storyUploading === field ? <Loader2 className="animate-spin inline" size={12} /> : null}
                {field === "beforeImage" ? t("common.before") : t("common.after")}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadStoryImage(e, field)} />
              </label>
            ))}
          </div>
          <button
            type="submit"
            disabled={!storyForm.beforeImage || !storyForm.afterImage}
            className="btn-primary px-5 py-2 rounded-xl text-sm font-black disabled:opacity-50"
          >
            {t("dashboard.submitStory")}
          </button>
        </form>
        <div className="grid sm:grid-cols-2 gap-2">
          {myStories.map((story) => (
            <CompactStoryCard
              key={story._id}
              story={story}
              onDelete={deleteStory}
              dt={dt}
              statusLabel={statusLabel}
              deleteLabel={t("common.delete")}
            />
          ))}
        </div>
      </SectionShell>
      )}

      {section === "settings" && (
      <SectionShell dt={dt}>
        <div className="flex items-center gap-3">
          <Settings size={18} className={dt.muted} />
          <span className={`text-sm ${dt.muted}`}>{t("dashboard.grid.theme")}</span>
          <ThemeSelector />
        </div>
        {user?.role === "admin" && (
          <Link to="/admin" className={`text-sm font-bold mt-4 inline-block ${dt.accent}`}>
            {t("dashboard.adminPanel")}
          </Link>
        )}
      </SectionShell>
      )}
    </>
  );
}
