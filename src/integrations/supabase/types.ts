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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line: string
          city: string
          created_at: string
          district: string
          full_name: string
          id: string
          is_default: boolean
          label: string | null
          phone: string
          postal_code: string | null
          user_id: string
        }
        Insert: {
          address_line: string
          city: string
          created_at?: string
          district: string
          full_name: string
          id?: string
          is_default?: boolean
          label?: string | null
          phone: string
          postal_code?: string | null
          user_id: string
        }
        Update: {
          address_line?: string
          city?: string
          created_at?: string
          district?: string
          full_name?: string
          id?: string
          is_default?: boolean
          label?: string | null
          phone?: string
          postal_code?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ambassadors: {
        Row: {
          clicks: number
          code: string
          commission_pct: number
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          clicks?: number
          code: string
          commission_pct?: number
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          clicks?: number
          code?: string
          commission_pct?: number
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          book_id: string | null
          campaign: string | null
          created_at: string
          id: string
          name: string
          payload: Json | null
          session_id: string | null
          source: string | null
          user_id: string | null
        }
        Insert: {
          book_id?: string | null
          campaign?: string | null
          created_at?: string
          id?: string
          name: string
          payload?: Json | null
          session_id?: string | null
          source?: string | null
          user_id?: string | null
        }
        Update: {
          book_id?: string | null
          campaign?: string | null
          created_at?: string
          id?: string
          name?: string
          payload?: Json | null
          session_id?: string | null
          source?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          new_value: Json | null
          old_value: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      authors: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          body: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          published_at: string | null
          slug: string
          title: string
        }
        Insert: {
          body?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug: string
          title: string
        }
        Update: {
          body?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      books: {
        Row: {
          author_bio: string | null
          author_id: string | null
          book_language: string
          category_id: string | null
          compare_at_price: number | null
          cover_alt: string | null
          cover_url: string | null
          created_at: string
          customs_cost: number
          description: string | null
          dimensions: string | null
          edition: string | null
          format: string
          gallery: Json
          id: string
          is_active: boolean
          is_bestseller: boolean
          is_booktok: boolean
          is_demo: boolean
          is_featured: boolean
          is_new_arrival: boolean
          is_preorder: boolean
          is_student_pick: boolean
          is_trending: boolean
          isbn: string | null
          original_language: string | null
          packaging_cost: number
          pages: number | null
          price: number
          price_eur: number | null
          price_usd: number | null
          published_date: string | null
          publisher_id: string | null
          purchase_cost: number
          purchase_currency: string
          purchase_date: string | null
          purchase_fx_rate: number
          quotes: string | null
          rating: number
          reorder_threshold: number
          reserved_qty: number
          review_count: number
          selling_points: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          shipping_cost: number
          short_description: string | null
          sku: string | null
          slug: string
          stock_qty: number
          stock_state: string
          subtitle: string | null
          summary: string | null
          supplier_id: string | null
          supplier_sku: string | null
          tags: string | null
          target_stock: number
          tax_rate: number
          title: string
          units_sold: number
          updated_at: string
          weight_grams: number | null
          why_you_like_it: string | null
        }
        Insert: {
          author_bio?: string | null
          author_id?: string | null
          book_language?: string
          category_id?: string | null
          compare_at_price?: number | null
          cover_alt?: string | null
          cover_url?: string | null
          created_at?: string
          customs_cost?: number
          description?: string | null
          dimensions?: string | null
          edition?: string | null
          format?: string
          gallery?: Json
          id?: string
          is_active?: boolean
          is_bestseller?: boolean
          is_booktok?: boolean
          is_demo?: boolean
          is_featured?: boolean
          is_new_arrival?: boolean
          is_preorder?: boolean
          is_student_pick?: boolean
          is_trending?: boolean
          isbn?: string | null
          original_language?: string | null
          packaging_cost?: number
          pages?: number | null
          price?: number
          price_eur?: number | null
          price_usd?: number | null
          published_date?: string | null
          publisher_id?: string | null
          purchase_cost?: number
          purchase_currency?: string
          purchase_date?: string | null
          purchase_fx_rate?: number
          quotes?: string | null
          rating?: number
          reorder_threshold?: number
          reserved_qty?: number
          review_count?: number
          selling_points?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          shipping_cost?: number
          short_description?: string | null
          sku?: string | null
          slug: string
          stock_qty?: number
          stock_state?: string
          subtitle?: string | null
          summary?: string | null
          supplier_id?: string | null
          supplier_sku?: string | null
          tags?: string | null
          target_stock?: number
          tax_rate?: number
          title: string
          units_sold?: number
          updated_at?: string
          weight_grams?: number | null
          why_you_like_it?: string | null
        }
        Update: {
          author_bio?: string | null
          author_id?: string | null
          book_language?: string
          category_id?: string | null
          compare_at_price?: number | null
          cover_alt?: string | null
          cover_url?: string | null
          created_at?: string
          customs_cost?: number
          description?: string | null
          dimensions?: string | null
          edition?: string | null
          format?: string
          gallery?: Json
          id?: string
          is_active?: boolean
          is_bestseller?: boolean
          is_booktok?: boolean
          is_demo?: boolean
          is_featured?: boolean
          is_new_arrival?: boolean
          is_preorder?: boolean
          is_student_pick?: boolean
          is_trending?: boolean
          isbn?: string | null
          original_language?: string | null
          packaging_cost?: number
          pages?: number | null
          price?: number
          price_eur?: number | null
          price_usd?: number | null
          published_date?: string | null
          publisher_id?: string | null
          purchase_cost?: number
          purchase_currency?: string
          purchase_date?: string | null
          purchase_fx_rate?: number
          quotes?: string | null
          rating?: number
          reorder_threshold?: number
          reserved_qty?: number
          review_count?: number
          selling_points?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          shipping_cost?: number
          short_description?: string | null
          sku?: string | null
          slug?: string
          stock_qty?: number
          stock_state?: string
          subtitle?: string | null
          summary?: string | null
          supplier_id?: string | null
          supplier_sku?: string | null
          tags?: string | null
          target_stock?: number
          tax_rate?: number
          title?: string
          units_sold?: number
          updated_at?: string
          weight_grams?: number | null
          why_you_like_it?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "books_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_publisher_id_fkey"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "publishers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description_en: string | null
          description_fr: string | null
          description_tr: string | null
          id: string
          image_url: string | null
          name_en: string
          name_fr: string
          name_tr: string
          parent_id: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description_en?: string | null
          description_fr?: string | null
          description_tr?: string | null
          id?: string
          image_url?: string | null
          name_en: string
          name_fr: string
          name_tr: string
          parent_id?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description_en?: string | null
          description_fr?: string | null
          description_tr?: string | null
          id?: string
          image_url?: string | null
          name_en?: string
          name_fr?: string
          name_tr?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_books: {
        Row: {
          book_id: string
          collection_id: string
          sort_order: number
        }
        Insert: {
          book_id: string
          collection_id: string
          sort_order?: number
        }
        Update: {
          book_id?: string
          collection_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "collection_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_books_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          subtitle_en: string | null
          subtitle_fr: string | null
          subtitle_tr: string | null
          title_en: string
          title_fr: string
          title_tr: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          subtitle_en?: string | null
          subtitle_fr?: string | null
          subtitle_tr?: string | null
          title_en: string
          title_fr: string
          title_tr: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          subtitle_en?: string | null
          subtitle_fr?: string | null
          subtitle_tr?: string | null
          title_en?: string
          title_fr?: string
          title_tr?: string
        }
        Relationships: []
      }
      competitor_prices: {
        Row: {
          book_id: string
          competitor_id: string
          id: string
          in_stock: boolean
          observed_at: string
          price: number
          source: string
          url: string | null
        }
        Insert: {
          book_id: string
          competitor_id: string
          id?: string
          in_stock?: boolean
          observed_at?: string
          price: number
          source?: string
          url?: string | null
        }
        Update: {
          book_id?: string
          competitor_id?: string
          id?: string
          in_stock?: boolean
          observed_at?: string
          price?: number
          source?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitor_prices_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitor_prices_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
        ]
      }
      competitors: {
        Row: {
          id: string
          is_active: boolean
          name: string
          website: string | null
        }
        Insert: {
          id?: string
          is_active?: boolean
          name: string
          website?: string | null
        }
        Update: {
          id?: string
          is_active?: boolean
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      homepage_sections: {
        Row: {
          collection_id: string | null
          id: string
          is_enabled: boolean
          key: string
          kind: string
          sort_order: number
          subtitle_en: string | null
          subtitle_fr: string | null
          subtitle_tr: string | null
          title_en: string
          title_fr: string
          title_tr: string
        }
        Insert: {
          collection_id?: string | null
          id?: string
          is_enabled?: boolean
          key: string
          kind?: string
          sort_order?: number
          subtitle_en?: string | null
          subtitle_fr?: string | null
          subtitle_tr?: string | null
          title_en: string
          title_fr: string
          title_tr: string
        }
        Update: {
          collection_id?: string | null
          id?: string
          is_enabled?: boolean
          key?: string
          kind?: string
          sort_order?: number
          subtitle_en?: string | null
          subtitle_fr?: string | null
          subtitle_tr?: string | null
          title_en?: string
          title_fr?: string
          title_tr?: string
        }
        Relationships: [
          {
            foreignKeyName: "homepage_sections_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          book_id: string
          created_at: string
          created_by: string | null
          delta: number
          id: string
          reason: string
          reference: string | null
        }
        Insert: {
          book_id: string
          created_at?: string
          created_by?: string | null
          delta: number
          id?: string
          reason: string
          reference?: string | null
        }
        Update: {
          book_id?: string
          created_at?: string
          created_by?: string | null
          delta?: number
          id?: string
          reason?: string
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_text: string | null
          content_type: string | null
          created_at: string
          created_by: string | null
          file_name: string
          folder: string
          id: string
          size_bytes: number | null
          storage_path: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          content_type?: string | null
          created_at?: string
          created_by?: string | null
          file_name: string
          folder?: string
          id?: string
          size_bytes?: number | null
          storage_path?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          content_type?: string | null
          created_at?: string
          created_by?: string | null
          file_name?: string
          folder?: string
          id?: string
          size_bytes?: number | null
          storage_path?: string | null
          url?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          locale: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          locale?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          locale?: string
        }
        Relationships: []
      }
      order_events: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          book_id: string | null
          cover_url: string | null
          id: string
          isbn: string | null
          line_total: number
          order_id: string
          quantity: number
          title: string
          unit_cost: number
          unit_price: number
        }
        Insert: {
          book_id?: string | null
          cover_url?: string | null
          id?: string
          isbn?: string | null
          line_total: number
          order_id: string
          quantity: number
          title: string
          unit_cost?: number
          unit_price: number
        }
        Update: {
          book_id?: string | null
          cover_url?: string | null
          id?: string
          isbn?: string | null
          line_total?: number
          order_id?: string
          quantity?: number
          title?: string
          unit_cost?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_line: string
          ambassador_code: string | null
          city: string
          coupon_code: string | null
          created_at: string
          currency: string
          discount_total: number
          district: string
          email: string
          full_name: string
          id: string
          internal_note: string | null
          note: string | null
          order_number: string
          payment_method: string | null
          payment_proof_path: string | null
          payment_proof_uploaded_at: string | null
          payment_provider: string
          payment_review_note: string | null
          payment_status: string
          payment_verified_at: string | null
          payment_verified_by: string | null
          phone: string
          postal_code: string | null
          shipping_carrier: string | null
          shipping_total: number
          status: string
          subtotal: number
          total: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
          utm_campaign: string | null
          utm_source: string | null
        }
        Insert: {
          address_line: string
          ambassador_code?: string | null
          city: string
          coupon_code?: string | null
          created_at?: string
          currency?: string
          discount_total?: number
          district: string
          email: string
          full_name: string
          id?: string
          internal_note?: string | null
          note?: string | null
          order_number?: string
          payment_method?: string | null
          payment_proof_path?: string | null
          payment_proof_uploaded_at?: string | null
          payment_provider?: string
          payment_review_note?: string | null
          payment_status?: string
          payment_verified_at?: string | null
          payment_verified_by?: string | null
          phone: string
          postal_code?: string | null
          shipping_carrier?: string | null
          shipping_total?: number
          status?: string
          subtotal?: number
          total?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
        }
        Update: {
          address_line?: string
          ambassador_code?: string | null
          city?: string
          coupon_code?: string | null
          created_at?: string
          currency?: string
          discount_total?: number
          district?: string
          email?: string
          full_name?: string
          id?: string
          internal_note?: string | null
          note?: string | null
          order_number?: string
          payment_method?: string | null
          payment_proof_path?: string | null
          payment_proof_uploaded_at?: string | null
          payment_provider?: string
          payment_review_note?: string | null
          payment_status?: string
          payment_verified_at?: string | null
          payment_verified_by?: string | null
          phone?: string
          postal_code?: string | null
          shipping_carrier?: string | null
          shipping_total?: number
          status?: string
          subtotal?: number
          total?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      price_history: {
        Row: {
          book_id: string
          changed_by: string | null
          created_at: string
          id: string
          new_price: number
          old_price: number | null
          reason: string | null
        }
        Insert: {
          book_id: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_price: number
          old_price?: number | null
          reason?: string | null
        }
        Update: {
          book_id?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_price?: number
          old_price?: number | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_history_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          locale: string
          newsletter_opt_in: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          locale?: string
          newsletter_opt_in?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          locale?: string
          newsletter_opt_in?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          ends_at: string | null
          id: string
          is_active: boolean
          max_discount: number | null
          min_cart_total: number
          starts_at: string | null
          usage_limit: number | null
          used_count: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          max_discount?: number | null
          min_cart_total?: number
          starts_at?: string | null
          usage_limit?: number | null
          used_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          max_discount?: number | null
          min_cart_total?: number
          starts_at?: string | null
          usage_limit?: number | null
          used_count?: number
        }
        Relationships: []
      }
      publishers: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      purchase_order_items: {
        Row: {
          book_id: string | null
          id: string
          purchase_order_id: string
          quantity: number
          received_qty: number
          unit_cost: number
        }
        Insert: {
          book_id?: string | null
          id?: string
          purchase_order_id: string
          quantity: number
          received_qty?: number
          unit_cost?: number
        }
        Update: {
          book_id?: string | null
          id?: string
          purchase_order_id?: string
          quantity?: number
          received_qty?: number
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string
          currency: string
          expected_at: string | null
          fx_rate: number
          id: string
          notes: string | null
          po_number: string
          status: string
          supplier_id: string | null
          total_cost: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          expected_at?: string | null
          fx_rate?: number
          id?: string
          notes?: string | null
          po_number?: string
          status?: string
          supplier_id?: string | null
          total_cost?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          expected_at?: string | null
          fx_rate?: number
          id?: string
          notes?: string | null
          po_number?: string
          status?: string
          supplier_id?: string | null
          total_cost?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          book_id: string
          comment: string | null
          created_at: string
          id: string
          is_approved: boolean
          rating: number
          title: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          comment?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          rating: number
          title?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          rating?: number
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          category: string
          key: string
          label: string
          updated_at: string
          value: string
        }
        Insert: {
          category?: string
          key: string
          label: string
          updated_at?: string
          value: string
        }
        Update: {
          category?: string
          key?: string
          label?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          group_name: string
          key: string
          kind: string
          label: string
          sort_order: number
          updated_at: string
          value_en: string
          value_fr: string
          value_tr: string
        }
        Insert: {
          group_name?: string
          key: string
          kind?: string
          label: string
          sort_order?: number
          updated_at?: string
          value_en?: string
          value_fr?: string
          value_tr?: string
        }
        Update: {
          group_name?: string
          key?: string
          kind?: string
          label?: string
          sort_order?: number
          updated_at?: string
          value_en?: string
          value_fr?: string
          value_tr?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          city: string | null
          contact_name: string | null
          country: string | null
          created_at: string
          currency: string
          discount_pct: number
          email: string | null
          id: string
          is_active: boolean
          lead_time_days: number
          moq: number
          name: string
          notes: string | null
          payment_terms: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          discount_pct?: number
          email?: string | null
          id?: string
          is_active?: boolean
          lead_time_days?: number
          moq?: number
          name: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          discount_pct?: number
          email?: string | null
          id?: string
          is_active?: boolean
          lead_time_days?: number
          moq?: number
          name?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          book_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "tech"
        | "finance"
        | "inventory"
        | "support"
        | "marketing"
        | "customer"
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
      app_role: [
        "super_admin",
        "tech",
        "finance",
        "inventory",
        "support",
        "marketing",
        "customer",
      ],
    },
  },
} as const
