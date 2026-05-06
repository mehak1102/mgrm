import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const order = JSON.parse(localStorage.getItem("mgrm_last_order") || "null");

  return (
    <main className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="card rounded-[40px] p-10">
        <CheckCircle className="mx-auto text-green-500" size={70} />
        <h1 className="text-5xl font-black mt-5">Order Placed Successfully</h1>

        {order && (
          <>
            <p className="text-gray-600 mt-4">Order ID: {order.id}</p>
            <p className="text-3xl font-black mt-4">₹{order.total}</p>
            <p className="text-gray-500 mt-2">{order.status}</p>
          </>
        )}

        <Link to="/shop" className="btn-primary inline-flex mt-8 px-8 py-4 rounded-full font-black">
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}