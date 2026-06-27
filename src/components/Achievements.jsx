import { useState, useEffect, useRef } from "react";
import usePortfolioData from "../hooks/usePortfolioData";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import "./Section.css";
import { normalizeImageList } from "../utils/imageLinks";

const hasContent = (value) => typeof value === "string" ? value.trim().length > 0 : Boolean(value);

const Achievements = () => {
  const { data } = usePortfolioData();
  const { achievements } = data;

  const [activeAchievement, setActiveAchievement] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeAchievement) return;
      
      const displayImages = activeAchievement.images && activeAchievement.images.length > 0
        ? activeAchievement.images
        : activeAchievement.image
          ? [activeAchievement.image]
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
  }, [activeAchievement]);

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

  const sortedAchievements = achievements ? [...achievements]
    .filter(a => !a.isHidden)
    .sort((a, b) => {
      const pA = a.priority !== undefined && a.priority !== '' ? Number(a.priority) : 9999;
      const pB = b.priority !== undefined && b.priority !== '' ? Number(b.priority) : 9999;
      return pA - pB;
  }) : [];

  const totalPages = Math.ceil((sortedAchievements?.length || 0) / itemsPerPage);

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

    // Scroll back to top of achievements section when toggled
    const section = document.getElementById("achievements-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenAchievement = (achievement) => {
    setActiveAchievement(achievement);
    setSelectedImageIndex(0);
  };

  return (
    <>
      <section id="achievements-section" className="section-card animate-slideUp">
        <h2 className="section-title">Achievements</h2>

        <div className="projects-carousel-wrapper">
          <div 
            ref={containerRef}
            onScroll={handleScroll}
            className={showAll ? "projects-showroom animate-fadeIn" : "projects-showroom-scrollable"}
          >
            {sortedAchievements.map((achievement, index) => {
              const displayImages = normalizeImageList(
                achievement.images && achievement.images.length > 0
                  ? achievement.images
                  : achievement.image
                    ? [achievement.image]
                    : []
              );
              return (
                <div 
                  className="project-card-v2 animate-slideUp cursor-pointer" 
                  key={achievement.id || index}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => handleOpenAchievement(achievement)}
                >
                  <div className="card-img-wrapper">
                    {displayImages.length > 0 ? (
                      <img 
                        src={displayImages[0]} 
                        alt={achievement.title || "Achievement"} 
                        className="card-img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="card-img placeholder-img flex items-center justify-center bg-slate-200">
                        <span className="text-slate-400">No Image</span>
                      </div>
                    )}
                    <div className="card-overlay">
                      <span className="card-btn">View Details</span>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <h3 className="card-title">{achievement.title || "Untitled Achievement"}</h3>
                    
                    {hasContent(achievement.description) && (
                      <p className="card-description">
                        {achievement.description}
                      </p>
                    )}

                    <div className="card-footer">
                      <button
                        className="card-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAchievement(achievement);
                        }}
                      >
                        View Details <FaArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACHIEVEMENTS FOOTER CONTROLS */}
        {sortedAchievements.length > 3 && (
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
      {activeAchievement && (
        <div className="modal-overlay" onClick={() => setActiveAchievement(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setActiveAchievement(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="modal-scroll-container">
              {/* IMMERSIVE HERO */}
              <div className="modal-hero">
              {(() => {
                const displayImages = normalizeImageList(
                  activeAchievement.images && activeAchievement.images.length > 0
                    ? activeAchievement.images
                    : activeAchievement.image
                      ? [activeAchievement.image]
                      : []
                );
                if (displayImages.length === 0) return null;
                
                return (
                  <>
                    <img
                      src={displayImages[selectedImageIndex]}
                      alt={activeAchievement.title || "Achievement"}
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
                  <h3 className="project-title-v2">{activeAchievement.title || "Untitled Achievement"}</h3>
                </div>

                {hasContent(activeAchievement.description) && (
                  <div className="info-card">
                    <span className="info-card-label">Description</span>
                    <div className="modal-text-v2">{activeAchievement.description}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* FULLSCREEN IMAGE OVERLAY */}
      {isFullScreen && activeAchievement && (
        <div className="fullscreen-overlay" onClick={() => setIsFullScreen(false)}>
          <button className="fullscreen-close" onClick={(e) => { e.stopPropagation(); setIsFullScreen(false); }}>
            ✕
          </button>
          {(() => {
            const displayImages = normalizeImageList(
              activeAchievement.images && activeAchievement.images.length > 0
                ? activeAchievement.images
                : activeAchievement.image
                  ? [activeAchievement.image]
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

export default Achievements;
