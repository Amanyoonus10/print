import React, { createContext, useContext, useState, useEffect } from 'react';
import { companyData as initialCompanyData } from '../data/company';
import { servicesData as initialServicesData } from '../data/services';
import { projectsData as initialProjectsData } from '../data/projects';
import type { ServiceItem, ProjectItem, CompanyInfo } from '../types';

export interface IntroImageItem {
  id: string;
  url: string;
  title: string;
  subtitle?: string;
}

const DEFAULT_INTRO_IMAGES: IntroImageItem[] = [
  {
    id: 'intro-1',
    url: '/images/user_extracted/Page_02_Image_01.jpeg',
    title: 'High-Speed Roll-to-Roll Wide-Format Printing',
    subtitle: 'Modern Equipment & Technology',
  },
  {
    id: 'intro-2',
    url: '/images/user_extracted/Page_02_Image_02.jpeg',
    title: 'Precision UV Flatbed Substrate Press',
    subtitle: 'Doha Facility',
  },
];

interface ContentContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  setEditMode: (enabled: boolean) => void;

  // Company / Intro
  company: CompanyInfo;
  introImages: IntroImageItem[];
  updateCompanyDescription: (updates: Partial<CompanyInfo['description']>) => void;
  addIntroImage: (image: { url: string; title: string; subtitle?: string }) => void;
  removeIntroImage: (id: string) => void;

  // Services
  services: ServiceItem[];
  updateService: (slug: string, updates: Partial<ServiceItem>) => void;
  addServiceGalleryImage: (serviceSlug: string, image: { url: string; title: string; caption?: string }) => void;
  removeServiceGalleryImage: (serviceSlug: string, imageIndex: number) => void;

  // Projects / Featured Work
  projects: ProjectItem[];
  addProject: (project: Omit<ProjectItem, 'id' | 'slug'> & { slug?: string }) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;

  // Reset / Export
  resetToDefaults: () => void;
  exportContentJSON: () => void;
}

const ContentContext = createContext<ContentContextType | null>(null);

const STORAGE_KEYS = {
  COMPANY: 'face_printing_company_content_v1',
  INTRO_IMAGES: 'face_printing_intro_images_v1',
  SERVICES: 'face_printing_services_content_v1',
  PROJECTS: 'face_printing_projects_content_v1',
  EDIT_MODE: 'face_printing_edit_mode_active',
};

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EDIT_MODE);
    return saved ? JSON.parse(saved) : true; // default to true so controls are visible and discoverable
  });

  // Company state
  const [company, setCompany] = useState<CompanyInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPANY);
      return saved ? JSON.parse(saved) : initialCompanyData;
    } catch {
      return initialCompanyData;
    }
  });

  // Intro Images state
  const [introImages, setIntroImages] = useState<IntroImageItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTRO_IMAGES);
      return saved ? JSON.parse(saved) : DEFAULT_INTRO_IMAGES;
    } catch {
      return DEFAULT_INTRO_IMAGES;
    }
  });

  // Services state
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : initialServicesData;
    } catch {
      return initialServicesData;
    }
  });

  // Projects state
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : initialProjectsData;
    } catch {
      return initialProjectsData;
    }
  });

  // Persist edits to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EDIT_MODE, JSON.stringify(isEditMode));
  }, [isEditMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(company));
  }, [company]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTRO_IMAGES, JSON.stringify(introImages));
  }, [introImages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  const toggleEditMode = () => setIsEditMode(prev => !prev);
  const setEditMode = (enabled: boolean) => setIsEditMode(enabled);

  // Intro image methods
  const addIntroImage = (image: { url: string; title: string; subtitle?: string }) => {
    const newItem: IntroImageItem = {
      id: `intro-${Date.now()}`,
      url: image.url,
      title: image.title,
      subtitle: image.subtitle || 'Doha Facility',
    };
    setIntroImages(prev => [...prev, newItem]);
  };

  const removeIntroImage = (id: string) => {
    setIntroImages(prev => prev.filter(img => img.id !== id));
  };

  const updateCompanyDescription = (updates: Partial<CompanyInfo['description']>) => {
    setCompany(prev => ({
      ...prev,
      description: {
        ...prev.description,
        ...updates,
      },
    }));
  };

  // Services methods
  const updateService = (slug: string, updates: Partial<ServiceItem>) => {
    setServices(prev =>
      prev.map(s => (s.slug === slug ? { ...s, ...updates } : s))
    );
  };

  const addServiceGalleryImage = (
    serviceSlug: string,
    image: { url: string; title: string; caption?: string }
  ) => {
    setServices(prev =>
      prev.map(s => {
        if (s.slug !== serviceSlug) return s;
        return {
          ...s,
          gallery: [
            ...s.gallery,
            {
              url: image.url,
              title: image.title || s.title,
              caption: image.caption || 'Authentic Production Exhibit',
            },
          ],
        };
      })
    );
  };

  const removeServiceGalleryImage = (serviceSlug: string, imageIndex: number) => {
    setServices(prev =>
      prev.map(s => {
        if (s.slug !== serviceSlug) return s;
        return {
          ...s,
          gallery: s.gallery.filter((_, idx) => idx !== imageIndex),
        };
      })
    );
  };

  // Projects methods
  const addProject = (projectData: Omit<ProjectItem, 'id' | 'slug'> & { slug?: string }) => {
    const id = `project-${Date.now()}`;
    const slug =
      projectData.slug ||
      projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProj: ProjectItem = {
      ...projectData,
      id,
      slug,
      gallery: projectData.gallery || [
        {
          url: projectData.coverImage,
          title: projectData.title,
          caption: projectData.summary,
        },
      ],
      featured: projectData.featured ?? true,
    };
    setProjects(prev => [newProj, ...prev]);
  };

  const removeProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  // Reset to original repository defaults
  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all content, images, and descriptions to original defaults?')) {
      setCompany(initialCompanyData);
      setIntroImages(DEFAULT_INTRO_IMAGES);
      setServices(initialServicesData);
      setProjects(initialProjectsData);
      localStorage.removeItem(STORAGE_KEYS.COMPANY);
      localStorage.removeItem(STORAGE_KEYS.INTRO_IMAGES);
      localStorage.removeItem(STORAGE_KEYS.SERVICES);
      localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    }
  };

  // Export JSON backup
  const exportContentJSON = () => {
    const data = {
      company,
      introImages,
      services,
      projects,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `face-printing-content-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ContentContext.Provider
      value={{
        isEditMode,
        toggleEditMode,
        setEditMode,
        company,
        introImages,
        updateCompanyDescription,
        addIntroImage,
        removeIntroImage,
        services,
        updateService,
        addServiceGalleryImage,
        removeServiceGalleryImage,
        projects,
        addProject,
        removeProject,
        updateProject,
        resetToDefaults,
        exportContentJSON,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
