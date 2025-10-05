"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { NoteWithRelations } from "@/types";
import { NoteFormValues, noteFormSchema } from "@/lib/validators";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { TagInput } from "./tag-input";
import { TextEditor } from "./text-editor";

interface NoteEditorProps {
  note: NoteWithRelations;
  onSubmit: (formData: FormData) => Promise<void>;
  onClose: () => void;
}

export function NoteEditor({ note, onSubmit, onClose }: NoteEditorProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: note.title,
      content: note.content,
      tags: note.tags.map(({ tag }) => tag.name),
      archived: note.archived
    }
  });

  function handleSubmit(values: NoteFormValues) {
    const formData = new FormData();
    formData.set("noteId", note.id);
    formData.set("payload", JSON.stringify(values));

    startTransition(() => {
      onSubmit(formData)
        .then(() => {
          toast.success("Note updated");
          onClose();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to update note");
        });
    });
  }

  return (
    <form className="space-y-4 rounded-md border bg-muted/30 p-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor={`title-${note.id}`}>
          Title
        </label>
        <Input id={`title-${note.id}`} {...form.register("title")} />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Content</label>
        <TextEditor
          value={form.watch("content")}
          onChange={(value) => form.setValue("content", value, { shouldDirty: true, shouldValidate: true })}
        />
      </div>
      <input type="hidden" {...form.register("archived")} />
      <TagInput
        tags={form.watch("tags") ?? []}
        onChange={(tags) => form.setValue("tags", tags, { shouldDirty: true })}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
