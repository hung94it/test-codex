"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [value, setValue] = useState("");

  function addTag(tag: string) {
    const next = Array.from(new Set([...tags, tag]));
    onChange(next);
    setValue("");
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm">
            {tag}
            <button
              type="button"
              className="inline-flex rounded-full p-1 text-muted-foreground hover:text-foreground"
              onClick={() => onChange(tags.filter((item) => item !== tag))}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={value}
          placeholder="Add a tag"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && value.trim()) {
              event.preventDefault();
              addTag(value.trim());
            }
          }}
        />
        <Button type="button" variant="outline" onClick={() => value.trim() && addTag(value.trim())}>
          Add
        </Button>
      </div>
    </div>
  );
}
