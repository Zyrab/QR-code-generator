import { CircleCheck, Dot } from "lucide-react";
import { HeaderGroup } from "../elements/heading-group";
import Section from "../layout/section";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export default function StaticVsDinamicSection({ t }: any) {
  const { title, content, footer } = t;
  return (
    <Section>
      <HeaderGroup tag="h2" header={title} />
      <div className="flex flex-col justify-center md:flex-row gap-6 w-full">
        {content.map(({ title, items, footer }: any, i: number) => (
          <Card key={i} width="sm" size="sm">
            <HeaderGroup tag="h3" size="sm" header={title} />
            <ul className="w-full h-full">
              {items.map((item: string) => (
                <li key={item} className="flex gap-1 items-center mt-1">
                  <Dot size={20} />
                  <p className="text-foreground-muted text-sm">{item}</p>
                </li>
              ))}
            </ul>

            <p className="text-foreground text-xs space-y-2 max-w-240 text-center">{footer}</p>
          </Card>
        ))}
      </div>
      <p className="text-foreground text-md space-y-2 max-w-240 text-center">{footer}</p>
    </Section>
  );
}
