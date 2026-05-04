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
  hydratedFrom: "https://www.newdayconstruction.co/",
  hydratedAt: "2026-05-04T19:05:58.148Z",
  templateContract: [
    "Keep the section order, component structure, and form fields consistent across instances.",
    "Only business labels, service options, image assets, and form routing should change per business.",
    "The blue Project X visual system is fixed because the image set and overlays are designed around it.",
    "Use professional local-service imagery for every instance; do not ship text-only or layout-rebuilt variants.",
  ],
  brand: {
    name: "New Day Construction",
    mark: "ND",
    poweredBy: "Bellevue, WA",
    footerDescription: "Bellevue remodels, additions, ADUs, custom homes.",
  },
  theme: createProjectXTheme({
    primary: "#27a4ff",
    secondary: "#0b2542",
  }),
  integration: {
    formWebhookUrl: "https://hooks.zapier.com/hooks/catch/26623925/uj1eyis/",
    formSource: "new-day-construction",
  },
  images: {
    hero: "/images/hero-blue-collar-team.png",
    contact: "/images/service-handshake.png",
    carousel: [
      {
        "eyebrow": "Kitchens",
        "title": "Custom cabinetry, counters, fixtures, and layouts.",
        "description": "Plan a kitchen update with professional craftsmanship, practical layouts, and clear next steps.",
        "image": "/images/hvac-plumbing.png",
        "alt": "Kitchen remodeling work in a clean residential setting"
      },
      {
        "eyebrow": "Bathrooms",
        "title": "Modern fixtures, tile work, finishes, and efficient layouts.",
        "description": "Create a cleaner, more comfortable bathroom with New Day's design and installation team.",
        "image": "/images/cleaning-pool.png",
        "alt": "Bathroom remodeling materials and clean finish details"
      },
      {
        "eyebrow": "Additions + ADUs",
        "title": "More space for family, rental income, or daily living.",
        "description": "Add usable square footage with home additions or accessory dwelling units designed around your goals.",
        "image": "/images/construction-handyman.png",
        "alt": "Construction professionals reviewing addition and ADU plans"
      },
      {
        "eyebrow": "Custom Homes",
        "title": "Custom builds and full-home remodels from start to finish.",
        "description": "From ground-up homes to whole-home renovations, New Day keeps the request process simple and organized.",
        "image": "/images/service-handshake.png",
        "alt": "Home construction planning and homeowner consultation"
      }
    ] satisfies readonly ProjectXCarouselItem[],
  },
  industries: [
    "Kitchen Remodeling",
    "Bathroom Remodeling",
    "Home Additions",
    "ADUs",
    "Custom Homes",
    "Full Home Remodeling"
  ],
  proofPoints: [
    "Bellevue remodeling team",
    "Free estimate requests",
    "Mobile project intake",
  ],
} as const;
