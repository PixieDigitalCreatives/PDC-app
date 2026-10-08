import React from "react";
import { useCms } from "../context/CmsContext";
import { RiCloseLine, RiExternalLinkLine, RiCalendarLine, RiBuildingLine } from "react-icons/ri";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import "../styles/projectdetailmodal.scss";

const ProjectDetailModal = () => {
  const { selectedProjectModal, setSelectedProjectModal, setIsContactModalOpen } = useCms();

  if (!selectedProjectModal) return null;

  const project = selectedProjectModal;

  return (
    <div
      className="project-modal-overlay"
      data-lenis-prevent
      onClick={() => setSelectedProjectModal(null)}
    >
      <div
        className="project-modal-dialog glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => setSelectedProjectModal(null)}
          aria-label="Close modal"
        >
          <RiCloseLine />
        </button>

        <div className="project-modal-image-wrap">
          <img
            src={project.image || "/portfolio.jpg"}
            alt={project.title}
            className="project-modal-img"
            onError={(e) => {
              e.target.src = "/portfolio.jpg";
            }}
          />
          <div className="image-vignette"></div>
        </div>

        <div className="project-modal-body">
          <div className="modal-header-row">
            <div>
              <span className="project-category-badge">{project.category}</span>
              <h2 className="project-modal-title">{project.title}</h2>
              {project.subtitle && (
                <p className="project-modal-subtitle">{project.subtitle}</p>
              )}
            </div>

            <div className="modal-actions-right">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary modal-action-btn"
                >
                  <span>LIVE SITE</span>
                  <HiOutlineArrowUpRight />
                </a>
              )}
            </div>
          </div>

          <div className="project-meta-grid">
            <div className="meta-item">
              <span className="meta-icon"><RiBuildingLine /></span>
              <div>
                <span className="meta-label">Client</span>
                <p className="meta-val">{project.client || "Client confidential"}</p>
              </div>
            </div>

            <div className="meta-item">
              <span className="meta-icon"><RiCalendarLine /></span>
              <div>
                <span className="meta-label">Year</span>
                <p className="meta-val">{project.year || "—"}</p>
              </div>
            </div>

            <div className="meta-item">
              <span className="meta-icon">⚙</span>
              <div>
                <span className="meta-label">Architecture</span>
                <p className="meta-val">{project.type || "Website"}</p>
              </div>
            </div>
          </div>

          <div className="project-desc-section">
            <h4 className="desc-heading">PROJECT OVERVIEW</h4>
            <p className="desc-text">{project.description}</p>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="project-tags-section">
              <h4 className="tags-heading">TECHNOLOGIES & DISCIPLINES</h4>
              <div className="tags-cloud">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="modal-cta-box">
            <p>Want to build a project with similar high standards?</p>
            <button
              onClick={() => {
                setSelectedProjectModal(null);
                setIsContactModalOpen(true);
              }}
              className="btn-secondary"
            >
              <span>INQUIRE ABOUT THIS</span>
              <HiOutlineArrowUpRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
