import { QRContent } from "@/types/qr";

type ErrorCorrection = "L" | "M" | "Q" | "H";

type DecideECInput = {
  content: QRContent;
  hasLogo: boolean;
  logoScale?: number; // 0–1 (relative width of QR, default ~0.25)
};

export function chooseErrorCorrection({
  content,
  hasLogo,
  logoScale = 0.15,
}: DecideECInput): ErrorCorrection {
  // ---- 1. Estimate payload length ----
  let payloadLength = 0;

  switch (content.type) {
    case "url":
      payloadLength = content.url.length;
      break;
    case "text":
      payloadLength = content.text.length;
      break;
    case "wifi":
      payloadLength =
        content.ssid.length +
        content.password.length +
        20; // protocol overhead
      break;
  }

  // ---- 2. Estimate logo obstruction ----
  // logoScale is width ratio → area ≈ scale²
  const logoAreaRatio = hasLogo ? logoScale * logoScale : 0;

  // ---- 3. Decision matrix ----

  // No logo → always lowest viable EC
  if (!hasLogo) {
    if (payloadLength < 120) return "L";
    if (payloadLength < 250) return "M";
    return "Q";
  }

  // Logo present
  // Small payload + small logo
  if (payloadLength < 120 && logoAreaRatio <= 0.06) {
    return "L";
  }

  // Medium payload or medium logo
  if (
    payloadLength < 250 &&
    logoAreaRatio <= 0.1
  ) {
    return "M";
  }

  // Large payload or large logo
  if (
    payloadLength < 400 &&
    logoAreaRatio <= 0.16
  ) {
    return "Q";
  }

  // Worst case
  return "H";
}
