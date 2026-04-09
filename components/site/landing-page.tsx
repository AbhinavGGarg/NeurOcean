"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  FlaskConical,
  LineChart,
  Orbit,
  PlayCircle,
  Sparkles,
  Telescope,
  Waves
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Atmosphere } from "@/components/site/atmosphere";
import { SiteNavbar } from "@/components/site/navbar";
import { Reveal } from "@/components/site/reveal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp, softScaleIn, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

const featureCards = [
  {
    title: "Simulate Ecosystems",
    body: "Configure thermal stress, chemistry, biodiversity, and intervention readiness before each run.",
    icon: Waves
  },
  {
    title: "AI Learns In Real Time",
    body: "A reinforcement-learning agent evaluates reef stressors, selects actions, and adapts policy per cycle.",
    icon: BrainCircuit
  },
  {
    title: "Discover Recovery Strategies",
    body: "Track reward patterns, survival confidence, and intervention efficiency to uncover winning pathways.",
    icon: LineChart
  }
];

const steps = [
  {
    title: "Configure Reef",
    body: "Tune environment variables and scenario pressure before execution.",
    icon: FlaskConical
  },
  {
    title: "Run AI Experiment",
    body: "Observe each cycle as the agent evaluates rewards and updates policy.",
    icon: Orbit
  },
  {
    title: "Analyze & Improve",
    body: "Review discoveries, compare interventions, and iterate toward resilience.",
    icon: Telescope
  }
];

const metrics = [
  { label: "Policy Iterations", value: 1450, suffix: "+" },
  { label: "Avg Recovery Lift", value: 37, suffix: "%" },
  { label: "Experiment Scenarios", value: 96, suffix: "" },
  { label: "Breakthrough Signals", value: 28, suffix: "" }
];

