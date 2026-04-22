import Navbar from '@/components/shared/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import StatsSection from '@/components/landing/StatsSection'
import TracksSection from '@/components/landing/TracksSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import HowItWorks from '@/components/landing/HowItWorks'
import ProblemPreview from '@/components/landing/ProblemPreview'
import CreatureSection from '@/components/landing/CreatureSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <TracksSection />
      <FeaturesSection />
      <HowItWorks />
      <ProblemPreview />
      <CreatureSection />
      <CTASection />
      <Footer />
    </div>
  )
}
