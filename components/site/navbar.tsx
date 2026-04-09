"use client";

import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const homeLinks = [
  { href: "#home", label: "Home" },
  { href: "#what", label: "Platform" },
  { href: "#flow", label: "Workflow" },
  { href: "#impact", label: "Impact" }
];

const labLinks = [
  { href: "/", label: "Home" },
  { href: "/lab", label: "Lab" }
];

export function SiteNavbar() {
  const pathname = usePathname();
  const isLab = pathname === "/lab";
  const links = useMemo(() => (isLab ? labLinks : homeLinks), [isLab]);

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-transparent transition-all",
        scrolled ? "border-white/10 bg-[#030a15]/78 backdrop-blur-2xl" : "bg-transparent"
      )}
      animate={{ height: scrolled ? 68 : 82 }}
      transition={{ type: "spring", stiffness: 210, damping: 28 }}
    >
      <div className="container flex h-full items-center justify-between">
        <Link
          href="/"
          className="group relative inline-flex items-center gap-2 text-lg font-semibold tracking-[0.08em] text-slate-100"
        >
          <span className="absolute inset-0 -z-10 rounded-full bg-ocean-300/10 blur-xl transition group-hover:bg-ocean-300/20" />
          <span className="h-2.5 w-2.5 animate-pulseSoft rounded-full bg-seafoam-300" />
          Neurocean
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const active = isLab ? pathname === link.href : false;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative text-sm text-slate-300 transition hover:text-white",
                  active && "text-white"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-ocean-300 to-seafoam-300 transition-all duration-300",
                    active ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!isLab && (
            <Link href="#what" className={buttonVariants({ variant: "secondary", size: "sm" })}>
              Learn More
            </Link>
          )}
          <Link href="/lab" className={buttonVariants({ size: "sm" })}>
            Start Experiment
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="inline-flex h-10 w-10 items-center justify-center p-0 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="border-t border-white/10 bg-[#040d1c]/95 p-4 backdrop-blur-xl md:hidden"
          >
            <div className="container space-y-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/lab" className={buttonVariants({ className: "w-full" })}>
                Start Experiment
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
