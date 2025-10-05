import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { setPinned, softDeleteNote, updateNote } from "@/lib/notes";

interface RouteContext {
  params: {
    noteId: string;
  };
}

export async function GET(_: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const note = await db.note.findFirst({
    where: { id: context.params.noteId, userId: session.user.id, deletedAt: null },
    include: {
      tags: {
        include: { tag: true }
      }
    }
  });

  if (!note) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(note);
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  let mutated = false;
  let note = null;

  const { pinned, ...data } = payload ?? {};

  if (Object.keys(data).length > 0) {
    note = await updateNote(session.user.id, context.params.noteId, data);
    mutated = true;
  }

  if (typeof pinned === "boolean") {
    await setPinned(session.user.id, context.params.noteId, pinned);
    mutated = true;
    note = await db.note.findFirst({
      where: { id: context.params.noteId, userId: session.user.id },
      include: {
        tags: {
          include: { tag: true }
        }
      }
    });
  }

  if (!mutated) {
    return NextResponse.json({ error: "No changes" }, { status: 400 });
  }

  if (!note) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(note);
}

export async function DELETE(_: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await softDeleteNote(session.user.id, context.params.noteId);
  return NextResponse.json({ ok: true });
}
