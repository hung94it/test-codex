import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createNote, getNotes } from "@/lib/notes";
import { searchParamsSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filters = searchParamsSchema.parse({
    query: searchParams.get("query") ?? undefined,
    archived: searchParams.get("archived") ?? undefined
  });

  const notes = await getNotes(session.user.id, filters);
  return NextResponse.json(notes);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const note = await createNote(session.user.id, payload);
  return NextResponse.json(note, { status: 201 });
}
