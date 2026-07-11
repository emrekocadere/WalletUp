import { Header } from '../components/home/Header';
import { Hero } from '../components/home/Hero';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { CTASection } from '../components/home/CTASection';
import { Footer } from '../components/home/Footer';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0d1224] relative overflow-x-hidden">
      {/* Subtle noise/texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
      <Header />
      <Hero />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
};
