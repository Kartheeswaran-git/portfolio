import usePortfolioData from "../hooks/usePortfolioData";
import "./Section.css";

const TechnicalSkills = () => {
  const { data } = usePortfolioData();
  const { skills } = data;

  return (
    <section className="section-card animate-slideUp">
      <h2 className="section-title">Technical Skills</h2>

      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div className="skill-card" key={index}>
            {/* ICON */}
            <div className="skill-icon">
              {skill.name ? skill.name.charAt(0) : "?"}
            </div>

            {/* DETAILS */}
            <div className="skill-details">
              <div className="skill-title">{skill.name || "Unknown Skill"}</div>
              <div className="skill-exp">{skill.exp || "N/A"}</div>

              <div className="skill-bars">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`skill-bar ${
                      i < (skill.level || 0) ? "active" : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechnicalSkills;
