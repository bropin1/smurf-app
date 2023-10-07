import { useState } from "react";

export const useObjManipulation = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  let initialMousePos = { x: 0, y: 0 };
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState(100); // size in percentage

  const handleDrag = (e) => {
    const { clientX, clientY } = e;

    // Calculate new position
    const offsetX = clientX - initialMousePos.x;
    const offsetY = clientY - initialMousePos.y;

    setPosition((prevPos) => ({
      x: prevPos.x + offsetX,
      y: prevPos.y + offsetY,
    }));

    initialMousePos = { x: clientX, y: clientY };
  };
  const handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    initialMousePos = { x: clientX, y: clientY };
  };

  const handleRotation = (newRotation) => {
    setRotation(newRotation);
  };

  const handleResize = (newSize) => {
    setSize(newSize);
  };

  return {
    position,
    rotation,
    size,
    handleDrag,
    handleRotation,
    handleResize,
    handleMouseDown,
  };
};
