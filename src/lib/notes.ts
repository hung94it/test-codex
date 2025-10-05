import { cache } from "react";
import { db } from "./db";
import { noteFiltersSchema, noteFormSchema, noteUpdateSchema } from "./validators";

interface GetNotesOptions {
  query?: string;
  archived?: boolean;
}

export const getNotes = cache(async (userId: string, options: GetNotesOptions = {}) => {
  const filters = noteFiltersSchema.parse(options);
  return db.note.findMany({
    where: {
      userId,
      deletedAt: null,
      archived: filters.archived ?? false,
      ...(filters.query
        ? {
            OR: [
              { title: { contains: filters.query, mode: "insensitive" } },
              { content: { contains: filters.query, mode: "insensitive" } }
            ]
          }
        : {})
    },
    orderBy: [
      { pinnedAt: "desc" },
      { updatedAt: "desc" }
    ],
    include: {
      tags: {
        include: { tag: true }
      }
    }
  });
});

export async function createNote(userId: string, data: unknown) {
  const parsed = noteFormSchema.parse(data);
  return db.note.create({
    data: {
      ...parsed,
      userId,
      tags: {
        create: parsed.tags.map((tag) => ({
          tag: {
            connectOrCreate: {
              where: { name_userId: { name: tag, userId } },
              create: { name: tag, userId }
            }
          }
        }))
      }
    },
    include: {
      tags: {
        include: { tag: true }
      }
    }
  });
}

export async function setPinned(userId: string, noteId: string, pinned: boolean) {
  return db.note.update({
    where: { id: noteId, userId },
    data: {
      pinnedAt: pinned ? new Date() : null
    }
  });
}

export async function setArchived(userId: string, noteId: string, archived: boolean) {
  return db.note.update({
    where: { id: noteId, userId },
    data: {
      archived,
      pinnedAt: archived ? null : undefined
    }
  });
}

export async function softDeleteNote(userId: string, noteId: string) {
  return db.note.update({
    where: { id: noteId, userId },
    data: {
      deletedAt: new Date(),
      pinnedAt: null
    }
  });
}

export async function updateNote(userId: string, noteId: string, data: unknown) {
  const parsed = noteUpdateSchema.parse(data);

  return db.note.update({
    where: { id: noteId, userId },
    data: {
      title: parsed.title,
      content: parsed.content,
      archived: parsed.archived,
      pinnedAt: parsed.archived !== undefined && parsed.archived ? null : undefined,
      tags:
        parsed.tags !== undefined
          ? {
              deleteMany: {},
              create: parsed.tags.map((tag) => ({
                tag: {
                  connectOrCreate: {
                    where: { name_userId: { name: tag, userId } },
                    create: { name: tag, userId }
                  }
                }
              }))
            }
          : undefined
    },
    include: {
      tags: {
        include: { tag: true }
      }
    }
  });
}
