"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Loader2, Download, Save } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Section from "@/components/layout/section";
import Radios from "@/components/elements/radio-group";
import { HeaderGroup } from "@/components/elements/heading-group";
import InputArea from "./input-area";
import UploadLogo from "./upload-logo";
import QRCodeRenderer from "./renderer";
import AdSpace from "@/components/ui/ad-space";
import { Slider } from "@/components/ui/slider";

// Logic & Hooks
import { saveToDashboard } from "@/lib/firebase";
import { resizeImage } from "@/lib/qr-utils";
import { useQRCodeGenerator } from "@/hooks/use-qr-generator";
import { useQRDownload } from "@/hooks/use-qr-download";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio";
import { useQR } from "@/context/qr-context";

// Constants
export const bodyShapes = ["square", "softSquare", "circle", "pill", "blob", "fluid", "cutCorner", "blobH", "blobV"];
export const frameShapes = ["square", "circle", "soft", "leaf", "eye", "drop", "hex"];
export const ballhapes = ["square", "circle", "soft", "leaf", "eye", "drop", "hex"];
export const bodyColors = ["#000000", "#1F2937", "#2563EB", "#7C3AED", "#DB2777", "#059669", "#F97316"];
const bgColors = ["#ffffff", "#f3f4f6", "#fef3c7", "#e0f2fe", "transparent"];

interface FormData {
  url: string;
  name: string;
  color: string;
  bgColor: string;
  logo: string | null;
  style: string;
  logoStyle: string;
  eyeFrame: string;
  eyeBall: string;
}

