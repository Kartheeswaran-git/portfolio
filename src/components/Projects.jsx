import { useState } from "react";
import usePortfolioData from "../hooks/usePortfolioData";
import { FaGithub, FaExternalLinkAlt, FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Section.css";
import { normalizeImageList } from "../utils/imageLinks";

const hasContent = (value) => typeof value === "string" ? value.trim().length > 0 : Boolean(value);

const Projects = () => {
  const { data } = usePortfolioData();
  const { projects } = data;

  const [activeProject, setActiveProject] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil((projects?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = projects?.slice(startIndex, startIndex + itemsPerPage) || [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to the top of the projects section when page changes
    const section = document.getElementById("projects-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenProject = (project) => {
    setActiveProject(project);
    setSelectedImageIndex(0);
  };

  const projectTools =
    activeProject?.toolsUsed
      ?.split(",")
      .map((tool) => tool.trim())
      .filter(Boolean) || [];

  return (
    <>
      {/* PROJECTS SECTION */}
      <section id="projects-section" className="section-card animate-slideUp">
        <h2 className="section-title">Projects</h2>

        <div className="projects-showroom">
          {currentProjects.map((project, index) => {
            const displayImages = normalizeImageList(
              project.images && project.images.length > 0
                ? project.images
                : project.image
                  ? [project.image]
                  : []
            );
            return (
              <div 
                className="project-card-v2 animate-slideUp" 
                key={project.id || index}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="card-img-wrapper">
                  {displayImages.length > 0 && (
                    <img
                      src={displayImages[0]}
                      alt={project.title || "Project"}
                      className="card-img"
                    />
                  )}
                  <div className="card-overlay" />
                </div>

                <div className="card-content">
                  <div className="flex justify-between items-start">
                    <h3 className="card-title">{project.title || "Untitled Project"}</h3>
                  </div>
                  
                  <p className="card-description">
                    {project.abstract || project.description || "No description available."}
                  </p>

                  <div className="card-footer">
                    <button
                      className="card-btn"
                      onClick={() => handleOpenProject(project)}
                    >
                      View Details <FaArrowRight size={12} />
                    </button>
                    {hasContent(project.demo) && (
                      <span className="card-badge">Featured</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION UI */}
        {totalPages > 1 && (
          <div className="pagination-container">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-box ${currentPage === page ? "active" : ""}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* MODAL V2 */}
      {activeProject && (
        <div className="modal-overlay" onClick={() => setActiveProject(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setActiveProject(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="modal-scroll-container">
              {/* IMMERSIVE HERO */}
              <div className="modal-hero">
              {(() => {
                const displayImages = normalizeImageList(
                  activeProject.images && activeProject.images.length > 0
                    ? activeProject.images
                    : activeProject.image
                      ? [activeProject.image]
                      : []
                );
                if (displayImages.length === 0) return null;
                
                return (
                  <>
                    <img
                      src={displayImages[selectedImageIndex]}
                      alt={activeProject.title || "Project"}
                      className="modal-hero-img"
                    />
                    <div className="modal-hero-overlay" />
                    
                    {displayImages.length > 1 && (
                      <>
                        <button 
                          className="modal-nav-btn modal-nav-prev"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex((prev) => prev === 0 ? displayImages.length - 1 : prev - 1);
                          }}
                        >
                          <FaChevronLeft />
                        </button>
                        <button 
                          className="modal-nav-btn modal-nav-next"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex((prev) => prev === displayImages.length - 1 ? 0 : prev + 1);
                          }}
                        >
                          <FaChevronRight />
                        </button>

                        <div className="modal-floating-gallery">
                          {displayImages.map((_, idx) => (
                            <div
                              key={idx}
                              className={`modal-thumb-v2 ${selectedImageIndex === idx ? 'active' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImageIndex(idx);
                              }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                );
              })()}
            </div>

            {/* MODAL BODY */}
            <div className="modal-body-v2">
              <div className="modal-main-content">
                <div className="modal-header-v2">
                  <h3 className="project-title-v2">{activeProject.title || "Untitled Project"}</h3>
                </div>

                {hasContent(activeProject.abstract) && (
                  <div className="info-card">
                    <span className="info-card-label">Abstract</span>
                    <div className="modal-text-v2">{activeProject.abstract}</div>
                  </div>
                )}

                {hasContent(activeProject.description) && (
                  <div className="info-card">
                    <span className="info-card-label">Explain</span>
                    <div className="modal-text-v2">{activeProject.description}</div>
                  </div>
                )}

                {hasContent(activeProject.longDescription) && (
                  <div className="info-card">
                    <span className="info-card-label">Long Explain</span>
                    <div className="modal-text-v2">{activeProject.longDescription}</div>
                  </div>
                )}
              </div>

              <div className="modal-sidebar-v2">
                {projectTools.length > 0 && (
                  <div className="sidebar-card">
                    <span className="info-card-label">Tools Used</span>
                    <div className="tech-tags-v2">
                      {projectTools.map((tool, i) => (
                        <span key={i} className="tech-tag-v2">{tool.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                {(hasContent(activeProject.demo) || hasContent(activeProject.github)) && (
                  <div className="sidebar-card">
                    <span className="info-card-label">Live Interaction</span>
                    <div className="action-btns-v2">
                    {hasContent(activeProject.demo) && (
                      <a href={activeProject.demo} target="_blank" rel="noopener noreferrer" className="btn-v2 btn-v2-secondary">
                        <FaExternalLinkAlt /> Experience Live
                      </a>
                    )}
                    {hasContent(activeProject.github) && (
                      <a href={activeProject.github} target="_blank" rel="noopener noreferrer" className="btn-v2 btn-v2-primary">
                        <FaGithub /> View Source
                      </a>
                    )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
