import { useState } from 'react';

interface RegisterFormState {
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  firstName: string;
  lastName: string;
  middleInitial: string;
  username: string;
  dateOfBirth: string;
  phoneNumber: string;
  position: string;
  division: string;
  jobTitle: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  termsAccepted: boolean;
}

interface RegisterFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  middleInitial?: string;
  username?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  position?: string;
  division?: string;
  jobTitle?: string;
  region?: string;
  province?: string;
  city?: string;
  barangay?: string;
  termsAccepted?: string;
}

type MessageType = 'success' | 'error' | '';

export function useRegisterForm(onSubmit: (data: RegisterFormState) => Promise<void>) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormState>({
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    firstName: '',
    lastName: '',
    middleInitial: '',
    username: '',
    dateOfBirth: '',
    phoneNumber: '',
    position: '',
    division: '',
    jobTitle: '',
    region: '',
    province: '',
    city: '',
    barangay: '',
    termsAccepted: false,
  });
  
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('');

  const validateStep = (step: number): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (step === 1) {
      // Email validation
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      // Password validation
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, and number';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      // Username validation
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      }
    } else if (step === 2) {
      // Personal information validation
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
      } else {
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18) {
          newErrors.dateOfBirth = 'You must be at least 18 years old';
        }
      }
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
    } else if (step === 3) {
      // Work information validation
      if (!formData.position) {
        newErrors.position = 'Position is required';
      }
      if (!formData.jobTitle.trim()) {
        newErrors.jobTitle = 'Job title is required';
      }

      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'You must accept the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;
    
    if ((e.target as HTMLInputElement).type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name as keyof RegisterFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const moveToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const moveToPrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 3 && validateStep(currentStep)) {
      setIsLoading(true);
      setMessage('');
      setMessageType('');

      try {
        await onSubmit(formData);
        setMessage('Registration successful!');
        setMessageType('success');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Registration failed. Please try again.');
        setMessageType('error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
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
    setShowConfirmPassword,
  };
}
