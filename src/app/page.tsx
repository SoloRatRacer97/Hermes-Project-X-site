"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, useInView } from "framer-motion";
import { siteConfig, ServiceItem, ReviewItem, PricingTier, GalleryImage } from "@/lib/config";
import {
  Wrench,
  ShieldCheck,
  Hammer,
  Zap,
  DollarSign,
  Award,
  Phone,
  Clock,
  ChevronRight,
  Star,
  Menu,
  LucideIcon,
  Quote,
  CheckCircle2,
  MapPin,
  Mail,
  BadgeCheck,
  ArrowRight,
  Globe,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ── Icon lookup ───────────────────────────────────────────────────────
const iconMap: Record<string, LucideIcon> = {
  Wrench,
  ShieldCheck,
  Hammer,
  Zap,
  DollarSign,
  Award,
  Phone,
  Clock,
  ChevronRight,
  Star,
  Menu,
  CheckCircle2,
  Quote,
  BadgeCheck,
  MapPin,
  Globe,
  Camera,
  ArrowRight,
};

// ── Animation helpers ────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SlideIn({ children, delay = 0, direction = "left", className = "" }: { children: React.ReactNode; delay?: number; direction?: "left" | "right"; className?: string }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: direction === "left" ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const staggerItem = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

// ── Contact Form State ──────────────────────────────────────────────
interface FormState {
  service: string;
  address: string;
  message: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  smsConsent: boolean;
  submitting: boolean;
  status: "idle" | "success" | "error";
  errorMessage: string;
  requestId: string;
}

// ── Star Rating ─────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < count ? "fill-accent text-accent" : "text-muted-foreground/20"}`}
        />
      ))}
    </div>
  );
}

// ── Service Card (upgraded) ──────────────────────────────────────────
function ServiceCard({ icon, title, description, backgroundImage, features }: ServiceItem) {
  const Icon = iconMap[icon] || Wrench;
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="block w-full cursor-pointer text-left"
          />
        }
      >
        <motion.div variants={staggerItem}>
          <Card className="group relative h-full overflow-hidden border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Background image */}
            <div className="relative h-36 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
              {/* Icon overlay */}
              <div className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-all group-hover:bg-accent group-hover:text-accent-foreground">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <CardHeader className="pb-1 pt-2">
              <h3 className="font-semibold text-base leading-snug">{title}</h3>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-accent transition-all group-hover:gap-1.5">
                Learn more <ChevronRight className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <p className="text-sm font-medium text-foreground">What&apos;s included:</p>
          <ul className="space-y-2">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <a href="#contact" className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl h-10 px-4 text-sm font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-all">
            Get a Free Estimate <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Review Card ────────────────────────────────────────────────────
