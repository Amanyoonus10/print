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
  mediaType?: 'image' | 'video';
}

const DEFAULT_INTRO_IMAGES: IntroImageItem[] = [
  {
    id: 'intro-1',
    url: '/images/user_extracted/Page_02_Image_01.jpeg',
    title: 'High-Speed Roll-to-Roll Wide-Format Printing',
    subtitle: 'Modern Equipment & Technology',
    mediaType: 'image',
  },
  {
    id: 'intro-2',
    url: '/images/user_extracted/Page_02_Image_02.jpeg',
    title: 'Precision UV Flatbed Substrate Press',
    subtitle: 'Doha Facility',
    mediaType: 'image',
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
  addIntroImage: (image: { url: string; title: string; subtitle?: string; mediaType?: 'image' | 'video' }) => void;
  removeIntroImage: (id: string) => void;

  // Services
  services: ServiceItem[];
  updateService: (slug: string, updates: Partial<ServiceItem>) => void;
  addServiceGalleryImage: (serviceSlug: string, image: { url: string; title: string; caption?: string; mediaType?: 'image' | 'video' }) => void;
  removeServiceGalleryImage: (serviceSlug: string, imageIndex: number) => void;

  // Projects / Featured Work
  projects: ProjectItem[];
  addProject: (project: Omit<ProjectItem, 'id' | 'slug'> & { slug?: string }) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;
  addProjectGalleryImage: (projectId: string, image: { url: string; title: string; caption?: string; mediaType?: 'image' | 'video' }) => void;
  removeProjectGalleryImage: (projectId: string, imageIndex: number) => void;

  // Reset / Export
  resetToDefaults: () => void;
  exportContentJSON: () => void;
}

const ContentContext = createContext<ContentContextType | null>(null);

const STORAGE_KEYS = {
  COMPANY: 'face_printing_company_content_v2',
  INTRO_IMAGES: 'face_printing_intro_images_v2',
  SERVICES: 'face_printing_services_content_v2',
  PROJECTS: 'face_printing_projects_content_v2',
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
      if (!saved) return initialServicesData;
      const parsed: ServiceItem[] = JSON.parse(saved);
      return parsed.map((s) => {
        const defaultService = initialServicesData.find((init) => init.slug === s.slug);
        const isValidHero =
          s.heroImage &&
          (s.heroImage.startsWith('http://') ||
            s.heroImage.startsWith('https://') ||
            s.heroImage.startsWith('/') ||
            s.heroImage.startsWith('data:') ||
            s.heroImage.startsWith('blob:') ||
            s.heroImage.startsWith('idb://'));
        return {
          ...s,
          heroImage: isValidHero ? s.heroImage : (defaultService?.heroImage || s.heroImage),
          heroMediaType: isValidHero ? s.heroMediaType : (defaultService?.heroMediaType || 'image'),
        };
      });
    } catch {
      return initialServicesData;
    }
  });

  // Projects state
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (!saved) return initialProjectsData;
      const parsed: ProjectItem[] = JSON.parse(saved);
      return parsed.map((p) => {
        const defaultProject = initialProjectsData.find((init) => init.id === p.id);
        const isValidCover =
          p.coverImage &&
          (p.coverImage.startsWith('http://') ||
            p.coverImage.startsWith('https://') ||
            p.coverImage.startsWith('/') ||
            p.coverImage.startsWith('data:') ||
            p.coverImage.startsWith('blob:') ||
            p.coverImage.startsWith('idb://'));
        return {
          ...p,
          coverImage: isValidCover ? p.coverImage : (defaultProject?.coverImage || p.coverImage),
          coverMediaType: isValidCover ? p.coverMediaType : (defaultProject?.coverMediaType || 'image'),
        };
      });
    } catch {
      return initialProjectsData;
    }
  });

  // Persist edits to localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EDIT_MODE, JSON.stringify(isEditMode));
    } catch (e) {
      console.warn('LocalStorage error saving editMode:', e);
    }
  }, [isEditMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(company));
    } catch (e) {
      console.warn('LocalStorage error saving company:', e);
    }
  }, [company]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INTRO_IMAGES, JSON.stringify(introImages));
    } catch (e) {
      console.warn('LocalStorage error saving introImages:', e);
    }
  }, [introImages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.warn('LocalStorage error saving services:', e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.warn('LocalStorage error saving projects:', e);
    }
  }, [projects]);

  const toggleEditMode = () => setIsEditMode(prev => !prev);
  const setEditMode = (enabled: boolean) => setIsEditMode(enabled);

  // Intro image methods
  const addIntroImage = (image: { url: string; title: string; subtitle?: string; mediaType?: 'image' | 'video' }) => {
    const newItem: IntroImageItem = {
      id: `intro-${Date.now()}`,
      url: image.url,
      title: image.title,
      subtitle: image.subtitle || 'Doha Facility',
      mediaType: image.mediaType,
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
    image: { url: string; title: string; caption?: string; mediaType?: 'image' | 'video' }
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
              mediaType: image.mediaType,
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
          mediaType: projectData.coverMediaType,
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

  const addProjectGalleryImage = (
    projectId: string,
    image: { url: string; title: string; caption?: string; mediaType?: 'image' | 'video' }
  ) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          gallery: [
            ...p.gallery,
            {
              url: image.url,
              title: image.title || p.title,
              caption: image.caption || 'Project Exhibition Photo',
              mediaType: image.mediaType,
            },
          ],
        };
      })
    );
  };

  const removeProjectGalleryImage = (projectId: string, imageIndex: number) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          gallery: p.gallery.filter((_, idx) => idx !== imageIndex),
        };
      })
    );
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
        addProjectGalleryImage,
        removeProjectGalleryImage,
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
