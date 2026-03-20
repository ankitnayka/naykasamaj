import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./admin.module.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
    redirect("/admin/login");
  }

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Nayka Admin</div>
        <nav className={styles.nav}>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/users">User Approvals</Link>
          <Link href="/admin/media">Media Archive</Link>
          <Link href="/admin/news">Manage News</Link>
          <Link href="/admin/events">Manage Events</Link>
          <Link href="/admin/schemes">Schemes & Grants</Link>
          <Link href="/admin/jobs">Jobs & Skills</Link>
          <Link href="/admin/contact">Contact Inbox</Link>
          <Link href="/admin/adi-haat">Adi Haat Artisan Hub</Link>
        </nav>
        <div className={styles.userBox}>
          <div>Admin: {session.user.name}</div>
          <Link href="/api/auth/signout" className={styles.logoutBtn}>Sign out</Link>
        </div>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
