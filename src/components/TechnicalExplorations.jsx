import { useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil((technicalExplorations?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExplorations = technicalExplorations?.slice(startIndex, startIndex + itemsPerPage) || [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

        <div className="projects-showroom">
          {currentExplorations.map((exploration, index) => {
            const displayImages = normalizeImageList(
              exploration.images && exploration.images.length > 0
                ? exploration.images
                : exploration.image
                  ? [exploration.image]
                  : []
            );

            return (
              <div
                className="project-card-v2 animate-slideUp"
                key={exploration.id || index}
                style={{ animationDelay: `${index * 0.15}s` }}
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
                      onClick={() => handleOpenExploration(exploration)}
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
                        className="modal-hero-img"
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
    </>
  );
};

export default TechnicalExplorations;
