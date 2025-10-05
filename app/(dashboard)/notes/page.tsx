import { Suspense } from "react";
import { NoteList } from "@/components/note-list";
import { NotesSkeleton } from "@/components/skeletons";
import { searchParamsSchema } from "@/lib/validators";

interface NotesPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function NotesPage({ searchParams }: NotesPageProps) {
  const filters = searchParamsSchema.parse({
    query: typeof searchParams.query === "string" ? searchParams.query : undefined,
    archived: typeof searchParams.archived === "string" ? searchParams.archived : undefined
  });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Your notes</h1>
        <p className="text-muted-foreground">Search, tag and pin your ideas.</p>
      </header>
      <Suspense fallback={<NotesSkeleton />}>
        {/* @ts-expect-error Async Server Component */}
        <NoteList filters={filters} />
      </Suspense>
    </main>
  );
}
