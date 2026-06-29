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

function createProjectXTheme({
  primary,
  secondary,
  warmAccent,
}: {
  primary: HexColor;
  secondary: HexColor;
  warmAccent?: HexColor;
}) {
  const tertiary = mixHexColors(primary, FIXED_WHITE, 0.24);
  const accent = warmAccent || tertiary;

  return {
    primary,
    secondary,
    tertiary,
    warmAccent: accent,
    white: FIXED_WHITE,
    black: FIXED_BLACK,
    bg: "#faf8f2",
    bgSoft: "#fff5cb",
    muted: alpha(FIXED_BLACK, 0.66),
    muted2: alpha(FIXED_BLACK, 0.5),
    line: alpha(FIXED_BLACK, 0.12),
    heroOverlay:
      `radial-gradient(circle at 74% 26%, ${alpha(accent, 0.34)}, transparent 22%), ` +
      `radial-gradient(circle at 18% 78%, rgba(236, 34, 39, 0.22), transparent 26%), ` +
      `linear-gradient(90deg, ${alpha(FIXED_BLACK, 0.9)} 0%, ${alpha(secondary, 0.72)} 42%, ${alpha(secondary, 0.22)} 72%, ${alpha(FIXED_BLACK, 0.18)} 100%)`,
    heroOverlayMobile: `linear-gradient(90deg, ${alpha(FIXED_BLACK, 0.9)}, ${alpha(secondary, 0.74)})`,
    contactOverlay: `linear-gradient(135deg, ${alpha(FIXED_BLACK, 0.86)}, rgba(236, 34, 39, 0.7))`,
  };
}

export const projectXConfig = {
  hydratedFrom: "https://www.huronautomotivegb.com/",
  hydratedAt: "2026-06-10T19:35:05.086Z",
  templateContract: [
    "Keep the section order, component structure, and form fields consistent across instances.",
    "Only business labels, service options, image assets, and form routing should change per business.",
    "Use the client brand palette and professional service imagery without changing the landing-page structure.",
    "Use professional local-service imagery for every instance; do not ship text-only or layout-rebuilt variants.",
  ],
  brand: {
    name: "Huron Automotive",
    mark: "HA",
    poweredBy: "Green Bay, WI",
    footerDescription: "Auto maintenance, repair, and tire service for Green Bay drivers since 2010.",
  },
  theme: createProjectXTheme({
    primary: "#283C92",
    secondary: "#2D3940",
    warmAccent: "#FACE61",
  }),
  integration: {
    formWebhookUrl: "https://hooks.zapier.com/hooks/catch/26623925/436ykxu/",
    formSource: "huron-automotive",
  },
  images: {
    hero: "https://cdn-ilcjgcd.nitrocdn.com/SrKwTohklcgfLSfKwkxrFBZLcDTlTBNe/assets/images/optimized/rev-83c8686/www.huronautomotivegb.com/wp-content/uploads/2025/10/Huron-Automotive-Storefront.jpg",
    contact: "https://cdn-ilcjgcd.nitrocdn.com/SrKwTohklcgfLSfKwkxrFBZLcDTlTBNe/assets/images/optimized/rev-83c8686/www.huronautomotivegb.com/wp-content/uploads/2026/01/%E2%80%A2260430-2233-scaled.jpg",
    carousel: [
      {
        "eyebrow": "Auto Maintenance",
        "title": "Oil changes, scheduled maintenance, and everyday vehicle care.",
        "description": "Keep your car running smoothly with a local Green Bay team that explains the work clearly before anything moves forward.",
        "image": "https://cdn-ilcjgcd.nitrocdn.com/SrKwTohklcgfLSfKwkxrFBZLcDTlTBNe/assets/images/optimized/rev-83c8686/www.huronautomotivegb.com/wp-content/uploads/2026/05/%E2%80%A2260430-2368-1-scaled.jpg",
        "alt": "Huron Automotive technician working on a vehicle in the shop"
      },
      {
        "eyebrow": "Tires + Wheels",
        "title": "Tire installation, repair, rotation, balancing, and alignment.",
        "description": "Huron Automotive sells name-brand tires and handles the tire services Green Bay drivers need through every season.",
        "image": "https://cdn-ilcjgcd.nitrocdn.com/SrKwTohklcgfLSfKwkxrFBZLcDTlTBNe/assets/images/optimized/rev-83c8686/www.huronautomotivegb.com/wp-content/uploads/2025/08/ban-range.png",
        "alt": "Vehicle tires and wheels representing Huron Automotive tire services"
      },
      {
        "eyebrow": "Diagnostics + Repair",
        "title": "Check engine lights, brake repairs, cooling systems, and more.",
        "description": "ASE-certified mechanics help pinpoint what is going on and walk you through the service your vehicle needs.",
        "image": "https://cdn-ilcjgcd.nitrocdn.com/SrKwTohklcgfLSfKwkxrFBZLcDTlTBNe/assets/images/optimized/rev-83c8686/www.huronautomotivegb.com/wp-content/uploads/2026/05/%E2%80%A2260430-2275-scaled.jpg",
        "alt": "Huron Automotive shop team diagnosing and repairing a vehicle"
      },
      {
        "eyebrow": "Fleet Support",
        "title": "Maintenance and repair support for business vehicles.",
        "description": "Fleet service helps Green Bay businesses reduce downtime and keep trucks, vans, and daily drivers on the road.",
        "image": "https://cdn-ilcjgcd.nitrocdn.com/SrKwTohklcgfLSfKwkxrFBZLcDTlTBNe/assets/images/optimized/rev-83c8686/www.huronautomotivegb.com/wp-content/uploads/2025/10/Huron-Automotive-Storefront.jpg",
        "alt": "Huron Automotive storefront in Green Bay"
      }
    ] satisfies readonly ProjectXCarouselItem[],
  },
  industries: [
    "Oil Change & Maintenance",
    "Brake Repair & Service",
    "Engine Diagnostics & Repair",
    "Tire Installation & Alignment",
    "Fleet Vehicle Service"
  ],
  proofPoints: [
    "Two Green Bay locations",
    "ASE-certified mechanics",
    "No surprise work without approval",
  ],
} as const;
