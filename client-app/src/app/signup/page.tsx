"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/helpers/axios/config";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/authContext";
import { ISigninResponse } from "../login/page";
import { ToastType } from "@/types";

type ISignUpResponse = ISigninResponse;

const Signup = () => {
  const router = useRouter();
  const { setShowToast, setToastMessage, setToastType } = useToast();
  const { setIsAuthenticated, setToken, setCurrentUser } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { firstName, lastName, email, password, confirmPassword } = form;

    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return setError("Please fill in all fields.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);

      const { token, data } = await apiPost<ISignUpResponse>({
        apiPath: "/api/users/signup",
        data: {
          firstName,
          lastName,
          email,
          password,
        },
        withCredentials: true,
      });

      if (token && data) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data));

        setToastMessage("Created account successfully!");
        setToastType(ToastType.Success);
        setShowToast(true);
        setIsAuthenticated(true);
        setCurrentUser(data);
        setToken(token);
      }

      // Redirect to login or dashboard
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Create Account
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
            placeholder="Enter your first name"
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
            placeholder="Enter your last name"
            className="input input-bordered w-full"
          />
        </div>
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

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
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
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?
        <a href="/login" className="text-blue-600 hover:underline pl-1">
          Sign In
        </a>
      </p>
    </div>
  );
};

export default Signup;
