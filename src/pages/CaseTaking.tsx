import Navbar from "@/components/Navbar";
import { CaseForm } from "@/components/case-taking/CaseForm";

const CaseTaking = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2 text-foreground">Case Taking</h1>
            <p className="text-muted-foreground">Smart case entry with comprehensive patient assessment</p>
          </div>

          <CaseForm />
        </div>
      </div>
    </div>
  );
};

export default CaseTaking;
