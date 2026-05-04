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

const { brand, images, industries, integration, theme } = projectXConfig;
const proofPoints = ["Family owned", "Licensed & insured", "Free estimates"];
const carouselItems = [
  {
    eyebrow: "Kitchen Remodeling",
    title: "Custom Bellevue kitchens built around how your family actually lives.",
    description:
      "From cabinet layout and countertops to islands, lighting, and finish selections, New Day Construction helps turn dated kitchens into practical, polished gathering spaces.",
    image: "/images/construction-handyman.png",
    alt: "Construction professionals reviewing remodeling plans for a kitchen project",
  },
  {
    eyebrow: "Bathroom Remodeling",
    title: "Spa-like bathroom updates with durable materials and clean workmanship.",
    description:
      "Refresh a tired bath, replace tile and fixtures, or rework the whole layout with a remodeling team that keeps the details organized from start to finish.",
    image: "/images/service-handshake.png",
    alt: "Service professional greeting a homeowner before a remodeling consultation",
  },
  {
    eyebrow: "Additions + ADUs",
    title: "More usable space without leaving the neighborhood you already love.",
    description:
      "New Day handles room additions, home expansions, and accessory dwelling units for homeowners who need space for family, rental income, work, or guests.",
    image: "/images/hero-blue-collar-team.png",
    alt: "Construction and remodeling crew standing together at a job site",
  },
  {
    eyebrow: "Whole-Home Projects",
    title: "Design-build support for remodels, custom homes, and exterior updates.",
    description:
      "Whether the request is a full home remodel, custom build, or siding replacement, the focus stays on craftsmanship, communication, and a finished result that feels intentional.",
    image: "/images/hvac-plumbing.png",
    alt: "Skilled tradespeople working in a clean residential service setting",
  },
] as const;
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
    title: "Bellevue remodeling focus",
    description:
      "New Day Construction is positioned around kitchen, bath, home remodeling, additions, ADUs, custom homes, and siding replacement in Bellevue and the surrounding Eastside.",
  },
  {
    title: "Fine-feathered craftsmanship",
    description:
      "The page now mirrors New Day's own craftsmanship-first message instead of sounding like a generic service-business demo.",
  },
  {
    title: "Estimate-ready intake",
    description:
      "The form asks for the project type and details a remodeler actually needs before following up on a free estimate request.",
  },
  {
    title: "Residential, multi-family, commercial",
    description:
      "The copy reflects New Day's stated market mix instead of narrowing the page to one residential-only use case.",
  },
  {
    title: "Design-build language",
    description:
      "Visitors see clear references to planning, materials, craftsmanship, layout, and project management from first click through follow-up.",
  },
  {
    title: "Local proof points",
    description:
      "Family owned, licensed and insured, free estimates, and strong review signals are brought forward where prospects expect reassurance.",
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
        <p className="eyebrow">Free estimate</p>
        <h2>Tell us about your remodeling project</h2>
        <p>
          Share the basics and New Day Construction will follow up about scope, timing, and next steps.
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
        Project details
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us about the room, property, timeline, and what you want changed."
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
        {status === "submitting" ? "Sending request..." : "Request a free estimate"}
      </button>

      {status === "success" ? (
        <p className="form-success" role="status">
          Thanks. Your request was sent to the New Day Construction follow-up team.
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
              <small>Bellevue remodeling contractor</small>
            </span>
          </a>

          <nav className="nav-links" aria-label="Page sections">
            <a className="mobile-hidden-nav" href="#about">About</a>
            <a href="#why">Why New Day</a>
            <a href="#gallery">Services</a>
            <a className="mobile-hidden-nav" href="#contact">Contact</a>
          </nav>

          <a className="nav-cta" href="#lead-form">
            Free Estimate
          </a>
        </header>
      </div>

      <section className="hero" id="top">
        <div className="hero-background" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-inner section-shell">
          <div className="hero-copy">
            <p className="eyebrow">For fine-feathered craftsmanship</p>
            <h1>Bellevue kitchen, bath, and home remodeling by New Day Construction.</h1>
            <p className="hero-subtitle">
              Remodel your kitchen, refresh your bathroom, add space with an addition or ADU, or plan a full home transformation with a family-owned contractor serving Bellevue and the Eastside.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#lead-form">
                Get your free estimate
              </a>
              <a className="secondary-button" href="#why">
                See services
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
          <h2>Quality home renovations and custom construction in Bellevue.</h2>
        </div>
        <div className="rich-copy">
          <p>
            {brand.name} works with homeowners, property owners, and project stakeholders who want a remodel that feels intentional from the first plan to the final walkthrough. The focus is practical design, reliable construction, and the kind of finish work that makes a space feel complete.
          </p>
          <p>
            The team handles kitchen remodeling, bathroom remodeling, whole-home renovations, room additions, ADU builds, custom homes, and siding replacement across residential, multi-family, and commercial projects.
          </p>
        </div>
      </section>

      <section className="why-section" id="why">
        <div className="section-shell">
          <div className="section-heading centered">
            <p className="eyebrow">Why choose New Day</p>
            <h2>Built around clear planning, craftsmanship, and a smoother remodeling experience.</h2>
            <p>
              New Day Construction pairs Bellevue-area remodeling experience with straightforward communication and free estimate requests.
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
          <p className="eyebrow">Remodeling services</p>
          <h2>Kitchens, baths, additions, ADUs, custom homes, and more.</h2>
          <p>
            Choose the project type that fits your home, then send a request so the New Day team can follow up with the right next step.
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
            <h2>Ready to talk through your New Day Construction project?</h2>
            <p>
              Use the form to request a free estimate for a kitchen, bath, addition, ADU, custom home, siding, or whole-home remodel.
            </p>
          </div>

          <LeadForm id="contact-form" className="lead-card contact-form" />
        </div>
      </section>

      <footer className="site-footer">
        <div className="section-shell footer-inner">
          <div>
            <strong>{brand.name}</strong>
            <p>Kitchen, bath, home remodeling, additions, ADUs, custom homes, and siding replacement in Bellevue, WA.</p>
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
