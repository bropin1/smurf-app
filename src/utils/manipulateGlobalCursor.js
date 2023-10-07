export const setGlobalCursor = (cursorType) => {
  const styleEl = document.createElement("style");
  styleEl.id = "global-cursor-style";
  styleEl.innerHTML = `* { cursor: ${cursorType} !important; }`;
  document.head.appendChild(styleEl);
};

export const removeGlobalCursor = () => {
  const styleEl = document.getElementById("global-cursor-style");
  if (styleEl) {
    document.head.removeChild(styleEl);
  }
};
