import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ChevronRight, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Rubric {
  id: string;
  chapter: string;
  section: string | null;
  rubric_text: string;
  complete_path: string;
  remedy_grades: any;
}

interface Remedy {
  id: string;
  name: string;
  abbreviation: string;
  common_name: string | null;
}

export const RepertorySearch = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [selectedRubric, setSelectedRubric] = useState<Rubric | null>(null);
  const [remedies, setRemedies] = useState<Remedy[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 2) {
      searchRubrics();
    }
  }, [searchTerm]);

  useEffect(() => {
    loadRemedies();
  }, []);

  const loadRemedies = async () => {
    const { data, error } = await supabase
      .from("remedies")
      .select("id, name, abbreviation, common_name")
      .order("name")
      .limit(100);

    if (!error && data) {
      setRemedies(data);
    }
  };

  const searchRubrics = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("rubrics")
      .select("*")
      .ilike("rubric_text", `%${searchTerm}%`)
      .order("complete_path")
      .limit(50);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to search rubrics",
        variant: "destructive",
      });
    } else {
      setRubrics(data || []);
    }
    setIsLoading(false);
  };

  const getRemedyGrade = (grade: number) => {
    switch (grade) {
      case 3:
        return { label: "***", color: "bg-red-500" };
      case 2:
        return { label: "**", color: "bg-orange-500" };
      case 1:
        return { label: "*", color: "bg-yellow-500" };
      default:
        return { label: "", color: "bg-gray-500" };
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search rubrics (e.g., 'headache', 'anxiety')..."
          className="pl-10 glass"
        />
      </div>

      {isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          Searching...
        </div>
      )}

      {!isLoading && rubrics.length === 0 && searchTerm.length > 2 && (
        <Card className="glass-card text-center py-8">
          <Book className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No rubrics found. Try different keywords.</p>
        </Card>
      )}

      {!isLoading && rubrics.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Found {rubrics.length} rubrics</p>
          {rubrics.map((rubric) => (
            <Card
              key={rubric.id}
              className="glass-card cursor-pointer hover:bg-primary/5 transition-smooth"
              onClick={() => setSelectedRubric(rubric)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">{rubric.complete_path}</p>
                  <p className="font-medium text-foreground">{rubric.rubric_text}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedRubric && (
        <Card className="glass-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{selectedRubric.complete_path}</p>
              <h3 className="text-lg font-semibold text-foreground">{selectedRubric.rubric_text}</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedRubric(null)}>
              Close
            </Button>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground">Remedies</h4>
            {selectedRubric.remedy_grades && typeof selectedRubric.remedy_grades === 'object' ? (
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedRubric.remedy_grades).map(([remedy, grade]) => {
                  const gradeInfo = getRemedyGrade(grade as number);
                  return (
                    <Badge
                      key={remedy}
                      variant="outline"
                      className="gap-1"
                    >
                      <span>{remedy}</span>
                      {gradeInfo.label && (
                        <span className={`px-1 rounded text-xs ${gradeInfo.color} text-white`}>
                          {gradeInfo.label}
                        </span>
                      )}
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No remedy information available</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
