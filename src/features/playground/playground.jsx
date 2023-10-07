import React, { useEffect, useRef, useState } from "react";
import hat from "../../assets/hat.png";
import Draggable from "./components/draggable/draggable";
import { drawImageWithAspect } from "./utils/drawImageWithAspect";
import { mergeNDownloadCanvas } from "./utils/mergeNDownloadCanvas";
import DrawingCanvas from "./components/drawingCanvas/drawingCanvas";
import { Button } from "@mui/material";
import { styled } from "@mui/system";

import "./playground.css";

const canvasMaxResolution = { width: 3400, height: 2800 };
const defaultSize = 200;

const WorkspaceCanvas = ({ sticker = hat }) => {
  const backgroundCanvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const canvasMergerRef = useRef(null);
  const [canvasMaxDimension, setCanvasMaxDimension] = useState({
    width: 800,
    height: 600,
  });

  const [canvasDimension, setCanvasDimension] = useState({
    width: 800,
    height: 600,
  });

  const [canvasOrigin, setCanvasOrigin] = useState({ x: 0, y: 0 });
  const [activeAction, setActiveAction] = useState("sticker"); // sticker // brush // eraser
  const parentRef = useRef(null);
  const [loadedBgImg, setLoadedBgImg] = useState(null);
  const [loadedStickerImg, setLoadedStickerImg] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState(defaultSize);
  const fileInputRef = useRef(null);

  const DownloadButton = styled(Button)`
    position: absolute;
    right: 16px;
    bottom: 16px;
    z-index: 1;
    background-color: #3498db;
    color: #fff;
    padding: 8px 24px;
    font-size: 16px;

    &:hover {
      background-color: #2980b9;
    }
  `;

  const FullSizeInputWrapper = styled("div")`
    width: 100%;
    height: 100%;
    position: relative;
  `;

  const InfoText = styled("div")`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    z-index: 5;
    color: #7f8c8d;
  `;

  const ActionButton = styled(Button)`
    background-color: ${(props) => (props.isactive ? "#000" : "transparent")};
    border: 2px solid #000;
    color: ${(props) => (props.isactive ? "#fff" : "#000")};

    &:hover {
      color: ${(props) => (props.isactive ? "#fff" : "#fff")};
      background-color: ${(props) => (props.isactive ? "#000" : "#000")};
    }
  `;

  useEffect(() => {
    if (parentRef.current) {
      const { clientWidth, clientHeight } = parentRef.current;
      setCanvasDimension({ width: clientWidth, height: clientHeight });
      setCanvasMaxDimension({ width: clientWidth, height: clientHeight });
    }
  }, []);

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        setLoadedBgImg(img);
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!loadedBgImg || !loadedStickerImg) return;
    const rect = canvasMergerRef.current.getBoundingClientRect();
    const canvasOrigin = { x: rect.x, y: rect.y };

    mergeNDownloadCanvas(
      loadedBgImg,
      canvasOrigin,
      canvasDimension,
      drawingCanvasRef,
      {
        stickerImg: loadedStickerImg,
        stickerPosition: position,
        stickerSize: size,
        stickerRotation: rotation,
      }
    );
  };

  useEffect(() => {
    loadImage(sticker)
      .then((img) => {
        if (img.src !== sticker.src) {
          setLoadedStickerImg(img);
        }
      })
      .catch(console.error);
  }, [sticker]);

  useEffect(() => {
    if (!loadedBgImg) return;
    const canvas = backgroundCanvasRef.current;
    const backgroundCtx = canvas.getContext("2d");

    const aspectRatio = loadedBgImg.width / loadedBgImg.height;
    let canvasX, canvasY, canvasWidth, canvasHeight;

    // Calculate maximum possible dimensions based on the aspect ratio
    let maxPossibleWidth = canvasMaxDimension.height * aspectRatio;
    let maxPossibleHeight = canvasMaxDimension.width / aspectRatio;

    // If maxPossibleWidth is within the container, set canvasWidth and canvasHeight accordingly
    if (maxPossibleWidth <= canvasMaxDimension.width) {
      canvasHeight = canvasMaxDimension.height;
      canvasWidth = maxPossibleWidth;
    } else {
      // Otherwise, use maxPossibleHeight for canvasHeight and adjust canvasWidth
      canvasWidth = canvasMaxDimension.width;
      canvasHeight = maxPossibleHeight;
    }

    // Your code to adjust canvasX and canvasY for high-resolution drawing would go here
    if (canvasMaxResolution.width / canvasMaxResolution.height > aspectRatio) {
      canvasY = canvasMaxResolution.height;
      canvasX = canvasY * aspectRatio;
    } else {
      canvasX = canvasMaxResolution.width;
      canvasY = canvasX / aspectRatio;
    }

    canvas.width = canvasX;
    canvas.height = canvasY;

    canvas.style.width = canvasWidth + "px";
    canvas.style.height = canvasHeight + "px";

    drawImageWithAspect(
      backgroundCtx,
      loadedBgImg,
      0,
      0,
      canvas.width,
      canvas.height
    );

    setCanvasDimension({ width: canvasWidth, height: canvasHeight });
  }, [loadedBgImg, canvasMaxDimension]);

  useEffect(() => {
    const el = canvasMergerRef.current;
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    setCanvasOrigin({ x: rect.x, y: rect.y });
    console.log("rect", { x: rect.x, y: rect.y });
  }, [loadedBgImg, canvasMaxDimension]);

  useEffect(() => {
    console.log("canvasOrigin", canvasOrigin);
  }, [canvasOrigin]);

  return (
    <div className="playground-root">
      {/* <div className="header"></div> */}

      <div className="canvas-wrapper">
        {!loadedBgImg && (
          <FullSizeInputWrapper onClick={() => fileInputRef.current.click()}>
            <InfoText>Click or tap to upload an image</InfoText>
            <input
              className="input-file"
              type="file"
              id="fileInput"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </FullSizeInputWrapper>
        )}
        <div className="canvas-parent" ref={parentRef}>
          {loadedBgImg && (
            <div className="action-button-wrapper">
              <ActionButton
                isactive={activeAction === "sticker"}
                onClick={() => setActiveAction("sticker")}
                onTouchStart={(e) => setActiveAction("sticker")}
              >
                Sticker
              </ActionButton>
              <ActionButton
                isactive={activeAction === "brush"}
                onClick={() => setActiveAction("brush")}
                onTouchStart={(e) => setActiveAction("brush")}
              >
                brush
              </ActionButton>
              <ActionButton
                isactive={activeAction === "eraser"}
                onClick={() => setActiveAction("eraser")}
                onTouchStart={(e) => setActiveAction("eraser")}
              >
                eraser
              </ActionButton>
            </div>
          )}
          <div
            className="canvas-merger"
            ref={canvasMergerRef}
            style={{
              width: canvasDimension.width,
              height: canvasDimension.height,
            }}
          >
            <canvas ref={backgroundCanvasRef} className="canvas" />
            <DrawingCanvas
              drawingCanvasRef={drawingCanvasRef}
              color={`#3498db`}
              canvasDimension={canvasDimension}
              actionType={activeAction}
            />
          </div>
          <DownloadButton onClick={handleDownload}>Download</DownloadButton>
        </div>
      </div>
      {loadedBgImg && (
        <Draggable
          img={hat}
          defaultSize={defaultSize}
          bindPosition={setPosition}
          bindSize={setSize}
          bindRotation={setRotation}
          size={size}
          rotation={rotation}
          deactivate={activeAction !== "sticker"}
        />
      )}
    </div>
  );
};

export default WorkspaceCanvas;
