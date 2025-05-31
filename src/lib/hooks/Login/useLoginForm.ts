import { useState } from 'react';

interface LoginFormState {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormErrors {
  username?: string;
  password?: string;
}

type MessageType = 'success' | 'error' | '';

export function useLoginForm(onSubmit: (data: LoginFormState) => Promise<void>) {
  // Initialize rememberMe from localStorage if available
  const savedRememberMe = typeof window !== 'undefined' ? localStorage.getItem('rememberMe') === 'true' : false;
  const savedUsername = typeof window !== 'undefined' ? localStorage.getItem('username') : '';

  const [formData, setFormData] = useState<LoginFormState>({
    username: savedUsername || '',
    password: '',
    rememberMe: savedRememberMe,
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('');

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));

    // Handle remember me checkbox
    if (name === 'rememberMe') {
      if (checked) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('username', formData.username);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('username');
      }
    }

    // Clear error when user starts typing
    if (errors[name as keyof LoginFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      await onSubmit(formData);
      setMessage('Login successful!');
      setMessageType('success');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    showPassword,
    handleSubmit,
    handleChange,
    setShowPassword,
    message,
    messageType,
  };
}
