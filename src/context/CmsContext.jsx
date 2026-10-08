import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { defaultServices, defaultCompanyInfo } from "../data/initialData";

const CmsContext = createContext(null);

const STORAGE_KEYS = {
  PORTFOLIO: "pdc_cms_portfolio_v4",
  TEAM: "pdc_cms_team_v3",
  STATS: "pdc_cms_stats_v3",
  SERVICES: "pdc_cms_services_v4",
  PRINCIPLES: "pdc_cms_principles_v3",
  PROCESS: "pdc_cms_process_v3",
  TESTIMONIALS: "pdc_cms_testimonials_v3",
  COMPANY: "pdc_cms_company_v3",
  AUTH_TOKEN: "pdc_admin_token",
};

// Safe LocalStorage setter helper to prevent QuotaExceededError
const safeSetStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`LocalStorage write skipped for ${key}:`, err.message);
  }
};

const normalizeList = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((item, idx) => ({
    ...item,
    id: item.id || (item._id ? item._id.toString() : `item-${idx}`),
    _id: item._id ? item._id.toString() : item.id,
  }));
};

// Migration v3: wipe all cached team data — team is now CMS-only, no offline defaults
const TEAM_MIGRATION_KEY = "pdc_team_migration_v3";
if (!localStorage.getItem(TEAM_MIGRATION_KEY)) {
  localStorage.removeItem("pdc_cms_team_v3");
  localStorage.removeItem("pdc_team_migration_v1");
  localStorage.removeItem("pdc_team_migration_v2");
  localStorage.setItem(TEAM_MIGRATION_KEY, "done");
}

// Purge cached demo data from earlier versions
["pdc_cms_portfolio_v4", "pdc_cms_team_v3", "pdc_cms_stats_v3", "pdc_cms_testimonials_v3"].forEach((k) => {
  try { localStorage.removeItem(k); } catch { /* ignore */ }
});

