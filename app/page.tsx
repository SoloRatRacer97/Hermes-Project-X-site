"use client";

import Image from "next/image";
import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";

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
const serviceOptions = ["", ...industries, "Other"];

const phoneDisplay = "(920) 406-2860";
const phoneHref = "tel:+19204062860";

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
  "--orange": theme.warmAccent,
  "--hero-image": `url("${images.hero}")`,
  "--contact-image": `url("${images.contact}")`,
};

const trustCards = [
  {
    title: "Local shop, practical answers",
    description:
      "Talk with a Green Bay team that explains the next step before any work moves forward.",
  },
  {
    title: "ASE-certified mechanics",
    description:
      "Routine maintenance, warning lights, brake work, tire service, and fleet support are handled under one roof.",
  },
  {
    title: "No surprise work",
    description:
      "Huron reviews what your vehicle needs and waits for approval before starting repairs.",
  },
];

const serviceCards = [
  {
    title: "Oil Change & Maintenance",
    description: "Oil changes, scheduled maintenance, filters, inspections, and everyday vehicle care.",
  },
  {
    title: "Brake Repair & Service",
    description: "Brake pads, rotors, fluid service, inspections, and repair for safe stopping power.",
  },
  {
    title: "Engine Diagnostics & Repair",
    description: "Check engine lights, performance issues, electrical concerns, and troubleshooting.",
  },
  {
    title: "Tires, Alignment & Wheels",
    description: "Tire installation, repair, rotation, balancing, and wheel alignment for Wisconsin roads.",
  },
  {
    title: "Fleet Vehicle Service",
    description: "Maintenance and repair support that helps business vehicles reduce downtime.",
  },
];

const processSteps = [
  {
    title: "Send the request",
    description: "Tell us what is going on, which vehicle needs help, and how soon you want service.",
  },
  {
    title: "Get a follow-up",
    description: "The team reviews the details and follows up with a practical next step.",
  },
  {
    title: "Approve the work",
    description: "You get clear communication before repairs or maintenance move forward.",
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
        <p className="eyebrow">Service request</p>
        <h2>Tell us what your vehicle needs.</h2>
        <p>
          Share the basics and the Huron Automotive team will follow up with the next step.
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
            placeholder="you@example.com"
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
          placeholder="Tell us what your vehicle needs, any warning lights, or when you would like to come in."
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
        {status === "submitting" ? "Sending request..." : "Request service"}
      </button>

      {status === "success" ? (
        <p className="form-success" role="status">
          Thanks. Your request was sent to Huron Automotive and our team will follow up.
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
  return (
    <main style={themeStyle}>
      <div className="utility-bar">
        <div className="section-shell utility-inner">
          <span>Green Bay auto repair, tire service, and fleet maintenance</span>
          <a href={phoneHref}>{phoneDisplay}</a>
        </div>
      </div>

      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label={`${brand.name} home`}>
          <span className="brand-mark">{brand.mark}</span>
          <span>
            <strong>{brand.name}</strong>
            <small>{brand.poweredBy}</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Page sections">
          <a href="#services">Services</a>
          <a href="#why">Why Huron</a>
          <a href="#shop">The shop</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="nav-cta" href="#lead-form">
          Request Service
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-background" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />

        <div className="section-shell hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Local Green Bay auto shop</p>
            <h1>Keep your car moving without the runaround.</h1>
            <p className="hero-subtitle">
              Huron Automotive helps drivers with maintenance, repairs, tires, diagnostics, and fleet support from two Green Bay locations.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#lead-form">
                Request service
              </a>
              <a className="secondary-button" href={phoneHref}>
                Call {phoneDisplay}
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

      <section className="service-strip" aria-label="Common service requests">
        <div className="section-shell service-strip-inner">
          {industries.map((industry) => (
            <span key={industry}>{industry}</span>
          ))}
        </div>
      </section>

      <section className="section-shell services-section" id="services">
        <div className="section-kicker">What we handle</div>
        <div className="section-heading two-column-heading">
          <h2>Auto service for daily drivers, work vehicles, and everything between.</h2>
          <p>
            From a quick oil change to a warning light you do not want to ignore, Huron keeps the process straightforward.
          </p>
        </div>

        <div className="service-grid">
          {serviceCards.map((service) => (
            <article className="service-card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="why-band" id="why">
        <div className="section-shell why-grid">
          <div>
            <p className="eyebrow">Why Huron</p>
            <h2>Straight answers from a shop built around local drivers.</h2>
            <p>
              Founded by brothers Dell Jr. and DJ Lubenske, Huron Automotive was built as a neighborhood auto repair and tire center focused on dependable service, clear communication, and long-term trust.
            </p>
          </div>

          <div className="trust-grid">
            {trustCards.map((card) => (
              <article className="trust-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell shop-section" id="shop">
        <div className="shop-image-card">
          <Image
            src={images.contact}
            alt="Huron Automotive technician in the shop"
            fill
            sizes="(max-width: 960px) 100vw, 48vw"
            className="shop-image"
          />
        </div>

        <div className="shop-copy">
          <p className="eyebrow">The shop</p>
          <h2>Convenient service without surprise approvals.</h2>
          <p>
            Huron Automotive gives Green Bay drivers a reliable alternative to dealership waits, with 24-hour drop-off, free loaner vehicles, shuttle service, Wi-Fi, coffee, bottled water, and practical follow-up from the team.
          </p>
          <a className="text-link" href="#contact">
            Send a service request
          </a>
        </div>
      </section>

      <section className="process-section">
        <div className="section-shell">
          <div className="section-heading centered">
            <p className="eyebrow">How it works</p>
            <h2>A simple path from request to repair.</h2>
          </div>

          <div className="process-grid">
            {processSteps.map((step, index) => (
              <article className="process-card" key={step.title}>
                <span>{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-shell contact-grid">
          <div className="contact-copy">
            <p className="eyebrow">Get started</p>
            <h2>Need help with your vehicle?</h2>
            <p>
              Send a service request and the Huron Automotive team will follow up. You can also call or visit either Green Bay location on S Huron Road or Velp Avenue.
            </p>
            <a className="secondary-button dark" href={phoneHref}>
              Call {phoneDisplay}
            </a>
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
            <a href="#services">Services</a>
            <a href="#why">Why Huron</a>
            <a href="#shop">The shop</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
