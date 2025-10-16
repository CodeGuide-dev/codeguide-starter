"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Code, 
  Database, 
  Shield, 
  Zap, 
  Globe, 
  Palette, 
  Workflow,
  Bot,
  Rocket
} from "lucide-react";

const features = [
  {
    icon: Code,
    title: "Modern Tech Stack",
    description: "Built with Next.js 15, React 19, TypeScript, and Tailwind CSS for the best developer experience.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Shield,
    title: "Built-in Authentication",
    description: "Secure authentication system with session management and multiple provider support out of the box.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Database,
    title: "Database Integration",
    description: "PostgreSQL with Drizzle ORM for type-safe database operations and seamless migrations.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Palette,
    title: "Beautiful UI Components",
    description: "40+ accessible UI components built with Radix UI and styled with Tailwind CSS.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Bot,
    title: "AI-Powered Development",
    description: "Integrated AI tools to help you write better code, debug faster, and deploy with confidence.",
    gradient: "from-violet-500 to-purple-500"
  },
  {
    icon: Rocket,
    title: "Production Ready",
    description: "Docker configuration, performance optimizations, and best practices built-in from day one.",
    gradient: "from-cyan-500 to-blue-500"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Features
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Build Amazing Apps
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            CodeGuide provides all the tools, components, and integrations you need to build modern web applications faster than ever before.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional features row */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Global CDN</h3>
            <p className="text-muted-foreground">Deploy globally with edge functions and instant loading worldwide.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Workflow className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">CI/CD Pipeline</h3>
            <p className="text-muted-foreground">Automated testing, building, and deployment with every commit.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Security First</h3>
            <p className="text-muted-foreground">Built-in security best practices and vulnerability monitoring.</p>
          </div>
        </div>
      </div>
    </section>
  );
}