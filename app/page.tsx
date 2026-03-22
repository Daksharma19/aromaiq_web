import HeroSection from "@/components/sections/HeroSection";
import ProblemSolution from "@/components/sections/ProblemSolution";
import HowItWorks from "@/components/sections/HowItWorks";
import HardwareShowcase from "@/components/sections/HardwareShowcase";

export default function Home() {
  return (
    <main className="bg-ivory dark:bg-obsidian transition-colors">
      <HeroSection />
      <ProblemSolution />
      <HowItWorks />
      <HardwareShowcase />
    </main>
  );
}
