"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, KeyRound, Check, Eye, EyeOff } from "lucide-react";
import TextInput from "@/components/ui/form-fields/text-input";
import { Button } from "@/components/ui/form-fields/button";
import { cn } from "@/lib/utils";

export default function ForgotPasswordForm() {
  // State for multi-step form
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"error" | "success" | "">("");
  
  // Form data for email step
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  
  // Form data for verification code step
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [verificationError, setVerificationError] = useState<string>("");
  
  // Form data for password reset step
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  
  // Password visibility toggles
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Handle email submission (step 1)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setMessage("");
    setMessageType("");
    
    // Basic validation
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This would be replaced with actual API call to request password reset
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Simulate success for UI demo
      setCurrentStep(2);
      setMessage("Verification code has been sent to your email");
      setMessageType("success");
    } catch (error) {
      setMessage("Failed to send verification code. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification code submission (step 2)
  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError("");
    setMessage("");
    setMessageType("");
    
    // Basic validation
    if (!verificationCode.trim()) {
      setVerificationError("Verification code is required");
      return;
    }
    
    if (verificationCode.length < 6) {
      setVerificationError("Please enter a valid verification code");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This would be replaced with actual API call to verify code
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Simulate success for UI demo
      setCurrentStep(3);
      setMessage("Code verified successfully. Please set your new password.");
      setMessageType("success");
    } catch (error) {
      setMessage("Invalid verification code. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset submission (step 3)
  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmPasswordError("");
    setMessage("");
    setMessageType("");
    
    let hasError = false;
    
    // Basic validation
    if (!newPassword) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      hasError = true;
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }
    
    if (hasError) return;
    
    setIsLoading(true);
    
    try {
      // This would be replaced with actual API call to reset password
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Simulate success for UI demo
      setCurrentStep(4);
      setMessage("Your password has been successfully reset!");
      setMessageType("success");
    } catch (error) {
      setMessage("Failed to reset password. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to previous step
  const handleGoBack = () => {
    setMessage("");
    setMessageType("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full max-w-[95%] sm:max-w-md mx-auto px-4 sm:px-0">
      {/* Step 1: Email Input */}
      {currentStep === 1 && (
        <form onSubmit={handleEmailSubmit} className="space-y-4 sm:space-y-6">
          <div className="text-center space-y-1 sm:space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-main-color tracking-tight">
              Forgot Password
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Enter your email to reset your password
            </p>
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
          )}

          <TextInput
            id="email"
            name="email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            disabled={isLoading}
            icon={<Mail size={18} />}
            aria-label="Email"
          />

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-main-red hover:bg-main-red/90 text-white transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-main-color hover:text-main-red transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </form>
      )}

      {/* Step 2: Verification Code */}
      {currentStep === 2 && (
        <form onSubmit={handleVerificationSubmit} className="space-y-4 sm:space-y-6">
          <div className="text-center space-y-1 sm:space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-main-color tracking-tight">
              Verification
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Enter the verification code sent to your email
            </p>
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
          )}

          <TextInput
            id="verification-code"
            name="verificationCode"
            type="text"
            placeholder="Enter 6-digit code"
            required
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
            error={verificationError}
            disabled={isLoading}
            icon={<Check size={18} />}
            aria-label="Verification Code"
            maxLength={6}
          />

          <div className="pt-2 flex flex-col space-y-3">
            <Button 
              type="submit" 
              className="w-full bg-main-red hover:bg-main-red/90 text-white transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleGoBack}
              disabled={isLoading}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
          </div>
        </form>
      )}

      {/* Step 3: Reset Password */}
      {currentStep === 3 && (
        <form onSubmit={handlePasswordResetSubmit} className="space-y-4 sm:space-y-6">
          <div className="text-center space-y-1 sm:space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-main-color tracking-tight">
              Reset Password
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Create your new password
            </p>
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
          )}          <div className="relative">
            <TextInput
              id="new-password"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              icon={<KeyRound size={18} />}
              aria-label="New Password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-0 bottom-0 my-auto flex items-center text-main-color hover:text-hover-blue transition-colors h-fit"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordError && (
            <p className="text-xs text-main-red mt-1">{passwordError}</p>
          )}

          <div className="relative">
            <TextInput
              id="confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              icon={<KeyRound size={18} />}
              aria-label="Confirm Password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-0 bottom-0 my-auto flex items-center text-main-color hover:text-hover-blue transition-colors h-fit"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {confirmPasswordError && (
            <p className="text-xs text-main-red mt-1">{confirmPasswordError}</p>
          )}

          <div className="pt-2 flex flex-col space-y-3">
            <Button 
              type="submit" 
              className="w-full bg-main-red hover:bg-main-red/90 text-white transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleGoBack}
              disabled={isLoading}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
          </div>
        </form>
      )}

      {/* Step 4: Success */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3 inline-block">
                <Check size={36} className="text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-main-color tracking-tight mt-4">
              Password Reset Successful
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/login">
              <Button 
                type="button" 
                className="w-full bg-main-red hover:bg-main-red/90 text-white transition-colors"
              >
                Return to Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
