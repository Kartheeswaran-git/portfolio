import usePortfolioData from "../hooks/usePortfolioData";
import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt, FaArrowUp } from "react-icons/fa";
import "./Section.css";

const Footer = () => {
  const { data } = usePortfolioData();
  const { links = {} } = data || {};



  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer id="contact-section" className="portfolio-footer section-card animate-slideUp">
      <div className="footer-content">
        <h2 className="section-title">Get in Touch</h2>
      

        <div className="footer-contact-links">
          {links.email && links.email !== "#" && (
            <a 
              href={`mailto:${links.email}`} 
              className="footer-contact-card"
              title="Send an Email"
            >
              <div className="footer-icon-wrapper email-color">
                <FaEnvelope className="footer-icon" />
              </div>
              <span className="contact-label">Email</span>
              <span className="contact-value">{links.email}</span>
            </a>
          )}

          {links.linkedin && links.linkedin !== "#" && (
            <a 
              href={links.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-contact-card"
              title="Connect on LinkedIn"
            >
              <div className="footer-icon-wrapper linkedin-color">
                <FaLinkedin className="footer-icon" />
              </div>
              <span className="contact-label">LinkedIn</span>
              <span className="contact-value">View Profile</span>
            </a>
          )}

          {links.github && links.github !== "#" && (
            <a 
              href={links.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-contact-card"
              title="Check GitHub"
            >
              <div className="footer-icon-wrapper github-color">
                <FaGithub className="footer-icon" />
              </div>
              <span className="contact-label">GitHub</span>
              <span className="contact-value">View Repositories</span>
            </a>
          )}

          {links.resume && links.resume !== "#" && (
            <a 
              href={links.resume} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-contact-card"
              title="Download Resume"
            >
              <div className="footer-icon-wrapper resume-color">
                <FaFileAlt className="footer-icon" />
              </div>
              <span className="contact-label">Resume</span>
              <span className="contact-value">Download PDF</span>
            </a>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <button 
          onClick={handleBackToTop} 
          className="back-to-top-btn" 
          aria-label="Back to top"
          title="Back to top"
        >
          <FaArrowUp />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
