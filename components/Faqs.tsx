"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faqs = () => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 md:max-w-none md:grid md:grid-cols-2 md:gap-10 pb-4">
      <div className="mb-8 md:mb-12 text-left">
        <div className="inline-flex items-center bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-sm font-medium mb-4">
          F.A.Q
        </div>
        <h2 className="text-3xl font-bold text-gray-800 md:text-4xl mb-3">
          Frequently asked question
        </h2>
        <p className="text-gray-600">
          No matter what project you&apos;re working on, we&apos;ve got you
          covered with the best wireframe kits for any platform.
        </p>
      </div>
      <div className="w-full">
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-2 cursor-pointer"
        >
          <AccordionItem
            value="q1"
            className="cursor-pointer border px-2 rounded"
          >
            <AccordionTrigger>How do I place an order?</AccordionTrigger>
            <AccordionContent>
              Simply browse the products, add them to your cart, and proceed to
              checkout. You’ll receive a confirmation email once the order is
              placed.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="q2"
            className="cursor-pointer border px-2 rounded"
          >
            <AccordionTrigger>
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent>
              We accept UPI, credit/debit cards, net banking, and wallet
              payments like Paytm & PhonePe.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="q3"
            className="cursor-pointer border px-2 rounded"
          >
            <AccordionTrigger>
              How long will it take to receive my order?
            </AccordionTrigger>
            <AccordionContent>
              Orders are usually delivered within 3–7 business days, depending
              on your location and selected shipping method.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="q4"
            className="cursor-pointer border px-2 rounded"
          >
            <AccordionTrigger>
              Can I return or exchange a product?
            </AccordionTrigger>
            <AccordionContent>
              Yes, we offer a 7-day return/exchange window. The product must be
              unused and in original packaging.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="q5"
            className="cursor-pointer border px-2 rounded mb-10"
          >
            <AccordionTrigger>How can I contact support?</AccordionTrigger>
            <AccordionContent>
              You can reach us at{" "}
              <a
                href="mailto:authorisedaman@gmail.com"
                className="text-purple-600 underline"
              >
                authorisedaman@gmail.com
              </a>{" "}
              — we’re happy to help!
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Faqs;
