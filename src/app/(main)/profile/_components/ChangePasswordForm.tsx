"use client";

import React, { useState } from 'react';
import TextInput from '@/components/ui/form-fields/text-input';
import { Button } from '@/components/ui/form-fields/button';
import { Lock, Eye, EyeOff, Shield, Check, X } from 'lucide-react';

interface ChangePasswordFormProps {
  onPasswordChanged: () => void;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onPasswordChanged }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Partial<PasswordFormData>>({});

  // Password strength checker
  const checkPasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    return {
      score,
      feedback,
      isValid: score >= 4
    };
  };

  const passwordStrength = checkPasswordStrength(formData.newPassword);

  const getStrengthColor = (score: number): string => {
    if (score < 2) return 'bg-red-500';
    if (score < 3) return 'bg-yellow-500';
    if (score < 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number): string => {
    if (score < 2) return 'Weak';
    if (score < 3) return 'Fair';
    if (score < 4) return 'Good';
    return 'Strong';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof PasswordFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Clear message when user starts typing
    if (message) {
      setMessage('');
      setMessageType('');
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PasswordFormData> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!passwordStrength.isValid) {
      newErrors.newPassword = 'Password does not meet requirements';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmNewPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password changed successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 2000);
        // Reset form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Notify parent component
        onPasswordChanged();
      } else {
        setMessage(data.error || 'Failed to change password');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setMessage('An error occurred while changing password');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
            <p className="text-sm text-gray-600">Update your account password to keep it secure</p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800">Security Tips:</p>
              <ul className="text-amber-700 mt-1 space-y-1">
                <li>• Use a unique password that you don't use elsewhere</li>
                <li>• Include a mix of letters, numbers, and special characters</li>
                <li>• Avoid common words or personal information</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <TextInput
            label="Current Password"
            name="currentPassword"
            type={showPasswords.current ? 'text' : 'password'}
            value={formData.currentPassword}
            onChange={handleInputChange}
            error={errors.currentPassword}
            icon={<Lock className="h-5 w-5" />}
            rightElement={
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="h-5 w-5 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <EyeOff /> : <Eye />}
              </button>
            }
            required
          />

          {/* New Password */}
          <div className="space-y-3">
            <TextInput
              label="New Password"
              name="newPassword"
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleInputChange}
              error={errors.newPassword}
              icon={<Lock className="h-5 w-5" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="h-5 w-5 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff /> : <Eye />}
                </button>
              }
              required
            />

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Password Strength:</span>
                  <span className={`text-sm font-medium ${
                    passwordStrength.score < 2 ? 'text-red-600' :
                    passwordStrength.score < 3 ? 'text-yellow-600' :
                    passwordStrength.score < 4 ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {getStrengthText(passwordStrength.score)}
                  </span>
                </div>
                
                {/* Strength Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>

                {/* Requirements Checklist */}
                {passwordStrength.feedback.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">Requirements:</p>
                    <ul className="space-y-1">
                      {[
                        'At least 8 characters',
                        'One uppercase letter', 
                        'One lowercase letter',
                        'One number',
                        'One special character'
                      ].map((requirement) => {
                        const isComplete = !passwordStrength.feedback.includes(requirement);
                        return (
                          <li key={requirement} className="flex items-center space-x-2 text-sm">
                            {isComplete ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-gray-400" />
                            )}
                            <span className={isComplete ? 'text-green-700' : 'text-gray-500'}>
                              {requirement}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <TextInput
            label="Confirm New Password"
            name="confirmPassword"
            type={showPasswords.confirm ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            icon={<Lock className="h-5 w-5" />}
            rightElement={
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="h-5 w-5 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <EyeOff /> : <Eye />}
              </button>
            }
            required
          />

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-center space-x-2">
                {messageType === 'success' ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <X className="h-5 w-5" />
                )}
                <span className="text-sm font-medium">{message}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Button
              type="submit"
              disabled={isLoading || !passwordStrength.isValid}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Changing Password...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Change Password</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