function ReviewCard({ name, location, rating, text, avatar }: ReviewItem) {
  return (
    <motion.div variants={staggerItem}>
      <Card className="border-0 bg-card shadow-sm hover:shadow-md transition-shadow h-full">
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <Stars count={rating} />
            <Quote className="h-5 w-5 text-primary/10" />
          </div>
          <p className="text-sm leading-relaxed text-foreground/85">
            &ldquo;{text}&rdquo;
          </p>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  {avatar}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{location}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Pricing Card ─────────────────────────────────────────────────────
function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <motion.div variants={staggerItem} className="flex">
      <Card className={`relative border-0 shadow-sm transition-all duration-200 hover:shadow-lg flex flex-col w-full ${
        tier.highlighted ? "ring-2 ring-accent shadow-md" : ""
      }`}>
        {tier.highlighted && (
          <div className="absolute -top-3 inset-x-0 flex justify-center">
            <Badge className="bg-accent text-accent-foreground text-xs font-semibold shadow-sm">
              Most Popular
            </Badge>
          </div>
        )}
        <CardHeader className="pb-2 pt-6">
          <p className="text-sm font-medium text-muted-foreground">{tier.name}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl font-bold tracking-tight">${tier.price}</span>
            <span className="text-sm text-muted-foreground">/visit</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
        </CardHeader>
        <CardContent className="flex-1 pt-0">
          <Separator className="mb-4" />
          <ul className="space-y-2.5">
            {tier.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="pt-0">
          <a href="#contact" className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl h-10 px-4 text-sm font-semibold transition-all ${
            tier.highlighted
              ? "bg-accent text-accent-foreground hover:bg-accent/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}>
            {tier.cta} <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// ── Contact Form ─────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = React.useState<FormState>({
    service: "",
    address: "",
    message: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    smsConsent: false,
    submitting: false,
    status: "idle",
    errorMessage: "",
    requestId: "",
  });

  const set = (key: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.smsConsent) {
      setForm((prev) => ({
        ...prev,
        status: "error",
        errorMessage: "Please consent to SMS messages to proceed.",
      }));
      return;
    }
    setForm((prev) => ({ ...prev, submitting: true, status: "idle" }));

    const payload = {
      source: siteConfig.formSource,
      service: form.service,
      address: form.address.trim(),
      message: form.message.trim(),
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      sms_consent: form.smsConsent,
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) {
        throw new Error(body.error || "Submission failed");
      }
      setForm((prev) => ({
        ...prev,
        status: "success",
        submitting: false,
        requestId: String(body.requestId || ""),
      }));
    } catch (error) {
      setForm((prev) => ({
        ...prev,
        status: "error",
        errorMessage: error instanceof Error && error.message
          ? error.message
          : "Something went wrong. Please try again or call us directly.",
        submitting: false,
      }));
    }
  };

  if (form.status === "success") {
    return (
      <Card className="border-0 shadow-lg bg-primary text-primary-foreground">
        <CardContent className="flex flex-col items-center gap-3 py-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          </motion.div>
          <h3 className="text-xl font-semibold">Thank you!</h3>
          <p className="text-sm text-primary-foreground/80 text-center max-w-xs">
            We received your request. We&apos;ll be in touch shortly.
          </p>
          {form.requestId ? (
            <p className="text-xs text-primary-foreground/60 text-center">Reference: {form.requestId}</p>
          ) : null}
          <Button
            variant="outline"
            className="mt-3 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() =>
              setForm({
                service: "",
                address: "",
                message: "",
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                smsConsent: false,
                submitting: false,
                status: "idle",
                errorMessage: "",
                requestId: "",
              })
            }
          >
            Submit another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
      <CardHeader className="pb-2 pt-5">
        <h2 className="text-xl font-semibold">Request a Free Estimate</h2>
        <p className="text-sm text-muted-foreground">
          We&apos;ll get back to you within one business day.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="svc">Service Needed *</Label>
            <Select
              value={form.service}
              onValueChange={(v: string | null) => v && set("service", v)}
              required
            >
              <SelectTrigger id="svc">
                <SelectValue placeholder="Choose a service..." />
              </SelectTrigger>
              <SelectContent>
                {siteConfig.serviceOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="addr">Full Address *</Label>
            <Input
              id="addr"
              placeholder={`123 Main St, ${siteConfig.city}, ${siteConfig.state}`}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="msg">Project Details / Message</Label>
            <Textarea
              id="msg"
              placeholder="Tell us a little about what you need help with."
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="fn">First Name *</Label>
              <Input id="fn" placeholder="Jane" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ln">Last Name *</Label>
              <Input id="ln" placeholder="Doe" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="em">Email *</Label>
            <Input id="em" type="email" placeholder="jane@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ph">Phone *</Label>
            <Input id="ph" type="tel" placeholder="(555) 123-4567" value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
          </div>
          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="sms"
              checked={form.smsConsent}
              onChange={(e) => set("smsConsent", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
              required
            />
            <Label htmlFor="sms" className="text-xs leading-relaxed text-muted-foreground font-normal cursor-pointer">
              By checking this box, I consent to receive text messages from{" "}
              {siteConfig.businessName} regarding my service request. Message
              frequency varies. Message and data rates may apply. Reply STOP to
              opt out at any time. Reply HELP for help.{" "}
              <span className="underline">Privacy Policy</span>.
            </Label>
          </div>
          {form.status === "error" && (
            <p className="text-sm text-destructive">{form.errorMessage}</p>
          )}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={form.submitting}
          >
            {form.submitting ? "Sending..." : siteConfig.heroCta}
          </Button>
        </form>
        <div className="mt-5 flex flex-col items-center gap-1.5 text-muted-foreground">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
            ))}
          </div>
          <p className="text-xs">{siteConfig.reviews.length}+ five-star reviews from real customers</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Nav ──────────────────────────────────────────────────────────────
function Nav() {
  const links = ["Services", "Pricing", "Reviews", "Gallery", "Contact"];
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-primary text-primary-foreground">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          {/* Fake logo mark */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground text-sm font-black">
            P
          </div>
          {siteConfig.businessName}
        </a>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">
              {l}
            </a>
          ))}
          <a href="#contact" className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg h-8 px-4 text-sm font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-all">
            {siteConfig.heroCta}
          </a>
        </nav>
        <Sheet>
          <SheetTrigger
            className="sm:hidden"
            render={
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-primary-foreground/10"
              />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-64 bg-primary text-primary-foreground">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <nav className="mt-8 flex flex-col gap-4 text-lg">
              {links.map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">
                  {l}
                </a>
              ))}
            </nav>
            <div className="mt-6">
              <a href="#contact" className="inline-flex items-center justify-center w-full h-10 px-4 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg text-sm font-semibold transition-all">
                {siteConfig.heroCta}
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

