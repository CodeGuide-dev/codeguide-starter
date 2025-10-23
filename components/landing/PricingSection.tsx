"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Star, 
  Zap,
  Crown,
  Rocket,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    icon: Zap,
    price: "$0",
    period: "forever",
    description: "Perfect for getting started and small projects",
    features: [
      "5 projects",
      "Basic UI components",
      "Community support",
      "Standard templates",
      "Basic deployment"
    ],
    notIncluded: [
      "Advanced AI features",
      "Priority support",
      "Custom integrations"
    ],
    cta: "Get Started Free",
    variant: "outline" as const,
    popular: false
  },
  {
    name: "Pro",
    icon: Star,
    price: "$29",
    period: "per month",
    description: "Everything you need for professional development",
    features: [
      "Unlimited projects",
      "All UI components",
      "AI-powered development",
      "Priority support",
      "Advanced templates",
      "Custom integrations",
      "Team collaboration",
      "Analytics dashboard"
    ],
    notIncluded: [
      "White-label solution",
      "Custom branding"
    ],
    cta: "Start Pro Trial",
    variant: "default" as const,
    popular: true
  },
  {
    name: "Enterprise",
    icon: Crown,
    price: "$99",
    period: "per month",
    description: "For teams and organizations with advanced needs",
    features: [
      "Everything in Pro",
      "White-label solution",
      "Custom branding",
      "Dedicated support",
      "SLA guarantee",
      "On-premise deployment",
      "Advanced security",
      "Custom integrations",
      "Training & onboarding"
    ],
    notIncluded: [],
    cta: "Contact Sales",
    variant: "outline" as const,
    popular: false
  }
];

export function PricingSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Rocket className="w-4 h-4" />
            Pricing
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Choose Your
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Development Plan
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free and scale as you grow. All plans include our core features with no hidden fees.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.name}
                className={`relative ${
                  plan.popular 
                    ? 'border-2 border-primary shadow-lg scale-105' 
                    : 'border hover:border-primary/50'
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      plan.popular 
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                        : 'bg-muted'
                    }`}>
                      <Icon className={`w-6 h-6 ${plan.popular ? 'text-white' : 'text-foreground'}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features included */}
                  <div>
                    <h4 className="font-semibold mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Features not included */}
                  {plan.notIncluded.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-muted-foreground">Not included:</h4>
                      <ul className="space-y-2">
                        {plan.notIncluded.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-5 h-5 border border-muted-foreground/30 rounded-full mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="pt-4">
                    <Button 
                      asChild
                      variant={plan.variant}
                      size="lg" 
                      className="w-full h-12"
                    >
                      <Link href={plan.name === 'Enterprise' ? '#contact' : '/sign-up'}>
                        {plan.cta}
                        {plan.name !== 'Enterprise' && <ArrowRight className="w-4 h-4 ml-2" />}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ or additional info */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="font-semibold mb-2">Can I upgrade or downgrade anytime?</h4>
              <p className="text-muted-foreground text-sm">
                Yes, you can change your plan at any time. Changes take effect immediately and billing is prorated.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-muted-foreground text-sm">
                We accept all major credit cards, PayPal, and wire transfers for Enterprise plans.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold mb-2">Is there a free trial for Pro plan?</h4>
              <p className="text-muted-foreground text-sm">
                Yes! All Pro features are available during your 14-day free trial. No credit card required.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold mb-2">Do you offer educational discounts?</h4>
              <p className="text-muted-foreground text-sm">
                Yes, we offer 50% off Pro plans for students and educational institutions with valid credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}