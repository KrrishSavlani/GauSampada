"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.ok) router.push("/");
        else alert("Invalid credentials");

        // if (!email || !password) {
        //     setError("Email and password are required.");
        //     return;
        // }
        //
        // setLoading(true);
        //
        // try {
        //     const res = await fetch("/api/login", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({ email, password }),
        //     });
        //
        //     if (!res.ok) {
        //         const data = await res.json().catch(() => ({}));
        //         setError(data?.message || "Invalid credentials");
        //         return;
        //     }
        //
        //     // success
        //     console.log("pushing to the dashboard");
        //     router.push("/dashboard"); // change route as needed
        // } catch (err: any) {
        //     setError(err?.message || "Something went wrong");
        // } finally {
        //     setLoading(false);
        // }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
                <h1 className="text-2xl font-semibold text-center mb-6">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full border rounded-lg px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full border rounded-lg px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2.5 rounded-lg
                       hover:bg-gray-800 transition disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">
                        {error}
                    </div>
                )}

                <p className="text-sm text-center text-gray-600 mt-6">
                    Don’t have an account?{" "}
                    <span
                        onClick={() => router.push("/signup")}
                        className="text-black font-medium cursor-pointer hover:underline"
                    >
            Sign up
          </span>
                </p>
            </div>
        </div>
    );
}
