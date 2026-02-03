import { HeaderGroup } from "@/components/elements/heading-group";
import Section from "../layout/section";
import { Card } from "../ui/card";
import Icons from "../elements/icons";

export default function WhenDinmic({ t }: any) {
  const { title, content, note } = t;

  return (
    <Section bg="bg-muted">
      <HeaderGroup header={title} />
      <div className="flex flex-wrap max-w-5xl items-center justify-center gap-2 text-start">
        {content.map(({ title, icon, color, text }: any, i: number) => (
          <Card width="sm" size="sm" key={i}>
            <div className="flex gap-2 w-full">
              <Icons name={icon} color={color} size={30} />
              <HeaderGroup tag="h4" header={title} />
            </div>
            <p className="text-foreground text-sm space-y-2 max-w-240 ">{text}</p>
          </Card>
        ))}
      </div>
      <p className="text-foreground text-md space-y-2 max-w-240 text-center">{note}</p>
    </Section>
  );
}
