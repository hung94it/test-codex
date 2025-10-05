"use client";

import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { NoteFormValues, noteFormSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { TagInput } from "./tag-input";
import { TextEditor } from "./text-editor";

interface NoteComposerProps {
  action: (formData: FormData) => Promise<void>;
}

export function NoteComposer({ action }: NoteComposerProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      archived: false
    }
  });
  const [autosaveMessage, setAutosaveMessage] = useState<string | null>(null);
  const autosaveTimer = useRef<number | undefined>(undefined);

  async function handleSubmit(values: NoteFormValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    startTransition(() => {
      action(formData)
        .then(() => {
          setAutosaveMessage("Autosave enabled");
          toast.success("Note created");
          form.reset();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to create note");
        });
    });
  }

  return (
    <form
      className="space-y-4 rounded-lg border bg-card p-4 shadow-sm"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className="flex flex-col gap-2">
        <Input placeholder="Note title" {...form.register("title")} />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
        )}
      </div>
      <TextEditor
        value={form.watch("content")}
        onChange={(value) => {
          form.setValue("content", value, { shouldDirty: true, shouldValidate: true });
          setAutosaveMessage("Saving...");
          if (autosaveTimer.current) {
            clearTimeout(autosaveTimer.current);
          }
          autosaveTimer.current = window.setTimeout(() => setAutosaveMessage("All changes saved"), 1200);
        }}
      />
      <TagInput
        tags={form.watch("tags")}
        onChange={(tags) => form.setValue("tags", tags, { shouldDirty: true })}
      />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>{autosaveMessage ?? "Autosave enabled"}</p>
        <div className="space-x-2">
          <Button type="reset" variant="outline" onClick={() => form.reset()} disabled={isPending}>
            Clear
          </Button>
          <Button type="submit" disabled={isPending} className={cn(isPending && "opacity-80")}> 
            {isPending ? "Saving" : "Add note"}
          </Button>
        </div>
      </div>
    </form>
  );
}
