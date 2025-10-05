import type { Note, NoteTag, Tag } from "@prisma/client";

export type NoteWithRelations = Note & {
  tags: (NoteTag & { tag: Tag })[];
};
