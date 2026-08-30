// Domain types for Softboard. These mirror the database schema
// (see `supabase/migrations/`). Type-specific item payloads live in the
// `data` JSONB column and are validated in application code, not the DB.

export type ItemType = "note" | "page" | "image" | "link";

export type NoteBackground = "yellow" | "pink" | "blue" | "green" | "gray";

export interface NoteData {
  content: string;
  background: NoteBackground;
}

export interface PageData {
  title: string;
  content: string;
}

export interface ImageData {
  storagePath: string;
  alt?: string;
  naturalWidth?: number;
  naturalHeight?: number;
}

export interface LinkData {
  url: string;
  title?: string;
  description?: string;
}

export type ItemData = NoteData | PageData | ImageData | LinkData;

export interface Board {
  id: string;
  ownerId: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BoardItem<T extends ItemData = ItemData> {
  id: string;
  boardId: string;
  type: ItemType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  data: T;
  createdAt: string;
  updatedAt: string;
}

export interface Thread {
  id: string;
  boardId: string;
  sourceItemId: string;
  targetItemId: string;
  label: string | null;
  createdAt: string;
  updatedAt: string;
}
