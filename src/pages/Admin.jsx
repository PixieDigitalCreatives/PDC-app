import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCms } from "../context/CmsContext";
import {
  RiDashboardLine,
  RiFolder2Line,
  RiTeamLine,
  RiBarChartBoxLine,
  RiSettings4Line,
  RiAddLine,
  RiEditLine,
  RiDeleteBin6Line,
  RiArrowLeftLine,
  RiDownload2Line,
  RiUpload2Line,
  RiRefreshLine,
  RiCheckLine,
  RiImageAddLine,
  RiEyeLine,
  RiCloseLine,
  RiVipCrownLine,
  RiExternalLinkLine
} from "react-icons/ri";
import "../styles/admin.scss";

const Admin = () => {
  const {
    portfolioProjects,
    teamMembers,
    stats,
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
  } = useCms();

  const [activeTab, setActiveTab] = useState("portfolio");
  const [toastMessage, setToastMessage] = useState(null);

  // Email + Password Authentication via MongoDB Backend
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!sessionStorage.getItem("pdc_admin_token");
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("pdc_admin_token", data.token);
        setAuthError("");
        showToast(`Welcome back, ${data.admin?.email || "Admin"}!`);
      } else {
        setAuthError(data.error || "Invalid email or password.");
      }
    } catch {
      setAuthError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("pdc_admin_token");
  };

  // Portfolio Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    subtitle: "",
    category: "Web Application",
    type: "MERN Web Application",
    description: "",
    image: "",
    client: "",
    year: "2024",
    tags: "React, Node.js, MongoDB",
    liveUrl: "",
    featured: true,
  });

  // Team Modal State
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [teamForm, setTeamForm] = useState({
    name: "",
    role: "Founder & Creative Director",
    isFounder: true,
    bio: "",
    image: "",
    linkedin: "",
    twitter: "",
    github: "",
    email: "",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- PROJECT ACTIONS ---
  const handleOpenNewProject = () => {
    setEditingProject(null);
    setProjectForm({
      title: "",
      subtitle: "",
      category: "Web Application",
      type: "MERN Web Application",
      description: "",
      image: "/portfolio.jpg",
      client: "",
      year: new Date().getFullYear().toString(),
      tags: "React, UI/UX, Scalable",
      liveUrl: "",
      featured: true,
    });
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title,
      subtitle: proj.subtitle || "",
      category: proj.category || "Web Application",
      type: proj.type || "",
      description: proj.description || "",
      image: proj.image || "",
      client: proj.client || "",
      year: proj.year || "2024",
      tags: Array.isArray(proj.tags) ? proj.tags.join(", ") : proj.tags || "",
      liveUrl: proj.liveUrl || "",
      featured: !!proj.featured,
    });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    const formattedTags = projectForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const projectPayload = {
      ...projectForm,
      tags: formattedTags,
    };

    if (editingProject) {
      updateProject(editingProject.id, projectPayload);
      showToast("Project successfully updated!");
    } else {
      addProject(projectPayload);
      showToast("New project added to portfolio!");
    }

    setIsProjectModalOpen(false);
  };

  const handleDeleteProject = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProject(id);
      showToast("Project deleted.");
    }
  };

  // --- TEAM ACTIONS ---
  const handleOpenNewTeamMember = () => {
    setEditingMember(null);
    setTeamForm({
      name: "",
      role: "Co-Founder & Technical Lead",
      isFounder: true,
      bio: "",
      image: "/rishi.jpg",
      linkedin: "https://linkedin.com",
      twitter: "https://x.com",
      github: "https://github.com",
      email: "",
    });
    setIsTeamModalOpen(true);
  };

  const handleOpenEditTeamMember = (mem) => {
    setEditingMember(mem);
    setTeamForm({
      name: mem.name,
      role: mem.role,
      isFounder: !!mem.isFounder,
      bio: mem.bio,
      image: mem.image || "",
      linkedin: mem.linkedin || "",
      twitter: mem.twitter || "",
      github: mem.github || "",
      email: mem.email || "",
    });
    setIsTeamModalOpen(true);
  };

  const handleSaveTeamMember = (e) => {
    e.preventDefault();
    if (editingMember) {
      updateTeamMember(editingMember.id, teamForm);
      showToast(`Team member "${teamForm.name}" updated!`);
    } else {
      addTeamMember(teamForm);
      showToast(`Added "${teamForm.name}" to team & leadership!`);
    }
    setIsTeamModalOpen(false);
  };

  const handleDeleteTeamMember = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from team leadership?`)) {
      deleteTeamMember(id);
      showToast("Member removed.");
    }
  };

  // Image Upload to Cloudinary API (with Local Base64 fallback)
  const handleImageFileChange = async (e, setFunction) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingImage(true);
    showToast("Uploading image to Cloudinary...");

    const token = sessionStorage.getItem("pdc_admin_token");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          setFunction((prev) => ({ ...prev, image: data.url }));
          showToast("Image stored on Cloudinary / CDN!");
          setIsUploadingImage(false);
          return;
        }
      }
    } catch {
      console.warn("Backend upload unreachable, fallback to local preview.");
    }

    // Fallback: Read as base64 data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setFunction((prev) => ({ ...prev, image: reader.result }));
      showToast("Image loaded (Local Mode).");
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  // Import JSON File
  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = importData(event.target.result);
        if (res.success) {
          showToast("Data successfully imported!");
        } else {
          alert("Failed to import data: " + res.error);
        }
      };
      reader.readAsText(file);
    }
  };

  // Render Authentication Gate if not logged in
  if (!isAuthenticated) {
    return (
      <div className="admin-lock-screen">
        <div className="lock-card glass-panel">
          <div className="lock-header">
            <img src="/brand/primary-480.png" alt="PDC Logo" className="lock-logo" />
            <h2 className="lock-title">CMS Studio Access</h2>
            <p className="lock-sub">Sign in with your administrator credentials to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="lock-form">
            <div className="form-group">
              <label>Admin Email</label>
              <input
                type="email"
                required
                autoFocus
                placeholder="admin@pixiedigitalcreatives.com"
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  setAuthError("");
                }}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your admin password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setAuthError("");
                  }}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {authError && <div className="lock-error-msg">{authError}</div>}

            <button type="submit" className="btn-primary lock-submit-btn" disabled={isLoggingIn}>
              <span>{isLoggingIn ? "AUTHENTICATING..." : "SIGN IN TO CMS"}</span>
            </button>
          </form>

          <div className="lock-footer">
            <Link to="/" className="back-link">
              <RiArrowLeftLine /> Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <RiCheckLine /> {toastMessage}
        </div>
      )}

      {/* Admin Top Header */}
      <header className="admin-header">
        <div className="admin-header-container">
          <div className="header-left">
            <Link to="/" className="back-to-site-btn">
              <RiArrowLeftLine /> View Website
            </Link>
            <div className="admin-title-wrap">
              <img src="/brand/secondary-400.png" alt="PDC Logo" className="admin-logo" />
              <div className="admin-title-text">
                <h1>Pixie Digital Creatives</h1>
                <span className="cms-badge">STUDIO CMS PANEL</span>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button onClick={exportData} className="btn-action-outline" title="Export Backup">
              <RiDownload2Line /> Export JSON
            </button>

            <label className="btn-action-outline file-upload-label" title="Import Backup">
              <RiUpload2Line /> Import JSON
              <input type="file" accept=".json" onChange={handleImportFile} style={{ display: "none" }} />
            </label>

            <button
              onClick={() => {
                if (window.confirm("Reset all CMS data back to original defaults?")) {
                  resetToDefaults();
                  showToast("CMS reset to factory defaults.");
                }
              }}
              className="btn-action-outline danger"
              title="Reset Defaults"
            >
              <RiRefreshLine /> Reset
            </button>

            <button
              onClick={handleLogout}
              className="btn-action-outline logout-btn"
              title="Logout from CMS"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Admin Body Container */}
      <main className="admin-main">
        <div className="admin-container">
          {/* Quick Metrics Bar */}
          <div className="admin-stats-summary">
            <div className="summary-card">
              <span className="summary-icon"><RiFolder2Line /></span>
              <div>
                <span className="summary-label">Total Projects</span>
                <h3 className="summary-num">{portfolioProjects.length}</h3>
              </div>
            </div>

            <div className="summary-card">
              <span className="summary-icon"><RiTeamLine /></span>
              <div>
                <span className="summary-label">Founders & Team</span>
                <h3 className="summary-num">{teamMembers.length}</h3>
              </div>
            </div>

            <div className="summary-card">
              <span className="summary-icon"><RiBarChartBoxLine /></span>
              <div>
                <span className="summary-label">Delivered Projects</span>
                <h3 className="summary-num">{stats[0]?.number || "50+"}</h3>
              </div>
            </div>

            <div className="summary-card">
              <span className="summary-icon"><RiSettings4Line /></span>
              <div>
                <span className="summary-label">Client Satisfaction</span>
                <h3 className="summary-num">{stats[2]?.number || "95%"}</h3>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeTab === "portfolio" ? "active" : ""}`}
              onClick={() => setActiveTab("portfolio")}
            >
              <RiFolder2Line /> Portfolio Projects ({portfolioProjects.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "team" ? "active" : ""}`}
              onClick={() => setActiveTab("team")}
            >
              <RiTeamLine /> Founders & Co-Founders ({teamMembers.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              <RiBarChartBoxLine /> Studio Metrics & Stats
            </button>
            <button
              className={`tab-btn ${activeTab === "company" ? "active" : ""}`}
              onClick={() => setActiveTab("company")}
            >
              <RiSettings4Line /> Company Info & Socials
            </button>
          </div>

          {/* TAB 1: PORTFOLIO PROJECTS MANAGEMENT */}
          {activeTab === "portfolio" && (
            <div className="tab-content">
              <div className="tab-header">
                <div>
                  <h2 className="tab-title">Portfolio Projects</h2>
                  <p className="tab-subtitle">
                    Add, edit, and organize projects showcased on the homepage and portfolio grid.
                  </p>
                </div>
                <button onClick={handleOpenNewProject} className="btn-primary">
                  <RiAddLine /> ADD NEW PROJECT
                </button>
              </div>

              <div className="admin-grid-cards">
                {portfolioProjects.map((project) => (
                  <div key={project.id} className="admin-card glass-panel">
                    <div className="card-thumb-wrap">
                      <img
                        src={project.image || "/portfolio.jpg"}
                        alt={project.title}
                        className="card-thumb"
                        onError={(e) => { e.target.src = "/portfolio.jpg"; }}
                      />
                      {project.featured && (
                        <span className="card-badge featured">Featured</span>
                      )}
                      <span className="card-badge category">{project.category}</span>
                    </div>

                    <div className="card-content">
                      <div className="card-title-row">
                        <h3 className="card-item-title">{project.title}</h3>
                        <span className="card-item-year">{project.year || "2024"}</span>
                      </div>
                      <p className="card-item-type">{project.type || project.category}</p>
                      <p className="card-item-desc">{project.description}</p>

                      {project.client && (
                        <p className="card-item-client">
                          <strong>Client:</strong> {project.client}
                        </p>
                      )}

                      <div className="card-tags-list">
                        {project.tags?.map((t, idx) => (
                          <span key={idx} className="admin-tag">{t}</span>
                        ))}
                      </div>
                    </div>

                    <div className="card-footer-actions">
                      <button
                        onClick={() => handleOpenEditProject(project)}
                        className="btn-card-action edit"
                        title="Edit Project"
                      >
                        <RiEditLine /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id, project.title)}
                        className="btn-card-action delete"
                        title="Delete Project"
                      >
                        <RiDeleteBin6Line /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: FOUNDERS & TEAM MANAGEMENT */}
          {activeTab === "team" && (
            <div className="tab-content">
              <div className="tab-header">
                <div>
                  <h2 className="tab-title">Founders & Leadership Team</h2>
                  <p className="tab-subtitle">
                    Manage the founders, co-founders, and key leadership displayed in the About & Leadership section.
                  </p>
                </div>
                <button onClick={handleOpenNewTeamMember} className="btn-primary">
                  <RiAddLine /> ADD FOUNDER / MEMBER
                </button>
              </div>

              <div className="admin-team-grid">
                {teamMembers.map((member) => (
                  <div key={member.id} className="admin-member-card glass-panel">
                    <div className="member-avatar-wrap">
                      <img
                        src={member.image || "/rishi.jpg"}
                        alt={member.name}
                        className="member-avatar"
                        onError={(e) => { e.target.src = "/rishi.jpg"; }}
                      />
                      {member.isFounder && (
                        <span className={`member-badge founder ${member.role && member.role.toLowerCase().includes('co-founder') ? 'co-founder' : ''}`}>
                          <RiVipCrownLine />
                          {member.role && member.role.toLowerCase().includes('co-founder') ? 'Co-Founder' : 'Founder'}
                        </span>
                      )}
                    </div>

                    <div className="member-details">
                      <h3 className="member-name-heading">{member.name}</h3>
                      <p className="member-role-sub">{member.role}</p>
                      <p className="member-bio-text">{member.bio}</p>

                      <div className="member-social-links">
                        {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
                        {member.twitter && <a href={member.twitter} target="_blank" rel="noreferrer">Twitter</a>}
                        {member.github && <a href={member.github} target="_blank" rel="noreferrer">GitHub</a>}
                        {member.email && <a href={`mailto:${member.email}`}>Email</a>}
                      </div>
                    </div>

                    <div className="member-actions">
                      <button
                        onClick={() => handleOpenEditTeamMember(member)}
                        className="btn-card-action edit"
                      >
                        <RiEditLine /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTeamMember(member.id, member.name)}
                        className="btn-card-action delete"
                      >
                        <RiDeleteBin6Line /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: METRICS & STATS MANAGEMENT */}
          {activeTab === "stats" && (
            <div className="tab-content">
              <div className="tab-header">
                <div>
                  <h2 className="tab-title">Studio Metrics & Statistics</h2>
                  <p className="tab-subtitle">
                    Customize the 4 key figures displayed in the metallic stats strip.
                  </p>
                </div>
              </div>

              <div className="stats-editor-grid">
                {stats.map((stat, idx) => (
                  <div key={stat.id || idx} className="stat-editor-card glass-panel">
                    <div className="form-group">
                      <label>Metric Value (e.g. 50+, 95%, 5+)</label>
                      <input
                        type="text"
                        value={stat.number}
                        onChange={(e) => {
                          updateStat(stat.id, { number: e.target.value });
                          showToast("Metric updated!");
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label>Metric Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          updateStat(stat.id, { label: e.target.value });
                          showToast("Metric label updated!");
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COMPANY INFO & SOCIALS */}
          {activeTab === "company" && (
            <div className="tab-content">
              <div className="tab-header">
                <div>
                  <h2 className="tab-title">Company Information & Socials</h2>
                  <p className="tab-subtitle">
                    Manage studio emails, address, and official social media profile links.
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast("Company information saved!");
                }}
                className="company-editor-form glass-panel"
              >
                <div className="form-row">
                  <div className="form-group">
                    <label>Studio Name</label>
                    <input
                      type="text"
                      value={companyInfo.name}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Official Email</label>
                    <input
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number(s)</label>
                    <input
                      type="text"
                      value={companyInfo.phone || ""}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                      placeholder="+91 97089 76946, +91 88253 10738"
                    />
                  </div>
                  <div className="form-group">
                    <label>Website</label>
                    <input
                      type="text"
                      value={companyInfo.website || ""}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                      placeholder="pixiedigitalcreatives.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Tagline / Description</label>
                  <textarea
                    rows="3"
                    value={companyInfo.description}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="socials-subhead">Official Social Profiles</div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Instagram URL</label>
                    <input
                      type="url"
                      value={companyInfo?.socials?.instagram || ""}
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          socials: { ...(companyInfo?.socials || {}), instagram: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>LinkedIn URL</label>
                    <input
                      type="url"
                      value={companyInfo?.socials?.linkedin || ""}
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          socials: { ...(companyInfo?.socials || {}), linkedin: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Twitter / X URL</label>
                    <input
                      type="url"
                      value={companyInfo?.socials?.twitter || ""}
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          socials: { ...(companyInfo?.socials || {}), twitter: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Facebook URL</label>
                    <input
                      type="url"
                      value={companyInfo?.socials?.facebook || ""}
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          socials: { ...(companyInfo?.socials || {}), facebook: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary save-company-btn">
                  <RiCheckLine /> SAVE COMPANY SETTINGS
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: ADD / EDIT PORTFOLIO PROJECT */}
      {isProjectModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsProjectModalOpen(false)}>
          <div className="admin-modal-dialog glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsProjectModalOpen(false)}>
              <RiCloseLine />
            </button>

            <h3 className="modal-form-title">
              {editingProject ? "Edit Portfolio Project" : "Add New Portfolio Project"}
            </h3>

            <form onSubmit={handleSaveProject} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TechNova, UrbanNest"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                  >
                    <option value="Web Application">Web Application</option>
                    <option value="Web Development">Web Development</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Branding">Branding</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type / Subtitle (e.g. MERN Web Application)</label>
                  <input
                    type="text"
                    placeholder="e.g. Headless WordPress / E-commerce Store"
                    value={projectForm.type}
                    onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Client Name</label>
                  <input
                    type="text"
                    placeholder="e.g. TechNova Systems"
                    value={projectForm.client}
                    onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="text"
                    placeholder="2024"
                    value={projectForm.year}
                    onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Live URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={projectForm.liveUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                  />
                </div>
              </div>

              {/* Image Input & Upload */}
              <div className="form-group">
                <label>Project Image URL or Upload File</label>
                <div className="image-input-dual">
                  <input
                    type="text"
                    placeholder="/portfolio.jpg or https://images..."
                    value={projectForm.image}
                    onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  />
                  <label className="upload-file-btn">
                    <RiImageAddLine /> Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, setProjectForm)}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
                {projectForm.image && (
                  <div className="image-preview-box">
                    <img src={projectForm.image} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Project Description *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Short one or two line summary of the project and deliverables..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group">
                <label>Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="React, Next.js, UI/UX, Scalable"
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                />
              </div>

              <div className="form-checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                  />
                  Feature on Homepage
                </label>
              </div>

              <div className="modal-form-actions">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <RiCheckLine /> {editingProject ? "Update Project" : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT FOUNDER & TEAM MEMBER */}
      {isTeamModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsTeamModalOpen(false)}>
          <div className="admin-modal-dialog glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsTeamModalOpen(false)}>
              <RiCloseLine />
            </button>

            <h3 className="modal-form-title">
              {editingMember ? "Edit Founder / Team Member" : "Add Founder / Team Member"}
            </h3>

            <form onSubmit={handleSaveTeamMember} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ashish, Vivek, Rishi"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Role / Position *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Founder & Creative Director, Co-Founder"
                    value={teamForm.role}
                    onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                  />
                </div>
              </div>

              {/* Photo Input & Upload */}
              <div className="form-group">
                <label>Member Photo URL or Upload File</label>
                <div className="image-input-dual">
                  <input
                    type="text"
                    placeholder="/rishi.jpg, /vivek.jpg, /ashish.jpg or URL"
                    value={teamForm.image}
                    onChange={(e) => setTeamForm({ ...teamForm, image: e.target.value })}
                  />
                  <label className="upload-file-btn">
                    <RiImageAddLine /> Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, setTeamForm)}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
                {teamForm.image && (
                  <div className="image-preview-box round">
                    <img src={teamForm.image} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Bio / Background *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Short statement of leadership background, skills and passion..."
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>LinkedIn URL</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={teamForm.linkedin}
                    onChange={(e) => setTeamForm({ ...teamForm, linkedin: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Twitter / X URL</label>
                  <input
                    type="url"
                    placeholder="https://x.com/username"
                    value={teamForm.twitter}
                    onChange={(e) => setTeamForm({ ...teamForm, twitter: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>GitHub URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={teamForm.github}
                    onChange={(e) => setTeamForm({ ...teamForm, github: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Direct Email</label>
                  <input
                    type="email"
                    placeholder="name@pixiedigitalcreatives.com"
                    value={teamForm.email}
                    onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={teamForm.isFounder}
                    onChange={(e) => setTeamForm({ ...teamForm, isFounder: e.target.checked })}
                  />
                  Mark as Founder / Co-Founder
                </label>
              </div>

              <div className="modal-form-actions">
                <button type="button" onClick={() => setIsTeamModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <RiCheckLine /> {editingMember ? "Update Member" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
