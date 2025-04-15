"use client";
import { motion } from "motion/react"; // corrected import

const TextEffect = () => {
  const text = "A Place where you can buy anything.";

  return (
    <div className="flex flex-wrap items-center justify-center w-full">
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          className="text-4xl"
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{
            delay: index * 0.05,
            duration: 0.5,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
};

export default TextEffect;
