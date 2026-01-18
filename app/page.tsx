"use client";
import { useRef } from "react";
import Section from "@/components/layout/section";
import Generator from "./generator/page";
import { HeaderGroup } from "@/components/elements/heading-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PricingSection from "@/components/views/pricing-section";
import ExamplesSection from "@/components/views/examples-section";

export default function Landing() {
  const generatorRef = useRef<HTMLDivElement>(null);

  // 2. The function that does the scrolling
  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <>
      <div ref={generatorRef}>
        <Generator showHeader={true} />
      </div>
      <Section bg="bg-muted">
        <div>
          <HeaderGroup
            tag="h2"
            header="What Is a QR Code?"
            subheading={[
              "A QR code is a type of barcode that opens a link when scanned with a phone camera. It's commonly used to share websites, videos, menus, forms, and contact pages. especially on printed materials.",
              "Unlike short links, QR codes work instantly and don’t require typing.",
            ]}
          />
        </div>
      </Section>
      <Section>
        <HeaderGroup tag="h2" header="Static vs Dynamic QR Codes" />
        <p className="text-foreground text-md space-y-2 max-w-240 text-center">
          Many “free” QR generators use dynamic QR codes by default, which stop working unless you pay. This tool gives
          you static QR codes upfront, with no hidden expiration.
        </p>
      </Section>
      <Section>
        <HeaderGroup
          tag="h2"
          header="Not sure which one you need?"
          subheading=" tart with a free static QR code, upgrade only if you need more control."
        />
        <Button onClick={scrollToGenerator} size="lg">
          Generate a free QR code
        </Button>
      </Section>
      <ExamplesSection />
      <PricingSection />
    </>
  );
}
