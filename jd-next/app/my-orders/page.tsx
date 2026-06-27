"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  product_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  payment_method: string;
  order_status: string;
  farmer_name: string;
  farmer_phone: string;
  delivery_address: string;
  created_at: string;
}

const STATUS_STYLE: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending:   "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  delivered: "bg-blue-100 text-blue-700",
};

const PAY_LABEL: Record<string, string> = {
  cod:  "Cash on Delivery",
  upi:  "UPI Paid",
  card: "Card Paid",
};

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName]       = useState("");

  useEffect(() => {
    const role = localStorage.getItem("jd_role");
    const uid  = localStorage.getItem("jd_user_id");
    if (!uid || role !== "consumer") {
      router.push("/auth/login");
      return;
    }
    setName(localStorage.getItem("jd_name") || "Customer");
    fetch(`/api/orders?customer_id=${encodeURIComponent(uid)}`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Order[]) => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  const totalSpent = orders.reduce((s, o) => s + Number(o.total_price), 0);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">
      <p>Loading your orders...</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome, {name}</p>
        </div>
        <Link href="/fresh-harvest" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">
          + Shop More
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          <p className="text-xs text-gray-500">Total Orders</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-green-700">Rs{totalSpent.toFixed(0)}</p>
          <p className="text-xs text-gray-500">Total Spent</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">
            {orders.filter(o => o.order_status === "confirmed").length}
          </p>
          <p className="text-xs text-gray-500">Active Orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-400">
          <p className="text-5xl mb-4">🛒</p>
          <p className="font-medium text-gray-600">No orders yet</p>
          <p className="text-sm mt-1">Browse fresh produce from Telangana farmers</p>
          <Link href="/fresh-harvest" className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">
            Browse Fresh Harvest
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLE[o.order_status] || "bg-gray-100 text-gray-500"}`}>
                    {o.order_status.charAt(0).toUpperCase() + o.order_status.slice(1)}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</span>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  {PAY_LABEL[o.payment_method] || o.payment_method}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{o.product_name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {o.quantity} {o.unit} x Rs{Number(o.unit_price).toFixed(2)}
                    </p>
                    {o.delivery_address && (
                      <p className="text-xs text-gray-400 mt-1">📦 {o.delivery_address}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-green-700">Rs{Number(o.total_price).toFixed(0)}</p>
                  </div>
                </div>
                {o.farmer_name && (
                  <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">
                        {o.farmer_name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700">{o.farmer_name}</p>
                        <p className="text-xs text-gray-400">Farmer</p>
                      </div>
                    </div>
                    {o.farmer_phone && (
                      <a href={`tel:${o.farmer_phone}`}
                        className="text-xs bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg font-medium hover:bg-green-100">
                        Call Farmer
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/fresh-harvest" className="text-green-600 text-sm hover:underline">← Continue Shopping</Link>
      </div>
    </div>
  );
}