// ── Hero with background image ──────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[520px] sm:min-h-[600px] flex items-center">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${siteConfig.heroImageUrl})` }} />
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/70" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, white 2px, white 4px)`,
      }} />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28 text-primary-foreground">
        <FadeIn>
          <Badge className="mb-4 text-xs tracking-wide uppercase bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20">
            {siteConfig.serviceAreaNote}
          </Badge>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-2xl">
            {siteConfig.heroTitle}
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mt-5 text-lg sm:text-xl text-primary-foreground/80 max-w-xl leading-relaxed">
            {siteConfig.heroSubtitle}
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="mt-6 flex flex-wrap gap-3">
            {siteConfig.badges.map((b) => (
              <Badge key={b} variant="outline" className="text-xs font-medium border-primary-foreground/25 text-primary-foreground/90 hover:bg-primary-foreground/10">
                {b}
              </Badge>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.4}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#contact" className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl h-12 px-8 text-base font-semibold bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all">
              {siteConfig.heroCta}
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors border border-primary-foreground/25 rounded-xl h-10 px-5 hover:bg-primary-foreground/10"
            >
              <Phone className="h-4 w-4" />
              {siteConfig.phone}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Why Choose Us ────────────────────────────────────────────────────
function WhyChooseUs() {
  return (
    <section id="about" className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 text-xs tracking-wide uppercase">Why Us</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{siteConfig.aboutHeadline}</h2>
          </div>
        </FadeIn>
        <StaggerContainer className="grid gap-6 sm:grid-cols-3">
          {siteConfig.aboutPoints.map((point) => {
            const Icon = iconMap[point.icon] || ShieldCheck;
            return (
              <motion.div key={point.title} variants={staggerItem} className="text-center space-y-3 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{point.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {point.description}
                </p>
              </motion.div>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ── Services Section ─────────────────────────────────────────────────
function Services() {
  return (
    <section id="services" className="py-16 sm:py-20 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 text-xs tracking-wide uppercase">Our Work</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What We Do</h2>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              Professional service backed by experience, honesty, and a commitment to doing the job right.
            </p>
          </div>
        </FadeIn>
        <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ── Pricing Section ──────────────────────────────────────────────────
function Pricing() {
  return (
    <section id="pricing" className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 text-xs tracking-wide uppercase">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              No hidden fees. No surprises. Choose the plan that fits your needs.
            </p>
          </div>
        </FadeIn>
        <StaggerContainer className="grid gap-6 sm:grid-cols-3">
          {siteConfig.pricingTiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ── Satisfaction Guarantee ───────────────────────────────────────────
function Guarantee() {
  return (
    <section id="guarantee" className="py-16 sm:py-20 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary-foreground/5" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary-foreground/5" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <FadeIn>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <BadgeCheck className="h-8 w-8" />
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{siteConfig.guaranteeHeadline}</h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            {siteConfig.guaranteeText}
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {siteConfig.guaranteePoints.map((point) => (
              <div key={point} className="flex items-center gap-2 text-sm text-primary-foreground/90">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                {point}
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.4}>
          <div className="mt-10">
            <a href="#contact" className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl h-12 px-8 text-base font-semibold bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all">
              Get Started Risk-Free <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Google Reviews Section ───────────────────────────────────────────
function GoogleReviews() {
  return (
    <section id="reviews" className="py-16 sm:py-20 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 text-xs tracking-wide uppercase">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What Our Customers Say</h2>
            <p className="mt-2 text-muted-foreground">Real reviews from real customers — no filter.</p>
          </div>
        </FadeIn>
        {/* Google rating summary */}
        <FadeIn>
          <div className="flex flex-col items-center gap-2 mb-10">
            <div className="flex items-center gap-2">
              <svg className="h-8 w-8" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              <span className="text-2xl font-bold">{siteConfig.googleReviewAvg}</span>
              <Stars count={5} />
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {siteConfig.googleReviewCount} Google reviews
            </p>
          </div>
        </FadeIn>
        <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.reviews.map((r) => (
            <ReviewCard key={r.name} {...r} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ── Gallery / Carousel ───────────────────────────────────────────────
function Gallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section id="gallery" className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 text-xs tracking-wide uppercase">Gallery</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Work in Action</h2>
            <p className="mt-2 text-muted-foreground">See the quality of our work firsthand.</p>
          </div>
        </FadeIn>
        <div className="relative">
          {/* Carousel */}
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex gap-4">
              {siteConfig.galleryImages.map((img: GalleryImage, i: number) => (
                <div key={i} className="flex-[0_0_85%] sm:flex-[0_0_48%] lg:flex-[0_0_32%] min-w-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl group"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${img.src})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-sm font-medium text-white">{img.alt}</p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={scrollPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Previous"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </button>
            <div className="flex gap-2">
              {siteConfig.galleryImages.map((_, i: number) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === selectedIndex ? "w-6 bg-accent" : "w-2 bg-muted-foreground/30"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={scrollNext}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact Section ──────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-20 bg-muted/30">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <FadeIn>
          <ContactForm />
        </FadeIn>
      </div>
    </section>
  );
}

// ── Comprehensive Footer ─────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground text-sm font-black">
                P
              </div>
              <span className="text-lg font-bold">{siteConfig.businessName}</span>
            </div>
            <p className="text-sm text-primary-foreground/60 leading-relaxed max-w-xs">
              {siteConfig.tagline} Serving {siteConfig.city}, {siteConfig.state} since {siteConfig.establishedYear}.
            </p>
            <div className="flex gap-3">
              {Object.entries(siteConfig.socialLinks).map(([name, url]) => {
                const Icon = name === "facebook" ? Globe : name === "instagram" ? Camera : BadgeCheck;
                return (
                  <a
                    key={name}
                    href={url}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground/70 hover:bg-accent hover:text-accent-foreground transition-all"
                    aria-label={name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {siteConfig.footerLinks.services.map((s) => (
                <li key={s}>
                  <a href="#services" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {siteConfig.footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Getting in Touch + Mini Map */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Getting in Touch</h3>
            <div className="space-y-2 text-sm text-primary-foreground/60">
              <a href={`tel:${siteConfig.phoneRaw}`} className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {siteConfig.email}
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                {siteConfig.address}
              </div>
            </div>
            {/* Embedded Map */}
            <div className="overflow-hidden rounded-lg h-32">
              <iframe
                src={siteConfig.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Business location map"
              />
            </div>
          </div>
        </div>

        <div className="my-8 h-px bg-primary-foreground/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/40">
            &copy; {siteConfig.footerYear} {siteConfig.businessName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-primary-foreground/40">
            <a href="#" className="hover:text-primary-foreground/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-foreground/70 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-foreground/70 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Home Page ────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Nav />
      <Hero />
      <WhyChooseUs />
      <Services />
      <Pricing />
      <Guarantee />
      <GoogleReviews />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
}
