import { describe, expect, it } from "vitest";
import { noteFiltersSchema, noteFormSchema, noteUpdateSchema } from "@/lib/validators";

describe("noteFormSchema", () => {
  it("accepts minimal valid payload", () => {
    const result = noteFormSchema.parse({
      title: "Test",
      content: "<p>Hello</p>",
      tags: ["work"],
      archived: false
    });

    expect(result.title).toBe("Test");
  });

  it("rejects empty title", () => {
    expect(() => noteFormSchema.parse({ title: "", content: "", tags: [], archived: false })).toThrow();
  });
});

describe("noteFiltersSchema", () => {
  it("allows optional fields", () => {
    expect(noteFiltersSchema.parse({})).toEqual({});
    expect(noteFiltersSchema.parse({ archived: true })).toEqual({ archived: true });
  });
});

describe("noteUpdateSchema", () => {
  it("accepts partial updates", () => {
    const parsed = noteUpdateSchema.parse({ title: "Updated" });
    expect(parsed.title).toBe("Updated");
  });
});
