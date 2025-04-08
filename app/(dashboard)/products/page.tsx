"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import axios, { AxiosError } from "axios";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import Image from "next/image";

type Products = {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  image: string;
  discountPercentage: number;
  isActive: boolean;
};

const Page = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/product");
      console.log(response.data);
      setProducts(response.data.products);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        console.error("An unknown error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    try {
      await axios.patch(`/api/product/${id}/status`, {
        isActive: newStatus,
      });
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: newStatus } : p))
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`/api/product/${id}`);
      fetchAllProducts();
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="mt-2 pt-20 pb-20 md:pt-0 md:mb-0 px-2 md:px-6 overflow-y-scroll max-h-[90vh]">
      <div className="flex items-start justify-start flex-col md:items-center md:justify-between md:flex-row gap-2">
        <h1 className="font-bold text-2xl text-purple-700">Products</h1>
        <div className="flex items-center  justify-between md:justify-center w-full md:w-auto gap-2 my-2 md:my-0">
          <div className="flex items-center  gap-2 px-3 py-[6px] rounded border border-purple-700">
            <Search className="text-purple-700" />
            <input
              type="text"
              placeholder="Shoes"
              className="outline-none w-full"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
          <Link href={"/addproduct"}>
            <Button className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>
      {loading ? (
        <div className="h-screen flex items-center justify-center w-full ">
          <VscLoading className="animate-spin flex items-center justify-center w-full text-3xl  text-purple-700 " />
        </div>
      ) : (
        <div className="mt-6 w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products
                .filter((product) =>
                  product.title.toLowerCase().includes(query.toLowerCase())
                )
                .map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={100}
                        height={100}
                        className="w-14 h-14 object-contain rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.title}
                    </TableCell>
                    <TableCell>
                      ₹{product.discountedPrice}{" "}
                      <span className="line-through text-sm text-gray-500 ml-1">
                        ₹{product.price}
                      </span>
                    </TableCell>
                    <TableCell>{product.countInStock}</TableCell>
                    <TableCell>
                      <Switch
                        checked={product.isActive}
                        onCheckedChange={(checked) =>
                          handleToggleStatus(product._id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Link href={`/editproduct/${product._id}`}>
                        <Button size="sm" variant="outline">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="cursor-pointer"
                        variant="destructive"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
      {/* Product Table */}
    </div>
  );
};

export default Page;
