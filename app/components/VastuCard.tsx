import React from 'react';

const CIRC = 339.29;

const THEME = {
  high: { stroke: "#10b981", badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-500/30" },
  mid:  { stroke: "#f59e0b", badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-amber-200 dark:ring-amber-500/30" },
  low:  { stroke: "#ef4444", badge: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 ring-red-200 dark:ring-red-500/30" }
};

const ICON = {
  check: <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd"/></svg>,
  warn: <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M8.26 3.1c.77-1.33 2.71-1.33 3.48 0l6.22 10.8c.77 1.33-.19 3-1.74 3H3.78c-1.55 0-2.51-1.67-1.74-3L8.26 3.1zM10 7a1 1 0 00-1 1v3a1 1 0 102 0V8a1 1 0 00-1-1zm0 7.5a1.1 1.1 0 100-2.2 1.1 1.1 0 000 2.2z" clipRule="evenodd"/></svg>,
  pin: <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M10 18s6-5.4 6-10a6 6 0 10-12 0c0 4.6 6 10 6 10zm0-7.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd"/></svg>
};

interface VastuData {
  score: number;
  label: string;
  facing: string;
  entrance: string;
  hall: string;
  masterBedroom: string;
  kitchen: string;
  toilet: string;
  positives: string[];
  doshas: string[];
}

export default function VastuCard({ data }: { data: VastuData }) {
  if (!data || data.score === undefined || data.score === null) return null; 

  const band = data.score >= 4 ? "high" : data.score >= 2.5 ? "mid" : "low";
  const t = THEME[band as keyof typeof THEME];
  const off = (CIRC * (1 - data.score / 5)).toFixed(2);

  const room = (name: string, dir: string) => (
    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5">
      <dt className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">{name}</dt>
      <dd className="text-xs font-semibold">{dir || "N/A"}</dd>
    </div>
  );

  return (
    <article className="flex flex-col rounded-3xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-slate-200 dark:ring-gray-700 overflow-hidden mt-8">
      <header className="flex items-start justify-between gap-3 px-5 sm:px-6 pt-5 sm:pt-6">
        <div className="min-w-0">
          <h2 className="text-lg font-bold leading-snug text-gray-900 dark:text-white">Vastu Analysis</h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            {ICON.pin}<span className="truncate">Detailed Vastu compliance report</span>
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${t.badge}`}>
          {data.label}
        </span>
      </header>

      <div className="flex flex-col sm:flex-row items-center gap-4 px-5 sm:px-6 pt-5">
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" strokeWidth="10" className="stroke-slate-200 dark:stroke-slate-700"/>
            <circle cx="60" cy="60" r="54" fill="none" stroke={t.stroke} strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={CIRC} strokeDashoffset={off} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex items-baseline text-gray-900 dark:text-white">
              <span className="text-4xl font-extrabold tracking-tight">{data.score.toFixed(1)}</span>
              <span className="ml-0.5 text-sm font-semibold text-slate-400">/5</span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Vastu</span>
          </div>
        </div>

        <dl className="grid flex-1 grid-cols-2 sm:grid-cols-3 gap-1.5 w-full">
          {room("Facing", data.facing)}
          {room("Entrance", data.entrance)}
          {room("Hall", data.hall)}
          {room("Master Bed", data.masterBedroom)}
          {room("Kitchen", data.kitchen)}
          {room("Toilet", data.toilet)}
        </dl>
      </div>

      <div className="space-y-5 px-5 sm:px-6 py-5">
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Top Positive Features</h3>
          {data.positives && data.positives.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.positives.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-500/10 ring-1 ring-emerald-100 dark:ring-emerald-500/20 p-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">{ICON.check}</span>
                  <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">{f}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-sm text-slate-500">No rooms are aligned with Vastu guidelines.</p>
          )}
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Vastu Warnings (Doshas)</h3>
          {data.doshas && data.doshas.length > 0 ? (
            <ul className="space-y-2">
              {data.doshas.map((d, i) => {
                const severe = /severe|highly inauspicious/i.test(d);
                const cls = severe
                  ? "bg-red-50 dark:bg-red-500/10 ring-red-200 dark:ring-red-500/30 text-red-900 dark:text-red-200"
                  : "bg-amber-50 dark:bg-amber-500/10 ring-amber-200 dark:ring-amber-500/30 text-amber-900 dark:text-amber-200";
                return (
                  <li key={i} className={`flex items-start gap-2.5 rounded-xl ring-1 p-2.5 ${cls}`}>
                    <span className={`mt-0.5 shrink-0 ${severe ? "text-red-600" : "text-amber-600"}`}>{ICON.warn}</span>
                    <span className="text-sm font-medium">{d}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="flex items-center gap-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-500/10 ring-1 ring-emerald-100 dark:ring-emerald-500/20 p-3 text-sm font-medium text-emerald-800 dark:text-emerald-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">{ICON.check}</span>None. Property is highly compliant.
            </p>
          )}
        </section>
      </div>
    </article>
  );
}