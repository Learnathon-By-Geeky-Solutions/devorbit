"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Button } from "@/components/Button";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log("Reset password link sent to:", data.email);
    // Handle sending reset password link here
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Content Section */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl"
        >
          {/* Form Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-medium text-gray-900">
              Forgot Your Password?
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              No worries! Enter your email below and we’ll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  id="email"
                  {...register("email", { required: "Email is required" })}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm "
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" variant="default" className="w-full">
              Send Reset Link
            </Button>
          </form>

          {/* Footer Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Remembered your password? {" "}
            <a
              href="/sign-in"
              className="text-gray-600 font-medium hover:text-green-800 underline"
            >
              Sign in
            </a>
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 w-full text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TurfMania. All Rights Reserved.
      </footer>
    </div>
  );
}
