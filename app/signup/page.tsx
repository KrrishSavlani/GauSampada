"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username || !email || !password) {
      setError("Please fill required fields (username, email, password).");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, phone, address }),
      });

      if (res.ok) {
        setSuccess("Account created successfully. Redirecting...");
        setTimeout(() => router.push("/login"), 1200);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || "Signup failed.");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Create your account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Username *" value={username} onChange={setUsername} />
            <Input label="Email *" type="email" value={email} onChange={setEmail} />
            <Input label="Password *" type="password" value={password} onChange={setPassword} />
            <Input
                label="Confirm Password *"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
            />
            <Input label="Phone" value={phone} onChange={setPhone} />
            <Input label="Address" value={address} onChange={setAddress} />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2.5 rounded-lg font-medium
                       hover:bg-gray-800 transition disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          {error && (
              <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">
                {error}
              </div>
          )}

          {success && (
              <div className="mt-4 text-sm text-green-600 bg-green-50 p-3 rounded">
                {success}
              </div>
          )}

          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <span
                onClick={() => router.push("/login")}
                className="text-black font-medium cursor-pointer hover:underline"
            >
            Log in
          </span>
          </p>
        </div>
      </div>
  );
}

/* ---------- Reusable Input ---------- */

function Input({
                 label,// /* ---------- Reusable Input ---------- */
//
// function Input({
//                  label,
//                  type = "text",
//                  value,
//                  onChange,
//                }: {
//   label: string;
//   type?: string;
//   value: string;
//   onChange: (v: string) => void;// /* ---------- Reusable Input ---------- */
//
// function Input({
//                  label,
//                  type = "text",
//                  value,
//                  onChange,
//                }: {
//   label: string;
//   type?: string;
//   value: string;
//   onChange: (v: string) => void;
// }) {
//   return (
//       <div className="flex flex-col gap-1">
//         <label className="text-sm font-medium text-gray-700">{label}</label>
//         <input
//             type={type}
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             className="border rounded-lg px-3 py-2 outline-none
//                    focus:ring-2 focus:ring-black focus:border-black"
//         />
//       </div>
//   );
// }

// }) {
//   return (
//       <div className="flex flex-col gap-1">
//         <label className="text-sm font-medium text-gray-700">{label}</label>
//         <input
//             type={type}
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             className="border rounded-lg px-3 py-2 outline-none
//                    focus:ring-2 focus:ring-black focus:border-black"
//         />
//       </div>
//   );
// }

                 type = "text",
                 value,
                 onChange,
               }: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border rounded-lg px-3 py-2 outline-none
                   focus:ring-2 focus:ring-black focus:border-black"
        />
      </div>

  );
}
