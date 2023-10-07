import React, { useState, useEffect } from "react";
import "./customCursor.css";
import {
  setGlobalCursor,
  removeGlobalCursor,
} from "../../utils/manipulateGlobalCursor";

export default function CustomCursor({ toggle }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updatePosition);

    if (toggle) {
      setGlobalCursor("none");
    } else {
      removeGlobalCursor();
    }

    return () => {
      removeGlobalCursor();
      window.removeEventListener("mousemove", updatePosition);
    };
  }, [toggle]);

  return (
    <div
      className="custom-cursor"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: toggle ? 1 : 0,
      }}
    />
  );
}
