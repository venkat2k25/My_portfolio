import { useEffect } from "react";
import Home from "./pages/Home";
import { handleAnchorClicks, startSmoothScroll, stopSmoothScroll } from "./lib/smoothScroll";
import GuideCharacter from "./components/GuideCharacter";
import "./styles/scroll-story.css";
import "./styles/scenes.css";


function App() {
  useEffect(() => {
    startSmoothScroll();
    document.addEventListener("click", handleAnchorClicks);
    return () => {
      document.removeEventListener("click", handleAnchorClicks);
      stopSmoothScroll();
    };
  }, []);

  return (
    <>
      <Home />
      <GuideCharacter />
    </>
  );
}

export default App;
