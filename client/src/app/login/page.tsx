"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/helpers/axios/config";
import { ToastType, User } from "@/types";
import { useAuth } from "@/contexts/authContext";
import { showGlobalToast } from "@/helpers/utils/globals";

export interface ISigninResponse {
  token: string;
  data: User;
}

const Login = () => {
  const router = useRouter();
  const { setIsAuthenticated, setToken, setCurrentUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { email, password } = form;

    if (!email || !password) {
      return setError("Please fill in all fields.");
    }

    try {
      setLoading(true);

      const { token, data } = await apiPost<ISigninResponse>({
        apiPath: "/api/users/signin",
        data: {
          email,
          password,
        },
        withCredentials: true,
      });

      if (token && data) {
        localStorage?.setItem("token", token);
        localStorage?.setItem("user", JSON.stringify(data));
        showGlobalToast("Logged in successfully", ToastType.Success);
        setIsAuthenticated(true);
        setCurrentUser(data);
        setToken(token);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Sign In
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="input input-bordered w-full"
          />
        </div>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?
        <a href="/signup" className="text-blue-600 hover:underline pl-1">
          Sign up
        </a>
      </p>
    </div>
  );
};

export default Login;
