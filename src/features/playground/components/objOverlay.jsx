import React from "react";
import Draggable from "react-draggable";
import hat from "../../../assets/hat.png";

const objOverlay = ({ position, rotation, size }) => {
  const style = {
    transform: `rotate(${rotation}deg) scale(${size / 100})`,
  };

  return (
    <Draggable>
      <div className="obj-overlay">
        <div className="transform-utility" style={style}>
          <img src={hat} alt="Hat" draggable={false} />
        </div>
      </div>
    </Draggable>
  );
};

export default objOverlay;
