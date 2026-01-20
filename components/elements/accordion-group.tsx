"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card } from "../ui/card";
type FAQItem = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  items: FAQItem[];
  type?: "multiple" | "single";
};

export default function AccordionGroup({ items, type = "single" }: FAQAccordionProps) {
  return (
    <Card width="full" className="max-w-4xl" size="sm">
      <Accordion type={type} collapsible>
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
