import { SmoothScroll } from "@/components/SmoothScroll";
import { Sky } from "@/components/Sky";
import { GridLines } from "@/components/GridLines";
import { Grain } from "@/components/Grain";
import { Header } from "@/components/Header";
import { Ruler } from "@/components/Ruler";
import { FirstLight } from "@/components/FirstLight";
import { Manifesto } from "@/components/Manifesto";
import { Collection } from "@/components/Collection";
import { Workshop } from "@/components/Workshop";
import { Lookbook } from "@/components/Lookbook";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Sky />
      <GridLines />
      <Grain />
      <Header />
      <Ruler />
      <main className="relative z-[2]">
        <FirstLight />
        <Manifesto />
        <Collection />
        <Workshop />
        <Lookbook />
      </main>
    </>
  );
}
