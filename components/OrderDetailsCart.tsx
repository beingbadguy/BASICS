import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaCcVisa } from "react-icons/fa";


type Order = {
  _id: string;
  userId: User;
  products: Product[];
  totalAmount: number;
  paymentMethod: "cod" | "credit/debit";
  deliveryType: "normal" | "fast";
  address: string;
  phone: string;
  status:
    | "processing"
    | "cancelled"
    | "completed"
    | "reviewing"
    | "preparing"
    | "shipped"
    | "delivered";
  createdAt: string;
  updatedAt: string;
};

type Product = {
  productId: {
    _id: string;
    title: string;
    price: number;
    category: string;
    image: string; // Assuming you're storing product image URL
  };
  quantity: number;
};

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
};

export default function OrderDetailsCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded my-4  p-4 mb-4 w-full ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="space-y-1">
          <p className="text-sm font-semibold">ID: #{order._id.slice(-10)}</p>
          <p className="text-xs text-gray-500">
            Date: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-3 md:mt-0 text-sm w-full md:justify-between">
          <p>
            <span className="font-semibold">Total payment:</span> ₹
            {order.totalAmount}
          </p>
          <p>
            <span className="font-semibold">Payment type:</span>{" "}
            {order.paymentMethod}
          </p>
          <p className="flex items-center gap-1">
            <span className="font-semibold">Status order:</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                order.status === "completed"
                  ? "bg-green-100 text-green-600"
                  : order.status === "cancelled"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {order.status}
            </span>
          </p>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="ml-auto cursor-pointer"
        >
          {open ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {open && (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {/* Product Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Product details</h3>
            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {order.products.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 border-b pb-3"
                >
                  <img
                    src={item.productId.image}
                    alt={item.productId.title}
                    className="w-16 h-20 object-cover rounded-md"
                  />
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{item.productId.title}</p>
                    <p>₹{item.productId.price}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Summary & Payment */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Summary</h3>
              <p>Total products: {order.products.length}</p>
              <p>Subtotal: ₹{order.totalAmount}</p>
              <p>Shipping: ₹ 0.00</p>
              <p>Tax: ₹ 0.00</p>
              <p className="text-green-600 font-semibold">
                Total: ${order.totalAmount}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1">Shipping Details</h3>
              <p>{order.address}</p>
              <p>{order.phone}</p>
              <p>Delivery Type: {order.deliveryType}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1">Payment</h3>
              <p className="flex items-center gap-1">
                <FaCcVisa className="text-blue-500" /> {order.paymentMethod}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
