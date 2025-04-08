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
    <div className="max-w-3xl mx-auto my-10 px-4">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
        Frequently Asked Questions
      </h1>
      <Accordion type="single" collapsible className="w-full space-y-2">
        <AccordionItem value="q1">
          <AccordionTrigger>How do I place an order?</AccordionTrigger>
          <AccordionContent>
            Simply browse the products, add them to your cart, and proceed to
            checkout. You’ll receive a confirmation email once the order is
            placed.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q2">
          <AccordionTrigger>
            What payment methods do you accept?
          </AccordionTrigger>
          <AccordionContent>
            We accept UPI, credit/debit cards, net banking, and wallet payments
            like Paytm & PhonePe.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q3">
          <AccordionTrigger>
            How long will it take to receive my order?
          </AccordionTrigger>
          <AccordionContent>
            Orders are usually delivered within 3–7 business days, depending on
            your location and selected shipping method.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q4">
          <AccordionTrigger>
            Can I return or exchange a product?
          </AccordionTrigger>
          <AccordionContent>
            Yes, we offer a 7-day return/exchange window. The product must be
            unused and in original packaging.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q5">
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
  );
};

export default Faqs;
