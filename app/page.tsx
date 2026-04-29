"use client";

import Image from "next/image";
import type { CSSProperties, FormEvent } from "react";
import { useEffect, useState } from "react";

import { projectXConfig } from "./project-x-config";

type FormState = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  smsConsent: boolean;
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

type ThemeStyle = CSSProperties & Record<`--${string}`, string>;

const { brand, images, industries, integration, proofPoints, theme } = projectXConfig;
const carouselItems = images.carousel;
const serviceOptions = ["", ...industries, "Other"];

const themeStyle: ThemeStyle = {
  "--bg": theme.bg,
  "--bg-soft": theme.bgSoft,
  "--ink": theme.black,
  "--muted": theme.muted,
  "--muted-2": theme.muted2,
  "--line": theme.line,
  "--white": theme.white,
  "--black": theme.black,
  "--primary": theme.primary,
  "--secondary": theme.secondary,
  "--tertiary": theme.tertiary,
  "--blue-950": theme.secondary,
  "--blue-900": theme.secondary,
  "--blue-800": theme.secondary,
  "--blue-700": theme.secondary,
  "--blue-600": theme.primary,
  "--blue-500": theme.primary,
  "--cyan": theme.tertiary,
  "--orange": theme.tertiary,
  "--hero-image": `url("${images.hero}")`,
  "--hero-overlay": theme.heroOverlay,
  "--hero-overlay-mobile": theme.heroOverlayMobile,
  "--contact-image": `url("${images.contact}")`,
  "--contact-overlay": theme.contactOverlay,
};

const whyCards = [
  {
    title: "Lead capture above the fold",
    description:
      "Your contact form sits directly in the hero so every visitor has a clear next step without hunting around the page.",
  },
  {
    title: "Works across every trade",
    description:
      "The copy stays flexible for HVAC, plumbing, cleaning, construction, handyman, pool service, and more.",
  },
  {
    title: "Built for Hopper-Hermes",
    description:
      "The page is structured to hand off clean intent, service type, contact details, and urgency to your follow-up stack.",
  },
  {
    title: "Trust-first positioning",
    description:
      "Professional imagery, direct benefits, and no overcomplicated jargon make the offer easy for blue-collar owners to understand.",
  },
  {
    title: "Controlled personalization",
    description:
      "Future instances can inherit the same page form while only swapping palettes, professional photo sets, and service choices.",
  },
  {
    title: "Ready to deploy",
    description:
      "This is a focused Next.js home page starter with local images, sticky nav, responsive CSS, and production-friendly structure.",
  },
];

const initialFormState: FormState = {
  name: "",
  phone: "",
  email: "",
  service: "",
  message: "",
  smsConsent: false,
};

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const firstName = parts.shift() || "";

  return {
    firstName,
    lastName: parts.join(" "),
  };
}

