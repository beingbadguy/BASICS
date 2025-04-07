import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]  p-4">
      <div className="bg-white  rounded-2xl  w-full text-center flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h1>
        <p className="text-gray-600 mb-6">We’d love to hear from you!</p>

        <div className="space-y-4 text-left">
          <div className="flex items-center space-x-3">
            <FaEnvelope className="text-black" />
            <span className="text-gray-700">authorisedaman@gmail.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaPhone className="text-black" />
            <span className="text-gray-700">+123 456 7890</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaMapMarkerAlt className="text-black" />
            <span className="text-gray-700">123 Street,Emerging City, India</span>
          </div>
        </div>
      </div>
    </div>
  );
}
