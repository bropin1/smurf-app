export const mergeNDownloadCanvas = (
  backgroundImg,
  canvasOrigin,
  canvasDimension,
  drawingCanvasRef,
  sticker
) => {
  console.log("mergeNDownloadCanvas");

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const { stickerImg, stickerPosition, stickerSize, stickerRotation } = sticker;

  const maxDim = 3000;
  const scalingFactor = Math.min(
    1,
    maxDim / Math.max(backgroundImg.width, backgroundImg.height)
  );

  canvas.width = backgroundImg.width * scalingFactor;
  canvas.height = backgroundImg.height * scalingFactor;

  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  //drawPaint
  const drawingCanvas = drawingCanvasRef.current;
  if (drawingCanvas) {
    ctx.globalAlpha = 0.5;
    ctx.drawImage(drawingCanvas, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
  }

  const scalingRatio = canvas.width / canvasDimension.width;

  const aspectRatio = stickerImg.width / stickerImg.height;
  const newWidth = stickerSize * scalingRatio;
  const newHeight = newWidth / aspectRatio;

  ctx.save();
  let newstickerPosition = {
    x: stickerPosition.x - canvasOrigin.x,
    y: stickerPosition.y - canvasOrigin.y,
  };

  newstickerPosition = {
    x: newstickerPosition.x * scalingRatio,
    y: newstickerPosition.y * scalingRatio,
  };

  ctx.translate(newstickerPosition.x, newstickerPosition.y);
  ctx.rotate(stickerRotation * (Math.PI / 180));
  ctx.drawImage(stickerImg, -newWidth / 2, -newHeight / 2, newWidth, newHeight);
  ctx.restore();

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "merged-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }, "image/png");
};
