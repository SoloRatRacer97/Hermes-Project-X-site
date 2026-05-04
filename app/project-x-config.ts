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
  hydratedAt: "2026-05-04T20:22:42.676Z",
  templateContract: [
    "Keep the section order, component structure, and form fields consistent across instances.",
    "Only business labels, service options, image assets, and form routing should change per business.",
    "The blue Project X visual system is fixed because the image set and overlays are designed around it.",
    "Use professional local-service imagery for every instance; do not ship text-only or layout-rebuilt variants.",
  ],
  brand: {
    name: "New Day Construction",
    mark: "ND",
    poweredBy: "Bellevue remodeling contractor",
    footerDescription: "Family-owned Bellevue remodeling, additions, ADUs, and custom homes.",
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
        "eyebrow": "Kitchen + Bath",
        "title": "Kitchens and baths designed around daily life.",
        "description": "Custom layouts, premium finishes, and careful installation for the rooms your family uses most.",
        "image": "/images/hvac-plumbing.png",
        "alt": "Remodeling professionals reviewing a kitchen and bathroom project"
      },
      {
        "eyebrow": "Additions + ADUs",
        "title": "More space without leaving the neighborhood you love.",
        "description": "Room additions, second stories, garage conversions, and ADUs planned from permits to walkthrough.",
        "image": "/images/cleaning-pool.png",
        "alt": "Home addition and ADU project planning for a Bellevue property"
      },
      {
        "eyebrow": "Custom Homes",
        "title": "Design-build support from first plan to final walkthrough.",
        "description": "One team coordinates design, materials, construction, and finish details for a home built around you.",
        "image": "/images/construction-handyman.png",
        "alt": "Construction team reviewing plans for a custom home project"
      },
      {
        "eyebrow": "Whole-Home + Siding",
        "title": "Full-home updates with clean, respectful crews.",
        "description": "Improve layout, curb appeal, efficiency, and comfort with work designed to fit the original home.",
        "image": "/images/service-handshake.png",
        "alt": "Friendly remodeling contractor meeting with a homeowner"
      }
    ] satisfies readonly ProjectXCarouselItem[],
  },
  industries: [
    "Kitchen Remodeling",
    "Bathroom Remodeling",
    "Home Remodeling",
    "Home & Room Additions",
    "ADU Builders",
    "Custom Homes",
    "Siding Replacement"
  ],
  proofPoints: [
    "Family owned",
    "Licensed & insured",
    "Free estimates",
  ],
} as const;
