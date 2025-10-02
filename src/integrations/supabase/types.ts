export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      case_analysis: {
        Row: {
          ai_suggestions: Json | null
          case_id: string
          confidence_score: number | null
          created_at: string
          differential_analysis: string | null
          id: string
          notes: string | null
          practitioner_id: string
          remedy_scores: Json
          selected_rubrics: Json
          top_remedies: string[] | null
          updated_at: string
        }
        Insert: {
          ai_suggestions?: Json | null
          case_id: string
          confidence_score?: number | null
          created_at?: string
          differential_analysis?: string | null
          id?: string
          notes?: string | null
          practitioner_id: string
          remedy_scores: Json
          selected_rubrics: Json
          top_remedies?: string[] | null
          updated_at?: string
        }
        Update: {
          ai_suggestions?: Json | null
          case_id?: string
          confidence_score?: number | null
          created_at?: string
          differential_analysis?: string | null
          id?: string
          notes?: string | null
          practitioner_id?: string
          remedy_scores?: Json
          selected_rubrics?: Json
          top_remedies?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_analysis_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_analysis_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          attachments: string[] | null
          case_number: string
          case_status: string | null
          case_type: string
          chief_complaint: string
          consultation_date: string
          created_at: string
          family_history: string | null
          history_of_complaint: string | null
          id: string
          medical_history: string | null
          mental_emotional_state: string | null
          modalities: Json | null
          patient_id: string
          physical_examination: string | null
          practitioner_id: string
          quality_score: number | null
          template_used: string | null
          updated_at: string
          vital_signs: Json | null
        }
        Insert: {
          attachments?: string[] | null
          case_number: string
          case_status?: string | null
          case_type: string
          chief_complaint: string
          consultation_date?: string
          created_at?: string
          family_history?: string | null
          history_of_complaint?: string | null
          id?: string
          medical_history?: string | null
          mental_emotional_state?: string | null
          modalities?: Json | null
          patient_id: string
          physical_examination?: string | null
          practitioner_id: string
          quality_score?: number | null
          template_used?: string | null
          updated_at?: string
          vital_signs?: Json | null
        }
        Update: {
          attachments?: string[] | null
          case_number?: string
          case_status?: string | null
          case_type?: string
          chief_complaint?: string
          consultation_date?: string
          created_at?: string
          family_history?: string | null
          history_of_complaint?: string | null
          id?: string
          medical_history?: string | null
          mental_emotional_state?: string | null
          modalities?: Json | null
          patient_id?: string
          physical_examination?: string | null
          practitioner_id?: string
          quality_score?: number | null
          template_used?: string | null
          updated_at?: string
          vital_signs?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          allergies: string[] | null
          avatar_url: string | null
          blood_group: string | null
          created_at: string
          date_of_birth: string
          email: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          family_group_id: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          notes: string | null
          patient_number: string
          phone: string | null
          practitioner_id: string
          status: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          allergies?: string[] | null
          avatar_url?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth: string
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          family_group_id?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          notes?: string | null
          patient_number: string
          phone?: string | null
          practitioner_id: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          allergies?: string[] | null
          avatar_url?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          family_group_id?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          notes?: string | null
          patient_number?: string
          phone?: string | null
          practitioner_id?: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          case_id: string
          created_at: string
          dosage_instructions: string
          duration: string
          follow_up_date: string | null
          frequency: string
          id: string
          method: string | null
          patient_id: string
          patient_instructions: string | null
          pdf_url: string | null
          potency: string
          practitioner_id: string
          prescription_date: string
          prescription_number: string
          qr_code_url: string | null
          remedy_id: string
          remedy_name: string
          sent_via_email: boolean | null
          sent_via_sms: boolean | null
          status: string | null
        }
        Insert: {
          case_id: string
          created_at?: string
          dosage_instructions: string
          duration: string
          follow_up_date?: string | null
          frequency: string
          id?: string
          method?: string | null
          patient_id: string
          patient_instructions?: string | null
          pdf_url?: string | null
          potency: string
          practitioner_id: string
          prescription_date?: string
          prescription_number: string
          qr_code_url?: string | null
          remedy_id: string
          remedy_name: string
          sent_via_email?: boolean | null
          sent_via_sms?: boolean | null
          status?: string | null
        }
        Update: {
          case_id?: string
          created_at?: string
          dosage_instructions?: string
          duration?: string
          follow_up_date?: string | null
          frequency?: string
          id?: string
          method?: string | null
          patient_id?: string
          patient_instructions?: string | null
          pdf_url?: string | null
          potency?: string
          practitioner_id?: string
          prescription_date?: string
          prescription_number?: string
          qr_code_url?: string | null
          remedy_id?: string
          remedy_name?: string
          sent_via_email?: boolean | null
          sent_via_sms?: boolean | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_remedy_id_fkey"
            columns: ["remedy_id"]
            isOneToOne: false
            referencedRelation: "remedies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          clinic_logo_url: string | null
          clinic_name: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          full_name: string
          id: string
          language_preference: string | null
          license_number: string | null
          signature_url: string | null
          specialization: string | null
          theme_preference: string | null
          updated_at: string
        }
        Insert: {
          clinic_logo_url?: string | null
          clinic_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          full_name: string
          id: string
          language_preference?: string | null
          license_number?: string | null
          signature_url?: string | null
          specialization?: string | null
          theme_preference?: string | null
          updated_at?: string
        }
        Update: {
          clinic_logo_url?: string | null
          clinic_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          full_name?: string
          id?: string
          language_preference?: string | null
          license_number?: string | null
          signature_url?: string | null
          specialization?: string | null
          theme_preference?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      remedies: {
        Row: {
          abbreviation: string
          common_name: string | null
          created_at: string
          description: string | null
          id: string
          is_acute_remedy: boolean | null
          key_notes: string[] | null
          kingdom: string | null
          mental_symptoms: string[] | null
          modalities: Json | null
          name: string
          physical_symptoms: string[] | null
          relationships: string[] | null
          source: string | null
        }
        Insert: {
          abbreviation: string
          common_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_acute_remedy?: boolean | null
          key_notes?: string[] | null
          kingdom?: string | null
          mental_symptoms?: string[] | null
          modalities?: Json | null
          name: string
          physical_symptoms?: string[] | null
          relationships?: string[] | null
          source?: string | null
        }
        Update: {
          abbreviation?: string
          common_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_acute_remedy?: boolean | null
          key_notes?: string[] | null
          kingdom?: string | null
          mental_symptoms?: string[] | null
          modalities?: Json | null
          name?: string
          physical_symptoms?: string[] | null
          relationships?: string[] | null
          source?: string | null
        }
        Relationships: []
      }
      rubrics: {
        Row: {
          chapter: string
          complete_path: string
          created_at: string
          id: string
          level: number
          parent_id: string | null
          remedy_grades: Json | null
          rubric_text: string
          section: string | null
          subsection: string | null
        }
        Insert: {
          chapter: string
          complete_path: string
          created_at?: string
          id?: string
          level: number
          parent_id?: string | null
          remedy_grades?: Json | null
          rubric_text: string
          section?: string | null
          subsection?: string | null
        }
        Update: {
          chapter?: string
          complete_path?: string
          created_at?: string
          id?: string
          level?: number
          parent_id?: string | null
          remedy_grades?: Json | null
          rubric_text?: string
          section?: string | null
          subsection?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rubrics_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "rubrics"
            referencedColumns: ["id"]
          },
        ]
      }
      symptoms: {
        Row: {
          accompanying_symptoms: string[] | null
          better_with: string[] | null
          body_diagram_data: Json | null
          case_id: string
          created_at: string
          duration: string | null
          frequency: string | null
          id: string
          intensity: number | null
          location: string | null
          photo_urls: string[] | null
          symptom_category: string
          symptom_description: string
          worse_with: string[] | null
        }
        Insert: {
          accompanying_symptoms?: string[] | null
          better_with?: string[] | null
          body_diagram_data?: Json | null
          case_id: string
          created_at?: string
          duration?: string | null
          frequency?: string | null
          id?: string
          intensity?: number | null
          location?: string | null
          photo_urls?: string[] | null
          symptom_category: string
          symptom_description: string
          worse_with?: string[] | null
        }
        Update: {
          accompanying_symptoms?: string[] | null
          better_with?: string[] | null
          body_diagram_data?: Json | null
          case_id?: string
          created_at?: string
          duration?: string | null
          frequency?: string | null
          id?: string
          intensity?: number | null
          location?: string | null
          photo_urls?: string[] | null
          symptom_category?: string
          symptom_description?: string
          worse_with?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "symptoms_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          created_at: string
          id: string
          is_public: boolean | null
          practitioner_id: string
          template_data: Json
          template_name: string
          template_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_public?: boolean | null
          practitioner_id: string
          template_data: Json
          template_name: string
          template_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_public?: boolean | null
          practitioner_id?: string
          template_data?: Json
          template_name?: string
          template_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "templates_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
