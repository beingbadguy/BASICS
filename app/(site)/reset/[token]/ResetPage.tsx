"use client";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function ResetPage({ token }: { token: string }) {
  console.log("Token received:", token); // ✅ Debugging

  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6 || password !== confirmPassword) {
      setError(
        "Password must be at least 6 characters long and match the confirmation."
      );
      return;
    }

    setLoading(true);
    try {
      await axios.post(`/api/reset-password/${token}`, { password });
      setError("Password reset successful!");
      router.push("/confirm");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
        setError(error.response?.data?.message || "An error occurred.");
      } else {
        console.error("An unknown error occurred:", error);
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 flex-col min-h-[70vh] w-full">
      <h1>Change Password</h1>

      <form
        onSubmit={changePassword}
        className="flex items-center justify-center flex-col gap-4 w-[80%] md:w-[30%]"
      >
        <div className="relative w-full">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
          {showPassword ? (
            <FiEye
              className="absolute top-[10px] right-4 cursor-pointer"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            />
          ) : (
            <FiEyeOff
              className="absolute top-[10px] right-4 cursor-pointer"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            />
          )}
        </div>
        <div className="w-full relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            className="w-full"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {showConfirmPassword ? (
            <FiEye
              className="absolute top-[10px] right-4 cursor-pointer"
              onClick={() => {
                setShowConfirmPassword(!showConfirmPassword);
              }}
            />
          ) : (
            <FiEyeOff
              className="absolute top-[10px] right-4 cursor-pointer"
              onClick={() => {
                setShowConfirmPassword(!showConfirmPassword);
              }}
            />
          )}
        </div>
        <Button
          disabled={loading}
          type="submit"
          className="w-full cursor-pointer"
        >
          {loading ? (
            <AiOutlineLoading3Quarters className=" animate-spin text-white" />
          ) : (
            "Reset Password"
          )}
        </Button>
        <div className="mx-4 text-center w-[80%] flex items-center justify-center">
          {error && (
            <p className="text-red-500 text-sm text-center  ">{error}</p>
          )}
        </div>{" "}
      </form>
    </div>
  );
}
