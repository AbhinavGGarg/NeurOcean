"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  Compass,
  FlaskConical,
  Radar,
  Sparkles
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Atmosphere } from "@/components/site/atmosphere";
import { SiteNavbar } from "@/components/site/navbar";
import { Reveal } from "@/components/site/reveal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const runtimeStates = [
  "Initializing environment",
  "Running cycle",
  "Evaluating reward",
  "Updating policy",
  "Generating hypothesis"
];

const quickStats = [
  { label: "Scenario Difficulty", value: "Unstable", tone: "text-orange-300" },
  { label: "Predicted Survival", value: "88%", tone: "text-seafoam-300" },
  { label: "Policy Confidence", value: "0.83", tone: "text-ocean-200" }
];

export function LabPage() {
  const [stateIndex, setStateIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStateIndex((prev) => (prev + 1) % runtimeStates.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  const status = useMemo(() => runtimeStates[stateIndex], [stateIndex]);

  return (
    <div className="relative min-h-screen pb-14">
      <Atmosphere />
      <SiteNavbar />

      <main className="container relative z-10 pt-28">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge className="border-ocean-300/40 bg-ocean-300/10 text-ocean-200">Neurocean Lab</Badge>
              <h1 className="mt-3 text-4xl font-semibold text-slate-50 sm:text-5xl">Live AI Experiment Control Room</h1>
              <p className="mt-3 max-w-3xl text-slate-300">
                Configure conditions, watch the simulation evolve, and monitor agent reasoning as policy adapts per cycle.
              </p>
            </div>
            <Link href="/legacy/lab" target="_blank" className={cn(buttonVariants({ variant: "secondary" }), "group") }>
              Open Native Lab
              <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>

        <section className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_300px]">
          <Reveal>
            <Card className="h-full border-white/15 bg-white/[0.06]">
              <CardContent className="space-y-5 p-5">
                <h2 className="text-lg font-medium text-slate-100">System State</h2>

                <div className="rounded-2xl border border-seafoam-300/35 bg-seafoam-300/10 p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-seafoam-300">Live Status</p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={status}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      className="mt-2 text-lg font-medium text-seafoam-100"
                    >
                      {status}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div className="space-y-3">
                  {quickStats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-white/10 bg-bg-900/60 px-3 py-2">
                      <p className="text-xs text-slate-400">{stat.label}</p>
                      <p className={cn("mt-1 text-lg font-medium", stat.tone)}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-white/10 bg-bg-900/60 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Flow</p>
                  <ol className="mt-3 space-y-2 text-sm text-slate-300">
                    {runtimeStates.map((step, index) => (
                      <li key={step} className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            index === stateIndex ? "bg-seafoam-300" : "bg-slate-600"
                          )}
                        />
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal>
            <Card className="relative overflow-hidden rounded-[26px] border-ocean-200/25 bg-gradient-to-b from-[#07162f]/88 to-[#051124]/92">
              <div className="absolute inset-x-0 top-0 h-12 border-b border-white/10 bg-bg-900/70" />
              <div className="absolute left-4 top-3 flex items-center gap-2 text-sm text-slate-300">
                <Activity className="h-4 w-4 text-seafoam-300" />
                Live Simulation Feed
              </div>
              <div className="absolute right-4 top-2.5 flex items-center gap-2 rounded-full border border-seafoam-300/30 bg-seafoam-300/10 px-3 py-1 text-xs text-seafoam-200">
                <span className="h-2 w-2 animate-pulseSoft rounded-full bg-seafoam-300" /> running
              </div>

              <div className="relative mt-12 h-[760px] overflow-hidden">
                {!isLoaded && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg-950/80 backdrop-blur-sm">
                    <p className="text-sm text-slate-300">Loading simulation environment...</p>
                  </div>
                )}
                <iframe
                  src="/legacy/lab"
                  title="Neurocean Live Lab"
                  className="h-full w-full"
                  onLoad={() => setIsLoaded(true)}
                />
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <Card className="h-full border-white/15 bg-white/[0.06]">
              <CardContent className="space-y-5 p-5">
                <h2 className="text-lg font-medium text-slate-100">AI Reasoning Stream</h2>

                <div className="space-y-3">
                  {[
                    {
                      icon: Radar,
                      label: "Observing",
                      text: "Thermal variance rising near bleaching threshold; chemistry remains moderately stable."
                    },
                    {
                      icon: BrainCircuit,
                      label: "Evaluating",
                      text: "Reward projection favors shading + alkalinity blend under current DHW acceleration."
                    },
                    {
                      icon: Compass,
                      label: "Selecting",
                      text: "Applying intervention intensity 0.74 with adaptive exploration fallback."
                    },
                    {
                      icon: Sparkles,
                      label: "Predicting",
                      text: "Expected health delta +3.6 and improved survival probability in next 3 cycles."
                    }
                  ].map((entry, index) => (
                    <motion.div
                      key={entry.label}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.12, duration: 0.4 }}
                      className="rounded-xl border border-white/10 bg-bg-900/60 p-3"
                    >
                      <p className="inline-flex items-center gap-2 text-sm font-medium text-ocean-200">
                        <entry.icon className="h-4 w-4" />
                        {entry.label}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">{entry.text}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="rounded-xl border border-white/10 bg-bg-900/70 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Next Action</p>
                  <p className="mt-2 text-sm text-slate-200">
                    Run 5-cycle batch and compare intervention efficiency against current best reward path.
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs text-seafoam-300">
                    <FlaskConical className="h-3.5 w-3.5" /> Suggested experiment queued
                  </p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
