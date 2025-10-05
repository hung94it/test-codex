import { auth } from "@/lib/auth";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { createNote, getNotes, setArchived, setPinned, softDeleteNote, updateNote } from "@/lib/notes";
import { noteFiltersSchema } from "@/lib/validators";
import { NoteComposer } from "./note-composer";
import { NoteItem } from "./note-item";
import { NoteFilters } from "./note-filters";

interface NoteListProps {
  filters: {
    query?: string;
    archived?: boolean;
  };
}

export async function NoteList({ filters }: NoteListProps) {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const parsedFilters = noteFiltersSchema.parse(filters);
  const notes = await getNotes(session.user.id, parsedFilters);

  async function handleCreateNote(formData: FormData) {
    "use server";
    const rawTitle = formData.get("title");
    const rawContent = formData.get("content");
    if (typeof rawTitle !== "string" || typeof rawContent !== "string") {
      throw new Error("Invalid payload");
    }
    const payload = {
      title: rawTitle,
      content: rawContent,
      tags: JSON.parse((formData.get("tags") as string) ?? "[]"),
      archived: formData.get("archived") === "true"
    };

    await createNote(session.user.id!, payload);
    revalidatePath("/notes");
  }

  async function togglePin(formData: FormData) {
    "use server";
    const rawId = formData.get("noteId");
    if (typeof rawId !== "string") {
      throw new Error("Invalid note identifier");
    }
    const noteId = rawId;
    const nextPinned = formData.get("pinned") === "true";
    await setPinned(session.user.id, noteId, nextPinned);
    revalidatePath("/notes");
  }

  async function toggleArchive(formData: FormData) {
    "use server";
    const rawId = formData.get("noteId");
    if (typeof rawId !== "string") {
      throw new Error("Invalid note identifier");
    }
    const noteId = rawId;
    const archived = formData.get("archived") === "true";
    await setArchived(session.user.id, noteId, archived);
    revalidatePath("/notes");
  }

  async function deleteNote(formData: FormData) {
    "use server";
    const rawId = formData.get("noteId");
    if (typeof rawId !== "string") {
      throw new Error("Invalid note identifier");
    }
    const noteId = rawId;
    await softDeleteNote(session.user.id, noteId);
    revalidatePath("/notes");
  }

  async function editNote(formData: FormData) {
    "use server";
    const rawId = formData.get("noteId");
    if (typeof rawId !== "string") {
      throw new Error("Invalid note identifier");
    }
    const payloadRaw = formData.get("payload");
    const payload = typeof payloadRaw === "string" ? JSON.parse(payloadRaw) : {};
    await updateNote(session.user.id, rawId, payload);
    revalidatePath("/notes");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Create a note</h2>
            <p className="text-sm text-muted-foreground">Autosave keeps everything synced.</p>
          </div>
          <Link className="text-sm text-muted-foreground hover:text-foreground" href="/tags">
            Manage tags
          </Link>
        </div>
        <NoteFilters activeFilters={parsedFilters} />
      </div>
      <NoteComposer action={handleCreateNote} />
      <div className="grid gap-4 md:grid-cols-2">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onPinToggle={togglePin}
            onArchiveToggle={toggleArchive}
            onDelete={deleteNote}
            onEdit={editNote}
          />
        ))}
        {notes.length === 0 && (
          <p className="rounded-md border border-dashed p-6 text-center text-muted-foreground">
            No notes yet. Start by adding a new one above.
          </p>
        )}
      </div>
    </div>
  );
}
