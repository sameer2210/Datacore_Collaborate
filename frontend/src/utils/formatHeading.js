// src/utils/formatHeading.js
export const formatHeading = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")   // har uppercase ke pehle space
    .replace(/^./, (str) => str.toUpperCase()); 
};
