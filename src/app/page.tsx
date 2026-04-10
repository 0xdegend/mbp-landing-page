import BeastNavbar from "@/components/BeastNavbar";
import HeroPage from "@/components/HeroPage";
import BeastMarquee from "@/components/BeastMarquee";
import Ecosystem from "@/components/Ecosystem";
import BurnComponent from "@/components/BurnComponent";
import StorySection from "@/components/StorySection";
import Tokenomics from "@/components/Tokenomics";
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
      <StorySection />
      <Ecosystem />
      <BurnComponent />
      <Tokenomics />
      <AllianceComponent />
      {/* <RoadmapSection /> */}
      <FinalCTA />
      <BeastFooter />
    </main>
  );
}
