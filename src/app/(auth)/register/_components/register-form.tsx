"use client";

import React from "react";
import Link from "next/link";
import { 
  UserCircle2, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Mail, 
  MapPin, 
  Calendar, 
  Phone, 
  Briefcase,
  Building2,
  Loader2,
  GraduationCap
} from "lucide-react";
import TextInput from "@/components/ui/form-fields/text-input";
import LocationDropdown from "@/components/ui/form-fields/location-dropdown";
import { Checkbox } from "@/components/ui/form-fields/checkbox";
import { Button } from "@/components/ui/form-fields/button";
import { cn } from "@/lib/utils";
import { useRegisterForm } from "@/lib/hooks/Register/useRegisterForm";
import { useLocationDropdown } from "@/lib/hooks/useLocationDropdown";

export default function RegisterForm() {
  const {
    currentStep,
    formData,
    errors,
    isLoading,
    showPassword,
    showConfirmPassword,
    message,
    messageType,
    handleChange,
    moveToNextStep,
    moveToPrevStep,
    handleSubmit,
    setShowPassword,
    setShowConfirmPassword,  } = useRegisterForm(async (data) => {
    console.log("Registration data:", data);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          // Account information
          email: data.email,
          username: data.username,
          password: data.password,
          confirmPassword: data.confirmPassword,
          
          // Personal information
          firstName: data.firstName,
          lastName: data.lastName,
          middleInitial: data.middleInitial,
          dateOfBirth: data.dateOfBirth,
          phoneNumber: data.phoneNumber,
          address: data.address,
          
          // Work information
          position: data.position,
          division: data.division,
          jobTitle: data.jobTitle,
          region: data.region,
          province: data.province,
          city: data.city,
          barangay: data.barangay,
          
          // Terms
          termsAccepted: data.termsAccepted,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Registration successful
        console.log('Registration successful:', result);
        
        // Redirect to dashboard (user is automatically logged in)
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        // Registration failed
        throw new Error(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  });

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    if (field === "password") {
      setShowPassword(prev => !prev);
    } else {
      setShowConfirmPassword(prev => !prev);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-6 w-full">
      <div className="flex items-center w-full max-w-xs">
        <div className={cn(
          "rounded-full h-8 w-8 flex items-center justify-center border font-medium text-sm",
          currentStep >= 1 ? "bg-main-red border-main-red text-white" : "border-gray-300 text-gray-500"
        )}>
          1
        </div>
        <div className={cn(
          "flex-1 h-1",
          currentStep >= 2 ? "bg-main-red" : "bg-gray-200"
        )}></div>
        <div className={cn(
          "rounded-full h-8 w-8 flex items-center justify-center border font-medium text-sm",
          currentStep >= 2 ? "bg-main-red border-main-red text-white" : "border-gray-300 text-gray-500"
        )}>
          2
        </div>
        <div className={cn(
          "flex-1 h-1",
          currentStep >= 3 ? "bg-main-red" : "bg-gray-200"
        )}></div>
        <div className={cn(
          "rounded-full h-8 w-8 flex items-center justify-center border font-medium text-sm",
          currentStep >= 3 ? "bg-main-red border-main-red text-white" : "border-gray-300 text-gray-500"
        )}>
          3
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <>
      <div className="text-center space-y-1 sm:space-y-2 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-main-color tracking-tight">
          Account Information
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Create your DROMIC IS account
        </p>
      </div>

      <TextInput
        id="email"
        name="email"
        type="email"
        placeholder="Email Address"
        autoComplete="email"
        required
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        disabled={isLoading}
        icon={<Mail size={18} />}
        aria-label="Email Address"
      />

      <div className="relative">
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
      </div>

      <div className="relative">
        <TextInput
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          autoComplete="new-password"
          required
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isLoading}
          icon={<KeyRound size={18} />}
          aria-label="Password"
          rightElement={
            <button
              type="button"
              onClick={() => togglePasswordVisibility("password")}
              className="text-main-color hover:text-hover-blue transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
      </div>

      <div className="relative">
        <TextInput
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          autoComplete="new-password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={isLoading}
          icon={<KeyRound size={18} />}
          aria-label="Confirm Password"
          rightElement={
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirmPassword")}
              className="text-main-color hover:text-hover-blue transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="text-center space-y-1 sm:space-y-2 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-main-color tracking-tight">
          Personal Information
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Tell us about yourself
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextInput
          id="firstName"
          name="firstName"
          type="text"
          placeholder="First Name"
          autoComplete="given-name"
          required
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          disabled={isLoading}
          aria-label="First Name"
        />

        <TextInput
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Last Name"
          autoComplete="family-name"
          required
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          disabled={isLoading}
          aria-label="Last Name"
        />
      </div>

      <TextInput
        id="middleInitial"
        name="middleInitial"
        type="text"
        placeholder="Middle Initial (Optional)"
        autoComplete="additional-name"
        value={formData.middleInitial}
        onChange={handleChange}
        error={errors.middleInitial}
        disabled={isLoading}
        aria-label="Middle Initial"
        maxLength={1}
      />

      <TextInput
        id="dateOfBirth"
        name="dateOfBirth"
        type="date"
        placeholder="Date of Birth"
        autoComplete="bday"
        required
        value={formData.dateOfBirth}
        onChange={handleChange}
        error={errors.dateOfBirth}
        disabled={isLoading}
        icon={<Calendar size={18} />}
        aria-label="Date of Birth"
      />

      <TextInput
        id="phoneNumber"
        name="phoneNumber"
        type="tel"
        placeholder="Phone Number"
        autoComplete="tel"
        required
        value={formData.phoneNumber}
        onChange={handleChange}
        error={errors.phoneNumber}
        disabled={isLoading}
        icon={<Phone size={18} />}
        aria-label="Phone Number"
      />

      <TextInput
        id="address"
        name="address"
        type="text"
        placeholder="Address"
        autoComplete="street-address"
        required
        value={formData.address}
        onChange={handleChange}
        error={errors.address}
        disabled={isLoading}
        icon={<MapPin size={18} />}
        aria-label="Address"
      />
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="text-center space-y-1 sm:space-y-2 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-main-color tracking-tight">
          Work Information
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Complete your profile
        </p>
      </div>

      <div className="relative">
        <label htmlFor="position" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Position
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-400 h-5 w-5"><Briefcase size={18} /></span>
          </div>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={cn(
              'block w-full appearance-none rounded-md border-[1px] pl-9 sm:pl-10 pr-2.5 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm',
              'text-gray-900',
              'focus:outline-none focus:ring-1 focus:ring-main-color focus:border-main-color',
              errors.position
                ? 'border-main-red text-red-900 placeholder-red-300 focus:ring-main-red focus:border-main-red'
                : 'border-gray-300',
              'disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500'
            )}
            disabled={isLoading}
            required          >
            <option value="">Select Position</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Secretary">Secretary</option>
            <option value="Director">Director</option>
            <option value="Regional Director">Regional Director</option>
            <option value="Central Officer">Central Officer</option>
            <option value="Field Officer">Field Officer</option>
            <option value="Local Government Unit">Local Government Unit</option>
            <option value="Team Leader">Team Leader</option>
          </select>
        </div>
        {errors.position && (
          <p id="position-error" className="mt-1 text-[10px] sm:text-xs text-red-600">
            {errors.position}
          </p>
        )}
      </div>

      <TextInput
        id="division"
        name="division"
        type="text"
        placeholder="Division (Optional)"
        value={formData.division}
        onChange={handleChange}
        error={errors.division}
        disabled={isLoading}
        icon={<Building2 size={18} />}
        aria-label="Division"
      />

      <TextInput
        id="jobTitle"
        name="jobTitle"
        type="text"
        placeholder="Job Title"
        required
        value={formData.jobTitle}
        onChange={handleChange}
        error={errors.jobTitle}
        disabled={isLoading}
        icon={<GraduationCap size={18} />}
        aria-label="Job Title"
      />      <div className="grid grid-cols-2 gap-4">
        <LocationDropdown
          id="region"
          name="region"
          value={location.selectedRegion}
          onChange={(value) => handleLocationChange('region', value)}
          options={location.options.regions.map(r => ({ id: r.reg_id, name: r.name }))}
          placeholder="Select Region"
          disabled={isLoading}
          required={true}
          error={errors.region}
          label="Region"
        />

        <LocationDropdown
          id="province"
          name="province"
          value={location.selectedProvince}
          onChange={(value) => handleLocationChange('province', value)}
          options={location.options.provinces.map(p => ({ id: p.prov_id, name: p.name }))}
          placeholder="Select Province"
          disabled={isLoading || !location.selectedRegion}
          required={true}
          error={errors.province}
          label="Province"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <LocationDropdown
          id="city"
          name="city"
          value={location.selectedCity}
          onChange={(value) => handleLocationChange('city', value)}
          options={location.options.cities.map(c => ({ id: c.city_id, name: c.name }))}
          placeholder="Select City/Municipality"
          disabled={isLoading || !location.selectedProvince}
          required={true}
          error={errors.city}
          label="City/Municipality"
        />

        <LocationDropdown
          id="barangay"
          name="barangay"
          value={location.selectedBarangay}
          onChange={(value) => handleLocationChange('barangay', value)}
          options={location.options.barangays.map(b => ({ id: b.brgy_id, name: b.name }))}
          placeholder="Select Barangay (Optional)"
          disabled={isLoading || !location.selectedCity}
          error={errors.barangay}
          label="Barangay"
        />
      </div>

      <div className="mt-4">
        <Checkbox
          id="termsAccepted"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onChange={handleChange}
          label={<span className="ml-2 text-sm text-gray-600">I agree to the <Link href="/terms" className="text-main-color hover:underline">Terms and Conditions</Link></span>}
        />
        {errors.termsAccepted && (
          <p className="mt-1 text-[10px] sm:text-xs text-red-600">
            {errors.termsAccepted}
          </p>
        )}
      </div>
    </>
  );

  // Location dropdown hook
  const location = useLocationDropdown();

  // Handle location changes and update form data
  const handleLocationChange = (field: string, value: string) => {
    // Update location state
    switch (field) {
      case 'region':
        location.setSelectedRegion(value);
        break;
      case 'province':
        location.setSelectedProvince(value);
        break;
      case 'city':
        location.setSelectedCity(value);
        break;
      case 'barangay':
        location.setSelectedBarangay(value);
        break;
    }
    
    // Update form data with the selected names
    const names = location.getSelectedNames();
    const event = {
      target: {
        name: field,
        value: field === 'region' ? (location.options.regions.find(r => r.reg_id.toString() === value)?.name || '') :
               field === 'province' ? (location.options.provinces.find(p => p.prov_id.toString() === value)?.name || '') :
               field === 'city' ? (location.options.cities.find(c => c.city_id.toString() === value)?.name || '') :
               field === 'barangay' ? (location.options.barangays.find(b => b.brgy_id.toString() === value)?.name || '') : ''
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(event);
  };

  return (
    <div className="w-full max-w-[95%] sm:max-w-md mx-auto px-4 sm:px-0">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {renderStepIndicator()}

        {message && (
          <div
            role="alert"
            className={cn(
              "p-2.5 sm:p-3 rounded-md text-center text-xs sm:text-sm font-medium border mb-4",
              messageType === "error"
                ? "bg-red-50 border-main-red text-main-red"
                : messageType === "success"
                ? "bg-green-50 border-green-600 text-green-600"
                : "bg-blue-50 border-main-color text-main-color"
            )}
          >
            {message}
          </div>
        )}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <div className="flex justify-between mt-6">        {currentStep > 1 ? (
            <Button
              type="button"
              onClick={moveToPrevStep}
              className="px-5 bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
              disabled={isLoading}
            >
              Previous
            </Button>
          ) : (
            <div></div>
          )}
          
          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={moveToNextStep}
              className="px-5 bg-main-color hover:bg-hover-blue text-white transition-colors"
              disabled={isLoading}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              className="px-5 bg-main-color hover:bg-hover-blue text-white transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" /> 
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          )}
        </div>

        <div className="text-center space-y-1 pt-2">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-main-color hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
