import { Link } from "react-router-dom";
import { mgrmCategories } from "../data/siteData";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white mt-20">
      <div className="max-w-7xl mx-auto px-5 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <h2 className="text-3xl font-black">MGRM Medicare</h2>
          <p className="text-slate-400 mt-4">
            Scientific supports for relief, recovery and rehabilitation.
          </p>
        </div>

        <div>
          <h3 className="font-black mb-4">Shop Categories</h3>
          <div className="grid gap-2 text-slate-300">
            {mgrmCategories.slice(0, 7).map((cat) => (
              <Link key={cat.name} to={`/shop?category=${cat.query}`}>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-black mb-4">Support</h3>
          <div className="grid gap-2 text-slate-300">
            <span>Size Guide</span>
            <span>WhatsApp Help</span>
            <span>Order Tracking</span>
            <span>Returns & Warranty</span>
          </div>
        </div>

        <div>
          <h3 className="font-black mb-4">Newsletter</h3>
          <p className="text-slate-400 mb-4">Get recovery tips and product updates.</p>
          <div className="flex bg-white rounded-xl p-1">
            <input className="flex-1 px-3 text-black outline-none" placeholder="Email" />
            <button className="btn-primary px-4 py-2 rounded-lg font-bold">Join</button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-5 text-center text-slate-500">
        © 2026 MGRM Medicare. All rights reserved.
      </div>
    </footer>
  );
}