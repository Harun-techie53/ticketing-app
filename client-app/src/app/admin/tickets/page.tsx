"use client";
import { useToast } from "@/contexts/ToastContext";
import { apiPost } from "@/helpers/axios/config";
import { Ticket, ToastType } from "@/types";
import React, { useState } from "react";

interface ITicketCreatedResponse {
  data: Ticket[];
  errors: { message: string }[];
}

const AdminTickets = () => {
  const { setShowToast, setToastMessage, setToastType } = useToast();
  // Track form values
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    maxResalePrice: "",
    price: "",
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { data } = await apiPost<ITicketCreatedResponse>({
        apiPath: "/api/tickets",
        data: {
          title: formData.title,
          description: formData.description,
          maxResalePrice: parseInt(formData.maxResalePrice),
          price: parseInt(formData.price),
          status: "instock",
        },
        withCredentials: true,
      });

      setShowToast(true);
      setToastMessage("Ticket created successfully!");
      setToastType(ToastType.Success);
      setFormData({
        title: "",
        description: "",
        maxResalePrice: "",
        price: "",
      });
      console.log("response ", data);
    } catch (error) {
      console.error("Error:", error);
      setShowToast(true);
      setToastMessage("There was an error creating the ticket.");
      setToastType(ToastType.Error);
    }
  };

  return (
    <div>
      <form
        className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-md space-y-6 mt-5"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-gray-800">Ticket Details</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter product title"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter product description"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Max Resale Price
          </label>
          <input
            type="number"
            id="maxResalePrice"
            name="maxResalePrice"
            value={formData.maxResalePrice}
            onChange={handleChange}
            step="0.01"
            placeholder="0.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            placeholder="0.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 hover:bg-blue-700 transition hover:shadow-lg hover:cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminTickets;
