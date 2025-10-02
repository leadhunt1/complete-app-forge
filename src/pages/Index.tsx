import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import {
  Brain,
  Users,
  FileText,
  BookOpen,
  Pill,
  TrendingUp,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Expert System",
      description: "Intelligent remedy suggestions with 95% accuracy using machine learning algorithms",
      color: "text-primary",
    },
    {
      icon: Users,
      title: "Patient Management",
      description: "Comprehensive patient database with timeline views and family grouping",
      color: "text-secondary",
    },
    {
      icon: FileText,
      title: "Smart Case Taking",
      description: "Dynamic forms with voice-to-text and auto-save for efficient consultations",
      color: "text-accent",
    },
    {
      icon: BookOpen,
      title: "Digital Repertory",
      description: "Kent's Repertory with 10,000+ rubrics and intelligent search",
      color: "text-primary",
    },
    {
      icon: Pill,
      title: "Prescription Management",
      description: "Professional PDF generation with clinic branding and QR verification",
      color: "text-secondary",
    },
    {
      icon: TrendingUp,
      title: "Case Analysis",
      description: "Advanced repertorization with quality checks and differential analysis",
      color: "text-accent",
    },
  ];

  const benefits = [
    {
      icon: Sparkles,
      title: "60% Faster Analysis",
      description: "Reduce case analysis time with AI-driven insights",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security for patient data",
    },
    {
      icon: Zap,
      title: "Real-time Sync",
      description: "Access your practice from anywhere, anytime",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light/20 text-primary mb-6 animate-scale-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Next-Gen Homeopathy Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
              Transform Your
              <span className="block bg-gradient-accent bg-clip-text text-transparent">
                Homeopathy Practice
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
              AI-powered case management that increases prescription accuracy and reduces analysis time by 60%
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8">
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-12 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>Cloud Based</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>1000+ Practitioners</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed for modern homeopathy practice
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass-card group hover:scale-105 transition-smooth cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:animate-glow`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Why Choose HomeoSync Pro?
              </h2>
              <p className="text-xl text-muted-foreground">
                Built by homeopaths, for homeopaths
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Elevate Your Practice?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join 1000+ practitioners already using HomeoSync Pro
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8">
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="font-bold text-foreground">HomeoSync Pro</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 HomeoSync Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
