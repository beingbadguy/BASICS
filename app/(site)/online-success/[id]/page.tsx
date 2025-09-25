"use client";
import React from "react";
import { CheckCircle } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Static order confirmation page with good UI and icons

export default function OrderConfirmationPage() {
  const params = useParams();

  return (
    <div className="min-h-[60vh] md:min-h-[80vh] bg-gray-50 text-gray-800 flex items-center justify-center p-6">
      <main className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <header className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="size-6 sm:size-10 text-green-600" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Order Placed</h1>
              <p className=" text-gray-500">Thank you for your purchase! 🎉</p>
            </div>
          </div>
          <div className="text-right  text-[10px] sm:text-sm">
            <p className="text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </header>

        <p className="font-medium  break-words">Payment ID: {params?.id}</p>

        <div className="mt-4 flex flex-col gap-3">
          <button
            onClick={() => window.print()}
            className="w-full rounded-md py-2 border bg-white text-gray-700 hover:bg-gray-100 text-sm font-medium"
          >
            Print Receipt
          </button>

          <Link
            href="/"
            className="w-full text-center block py-2 rounded-md text-sm font-medium bg-black text-white hover:bg-gray-900"
          >
            Continue shopping
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-xs text-gray-500 border-t pt-4">
          <p>
            If you have any questions about your order, reply to this email or
            contact our support. Keep your payment ID handy:{" "}
            <span className="font-medium break-words text-pink-300">
              {params?.id}
            </span>
          </p>
          <p className="mt-2">
            This is an automated receipt — no signature required.
          </p>
        </footer>
      </main>
    </div>
  );
}
