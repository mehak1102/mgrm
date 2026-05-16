import { useEffect, useState } from "react";
import API from "../api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders/my")
      .then((res) => setOrders(res.data || []))
      .catch(() => setOrders([]));
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="theme-section rounded-[36px] p-8 mb-8">
        <p className="theme-accent font-bold">MY ORDERS</p>
        <h1 className="text-5xl font-black">Order History</h1>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order._id} className="card rounded-3xl p-6">
            <div className="flex justify-between">
              <div>
                <h3 className="font-black">Order #{order._id}</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <span className="btn-soft px-4 py-2 rounded-full font-bold h-fit">
                {order.status}
              </span>
            </div>

            <p className="text-2xl font-black mt-4">₹{order.total}</p>
          </div>
        ))}

        {!orders.length && <div className="card rounded-3xl p-10 text-center">No orders yet.</div>}
      </div>
    </main>
  );
}