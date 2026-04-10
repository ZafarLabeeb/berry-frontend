import type { PropsWithChildren } from 'react';

import { motion } from 'framer-motion';

export function AppShell({ children }: PropsWithChildren): JSX.Element {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-forest-glow" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[8%] top-16 h-72 w-72 rounded-full bg-forest-400/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[8%] top-28 h-80 w-80 rounded-full bg-berry-500/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-forest-500/8 via-white/4 to-berry-500/8 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-8 rounded-[32px] border border-white/8 bg-surface/70 px-6 py-7 shadow-soft backdrop-blur-2xl text-center"
        >
          <div className="mx-auto max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-forest-100">
              <span className="inline-flex h-2 w-2 rounded-full bg-forest-300" aria-hidden="true" />
              Salla, Finland
            </div>
            <div className="space-y-3">
              <h1 className="font-display text-4xl leading-none tracking-tight text-white sm:text-5xl">
                SallaBerry
              </h1>
              <p className="text-sm leading-7 text-mutedForeground sm:text-base">
                Upload a photo of forest or soil and discover which wild berries grow there.
                Explore berry picking locations in Salla, Finland on an interactive map.
              </p>
            </div>
          </div>
        </motion.header>

        <main className="flex-1">{children}</main>

        <footer className="mt-10 text-center text-xs text-mutedForeground/60">
          <p>SallaBerry &copy; {new Date().getFullYear()} &middot; Built for berry lovers in Lapland</p>
        </footer>
      </div>
    </div>
  );
}
