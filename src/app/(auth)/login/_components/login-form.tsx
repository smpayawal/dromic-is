"use client";

import React from "react";
import Link from "next/link";
import { Mail, KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";
import TextInput from "@/components/ui/form-fields/text-input";
import { Checkbox } from "@/components/ui/form-fields/checkbox";
import { Button } from "@/components/ui/form-fields/button";
import { useLoginForm } from "@/lib/hooks/Login/useLoginForm";
import { cn } from "@/lib/utils";


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
    console.log("Attempting login with:", { emailOrUsername: data.email });
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Login successful
        console.log('Login successful:', result);
        
        // Save remember me preference
        if (data.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('email', data.email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('email');
        }
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        // Login failed
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full max-w-[95%] sm:max-w-md mx-auto px-4 sm:px-0">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="text-center space-y-1 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-main-color tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm sm:text-base text-gray-600">Sign in to DROMIC IS</p>
        </div>

        {message && (
          <div
            role="alert"
            className={cn(
              "p-2.5 sm:p-3 rounded-md text-center text-xs sm:text-sm font-medium border",
              messageType === "error"
                ? "bg-red-50 border-main-red text-main-red"
                : "bg-blue-50 border-main-color text-main-color"
            )}
          >
            {message}
          </div>
        )}        <TextInput
          id="email"
          name="email"
          type="text"
          placeholder="Email Address or Username"
          autoComplete="username"
          required
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isLoading}
          icon={<Mail size={18} />}
          aria-label="Email Address or Username"
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
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-main-color hover:text-hover-blue transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
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
        </div>

        <Button
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
