import { useRef } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Icubeverse from "../components/Icubeverse";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Scene from "../components/Scene";
import { SolidBox, SolidPyramid, SolidSphere } from "../components/Solids";
import useSceneTransitions from "../hooks/useSceneTransitions";

// Scenes hand off one to the next. Tones: light / grey, with dark scenes for rhythm.
const SCENES = [
  { key: "hero", tone: "hero", content: <Hero /> },
  {
    key: "about",
    tone: "light",
    content: <About />,
    shapes: (
      <>
        <SolidBox size={130} depth={0.35} style={{ left: "3%", top: "64%" }} />
        <SolidSphere size={84} tone="neon" depth={0.18} hideSm style={{ right: "12%", top: "72%" }} />
      </>
    ),
  },
  {
    key: "work",
    tone: "grey",
    content: <Projects />,
    shapes: (
      <>
        <SolidPyramid size={150} depth={0.3} style={{ right: "4%", top: "14%" }} />
        <SolidBox w={210} h={34} d={120} tone="ink" depth={0.2} hideSm style={{ left: "2%", top: "76%" }} />
      </>
    ),
  },
  {
    key: "skills",
    tone: "dark",
    content: <Skills />,
    shapes: (
      <>
        <SolidSphere size={110} depth={0.25} hideSm style={{ right: "6%", top: "12%" }} />
        <SolidBox size={84} tone="neon" depth={0.4} hideSm style={{ left: "3%", top: "70%" }} />
      </>
    ),
  },
  {
    key: "experience",
    tone: "light",
    content: <Experience />,
    shapes: <SolidPyramid size={110} tone="ink" depth={0.3} style={{ left: "4%", top: "62%" }} />,
  },
  {
    key: "icube",
    tone: "grey",
    content: <Icubeverse />,
    shapes: (
      <>
        <SolidBox size={110} tone="neon" depth={0.3} hideSm style={{ right: "9%", top: "20%" }} />
        <SolidPyramid size={80} depth={0.2} hideSm style={{ left: "7%", top: "70%" }} />
      </>
    ),
  },
  {
    key: "contact",
    tone: "dark",
    content: (
      <>
        <Contact />
        <Footer />
      </>
    ),
    shapes: (
      <>
        <SolidSphere size={130} depth={0.2} hideSm style={{ right: "3%", top: "30%" }} />
        <SolidBox size={64} tone="neon" depth={0.45} hideSm style={{ right: "6%", top: "12%" }} />
      </>
    ),
  },
];

export default function Home() {
  const root = useRef(null);
  useSceneTransitions(root);

  return (
    <>
      <Navbar />
      <div className="scenes" ref={root}>
        {SCENES.map((s, i) => (
          <Scene key={s.key} index={i} tone={s.tone} shapes={s.shapes}>
            {s.content}
          </Scene>
        ))}
      </div>
    </>
  );
}
