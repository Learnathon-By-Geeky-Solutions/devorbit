"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/Button";

interface SignInFormData {
  email: string;
  password: string;
}

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const onSubmit = (data: SignInFormData) => {
    console.log(data);
    // Handle form submission
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
              Welcome Back!
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Sign in to continue booking your perfect sports field.
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

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                {...register("password", { required: "Password is required" })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm "
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right text-sm mt-2">
              <Link
                href="/forgot-password"
                className="text-gray-600 font-medium hover:text-green-700 underline"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button type="submit" variant="default" className="w-full">
              Sign In
            </Button>
          </form>

          {/* Footer Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-gray-600 font-medium hover:text-green-700 underline"
            >
              Sign up
            </Link>
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
