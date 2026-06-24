"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [user, setUser]           = useState<{ name: string; role: string } | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const isEmail = identifier.includes("@");
      const body    = isEmail
        ? { email: identifier.trim(), password }
        : { phone: identifier.trim(), password };

      const res  = await fetch("/api/auth?action=login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Store token
      if (typeof window !== "undefined") {
        localStorage.setItem("jd_token", data.token);
        localStorage.setItem("jd_user", JSON.stringify(data.user));
      }
      setUser(data.user);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  if (user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-green-800">Welcome back, {user.name}!</h1>
        <p className="text-gray-500 mt-2 mb-6">Role: <span className="capitalize font-medium text-green-700">{user.role}</span></p>
        <div className="flex gap-3 justify-center">
          <Link href="/products" className="bg-green-700 text-white px-6 py-2 rounded-full">Browse Products</Link>
          {user.role === "farmer" && (
            <Link href="/farmers" className="border border-green-700 text-green-700 px-6 py-2 rounded-full">My Farm</Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🌱</div>
        <h1 className="text-2xl font-bold text-green-800">Login to Jeevadhara</h1>
        <p className="text-gray-500 text-sm mt-1">Use your phone number or email</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Demo credentials */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-sm">
        <p className="font-semibold text-green-800 mb-2">Demo Credentials (Aurora DB)</p>
        <div className="space-y-1 text-green-700">
          <p>🧑‍🌾 Farmer: <code className="bg-green-100 px-1 rounded">9848000001</code> / any password</p>
          <p>🛒 Consumer: <code className="bg-green-100 px-1 rounded">9848000010</code> / any password</p>
          <p>🏦 Vijay Kumar: <code className="bg-green-100 px-1 rounded">vijaytharigopula14@gmail.com</code></p>
        </div>
      </div>

      <form onSubmit={handleLogin} className="bg-white rounded-xl p-6 shadow-sm border border-green-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone / Email</label>
          <input
            required
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="9848012345 or email@example.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition disabled:opacity-60">
          {loading ? "⏳ Logging in..." : "Login to Jeevadhara"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Not registered?{" "}
        <Link href="/register" className="text-green-700 font-medium hover:underline">Register your farm →</Link>
      </p>
    </div>
  );
}
