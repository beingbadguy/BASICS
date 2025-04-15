"use client";
import { motion } from "framer-motion"; // Corrected import

const TextEffect = () => {
  // Break text into lines based on screen size
  const lines = [
    "A Place where", // Line 1 for small screens
    "you can buy", // Line 2 for small screens
    "anything.", // Line 3 for small screens
  ];

  const fullText = "A Place where you can buy anything.";

  return (
    <div className="w-full flex flex-col items-center justify-center text-center my-10">
      {/* For screens md and up: show full line */}
      <div className="hidden md:flex flex-wrap justify-center">
        {fullText.split("").map((char, index) => (
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

      {/* For screens smaller than md: split into lines */}
      <div className="flex flex-col md:hidden">
        {lines.map((line, lineIndex) => (
          <div key={lineIndex} className="flex justify-center">
            {line.split("").map((char, charIndex) => (
              <motion.span
                key={`${lineIndex}-${charIndex}`}
                className="text-4xl"
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{
                  delay: lineIndex * 0.5 + charIndex * 0.05,
                  duration: 0.5,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextEffect;
