import React from "react";
import {
  FaServer,
  FaLock,
  FaTools,
  FaCloudUploadAlt,
  FaCss3Alt,
  FaEnvelope,
} from "react-icons/fa";
import { SiMongodb, SiNextdotjs, SiJsonwebtokens } from "react-icons/si";

const techStack = [
  {
    icon: <SiNextdotjs />,
    title: "Frontend",
    description: "Next.js 14 (App Router, Server Components)",
  },
  { icon: <FaCss3Alt />, title: "Styling", description: "Tailwind CSS" },
  { icon: <FaTools />, title: "State Management", description: "Zustand" },
  {
    icon: <SiMongodb />,
    title: "Database",
    description: "MongoDB (via Mongoose)",
  },
  {
    icon: <FaServer />,
    title: "Backend API",
    description: "Next.js API Routes",
  },
  {
    icon: <SiJsonwebtokens />,
    title: "Authentication",
    description: "JWT (JSON Web Token)",
  },
  {
    icon: <FaLock />,
    title: "Middleware",
    description: "Next.js Middleware (for auth protection)",
  },
  { icon: <FaEnvelope />, title: "Mailing Service", description: "Nodemailer" },
  { icon: <FaCloudUploadAlt />, title: "Deployment", description: "Vercel" },
];

const Page = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        🚀 Tech Stack Used in This Project
      </h1>

      {/* Tech stack grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {techStack.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 bg-gray-100 p-4 rounded-lg shadow-md"
          >
            <div className="text-black text-2xl">{item.icon}</div>
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
