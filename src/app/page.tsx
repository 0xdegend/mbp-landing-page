import BeastNavbar from "@/components/BeastNavbar";
import HeroPage from "@/components/HeroPage";
import BeastMarquee from "@/components/BeastMarquee";
import ContractAddress from "@/components/ContractAddress";
import BurnComponent from "@/components/BurnComponent";
import LoreSection from "@/components/LoreSection";
import PackStats from "@/components/PackStats";
import AllianceComponent from "@/components/AllianceComponent";
import RoadmapSection from "@/components/RoadmapSection";
import FinalCTA from "@/components/FinalCTA";
import BeastFooter from "@/components/BeastFooter";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <BeastNavbar />
      <HeroPage />
      <BeastMarquee />
      <ContractAddress />
      <BurnComponent />
      <LoreSection />
      <PackStats />
      <AllianceComponent />
      <RoadmapSection />
      <FinalCTA />
      <BeastFooter />
    </main>
  );
}
