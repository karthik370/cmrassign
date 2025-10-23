export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fonts: {
        Row: {
          id: string
          user_id: string
          name: string
          font_file_url: string
          font_file_size: number | null
          font_format: string
          status: 'uploaded' | 'active' | 'failed'
          is_validated: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          font_file_url: string
          font_file_size?: number | null
          font_format?: string
          status?: 'uploaded' | 'active' | 'failed'
          is_validated?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          font_file_url?: string
          font_file_size?: number | null
          font_format?: string
          status?: 'uploaded' | 'active' | 'failed'
          is_validated?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          font_id: string | null
          name: string
          original_pdf_url: string
          processed_pdf_url: string | null
          page_count: number | null
          pdf_metadata: Json | null
          status: 'draft' | 'processing' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          font_id?: string | null
          name: string
          original_pdf_url: string
          processed_pdf_url?: string | null
          page_count?: number | null
          pdf_metadata?: Json | null
          status?: 'draft' | 'processing' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          font_id?: string | null
          name?: string
          original_pdf_url?: string
          processed_pdf_url?: string | null
          page_count?: number | null
          pdf_metadata?: Json | null
          status?: 'draft' | 'processing' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
      page_edits: {
        Row: {
          id: string
          project_id: string
          page_number: number
          text_content: Json | null
          detected_areas: Json | null
          ink_color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          page_number: number
          text_content?: Json | null
          detected_areas?: Json | null
          ink_color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          page_number?: number
          text_content?: Json | null
          detected_areas?: Json | null
          ink_color?: string
          created_at?: string
          updated_at?: string
        }
      }
      usage_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          metadata?: Json | null
          created_at?: string
        }
      }
    }
  }
}
