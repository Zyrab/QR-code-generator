import { HeaderGroup } from "@/components/elements/heading-group";
import { Card } from "@/components/ui/card";
import Section from "@/components/layout/section";

export default function ExamplesSection({ t }: any) {
  const { titile, subtitle, content, footer } = t;
  return (
    <Section bg="bg-muted">
      <HeaderGroup tag="h2" header={titile} subheading={subtitle} />

      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap gap-4 justify-center">
          {content.map(({ title, subtitle }: any, i: number) => (
            <Card key={i} size="sm" width="xs">
              <HeaderGroup size="sm" tag="h3" header={title} subheading={subtitle} />
            </Card>
          ))}
        </div>

        <p className="text-muted-foreground text-sm space-y-2 max-w-xl text-center">{footer}</p>
      </div>
    </Section>
  );
}