export const CmsProvider = ({ children }) => {

  // 1-3. Portfolio, team and stats come only from the database (no offline/demo data)
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [stats, setStats] = useState([]);

  // 4. Services
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : defaultServices;
    } catch {
      return defaultServices;
    }
  });

  // 5. Testimonials (no demo data)
  const [testimonials, setTestimonials] = useState([]);

  // 6. Company Info
  const [companyInfo, setCompanyInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPANY);
      const parsed = saved ? JSON.parse(saved) : defaultCompanyInfo;
      return {
        ...defaultCompanyInfo,
        ...parsed,
        socials: {
          ...defaultCompanyInfo.socials,
          ...(parsed?.socials || {}),
        },
      };
    } catch {
      return defaultCompanyInfo;
    }
  });

  // Contact Modal State
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedProjectModal, setSelectedProjectModal] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Helper to get auth token
  const getAuthToken = () => {
    return sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  };

  // Initial Fetch from Backend Server API
  useEffect(() => {
    const fetchCmsData = async () => {
      try {
        const res = await fetch("/api/cms/all");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setPortfolioProjects(normalizeList(data.portfolio));
            setTeamMembers(normalizeList(data.team));
            setStats(normalizeList(data.stats));
            if (data.company && Object.keys(data.company).length > 0) {
              setCompanyInfo({
                ...defaultCompanyInfo,
                ...data.company,
                socials: {
                  ...defaultCompanyInfo.socials,
                  ...(data.company.socials || {}),
                },
              });
            }
            setIsBackendConnected(true);
          }
        }
      } catch {
        setIsBackendConnected(false);
      }
    };

    fetchCmsData();
  }, []);

  // Sync to LocalStorage safely (only non-DB content is cached)
  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.SERVICES, services);
  }, [services]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.COMPANY, companyInfo);
  }, [companyInfo]);

  // --- PORTFOLIO CRUD ACTIONS ---
  const addProject = async (project) => {
    const tempId = `proj-${Date.now()}`;
    const newProject = {
      ...project,
      id: tempId,
      order: portfolioProjects.length + 1,
    };
    setPortfolioProjects((prev) => [newProject, ...prev]);

    // Backend sync
    const token = getAuthToken();
    if (token) {
      try {
        const res = await fetch("/api/cms/portfolio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newProject),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.project) {
            const savedProject = {
              ...data.project,
              id: data.project.id || data.project._id,
            };
            setPortfolioProjects((prev) =>
              prev.map((p) => (p.id === tempId ? savedProject : p))
            );
            return savedProject;
          }
        }
      } catch (err) {
        console.warn("Backend sync error:", err);
      }
    }
    return newProject;
  };

  const updateProject = async (id, updatedFields) => {
    if (!id) return;
    setPortfolioProjects((prev) =>
      prev.map((proj) =>
        proj.id === id || proj._id === id ? { ...proj, ...updatedFields } : proj
      )
    );

    const token = getAuthToken();
    if (token) {
      try {
        await fetch(`/api/cms/portfolio/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFields),
        });
      } catch (err) {
        console.warn("Backend update error:", err);
      }
    }
  };

  const deleteProject = async (id) => {
    if (!id) return;
    setPortfolioProjects((prev) =>
      prev.filter((proj) => proj.id !== id && proj._id !== id)
    );

    const token = getAuthToken();
    if (token) {
      try {
        await fetch(`/api/cms/portfolio/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.warn("Backend delete error:", err);
      }
    }
  };

  // --- TEAM & FOUNDERS CRUD ACTIONS ---
  const addTeamMember = async (member) => {
    const tempId = `team-${Date.now()}`;
    const newMember = {
      ...member,
      id: tempId,
      order: teamMembers.length + 1,
    };
    setTeamMembers((prev) => [...prev, newMember]);

    const token = getAuthToken();
    if (token) {
      try {
        const res = await fetch("/api/cms/team", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newMember),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.member) {
            const savedMember = {
              ...data.member,
              id: data.member.id || data.member._id,
            };
            setTeamMembers((prev) =>
              prev.map((m) => (m.id === tempId ? savedMember : m))
            );
            return savedMember;
          }
        }
      } catch (err) {
        console.warn("Backend sync error:", err);
      }
    }
    return newMember;
  };

  const updateTeamMember = async (id, updatedFields) => {
    if (!id) return;
    setTeamMembers((prev) =>
      prev.map((mem) =>
        mem.id === id || mem._id === id ? { ...mem, ...updatedFields } : mem
      )
    );

    const token = getAuthToken();
    if (token) {
      try {
        await fetch(`/api/cms/team/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFields),
        });
      } catch (err) {
        console.warn("Backend sync error:", err);
      }
    }
  };

  const deleteTeamMember = async (id) => {
    if (!id) return;
    setTeamMembers((prev) =>
      prev.filter((mem) => mem.id !== id && mem._id !== id)
    );

    const token = getAuthToken();
    if (token) {
      try {
        await fetch(`/api/cms/team/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.warn("Backend sync error:", err);
      }
    }
  };

  // --- STATS ACTIONS ---
  const updateStat = async (id, updatedFields) => {
    if (!id) return;
    setStats((prev) =>
      prev.map((s) =>
        s.id === id || s._id === id ? { ...s, ...updatedFields } : s
      )
    );

    const token = getAuthToken();
    if (token) {
      try {
        await fetch(`/api/cms/stats/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFields),
        });
      } catch (err) {
        console.warn("Backend stat update error:", err);
      }
    }
  };

  // --- BACKUP & RESTORE ACTIONS ---
  const resetToDefaults = () => {
    setPortfolioProjects([]);
    setTeamMembers([]);
    setStats([]);
    setServices(defaultServices);
    setTestimonials([]);
    setCompanyInfo(defaultCompanyInfo);
  };

  const exportData = () => {
    const data = {
      portfolio: portfolioProjects,
      team: teamMembers,
      stats: stats,
      services: services,
      testimonials: testimonials,
      company: companyInfo,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pdc-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.portfolio) setPortfolioProjects(normalizeList(data.portfolio));
      if (data.team) setTeamMembers(normalizeList(data.team));
      if (data.stats) setStats(normalizeList(data.stats));
      if (data.services) setServices(data.services);
      if (data.testimonials) setTestimonials(data.testimonials);
      if (data.company) {
        setCompanyInfo({
          ...defaultCompanyInfo,
          ...data.company,
          socials: {
            ...defaultCompanyInfo.socials,
            ...(data.company.socials || {}),
          },
        });
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <CmsContext.Provider
      value={{
        portfolioProjects,
        teamMembers,
        stats,
        services,
        testimonials,
        companyInfo,
        setCompanyInfo,
        addProject,
        updateProject,
        deleteProject,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        updateStat,
        resetToDefaults,
        exportData,
        importData,
        isContactModalOpen,
        setIsContactModalOpen,
        selectedProjectModal,
        setSelectedProjectModal,
        isBackendConnected,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error("useCms must be used within a CmsProvider");
  }
  return context;
};
