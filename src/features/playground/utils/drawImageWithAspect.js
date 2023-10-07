export const drawImageWithAspect = (ctx, img, x, y, width, height) => {
  const imgAspect = img.width / img.height;
  const canvasAspect = width / height;
  let newWidth, newHeight;

  if (imgAspect > canvasAspect) {
    newWidth = width;
    newHeight = width / imgAspect;
  } else {
    newWidth = height * imgAspect;
    newHeight = height;
  }

  const xOffset = (width - newWidth) / 2;
  const yOffset = (height - newHeight) / 2;

  ctx.drawImage(img, x + xOffset, y + yOffset, newWidth, newHeight);
};
