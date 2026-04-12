import { CTASection } from "./components/CTASection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HeroSection } from "./components/HeroSection";
import { InteractivePreviewSection } from "./components/InteractivePreviewSection";
import { Navbar } from "./components/Navbar";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden selection:bg-indigo-500/30">
            <Navbar />
            <HeroSection />
            <InteractivePreviewSection />
            <FeaturesSection />
            <CTASection />
        </div>
    );
}
