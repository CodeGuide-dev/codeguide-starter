"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  MapPin,
  Phone,
  Code,
  Heart
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Documentation", href: "/docs" },
    { name: "API Reference", href: "/api" },
    { name: "Changelog", href: "/changelog" }
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Press Kit", href: "/press" },
    { name: "Partners", href: "/partners" },
    { name: "Contact", href: "/contact" }
  ],
  resources: [
    { name: "Templates", href: "/templates" },
    { name: "Community", href: "/community" },
    { name: "Support", href: "/support" },
    { name: "Status", href: "/status" },
    { name: "Security", href: "/security" },
    { name: "Privacy Policy", href: "/privacy" }
  ],
  developers: [
    { name: "GitHub", href: "https://github.com/codeguide" },
    { name: "Discord", href: "/discord" },
    { name: "Stack Overflow", href: "/stackoverflow" },
    { name: "Examples", href: "/examples" },
    { name: "Tutorials", href: "/tutorials" },
    { name: "Open Source", href: "/open-source" }
  ]
};

const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com/codeguide" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/codeguide" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/codeguide" }
];

export function Footer() {
  return (
    <footer className="bg-background border-t">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/codeguide-logo.png"
                alt="CodeGuide Logo"
                width={40}
                height={40}
                className="rounded-lg"
                loading="lazy"
              />
              <div>
                <h3 className="text-xl font-bold">CodeGuide</h3>
                <p className="text-sm text-muted-foreground">Development Made Simple</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              The ultimate full-stack development platform with everything you need to build, 
              deploy, and scale modern web applications.
            </p>
            
            {/* Social links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="hover:bg-primary/10"
                  >
                    <Link href={social.href} target="_blank" rel="noopener noreferrer">
                      <Icon className="w-5 h-5" />
                      <span className="sr-only">{social.name}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Links sections */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Product */}
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-3">
                  {footerLinks.product.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Developers */}
              <div>
                <h4 className="font-semibold mb-4">Developers</h4>
                <ul className="space-y-3">
                  {footerLinks.developers.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="mt-12 pt-8 border-t">
          <div className="max-w-md">
            <h4 className="font-semibold mb-2">Stay updated</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Get the latest updates, tutorials, and announcements delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button size="sm">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Email</p>
                <p className="text-muted-foreground text-sm">hello@codeguide.dev</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Support</p>
                <p className="text-muted-foreground text-sm">24/7 Live Chat</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Location</p>
                <p className="text-muted-foreground text-sm">Global Remote</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© 2024 CodeGuide. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>by developers, for developers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}