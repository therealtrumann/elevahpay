export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pix_transactions: {
        Row: {
          cpf: string
          created_at: string
          email: string
          id: string
          id_rec: string | null
          loc_id: number | null
          nome: string
          product_id: string | null
          qr_code: string | null
          status: string | null
          txid: string
          updated_at: string
          valor: number
        }
        Insert: {
          cpf: string
          created_at?: string
          email: string
          id?: string
          id_rec?: string | null
          loc_id?: number | null
          nome: string
          product_id?: string | null
          qr_code?: string | null
          status?: string | null
          txid: string
          updated_at?: string
          valor: number
        }
        Update: {
          cpf?: string
          created_at?: string
          email?: string
          id?: string
          id_rec?: string | null
          loc_id?: number | null
          nome?: string
          product_id?: string | null
          qr_code?: string | null
          status?: string | null
          txid?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pix_transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          installments: number
          is_recurring: boolean
          name: string
          pix_automatic: boolean
          price_cents: number
          recurring_card: boolean
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          installments?: number
          is_recurring?: boolean
          name: string
          pix_automatic?: boolean
          price_cents: number
          recurring_card?: boolean
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          installments?: number
          is_recurring?: boolean
          name?: string
          pix_automatic?: boolean
          price_cents?: number
          recurring_card?: boolean
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          created_at: string | null
          customer_id: string | null
          fee_fixed_cents: number
          fee_percent: number
          id: string
          installment_number: number
          net_cents: number
          product_id: string
          status: string
          total_cents: number
          total_installments: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          fee_fixed_cents: number
          fee_percent: number
          id?: string
          installment_number: number
          net_cents: number
          product_id: string
          status?: string
          total_cents: number
          total_installments: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          fee_fixed_cents?: number
          fee_percent?: number
          id?: string
          installment_number?: number
          net_cents?: number
          product_id?: string
          status?: string
          total_cents?: number
          total_installments?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          password_hash: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          password_hash: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          password_hash?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          endpoint: string
          id: string
          payload: Json
          received_at: string | null
        }
        Insert: {
          endpoint: string
          id?: string
          payload: Json
          received_at?: string | null
        }
        Update: {
          endpoint?: string
          id?: string
          payload?: Json
          received_at?: string | null
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount_cents: number
          id: string
          processed_at: string | null
          requested_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          id?: string
          processed_at?: string | null
          requested_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          id?: string
          processed_at?: string | null
          requested_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_net_amount: {
        Args: {
          total_cents: number
          fee_percent: number
          fee_fixed_cents: number
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
