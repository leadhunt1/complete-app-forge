import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Star, Clock } from "lucide-react";

const Repertory = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2 text-foreground">Digital Repertory</h1>
            <p className="text-muted-foreground">Kent's Repertory with 10,000+ rubrics</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Search and Navigation */}
            <Card className="glass-card lg:col-span-1">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search rubrics..."
                    className="pl-10 glass"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-foreground">
                    <Star className="w-4 h-4 text-accent" />
                    Bookmarked
                  </h4>
                  <p className="text-sm text-muted-foreground">No bookmarks yet</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    Recent
                  </h4>
                  <p className="text-sm text-muted-foreground">No recent searches</p>
                </div>
              </div>
            </Card>

            {/* Repertory Content */}
            <Card className="glass-card lg:col-span-2">
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-xl font-semibold mb-2 text-foreground">Digital Repertory System</h4>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Comprehensive repertory with intelligent search, hierarchical navigation, and advanced filtering
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-sm">
                  <div className="p-4 rounded-lg bg-primary/5">
                    <p className="font-bold text-2xl text-primary mb-1">10,000+</p>
                    <p className="text-muted-foreground">Rubrics</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/5">
                    <p className="font-bold text-2xl text-secondary mb-1">500+</p>
                    <p className="text-muted-foreground">Remedies</p>
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

export default Repertory;
