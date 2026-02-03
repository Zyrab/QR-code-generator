import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input"; // Using your custom Label
import { X, ImageIcon, Upload } from "lucide-react";
interface UploadLogoProps {
  logo?: string | null;
  setQrData: (data: any) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: any;
}

export default function UploadLogo({ logo, setQrData, handleImageUpload, t }: UploadLogoProps) {
  return (
    <div>
      <Label>{t.title}</Label>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div>
          <Button variant="outline" className="relative">
            <Upload />
            {logo ? t.upload : t.change}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
          <p className="text-xs text-muted-foreground">{t.note}</p>
        </div>

        {logo ? (
          <div className="relative group">
            <img src={logo} alt="Logo" className="h-12 w-12 object-contain bg-white rounded border border-border" />
            <button
              onClick={() => setQrData((prev: any) => ({ ...prev, design: { ...prev.design, logo: null } }))}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="h-12 w-12 rounded border border-dashed border-muted-foreground/30 flex items-center justify-center bg-background">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
