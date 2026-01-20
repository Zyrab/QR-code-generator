import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input"; // Using your custom Label
import { cn } from "@/lib/utils";
import { X, ImageIcon, Upload } from "lucide-react";
import { LogoStyle } from "@/lib/qr-utils";

import Radios from "@/components/elements/radio-group";
// Define the interface for the parent's form data
// We use a partial or specific pick here to ensure loose coupling

interface UploadLogoProps {
  logo?: string | null;
  setFormData: (data: any) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadLogo({ logo, setFormData, handleImageUpload }: UploadLogoProps) {
  return (
    <div>
      <Label>Logo</Label>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div>
          <Button variant="outline" className="relative">
            <Upload />
            {logo ? "Change Logo" : "Upload Logo"}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
          <p className="text-xs text-muted-foreground">Max 2MB. Transparent PNG recommended.</p>
        </div>

        {logo ? (
          <div className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="Logo" className="h-12 w-12 object-contain bg-white rounded border border-border" />
            <button
              onClick={() => setFormData((prev: any) => ({ ...prev, logo: null }))}
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
