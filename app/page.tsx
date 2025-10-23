import { 
  HeaderNavigation,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  PricingSection,
  Footer
} from "@/components/landing";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CodeGuide - Development Made Simple',
  description: 'The ultimate full-stack development platform with everything you need to build, deploy, and scale modern web applications.',
  keywords: ['development', 'fullstack', 'TypeScript', 'React', 'Next.js', 'AI'],
  openGraph: {
    title: 'CodeGuide - Development Made Simple',
    description: 'Build better apps, ship faster with our comprehensive development platform.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeGuide - Development Made Simple',
    description: 'Build better apps, ship faster with our comprehensive development platform.',
  }
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeaderNavigation />
      <main>
        <HeroSection />
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="how-it-works">
          <HowItWorksSection />
        </section>
        <section id="pricing">
          <PricingSection />
        </section>
      </main>
      <Footer />
    </div>
  );
}
