"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { UserCircle2, KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";
import TextInput from "@/components/ui/form-fields/text-input";
import { Checkbox } from "@/components/ui/form-fields/checkbox";
import { Button } from "@/components/ui/form-fields/button";
import { useLoginForm } from "@/lib/hooks/Login/useLoginForm";
import { cn } from "@/lib/utils";
import { validateCredentials } from "@/lib/utils/auth";

export default function LoginForm() {
  const {
    formData,
    errors,
    isLoading,
    showPassword,
    handleSubmit,
    handleChange,
    setShowPassword,
    message,
    messageType,  } = useLoginForm(async (data) => {
    console.log("Attempting login with:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
    
    if (validateCredentials(data.username, data.password)) {
      localStorage.setItem('authToken', 'test-token-123'); // Set a dummy token
      window.location.href = '/dashboard'; // Redirect to dashboard
    } else {
      throw new Error("Invalid username or password. Try admin/S4pfmel3");
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (    <div className="w-full max-w-[95%] sm:max-w-md mx-auto px-4 sm:px-0">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="text-center space-y-1 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-main-color tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm sm:text-base text-gray-600">Sign in to DROMIC IS</p>
        </div>

        {message && (
          <div
            role="alert"            className={cn(
              "p-2.5 sm:p-3 rounded-md text-center text-xs sm:text-sm font-medium border",
              messageType === "error"
                ? "bg-red-50 border-main-red text-main-red"
                : "bg-blue-50 border-main-color text-main-color"
            )}
          >
            {message}
          </div>
        )}

        <TextInput
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          autoComplete="username"
          required
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          disabled={isLoading}
          icon={<UserCircle2 size={18} />}
          aria-label="Username"
        />

        <div className="relative">
          <TextInput
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
            icon={<KeyRound size={18} />}
            aria-label="Password"
          />          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-main-color hover:text-hover-blue transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <Checkbox
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            label="Remember me"
          />

          <Link
            href="/forgot-password"
            className="text-xs sm:text-sm font-medium text-main-color hover:text-hover-blue transition-colors"
          >
            Forgot your password?
          </Link>
        </div><Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-main-color hover:bg-hover-blue text-white transition-colors"
          variant="main"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <div className="text-center space-y-1">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link 
              href="/register" 
              className="font-medium text-main-color hover:text-accent-purple transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}