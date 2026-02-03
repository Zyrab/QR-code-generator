import * as React from "react";
import { InputGroup } from "@/components/ui/input";
import { QRContent } from "@/types/qr";
import Icons from "@/components/elements/icons";

interface InputAreaProps {
  content: QRContent;
  name: string;
  onContentChange: (field: string, value: string) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: any;
}

export default function InputArea({ content, name, onContentChange, onNameChange, t }: InputAreaProps) {
  const activeFields = INPUT_FIELDS[content.type as keyof typeof INPUT_FIELDS] || [];
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputGroup label={t.name.text} value={name} onChange={(e) => onNameChange(e)} placeholder={t.name.placeholder} />
      {activeFields.map(({ key, icon, requred, type }, i) => (
        <InputGroup
          key={i}
          label={t[key].text}
          value={(content as any)[key] || ""}
          onChange={(e) => onContentChange(key, e.target.value)}
          placeholder={t[key].placeholder}
          startIcon={<Icons name={icon} size={16} />}
          required={requred}
        />
      ))}
    </div>
  );
}

export const INPUT_FIELDS = {
  url: [{ key: "url", icon: "link", type: "text", requred: true }],
  text: [{ key: "text", icon: "type", type: "text", requred: true }],
  wifi: [
    { key: "ssid", icon: "wifi", type: "text", requred: true },
    { key: "password", icon: "key_round", type: "text", requred: false },
  ],
  // email: [ { key: "email", labelKey: "email.addr", ... }, { key: "subject", ... } ]
};
