"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      localStorage.setItem("jd_token", data.token);
      localStorage.setItem("jd_role", data.role);
      localStorage.setItem("jd_name", data.name);
      localStorage.setItem("jd_user_id", data.id);

      // Role-based redirect
      if (data.role === "farmer") router.push("/farmer/dashboard");
      else if (data.role === "provider") router.push("/provider/dashboard");
      else router.push("/fresh-harvest");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-2xl">J</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Log in to your Jeevadhara account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4 text-xs text-gray-500">
          <p className="font-semibold text-gray-600 mb-2">Demo accounts:</p>
          <div className="space-y-1">
            <p>🌾 Farmer: <span className="font-mono">9876543210</span> / <span className="font-mono">farm123</span></p>
            <p>🛒 Customer: <span className="font-mono">9876543211</span> / <span className="font-mono">cust123</span></p>
            <p>🏢 Provider: <span className="font-mono">9876543212</span> / <span className="font-mono">prov123</span></p>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          New here?{" "}
          <Link href="/auth" className="text-green-600 font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
