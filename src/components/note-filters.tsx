"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { noteFiltersSchema } from "@/lib/validators";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface NoteFiltersProps {
  activeFilters: {
    query?: string;
    archived?: boolean;
  };
}

export function NoteFilters({ activeFilters }: NoteFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(activeFilters.query ?? "");

  const params = useMemo(() => new URLSearchParams(searchParams?.toString()), [searchParams]);

  useEffect(() => {
    setQuery(activeFilters.query ?? "");
  }, [activeFilters.query]);

  function updateFilters(filters: Partial<NoteFiltersProps["activeFilters"]>) {
    const merged = noteFiltersSchema.parse({ ...activeFilters, ...filters });
    params.delete("query");
    params.delete("archived");
    if (merged.query) {
      params.set("query", merged.query);
    }
    if (merged.archived) {
      params.set("archived", String(merged.archived));
    }
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-background p-3">
      <Input
        placeholder="Search notes"
        value={query}
        onChange={(event) => {
          const value = event.target.value;
          setQuery(value);
          updateFilters({ query: value || undefined });
        }}
        className="max-w-xs"
      />
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Archived</span>
        <Button
          type="button"
          variant={activeFilters.archived ? "default" : "outline"}
          onClick={() => updateFilters({ archived: !activeFilters.archived })}
        >
          {activeFilters.archived ? "Showing" : "Hidden"}
        </Button>
      </div>
    </div>
  );
}
