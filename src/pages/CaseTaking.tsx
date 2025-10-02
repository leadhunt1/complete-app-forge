import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Mic, Clock, Save } from "lucide-react";

const CaseTaking = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2 text-foreground">Case Taking</h1>
            <p className="text-muted-foreground">Smart case entry with AI assistance</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Templates */}
            <Card className="glass-card lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Case Templates</h3>
              <div className="space-y-3">
                {[
                  "General Consultation",
                  "Acute Conditions",
                  "Chronic Conditions",
                  "Pediatric Cases",
                  "Mental/Emotional",
                  "Women's Health",
                ].map((template, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-primary/10 transition-smooth text-foreground"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </Card>

            {/* Case Form */}
            <Card className="glass-card lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">New Case Entry</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mic className="w-4 h-4" />
                    Voice Input
                  </Button>
                  <Button size="sm" className="gap-2 bg-gradient-primary hover:opacity-90">
                    <Save className="w-4 h-4" />
                    Save Draft
                  </Button>
                </div>
              </div>

              <div className="text-center py-16">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-xl font-semibold mb-2 text-foreground">Smart Case Taking Module</h4>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Dynamic forms with voice-to-text, auto-save, and AI-powered symptom analysis
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Auto-save every 30s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    <span>Voice input ready</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseTaking;
