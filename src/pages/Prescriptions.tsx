import Navbar from "@/components/Navbar";
import { PrescriptionForm } from "@/components/prescriptions/PrescriptionForm";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Pill } from "lucide-react";

interface Prescription {
  id: string;
  prescription_number: string;
  prescription_date: string;
  remedy_name: string;
  potency: string;
  frequency: string;
  status: string;
  patients: {
    first_name: string;
    last_name: string;
  };
}

const Prescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("prescriptions")
      .select(`
        id,
        prescription_number,
        prescription_date,
        remedy_name,
        potency,
        frequency,
        status,
        patients (
          first_name,
          last_name
        )
      `)
      .eq("practitioner_id", user?.id)
      .order("prescription_date", { ascending: false })
      .limit(10);

    if (!error && data) {
      setPrescriptions(data as any);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2 text-foreground">Prescriptions</h1>
            <p className="text-muted-foreground">Create and manage patient prescriptions</p>
          </div>

          <div className="space-y-8">
            <PrescriptionForm />

            <Card className="glass-card">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Prescriptions</h3>
              
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : prescriptions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No prescriptions yet. Create your first prescription above.
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-foreground">{prescription.prescription_number}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{prescription.patients?.first_name} {prescription.patients?.last_name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(prescription.prescription_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={prescription.status === "active" ? "default" : "secondary"}>
                          {prescription.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-sm">
                        <Pill className="w-4 h-4 text-primary" />
                        <span className="text-foreground">
                          {prescription.remedy_name} {prescription.potency} - {prescription.frequency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;
