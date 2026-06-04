import { useEffect, useState } from "react";
import usePortfolioData from "../hooks/usePortfolioData";
import profileImg from "../img/profile.png";
import "./Section.css";

const AboutMe = () => {
  const { data } = usePortfolioData();
  const { headlines = [], links = {} } = data || {};

  const displayRoles = headlines.map(h => h.text).filter(Boolean);

  // Helper to get safe link
  const getLinkUrl = (key) => {
    return links[key] || "#";
  };

  // 🔹 Typing animation states
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const typingSpeed = 80;
  const deletingSpeed = 50;
  const pauseTime = 1200;

  useEffect(() => {
    if (displayRoles.length === 0) return;
    
    // Ensure index is within bounds if data suddenly changes
    const safeIndex = roleIndex % displayRoles.length;
    const currentRole = displayRoles[safeIndex] || "";
    let timer;

    if (!isDeleting && text.length < currentRole.length) {
      // TYPE → LEFT to RIGHT
      timer = setTimeout(() => {
        setText(currentRole.substring(0, text.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && text.length === currentRole.length) {
      // PAUSE
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
    } else if (isDeleting && text.length > 0) {
      // DELETE → RIGHT to LEFT
      timer = setTimeout(() => {
        setText(currentRole.substring(0, text.length - 1));
      }, deletingSpeed);
    } else if (isDeleting && text.length === 0) {
      // NEXT ROLE
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % displayRoles.length);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, roleIndex, displayRoles]);

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section id="home-section" className="about-hero">
        <div className="about-hero-container">
          {/* LEFT */}
          <div className="about-hero-left animate-left">
            <h1 className="hero-title">
              Hi, I'm <span>Kartheeswaran</span>
            </h1>

            {/* 🔹 Dynamic typing role */}
            <h2 className="hero-role typing-text">
              {text}
              <span className="cursor">|</span>
            </h2>

            <p className="hero-text">
              I design and build real-world solutions using ESP32, IoT, AI,
              and modern web technologies. My work focuses on Smart
              Agriculture, Automation, and Embedded Systems.
            </p>

            <a href={getLinkUrl("resume")} target="_blank" rel="noopener noreferrer">
              <button className="hero-btn">Download Resume</button>
            </a>

            <div className="hero-contact-grid">
              <a href={getLinkUrl("github")} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={getLinkUrl("linkedin")} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={getLinkUrl("email") !== "#" ? `mailto:${getLinkUrl("email")}` : "#"}>Email</a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="about-hero-right animate-right">
            <img
              src={profileImg}
              alt="Profile"
              className="hero-img"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutMe;
