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
import { Loader2, Save, FileText, Pill } from "lucide-react";

const prescriptionSchema = z.object({
  patient_id: z.string().min(1, "Patient is required"),
  case_id: z.string().min(1, "Case is required"),
  remedy_name: z.string().min(1, "Remedy name is required"),
  potency: z.string().min(1, "Potency is required"),
  dosage_instructions: z.string().min(1, "Dosage instructions are required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
  method: z.string().optional(),
  patient_instructions: z.string().optional(),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  patient_number: string;
}

interface Case {
  id: string;
  case_number: string;
  chief_complaint: string;
  consultation_date: string;
}

interface Remedy {
  id: string;
  name: string;
  abbreviation: string;
}

export const PrescriptionForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [remedies, setRemedies] = useState<Remedy[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
  });

  useEffect(() => {
    loadPatients();
    loadRemedies();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      loadCases(selectedPatientId);
    }
  }, [selectedPatientId]);

  const loadPatients = async () => {
    const { data, error } = await supabase
      .from("patients")
      .select("id, first_name, last_name, patient_number")
      .eq("practitioner_id", user?.id)
      .order("first_name");

    if (!error && data) {
      setPatients(data);
    }
  };

  const loadCases = async (patientId: string) => {
    const { data, error } = await supabase
      .from("cases")
      .select("id, case_number, chief_complaint, consultation_date")
      .eq("patient_id", patientId)
      .eq("practitioner_id", user?.id)
      .order("consultation_date", { ascending: false });

    if (!error && data) {
      setCases(data);
    }
  };

  const loadRemedies = async () => {
    const { data, error } = await supabase
      .from("remedies")
      .select("id, name, abbreviation")
      .order("name")
      .limit(200);

    if (!error && data) {
      setRemedies(data);
    }
  };

  const onSubmit = async (data: PrescriptionFormData) => {
    setIsSaving(true);
    
    const prescriptionNumber = `RX-${Date.now()}`;
    
    // Find the selected remedy
    const selectedRemedy = remedies.find(r => r.name === data.remedy_name);
    
    const { error } = await supabase.from("prescriptions").insert([{
      patient_id: data.patient_id,
      case_id: data.case_id,
      remedy_name: data.remedy_name,
      potency: data.potency,
      dosage_instructions: data.dosage_instructions,
      frequency: data.frequency,
      duration: data.duration,
      method: data.method,
      patient_instructions: data.patient_instructions,
      practitioner_id: user?.id!,
      remedy_id: selectedRemedy?.id!,
      prescription_number: prescriptionNumber,
      status: "active",
    }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create prescription",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Prescription created successfully",
      });
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="glass-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5" />
          Prescription Details
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="patient_id">Select Patient *</Label>
            <Select onValueChange={(value) => {
              setValue("patient_id", value);
              setSelectedPatientId(value);
            }}>
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
            <Label htmlFor="case_id">Select Case *</Label>
            <Select onValueChange={(value) => setValue("case_id", value)} disabled={!selectedPatientId}>
              <SelectTrigger className="glass">
                <SelectValue placeholder={selectedPatientId ? "Choose a case" : "Select patient first"} />
              </SelectTrigger>
              <SelectContent>
                {cases.map((caseItem) => (
                  <SelectItem key={caseItem.id} value={caseItem.id}>
                    {caseItem.case_number} - {caseItem.chief_complaint.substring(0, 50)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.case_id && (
              <p className="text-sm text-destructive mt-1">{errors.case_id.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="remedy_name">Remedy *</Label>
            <Select onValueChange={(value) => setValue("remedy_name", value)}>
              <SelectTrigger className="glass">
                <SelectValue placeholder="Select remedy" />
              </SelectTrigger>
              <SelectContent>
                {remedies.map((remedy) => (
                  <SelectItem key={remedy.id} value={remedy.name}>
                    {remedy.name} ({remedy.abbreviation})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.remedy_name && (
              <p className="text-sm text-destructive mt-1">{errors.remedy_name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="potency">Potency *</Label>
            <Select onValueChange={(value) => setValue("potency", value)}>
              <SelectTrigger className="glass">
                <SelectValue placeholder="Select potency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6C">6C</SelectItem>
                <SelectItem value="12C">12C</SelectItem>
                <SelectItem value="30C">30C</SelectItem>
                <SelectItem value="200C">200C</SelectItem>
                <SelectItem value="1M">1M</SelectItem>
                <SelectItem value="10M">10M</SelectItem>
                <SelectItem value="50M">50M</SelectItem>
                <SelectItem value="CM">CM</SelectItem>
              </SelectContent>
            </Select>
            {errors.potency && (
              <p className="text-sm text-destructive mt-1">{errors.potency.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="dosage_instructions">Dosage Instructions *</Label>
            <Input
              id="dosage_instructions"
              {...register("dosage_instructions")}
              placeholder="e.g., 4 globules under tongue"
              className="glass"
            />
            {errors.dosage_instructions && (
              <p className="text-sm text-destructive mt-1">{errors.dosage_instructions.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="frequency">Frequency *</Label>
            <Select onValueChange={(value) => setValue("frequency", value)}>
              <SelectTrigger className="glass">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Once daily">Once daily</SelectItem>
                <SelectItem value="Twice daily">Twice daily</SelectItem>
                <SelectItem value="Three times daily">Three times daily</SelectItem>
                <SelectItem value="Every 4 hours">Every 4 hours</SelectItem>
                <SelectItem value="Every 6 hours">Every 6 hours</SelectItem>
                <SelectItem value="As needed">As needed</SelectItem>
                <SelectItem value="Single dose">Single dose</SelectItem>
              </SelectContent>
            </Select>
            {errors.frequency && (
              <p className="text-sm text-destructive mt-1">{errors.frequency.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="duration">Duration *</Label>
            <Input
              id="duration"
              {...register("duration")}
              placeholder="e.g., 7 days, 2 weeks, 1 month"
              className="glass"
            />
            {errors.duration && (
              <p className="text-sm text-destructive mt-1">{errors.duration.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="method">Method of Administration</Label>
            <Select onValueChange={(value) => setValue("method", value)}>
              <SelectTrigger className="glass">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Oral">Oral</SelectItem>
                <SelectItem value="Sublingual">Sublingual</SelectItem>
                <SelectItem value="Topical">Topical</SelectItem>
                <SelectItem value="Olfaction">Olfaction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="patient_instructions">Additional Instructions</Label>
            <Textarea
              id="patient_instructions"
              {...register("patient_instructions")}
              placeholder="Any special instructions for the patient..."
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
              Creating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Create Prescription
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
