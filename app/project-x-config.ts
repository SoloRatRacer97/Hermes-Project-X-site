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
  hydratedFrom: "https://estarshvac.com/",
  hydratedAt: "2026-04-29T21:47:31.459Z",
  templateContract: [
    "Keep the section order, component structure, and form fields consistent across instances.",
    "Only business labels, service options, image assets, and form routing should change per business.",
    "The blue Project X visual system is fixed because the image set and overlays are designed around it.",
    "Use professional local-service imagery for every instance; do not ship text-only or layout-rebuilt variants.",
  ],
  brand: {
    name: "Energy Stars Heating & Cooling",
    mark: "ES",
    poweredBy: "St. Louis & Metro East HVAC",
    footerDescription: "Heating, cooling, insulation, and energy-efficiency service for the Metro East and St. Louis area.",
  },
  theme: createProjectXTheme({
    primary: "#27a4ff",
    secondary: "#0b2542",
  }),
  integration: {
    formWebhookUrl: "https://hooks.zapier.com/hooks/catch/26623925/uj1eyis/",
    formSource: "energy-stars-heating-cooling",
  },
  images: {
    hero: "/images/hero-blue-collar-team.png",
    contact: "/images/service-handshake.png",
    carousel: [
      {
        "eyebrow": "Cooling",
        "title": "AC repair, replacement, and tune-ups when the house will not stay comfortable.",
        "description": "Energy Stars handles warm-weather breakdowns, new air conditioner installs, and seasonal maintenance for homes across St. Louis and the Metro East.",
        "image": "/images/hvac-plumbing.png",
        "alt": "HVAC and plumbing technicians working in a clean residential service setting"
      },
      {
        "eyebrow": "Heating",
        "title": "Furnaces, boilers, and heat pumps serviced before winter makes it urgent.",
        "description": "From repairs to replacements, the team keeps families warm and safe with heating service built around the home, not guesswork.",
        "image": "/images/hvac-plumbing.png",
        "alt": "Residential HVAC technicians servicing heating and cooling equipment"
      },
      {
        "eyebrow": "Home Comfort",
        "title": "Insulation, air sealing, ductwork, and crawl space solutions.",
        "description": "Energy Stars takes a whole-house approach to comfort, finding the places where air leaks, poor ductwork, or under-insulation cost homeowners money.",
        "image": "/images/construction-handyman.png",
        "alt": "Home service professionals reviewing project plans for comfort improvements"
      },
      {
        "eyebrow": "Efficiency + Safety",
        "title": "Right-sized systems, Ameren incentives, and safety testing.",
        "description": "As an Ameren Program Ally, Energy Stars helps customers navigate qualifying efficiency incentives while prioritizing gas leak and carbon monoxide safety.",
        "image": "/images/service-handshake.png",
        "alt": "Friendly service professional shaking hands with a homeowner at the door"
      }
    ] satisfies readonly ProjectXCarouselItem[],
  },
  industries: [
    "Air Conditioner Repair & Installation",
    "Furnace & Boiler Services",
    "Heat Pump Services",
    "Insulation & Air Sealing",
    "Duct Cleaning & Maintenance",
    "Emergency HVAC Repair"
  ],
  proofPoints: [
    "YORK Diamond Club Dealer",
    "10 Years No Worries Warranty",
    "Ameren Program Ally",
  ],
} as const;
