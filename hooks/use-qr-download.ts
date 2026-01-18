import { useState, useCallback } from "react";

type FileFormat = "png" | "jpeg" | "svg";

export const useQRDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadQrCode = useCallback(
    async (svgRef: React.RefObject<SVGSVGElement|null>, filename: string, format: FileFormat, size: number = 1000) => {
      if (!svgRef.current) return;
      setIsDownloading(true);

      try {
        const svgElement = svgRef.current;

        // 1. Serialize the SVG to a string
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);

        // 2. Prepare the source for the Image object
        // We use encodeURIComponent to ensure special characters in SVG (like #) don't break the data URI
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        // Handle SVG download immediately
        if (format === "svg") {
          const link = document.createElement("a");
          link.href = url;
          link.download = `${filename}.svg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          setIsDownloading(false);
          return;
        }

        // Handle Raster (PNG/JPG)
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          // Set canvas to desired resolution
          canvas.width = size;
          canvas.height = size;

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          // If JPEG, fill white background (otherwise transparent parts become black)
          if (format === "jpeg") {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, size, size);
          }

          // Draw image stretched to canvas size
          ctx.drawImage(img, 0, 0, size, size);

          const dataUrl = canvas.toDataURL(`image/${format}`, 1.0);

          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${filename}.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          URL.revokeObjectURL(url);
          setIsDownloading(false);
        };

        img.onerror = () => {
          console.error("Failed to load SVG for conversion");
          setIsDownloading(false);
        };

        img.src = url;
      } catch (error) {
        console.error("Download failed:", error);
        setIsDownloading(false);
      }
    },
    [],
  );

  return { downloadQrCode, isDownloading };
};
