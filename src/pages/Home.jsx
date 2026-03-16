import AboutMe from "../components/AboutMe";
import TechnicalSkills from "../components/TechnicalSkills";
import Projects from "../components/Projects";
import TechnicalExplorations from "../components/TechnicalExplorations";

const Home = () => {
  return (
    <>
      <AboutMe />       {/* LANDING SECTION */}
      <Projects />
      <TechnicalExplorations />
      <TechnicalSkills />
      {/* <Domains /> */}
      {/* <CareerObjective /> */}
      {/* <Strengths /> */}
    </>
  );
};

export default Home;
