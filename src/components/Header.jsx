import { useEffect, useState, useRef } from "react";
import "./Section.css";

const Header = () => {
  const [activeSection, setActiveSection] = useState("home-section");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, top: 0, height: 0, opacity: 0 });
  const [isReady, setIsReady] = useState(false);
  
  const navContainerRef = useRef(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const isFirstMount = useRef(true);

  const navItems = [
    { label: "Home", href: "#home-section" },
    { label: "Projects", href: "#projects-section" },
    { label: "Explorations", href: "#explorations-section" },
    { label: "Skills", href: "#skills-section" },
    { label: "Contact", href: "#contact-section" },
  ];

  // IntersectionObserver for Scroll Spy
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -60% 0px",
      threshold: 0,
    };

    const handleIntersection = (entries) => {
      // If programmatically scrolling from a navbar click, ignore updates to prevent flickering
      if (isScrollingRef.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const sectionIds = ["home-section", "projects-section", "explorations-section", "skills-section", "contact-section"];
    
    const timer = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Update sliding indicator box dimensions & position when active section changes
  useEffect(() => {
    const updateIndicator = () => {
      if (!navContainerRef.current) return;
      const activeEl = navContainerRef.current.querySelector(`a[href="#${activeSection}"]`);
      if (activeEl) {
        setIndicatorStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          top: activeEl.offsetTop,
          height: activeEl.offsetHeight,
          opacity: 1
        });
        
        // Turn on transition only after the first placement
        if (isFirstMount.current) {
          isFirstMount.current = false;
          // Defer making isReady true slightly so position is set instantly first
          setTimeout(() => setIsReady(true), 50);
        } else {
          setIsReady(true);
        }
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    // Update immediately (no timeout) on activeSection changes for snappiness
    updateIndicator();

    window.addEventListener("resize", updateIndicator);
    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeSection]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Temporarily lock scroll spy updates
      isScrollingRef.current = true;
      setActiveSection(targetId);

      const headerOffset = 90;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      // Clear any previous timer
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      // Re-enable scroll spy after smooth scroll completes (approx 800ms)
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  };

  return (
    <header className="portfolio-top-nav animate-slideDown">
      <a 
        className="portfolio-nav-logo" 
        href="#home-section" 
        onClick={(e) => handleNavClick(e, "#home-section")}
      >
        Karthee<span>.</span>
      </a>

      <nav ref={navContainerRef} className="portfolio-nav-menu" aria-label="Portfolio navigation">
        <span 
          className={`nav-active-indicator ${isReady ? "has-transition" : ""}`}
          style={{
            position: "absolute",
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            top: `${indicatorStyle.top}px`,
            height: `${indicatorStyle.height}px`,
            opacity: indicatorStyle.opacity,
          }}
        />
        {navItems.map((item) => (
          <a 
            key={item.href} 
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            className={activeSection === item.href.replace("#", "") ? "active" : ""}
            style={{ position: "relative", zIndex: 1 }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Header;



