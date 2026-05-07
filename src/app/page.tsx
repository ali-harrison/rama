import { Grain } from "@/components/Grain";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Philosophy } from "@/components/Philosophy";
import { Collection } from "@/components/Collection";
import { Process } from "@/components/Process";
import { CTA } from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Grain />
      <Nav />
      <Hero />
      <Philosophy />
      <Collection />
      <Process />
      <CTA />
    </>
  );
}
