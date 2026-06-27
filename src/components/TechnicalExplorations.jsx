import { useState, useEffect, useRef } from "react";
import usePortfolioData from "../hooks/usePortfolioData";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./Section.css";
import { normalizeImageList } from "../utils/imageLinks";
import { normalizeVideoUrl } from "../utils/videoLinks";

const hasContent = (value) =>
  typeof value === "string" ? value.trim().length > 0 : Boolean(value);

const TechnicalExplorations = () => {
  const { data } = usePortfolioData();
  const { technicalExplorations } = data;

  const [activeExploration, setActiveExploration] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeExploration) return;
      
      const displayImages = activeExploration.images && activeExploration.images.length > 0
        ? activeExploration.images
        : activeExploration.image
          ? [activeExploration.image]
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
  }, [activeExploration]);

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

  const sortedExplorations = technicalExplorations ? [...technicalExplorations]
    .filter(exp => !exp.isHidden)
    .sort((a, b) => {
    const pA = a.priority !== undefined && a.priority !== '' ? Number(a.priority) : 9999;
    const pB = b.priority !== undefined && b.priority !== '' ? Number(b.priority) : 9999;
    return pA - pB;
  }) : [];

  const totalPages = Math.ceil((sortedExplorations?.length || 0) / itemsPerPage);

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
      
      // 4. In the next microtask, animate the height
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

    // Scroll back to top of explorations section when toggled
    const section = document.getElementById("explorations-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenExploration = (exploration) => {
    setActiveExploration(exploration);
    setSelectedImageIndex(0);
  };

  const explorationTools =
    activeExploration?.toolsUsed
      ?.split(",")
      .map((tool) => tool.trim())
      .filter(Boolean) || [];

  return (
    <>
      <section id="explorations-section" className="section-card animate-slideUp">
        <h2 className="section-title">Technical Explorations</h2>

        <div className="projects-carousel-wrapper">
          <div 
            ref={containerRef}
            onScroll={handleScroll}
            className={showAll ? "projects-showroom animate-fadeIn" : "projects-showroom-scrollable"}
          >
            {sortedExplorations.map((exploration, index) => {
              const displayImages = normalizeImageList(
                exploration.images && exploration.images.length > 0
                  ? exploration.images
                  : exploration.image
                    ? [exploration.image]
                    : []
              );

              return (
                <div
                  className="project-card-v2 animate-slideUp cursor-pointer"
                  key={exploration.id || index}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => handleOpenExploration(exploration)}
                >
                  <div className="card-img-wrapper">
                    {displayImages.length > 0 && (
                      <img
                        src={displayImages[0]}
                        alt={exploration.title || "Technical Exploration"}
                        className="card-img"
                      />
                    )}
                    <div className="card-overlay" />
                  </div>

                  <div className="card-content">
                    <div className="flex justify-between items-start">
                      <h3 className="card-title">
                        {exploration.title || "Untitled Exploration"}
                      </h3>
                    </div>

                    <p className="card-description">
                      {exploration.abstract ||
                        exploration.description ||
                        "No description available."}
                    </p>

                    <div className="card-footer">
                      <button
                        className="card-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenExploration(exploration);
                        }}
                      >
                        View Details <FaArrowRight size={12} />
                      </button>
                      {hasContent(exploration.demo) && (
                        <span className="card-badge">Featured</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* EXPLORATIONS FOOTER CONTROLS */}
        {sortedExplorations.length > 3 && (
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

      {activeExploration && (
        <div
          className="modal-overlay"
          onClick={() => setActiveExploration(null)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setActiveExploration(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="modal-scroll-container">
              <div className="modal-hero">
                {(() => {
                  const displayImages = normalizeImageList(
                    activeExploration.images &&
                    activeExploration.images.length > 0
                      ? activeExploration.images
                      : activeExploration.image
                        ? [activeExploration.image]
                        : []
                  );

                  if (displayImages.length === 0) return null;

                  return (
                    <>
                      <img
                        src={displayImages[selectedImageIndex]}
                        alt={activeExploration.title || "Technical Exploration"}
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
                              setSelectedImageIndex((prev) =>
                                prev === 0 ? displayImages.length - 1 : prev - 1
                              );
                            }}
                          >
                            <FaChevronLeft />
                          </button>
                          <button
                            className="modal-nav-btn modal-nav-next"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImageIndex((prev) =>
                                prev === displayImages.length - 1 ? 0 : prev + 1
                              );
                            }}
                          >
                            <FaChevronRight />
                          </button>

                          <div className="modal-floating-gallery">
                            {displayImages.map((_, idx) => (
                              <div
                                key={idx}
                                className={`modal-thumb-v2 ${
                                  selectedImageIndex === idx ? "active" : ""
                                }`}
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

              <div className="modal-body-v2">
                <div className="modal-main-content">
                  <div className="modal-header-v2">
                    <h3 className="project-title-v2">
                      {activeExploration.title || "Untitled Exploration"}
                    </h3>
                  </div>

                  {hasContent(activeExploration.abstract) && (
                    <div className="info-card">
                      <span className="info-card-label">Abstract</span>
                      <div className="modal-text-v2">
                        {activeExploration.abstract}
                      </div>
                    </div>
                  )}

                  {hasContent(activeExploration.videoLink) && (
                    <div className="info-card">
                      <span className="info-card-label">Watch Exploration</span>
                      <div className="video-container">
                        {activeExploration.videoLink.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video controls className="video-player">
                            <source src={activeExploration.videoLink} type={`video/${activeExploration.videoLink.split('.').pop()}`} />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <iframe
                            src={normalizeVideoUrl(activeExploration.videoLink)}
                            title="Exploration Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="video-player"
                          ></iframe>
                        )}
                      </div>
                    </div>
                  )}

                  {hasContent(activeExploration.description) && (
                    <div className="info-card">
                      <span className="info-card-label">Explain</span>
                      <div className="modal-text-v2">
                        {activeExploration.description}
                      </div>
                    </div>
                  )}

                  {hasContent(activeExploration.longDescription) && (
                    <div className="info-card">
                      <span className="info-card-label">Long Explain</span>
                      <div className="modal-text-v2">
                        {activeExploration.longDescription}
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-sidebar-v2">
                  {explorationTools.length > 0 && (
                    <div className="sidebar-card">
                      <span className="info-card-label">Tools Used</span>
                      <div className="tech-tags-v2">
                        {explorationTools.map((tool, i) => (
                          <span key={i} className="tech-tag-v2">
                            {tool.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(hasContent(activeExploration.demo) ||
                    hasContent(activeExploration.github)) && (
                    <div className="sidebar-card">
                      <span className="info-card-label">Live Interaction</span>
                      <div className="action-btns-v2">
                      {hasContent(activeExploration.demo) && (
                        <a
                          href={activeExploration.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-v2 btn-v2-secondary"
                        >
                          <FaExternalLinkAlt /> Experience Live
                        </a>
                      )}
                      {hasContent(activeExploration.github) && (
                        <a
                          href={activeExploration.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-v2 btn-v2-primary"
                        >
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
      {isFullScreen && activeExploration && (
        <div className="fullscreen-overlay" onClick={() => setIsFullScreen(false)}>
          <button className="fullscreen-close" onClick={(e) => { e.stopPropagation(); setIsFullScreen(false); }}>
            ✕
          </button>
          {(() => {
            const displayImages = normalizeImageList(
              activeExploration.images && activeExploration.images.length > 0
                ? activeExploration.images
                : activeExploration.image
                  ? [activeExploration.image]
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

export default TechnicalExplorations;
