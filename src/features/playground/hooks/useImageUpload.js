import { useState } from "react";

export const useImageUpload = () => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target?.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  return { image, handleImageUpload };
};
