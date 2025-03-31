import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight } from "lucide-react";
import ThreeDMarqueeDemo from "@/app/3Design/3D-demo";
import CardSpotlightDemo from "./side-card/card-spotlight-demo";
import HeroParallaxDemo from "./paralax/hero-parallax-demo";
import StaticCardsDemo from "./reviews/static-cards-demo";
import TextGenerateEffectDemo from "./review-text/text-generate-effect-demo";

export default function Home() {
  return (
    <div className="min-h-screen bg-white ">
      <div className="fixed top-0 left-0 w-full border-b border-gray-200/30 bg-white/50 backdrop-blur-md z-50">
        <header className="container mx-auto py-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full backdrop-blur-sm">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold">UniTest CBT</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-6">
            <Link href="/">
              <button className="cursor-pointer relative group text-gray-700 hover:text-gray-900 transition-colors">
                <span className="relative">
                  Home
                  <span className="absolute inset-x-0 bottom-0 h-px bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </span>
              </button>
            </Link>
            <Link href="/Otherpages/about/">
              <button className="cursor-pointer relative group text-gray-700 hover:text-gray-900 transition-colors">
                <span className="relative">
                  About
                  <span className="absolute inset-x-0 bottom-0 h-px bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </span>
              </button>
            </Link>
            <Link href="/Otherpages/contact/">
              <button className="cursor-pointer relative group text-gray-700 hover:text-gray-900 transition-colors">
                <span className="relative">
                  Contact
                  <span className="absolute inset-x-0 bottom-0 h-px bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </span>
              </button>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:underline">
              <button className="signin-button">
                Sign In
                <span className="gradient-underline"></span>
                <span className="hover-underline"></span>
              </button>
            </Link>
            <Button className="cursor-pointer backdrop-blur-sm bg-black hover:bg-gray-500">
              Get Started
            </Button>
          </div>
        </header>
      </div>

      <main className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 text-sm text-primary bg-primary/10 rounded-full">
              University Assessment Platform
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Elevate Your Academic Assessment Experience
            </h2>
            <p className="text-lg text-muted-foreground">
              Our comprehensive computer-based testing platform provides secure,
              reliable, and efficient assessments for university courses, exams,
              and certifications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2">
                Start Assessment <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] w-full">
            <div className="min-h-50 p-10 ">
              <CardSpotlightDemo />
            </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-50 p-6 rounded-lg">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Testing</h3>
            <p className="text-muted-foreground">
              Advanced proctoring and authentication features ensure academic
              integrity.
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-lg">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Results</h3>
            <p className="text-muted-foreground">
              Automated grading provides immediate feedback and performance
              analytics.
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-lg">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
            <p className="text-muted-foreground">
              Comprehensive insights into student performance and learning
              outcomes.
            </p>
          </div>
        </div>
        <section className="container  py-12">
          <ThreeDMarqueeDemo />
        </section>
        <div className="min-h-screen bg-grid-white/[0.02]">
          <HeroParallaxDemo />
        </div>
        <hr className="mt-30" />
        <div>
          <TextGenerateEffectDemo />
        </div>
        <div className="min-h-screen">
          <StaticCardsDemo />
        </div>
      </main>
    </div>
  );
}