function CountUp({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 900;
    const start = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setDisplay(Math.round(progress * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function LandingPage() {
  return (
    <div className="relative">
      <Atmosphere />
      <SiteNavbar />

      <main className="relative z-10">
        <section id="home" className="container flex min-h-screen flex-col justify-center pb-14 pt-32">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]"
          >
            <motion.div variants={fadeInUp} className="space-y-8">
              <Badge className="border-seafoam-300/45 bg-seafoam-300/10 text-seafoam-300">AI Coral Research Platform</Badge>
              <div className="space-y-6">
                <h1 className="text-balance text-5xl font-semibold leading-[1.02] text-slate-50 sm:text-6xl xl:text-7xl">
                  Neurocean
                  <span className="mt-2 block bg-gradient-to-r from-ocean-200 via-seafoam-300 to-indigo-500 bg-clip-text text-transparent">
                    Neural intelligence for living reefs.
                  </span>
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl">
                  Design reef conditions and watch an adaptive AI agent learn how to restore ecosystem resilience in real time.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/lab" className={cn(buttonVariants({ size: "lg" }), "group") }>
                  Start Experiment
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link href="#what" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                  Learn More
                </Link>
              </div>

              <div className="grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                {metrics.map((metric) => (
                  <Card key={metric.label} className="border-white/15 bg-white/[0.06]">
                    <CardContent className="p-4">
                      <p className="text-xl font-semibold text-slate-50">
                        <CountUp value={metric.value} suffix={metric.suffix} />
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{metric.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            <motion.div variants={softScaleIn} className="relative">
              <div className="absolute -left-10 top-14 h-40 w-40 rounded-full bg-ocean-400/20 blur-3xl" />
              <div className="absolute -right-8 bottom-8 h-44 w-44 rounded-full bg-seafoam-400/20 blur-3xl" />

              <Card className="glow-outline sheen relative overflow-hidden rounded-[30px] border-ocean-200/25 bg-gradient-to-b from-[#10223f]/85 to-[#081427]/90">
                <CardContent className="relative p-8 sm:p-10">
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Live Neural Current</p>
                      <p className="mt-1 text-xl font-medium text-slate-100">Adaptive Reef Forecast</p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-seafoam-300/40 bg-seafoam-300/10 px-3 py-1 text-xs text-seafoam-200">
                      <span className="h-2 w-2 animate-pulseSoft rounded-full bg-seafoam-300" />
                      active
                    </span>
                  </div>

                  <div className="space-y-4">
                    {["Thermal Stress", "Calcification", "Biodiversity", "Bleaching Risk"].map((item, index) => (
                      <div key={item} className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-slate-300">
                          <span>{item}</span>
                          <span>{["moderate", "stable", "rising", "contained"][index]}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-ocean-300 via-seafoam-300 to-indigo-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${[68, 54, 73, 44][index]}%` }}
                            transition={{ duration: 1, delay: index * 0.14 + 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Reef Health</p>
                      <p className="mt-2 text-3xl font-semibold text-slate-50">81.2</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Survival Prob.</p>
                      <p className="mt-2 text-3xl font-semibold text-seafoam-300">92%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        <section id="what" className="container py-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-ocean-300">What Neurocean Delivers</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-50 sm:text-4xl">A live AI research system for coral resilience</h2>
            <p className="mt-4 text-slate-300">
              Designed for rapid hypothesis testing, policy adaptation, and interpretable intervention planning.
            </p>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-12 grid gap-5 md:grid-cols-3"
          >
            {featureCards.map((feature) => (
              <motion.div key={feature.title} variants={softScaleIn}>
                <Card className="group h-full overflow-hidden border-white/15 bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:border-ocean-300/50 hover:bg-white/[0.09]">
                  <CardContent className="p-6">
                    <feature.icon className="h-8 w-8 text-ocean-200 transition group-hover:text-seafoam-300" />
                    <h3 className="mt-5 text-xl font-medium text-slate-50">{feature.title}</h3>
                    <p className="mt-3 leading-relaxed text-slate-300">{feature.body}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section id="flow" className="container py-24">
          <Reveal className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-ocean-300">How It Works</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-50 sm:text-4xl">Run your experiment loop in three steps</h2>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-5 md:grid-cols-3"
          >
            {steps.map((step, index) => (
              <motion.div key={step.title} variants={fadeInUp}>
                <Card className="h-full border-white/15 bg-gradient-to-b from-white/[0.09] to-white/[0.04]">
                  <CardContent className="space-y-4 p-6">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ocean-200/40 bg-ocean-300/10 text-sm font-semibold text-ocean-200">
                      {index + 1}
                    </span>
                    <step.icon className="h-7 w-7 text-seafoam-300" />
                    <h3 className="text-lg font-medium text-slate-100">{step.title}</h3>
                    <p className="text-slate-300">{step.body}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="container py-24">
          <Reveal>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-ocean-300">Live Preview</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-50 sm:text-4xl">Watch the reef evolve as AI adapts</h2>
              </div>
              <Link href="/lab" className={buttonVariants({ variant: "secondary" })}>
                Enter Lab
              </Link>
            </div>
          </Reveal>

          <Reveal className="mt-8">
            <Card className="relative overflow-hidden rounded-[28px] border-ocean-100/20 bg-[#051126]/75">
              <div className="absolute inset-0 bg-gradient-to-t from-[#020813] via-transparent to-transparent" />
              <div className="relative h-[560px] w-full overflow-hidden">
                <iframe
                  src="/legacy/lab"
                  title="Neurocean Lab Preview"
                  className="pointer-events-none absolute left-0 top-0 h-[980px] w-[1600px] origin-top-left scale-[0.57] opacity-80 md:scale-[0.74]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-950/65 via-transparent to-bg-950/65" />
                <div className="absolute inset-x-6 top-6 flex items-center justify-between rounded-2xl border border-white/15 bg-bg-900/70 px-4 py-3 backdrop-blur">
                  <span className="inline-flex items-center gap-2 text-sm text-seafoam-300">
                    <Activity className="h-4 w-4" /> Live Simulation Feed
                  </span>
                  <span className="text-sm text-slate-300">Adaptive cycle stream</span>
                </div>
                <div className="absolute bottom-6 left-6 max-w-sm rounded-2xl border border-white/15 bg-bg-900/70 p-4 backdrop-blur">
                  <p className="text-sm text-slate-200">
                    AI observes DHW stress, predicts bleaching risk, and recommends targeted interventions each cycle.
                  </p>
                </div>
              </div>
            </Card>
          </Reveal>
        </section>

        <section id="impact" className="container py-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-ocean-300">Why It Matters</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-50 sm:text-4xl">
              Reef collapse is accelerating. Strategy discovery cannot stay manual.
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Climate stress compounds faster than traditional field testing can iterate. Neurocean compresses discovery cycles so teams can evaluate interventions and prioritize resilient pathways sooner.
            </p>
          </Reveal>

          <div className="ocean-divider mt-12" />

          <Reveal className="mt-12">
            <Card className="rounded-[28px] border-ocean-200/30 bg-gradient-to-r from-[#0a1b33]/85 to-[#102646]/80 p-10 text-center">
              <Sparkles className="mx-auto h-10 w-10 text-seafoam-300" />
              <h3 className="mt-4 text-3xl font-semibold text-white">Start your first experiment</h3>
              <p className="mx-auto mt-3 max-w-xl text-slate-300">
                Enter the lab, configure your scenario, and watch an adaptive AI agent optimize reef recovery in real time.
              </p>
              <div className="mt-7 flex justify-center">
                <Link href="/lab" className={cn(buttonVariants({ size: "lg" }), "group") }>
                  Enter Lab
                  <PlayCircle className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </Card>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="container flex flex-col items-start justify-between gap-3 text-sm text-slate-400 sm:flex-row sm:items-center">
          <p>Neurocean · AI-powered coral reef simulation platform</p>
          <p>Built for adaptive ecosystem research</p>
        </div>
      </footer>
    </div>
  );
}
