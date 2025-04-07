import React from "react";

const ShopByCategory = () => {
  return (
    <div>
      <h2 className="text-2xl">Shop By Category</h2>
      <ul className="mt-2 flex items-center justify-start gap-4 flex-wrap">
        <li className="size-32 rounded-full bg-gray-300 flex items-center justify-center">
          Category 1
        </li>
        <li className="size-32 rounded-full bg-gray-300 flex items-center justify-center">
          Category 2
        </li>
        <li className="size-32 rounded-full bg-gray-300 flex items-center justify-center">
          Category 3
        </li>
        <li className="size-32 rounded-full bg-gray-300 flex items-center justify-center">
          Category 4
        </li>
      </ul>
    </div>
  );
};

export default ShopByCategory;
