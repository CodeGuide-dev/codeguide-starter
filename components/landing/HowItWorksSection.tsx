"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Settings, 
  Rocket,
  ArrowRight,
  CheckCircle,
  Play
} from "lucide-react";

const steps = [
  {
    step: 1,
    icon: Download,
    title: "Clone & Setup",
    description: "Get started with a single command. Clone the repository and install dependencies.",
    details: [
      "One-command setup",
      "Automated dependency installation",
      "Docker environment ready"
    ],
    code: "git clone https://github.com/CodeGuide-dev/codeguide-starter-fullstack.git"
  },
  {
    step: 2,
    icon: Settings,
    title: "Configure & Customize",
    description: "Customize your application with your branding, database, and authentication providers.",
    details: [
      "Environment configuration",
      "Database schema setup",
      "Authentication providers"
    ],
    code: "npm run setup && npm run db:migrate"
  },
  {
    step: 3,
    icon: Rocket,
    title: "Deploy & Scale",
    description: "Deploy to production with built-in CI/CD pipeline and scale globally with edge functions.",
    details: [
      "One-click deployment",
      "Global edge network",
      "Auto-scaling infrastructure"
    ],
    code: "npm run deploy"
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Play className="w-4 h-4" />
            How It Works
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            From Idea to Production
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              in Minutes
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our streamlined development process gets you from concept to deployed application faster than traditional methods.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            
            return (
              <div key={step.step} className="relative">
                {/* Connection line */}
                {!isLast && (
                  <div className="absolute left-6 top-20 w-0.5 h-20 bg-gradient-to-b from-primary/30 to-primary/10 hidden md:block" />
                )}
                
                <div className={`flex flex-col md:flex-row items-center gap-8 mb-16 ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}>
                  {/* Step indicator */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center relative">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-background border-2 border-primary rounded-full flex items-center justify-center text-xs font-bold text-primary">
                        {step.step}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <Card className="p-8">
                      <CardContent className="p-0">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                          <div>
                            <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground mb-6 text-lg">
                              {step.description}
                            </p>
                            <ul className="space-y-2">
                              {step.details.map((detail, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                  <span className="text-sm">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="relative">
                            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-gray-400 ml-2 text-xs">Terminal</span>
                              </div>
                              <div className="text-gray-300">
                                <span className="text-blue-400">$</span> {step.code}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 border">
            <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of developers who are already building amazing apps with CodeGuide.
            </p>
            <Button size="lg" className="h-12 px-8">
              Start Building Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}