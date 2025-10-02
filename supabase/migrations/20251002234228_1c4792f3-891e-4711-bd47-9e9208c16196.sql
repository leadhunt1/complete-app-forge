-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  license_number TEXT,
  specialization TEXT,
  clinic_name TEXT,
  clinic_logo_url TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  signature_url TEXT,
  language_preference TEXT DEFAULT 'en',
  theme_preference TEXT DEFAULT 'light',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Patients Table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practitioner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_number TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  blood_group TEXT,
  allergies TEXT[],
  family_group_id UUID,
  tags TEXT[],
  avatar_url TEXT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(practitioner_id, patient_number)
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners can view their patients" ON public.patients
  FOR SELECT USING (practitioner_id = auth.uid());

CREATE POLICY "Practitioners can insert their patients" ON public.patients
  FOR INSERT WITH CHECK (practitioner_id = auth.uid());

CREATE POLICY "Practitioners can update their patients" ON public.patients
  FOR UPDATE USING (practitioner_id = auth.uid());

CREATE POLICY "Practitioners can delete their patients" ON public.patients
  FOR DELETE USING (practitioner_id = auth.uid());

-- Cases Table
CREATE TABLE public.cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  practitioner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  case_number TEXT NOT NULL,
  case_type TEXT NOT NULL,
  consultation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  chief_complaint TEXT NOT NULL,
  history_of_complaint TEXT,
  medical_history TEXT,
  family_history TEXT,
  physical_examination TEXT,
  mental_emotional_state TEXT,
  vital_signs JSONB,
  modalities JSONB,
  case_status TEXT DEFAULT 'draft',
  quality_score INTEGER,
  template_used TEXT,
  attachments TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(practitioner_id, case_number)
);

ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners can view their cases" ON public.cases
  FOR SELECT USING (practitioner_id = auth.uid());

CREATE POLICY "Practitioners can insert their cases" ON public.cases
  FOR INSERT WITH CHECK (practitioner_id = auth.uid());

CREATE POLICY "Practitioners can update their cases" ON public.cases
  FOR UPDATE USING (practitioner_id = auth.uid());

CREATE POLICY "Practitioners can delete their cases" ON public.cases
  FOR DELETE USING (practitioner_id = auth.uid());

-- Symptoms Table
CREATE TABLE public.symptoms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  symptom_category TEXT NOT NULL,
  symptom_description TEXT NOT NULL,
  location TEXT,
  intensity INTEGER CHECK (intensity >= 0 AND intensity <= 10),
  duration TEXT,
  frequency TEXT,
  better_with TEXT[],
  worse_with TEXT[],
  accompanying_symptoms TEXT[],
  photo_urls TEXT[],
  body_diagram_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners can view symptoms for their cases" ON public.symptoms
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.cases WHERE cases.id = symptoms.case_id AND cases.practitioner_id = auth.uid()
  ));

CREATE POLICY "Practitioners can insert symptoms for their cases" ON public.symptoms
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.cases WHERE cases.id = symptoms.case_id AND cases.practitioner_id = auth.uid()
  ));

CREATE POLICY "Practitioners can update symptoms for their cases" ON public.symptoms
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.cases WHERE cases.id = symptoms.case_id AND cases.practitioner_id = auth.uid()
  ));

CREATE POLICY "Practitioners can delete symptoms for their cases" ON public.symptoms
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.cases WHERE cases.id = symptoms.case_id AND cases.practitioner_id = auth.uid()
  ));

-- Remedies Table
CREATE TABLE public.remedies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  abbreviation TEXT NOT NULL UNIQUE,
  common_name TEXT,
  source TEXT,
  kingdom TEXT,
  description TEXT,
  key_notes TEXT[],
  mental_symptoms TEXT[],
  physical_symptoms TEXT[],
  modalities JSONB,
  relationships TEXT[],
  is_acute_remedy BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Make remedies readable by all authenticated users
