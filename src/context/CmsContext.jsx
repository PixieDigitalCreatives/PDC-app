import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { defaultServices, defaultCompanyInfo } from "../data/initialData";
import { DEFAULT_PRICING, DEFAULT_BUDGET_RANGES } from "../data/pricing";

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
  PRICING: "pdc_cms_pricing_v1",
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

// Pricing as the site uses it: { categories, budgetRanges }. Empty budget ranges fall back to the built-in ones.
const DEFAULT_PRICING_DOC = { categories: DEFAULT_PRICING, budgetRanges: DEFAULT_BUDGET_RANGES };
const toPricingDoc = (doc) =>
  doc && Array.isArray(doc.categories)
    ? {
        categories: doc.categories,
        budgetRanges: Array.isArray(doc.budgetRanges) && doc.budgetRanges.length ? doc.budgetRanges : DEFAULT_BUDGET_RANGES,
        updatedAt: doc.updatedAt || null,
      }
    : null;
const readPricingCache = () => {
  try {
    return toPricingDoc(JSON.parse(localStorage.getItem(STORAGE_KEYS.PRICING) || "null"));
  } catch {
    return null;
  }
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

  // 7. Pricing: the database copy once loaded (the last one is cached for return visits), the
  // built-in prices until pricing is first saved from the Admin. `pricingReady` stays false while a
  // first-time visitor waits for the database, so out-of-date prices are never shown.
  const [pricing, setPricing] = useState(() => readPricingCache() || DEFAULT_PRICING_DOC);
  const [pricingReady, setPricingReady] = useState(() => !!readPricingCache());

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
    // A server that never answers must not hold the prices back forever.
    const pricingFallback = setTimeout(() => setPricingReady(true), 20000);

    const fetchCmsData = async () => {
      try {
        const res = await fetch("/api/cms/all");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            const fromDb = toPricingDoc(data.pricing);
            setPricing(fromDb || DEFAULT_PRICING_DOC);
            try {
              if (fromDb) localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(fromDb));
              else localStorage.removeItem(STORAGE_KEYS.PRICING);
            } catch {
              /* storage unavailable: the prices just aren't cached */
            }
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
      } finally {
        clearTimeout(pricingFallback);
        setPricingReady(true);
      }
    };

    fetchCmsData();
    return () => clearTimeout(pricingFallback);
  }, []);

  // Sync to LocalStorage safely (only non-DB content is cached)
  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.SERVICES, services);
  }, [services]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.COMPANY, companyInfo);
  }, [companyInfo]);

  // --- PORTFOLIO CRUD ACTIONS ---
  // The list is kept in display order (as the server sorts it). A new project goes to the top;
  // the server sets its real order number the same way.
  const addProject = async (project) => {
    const tempId = `proj-${Date.now()}`;
    const first = portfolioProjects[0];
    const newProject = {
      ...project,
      id: tempId,
      order: first ? (first.order ?? 0) - 1 : 0,
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

  // Saves a new portfolio order: `ids` is every project id, first to last. The list changes at once
  // and goes back to how it was if the server does not accept it.
  const reorderProjects = async (ids) => {
    const previous = portfolioProjects;
    const byId = new Map(previous.map((p) => [p.id, p]));
    setPortfolioProjects(ids.map((id, i) => ({ ...byId.get(id), order: i })));

    const token = getAuthToken();
    try {
      const res = await fetch("/api/cms/portfolio/order", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) return { ok: true };
      setPortfolioProjects(previous);
      return { ok: false, error: data.error || "Could not save the order." };
    } catch {
      setPortfolioProjects(previous);
      return { ok: false, error: "Could not reach the server. The order was not saved." };
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

  // --- COMPANY INFO ---
  // Saves the company fields to the database; the site shows them once the server confirms.
  // Returns { ok, error, errors } so the Admin can show what to fix.
  const saveCompanyInfo = async (info) => {
    const token = getAuthToken();
    if (!token) return { ok: false, error: "Please log in again to save." };
    const { name, shortName, email, phone, address, tagline, description, website, services, digitalPresence, socials } = info;
    try {
      const res = await fetch("/api/cms/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, shortName, email, phone, address, tagline, description, website, services, digitalPresence, socials }),
      });
      let data = null;
      try {
        data = await res.json();
      } catch {
        /* not JSON (e.g. a proxy error page) */
      }
      if (res.ok && data?.success) {
        setCompanyInfo({
          ...defaultCompanyInfo,
          ...data.company,
          socials: { ...defaultCompanyInfo.socials, ...(data.company?.socials || {}) },
        });
        return { ok: true };
      }
      if (res.status === 401 || res.status === 403) {
        return { ok: false, error: "Your session has expired. Please log in again, then save." };
      }
      return { ok: false, error: data?.error || "Could not save the company information.", errors: data?.errors || [] };
    } catch {
      return { ok: false, error: "Cannot reach the server. Nothing was saved." };
    }
  };

  // --- PRICING ---
  // Saves the whole pricing document. Returns { ok, error, errors } so the Admin can show what to fix.
  const savePricing = async (doc) => {
    const token = getAuthToken();
    if (!token) return { ok: false, error: "Please log in again to save." };
    try {
      const res = await fetch("/api/cms/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(doc),
      });
      let data = null;
      try {
        data = await res.json();
      } catch {
        /* not JSON (e.g. a proxy error page) */
      }
      if (res.ok && data?.success) {
        const saved = toPricingDoc(data.pricing) || DEFAULT_PRICING_DOC;
        setPricing(saved);
        safeSetStorage(STORAGE_KEYS.PRICING, saved);
        return { ok: true, pricing: saved };
      }
      if (res.status === 401 || res.status === 403) {
        return { ok: false, error: "Your session has expired. Please log in again, then save." };
      }
      return { ok: false, error: data?.error || "Could not save the pricing.", errors: data?.errors || [] };
    } catch {
      return { ok: false, error: "Cannot reach the server. Nothing was saved." };
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
      pricing: pricing,
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
        saveCompanyInfo,
        pricing,
        pricingReady,
        savePricing,
        addProject,
        updateProject,
        reorderProjects,
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
