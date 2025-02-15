import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HeroImage from "@/public/ai-interview.webp"
const HeroSection = () => {

  return (
    <section className="w-full pt-24 md:pt-36 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <h1 className="text-3xl font-bold md:text-5xl lg:text-6xl xl:text-7xl">
          Accelerate Your Career
            <br />
            with Expert Tools
          </h1>
          <p className="px-4 mx-auto max-w-[900px] text-muted-foreground md:text-xl">
          Our innovative platform guides you every step of the way—creating standout resumes, acing your interview prep, and helping you master the job market with ease.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link href="/onboarding">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper mt-5 px-4 md:mt-0">
          <div className="hero-image">
            <Image
              src= {HeroImage}
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;