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
    title: "Speed-to-lead clarity",
    description:
      "ChatSales versus Hermes shows what changes when every new inquiry gets an immediate, useful response instead of waiting for manual follow-up.",
  },
  {
    title: "Qualification without friction",
    description:
      "Compare how each workflow gathers missing details, keeps the lead engaged, and avoids making customers repeat information they already gave you.",
  },
  {
    title: "Cleaner human handoff",
    description:
      "The page highlights when automation should keep working and when the conversation should move to an owner, estimator, or sales rep.",
  },
  {
    title: "Service-business fit",
    description:
      "Use the comparison for HVAC, plumbing, roofing, cleaning, construction, and other local-service teams where missed calls become missed revenue.",
  },
  {
    title: "Fallbacks that keep working",
    description:
      "ChatSales versus Hermes makes reliability visible: routing, escalation, and recovery matter when the first automation path is unavailable.",
  },
  {
    title: "Demo-ready positioning",
    description:
      "The landing page gives prospects a focused way to understand the difference before booking a deeper walkthrough.",
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
        <h2>Request the ChatSales versus Hermes walkthrough</h2>
        <p>
          Tell us where your follow-up breaks down and we will map how the two approaches compare.
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
        What should we know about your sales flow?
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us how leads come in, who follows up, and what currently gets missed."
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
        {status === "submitting" ? "Sending request..." : "Request comparison"}
      </button>

      {status === "success" ? (
        <p className="form-success" role="status">
          Thanks. Your ChatSales versus Hermes request was captured.
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
      <div className="site-header-shell">
        <header className="site-header" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label={`${brand.name} home`}>
            <span className="brand-mark">{brand.mark}</span>
            <span>
              <strong>{brand.name}</strong>
              <small>{brand.poweredBy}</small>
            </span>
          </a>

          <nav className="nav-links" aria-label="Page sections">
            <a className="mobile-hidden-nav" href="#about">Comparison</a>
            <a href="#why">Why it matters</a>
            <a href="#gallery">Gallery</a>
            <a className="mobile-hidden-nav" href="#contact">Contact</a>
          </nav>

          <a className="nav-cta" href="#lead-form">
            Compare
          </a>
        </header>
      </div>

      <section className="hero" id="top">
        <div className="hero-background" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-inner section-shell">
          <div className="hero-copy">
            <p className="eyebrow">ChatSales versus Hermes</p>
            <h1>See the follow-up difference before the next lead slips away.</h1>
            <p className="hero-subtitle">
              A focused comparison page for showing how ChatSales captures, qualifies, and routes service leads against the older Hermes follow-up workflow.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#lead-form">
                Get the comparison
              </a>
              <a className="secondary-button" href="#why">
                See the differences
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

      <section className="logo-strip" aria-label="Services offered">
        <div className="section-shell industry-strip">
          {industries.map((industry) => (
            <span key={industry}>{industry}</span>
          ))}
        </div>
      </section>

      <section className="section-shell split-section" id="about">
        <div>
          <p className="eyebrow">About the comparison</p>
          <h2>ChatSales versus Hermes explains what happens after the form submission.</h2>
        </div>
        <div className="rich-copy">
          <p>
            {brand.name} is built to make the difference between legacy automation and modern conversational sales follow-up easy to understand. The page keeps the focus on the moments that decide whether a lead turns into a booked conversation.
          </p>
          <p>
            Instead of selling abstract AI, the copy walks through response speed, qualification, handoff timing, fallback reliability, and the customer experience owners actually care about.
          </p>
        </div>
      </section>

      <section className="why-section" id="why">
        <div className="section-shell">
          <div className="section-heading centered">
            <p className="eyebrow">Why it matters</p>
            <h2>The difference is not a prettier form. It is what happens next.</h2>
            <p>
              The comparison shows how a lead moves from first contact to qualified handoff without losing momentum.
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
          <p className="eyebrow">Comparison areas</p>
          <h2>Show the difference in the moments that decide the sale.</h2>
          <p>
            Use each section to explain where ChatSales improves the lead journey versus the older Hermes workflow.
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
            <p className="eyebrow">Book the walkthrough</p>
            <h2>Ready to compare ChatSales versus Hermes on your own lead flow?</h2>
            <p>
              Send the basics and we will walk through where your current follow-up slows down, where automation should help, and where a human should step in.
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
            <a href="#about">Comparison</a>
            <a href="#why">Why</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
