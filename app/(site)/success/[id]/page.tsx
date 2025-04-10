"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { VscPass } from "react-icons/vsc";
import { useAuthStore } from "@/store/store";
import { Copy } from "lucide-react";
import confetti from "canvas-confetti";

export default function Page() {
  const { user } = useAuthStore();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id || !user || id.length < 23) router.push("/");
  }, [id, user]);

  useEffect(() => {
    // Play success sound
    const audio = new Audio("/success.mp3");
    audio.volume = 0.1;
    audio.play();

    // Trigger confetti
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-white text-center px-4">
      <div className="bg-purple-50 p-10 rounded-2xl  w-full max-w-xl">
        <div className="flex justify-center mb-6">
          <VscPass className="text-purple-600 text-6xl" />
        </div>
        <div className="flex items-center justify-center gap-2 w-full">
          <p className="text-sm md:text-base my-2">Order ID: {id}</p>
          <Copy
            className={`size-4 cursor-pointer transform transition-all duration-300 ${
              copied ? "scale-125" : "scale-100"
            }`}
            onClick={() => {
              if (id) navigator.clipboard.writeText(id);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 1000);
            }}
          />
        </div>
        <h1 className="text-xl md:text-2xl font-semibold text-black mb-2">
          Thanks {user?.name}, Your Order was Placed Successfully.
        </h1>
        <p className="text-gray-600 mb-6 text-sm md:text-base">
          We will send latest information and updates about your order to 
          {user?.email}
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-sm cursor-pointer"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => router.push(`/profile`)}
            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full text-sm cursor-pointer"
          >
            Check Details
          </Button>
        </div>
      </div>
    </div>
  );
}

