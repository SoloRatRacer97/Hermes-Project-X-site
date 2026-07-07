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
  hydratedFrom: "https://example.com/golden-gate-mortgage-advisors",
  hydratedAt: "2026-07-01T00:00:00.000Z",
  templateContract: [
    "Keep the section order, component structure, and form fields consistent across instances.",
    "Only business labels, service options, image assets, and form routing should change per business.",
    "Use the client brand palette and professional service imagery without changing the landing-page structure.",
    "Use professional local-service imagery for every instance; do not ship text-only or layout-rebuilt variants.",
  ],
  brand: {
    name: "Golden Gate Mortgage Advisors",
    mark: "GG",
    poweredBy: "San Francisco, CA",
    footerDescription: "Mortgage guidance for San Francisco buyers, homeowners, and investors.",
  },
  theme: createProjectXTheme({
    primary: "#12355B",
    secondary: "#0E2238",
    warmAccent: "#C8A45D",
  }),
  integration: {
    formWebhookUrl: "server",
    formSource: "golden-gate-mortgage-advisors",
  },
  images: {
    hero: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=80",
    contact: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80",
    carousel: [
      {
        "eyebrow": "Purchase Loans",
        "title": "Pre-approval support for competitive San Francisco offers.",
        "description": "Get the next lending step organized before the offer deadline, document request, or agent conversation gets rushed.",
        "image": "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
        "alt": "Residential homes representing San Francisco mortgage purchase guidance"
      },
      {
        "eyebrow": "Refinance Review",
        "title": "Compare payment, term, and cash-out refinance goals.",
        "description": "Talk through why you are refinancing and what details the lending team needs before numbers get serious.",
        "image": "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1400&q=80",
        "alt": "Financial paperwork representing refinance loan guidance"
      },
      {
        "eyebrow": "Jumbo + Complex Files",
        "title": "Loan scenario review for Bay Area price points.",
        "description": "Jumbo, condo, TIC, and complex-income files need careful routing before anyone promises a path forward.",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
        "alt": "San Francisco financial district buildings representing jumbo mortgage guidance"
      },
      {
        "eyebrow": "Investor Scenarios",
        "title": "Rental, second-home, and investment property loan conversations.",
        "description": "Sort out loan purpose, property type, down payment assumptions, and timing before the file moves deeper.",
        "image": "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?auto=format&fit=crop&w=1400&q=80",
        "alt": "Mortgage documents and keys representing investment property loan guidance"
      }
    ] satisfies readonly ProjectXCarouselItem[],
  },
  industries: [
    "Home Purchase Loans",
    "Mortgage Pre-Approval",
    "Refinance Loans",
    "Jumbo Loan Guidance",
    "Investment Property Loans"
  ],
  proofPoints: [
    "San Francisco mortgage guidance",
    "Purchase and refinance support",
    "No rate or approval promises over text",
  ],
} as const;
