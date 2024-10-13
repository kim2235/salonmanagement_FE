export const generateMicrotime = (): number => {
    const time = performance.now(); // Get high-resolution time in milliseconds
    return Math.floor(Date.now() / 1000) * 1000 + Math.floor(time % 1000); // Combine seconds and milliseconds
};
