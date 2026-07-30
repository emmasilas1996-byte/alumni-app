"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/contributions");
    } else {
      const body = await res.json();
      setError(body.error || "Login failed.");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="font-display text-[26px] font-semibold mb-1">Sign In</h1>
      <p className="text-sm text-gray-500 mb-6">
        Needed only to add a contribution or record a monthly due. Everything else in the app stays open.
      </p>
      <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-4 space-y-3">
        {error && <div className="text-sm text-red-600">{error}</div>}
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="border rounded px-3 py-2 w-full"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
          className="border rounded px-3 py-2 w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-navy text-white px-4 py-2 rounded text-sm w-full disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