function LeadForm({ id, className = "lead-card" }: { id: string; className?: string }) {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function updateField(field: Exclude<keyof FormState, "smsConsent">, value: string) {
    setFormState((current) => ({ ...current, [field]: value }));
    setStatus("idle");
    setErrorMessage("");
  }

  function updateSmsConsent(value: boolean) {
    setFormState((current) => ({ ...current, smsConsent: value }));
    setStatus("idle");
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formState.smsConsent) {
      setStatus("error");
      setErrorMessage("Please agree to receive SMS follow-up before submitting.");
      return;
    }

    const { firstName, lastName } = splitName(formState.name);
    const payload = {
      source: integration.formSource,
      service: formState.service,
      message: formState.message.trim(),
      first_name: firstName,
      last_name: lastName,
      name: formState.name.trim(),
      email: formState.email.trim(),
      phone: formState.phone.trim(),
      sms_consent: formState.smsConsent,
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
    };

    setStatus("submitting");
    setErrorMessage("");

    try {
      if (integration.formWebhookUrl) {
        const response = await fetch(integration.formWebhookUrl, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Zapier webhook returned HTTP ${response.status}`);
        }
      } else {
        console.info(`${brand.name} landing page lead`, payload);
      }

      setStatus("success");
      setFormState(initialFormState);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form className={className} id={id} onSubmit={handleSubmit}>
      <div className="lead-card-header">
        <p className="eyebrow">Start here</p>
        <h2>Get a fast follow-up flow demo</h2>
        <p>
          Capture the basics now. Route the conversation into your real Hopper-Hermes workflow later.
        </p>
      </div>

      <label>
        Name
        <input
          required
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Your name"
          value={formState.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
      </label>

      <div className="form-grid">
        <label>
          Phone
          <input
            required
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="(555) 555-5555"
            value={formState.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={formState.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>
      </div>

      <label>
        Service type
        <select
          required
          name="service"
          value={formState.service}
          onChange={(event) => updateField("service", event.target.value)}
        >
          {serviceOptions.map((option) => (
            <option key={option || "placeholder"} value={option} disabled={option === ""}>
              {option || "Choose a service"}
            </option>
          ))}
        </select>
      </label>

      <label>
        What should we know?
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us what kind of business, offer, or lead flow you want to showcase."
          value={formState.message}
          onChange={(event) => updateField("message", event.target.value)}
        />
      </label>

      <label className="sms-consent">
        <input
          className="sms-consent-input"
          required
          type="checkbox"
          name="smsConsent"
          checked={formState.smsConsent}
          onChange={(event) => updateSmsConsent(event.target.checked)}
        />
        <span className="sms-consent-box" aria-hidden="true" />
        <span className="sms-consent-text">
          I agree to receive SMS follow-up about this request from {brand.name}. Message and data rates may apply.
        </span>
      </label>

      <button className="submit-button" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending request..." : "Send demo request"}
      </button>

      {status === "success" ? (
        <p className="form-success" role="status">
          Thanks. Your request was captured and routed into the Project X follow-up flow.
        </p>
      ) : null}

      {status === "error" ? (
        <p className="form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  const activeItem = carouselItems[activeSlide];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % carouselItems.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main style={themeStyle}>
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label={`${brand.name} home`}>
          <span className="brand-mark">{brand.mark}</span>
          <span>
            <strong>{brand.name}</strong>
            <small>{brand.poweredBy}</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Page sections">
          <a className="mobile-hidden-nav" href="#about">About</a>
          <a href="#why">Why Choose This</a>
          <a href="#gallery">Gallery</a>
          <a className="mobile-hidden-nav" href="#contact">Contact</a>
        </nav>

        <a className="nav-cta" href="#lead-form">
          Get Demo
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-background" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-inner section-shell">
          <div className="hero-copy">
            <p className="eyebrow">Industry-agnostic service business landing page</p>
            <h1>Win the job before your competitors even reply.</h1>
            <p className="hero-subtitle">
              A polished {brand.name} home page built for showcasing Hopper-Hermes to blue-collar businesses — from HVAC and plumbing to cleaning, construction, pool service, handyman work, and anything in between.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#lead-form">
                Request a demo
              </a>
              <a className="secondary-button" href="#why">
                See how it works
              </a>
            </div>

            <div className="proof-row" aria-label={`${brand.name} proof points`}>
              {proofPoints.map((point) => (
                <span key={point}>{point}</span>
              ))}
            </div>
          </div>

          <LeadForm id="lead-form" />
        </div>
      </section>

      <section className="logo-strip" aria-label="Industries supported">
        <div className="section-shell industry-strip">
          {industries.map((industry) => (
            <span key={industry}>{industry}</span>
          ))}
        </div>
      </section>

      <section className="section-shell split-section" id="about">
        <div>
          <p className="eyebrow">About us</p>
          <h2>One clean interface for showing local service businesses what fast follow-up feels like.</h2>
        </div>
        <div className="rich-copy">
          <p>
            {brand.name} is a flexible landing page concept for service companies that rely on calls, forms, texts, estimate requests, and speed-to-lead. It is intentionally industry agnostic, so you can use the same foundation for plumbers, HVAC companies, cleaners, pool routes, remodelers, roofers, landscapers, electricians, and more.
          </p>
          <p>
            The page gives you a modern front end for demos while Hopper-Hermes can sit behind the scenes to qualify leads, respond quickly, collect missing details, and hand the conversation to the right person when the customer is ready.
          </p>
        </div>
      </section>

      <section className="why-section" id="why">
        <div className="section-shell">
          <div className="section-heading centered">
            <p className="eyebrow">Why choose this</p>
            <h2>A practical home page for companies that make money by answering first.</h2>
            <p>
              Built for clear messaging, fast conversion, and easy adaptation across multiple blue-collar verticals.
            </p>
          </div>

          <div className="card-grid">
            {whyCards.map((card, index) => (
              <article className="why-card" key={card.title}>
                <span className="card-number">0{index + 1}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell carousel-section" id="gallery">
        <div className="section-heading">
          <p className="eyebrow">Blue-collar image carousel</p>
          <h2>Built to feel familiar to every trade.</h2>
          <p>
            Keep the same polished visual system across instances, then swap in client-specific crews or approved professional trade photography when available.
          </p>
        </div>

        <div className="carousel-card">
          <div className="carousel-image-wrap">
            <Image
              key={activeItem.image}
              src={activeItem.image}
              alt={activeItem.alt}
              fill
              sizes="(max-width: 900px) 100vw, 58vw"
              className="carousel-image"
              priority={activeSlide === 0}
            />
          </div>

          <div className="carousel-copy">
            <p className="eyebrow">{activeItem.eyebrow}</p>
            <h3>{activeItem.title}</h3>
            <p>{activeItem.description}</p>

            <div className="carousel-controls" aria-label="Carousel controls">
              {carouselItems.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  className={index === activeSlide ? "active" : ""}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show ${item.eyebrow}`}
                  aria-pressed={index === activeSlide}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="contact-band" id="contact">
        <div className="section-shell contact-grid">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Ready to plug this into your {brand.name} demo flow?</h2>
            <p>
              Use the form to capture the demo request, then connect it to your CRM, webhook, or Hopper-Hermes intake flow when you are ready.
            </p>
          </div>

          <LeadForm id="contact-form" className="lead-card contact-form" />
        </div>
      </section>

      <footer className="site-footer">
        <div className="section-shell footer-inner">
          <div>
            <strong>{brand.name}</strong>
            <p>{brand.footerDescription}</p>
          </div>
          <div className="footer-links">
            <a href="#top">Top</a>
            <a href="#about">About</a>
            <a href="#why">Why</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
