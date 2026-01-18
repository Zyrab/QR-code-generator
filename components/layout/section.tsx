export default function Section({
  children,
  bg = "bg-background",
}: Readonly<{ children: React.ReactNode; bg?: string }>) {
  return <section className={`flex flex-col gap-12 py-12 px-4 items-center justify-center ${bg}`}>{children}</section>;
}
