"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Folder, Search, History, Lightbulb } from "lucide-react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const [userCount, setUserCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/prompts");
    }
  }, [status, router]);

  // Animate user count on load
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prev => {
        if (prev < 1247) {
          return prev + Math.floor(Math.random() * 25) + 1;
        }
        clearInterval(interval);
        return 1247;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-neutral-800 rounded mb-4"></div>
          <div className="h-4 w-48 bg-neutral-800 rounded"></div>
        </div>
      </div>
    );
  }

  // Don't render for authenticated users (they're being redirected)
  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "glass shadow-medium backdrop-blur-sm"
          : "bg-transparent"
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Promptforge</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => router.push("/sign-in")}
              >
                Sign In
              </Button>
              <Button
                variant="default"
                className="bg-primary hover:bg-primary/90"
                onClick={() => router.push("/sign-up")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto text-center">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-pulse"></div>
          
          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                Your AI Prompts,
              </span>
              <br />
              <span className="text-foreground">Organized</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Transform scattered prompts into an organized knowledge base.
              Create, manage, and version your AI prompts with ease.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base px-8 py-3 bg-primary hover:bg-primary/90 shadow-medium hover:shadow-soft transition-all duration-200 hover:scale-105"
                onClick={() => router.push("/sign-up")}
              >
                Get Started Free
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-base text-muted-foreground hover:text-foreground"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More →
              </Button>
            </div>

            {/* Social Proof */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Trusted by prompt engineers worldwide</p>
              <div className="text-2xl font-bold text-primary">
                {userCount.toLocaleString()}+ prompts organized
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Everything you need to master AI prompts
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built for prompt engineers, researchers, and AI enthusiasts who demand organization and efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Card className="glass p-8 hover:shadow-medium transition-all duration-300 hover:scale-105 group border">
              <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform">
                <Folder className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Smart Organization</h3>
              <p className="text-muted-foreground leading-relaxed">
                Organize prompts into folders, tag them intelligently, and find what you need instantly with powerful search capabilities.
              </p>
            </Card>

            {/* Feature Card 2 */}
            <Card className="glass p-8 hover:shadow-medium transition-all duration-300 hover:scale-105 group border">
              <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform">
                <History className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Version Control</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track changes, compare versions, and never lose a great prompt iteration. Full history and rollback capabilities.
              </p>
            </Card>

            {/* Feature Card 3 */}
            <Card className="glass p-8 hover:shadow-medium transition-all duration-300 hover:scale-105 group border">
              <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Advanced Search</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find any prompt instantly with semantic search, tags, and filters. Your prompt library at your fingertips.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Ready to organize your AI prompts?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join thousands of AI enthusiasts who have transformed their prompt workflow with Promptforge.
          </p>
          <Button
            size="lg"
            className="text-base px-8 py-3 bg-primary hover:bg-primary/90 shadow-medium hover:shadow-soft transition-all duration-200 hover:scale-105"
            onClick={() => router.push("/sign-up")}
          >
            Start Organizing Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Lightbulb className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">Promptforge</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 Promptforge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
