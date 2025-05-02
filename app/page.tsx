import Hero from '@/components/home/hero';
import ValueProposition from '@/components/home/value-proposition';
import HowItWorks from '@/components/home/how-it-works';
import FeaturedProperties from '@/components/home/featured-properties';
import CallToAction from '@/components/home/call-to-action';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <ValueProposition />
      <HowItWorks />
      <FeaturedProperties />
      <CallToAction />
    </div>
  );
}