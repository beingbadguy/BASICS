"use client";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/store";
import { useRouter } from "next/navigation";

interface Newsletter {
  _id: string;
  email: string;
  createdAt: string;
}

interface ContactQuery {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const AnalysisPage = () => {
  const { user } = useAuthStore();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [newslettersLoading, setNewslettersLoading] = useState(false);
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [queriesLoading, setQueriesLoading] = useState(false);
  const router = useRouter();

  const fetchQueries = async () => {
    setQueriesLoading(true);
    try {
      const response = await axios.get("/api/contact");
      setQueries(response.data.contacts || []);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      } else {
        console.log(error);
      }
    } finally {
      setQueriesLoading(false);
    }
  };

  const fetchNewsletter = async () => {
    setNewslettersLoading(true);
    try {
      const response = await axios.get("/api/newsletter");
      setNewsletters(response.data.newsletters || []);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      } else {
        console.log(error);
      }
    } finally {
      setNewslettersLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletter();
    fetchQueries();
    if (!user) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="mt-2 overflow-y-scroll max-h-[90vh] pt-20 pb-20 md:pt-0 md:mb-0 md:px-4">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">
        Analysis Dashboard
      </h1>

      {/* Newsletter Section */}
      <div>
        <h2 className="md:text-xl font-semibold text-gray-600 mb-3">
          📬 Newsletter Subscriptions
        </h2>
        {newslettersLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="animate-spin w-6 h-6 text-purple-500" />
          </div>
        ) : newsletters.length === 0 ? (
          <p className="text-gray-500">No newsletter subscriptions yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                {newsletters.map((item) => (
                  <tr key={item._id} className="border-t">
                    <td className="px-4 py-3">{item.email}</td>
                    <td className="px-4 py-3">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Contact Queries Section */}
      <div className="my-6">
        <h2 className="md:text-xl font-semibold text-gray-600 mb-3">
          💬 Contact Queries
        </h2>
        {queriesLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="animate-spin w-6 h-6 text-purple-500" />
          </div>
        ) : queries.length === 0 ? (
          <p className="text-gray-500">No contact queries yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Message</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                {queries.map((item) => (
                  <tr key={item._id} className="border-t">
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.email}</td>
                    <td
                      className="px-4 py-3 max-w-sm truncate"
                      title={item.message}
                    >
                      {item.message}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
