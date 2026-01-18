"use client";

import { useState, useRef, useMemo } from "react";
import {
  Download,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Link as LinkIcon,
  Loader2,
  ScanQrCode,
  Link2,
  Check,
  X,
  CornerDownRight,
  Palette,
  ChartLine,
} from "lucide-react";

// UI Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { Badge } from "@/components/ui/badge";
import { HeaderGroup } from "@/components/elements/heading-group";
import { Input } from "@/components/ui/input";

// Logic & Types
import QRCodeRenderer from "../generator/renderer";
import { useQRDownload } from "@/hooks/use-qr-download";
import { QRCodeItem, useQR } from "@/context/qr-context";
import { useQRCodeGenerator } from "@/hooks/use-qr-generator";

interface DashboardItemProps {
  item: QRCodeItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (item: QRCodeItem) => void;
}
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default function DashboardItem({ item, onEdit, onDelete, onDuplicate }: DashboardItemProps) {
  // --- Local State ---
  const [downloadSize, setDownloadSize] = useState(1000);
  const [downloadFormat, setDownloadFormat] = useState<"png" | "jpeg" | "svg">("png");

  const [isEditName, setIsEditName] = useState<boolean>(false);
  const [nameDraft, setNameDraft] = useState(item.name);

  const { updateQr } = useQR();

  // Feature flag for dynamic URLs (disabled by default as requested)
  const isDynamic = false;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const { downloadQrCode, isDownloading } = useQRDownload();

  const { matrix } = useQRCodeGenerator(item.content.url || "");
  const handleDownload = () => {
    if (!item.content.url) return;
    const fileName = item.name || "qr-code";
    downloadQrCode(svgRef, fileName, downloadFormat, downloadSize);
  };
  const formattedDate = useMemo(() => {
    return dateFormatter.format(new Date(item.createdAt));
  }, [item.createdAt]);

  return (
    <Card width="auto" size="sm" className="flex-row justify-between">
      {/* 1. Visual Preview Area */}
      <div className="gap-8 flex flex-row">
        <div
          className="w-35 h-35 p-2 transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundColor: item.design.bgColor === "transparent" ? "#ffffff" : item.design.bgColor,
          }}
        >
          <QRCodeRenderer
            matrix={matrix}
            svgRef={svgRef}
            size={200}
            dotType={item.design.style}
            eyeFrame={item.design.eyeFrame}
            eyeBall={item.design.eyeBall}
            bodyColor={item.design.color}
            eyeColor={item.design.color}
            bgColor={item.design.bgColor}
            logoUrl={item.design.logo}
          />
        </div>
        <div className="flex flex-col gap-5">
          <Badge variant="secondary" className="w-full">
            <Link2 />
            {item.type.toUpperCase()}
          </Badge>
          {isDynamic ? (
            <Badge>Dynamic</Badge>
          ) : (
            <Badge variant="secondary" className="w-full">
              Static
            </Badge>
          )}
          {isDynamic && (
            <Badge variant="secondary">
              <ScanQrCode />
              1552
            </Badge>
          )}
        </div>
        <div className="flex flex-col gap-5">
          {!isEditName ? (
            <HeaderGroup tag="h3" header={item.name || "Untitled QR"} className="flex-row items-start">
              <Button variant="ghost" onClick={() => setIsEditName(true)}>
                <Edit />
              </Button>
            </HeaderGroup>
          ) : (
            <div className="flex flex-row gap-0.5">
              <Input type="text" value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} autoFocus />

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  updateQr(item.id, { name: nameDraft });
                  setIsEditName(false);
                }}
              >
                <Check />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setNameDraft(item.name); // reset
                  setIsEditName(false);
                }}
              >
                <X />
              </Button>
            </div>
          )}
          <Badge variant="ghost">
            <CornerDownRight />
            {item.content.url}
          </Badge>
          <Badge variant="ghost">
            <Calendar />
            {formattedDate}
          </Badge>
        </div>
      </div>
      <div className="gap-8 flex flex-row">
        <div className="flex flex-col justify-between">
          <div className="flex flex-row gap-0.5">
            <Button variant="ghost" size="lg" onClick={() => onEdit(item.id)}>
              <Palette />
            </Button>
            {isDynamic && (
              <Button variant="ghost" size="lg">
                <ChartLine />
              </Button>
            )}
            <Button variant="ghost" size="lg" onClick={() => onDuplicate(item)}>
              <Copy />
            </Button>
            <Button variant="ghost" size="lg" onClick={() => onDelete(item.id)}>
              <Trash2 color="#C9404A" />
            </Button>
          </div>
          <RadioGroup
            className="flex gap-1 bg-muted/30 p-1 rounded-lg justify-between"
            value={downloadFormat}
            onValueChange={(val: any) => setDownloadFormat(val)}
          >
            {["png", "jpeg", "svg"].map((fmt) => (
              <div key={fmt} className="flex-1">
                <RadioGroupItem value={fmt} id={`${item.id}-${fmt}`} className="peer sr-only" />
                <label
                  htmlFor={`${item.id}-${fmt}`}
                  className="flex items-center justify-center w-full px-2 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-all peer-data-[state=checked]:bg-background peer-data-[state=checked]:text-primary peer-data-[state=checked]:shadow-sm text-muted-foreground hover:text-foreground uppercase"
                >
                  {fmt}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="flex flex-col justify-between">
          <Slider
            value={[downloadSize]}
            onValueChange={(val: any) => setDownloadSize(val[0])}
            min={500}
            max={4000}
            minLabel="Low Q"
            maxLabel="High Q"
            step={100}
            className="w-full"
          />
          <Button onClick={handleDownload} disabled={isDownloading} size="lg">
            {isDownloading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
            Download QR
          </Button>
        </div>
      </div>
    </Card>
  );
}
