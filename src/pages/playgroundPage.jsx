import { useEffect } from "react";
import Playground from "../features/playground/playground";
import hatSticker from "../assets/hat.png";
import "./playgroundPage.css";

const PlaygroundPage = () => {
  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // Initialize the variable on mount and on resize
    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div
      className="playground-page"
      onTouchStart={(e) => {
        e.preventDefault();
      }}
    >
      <header className="playground-header">
        <span>Smurf site</span>
      </header>
      <Playground sticker={hatSticker} />
    </div>
  );
};

export default PlaygroundPage;
