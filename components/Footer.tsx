import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white px-6 md:px-20 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        {/* About */}
        <div>
          <h2 className="font-semibold text-lg mb-4">BASICS</h2>
          <p className="text-sm text-gray-400">
            Your go-to store for minimal, high-quality essentials. We bring
            style & simplicity together.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-medium text-base mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>About Us</li>
            <li>Careers</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-medium text-base mb-4">Support</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Help Center</li>
            <li>Returns</li>
            <li>Track Order</li>
          </ul>
        </div>

        {/* Newsletter + Social */}
        <div>
          <h3 className="font-medium text-base mb-4">Stay in the loop</h3>

          <div className="flex gap-4 mt-6 text-white">
            <FaFacebookF className="hover:text-gray-400 cursor-pointer" />
            <FaInstagram className="hover:text-gray-400 cursor-pointer" />
            <FaTwitter className="hover:text-gray-400 cursor-pointer" />
            <FaLinkedinIn className="hover:text-gray-400 cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6 text-center text-sm text-white">
        © {new Date().getFullYear()} BASICS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
