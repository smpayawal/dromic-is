import { useState, useEffect } from 'react';
import {
  getRegions,
  getProvincesByRegion,
  getCitiesByProvince,
  getBarangaysByCity,
  Region,
  Province,
  City,
  Barangay
} from '@/lib/utils/location';

export interface LocationData {
  region: string;
  province: string;
  city: string;
  barangay: string;
}

export interface LocationOptions {
  regions: Region[];
  provinces: Province[];
  cities: City[];
  barangays: Barangay[];
}

export const useLocationDropdown = (initialData?: Partial<LocationData>) => {
  const [selectedRegion, setSelectedRegion] = useState<string>(initialData?.region || '');
  const [selectedProvince, setSelectedProvince] = useState<string>(initialData?.province || '');
  const [selectedCity, setSelectedCity] = useState<string>(initialData?.city || '');
  const [selectedBarangay, setSelectedBarangay] = useState<string>(initialData?.barangay || '');

  const [options, setOptions] = useState<LocationOptions>({
    regions: [],
    provinces: [],
    cities: [],
    barangays: []
  });

  // Load initial regions
  useEffect(() => {
    const regions = getRegions();
    setOptions(prev => ({ ...prev, regions }));
  }, []);

  // Load provinces when region changes
  useEffect(() => {
    if (selectedRegion) {
      const regionId = parseInt(selectedRegion);
      const provinces = getProvincesByRegion(regionId);
      setOptions(prev => ({ ...prev, provinces, cities: [], barangays: [] }));
      
      // Reset dependent dropdowns
      setSelectedProvince('');
      setSelectedCity('');
      setSelectedBarangay('');
    } else {
      setOptions(prev => ({ ...prev, provinces: [], cities: [], barangays: [] }));
    }
  }, [selectedRegion]);

  // Load cities when province changes
  useEffect(() => {
    if (selectedProvince) {
      const provinceId = parseInt(selectedProvince);
      const cities = getCitiesByProvince(provinceId);
      setOptions(prev => ({ ...prev, cities, barangays: [] }));
      
      // Reset dependent dropdowns
      setSelectedCity('');
      setSelectedBarangay('');
    } else {
      setOptions(prev => ({ ...prev, cities: [], barangays: [] }));
    }
  }, [selectedProvince]);

  // Load barangays when city changes
  useEffect(() => {
    if (selectedCity) {
      const cityId = parseInt(selectedCity);
      const barangays = getBarangaysByCity(cityId);
      setOptions(prev => ({ ...prev, barangays }));
      
      // Reset barangay
      setSelectedBarangay('');
    } else {
      setOptions(prev => ({ ...prev, barangays: [] }));
    }
  }, [selectedCity]);

  return {
    selectedRegion,
    selectedProvince,
    selectedCity,
    selectedBarangay,
    setSelectedRegion,
    setSelectedProvince,
    setSelectedCity,
    setSelectedBarangay,
    options,
    // Helper function to get selected names
    getSelectedNames: () => {
      const region = options.regions.find(r => r.reg_id.toString() === selectedRegion);
      const province = options.provinces.find(p => p.prov_id.toString() === selectedProvince);
      const city = options.cities.find(c => c.city_id.toString() === selectedCity);
      const barangay = options.barangays.find(b => b.brgy_id.toString() === selectedBarangay);
      
      return {
        regionName: region?.name || '',
        provinceName: province?.name || '',
        cityName: city?.name || '',
        barangayName: barangay?.name || ''
      };
    }
  };
};
