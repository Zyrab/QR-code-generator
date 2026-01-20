import * as React from "react";
import { InputGroup } from "@/components/ui/input";
import { Link, Type } from "lucide-react"; // optional icons
import { QRContent } from "@/types/qr";

interface InputAreaProps {
  content: QRContent;
  name: string;
  onContentChange: (field: string, value: string) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputArea({ content, name, onContentChange, onNameChange }: InputAreaProps) {
  return (
    <div className="w-full flex flex-col gap-4 md:flex-row flex-wrap">
      {/* Always show QR Name */}
      <InputGroup
        label="QR Name (optional)"
        value={name}
        onChange={(e) => onNameChange(e)}
        placeholder="Only used if you sign in and save"
        className="flex-1"
      />

      {/* Show fields based on QR type */}
      {content.type === "url" && (
        <InputGroup
          label="URL"
          value={content.url}
          onChange={(e) => onContentChange("url", e.target.value)}
          placeholder="https://example.com"
          startIcon={<Link size={16} />}
          required
          className="flex-1"
        />
      )}

      {content.type === "text" && (
        <InputGroup
          label="Text"
          value={content.text}
          onChange={(e) => onContentChange("text", e.target.value)}
          placeholder="Enter your text here"
          required
          className="flex-1"
        />
      )}

      {content.type === "wifi" && (
        <>
          <InputGroup
            label="Wi-Fi SSID"
            value={content.ssid}
            onChange={(e) => onContentChange("ssid", e.target.value)}
            placeholder="Network Name"
            required
            className="flex-1"
          />
          <InputGroup
            label="Wi-Fi Password"
            value={content.password}
            onChange={(e) => onContentChange("password", e.target.value)}
            placeholder="Password"
            className="flex-1"
          />
        </>
      )}
    </div>
  );
}
