import { FaArrowRight } from "react-icons/fa";
import "./Section.css";

const ActivityHeatmaps = () => {
  const githubUsername = "Kartheeswaran-git";
  const leetcodeUsername = "YHwFohqRdR";

  return (
    <section id="activity-section" className="section-card animate-slideUp">
      <h2 className="section-title">Coding Activity</h2>

      <div className="projects-showroom" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {/* GitHub Contribution Graph */}
        <div
          className="project-card-v2 animate-slideUp"
          style={{ animationDelay: '0.1s', cursor: 'default' }}
        >
          <div className="card-img-wrapper" style={{ paddingTop: '35%', background: '#fafafa' }}>
            <img
              src={`https://ghchart.rshah.org/4f46e5/${githubUsername}`}
              alt="GitHub Contribution Graph"
              className="card-img"
              style={{ objectFit: 'contain', padding: '1rem' }}
              loading="lazy"
            />
            <div className="card-overlay" />
          </div>

          <div className="card-content">
            <div className="flex items-center gap-3">
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: '#0d1117', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </div>
              <h3 className="card-title" style={{ fontSize: '1.3rem' }}>GitHub Contributions</h3>
            </div>
            
            <p className="card-description">
              Year-round contribution activity across repositories, pull requests, issues, and code reviews.
            </p>

            <div className="card-footer">
              <a
                href={`https://github.com/${githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card-btn"
                style={{ textDecoration: 'none' }}
              >
                View Profile <FaArrowRight size={12} />
              </a>
              <span className="card-badge">@{githubUsername}</span>
            </div>
          </div>
        </div>

        {/* LeetCode Stats */}
        <div
          className="project-card-v2 animate-slideUp"
          style={{ animationDelay: '0.25s', cursor: 'default' }}
        >
          <div className="card-img-wrapper" style={{ paddingTop: '35%', background: '#fafafa' }}>
            <img
              src={`https://leetcard.jacoblin.cool/${leetcodeUsername}?theme=light&font=Source%20Code%20Pro&ext=heatmap`}
              alt="LeetCode Stats & Heatmap"
              className="card-img"
              style={{ objectFit: 'contain', padding: '0.5rem' }}
              loading="lazy"
            />
            <div className="card-overlay" />
          </div>

          <div className="card-content">
            <div className="flex items-center gap-3">
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: '#ffa116', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                </svg>
              </div>
              <h3 className="card-title" style={{ fontSize: '1.3rem' }}>LeetCode Stats</h3>
            </div>

            <p className="card-description">
              Problem-solving journey across easy, medium, and hard challenges with submission heatmap.
            </p>

            <div className="card-footer">
              <a
                href={`https://leetcode.com/u/${leetcodeUsername}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="card-btn"
                style={{ textDecoration: 'none' }}
              >
                View Profile <FaArrowRight size={12} />
              </a>
              <span className="card-badge">LeetCode</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivityHeatmaps;
