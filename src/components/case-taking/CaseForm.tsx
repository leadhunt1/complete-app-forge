import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, FileText } from "lucide-react";

const caseSchema = z.object({
  patient_id: z.string().min(1, "Patient is required"),
  case_type: z.string().min(1, "Case type is required"),
  chief_complaint: z.string().min(1, "Chief complaint is required"),
  history_of_complaint: z.string().optional(),
  medical_history: z.string().optional(),
  family_history: z.string().optional(),
  physical_examination: z.string().optional(),
  mental_emotional_state: z.string().optional(),
});

type CaseFormData = z.infer<typeof caseSchema>;

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  patient_number: string;
}

export const CaseForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("patients")
      .select("id, first_name, last_name, patient_number")
      .eq("practitioner_id", user?.id)
      .order("first_name");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
    } else {
      setPatients(data || []);
    }
    setIsLoading(false);
  };

  const onSubmit = async (data: CaseFormData) => {
    setIsSaving(true);
    
    // Generate case number
    const caseNumber = `CASE-${Date.now()}`;
    
    const { error } = await supabase.from("cases").insert([{
      patient_id: data.patient_id,
      case_type: data.case_type,
      chief_complaint: data.chief_complaint,
      history_of_complaint: data.history_of_complaint,
      medical_history: data.medical_history,
      family_history: data.family_history,
      physical_examination: data.physical_examination,
      mental_emotional_state: data.mental_emotional_state,
      practitioner_id: user?.id!,
      case_number: caseNumber,
      case_status: "draft",
    }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save case",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Case saved successfully",
      });
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="glass-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Case Information
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="patient_id">Select Patient *</Label>
            <Select onValueChange={(value) => setValue("patient_id", value)}>
              <SelectTrigger className="glass">
                <SelectValue placeholder="Choose a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} ({patient.patient_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.patient_id && (
              <p className="text-sm text-destructive mt-1">{errors.patient_id.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="case_type">Case Type *</Label>
            <Select onValueChange={(value) => setValue("case_type", value)}>
              <SelectTrigger className="glass">
                <SelectValue placeholder="Select case type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acute">Acute</SelectItem>
                <SelectItem value="chronic">Chronic</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
            {errors.case_type && (
              <p className="text-sm text-destructive mt-1">{errors.case_type.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="chief_complaint">Chief Complaint *</Label>
            <Textarea
              id="chief_complaint"
              {...register("chief_complaint")}
              placeholder="Describe the main complaint..."
              className="glass min-h-[100px]"
            />
            {errors.chief_complaint && (
              <p className="text-sm text-destructive mt-1">{errors.chief_complaint.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="history_of_complaint">History of Complaint</Label>
            <Textarea
              id="history_of_complaint"
              {...register("history_of_complaint")}
              placeholder="When did it start? How has it progressed?"
              className="glass min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="medical_history">Medical History</Label>
            <Textarea
              id="medical_history"
              {...register("medical_history")}
              placeholder="Previous illnesses, surgeries, medications..."
              className="glass min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="family_history">Family History</Label>
            <Textarea
              id="family_history"
              {...register("family_history")}
              placeholder="Family medical history..."
              className="glass min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="physical_examination">Physical Examination</Label>
            <Textarea
              id="physical_examination"
              {...register("physical_examination")}
              placeholder="Examination findings..."
              className="glass min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="mental_emotional_state">Mental & Emotional State</Label>
            <Textarea
              id="mental_emotional_state"
              {...register("mental_emotional_state")}
              placeholder="Mental symptoms, emotional state..."
              className="glass min-h-[100px]"
            />
          </div>
        </div>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button type="submit" disabled={isSaving} className="bg-gradient-primary">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Case
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
