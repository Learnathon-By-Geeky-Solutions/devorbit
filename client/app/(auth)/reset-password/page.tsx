"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Button } from "@/components/Button";

interface ResetPasswordFormData {
  newPassword: string;
  retypeNewPassword: string;
}

export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>();

  const newPassword = watch("newPassword");

  const onSubmit = (data: ResetPasswordFormData) => {
    console.log(data);
    // Handle password reset submission
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
              Reset Your Password
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Enter your new password and confirm it to regain access.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="newPassword"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm"
                placeholder="Enter your new password"
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Retype New Password Field */}
            <div>
              <label
                htmlFor="retypeNewPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Retype New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="retypeNewPassword"
                {...register("retypeNewPassword", {
                  required: "Please retype your new password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm"
                placeholder="Re-type your new password"
              />
              {errors.retypeNewPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.retypeNewPassword.message}
                </p>
              )}
            </div>

            {/* Update Password Button */}
            <Button type="submit" variant="default" className="w-full">
              Update Password
            </Button>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 w-full text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TurfMania. All Rights Reserved.
      </footer>
    </div>
  );
}
