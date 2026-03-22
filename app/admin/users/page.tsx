export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-light italic text-ivory">
        Users
      </h1>
      <p className="mt-3 max-w-lg font-body text-sm text-ivory-muted">
        User listing and role management can be added here. Promote an account to
        admin in Supabase:{" "}
        <code className="rounded bg-obsidian-light/80 px-1.5 py-0.5 text-xs text-gold">
          UPDATE users SET role = &apos;admin&apos; WHERE email = &apos;…&apos;;
        </code>
      </p>
    </div>
  );
}