ALTER TABLE public.remedies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view remedies" ON public.remedies
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Rubrics Table (Repertory)
CREATE TABLE public.rubrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter TEXT NOT NULL,
  section TEXT,
  subsection TEXT,
  rubric_text TEXT NOT NULL,
  complete_path TEXT NOT NULL,
  level INTEGER NOT NULL,
  parent_id UUID REFERENCES public.rubrics(id),
  remedy_grades JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(complete_path)
);

CREATE INDEX idx_rubrics_chapter ON public.rubrics(chapter);
CREATE INDEX idx_rubrics_section ON public.rubrics(section);
CREATE INDEX idx_rubrics_text ON public.rubrics USING gin(to_tsvector('english', rubric_text));

ALTER TABLE public.rubrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view rubrics" ON public.rubrics
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Case Analysis Table
CREATE TABLE public.case_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  practitioner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  selected_rubrics JSONB NOT NULL,
  remedy_scores JSONB NOT NULL,
  top_remedies TEXT[],
  ai_suggestions JSONB,
  confidence_score DECIMAL(5,2),
  differential_analysis TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.case_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners can view their analysis" ON public.case_analysis
  FOR SELECT USING (practitioner_id = auth.uid());

CREATE POLICY "Practitioners can insert their analysis" ON public.case_analysis
  FOR INSERT WITH CHECK (practitioner_id = auth.uid());

CREATE POLICY "Practitioners can update their analysis" ON public.case_analysis
  FOR UPDATE USING (practitioner_id = auth.uid());

-- Prescriptions Table
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  practitioner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  prescription_number TEXT NOT NULL,
  remedy_id UUID NOT NULL REFERENCES public.remedies(id),
  remedy_name TEXT NOT NULL,
  potency TEXT NOT NULL,
  dosage_instructions TEXT NOT NULL,
  frequency TEXT NOT NULL,
  duration TEXT NOT NULL,
  method TEXT,
  patient_instructions TEXT,
  follow_up_date DATE,
  prescription_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT DEFAULT 'active',
  sent_via_email BOOLEAN DEFAULT false,
  sent_via_sms BOOLEAN DEFAULT false,
  qr_code_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(practitioner_id, prescription_number)
);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners can view their prescriptions" ON public.prescriptions
  FOR SELECT USING (practitioner_id = auth.uid());

CREATE POLICY "Practitioners can insert their prescriptions" ON public.prescriptions
  FOR INSERT WITH CHECK (practitioner_id = auth.uid());

CREATE POLICY "Practitioners can update their prescriptions" ON public.prescriptions
  FOR UPDATE USING (practitioner_id = auth.uid());

-- Templates Table
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practitioner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  template_data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners can view their templates" ON public.templates
  FOR SELECT USING (practitioner_id = auth.uid() OR is_public = true);

CREATE POLICY "Practitioners can insert their templates" ON public.templates
  FOR INSERT WITH CHECK (practitioner_id = auth.uid());

