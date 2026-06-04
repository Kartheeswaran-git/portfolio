import AboutMe from "../components/AboutMe";
import Header from "../components/Header";
import TechnicalSkills from "../components/TechnicalSkills";
import Projects from "../components/Projects";
import TechnicalExplorations from "../components/TechnicalExplorations";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <AboutMe />       {/* LANDING SECTION */}
      <Projects />
      <TechnicalExplorations />
      <TechnicalSkills />
      <Footer />
      {/* <Domains /> */}
      {/* <CareerObjective /> */}
      {/* <Strengths /> */}
    </>
  );
};

export default Home;

