import { useState, useEffect } from "react";
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
  const itemsPerPage = 6;

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

  const totalPages = Math.ceil((achievements?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  
  const sortedAchievements = achievements ? [...achievements]
    .filter(a => !a.isHidden)
    .sort((a, b) => {
      const pA = a.priority !== undefined && a.priority !== '' ? Number(a.priority) : 9999;
      const pB = b.priority !== undefined && b.priority !== '' ? Number(b.priority) : 9999;
      return pA - pB;
  }) : [];
  
  const currentAchievements = sortedAchievements.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

        <div className="projects-showroom">
          {currentAchievements.map((achievement, index) => {
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
                style={{ animationDelay: `${index * 0.15}s` }}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <div className="pagination-dots">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`pagination-dot ${currentPage === idx + 1 ? 'active' : ''}`}
                  aria-label={`Page ${idx + 1}`}
                />
              ))}
            </div>
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
