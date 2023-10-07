//useDraggble.js
import { useState, useCallback, useRef, useEffect } from "react";
import { calculateAngle } from "../../utils/calculateAngle";
import { getDistance } from "../../utils/getDistance";

const useDraggable = (
  bindExternalPos,
  bindExternalSize,
  bindExternalRotation,
  imgAspectRatio
) => {
  const [position, setPosition] = useState({ x: 100, y: 200 });
  const [size, setSize] = useState(100);
  const [rotation, setRotation] = useState(0);
  const initialMousePosRef = useRef({ x: 0, y: 0 });
  const initialRotationRef = useRef(0);
  const initialAngleRef = useRef(0);

  const initialPinchDistanceRef = useRef(0);
  const initialPinchAngleRef = useRef(0);

  useEffect(() => {
    bindExternalSize(size);
  });

  useEffect(() => {
    bindExternalPos(position);
  });
  const handlePinchGesture = useCallback(
    (e) => {
      if (e.touches.length !== 2) return;

      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = getDistance(
        touch1.clientX,
        touch1.clientY,
        touch2.clientX,
        touch2.clientY
      );
      const angle = calculateAngle(
        touch1.clientX,
        touch1.clientY,
        touch2.clientX,
        touch2.clientY
      );

      if (initialPinchDistanceRef.current === null) {
        initialPinchDistanceRef.current = distance;
        initialPinchAngleRef.current = angle;
        return;
      }

      const deltaDistance = Math.abs(
        distance - initialPinchDistanceRef.current
      );
      const deltaAngle = angle - initialPinchAngleRef.current;

      if (Math.abs(deltaDistance) > Math.abs(deltaAngle)) {
        // Zoom
        const scaleFactor =
          1 +
          (distance - initialPinchDistanceRef.current) /
            initialPinchDistanceRef.current;
        initialPinchDistanceRef.current = distance;

        setSize((prevSize) => {
          const newSize = prevSize * scaleFactor;
          if (bindExternalSize) {
            bindExternalSize(newSize);
          }
          return newSize;
        });
      } else {
        // Rotate
        setRotation((prevRotation) => {
          const newRotation = (prevRotation - deltaAngle) % 360;
          if (bindExternalRotation) {
            bindExternalRotation(newRotation);
          }
          return newRotation;
        });
        initialPinchAngleRef.current = angle;
      }
    },
    [bindExternalSize, bindExternalRotation]
  );

  const endPinchGesture = () => {
    initialPinchDistanceRef.current = null;
    initialPinchAngleRef.current = null;
  };

  const getPositionFromEvent = (e) => {
    if (e.touches) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return e;
  };

  const handleDrag = useCallback(
    (e) => {
      const { clientX, clientY } = getPositionFromEvent(e);

      const offsetX = clientX - initialMousePosRef.current.x;
      const offsetY = clientY - initialMousePosRef.current.y;

      setPosition((prev) => {
        return {
          x: prev.x + offsetX,
          y: prev.y + offsetY,
        };
      });

      if (bindExternalPos) {
        bindExternalPos((prev) => {
          return {
            x: prev.x + offsetX,
            y: prev.y + offsetY,
          };
        });
      }
      initialMousePosRef.current = { x: clientX, y: clientY };
    },
    [bindExternalPos]
  );

  const handleResize = useCallback(
    (e) => {
      //position is actually the center of the image
      const { clientX, clientY } = e;

      setSize((prevSize) => {
        const deltaX = Math.abs(clientX - position.x);
        const deltaY = Math.abs(clientY - position.y);

        let newWidth = undefined;
        let aspectLockedWidth, aspectLockedHeight;

        aspectLockedWidth = 2 * deltaX;
        aspectLockedHeight = 2 * deltaY;
        newWidth = Math.max(
          aspectLockedWidth,
          aspectLockedHeight * imgAspectRatio
        );

        if (!newWidth) return prevSize;

        if (bindExternalSize) {
          bindExternalSize(newWidth);
        }

        return newWidth;
      });
    },
    [position, bindExternalSize, imgAspectRatio]
  );

  const handleRotate = useCallback(
    (e) => {
      const { clientX, clientY } = e;
      setRotation((prevRotation) => {
        const angle = calculateAngle(position.x, position.y, clientX, clientY);

        const newAngle =
          (initialRotationRef.current + initialAngleRef.current - angle) % 360;

        if (bindExternalRotation) {
          bindExternalRotation(newAngle);
        }

        return newAngle;
      });
    },

    [position, bindExternalRotation]
  );

  const handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    initialMousePosRef.current = { x: clientX, y: clientY };
    const angle = calculateAngle(position.x, position.y, clientX, clientY);
    initialRotationRef.current = rotation;
    initialAngleRef.current = angle;
    console.log("rotation", rotation);
    console.log("angle", angle);
  };

  return {
    position,
    size,
    rotation,
    handleDrag,
    handleMouseDown,
    handleResize,
    handleRotate,
    endPinchGesture,
    handlePinchGesture,
  };
};

export default useDraggable;
