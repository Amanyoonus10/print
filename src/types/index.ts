export interface CompanyInfo {
  name: string;
  shortName: string;
  tagline: string;
  subStatement: string;
  description: {
    heroStatement: string;
    body1: string;
    body2: string;
    body3: string;
  };
  pillars: {
    title: string;
    description: string;
  }[];
  contact: {
    phone: string;
    phoneFormatted: string;
    email: string;
    website: string;
    cr: string;
    location: string;
    country: string;
  };
}

export interface ServiceItem {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  heroImage: string;
  previewImage: string;
  features: string[];
  materials: string[];
  applications: string[];
  gallery: {
    url: string;
    title: string;
    caption: string;
  }[];
  accentColor?: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  serviceSlug: string;
  client: string;
  year: string;
  coverImage: string;
  summary: string;
  description: string;
  challenge?: string;
  solution?: string;
  scope: string[];
  gallery: {
    url: string;
    title: string;
    caption: string;
  }[];
  featured?: boolean;
}

export interface ClientItem {
  id: string;
  name: string;
  sector: 'Aviation & Transport' | 'Banking & Finance' | 'Education & Science' | 'Hospitality & Luxury' | 'Retail & Commercial' | 'Sports & Events';
  logoPlaceholder?: string;
  highlightWork?: string;
}

export interface InquiryFormData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  services: string[];
  projectDescription: string;
  budgetRange?: string;
  timeline?: string;
}
