"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        {/* Logo and Title */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Image
              src="/codeguide-logo.png"
              alt="CodeGuide Logo"
              width={80}
              height={80}
              className="rounded-2xl"
              priority
            />
            <div className="text-left">
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                CodeGuide
              </h1>
              <p className="text-lg text-muted-foreground font-medium">
                Development Made Simple
              </p>
            </div>
          </div>
        </div>

        {/* Hero headline */}
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
            Build Better Apps,
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ship Faster
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The ultimate full-stack development platform with everything you need to build, deploy, and scale modern web applications.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border rounded-full px-4 py-2">
            <Code className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">TypeScript Ready</span>
          </div>
          <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border rounded-full px-4 py-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">AI-Powered</span>
          </div>
          <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border rounded-full px-4 py-2">
            <ArrowRight className="w-5 h-5 text-cyan-600" />
            <span className="text-sm font-medium">Deploy in Minutes</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button asChild size="lg" className="h-12 px-8 text-lg">
            <Link href="/sign-up">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg">
            <Link href="/sign-in">
              Sign In
            </Link>
          </Button>
        </div>

        {/* Social proof */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Trusted by developers at leading companies
          </p>
          <div className="flex items-center justify-center gap-8 opacity-50">
            <div className="text-2xl font-bold">GitHub</div>
            <div className="text-2xl font-bold">Vercel</div>
            <div className="text-2xl font-bold">Next.js</div>
            <div className="text-2xl font-bold">Supabase</div>
          </div>
        </div>
      </div>
    </section>
  );
}