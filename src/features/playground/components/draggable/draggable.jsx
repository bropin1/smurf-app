//dragabble.js
import React, { useEffect, useRef, useState } from "react";
import useDraggable from "./useDraggable";
import "./draggable.css";
import {
  setGlobalCursor,
  removeGlobalCursor,
} from "../../../../utils/manipulateGlobalCursor";
import CustomCursor from "../../../../components/customCursor/customCursor";

const DraggableComponent = ({
  img,
  bindPosition,
  bindSize,
  bindRotation,
  deactivate = true,
}) => {
  const imgRef = useRef(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const [toggle, setToggle] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  const {
    position,
    size,
    rotation,
    handleDrag,
    handleMouseDown,
    handleResize,
    handleRotate,
    endPinchGesture,
    handlePinchGesture,
  } = useDraggable(
    bindPosition,
    bindSize,
    bindRotation,
    imgDimensions.width / imgDimensions.height
  );

  const dragDownHandler = (e) => {
    if (deactivate) return;
    e.preventDefault();
    e.stopPropagation();

    const evt = e.type === "touchstart" ? e.touches[0] : e;
    handleMouseDown(evt);

    const moveEvent = e.type === "touchstart" ? "touchmove" : "mousemove";
    const endEvent = e.type === "touchstart" ? "touchend" : "mouseup";

    window.addEventListener(moveEvent, handleDrag);

    const removeListeners = () => {
      window.removeEventListener(moveEvent, handleDrag);
    };

    window.addEventListener(endEvent, removeListeners);
  };

  const resizeDownHandler = (e) => {
    if (deactivate) return;
    e.preventDefault();
    e.stopPropagation();
    setGlobalCursor("move");

    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", () => {
      removeGlobalCursor();
      window.removeEventListener("mousemove", handleResize);
    });
  };

  const rotateDownHandler = (e) => {
    if (deactivate) return;
    e.preventDefault();
    e.stopPropagation();
    setMouseDown(true);
    handleMouseDown(e);
    setToggle(true);
    window.addEventListener("mousemove", handleRotate);
    window.addEventListener("mouseup", () => {
      setMouseDown(false);
      setToggle(false);

      window.removeEventListener("mousemove", handleRotate);
    });
  };

  useEffect(() => {
    const imageObj = new Image();
    imageObj.src = img;
    imageObj.onload = () => {
      const aspectRatio = imageObj.width / imageObj.height;
      setImgDimensions({ width: size, height: size / aspectRatio });
    };
  }, [img, size]);

  useEffect(() => {
    const touchMoveHandler = (e) => {
      if (deactivate) return;
      if (e.touches.length === 2) {
        e.preventDefault();
        e.stopPropagation();
        handlePinchGesture(e);
      }
    };

    const touchEndHandler = () => {
      if (deactivate) return;
      endPinchGesture();
    };

    window.addEventListener("touchmove", touchMoveHandler);
    window.addEventListener("touchend", touchEndHandler);

    // Cleanup
    return () => {
      window.removeEventListener("touchmove", touchMoveHandler);
      window.removeEventListener("touchend", touchEndHandler);
    };
  }, [handlePinchGesture, endPinchGesture, deactivate]);

  const style = {
    width: `${size}px`,
    transform: `rotate(${rotation}deg)`,
    top: `${position.y - imgDimensions.height / 2}px`,
    left: `${position.x - size / 2}px`,
    opacity: deactivate ? 0.7 : 1,
    cursor: deactivate ? "default" : "grab",
    pointerEvents: deactivate ? "none" : "auto",
  };

  return (
    <div className="draggable-root">
      <CustomCursor toggle={toggle} />
      <div className="draggable-container">
        <div
          className="draggable"
          style={style}
          onMouseDown={dragDownHandler}
          onTouchStart={dragDownHandler}
        >
          <div className="draggable-wrapper">
            <div
              className="controls-wrapper"
              style={{ display: deactivate ? "none" : "" }}
            >
              <div
                className="rotate-corner top-left"
                onMouseEnter={() => {
                  setToggle(true);
                }}
                onMouseLeave={() => {
                  if (mouseDown) return;
                  setToggle(false);
                }}
                onMouseDown={(e) => {
                  rotateDownHandler(e, "pointer");
                }}
              />

              <div
                className="draggable-corner top-left"
                onMouseDown={(e) => {
                  resizeDownHandler(e, "nwse-resize");
                }}
              />

              <div
                className="rotate-corner top-right"
                onMouseEnter={() => {
                  setToggle(true);
                }}
                onMouseLeave={() => {
                  if (mouseDown) return;
                  setToggle(false);
                }}
                onMouseDown={(e) => {
                  setToggle(true);
                  rotateDownHandler(e, "pointer");
                }}
              />
              <div
                className="draggable-corner top-right"
                onMouseDown={(e) => {
                  resizeDownHandler(e, "nesw-resize");
                }}
              />
              <div
                className="rotate-corner bottom-right"
                onMouseEnter={() => {
                  setToggle(true);
                }}
                onMouseLeave={() => {
                  if (mouseDown) return;
                  setToggle(false);
                }}
                onMouseDown={(e) => {
                  rotateDownHandler(e, "pointer");
                }}
              />
              <div
                className="draggable-corner bottom-right"
                onMouseDown={(e) => {
                  resizeDownHandler(e, "nwse-resize");
                }}
              />
              <div
                className="rotate-corner bottom-left"
                onMouseEnter={() => {
                  setToggle(true);
                }}
                onMouseLeave={() => {
                  if (mouseDown) return;
                  setToggle(false);
                }}
                onMouseDown={(e) => {
                  setToggle(true);
                  rotateDownHandler(e, "pointer");
                }}
              />
              <div
                className="draggable-corner bottom-left"
                onMouseDown={(e) => {
                  resizeDownHandler(e, "nesw-resize");
                }}
              />
            </div>
            <img
              alt=""
              src={img}
              style={{ width: "100%" }}
              ref={imgRef}
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraggableComponent;
