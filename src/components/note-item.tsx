"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import type { NoteWithRelations } from "@/types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { NoteEditor } from "./note-editor";

type ActionHandler = (formData: FormData) => Promise<void>;

interface NoteItemProps {
  note: NoteWithRelations;
  onPinToggle: ActionHandler;
  onArchiveToggle: ActionHandler;
  onDelete: ActionHandler;
  onEdit: ActionHandler;
}

export function NoteItem({ note, onPinToggle, onArchiveToggle, onDelete, onEdit }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <article className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{note.title}</h3>
          <p className="text-xs text-muted-foreground">
            Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </p>
        </div>
        <div className="flex gap-2 text-xs uppercase text-muted-foreground">
          {note.pinnedAt && <span className="text-primary">Pinned</span>}
          {note.archived && <span>Archived</span>}
        </div>
      </header>
      {isEditing ? (
        <NoteEditor note={note} onSubmit={onEdit} onClose={() => setIsEditing(false)} />
      ) : (
        <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: note.content }} />
      )}
      <footer className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {note.tags.map(({ tag }) => (
            <Badge key={tag.id} variant="secondary">
              #{tag.name}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {!isEditing && (
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
          <form action={onPinToggle}>
            <input type="hidden" name="noteId" value={note.id} />
            <input type="hidden" name="pinned" value={(!note.pinnedAt).toString()} />
            <Button type="submit" variant="outline" size="sm">
              {note.pinnedAt ? "Unpin" : "Pin"}
            </Button>
          </form>
          <form action={onArchiveToggle}>
            <input type="hidden" name="noteId" value={note.id} />
            <input type="hidden" name="archived" value={(!note.archived).toString()} />
            <Button type="submit" variant="outline" size="sm">
              {note.archived ? "Unarchive" : "Archive"}
            </Button>
          </form>
          <form action={onDelete}>
            <input type="hidden" name="noteId" value={note.id} />
            <Button type="submit" variant="destructive" size="sm">
              Delete
            </Button>
          </form>
        </div>
      </footer>
    </article>
  );
}
