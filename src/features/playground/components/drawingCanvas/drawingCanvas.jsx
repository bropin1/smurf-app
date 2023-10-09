import React, { useEffect, useState } from "react";

import "./drawingCanvas.css";
const lineWidth = 50;
const DrawingCanvas = ({
  drawingCanvasRef,
  canvasDimension,
  actionType,
  color,
  brushSize,
}) => {
  const [drawing, setDrawing] = useState(false);
  const resolutionFactor = 3;

  useEffect(() => {
    const canvasElement = drawingCanvasRef.current;
    if (!canvasElement) return;
    const startDrawing = (event) => {
      if (actionType !== "brush" && actionType !== "eraser") return;
      console.log("start drawing");
      const ctx = drawingCanvasRef.current.getContext("2d");
      ctx.beginPath();
      setDrawing(true);
    };

    const getCoordinates = (event, rect, resolutionFactor) => {
      let x, y;

      if (event.touches) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
      } else {
        x = event.clientX;
        y = event.clientY;
      }

      return {
        x: (x - rect.left) * resolutionFactor,
        y: (y - rect.top) * resolutionFactor,
      };
    };

    const draw = (event) => {
      if (actionType !== "brush" && actionType !== "eraser") return;
      if (!drawing) return;

      const ctx = drawingCanvasRef.current.getContext("2d");

      const rect = drawingCanvasRef.current.getBoundingClientRect();
      const { x, y } = getCoordinates(event, rect, resolutionFactor);

      ctx.lineTo(x, y);
      ctx.lineWidth = brushSize * resolutionFactor;
      ctx.lineCap = "round";

      if (actionType === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = color;
      }
      ctx.stroke();
    };

    const endDrawing = () => {
      if (actionType !== "brush" && actionType !== "eraser") return;
      const ctx = drawingCanvasRef.current.getContext("2d");
      ctx.closePath();
      setDrawing(false);
    };

    // Mouse Events
    canvasElement.addEventListener("mousedown", startDrawing);
    canvasElement.addEventListener("mousemove", draw);
    canvasElement.addEventListener("mouseup", endDrawing);
    // Touch Events
    canvasElement.addEventListener("touchstart", startDrawing);
    canvasElement.addEventListener("touchmove", draw);
    canvasElement.addEventListener("touchend", endDrawing);

    return () => {
      canvasElement.removeEventListener("mousedown", startDrawing);
      canvasElement.removeEventListener("mousemove", draw);
      canvasElement.removeEventListener("mouseup", endDrawing);
      canvasElement.removeEventListener("touchstart", startDrawing);
      canvasElement.removeEventListener("touchmove", draw);
      canvasElement.removeEventListener("touchend", endDrawing);
    };
  }, [drawingCanvasRef, actionType, drawing, color, brushSize]);

  return (
    <canvas
      className="drawing-canvas"
      ref={drawingCanvasRef}
      width={canvasDimension.width * resolutionFactor}
      height={canvasDimension.height * resolutionFactor}
      style={{
        width: canvasDimension.width + "px",
        height: canvasDimension.height + "px",
      }}
    />
  );
};

export default DrawingCanvas;
