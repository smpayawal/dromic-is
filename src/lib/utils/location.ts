import regionsData from '@/lib/data/psgc_regions_1q23.json';
import provincesData from '@/lib/data/psgc_provinces_1q23.json';
import citiesData from '@/lib/data/psgc_cities_1q23.json';
import barangaysData from '@/lib/data/psgc_barangays_1q23.json';

export interface Region {
  reg_id: number;
  code_correspondence: string;
  name: string;
  altName: string;
  code: string;
  geo_level: string;
  remarks: string | null;
}

export interface Province {
  prov_id: number;
  code_correspondence: string;
  name: string;
  code: string;
  geo_level: string;
  old_name: string | null;
  income_classification: string;
  region: string;
  region_correspondence: string;
  reg_id: number;
}

export interface City {
  city_id: number;
  code_correspondence: string;
  name: string;
  code: string;
  classification: string;
  old_name: string | null;
  city_class: string | null;
  income_classification: string;
  province: string;
  province_correspondence: string;
  prov_id: number;
}

export interface Barangay {
  brgy_id: number;
  code_correspondence: string;
  name: string;
  code: string;
  geo_level: string;
  old_name: string | null;
  city_class: string | null;
  urb_rur: string;
  city: string;
  city_correspondence: string;
  city_id: number;
}

// Get all regions
export const getRegions = (): Region[] => {
  return regionsData as Region[];
};

// Get provinces by region ID
export const getProvincesByRegion = (regionId: number): Province[] => {
  return provincesData.filter((province: any) => province.reg_id === regionId) as Province[];
};

// Get cities by province ID
export const getCitiesByProvince = (provinceId: number): City[] => {
  return citiesData.filter((city: any) => city.prov_id === provinceId) as City[];
};

// Get barangays by city ID
export const getBarangaysByCity = (cityId: number): Barangay[] => {
  return (barangaysData as any[]).filter((barangay: any) => barangay.city_id === cityId) as Barangay[];
};

// Helper functions to get specific items by ID
export const getRegionById = (regionId: number): Region | undefined => {
  return regionsData.find((region: any) => region.reg_id === regionId) as Region | undefined;
};

export const getProvinceById = (provinceId: number): Province | undefined => {
  return provincesData.find((province: any) => province.prov_id === provinceId) as Province | undefined;
};

export const getCityById = (cityId: number): City | undefined => {
  return citiesData.find((city: any) => city.city_id === cityId) as City | undefined;
};

export const getBarangayById = (barangayId: number): Barangay | undefined => {
  return (barangaysData as any[]).find((barangay: any) => barangay.brgy_id === barangayId) as Barangay | undefined;
};
