// Database entity types — the exact row shapes of the Postgres schema defined in
// `supabase/migrations/`. Column names are snake_case to match Postgres; the
// application maps these to the camelCase domain types in `src/types/board.ts`.
//
// The `Database` type parametrises the Supabase clients (`createClient<Database>()`)
// so `.from("boards")` queries are fully typed end to end.
//
// These are `type` aliases, not `interface`s, on purpose: the Supabase client
// generics require each row shape to be assignable to `Record<string, unknown>`,
// and TypeScript only grants that implicit index signature to type aliases.

export type BoardRow = {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type BoardInsert = {
  id?: string;
  owner_id: string;
  title: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type BoardUpdate = {
  title?: string;
  description?: string | null;
  updated_at?: string;
};

export type Database = {
  public: {
    Tables: {
      boards: {
        Row: BoardRow;
        Insert: BoardInsert;
        Update: BoardUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
