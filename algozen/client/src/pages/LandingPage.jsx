import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import TracksSection from '../components/landing/TracksSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import CreatureSection from '../components/landing/CreatureSection';
import ProblemPreview from '../components/landing/ProblemPreview';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <TracksSection />
      <FeaturesSection />
      <HowItWorks />
      <CreatureSection />
      <ProblemPreview />
      <CTASection />
      <Footer />
    </div>
  );
}
