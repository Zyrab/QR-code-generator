"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Loader2, Download, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { HeaderGroup } from "@/components/elements/heading-group";
import Section from "@/components/layout/section";
import InputArea from "./input-area";
import UploadLogo from "./upload-logo";
import QRCodeRenderer from "./renderer";
import AdSpace from "@/components/ui/ad-space";

import { resizeImage } from "@/lib/qr-utils";
import { useQRCodeGenerator } from "@/hooks/use-qr-generator";
import { useQRDownload } from "@/hooks/use-qr-download";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio";
import { useQR } from "@/context/qr-context";
import { QRData, QRContent } from "@/types/qr";
import Designer from "./designer";

type HeaderType = {
  header: {
    title?: string;
    subtitle?: string;
  };
};
export default function Generator({ header }: HeaderType) {
  const { user } = useAuth();

  const [downloadSize, setDownloadSize] = useState(2000);
  const [downloadFormat, setDownloadFormat] = useState<"png" | "jpeg" | "svg">("png");

  const isEditing = useRef<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [qrData, setQrData] = useState<QRData>({
    name: "",
    content: {
      type: "url",
      url: "",
    },
    design: {
      dotType: "square",
      bodyColor: "#000000",
      bgColor: "#ffffff",
      logo: null,
      logoStyle: "square",
      eyeFrame: "square",
      eyeBall: "square",
    },
  });

  const [draftContent, setDraftContent] = useState(qrData.content);
  const [draftName, setDraftName] = useState(qrData.name);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { getQrById, updateQr, saveQr, loading } = useQR();

  useEffect(() => {
    if (id) {
      const data = getQrById(id);
      if (data) setQrData(data);
      isEditing.current = true;
      if (data?.name) setDraftName(data.name);
      if (data?.content) setDraftContent(data.content);
    }
  }, [id, getQrById]);

  const debouncedUpdate = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debouncedUpdate.current) {
      clearTimeout(debouncedUpdate.current);
    }
    debouncedUpdate.current = setTimeout(() => {
      setQrData((prev) => ({
        ...prev,
        content: draftContent,
        name: draftName,
      }));
    }, 300);
  }, [draftContent, draftName]);

  const { matrix } = useQRCodeGenerator(qrData.content, Boolean(qrData.design.logo));
  const { downloadQrCode, isDownloading } = useQRDownload();

  const handleDownload = () => {
    if (!isContentFilled) return;
    const fileName = qrData.name || "qr-code";
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
        const resizedBase64 = await resizeImage(file);
        setQrData((prev) => ({
          ...prev,
          design: { ...prev.design, logo: resizedBase64 },
        }));
      } catch (err) {
        console.error("Error resizing image:", err);
      }
    }
  };

  const handleSaveQr = async () => {
    if (isEditing.current) {
      if (id) await updateQr(id, qrData);
    } else {
      await saveQr(qrData);
    }
  };

  const onContentChange = (field: string, value: string) => {
    setDraftContent((prev) => ({ ...prev, [field]: value }));
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraftName(e.target.value);
  };

  const onDesignChange = (key: keyof QRData["design"], value: any) =>
    setQrData((prev) => ({ ...prev, design: { ...prev.design, [key]: value } }));

  const contentCheckers: Record<QRContent["type"], (content: QRContent) => boolean> = {
    url: (content) => (content.type === "url" ? content.url.trim() !== "" : false),
    text: (content) => (content.type === "text" ? content.text.trim() !== "" : false),
    wifi: (content) => (content.type === "wifi" ? content.ssid.trim() !== "" || content.password.trim() !== "" : false),
  };

  const isContentFilled = contentCheckers[qrData.content.type](qrData.content);

  return (
    <Section>
      {header ? <HeaderGroup tag="h1" header={header.title} subheading={header.subtitle} /> : null}

      <div className="flex flex-col gap-4 w-full items-center md:items-stretch md:justify-center md:flex-row">
        <Card width="2xl">
          <InputArea
            content={draftContent}
            name={draftName}
            onContentChange={onContentChange}
            onNameChange={onNameChange}
          />
          <Designer design={qrData.design} onDesignChange={onDesignChange} />
          <UploadLogo logo={qrData.design.logo} setQrData={setQrData} handleImageUpload={handleImageUpload} />
        </Card>
        <Card width="sm">
          <div
            className="aspect-square flex relative overflow-hidden transition-colors duration-300"
            style={{ backgroundColor: qrData.design.bgColor === "transparent" ? "#fff" : qrData.design.bgColor }}
          >
            {!isContentFilled && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 z-10 backdrop-blur-[1px]">
                <span className="text-sm font-medium text-muted-foreground bg-background/80 px-3 py-1 rounded-full border shadow-sm">
                  Enter {qrData.content.type} to preview
                </span>
              </div>
            )}

            <QRCodeRenderer matrix={matrix} svgRef={svgRef} size={500} design={qrData.design} />
          </div>

          <Slider
            value={[downloadSize]}
            onValueChange={(val: any) => setDownloadSize(val[0])}
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

          <Button onClick={handleDownload} disabled={!isContentFilled || isDownloading} variant="default">
            {isDownloading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Download className="mr-2 h-4 w-4" />}
            Download
          </Button>
          {/* Save Action */}
          <Button size="lg" variant="outline" disabled={!isContentFilled || loading} onClick={handleSaveQr}>
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            {user ? "Save to Dashboard" : "Sign in to Save"}
          </Button>
        </Card>
      </div>
      <AdSpace />
    </Section>
  );
}
