import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, User, FileText, Pill } from "lucide-react";
import { toast } from "sonner";

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientData();
  }, [id]);

  const loadPatientData = async () => {
    try {
      // Load patient
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();

      if (patientError) throw patientError;
      setPatient(patientData);

      // Load cases
      const { data: casesData } = await supabase
        .from("cases")
        .select("*")
        .eq("patient_id", id)
        .order("consultation_date", { ascending: false });

      setCases(casesData || []);

      // Load prescriptions
      const { data: prescriptionsData } = await supabase
        .from("prescriptions")
        .select("*")
        .eq("patient_id", id)
        .order("prescription_date", { ascending: false });

      setPrescriptions(prescriptionsData || []);
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to load patient data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4">
          <Card className="glass-card text-center py-12">
            <p className="text-muted-foreground">Patient not found</p>
            <Button onClick={() => navigate("/patients")} className="mt-4">
              Back to Patients
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Button
            variant="outline"
            onClick={() => navigate("/patients")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Patients
          </Button>

          {/* Patient Header */}
          <Card className="glass-card mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2 text-foreground">
                  {patient.first_name} {patient.last_name}
                </h1>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Patient #:</span>
                    <span className="ml-2 font-medium">{patient.patient_number}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">DOB:</span>
                    <span className="ml-2 font-medium">
                      {new Date(patient.date_of_birth).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gender:</span>
                    <span className="ml-2 font-medium">{patient.gender || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="glass">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="cases">Cases ({cases.length})</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions ({prescriptions.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="glass-card space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Patient Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{patient.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{patient.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Group</p>
                    <p className="font-medium">{patient.blood_group || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{patient.status}</p>
                  </div>
                </div>
                {patient.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium">{patient.notes}</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="cases">
              <div className="space-y-4">
                {cases.length === 0 ? (
                  <Card className="glass-card text-center py-12">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No cases yet</p>
                  </Card>
                ) : (
                  cases.map((caseItem) => (
                    <Card key={caseItem.id} className="glass-card">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {caseItem.case_type}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {caseItem.chief_complaint}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(caseItem.consultation_date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {caseItem.case_status}
                        </span>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="prescriptions">
              <div className="space-y-4">
                {prescriptions.length === 0 ? (
                  <Card className="glass-card text-center py-12">
                    <Pill className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No prescriptions yet</p>
                  </Card>
                ) : (
                  prescriptions.map((prescription) => (
                    <Card key={prescription.id} className="glass-card">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {prescription.remedy_name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Potency: {prescription.potency} | {prescription.frequency}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(prescription.prescription_date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">
                          {prescription.status}
                        </span>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
