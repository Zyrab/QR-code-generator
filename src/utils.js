import QRCode from "qrcode";

export const generateQRCode = async (canvasEl, text, logoSource) => {
  try {
    const ctx = canvasEl.getContext("2d");

    // 1. Generate QR with HIGH Error Correction
    // This makes the QR code denser but "stronger" against logos covering it.
    await QRCode.toCanvas(canvasEl, text, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: "H", // <--- CRITICAL FIX (Was 'M' or default)
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    // 2. Handle Logo
    if (logoSource) {
      const img = new Image();
      img.crossOrigin = "anonymous";

      let url;
      let isObjectUrl = false;

      // Handle File vs Base64 String
      if (logoSource instanceof File || logoSource instanceof Blob) {
        url = URL.createObjectURL(logoSource);
        isObjectUrl = true;
      } else {
        url = logoSource;
      }

      img.onload = () => {
        // Calculate safe logo size (Max 20% of QR width)
        // On a 300px canvas, this is 60px.
        const canvasWidth = canvasEl.width;
        const maxLogoSize = canvasWidth * 0.25;

        const x = (canvasWidth - maxLogoSize) / 2;
        const y = (canvasWidth - maxLogoSize) / 2;

        // 3. Draw a "Quiet Zone" (White Background) behind the logo
        // This prevents dark logos from merging with dark QR dots
        ctx.fillStyle = "#ffffff";
        // Make the white box slightly larger than the logo (padding)
        const padding = 6;
        ctx.fillRect(x - padding / 2, y - padding / 2, maxLogoSize + padding, maxLogoSize + padding);

        // 4. Draw the Logo
        ctx.drawImage(img, x, y, maxLogoSize, maxLogoSize);

        if (isObjectUrl) URL.revokeObjectURL(url);
      };

      img.src = url;
    }
  } catch (err) {
    console.error(err);
  }
};
// Helper to trigger download
export const downloadCanvas = (canvasEl) => {
  const link = document.createElement("a");
  link.download = `qrcode-${Date.now()}.png`;
  link.href = canvasEl.toDataURL();
  link.click();
};

export const resizeImage = (file, maxDimension = 150) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // 1. Calculate Size (Keep it small! 100px is perfect for QR logos)
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round(height * (maxDimension / width));
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round(width * (maxDimension / height));
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // 2. Return Base64 String instead of Blob
        // usage: "data:image/png;base64,iVBORw0KGgoAAA..."
        const dataUrl = canvas.toDataURL("image/png", 0.8);
        resolve(dataUrl);
      };

      img.onerror = reject;
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ... keep generateQRCode and downloadCanvas as is
