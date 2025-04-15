"use client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/store";
import axios, { AxiosError } from "axios";
import { Eraser, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal"; // Add the import
import EditCategoryModal from "@/components/EditCategoryModal"; // Add the import

interface Category {
  _id: string;
  name: string;
  categoryImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Page = () => {
  const { user } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const router = useRouter();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/category");
      setCategories(response.data.categories);
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

  const deleteHandler = async (id: string) => {
    try {
      await axios.delete(`/api/category/${id}`);
      fetchCategories();
      setDeleteModalOpen(false); // Close the modal after delete
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  };

  const updateCategory = async (id: string, name: string) => {
    try {
      await axios.put(`/api/category/${id}`, { name });
      fetchCategories();
      setEditModalOpen(false); // Close the modal after update
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  };

  const searchedProducts = categories.filter((cat) =>
    cat.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    fetchCategories();
    if (!user) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="mt-2 overflow-y-scroll max-h-[90vh] pt-20 pb-20 md:pt-0 md:mb-0">
      <div className="flex items-start justify-start flex-col md:items-center md:justify-between md:flex-row gap-2">
        <h1 className="font-bold text-2xl text-purple-700">Categories</h1>
        <div className="flex items-center justify-between md:justify-center w-full md:w-auto gap-2 my-2 md:my-0">
          <div className="flex items-center gap-2 px-3 py-[6px] rounded border border-purple-700">
            <Search className="text-purple-700" />
            <input
              type="text"
              placeholder="Search Categories"
              className="outline-none w-full"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
          <Link href={"/addcategory"}>
            <Button className="cursor-pointer">
              <Plus /> Add Category
            </Button>
          </Link>
        </div>
      </div>
      <div
        className={`mt-4 ${
          loading ? "flex items-center justify-center h-screen" : ""
        }`}
      >
        {loading ? (
          <AiOutlineLoading3Quarters className="animate-spin text-3xl text-purple-700" />
        ) : query.length > 1 ? (
          searchedProducts.map((category, index) => (
            <div
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-100" : ""
              } flex items-center justify-between gap-1 mt-2 px-2 rounded py-2`}
            >
              <p>{index + 1}.</p>
              <h1>{category.name}</h1>
              <Image
                src={category.categoryImage}
                alt={category.name}
                width={100}
                height={100}
                className="rounded size-32 object-contain z-0"
              />
              <div className="flex items-center gap-4 mr-4">
                <Trash2
                  className="text-red-500 cursor-pointer"
                  onClick={() => {
                    setCategoryToDelete(category._id);
                    setDeleteModalOpen(true);
                  }}
                />
                <Eraser
                  className="text-purple-700 cursor-pointer"
                  onClick={() => {
                    setCategoryToEdit(category);
                    setEditModalOpen(true);
                  }}
                />
              </div>
            </div>
          ))
        ) : categories?.length === 0 ? (
          "No Categories found"
        ) : (
          categories.map((category, index) => (
            <div
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-100" : ""
              } flex items-center justify-between gap-1 mt-2 px-2 rounded py-2`}
            >
              <p>{index + 1}.</p>
              <h1>{category.name}</h1>
              <Image
                src={category.categoryImage}
                alt={category.name}
                width={100}
                height={100}
                className="rounded size-32 object-contain z-0"
              />
              <div className="flex items-center gap-4 mr-4">
                <Trash2
                  className="text-red-500 cursor-pointer"
                  onClick={() => {
                    setCategoryToDelete(category._id);
                    setDeleteModalOpen(true);
                  }}
                />
                <Eraser
                  className="text-purple-700 cursor-pointer"
                  onClick={() => {
                    setCategoryToEdit(category);
                    setEditModalOpen(true);
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete and Edit Modals */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={() => {
          if (categoryToDelete) deleteHandler(categoryToDelete);
        }}
      />
      <EditCategoryModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        category={categoryToEdit!}
        onUpdate={updateCategory}
      />
    </div>
  );
};

export default Page;
