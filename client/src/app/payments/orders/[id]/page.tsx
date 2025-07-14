"use client";

import React, { useEffect, useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useParams } from "next/navigation";
import { apiGet, apiPost } from "@/helpers/axios/config";
import { Order, Ticket, ToastType } from "@/types";
import ExpirationCountdown from "@/components/expiration-countdown";
import { getOrderStatusClass } from "@/helpers/utils/statusClasses";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@hrrtickets/common";
import { showGlobalToast } from "@/helpers/utils/globals";

// Replace this with your actual Stripe **public key**

const CheckoutForm = ({ orderId }: { orderId: Order["id"] }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error("Payment Error", error.message);
      showGlobalToast(error.message ?? "", ToastType.Error);
    } else {
      console.log("Payment Method", paymentMethod);
      try {
        const orderPayment = await apiPost<{
          status: string;
          message: string;
          errors: { message: string }[];
        }>({
          apiPath: "/api/payments",
          data: {
            token: paymentMethod.id,
            orderId,
          },
          withCredentials: true,
        });

        if (orderPayment.status === "success") {
          showGlobalToast("Payment successfully made!");
          router.push("/");
        }
      } catch (error) {
        console.log("Errors ", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-body gap-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Card Info</span>
        </label>
        <div className="p-4 border rounded-md bg-white shadow-sm">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>
      <button className="btn btn-primary mt-4" type="submit" disabled={!stripe}>
        Pay Now
      </button>
    </form>
  );
};

const Payment = () => {
  const router = useRouter();
  const { id: orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [stripe, setStripe] = useState(null);

  const loadStripePromise = async () => {
    try {
      const res = await fetch("/api/load-stripe", {
        method: "GET",
      });

      const data = await res.json();

      if (!res.ok || !data.loaded) {
        throw new Error("Failed to load stripe");
      }
      const stripe = loadStripe(data.secretKey) as any;

      setStripe(stripe);
    } catch (error) {
      throw new Error("Failed to load stripe");
    }
  };

  const fetchOrder = async () => {
    try {
      const order = await apiGet<Order>({
        apiPath: `/api/orders/${orderId}`,
        withCredentials: true,
      });
      setOrder(order);
    } catch (error) {
      console.error("Error fetching Order:", error);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();

    if (order) {
      if (
        order.status === OrderStatus.Cancelled ||
        order.status === OrderStatus.Complete
      ) {
        router.push("/");
      }
    }
  }, [orderId]);

  useEffect(() => {
    if (!stripe) {
      loadStripePromise();
    }
  }, [stripe]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-2xl bg-base-100 shadow-md border border-base-300">
        <div className="card-body space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold">Complete Your Payment</h2>
            <p className="text-sm text-gray-500">
              Review your ticket details and enter your card information below.
            </p>
          </div>

          {/* Ticket Details */}
          {order && order?.ticket && (
            <div className="bg-gray-50 border rounded-md p-4 flex justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-700">
                  🎫 {order.ticket.title}
                </h3>
                <div className="flex text-sm gap-1">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-semibold">${order.ticket.price}</span>
                </div>
                <div className="flex text-sm gap-1">
                  <span className="text-gray-500">Order Status:</span>
                  <span
                    className={`badge badge-sm ${getOrderStatusClass(
                      order.status
                    )} capitalize font-semibold`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              <ExpirationCountdown expiresAt={order.expiresAt} />
            </div>
          )}

          {/* Stripe Payment Form */}
          <Elements stripe={stripe}>
            <CheckoutForm orderId={order?.id!} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Payment;
