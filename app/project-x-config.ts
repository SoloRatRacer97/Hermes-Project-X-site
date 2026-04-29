export type ProjectXCarouselItem = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

type HexColor = `#${string}`;

const FIXED_WHITE = "#ffffff";
const FIXED_BLACK = "#000000";

function hexToRgb(hex: HexColor) {
  const value = hex.replace("#", "");

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function toHex(value: number) {
  return Math.round(Math.min(255, Math.max(0, value)))
    .toString(16)
    .padStart(2, "0");
}

function mixHexColors(from: HexColor, to: HexColor, amount: number): HexColor {
  const start = hexToRgb(from);
  const end = hexToRgb(to);

  return `#${toHex(start.r + (end.r - start.r) * amount)}${toHex(
    start.g + (end.g - start.g) * amount,
  )}${toHex(start.b + (end.b - start.b) * amount)}`;
}

function alpha(hex: HexColor, opacity: number) {
  const { r, g, b } = hexToRgb(hex);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function createProjectXTheme({ primary, secondary }: { primary: HexColor; secondary: HexColor }) {
  const tertiary = mixHexColors(primary, FIXED_WHITE, 0.24);

  return {
    primary,
    secondary,
    tertiary,
    white: FIXED_WHITE,
    black: FIXED_BLACK,
    bg: mixHexColors(primary, FIXED_WHITE, 0.94),
    bgSoft: mixHexColors(primary, FIXED_WHITE, 0.86),
    muted: alpha(FIXED_BLACK, 0.66),
    muted2: alpha(FIXED_BLACK, 0.5),
    line: alpha(FIXED_BLACK, 0.12),
    heroOverlay:
      `radial-gradient(circle at 78% 34%, ${alpha(primary, 0.16)}, transparent 25%), ` +
      `linear-gradient(90deg, ${alpha(FIXED_BLACK, 0.92)} 0%, ${alpha(secondary, 0.82)} 38%, ${alpha(secondary, 0.34)} 67%, ${alpha(FIXED_BLACK, 0.32)} 100%)`,
    heroOverlayMobile: `linear-gradient(90deg, ${alpha(FIXED_BLACK, 0.92)}, ${alpha(secondary, 0.72)})`,
    contactOverlay: `linear-gradient(135deg, ${alpha(secondary, 0.88)}, ${alpha(secondary, 0.78)})`,
  };
}

export const projectXConfig = {
  hydratedFrom: "https://dallasplumbing.com/",
  hydratedAt: "2026-04-29T15:26:32.002Z",
  templateContract: [
    "Keep the section order, component structure, and form fields consistent across instances.",
    "Only business labels, service options, image assets, and form routing should change per business.",
    "The blue Project X visual system is fixed because the image set and overlays are designed around it.",
    "Use professional local-service imagery for every instance; do not ship text-only or layout-rebuilt variants.",
  ],
  brand: {
    name: "Dallas Plumbing",
    mark: "DP",
    poweredBy: "Project X by Hopper-Hermes",
    footerDescription: "Fast follow-up interface powered by Hopper-Hermes.",
  },
  theme: createProjectXTheme({
    primary: "#27a4ff",
    secondary: "#0b2542",
  }),
  integration: {
    formWebhookUrl: "https://hooks.zapier.com/hooks/catch/26623925/uj1eyis/",
    formSource: "dallas-plumbing",
  },
  images: {
    hero: "/images/hero-blue-collar-team.png",
    contact: "/images/service-handshake.png",
    carousel: [
      {
        "eyebrow": "HVAC + Plumbing",
        "title": "Emergency jobs, tune-ups, installs, and repair requests.",
        "description": "Show prospects that your business is responsive, professional, and ready to book the job before they call the next company.",
        "image": "/images/hvac-plumbing.png",
        "alt": "HVAC and plumbing technicians working in a clean residential service setting"
      },
      {
        "eyebrow": "Cleaning + Pool Service",
        "title": "Recurring routes, one-time cleans, and seasonal service work.",
        "description": "A flexible visual system that fits home services, commercial maintenance, and route-based local operators.",
        "image": "/images/cleaning-pool.png",
        "alt": "Cleaning professionals and a pool technician performing service work"
      },
      {
        "eyebrow": "Construction + Handyman",
        "title": "Bigger projects still start with a simple lead capture.",
        "description": "Position your company as organized and trustworthy from the first page view through the first booked estimate.",
        "image": "/images/construction-handyman.png",
        "alt": "Construction and handyman professionals collaborating over project plans"
      },
      {
        "eyebrow": "Customer Experience",
        "title": "A better first impression at the exact moment intent is highest.",
        "description": "Use the landing page as the front door for Project X, then let Hopper-Hermes handle fast follow-up and qualification.",
        "image": "/images/service-handshake.png",
        "alt": "Friendly service professional shaking hands with a homeowner at the door"
      }
    ] satisfies readonly ProjectXCarouselItem[],
  },
  industries: [
    "Drain Cleaning",
    "Water Heater Services",
    "Emergency Plumbing",
    "AC Repair",
    "AC Installation",
    "Heating Repair",
    "Slab Leak Detection"
  ],
  proofPoints: [
    "Hydrated from dallasplumbing.com",
    "Locked professional layout",
    "Mobile-first contact flow",
  ],
} as const;
