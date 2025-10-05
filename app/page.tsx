import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Memo</p>
        <h1 className="text-4xl font-bold sm:text-5xl">Capture ideas instantly</h1>
        <p className="text-lg text-muted-foreground">
          Rich text notes, lightning fast search and automatic syncing across your devices.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground" href="/notes">
          Open your workspace
        </Link>
        <Link className="rounded-md border border-border px-4 py-2 font-medium" href="/auth/sign-in">
          Sign in
        </Link>
      </div>
    </main>
  );
}
