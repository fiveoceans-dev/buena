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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      auth_tokens: {
        Row: {
          id: string
          email: string
          token_hash: string
          expires_at: string
          used_at: string | null
          created_at: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          email: string
          token_hash: string
          expires_at: string
          used_at?: string | null
          created_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          email?: string
          token_hash?: string
          expires_at?: string
          used_at?: string | null
          created_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          parent_id: string | null
          display_order: number
          is_active: boolean
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          parent_id?: string | null
          display_order?: number
          is_active?: boolean
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          parent_id?: string | null
          display_order?: number
          is_active?: boolean
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      customers: {
        Row: {
          id: string
          user_id: string | null
          email: string
          first_name: string | null
          last_name: string | null
          company_name: string | null
          phone: string | null
          tax_id: string | null
          customer_type: string
          credit_limit: number
          payment_terms: string
          is_active: boolean
          preferences: Json
          billing_address: Json | null
          shipping_addresses: Json
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          first_name?: string | null
          last_name?: string | null
          company_name?: string | null
          phone?: string | null
          tax_id?: string | null
          customer_type?: string
          credit_limit?: number
          payment_terms?: string
          is_active?: boolean
          preferences?: Json
          billing_address?: Json | null
          shipping_addresses?: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          first_name?: string | null
          last_name?: string | null
          company_name?: string | null
          phone?: string | null
          tax_id?: string | null
          customer_type?: string
          credit_limit?: number
          payment_terms?: string
          is_active?: boolean
          preferences?: Json
          billing_address?: Json | null
          shipping_addresses?: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      inventory: {
        Row: {
          id: string
          product_id: string
          location: string
          quantity_available: number
          quantity_reserved: number
          quantity_on_order: number
          reorder_point: number | null
          reorder_quantity: number | null
          expiry_date: string | null
          batch_number: string | null
          supplier_info: Json | null
          last_counted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          location: string
          quantity_available?: number
          quantity_reserved?: number
          quantity_on_order?: number
          reorder_point?: number | null
          reorder_quantity?: number | null
          expiry_date?: string | null
          batch_number?: string | null
          supplier_info?: Json | null
          last_counted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          location?: string
          quantity_available?: number
          quantity_reserved?: number
          quantity_on_order?: number
          reorder_point?: number | null
          reorder_quantity?: number | null
          expiry_date?: string | null
          batch_number?: string | null
          supplier_info?: Json | null
          last_counted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          product_sku: string | null
          variant_data: Json | null
          unit_price: number
          quantity: number
          discount_amount: number
          tax_amount: number
          total: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          product_sku?: string | null
          variant_data?: Json | null
          unit_price: number
          quantity: number
          discount_amount?: number
          tax_amount?: number
          total: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          product_sku?: string | null
          variant_data?: Json | null
          unit_price?: number
          quantity?: number
          discount_amount?: number
          tax_amount?: number
          total?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string
          status: string
          subtotal: number
          tax_amount: number
          discount_amount: number
          shipping_amount: number
          total: number
          currency: string
          payment_status: string | null
          payment_method: string | null
          payment_reference: string | null
          shipping_address: Json | null
          billing_address: Json | null
          delivery_date: string | null
          delivery_time_slot: string | null
          delivery_instructions: string | null
          customer_notes: string | null
          internal_notes: string | null
          ordered_at: string | null
          confirmed_at: string | null
          shipped_at: string | null
          delivered_at: string | null
          cancelled_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_id: string
          status?: string
          subtotal?: number
          tax_amount?: number
          discount_amount?: number
          shipping_amount?: number
          total?: number
          currency?: string
          payment_status?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          shipping_address?: Json | null
          billing_address?: Json | null
          delivery_date?: string | null
          delivery_time_slot?: string | null
          delivery_instructions?: string | null
          customer_notes?: string | null
          internal_notes?: string | null
          ordered_at?: string | null
          confirmed_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_id?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          discount_amount?: number
          shipping_amount?: number
          total?: number
          currency?: string
          payment_status?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          shipping_address?: Json | null
          billing_address?: Json | null
          delivery_date?: string | null
          delivery_time_slot?: string | null
          delivery_instructions?: string | null
          customer_notes?: string | null
          internal_notes?: string | null
          ordered_at?: string | null
          confirmed_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          short_description: string | null
          sku: string | null
          category_id: string | null
          base_price: number
          compare_at_price: number | null
          cost_price: number | null
          is_active: boolean
          is_featured: boolean
          track_inventory: boolean
          min_order_quantity: number
          max_order_quantity: number | null
          weight_grams: number | null
          dimensions: Json | null
          tags: string[] | null
          metadata: Json
          images: Json
          variants: Json
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          short_description?: string | null
          sku?: string | null
          category_id?: string | null
          base_price: number
          compare_at_price?: number | null
          cost_price?: number | null
          is_active?: boolean
          is_featured?: boolean
          track_inventory?: boolean
          min_order_quantity?: number
          max_order_quantity?: number | null
          weight_grams?: number | null
          dimensions?: Json | null
          tags?: string[] | null
          metadata?: Json
          images?: Json
          variants?: Json
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          short_description?: string | null
          sku?: string | null
          category_id?: string | null
          base_price?: number
          compare_at_price?: number | null
          cost_price?: number | null
          is_active?: boolean
          is_featured?: boolean
          track_inventory?: boolean
          min_order_quantity?: number
          max_order_quantity?: number | null
          weight_grams?: number | null
          dimensions?: Json | null
          tags?: string[] | null
          metadata?: Json
          images?: Json
          variants?: Json
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string | null
          email: string
          email_verified: boolean | null
          id: string
          is_active: boolean | null
          nickname: string
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          email_verified?: boolean | null
          id: string
          is_active?: boolean | null
          nickname: string
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          email_verified?: boolean | null
          id?: string
          is_active?: boolean | null
          nickname?: string
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_buena_profiles: {
        Row: {
          created_at: string
          id: string
          preferences: Json | null
          role: string | null
          site_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          preferences?: Json | null
          role?: string | null
          site_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          preferences?: Json | null
          role?: string | null
          site_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_buena_profiles_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      site_members: {
        Row: {
          active: boolean | null
          id: string
          joined_at: string | null
          role: string | null
          site_id: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          id?: string
          joined_at?: string | null
          role?: string | null
          site_id?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          id?: string
          joined_at?: string | null
          role?: string | null
          site_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_members_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      site_regatta_profiles: {
        Row: {
          created_at: string
          credits: number | null
          id: string
          karma: number | null
          rank: string | null
          site_id: string
          total_races: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits?: number | null
          id?: string
          karma?: number | null
          rank?: string | null
          site_id: string
          total_races?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits?: number | null
          id?: string
          karma?: number | null
          rank?: string | null
          site_id?: string
          total_races?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_regatta_profiles_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      site_web3analytics_profiles: {
        Row: {
          api_quota: number | null
          created_at: string
          id: string
          notification_preferences: Json | null
          site_id: string
          subscription_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          api_quota?: number | null
          created_at?: string
          id?: string
          notification_preferences?: Json | null
          site_id: string
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          api_quota?: number | null
          created_at?: string
          id?: string
          notification_preferences?: Json | null
          site_id?: string
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_web3analytics_profiles_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          active: boolean | null
          created_at: string | null
          domain: string
          id: string
          name: string
          schema_name: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          domain: string
          id?: string
          name: string
          schema_name: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          domain?: string
          id?: string
          name?: string
          schema_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_x_account: {
        Args: {
          p_affiliation?: string
          p_description?: string
          p_display_name?: string
          p_username: string
        }
        Returns: string
      }
      delete_x_account: {
        Args: { p_account_id: string }
        Returns: undefined
      }
      ensure_membership_for_domain: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_current_site_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_buena_profile: {
        Args: { site_schema: string }
        Returns: {
          created_at: string
          id: string
          preferences: Json
          role: string
          updated_at: string
        }[]
      }
      get_user_regatta_profile: {
        Args: { site_schema: string }
        Returns: {
          created_at: string
          credits: number
          id: string
          karma: number
          rank: string
          total_races: number
          updated_at: string
        }[]
      }
      get_user_web3analytics_profile: {
        Args: { site_schema: string }
        Returns: {
          api_quota: number
          created_at: string
          id: string
          notification_preferences: Json
          subscription_tier: string
          updated_at: string
        }[]
      }
      get_x_accounts: {
        Args: Record<PropertyKey, never>
        Returns: {
          affiliation: string
          created_at: string
          description: string
          display_name: string
          id: string
          updated_at: string
          username: string
        }[]
      }
      initialize_regatta_profile_for_site: {
        Args: { target_site_id: string }
        Returns: string
      }
      migrate_existing_users_to_regatta_profiles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_credits: {
        Args: { credit_change: number }
        Returns: undefined
      }
      update_x_account: {
        Args: {
          p_account_id: string
          p_affiliation?: string
          p_description?: string
          p_display_name?: string
          p_username?: string
        }
        Returns: undefined
      }
      user_in_site: {
        Args: { site_schema: string }
        Returns: boolean
      }
      user_role_in_site: {
        Args: { site_schema: string }
        Returns: string
      }
    }
    Enums: {
      boat_class: "j24" | "j70" | "laser" | "optimist" | "flying_dutchman"
      boat_condition: "excellent" | "good" | "fair" | "poor" | "damaged"
      crew_role: "skipper" | "tactician" | "trimmer" | "grinder" | "bowman"
      crew_status: "available" | "contracted" | "injured" | "retired"
      part_category:
        | "sail"
        | "mast"
        | "rudder"
        | "keel"
        | "rigging"
        | "electronics"
        | "safety"
      protest_status: "submitted" | "under_review" | "dismissed" | "upheld"
      race_status: "not_started" | "in_progress" | "finished" | "abandoned"
      regatta_status:
        | "upcoming"
        | "registration_open"
        | "registration_closed"
        | "in_progress"
        | "completed"
        | "cancelled"
      user_rank:
        | "novice"
        | "intermediate"
        | "advanced"
        | "expert"
        | "professional"
      weather_condition:
        | "calm"
        | "light_breeze"
        | "moderate_breeze"
        | "strong_breeze"
        | "gale"
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
    Enums: {
      boat_class: ["j24", "j70", "laser", "optimist", "flying_dutchman"],
      boat_condition: ["excellent", "good", "fair", "poor", "damaged"],
      crew_role: ["skipper", "tactician", "trimmer", "grinder", "bowman"],
      crew_status: ["available", "contracted", "injured", "retired"],
      part_category: [
        "sail",
        "mast",
        "rudder",
        "keel",
        "rigging",
        "electronics",
        "safety",
      ],
      protest_status: ["submitted", "under_review", "dismissed", "upheld"],
      race_status: ["not_started", "in_progress", "finished", "abandoned"],
      regatta_status: [
        "upcoming",
        "registration_open",
        "registration_closed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      user_rank: [
        "novice",
        "intermediate",
        "advanced",
        "expert",
        "professional",
      ],
      weather_condition: [
        "calm",
        "light_breeze",
        "moderate_breeze",
        "strong_breeze",
        "gale",
      ],
    },
  },
} as const
