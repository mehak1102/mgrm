import { useState } from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Send,
  CheckCircle2,
} from "lucide-react";
import API from "../api";
import FloatingMedicalBg from "../components/FloatingMedicalBg";

const supportTypes = [
  "Product Help",
  "Size Guide",
  "Order Help",
  "Return Request",
  "Bulk Inquiry",
  "Other",
];

export default function Support() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Product Help",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const submitSupport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      await API.post("/support", form);

      setSuccess("Your request has been submitted. Our team will contact you soon.");

      setForm({
        name: "",
        email: "",
        phone: "",
        type: "Product Help",
        message: "",
      });
    } catch (err) {
      alert(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative bg-[#f6f7fb] dark:bg-zinc-950 min-h-screen overflow-hidden">
      <FloatingMedicalBg />

      <div className="relative z-10">

        {/* HERO + FORM */}
        <section className="relative py-20">
          <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">

            {/* LEFT */}
            <div>
              <p className="text-purple-700 font-black tracking-widest">
                CUSTOMER SUPPORT
              </p>

              <h1 className="text-6xl md:text-8xl font-black mt-4 leading-[0.95]">
                Need help choosing the right support?
              </h1>

              <p className="text-gray-600 dark:text-zinc-300 text-lg mt-6 max-w-2xl">
                Ask us about product selection, sizing, orders, returns or bulk queries.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                {[
                  ["Certified Products", ShieldCheck],
                  ["Size Assistance", Ruler],
                  ["Fast Support", MessageCircle],
                ].map(([title, Icon]) => (
                  <div key={title} className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow">
                    <Icon className="text-purple-700" />
                    <p className="font-black mt-3">{title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FORM */}
            <form
              id="support-form"
              onSubmit={submitSupport}
              className="bg-white dark:bg-zinc-900 rounded-[38px] p-8 shadow-xl"
            >
              <h2 className="text-3xl font-black mb-4">Contact Support</h2>

              {success && (
                <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-xl">
                  {success}
                </div>
              )}

              <input
                required
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mb-3 px-4 py-3 rounded-xl border"
              />

              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full mb-3 px-4 py-3 rounded-xl border"
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full mb-3 px-4 py-3 rounded-xl border"
              />

              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full mb-3 px-4 py-3 rounded-xl border"
              >
                {supportTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>

              <textarea
                required
                rows="4"
                placeholder="Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full mb-4 px-4 py-3 rounded-xl border"
              />

              <button className="w-full bg-purple-700 text-white py-3 rounded-xl font-bold">
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </section>

        {/* ACTION CARDS */}
        <section className="max-w-7xl mx-auto px-5 pb-20">
          <div className="grid md:grid-cols-3 gap-6">

            {[
              {
                title: "WhatsApp Support",
                text: "Chat instantly",
                icon: MessageCircle,
                action: "Open WhatsApp",
                onClick: () =>
                  window.open("https://wa.me/919876543210", "_blank"),
              },
              {
                title: "Call Support",
                text: "Talk directly",
                icon: Phone,
                action: "Call Now",
                onClick: () =>
                  (window.location.href = "tel:+919876543210"),
              },
              {
                title: "Email Support",
                text: "Send query",
                icon: Mail,
                action: "Send Email",
                onClick: () =>
                  (window.location.href =
                    "mailto:support@mgrmmedicare.com"),
              },
              {
                title: "Size Guide",
                text: "Get help",
                icon: Ruler,
                action: "Open Form",
                onClick: () =>
                  document.getElementById("support-form")?.scrollIntoView({ behavior: "smooth" }),
              },
              {
                title: "Shipping",
                text: "Delivery help",
                icon: Truck,
                action: "Open Form",
                onClick: () =>
                  document.getElementById("support-form")?.scrollIntoView({ behavior: "smooth" }),
              },
              {
                title: "Returns",
                text: "Replacement help",
                icon: RotateCcw,
                action: "Open Form",
                onClick: () =>
                  document.getElementById("support-form")?.scrollIntoView({ behavior: "smooth" }),
              },
            ].map((item) => (
              <div key={item.title} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow">
                <item.icon className="text-purple-700" />
                <h3 className="font-black mt-4">{item.title}</h3>
                <p className="text-gray-500 dark:text-zinc-400 mt-2">{item.text}</p>

                <button
                  onClick={item.onClick}
                  className="mt-4 text-purple-700 font-bold"
                >
                  {item.action} →
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}