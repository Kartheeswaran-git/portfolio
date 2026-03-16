// PROJECTS
export const projects = [
  {
    id: 1,
    title: "Smart Agriculture System",
    description: "IoT based smart irrigation using ESP32",
    longDescription:
      "Automated irrigation system with soil moisture sensors, mobile alerts, and remote control using ESP32.",
    image: "/projects/agri.jpg",
  },
  {
    id: 2,
    title: "Elephant Detection System",
    description: "AI + IoT based wildlife protection system",
    longDescription:
      "ESP32-CAM based elephant detection system that alerts forest rangers using GSM module.",
    image: "/projects/elephant.jpg",
  },
];

export const technicalExplorations = [
  {
    id: 1,
    title: "Edge Vision Prototype",
    description: "Real-time object detection experiments on low-power hardware.",
    longDescription:
      "A sandbox for testing lightweight computer vision pipelines, inference speed, and deployment tradeoffs on embedded devices.",
    image: "/projects/elephant.jpg",
  },
];

// SKILLS
export const skills = [
  {
    name: "ESP32",
    level: 8,
    exp: "3+ years • 8 projects",
  },
  {
    name: "React",
    level: 7,
    exp: "2+ years • 6 projects",
  },
  {
    name: "IoT Sensors",
    level: 9,
    exp: "3+ years • 10+ projects",
  },
];

// ROLES (optional but recommended)
export const roles = [
  {
    title: "IoT Developer",
    company: "Smart Agriculture & Automation",
  },
  {
    title: "Full Stack Developer",
    company: "React & Web Applications",
  },
];

// ✅ THIS WAS MISSING (IMPORTANT)
export const defaultData = {
  projects,
  technicalExplorations,
  skills,
  roles,
};
