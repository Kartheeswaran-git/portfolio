import { useState, useEffect, useRef } from "react";
import usePortfolioData from "../hooks/usePortfolioData";
import { FaGithub, FaExternalLinkAlt, FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Section.css";
import { normalizeImageList } from "../utils/imageLinks";
import { normalizeVideoUrl } from "../utils/videoLinks";

const hasContent = (value) => typeof value === "string" ? value.trim().length > 0 : Boolean(value);

const Projects = () => {
  const { data } = usePortfolioData();
  const { projects } = data;

  const [activeProject, setActiveProject] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeProject) return;
      
      const displayImages = activeProject.images && activeProject.images.length > 0
        ? activeProject.images
        : activeProject.image
          ? [activeProject.image]
          : [];

      if (displayImages.length <= 1) return;

      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => prev === 0 ? displayImages.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => prev === displayImages.length - 1 ? 0 : prev + 1);
      } else if (e.key === 'Escape') {
        setIsFullScreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProject]);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth <= 650) {
        setItemsPerPage(1);
      } else if (window.innerWidth <= 1100) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const sortedProjects = projects ? [...projects]
    .filter(p => !p.isHidden)
    .sort((a, b) => {
    const pA = a.priority !== undefined && a.priority !== '' ? Number(a.priority) : 9999;
    const pB = b.priority !== undefined && b.priority !== '' ? Number(b.priority) : 9999;
    return pA - pB;
  }) : [];

  const totalPages = Math.ceil((sortedProjects?.length || 0) / itemsPerPage);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollLeft = containerRef.current.scrollLeft;
    const clientWidth = containerRef.current.clientWidth;
    if (clientWidth > 0) {
      const newPage = Math.round(scrollLeft / clientWidth) + 1;
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: (page - 1) * containerRef.current.clientWidth,
        behavior: "smooth"
      });
    }
  };

  const handleToggleShowAll = () => {
    if (!containerRef.current) {
      setShowAll(!showAll);
      return;
    }

    const container = containerRef.current;
    
    // 1. Get current height
    const startHeight = container.offsetHeight;
    
    // 2. Temporarily lock the height style
    container.style.height = `${startHeight}px`;
    container.style.transition = 'none';
    container.style.overflow = 'hidden';

    // 3. Toggle the state
    setShowAll((prev) => {
      const nextShowAll = !prev;
      
      // 4. In the next microtask (after React updates the DOM classes), animate the height
      setTimeout(() => {
        // Measure target height
        container.style.height = '';
        const endHeight = container.offsetHeight;
        
        // Put it back to start height to begin transition
        container.style.height = `${startHeight}px`;
        
        // eslint-disable-next-line no-unused-expressions
        container.offsetHeight; 
        
        // Animate to end height
        container.style.transition = 'height 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        container.style.height = `${endHeight}px`;
        
        // Clean up inline styles once transition completes
        const cleanup = (e) => {
          if (e.propertyName === 'height') {
            container.style.height = '';
            container.style.transition = '';
            container.style.overflow = '';
            container.removeEventListener('transitionend', cleanup);
          }
        };
        container.addEventListener('transitionend', cleanup);
      }, 0);
      
      return nextShowAll;
    });

    // Scroll back to top of projects section when toggled
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


        <div className="projects-carousel-wrapper">
          <div 
            ref={containerRef}
            onScroll={handleScroll}
            className={showAll ? "projects-showroom animate-fadeIn" : "projects-showroom-scrollable"}
          >
            {sortedProjects.map((project, index) => {
              const displayImages = normalizeImageList(
                project.images && project.images.length > 0
                  ? project.images
                  : project.image
                    ? [project.image]
                    : []
              );
              return (
                <div 
                  className="project-card-v2 animate-slideUp cursor-pointer" 
                  key={project.id || index}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => handleOpenProject(project)}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProject(project);
                        }}
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
        </div>

        {/* PROJECTS FOOTER CONTROLS */}
        {sortedProjects.length > 3 && (
          <div className="projects-controls-container">
            {/* Centered Pagination Dots */}
            {!showAll && totalPages > 1 && (
              <div className="pagination-container animate-fadeIn">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`page-point ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageChange(page)}
                    aria-label={`Go to page ${page}`}
                  />
                ))}
              </div>
            )}
            
            {/* Right-aligned Toggle Button */}
            <button 
              className="projects-toggle-btn"
              onClick={handleToggleShowAll}
            >
              {showAll ? "Show Less" : "Show All"}
            </button>
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
                      className="modal-hero-img cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); setIsFullScreen(true); }}
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

                {hasContent(activeProject.videoLink) && (
                  <div className="info-card">
                    <span className="info-card-label">Watch Demo</span>
                    <div className="video-container">
                      {activeProject.videoLink.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video controls className="video-player">
                          <source src={activeProject.videoLink} type={`video/${activeProject.videoLink.split('.').pop()}`} />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <iframe
                          src={normalizeVideoUrl(activeProject.videoLink)}
                          title="Project Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="video-player"
                        ></iframe>
                      )}
                    </div>
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

      {/* FULLSCREEN IMAGE OVERLAY */}
      {isFullScreen && activeProject && (
        <div className="fullscreen-overlay" onClick={() => setIsFullScreen(false)}>
          <button className="fullscreen-close" onClick={(e) => { e.stopPropagation(); setIsFullScreen(false); }}>
            ✕
          </button>
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
              <img 
                src={displayImages[selectedImageIndex]} 
                alt="Full screen view" 
                className="fullscreen-img" 
                onClick={(e) => e.stopPropagation()} 
              />
            );
          })()}
        </div>
      )}
    </>
  );
};

export default Projects;
