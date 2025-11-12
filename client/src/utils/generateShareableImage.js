export const generateShareableImage = async (
  imageUrl,
  logoUrl,
  watermarkText = "MyWebsite.com"
) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    const logo = new Image();

    img.crossOrigin = "anonymous";
    logo.crossOrigin = "anonymous";

    img.src = imageUrl;
    logo.src = logoUrl;

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      canvas.width = width;
      canvas.height = height;

      // Draw the original image
      ctx.drawImage(img, 0, 0, width, height);

      // Add overlay gradient for better visibility
      const gradient = ctx.createLinearGradient(0, height - 200, 0, height);
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, height - 200, width, 200);

      // Add watermark text
      ctx.font = `${Math.floor(width * 0.025)}px Poppins`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.textAlign = "left";
      ctx.fillText(watermarkText, 20, height - 30);

      // Draw logo (bottom-right corner)
      logo.onload = () => {
        const logoWidth = width * 0.15;
        const logoHeight = (logo.height / logo.width) * logoWidth;
        ctx.drawImage(
          logo,
          width - logoWidth - 20,
          height - logoHeight - 20,
          logoWidth,
          logoHeight
        );

        resolve(canvas.toDataURL("image/png"));
      };

      logo.onerror = reject;
    };

    img.onerror = reject;
  });
};
