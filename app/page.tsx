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
  "--orange": theme.warmAccent,
  "--hero-image": `url("${images.hero}")`,
  "--hero-overlay": theme.heroOverlay,
  "--hero-overlay-mobile": theme.heroOverlayMobile,
  "--contact-image": `url("${images.contact}")`,
  "--contact-overlay": theme.contactOverlay,
};

const whyCards = [
  {
    title: "Two Green Bay locations",
    description:
      "Visit Huron Automotive on S Huron Road or Velp Avenue for convenient auto maintenance, tire service, and repairs.",
  },
  {
    title: "ASE-certified mechanics",
    description:
      "The team handles everyday maintenance and complex diagnostics with the training modern vehicles require.",
  },
  {
    title: "No surprise work",
    description:
      "Huron walks you through what your car needs and does not move forward with hidden charges or unapproved repairs.",
  },
  {
    title: "Tire and wheel center",
    description:
      "Shop name-brand tires and get installation, repair, rotation, balancing, and wheel alignment support in one place.",
  },
  {
    title: "Comfortable amenities",
    description:
      "24-hour drop-off, free loaner vehicles, local shuttle service, Wi-Fi, coffee, and bottled water help keep your day moving.",
  },
  {
    title: "Fleet-ready support",
    description:
      "Business vehicles get maintenance and repair support focused on reducing downtime and keeping work on schedule.",
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
        <h2>Request service</h2>
        <p>
          Tell us what is going on with your vehicle and the Huron Automotive team will follow up.
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
        {status === "submitting" ? "Sending request..." : "Send service request"}
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
            <a className="mobile-hidden-nav" href="#about">About</a>
            <a href="#why">Why Huron</a>
            <a href="#gallery">Services</a>
            <a className="mobile-hidden-nav" href="#contact">Contact</a>
          </nav>

          <a className="nav-cta" href="#lead-form">
            Request Service
          </a>
        </header>
      </div>

      <section className="hero" id="top">
        <div className="hero-background" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-inner section-shell">
          <div className="hero-copy">
            <p className="eyebrow">Green Bay auto repair & tire services</p>
            <h1>Auto maintenance and tire service you can trust.</h1>
            <p className="hero-subtitle">
              Huron Automotive helps Green Bay drivers with honest maintenance, diagnostics, repairs, tires, and fleet service from two convenient locations.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#lead-form">
                Request service
              </a>
              <a className="secondary-button" href="#why">
                Why choose Huron
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
          <p className="eyebrow">About us</p>
          <h2>Your trusted auto service experts in Green Bay since 2010.</h2>
        </div>
        <div className="rich-copy">
          <p>
            Founded by brothers Dell Jr. and DJ Lubenske, {brand.name} was built as a neighborhood auto repair and tire center focused on dependable service, clear communication, and long-term trust.
          </p>
          <p>
            From routine oil changes to check engine diagnostics, brake repairs, tire installation, and fleet maintenance, Huron gives Green Bay drivers a reliable alternative to the dealership without extended waits or surprise charges.
          </p>
        </div>
      </section>

      <section className="why-section" id="why">
        <div className="section-shell">
          <div className="section-heading centered">
            <p className="eyebrow">Why choose Huron</p>
            <h2>Straightforward service from a local team that keeps your day moving.</h2>
            <p>
              Huron Automotive combines ASE-certified expertise, two Green Bay locations, transparent approvals, and practical amenities that make vehicle service easier.
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
          <p className="eyebrow">Featured services</p>
          <h2>Maintenance, repairs, tires, and fleet support under one roof.</h2>
          <p>
            Whether your car needs a simple oil change or help with a warning light, Huron Automotive can help you understand the next step and get service scheduled.
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
            <h2>Need help with your vehicle?</h2>
            <p>
              Send a service request and the Huron Automotive team will follow up. You can also visit either Green Bay location on S Huron Road or Velp Avenue.
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
            <a href="#why">Why Huron</a>
            <a href="#gallery">Services</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
