// export function calculateAngle(x1, y1, x2, y2) {
//   const deltaY = y2 - y1;
//   const deltaX = x2 - x1;
//   const angleInRadians = Math.atan2(deltaY, deltaX);
//   console.log("angleInRadians", angleInRadians);
//   const angleInDegrees = angleInRadians * (180 / Math.PI);

//   return angleInDegrees;
// }

// export function calculateAngle(x1, y1, x2, y2) {
//   const deltaY = y2 - y1;
//   const deltaX = x2 - x1;
//   let angleInRadians = Math.atan2(deltaY, deltaX);
//   console.log("angleInRadians", angleInRadians);
//   let angleInDegrees = (angleInRadians * (180 / Math.PI) - 90 + 360) % 360;

//   return angleInDegrees;
// }

// export function calculateAngle(x1, y1, x2, y2) {
//   const deltaY = y2 - y1;
//   const deltaX = x2 - x1;
//   let angleInRadians = Math.atan2(deltaY, deltaX);

//   // Adjust for the desired starting quadrant (top-right)
//   angleInRadians = angleInRadians - Math.PI / 2;
//   console.log("angleInRadians", angleInRadians / Math.PI);
//   // If the angle is negative, make it positive
//   if (angleInRadians < 0) {
//     angleInRadians += 2 * Math.PI;
//   }

//   // Convert to degrees
//   const angleInDegrees = angleInRadians * (180 / Math.PI);

//   return angleInDegrees;
// }

// export function calculateAngle(x1, y1, x2, y2) {
//   const deltaY = y2 - y1;
//   const deltaX = x2 - x1;

//   // Calculate the hypotenuse length
//   const hypotenuse = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

//   // Calculate cosine of the angle
//   const cosTheta = deltaX / hypotenuse;

//   // Calculate angle in radians based on cosine
//   let angleInRadians = Math.acos(cosTheta);

//   // Adjust for the desired starting quadrant (top-right)
//   angleInRadians = angleInRadians - Math.PI / 2;

//   // If the angle is negative, make it positive
//   if (angleInRadians < 0) {
//     angleInRadians += 2 * Math.PI;
//   }

//   // Convert to degrees
//   const angleInDegrees = angleInRadians * (180 / Math.PI);

//   return angleInDegrees;
// }

export function calculateAngle(x1, y1, x2, y2) {
  const deltaY = y2 - y1;
  const deltaX = x2 - x1;

  // Calculate the hypotenuse length
  const hypotenuse = Math.sqrt(deltaX ** 2 + deltaY ** 2);

  // Calculate cosine and sine of the angle
  const cosTheta = deltaX / hypotenuse;
  const sinTheta = deltaY / hypotenuse;

  // Calculate angle in radians based on cosine
  let angleInRadians = Math.acos(cosTheta);

  // Adjust for quadrants
  if (sinTheta >= 0) {
    angleInRadians = 2 * Math.PI - angleInRadians;
  }

  // Convert to degrees
  const angleInDegrees = angleInRadians * (180 / Math.PI);

  return angleInDegrees;
}
