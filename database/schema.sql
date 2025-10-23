-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fonts table (stores uploaded font files)
CREATE TABLE public.fonts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  font_file_url TEXT NOT NULL,
  font_file_size INTEGER,
  font_format TEXT DEFAULT 'ttf',
  status TEXT CHECK (status IN ('uploaded', 'active', 'failed', 'local')) DEFAULT 'uploaded',
  is_validated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  font_id UUID REFERENCES public.fonts(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  original_pdf_url TEXT NOT NULL,
  processed_pdf_url TEXT,
  page_count INTEGER,
  pdf_metadata JSONB,
  status TEXT CHECK (status IN ('draft', 'processing', 'completed', 'failed')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page edits table (stores text for each page)
CREATE TABLE public.page_edits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  text_content JSONB,
  detected_areas JSONB,
  ink_color TEXT DEFAULT 'black',
  line_colors JSONB DEFAULT '{}'::jsonb,
  dimensions JSONB DEFAULT '{"lineBoxHeight": 30.5, "lineSpacing": 23, "marginLeft": 40, "marginRight": -125, "marginTop": 93}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, page_number)
);

-- Usage logs table (analytics)
CREATE TABLE public.usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_fonts_user_id ON public.fonts(user_id);
CREATE INDEX idx_fonts_status ON public.fonts(status);
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_font_id ON public.projects(font_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_page_edits_project ON public.page_edits(project_id);
CREATE INDEX idx_page_edits_page_number ON public.page_edits(page_number);
CREATE INDEX idx_usage_logs_user ON public.usage_logs(user_id);
CREATE INDEX idx_usage_logs_action ON public.usage_logs(action);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fonts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_edits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Fonts policies
CREATE POLICY "Users can view own fonts"
  ON public.fonts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own fonts"
  ON public.fonts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fonts"
  ON public.fonts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fonts"
  ON public.fonts FOR DELETE
  USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- Page edits policies
CREATE POLICY "Users can view own page edits"
  ON public.page_edits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = page_edits.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own page edits"
  ON public.page_edits FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = page_edits.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Usage logs policies
CREATE POLICY "Users can view own usage logs"
  ON public.usage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create usage logs"
  ON public.usage_logs FOR INSERT
  WITH CHECK (true);

-- Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fonts_updated_at
  BEFORE UPDATE ON public.fonts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_edits_updated_at
  BEFORE UPDATE ON public.page_edits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