export default function Generator({ showHeader = false }: { showHeader: boolean }) {
  const router = useRouter();
  const { user } = useAuth();

  // States
  const [saving, setSaving] = useState(false);
  const [downloadSize, setDownloadSize] = useState(2000);
  const [downloadFormat, setDownloadFormat] = useState<"png" | "jpeg" | "svg">("png");

  // Reference to the SVG for downloading
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Consolidated Form State
  const [formData, setFormData] = useState<FormData>({
    url: "",
    name: "",
    color: "#000000",
    bgColor: "#ffffff",
    logo: null,
    style: "square",
    logoStyle: "square",
    eyeFrame: "square",
    eyeBall: "square",
  });
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { getQrById, updateQr } = useQR();

  useEffect(() => {
    if (id) {
      const data = getQrById(id);
      if (data) {
        console.log(data);
        setFormData({
          url: data.content.url || "",
          name: data.name,
          ...data.design,
        });
      }
    }
  }, [id, getQrById]);
  // 1. Generate Matrix (Lag free! Input updates instantly, Matrix updates later)
  const { matrix } = useQRCodeGenerator(formData.url);

  // 2. Download Logic
  const { downloadQrCode, isDownloading } = useQRDownload();

  // Handlers
  const handleDownload = () => {
    if (!formData.url) return;
    const fileName = formData.name || "qr-code";
    downloadQrCode(svgRef, fileName, downloadFormat, downloadSize);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2000000) {
        alert("File too large. Please upload an image under 2MB.");
        return;
      }
      try {
        // Ensure this resizes to small dimensions (e.g. 150x150) for DB safety
        const resizedBase64 = await resizeImage(file);
        setFormData((prev) => ({ ...prev, logo: resizedBase64 }));
      } catch (err) {
        console.error("Error resizing image:", err);
      }
    }
  };

  const handleSave = async () => {
    if (!user) {
      router.push("/auth?mode=login");
      return;
    }

    setSaving(true);
    try {
      // Use the new structured format
      await saveToDashboard(user, {
        type: "url",
        name: formData.name,
        content: {
          url: formData.url,
        },
        design: {
          color: formData.color,
          bgColor: formData.bgColor,
          style: formData.style,
          logoStyle: formData.logoStyle,
          eyeFrame: formData.eyeFrame,
          eyeBall: formData.eyeBall,
          logo: formData.logo,
        },
      });

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error saving. If you used a custom logo, it might be too large.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section>
      {showHeader && (
        <HeaderGroup
          tag="h1"
          header="Free QR Code Generator, No Login, No Expiration"
          subheading={"Generate static QR codes for URLs instantly. Download, print, and use them forever."}
        />
      )}

      <div className="flex flex-col gap-4 w-full items-center md:items-stretch md:justify-center md:flex-row">
        <Card width="2xl">
          <InputArea
            url={formData.url}
            name={formData.name}
            onUrlChange={(e) => setFormData({ ...formData, url: e.target.value })}
            onNameChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Radios
            label="Body Pattern"
            type="body"
            value={formData.style}
            onValueChange={(val) => setFormData({ ...formData, style: val })}
            values={bodyShapes}
            size="lg"
          />

          <Radios
            label="Body Color"
            type="color"
            value={formData.color}
            onValueChange={(val) => setFormData({ ...formData, color: val })}
            values={bodyColors}
            shape="circle"
          />
          <div className="w-full flex flex-col gap-6 md:flex-row">
            <Radios
              label="Eye Frame"
              type="frame"
              value={formData.eyeFrame}
              onValueChange={(val) => setFormData({ ...formData, eyeFrame: val })}
              values={frameShapes}
            />

            <Radios
              label="Eye Ball"
              type="ball"
              value={formData.eyeBall}
              onValueChange={(val) => setFormData({ ...formData, eyeBall: val })}
              values={ballhapes}
            />
          </div>

          <Radios
            label="Background Color"
            type="color"
            value={formData.bgColor}
            onValueChange={(val) => setFormData({ ...formData, bgColor: val })}
            values={bgColors}
            shape="circle"
          />

          <UploadLogo logo={formData.logo} setFormData={setFormData} handleImageUpload={handleImageUpload} />
        </Card>
        <Card width="sm">
          <div
            className="aspect-square flex items-center justify-center rounded-lg border border-border relative overflow-hidden transition-colors duration-300"
            style={{ backgroundColor: formData.bgColor === "transparent" ? "#fff" : formData.bgColor }}
          >
            {!formData.url && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 z-10 backdrop-blur-[1px]">
                <span className="text-sm font-medium text-muted-foreground bg-background/80 px-3 py-1 rounded-full border shadow-sm">
                  Enter URL to preview
                </span>
              </div>
            )}

            {/* QR Renderer - Pass ref here if your renderer supports forwardRef, otherwise wrap in div */}
            <QRCodeRenderer
              matrix={matrix}
              svgRef={svgRef}
              size={1000} // Viewbox size
              dotType={formData.style}
              eyeFrame={formData.eyeFrame}
              eyeBall={formData.eyeBall}
              bodyColor={formData.color}
              eyeColor={formData.color}
              bgColor={formData.bgColor}
              logoUrl={formData.logo}
            />
          </div>

          <Slider
            value={[downloadSize]}
            onValueChange={(val: any) => setDownloadSize(val[0])}
            minLabel="Low Q"
            maxLabel="High Q"
            min={500}
            max={4000}
            step={100}
          />

          <RadioGroup
            className="flex ga-4 items-center p-4"
            value={downloadFormat}
            onValueChange={(val: any) => setDownloadFormat(val)}
          >
            <RadioGroupItem value="png">PNG</RadioGroupItem>
            <RadioGroupItem value="jpeg">JPG</RadioGroupItem>
            <RadioGroupItem value="svg">SVG</RadioGroupItem>
          </RadioGroup>

          <Button
            onClick={handleDownload}
            disabled={!formData.url || isDownloading}
            className="flex-1"
            variant="default"
          >
            {isDownloading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Download className="mr-2 h-4 w-4" />}
            Download
          </Button>
          {/* Save Action */}
          <Button
            size="lg"
            variant="outline"
            className="w-full font-bold shadow-sm"
            disabled={!formData.url || saving}
            onClick={handleSave}
          >
            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            {user ? "Save to Dashboard" : "Sign in to Save"}
          </Button>
        </Card>
      </div>
      <AdSpace />
    </Section>
  );
}
