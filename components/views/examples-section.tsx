import { HeaderGroup } from "@/components/elements/heading-group";
import { Card } from "@/components/ui/card";
import Section from "@/components/layout/section";
import Image from "next/image";

export default function ExamplesSection({ t }: any) {
  const { title, subtitle, content, footer } = t;
  return (
    <Section bg="bg-muted">
      <HeaderGroup tag="h2" header={title} subheading={subtitle} />

      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap gap-4 justify-center">
          {content.map(({ title, subtitle, img }: any, i: number) => (
            <Card key={i} size="sm" width="xs">
              <div className="relative w-full aspect-square">
                <Image
                  src={`/images/${img}.webp`}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <HeaderGroup size="sm" tag="h3" header={title} subheading={subtitle} />
            </Card>
          ))}
        </div>

        <p className="text-muted-foreground text-sm space-y-2 max-w-xl text-center">{footer}</p>
      </div>
    </Section>
  );
}
