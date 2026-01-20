"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Section from "@/components/layout/section";
import Generator from "./generator/page";
import { HeaderGroup } from "@/components/elements/heading-group";
import { Button } from "@/components/ui/button";
import PricingSection from "@/components/views/pricing-section";
import ExamplesSection from "@/components/views/examples-section";
import { getLocale } from "@/content/getLocale";
import { ActionKey, actions } from "@/lib/actions";
import AccordionGroup from "@/components/elements/accordion-group";
export default function Landing({ locale = "en" }: { locale?: "en" | "ka" }) {
  const generatorRef = useRef<HTMLDivElement>(null);
  const t = getLocale(locale, "landing");
  const router = useRouter();

  const handleAction = (action: ActionKey) => {
    actions[action]?.({
      generatorRef,
      router,
    });
  };
  return (
    <>
      <div ref={generatorRef}>
        <Generator showHeader={true} />
      </div>
      <Section bg="bg-muted">
        <div>
          <HeaderGroup header={t.whatIsQr.titile} subheading={t.whatIsQr.subtitle} />
        </div>
      </Section>
      <Section>
        <HeaderGroup header={t.staticVsDynamic.titile} />
        <p className="text-foreground text-md space-y-2 max-w-240 text-center">{t.staticVsDynamic.description}</p>
      </Section>
      <Section>
        <HeaderGroup header={t.unsure.titile} subheading={t.unsure.subtitle} />
        <Button onClick={() => handleAction(t.unsure.button.action)} size="lg">
          {t.unsure.button.label}
        </Button>
      </Section>
      <ExamplesSection t={t.examples} />
      <PricingSection t={t.pricing} onAction={handleAction} />
      <Section bg="bg-muted">
        <HeaderGroup header={t.usefullness.title} />
        <p className="text-foreground text-md space-y-2 max-w-240 text-center">{t.usefullness.note}</p>
      </Section>
      <Section>
        <HeaderGroup header={t.faq.title} />
        <AccordionGroup items={t.faq.content} />
      </Section>
      <Section>
        <HeaderGroup header={t.why.title} subheading={t.why.subtitle} />
        <p className="text-foreground text-md space-y-2 max-w-240 text-center">{t.why.notice}</p>
      </Section>
    </>
  );
}
