import type { ReactNode } from "react";

import { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";
import { loadAdminDashboard } from "@/lib/members/admin-stats";
import { requireAdmin } from "@/lib/members/membership";

/** Admin-only and request-bound, like `/account`: blocking is the design. */
export const instant = false;

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const DATE = new Intl.DateTimeFormat("en-AU", { dateStyle: "medium", timeZone: "Australia/Sydney" });
const TIME = new Intl.DateTimeFormat("en-AU", { timeStyle: "short", timeZone: "Australia/Sydney" });

/** One label and value row in a stat block. */
function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="stat-row">
      <span className="lbl">{label}</span>
      <span className="val">{value}</span>
    </div>
  );
}

/** Stat block shell with an h2 heading. */
function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="stat-block">
      <h2>◆ {title}</h2>
      {children}
    </section>
  );
}

/** Explains why a panel has no numbers, using the rejection's message. */
function Unavailable({ reason }: { reason: unknown }) {
  const detail = reason instanceof Error ? reason.message : String(reason);
  return <p className="admin__note">Unavailable: {detail}</p>;
}

function money(cents: number, symbol: string): string {
  return `${symbol}${(cents / 100).toFixed(2)}`;
}

export default async function AdminPage() {
  await requireAdmin();

  const { now, users, subscriptions: subs, engagement } = await loadAdminDashboard();

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="lmp-container admin">
        <div className="section-head">
          <div className="section-head__title">
            <span className="num">SYS</span>
            <h1>ADMIN</h1>
          </div>
        </div>
        <p className="admin__note">
          Live from Clerk and the database at {TIME.format(now)}, {DATE.format(now)} (Sydney).
        </p>

        <div className="admin-grid">
          <Panel title="USERS">
            {users.status === "fulfilled" ? (
              <>
                <Row label="Total" value={users.value.total} />
                <Row label="New, last 7 days" value={users.value.last7Days} />
                <Row label="New, last 30 days" value={users.value.last30Days} />
              </>
            ) : (
              <Unavailable reason={users.reason} />
            )}
          </Panel>

          <Panel title="MEMBERSHIP">
            {subs.status === "fulfilled" ? (
              <>
                <Row label="Paying members" value={subs.value.paying} />
                {subs.value.byPlan.map((p) => (
                  <Row
                    key={p.plan}
                    label={p.plan}
                    value={`${p.monthly} monthly · ${p.annual} annual`}
                  />
                ))}
                <Row label="Free trials" value={subs.value.freeTrials} />
                <Row label="Past due" value={subs.value.pastDue} />
                <Row label="Cancelling at period end" value={subs.value.cancelling} />
                <Row label="Ended, last 30 days" value={subs.value.endedLast30Days} />
                <Row
                  label="Est. monthly revenue"
                  value={money(subs.value.monthlyRevenueCents, subs.value.currencySymbol)}
                />
              </>
            ) : (
              <Unavailable reason={subs.reason} />
            )}
          </Panel>

          <Panel title="ENGAGEMENT">
            {engagement.status === "fulfilled" ? (
              <>
                <Row label="Comments" value={engagement.value.comments} />
                <Row label="Comments, last 30 days" value={engagement.value.commentsLast30Days} />
                <Row label="People who commented" value={engagement.value.commenters} />
                <Row label="RSS feeds issued" value={engagement.value.rssFeeds} />
              </>
            ) : (
              <Unavailable reason={engagement.reason} />
            )}
          </Panel>

          <Panel title="NEWEST SIGN-UPS">
            {users.status === "fulfilled" ? (
              users.value.recent.length > 0 ? (
                users.value.recent.map((u) => (
                  <Row key={u.id} label={DATE.format(u.createdAt)} value={u.name} />
                ))
              ) : (
                <p className="admin__note">No users yet.</p>
              )
            ) : (
              <Unavailable reason={users.reason} />
            )}
          </Panel>
        </div>
      </main>
    </>
  );
}
