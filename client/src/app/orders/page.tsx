"use client";

import { apiGet } from "@/helpers/axios/config";
import { Order } from "@/types";
import React, { useEffect, useState } from "react";
import { getOrderStatusClass } from "@/helpers/utils/statusClasses"; // If you have a helper for status styling

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const orders = await apiGet<Order[]>({ apiPath: "/api/orders/me" });
      setOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        🧾 Your Orders
      </h2>

      {orders?.length > 0 ? (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body space-y-3">
                <h3 className="text-lg font-semibold">
                  Order ID:{" "}
                  <span className="text-sm text-gray-500 break-all">{order.id}</span>
                </h3>
                <p className="text-sm text-gray-600">
                  📅 Created At:{" "}
                  <span className="font-medium">
                    {new Date(order.expiresAt).toLocaleString()}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  📦 Status:{" "}
                  <span className={`badge badge-sm ${getOrderStatusClass?.(order.status)} capitalize`}>
                    {order.status}
                  </span>
                </p>

                {order.ticket && (
                  <div className="bg-gray-50 rounded-md p-3 border border-dashed border-gray-300">
                    <h4 className="text-md font-semibold mb-2">🎫 Ticket</h4>
                    <p>
                      <span className="text-gray-500">Title:</span>{" "}
                      <span className="font-medium">{order.ticket.title}</span>
                    </p>
                    <p>
                      <span className="text-gray-500">Description:</span>{" "}
                      {order.ticket.description}
                    </p>
                    <p>
                      <span className="text-gray-500">Price:</span>{" "}
                      <span className="text-success font-semibold">${order.ticket.price}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <p className="text-lg text-gray-600">You haven’t placed any orders yet.</p>
        </div>
      )}
    </div>
  );
};

export default Orders;
