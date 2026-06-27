"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CartItem {
  id: string; name: string; image: string;
  price: number; unit: string; farmer: string;
  district: string; qty: number; farmer_id?: string;
}

const UPI_ID = "jeevadhara@okicici";  // change to real UPI ID before go-live

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems]           = useState<CartItem[]>([]);
  const [step, setStep]             = useState<"details" | "payment">("details");
  const [payMethod, setPayMethod]   = useState<"upi" | "cod" | "card">("upi");
  const [upiDone, setUpiDone]       = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const [form, setForm] = useState({
    name: "", phone: "", address: "", pincode: "", city: "Hyderabad",
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("jd_cart") || "[]");
    setItems(Array.isArray(cart) ? cart : []);
    // Pre-fill name + phone from logged-in user
    const name  = localStorage.getItem("jd_name")  || "";
    const phone = localStorage.getItem("jd_phone") || "";
    setForm(f => ({ ...f, name, phone }));
  }, []);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=Jeevadhara+AgriTech&am=${total.toFixed(2)}&cu=INR&tn=Fresh+Harvest+Order`;
  const qrUrl   = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

  async function placeOrder() {
    setLoading(true);
    setError("");
    try {
      const customer_id   = localStorage.getItem("jd_user_id") || undefined;
      const delivery_address = `${form.address}, ${form.city} - ${form.pincode}`;

      // Build per-product order items
      // We need farmer_id per product — fetch from cart or store it
      const orderItems = items.map(item => ({
        product_id:   item.id,
        product_name: item.name,
        quantity:     item.qty,
        unit:         item.unit,
        unit_price:   item.price,
        farmer_id:    item.farmer_id || "unknown",
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id,
          customer_name:  form.name,
          customer_phone: form.phone,
          items:          orderItems,
          payment_method: payMethod,
          delivery_address,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Order failed. Please try again.");
        setLoading(false);
        return;
      }

      // Clear cart
      localStorage.setItem("jd_cart", "[]");
      window.dispatchEvent(new Event("storage"));

      // Redirect to success
      const orderRef = data.order_ids?.[0]?.slice(0, 8).toUpperCase() || "ORD";
      router.push(`/order-success?ref=${orderRef}&total=${total.toFixed(0)}&method=${payMethod}`);
    } catch {
      setError("Network error. Try again.");
      setLoading(false);
    }
  }

  if (items.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🛒</div>
        <p className="text-gray-600">Your cart is empty.</p>
        <Link href="/fresh-harvest" className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-lg">Shop Now</Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/cart" className="text-gray-400 hover:text-gray-600">←</Link>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8 text-sm">
        <span className={`px-3 py-1 rounded-full font-medium ${step === "details" ? "bg-green-600 text-white" : "bg-green-100 text-green-700"}`}>
          1 · Delivery Details
        </span>
        <span className="text-gray-300">→</span>
        <span className={`px-3 py-1 rounded-full font-medium ${step === "payment" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500"}`}>
          2 · Payment
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Left: form */}
        <div className="lg:col-span-2">

          {step === "details" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-5">📦 Delivery Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Full Name *</label>
                    <input required value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}
                      placeholder="Your name"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Phone *</label>
                    <input required value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))}
                      placeholder="10-digit mobile"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Delivery Address *</label>
                  <textarea required value={form.address} onChange={e => setForm(f=>({...f,address:e.target.value}))}
                    placeholder="House no, Street, Locality..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">City</label>
                    <input value={form.city} onChange={e => setForm(f=>({...f,city:e.target.value}))}
                      placeholder="Hyderabad"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Pincode</label>
                    <input value={form.pincode} onChange={e => setForm(f=>({...f,pincode:e.target.value}))}
                      placeholder="500001"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!form.name || !form.phone || !form.address) {
                      setError("Please fill name, phone and address.");
                      return;
                    }
                    setError("");
                    setStep("payment");
                  }}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 mt-2">
                  Continue to Payment →
                </button>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <button onClick={() => setStep("details")} className="text-gray-400 hover:text-gray-600 text-sm">← Back</button>
                <h2 className="font-bold text-gray-800">💳 Choose Payment</h2>
              </div>

              {/* Payment method selector */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {([
                  { id: "upi",  label: "UPI / QR",  icon: "📱" },
                  { id: "cod",  label: "Cash on Delivery", icon: "💵" },
                  { id: "card", label: "Card",       icon: "💳" },
                ] as { id: "upi"|"cod"|"card"; label: string; icon: string }[]).map(m => (
                  <button key={m.id} onClick={() => { setPayMethod(m.id); setUpiDone(false); }}
                    className={`border-2 rounded-xl p-4 text-center transition-all ${
                      payMethod === m.id ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <div className="text-2xl mb-1">{m.icon}</div>
                    <p className="text-xs font-semibold text-gray-700">{m.label}</p>
                  </button>
                ))}
              </div>

              {/* UPI */}
              {payMethod === "upi" && (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">Scan QR with any UPI app — PhonePe, GPay, Paytm, BHIM</p>
                  <div className="flex justify-center mb-4">
                    <div className="border-4 border-green-500 rounded-2xl p-2 inline-block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrUrl} alt="UPI QR Code" width={220} height={220} className="rounded-lg" />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 mb-4 inline-block">
                    <p className="text-xs text-gray-500">UPI ID</p>
                    <p className="font-mono font-bold text-green-700 text-sm">{UPI_ID}</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-5">
                    <p className="text-lg font-bold text-green-800">₹{total.toFixed(0)}</p>
                    <p className="text-xs text-green-600">{totalItems} items · Jeevadhara AgriTech</p>
                  </div>
                  <button onClick={() => setUpiDone(true)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      upiDone ? "bg-green-100 text-green-700 border border-green-300" : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}>
                    {upiDone ? "✓ Payment Done — Confirming order..." : "✅ I've Completed the Payment"}
                  </button>
                  {upiDone && !loading && (
                    <button onClick={placeOrder}
                      className="w-full mt-3 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700">
                      Confirm Order →
                    </button>
                  )}
                </div>
              )}

              {/* COD */}
              {payMethod === "cod" && (
                <div className="text-center">
                  <div className="text-5xl mb-4">💵</div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">Cash on Delivery</h3>
                  <p className="text-gray-500 text-sm mb-6">Pay ₹{total.toFixed(0)} when your order arrives at your door. No advance payment needed.</p>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left text-sm text-amber-800">
                    <p className="font-semibold mb-1">📋 COD Terms</p>
                    <p>• Keep exact change ready</p>
                    <p>• Delivery within 24-48 hours from farm</p>
                    <p>• Our team will call before delivery</p>
                  </div>
                  <button onClick={placeOrder} disabled={loading}
                    className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60">
                    {loading ? "Placing order..." : `Place COD Order · ₹${total.toFixed(0)} →`}
                  </button>
                </div>
              )}

              {/* Card */}
              {payMethod === "card" && (
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Card Number</label>
                      <input placeholder="1234 5678 9012 3456" maxLength={19}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Expiry</label>
                        <input placeholder="MM / YY" maxLength={7}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">CVV</label>
                        <input placeholder="•••" maxLength={4} type="password"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Name on Card</label>
                      <input placeholder="As printed on card" defaultValue={form.name}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <button onClick={placeOrder} disabled={loading}
                      className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60">
                      {loading ? "Processing..." : `Pay ₹${total.toFixed(0)} →`}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 items-center">
                  <img src={item.image} alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/products/organic tomatoes.jpg"; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.qty} {item.unit} × ₹{item.price}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800 flex-shrink-0">₹{(item.price * item.qty).toFixed(0)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
                <span>Total</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
            </div>
            <div className="mt-4 bg-green-50 rounded-xl p-3 text-xs text-green-700 space-y-1">
              <p>✓ Direct from Telangana farmers</p>
              <p>✓ Fresh · No middlemen</p>
              <p>✓ Jeevadhara quality certified</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
