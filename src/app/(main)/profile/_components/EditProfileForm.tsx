"use client";

import React, { useState } from 'react';
import { UserData } from '@/lib/utils/auth';
import TextInput from '@/components/ui/form-fields/text-input';
import LocationDropdown from '@/components/ui/form-fields/location-dropdown';
import { Button } from '@/components/ui/form-fields/button';
import { useLocationDropdown } from '@/lib/hooks/useLocationDropdown';
import { useUser } from '@/lib/contexts/UserContext';
import { User, Phone, MapPin, Calendar, Briefcase, Save, X } from 'lucide-react';

interface EditProfileFormProps {
  user: UserData;
  onUpdate: () => void;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  address: string;
  jobTitle: string;
  division: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  dateOfBirth: string;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Get UserContext to update global user state
  const { refreshUser } = useUser();

  // Initialize form data with user's current data
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: user.profile.firstName || '',
    lastName: user.profile.lastName || '',
    middleName: user.profile.middleName || '',
    phoneNumber: user.profile.phoneNumber || '',
    address: user.profile.address || '',
    jobTitle: user.profile.jobTitle || '',
    division: user.profile.division || '',
    region: user.profile.region || '',
    province: user.profile.province || '',
    city: user.profile.city || '',
    barangay: user.profile.barangay || '',
    dateOfBirth: user.profile.dateOfBirth ? user.profile.dateOfBirth.split('T')[0] : '',
  });

  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

  // Location dropdown hook
  const location = useLocationDropdown();

  // Set initial location values
  React.useEffect(() => {
    if (user.profile.region) {
      const region = location.options.regions.find(r => r.name === user.profile.region);
      if (region) {
        location.setSelectedRegion(region.reg_id.toString());
      }
    }
    if (user.profile.province) {
      const province = location.options.provinces.find(p => p.name === user.profile.province);
      if (province) {
        location.setSelectedProvince(province.prov_id.toString());
      }
    }
    if (user.profile.city) {
      const city = location.options.cities.find(c => c.name === user.profile.city);
      if (city) {
        location.setSelectedCity(city.city_id.toString());
      }
    }    if (user.profile.barangay) {
      const barangay = location.options.barangays.find(b => b.name === user.profile.barangay);
      if (barangay) {
        location.setSelectedBarangay(barangay.brgy_id.toString());
      }
    }
  }, [user, location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ProfileFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleLocationChange = (field: string, value: string): void => {
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
    const regionName = field === 'region' ? 
      (location.options.regions.find(r => r.reg_id.toString() === value)?.name || '') :
      formData.region;
    const provinceName = field === 'province' ? 
      (location.options.provinces.find(p => p.prov_id.toString() === value)?.name || '') :
      formData.province;
    const cityName = field === 'city' ? 
      (location.options.cities.find(c => c.city_id.toString() === value)?.name || '') :
      formData.city;    const barangayName = field === 'barangay' ? 
      (location.options.barangays.find(b => b.brgy_id.toString() === value)?.name || '') :
      formData.barangay;

    setFormData(prev => ({
      ...prev,
      region: regionName,
      province: provinceName,
      city: cityName,
      barangay: barangayName
    }));

    // Clear error when user selects a location
    if (errors[field as keyof ProfileFormData]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!formData.region.trim()) newErrors.region = 'Region is required';
    if (!formData.province.trim()) newErrors.province = 'Province is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';

    // Validate age (must be 18+)
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage('Please correct the errors above');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          updateType: 'profile',
          ...formData
        }),
      });

      const result = await response.json();      if (response.ok) {
        setMessage('Profile updated successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 2000);
        setIsEditing(false);
        
        // Update both local state and global UserContext
        onUpdate(); // Refresh local user data in profile page
        await refreshUser(); // Refresh global user data for navigation
      } else {
        setMessage(result.error || 'Failed to update profile');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage('An error occurred while updating your profile');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      firstName: user.profile.firstName || '',
      lastName: user.profile.lastName || '',
      middleName: user.profile.middleName || '',
      phoneNumber: user.profile.phoneNumber || '',
      address: user.profile.address || '',
      jobTitle: user.profile.jobTitle || '',
      division: user.profile.division || '',
      region: user.profile.region || '',
      province: user.profile.province || '',
      city: user.profile.city || '',
      barangay: user.profile.barangay || '',
      dateOfBirth: user.profile.dateOfBirth ? user.profile.dateOfBirth.split('T')[0] : '',
    });
    setErrors({});
    setMessage('');
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <User className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
          </div>
        )}
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md text-sm ${
          messageType === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              id="firstName"
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
              disabled={!isEditing || isLoading}
              icon={<User size={18} />}
              required
            />

            <TextInput
              id="lastName"
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              error={errors.lastName}
              disabled={!isEditing || isLoading}
              icon={<User size={18} />}
              required
            />

            <TextInput
              id="middleName"
              name="middleName"
              label="Middle Name"
              value={formData.middleName}
              onChange={handleInputChange}
              error={errors.middleName}
              disabled={!isEditing || isLoading}
              icon={<User size={18} />}
            />

            <TextInput
              id="dateOfBirth"
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              error={errors.dateOfBirth}
              disabled={!isEditing || isLoading}
              icon={<Calendar size={18} />}
              required
            />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={errors.phoneNumber}
              disabled={!isEditing || isLoading}
              icon={<Phone size={18} />}
              required
            />

            <TextInput
              id="address"
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleInputChange}
              error={errors.address}
              disabled={!isEditing || isLoading}
              icon={<MapPin size={18} />}
              required
            />
          </div>
        </div>

        {/* Work Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Work Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              id="jobTitle"
              name="jobTitle"
              label="Job Title"
              value={formData.jobTitle}
              onChange={handleInputChange}
              error={errors.jobTitle}
              disabled={!isEditing || isLoading}
              icon={<Briefcase size={18} />}
              required
            />

            <TextInput
              id="division"
              name="division"
              label="Division"
              value={formData.division}
              onChange={handleInputChange}
              error={errors.division}
              disabled={!isEditing || isLoading}
              icon={<Briefcase size={18} />}
            />
          </div>
        </div>

        {/* Location Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Location Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LocationDropdown
              id="region"
              name="region"
              label="Region"
              value={location.selectedRegion}
              onChange={(value) => handleLocationChange('region', value)}
              options={location.options.regions.map(r => ({ id: r.reg_id, name: r.name }))}
              placeholder="Select Region"
              disabled={!isEditing || isLoading}
              error={errors.region}
              required
            />

            <LocationDropdown
              id="province"
              name="province"
              label="Province"
              value={location.selectedProvince}
              onChange={(value) => handleLocationChange('province', value)}
              options={location.options.provinces.map(p => ({ id: p.prov_id, name: p.name }))}
              placeholder="Select Province"
              disabled={!isEditing || isLoading || !location.selectedRegion}
              error={errors.province}
              required
            />

            <LocationDropdown
              id="city"
              name="city"
              label="City/Municipality"
              value={location.selectedCity}
              onChange={(value) => handleLocationChange('city', value)}
              options={location.options.cities.map(c => ({ id: c.city_id, name: c.name }))}
              placeholder="Select City/Municipality"
              disabled={!isEditing || isLoading || !location.selectedProvince}
              error={errors.city}
              required
            />

            <LocationDropdown
              id="barangay"
              name="barangay"
              label="Barangay"
              value={location.selectedBarangay}
              onChange={(value) => handleLocationChange('barangay', value)}
              options={location.options.barangays.map(b => ({ id: b.brgy_id, name: b.name }))}
              placeholder="Select Barangay (Optional)"
              disabled={!isEditing || isLoading || !location.selectedCity}
              error={errors.barangay}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditProfileForm;
