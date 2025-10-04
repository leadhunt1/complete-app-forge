import Navbar from "@/components/Navbar";
import { RepertorySearch } from "@/components/repertory/RepertorySearch";
import { Card } from "@/components/ui/card";

const Repertory = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2 text-foreground">Digital Repertory</h1>
            <p className="text-muted-foreground">Search and explore homeopathic rubrics and remedies</p>
          </div>

          <Card className="glass-card">
            <RepertorySearch />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Repertory;
