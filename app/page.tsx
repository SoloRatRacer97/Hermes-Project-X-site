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

const phoneDisplay = "(415) 555-0198";
const phoneHref = "tel:+14155550198";

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
    title: "Local mortgage context",
    description:
      "Talk through San Francisco purchase, refinance, jumbo, condo, TIC, and investment scenarios with a practical first step.",
  },
  {
    title: "Careful pre-approval routing",
    description:
      "Offer deadlines, document requests, and closing timelines get routed quickly without promising approval over text.",
  },
  {
    title: "No rate promises by text",
    description:
      "Rates, payments, and approval depend on borrower profile, property details, market conditions, and lender review.",
  },
];

const serviceCards = [
  {
    title: "Home Purchase Loans",
    description: "Purchase mortgage guidance for condos, TICs, single-family homes, and multi-unit properties.",
  },
  {
    title: "Mortgage Pre-Approval",
    description: "A clear path for buyers who need next steps before making an offer or calling an agent.",
  },
  {
    title: "Refinance Loans",
    description: "Rate-and-term, payment, term, and cash-out refinance conversations for homeowners.",
  },
  {
    title: "Jumbo Loan Guidance",
    description: "Scenario review for high-balance Bay Area loans, complex income, and reserve questions.",
  },
  {
    title: "Investment Property Loans",
    description: "Loan conversations for rental, second-home, and investor property scenarios.",
  },
];

const processSteps = [
  {
    title: "Send the request",
    description: "Tell us whether this is purchase, refinance, jumbo, pre-approval, or investment-property related.",
  },
  {
    title: "Get a follow-up",
    description: "The team reviews the property location, timing, and loan goal before the conversation gets deeper.",
  },
  {
    title: "Prepare the file",
    description: "If it fits, the next step is document review, a lending conversation, or a pre-approval path.",
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
        const response = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Lead intake returned HTTP ${response.status}`);
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
        <p className="eyebrow">Mortgage request</p>
        <h2>Tell us what kind of loan help you need.</h2>
        <p>
          Share the basics and the Golden Gate Mortgage team will follow up with the next step.
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
        Loan type
        <select
          required
          name="service"
          value={formState.service}
          onChange={(event) => updateField("service", event.target.value)}
        >
          {serviceOptions.map((option) => (
            <option key={option || "placeholder"} value={option} disabled={option === ""}>
              {option || "Choose a loan type"}
            </option>
          ))}
        </select>
      </label>

      <label>
        What should we know?
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us the property city, timeline, purchase or refinance goal, and anything deadline-related."
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
        {status === "submitting" ? "Sending request..." : "Request mortgage help"}
      </button>

      {status === "success" ? (
        <p className="form-success" role="status">
          Thanks. Your request was sent to Golden Gate Mortgage Advisors and our team will follow up.
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
          <span>San Francisco mortgage guidance for purchase, refinance, jumbo, and investor scenarios</span>
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
          <a href="#services">Loan Help</a>
          <a href="#why">Why Golden Gate</a>
          <a href="#shop">Process</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="nav-cta" href="#lead-form">
          Request Help
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-background" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />

        <div className="section-shell hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">San Francisco mortgage broker</p>
            <h1>Mortgage guidance without the runaround.</h1>
            <p className="hero-subtitle">
              Golden Gate Mortgage Advisors helps buyers, homeowners, and investors sort through purchase, refinance, jumbo, and pre-approval questions.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#lead-form">
                Request mortgage help
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
          <h2>Mortgage support for offers, refinances, jumbo files, and investor plans.</h2>
          <p>
            From a first pre-approval to a complex refinance, Golden Gate keeps the first step focused on fit, timing, and what needs review.
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
            <p className="eyebrow">Why Golden Gate</p>
            <h2>Straight answers before mortgage details get complicated.</h2>
            <p>
              San Francisco mortgage scenarios can move quickly. The first conversation should sort out loan purpose, property location, timing, and whether a lender review is the right next step.
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
            alt="Mortgage paperwork and calculator on a desk"
            fill
            sizes="(max-width: 960px) 100vw, 48vw"
            className="shop-image"
          />
        </div>

        <div className="shop-copy">
          <p className="eyebrow">Process</p>
          <h2>Practical routing before anyone talks rates or approval.</h2>
          <p>
            Golden Gate Mortgage Advisors uses the first request to understand whether this is purchase, refinance, jumbo, pre-approval, or investment related, then gets the right context in front of the team.
          </p>
          <a className="text-link" href="#contact">
            Send a mortgage request
          </a>
        </div>
      </section>

      <section className="process-section">
        <div className="section-shell">
          <div className="section-heading centered">
            <p className="eyebrow">How it works</p>
            <h2>A simple path from request to lending review.</h2>
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
            <h2>Need help with a mortgage scenario?</h2>
            <p>
              Send a request and the Golden Gate Mortgage team will follow up. Specific rates, payments, and approval details require a full review.
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
            <a href="#services">Loan Help</a>
            <a href="#why">Why Golden Gate</a>
            <a href="#shop">Process</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
