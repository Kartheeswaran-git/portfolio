import AboutMe from "../components/AboutMe";
import Header from "../components/Header";
import TechnicalSkills from "../components/TechnicalSkills";
import Projects from "../components/Projects";
import TechnicalExplorations from "../components/TechnicalExplorations";
import Achievements from "../components/Achievements";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <AboutMe />       {/* LANDING SECTION */}
      <Projects />
      <TechnicalExplorations />
      <Achievements />
      <TechnicalSkills />
      <Footer />
      {/* <Domains /> */}
      {/* <CareerObjective /> */}
      {/* <Strengths /> */}
    </>
  );
};

export default Home;

