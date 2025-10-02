import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill, FileText, Download, Send } from "lucide-react";

const Prescriptions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2 text-foreground">Prescriptions</h1>
            <p className="text-muted-foreground">Professional prescription management</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card">
              <h4 className="text-sm font-semibold mb-4 text-foreground">Quick Actions</h4>
              <div className="space-y-3">
                <Button className="w-full bg-gradient-primary hover:opacity-90 justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  New Prescription
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Send className="w-4 h-4 mr-2" />
                  Send to Patient
                </Button>
              </div>
            </Card>

            <Card className="glass-card lg:col-span-2">
              <div className="text-center py-12">
                <Pill className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-xl font-semibold mb-2 text-foreground">Prescription Management</h4>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create professional prescriptions with clinic branding, QR verification, and automated patient communication
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>PDF Generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    <span>Email/SMS Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>QR Verification</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Prescriptions Placeholder */}
          <Card className="glass-card">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Prescriptions</h3>
            <div className="text-center py-8 text-muted-foreground">
              No prescriptions yet. Create your first prescription to get started.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;