CREATE POLICY "Practitioners can update their templates" ON public.templates
  FOR UPDATE USING (practitioner_id = auth.uid());

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_case_analysis_updated_at BEFORE UPDATE ON public.case_analysis
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, contact_email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample remedies data
INSERT INTO public.remedies (name, abbreviation, common_name, source, kingdom, description, key_notes, is_acute_remedy) VALUES
  ('Aconitum Napellus', 'Acon.', 'Monkshood', 'Plant', 'Plantae', 'Acute remedy for sudden onset conditions', ARRAY['Sudden violent onset', 'Fear and anxiety', 'Worse at night'], true),
  ('Arnica Montana', 'Arn.', 'Leopard''s Bane', 'Plant', 'Plantae', 'Trauma and injury remedy', ARRAY['Physical trauma', 'Soreness', 'Bruising'], true),
  ('Arsenicum Album', 'Ars.', 'White Arsenic', 'Mineral', 'Mineralia', 'Anxiety with restlessness', ARRAY['Anxiety', 'Restlessness', 'Better from warmth'], false),
  ('Belladonna', 'Bell.', 'Deadly Nightshade', 'Plant', 'Plantae', 'Acute fevers and inflammations', ARRAY['Sudden high fever', 'Flushed face', 'Throbbing pain'], true),
  ('Bryonia Alba', 'Bry.', 'White Bryony', 'Plant', 'Plantae', 'Better from rest and pressure', ARRAY['Worse from motion', 'Irritability', 'Dryness'], true),
  ('Calcarea Carbonica', 'Calc.', 'Calcium Carbonate', 'Mineral', 'Mineralia', 'Constitutional remedy', ARRAY['Slow development', 'Chilly', 'Sweating'], false),
  ('Chamomilla', 'Cham.', 'German Chamomile', 'Plant', 'Plantae', 'Irritability and teething', ARRAY['Extreme irritability', 'Better from being carried', 'Teething'], true),
  ('Gelsemium', 'Gels.', 'Yellow Jasmine', 'Plant', 'Plantae', 'Anticipatory anxiety', ARRAY['Trembling', 'Weakness', 'Anxiety before events'], true),
  ('Ignatia Amara', 'Ign.', 'St. Ignatius Bean', 'Plant', 'Plantae', 'Grief and emotional upsets', ARRAY['Grief', 'Sighing', 'Mood swings'], false),
  ('Lycopodium', 'Lyc.', 'Club Moss', 'Plant', 'Plantae', 'Digestive and liver issues', ARRAY['Bloating', 'Right-sided complaints', 'Lack of confidence'], false),
  ('Natrum Muriaticum', 'Nat-m.', 'Common Salt', 'Mineral', 'Mineralia', 'Suppressed emotions', ARRAY['Reserved nature', 'Worse from consolation', 'Craving salt'], false),
  ('Nux Vomica', 'Nux-v.', 'Poison Nut', 'Plant', 'Plantae', 'Overindulgence and stress', ARRAY['Irritable', 'Chilly', 'Digestive issues'], true),
  ('Phosphorus', 'Phos.', 'Yellow Phosphorus', 'Mineral', 'Mineralia', 'Bleeding and respiratory', ARRAY['Friendly', 'Anxious', 'Bleeding tendency'], false),
  ('Pulsatilla', 'Puls.', 'Wind Flower', 'Plant', 'Plantae', 'Changeable symptoms', ARRAY['Mild temperament', 'Weepy', 'Worse in warm room'], false),
  ('Rhus Toxicodendron', 'Rhus-t.', 'Poison Ivy', 'Plant', 'Plantae', 'Joint and muscle pains', ARRAY['Restless', 'Better from motion', 'Stiffness'], true),
  ('Sepia', 'Sep.', 'Cuttlefish Ink', 'Animal', 'Animalia', 'Hormonal and emotional', ARRAY['Indifference', 'Bearing down sensation', 'Worse morning'], false),
  ('Silica', 'Sil.', 'Pure Flint', 'Mineral', 'Mineralia', 'Slow healing and infections', ARRAY['Chilly', 'Lack of stamina', 'Suppuration'], false),
  ('Sulphur', 'Sulph.', 'Sublimated Sulphur', 'Mineral', 'Mineralia', 'Skin conditions', ARRAY['Burning', 'Worse from heat', 'Philosophical'], false),
  ('Thuja Occidentalis', 'Thuj.', 'Arbor Vitae', 'Plant', 'Plantae', 'Warts and vaccination effects', ARRAY['Fixed ideas', 'Secrecy', 'Warts'], false),
  ('Hepar Sulphuris', 'Hep.', 'Calcium Sulphide', 'Mineral', 'Mineralia', 'Suppurating infections', ARRAY['Oversensitive', 'Splinter-like pains', 'Chilly'], true);