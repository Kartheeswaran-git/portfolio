import usePortfolioData from "../hooks/usePortfolioData";
import "./Section.css";

const TechnicalSkills = () => {
  const { data } = usePortfolioData();
  const { skills } = data;

  return (
    <section id="skills-section" className="section-card animate-slideUp">
      <h2 className="section-title">Technical Skills</h2>

      <div className="skills-list">
        {skills.map((skill, index) => (
          <div className="skill-list-item" key={index}>
            <div className="skill-list-icon">
              {skill.name ? skill.name.charAt(0) : "?"}
            </div>

            <div className="skill-list-content">
              <div className="skill-list-title">{skill.name || "Unknown Skill"}</div>
              {skill.exp && <div className="skill-list-meta">{skill.exp}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechnicalSkills;
