"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HeaderGroup } from "@/components/elements/heading-group";
import Section from "../layout/section";

export default function WhatIsQR({ data }: any) {
  const { title, subtitle, img } = data;
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 },
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <Section bg="bg-muted">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1">
          <HeaderGroup header={title} subheading={subtitle} />
        </div>

        <div ref={containerRef} className="flex-1 relative w-full max-w-xs aspect-square overflow-hidden rounded-xl">
          <Image src={`/images/${img}.webp`} alt={title} fill className="object-cover" />

          <div className={`scanner-line ${isVisible ? "animate" : ""}`} />
          <div
            className="absolute inset-0 bg-green-500/5 transition-opacity duration-1000"
            style={{ opacity: isVisible ? 1 : 0 }}
          />
        </div>
      </div>
    </Section>
  );
}
