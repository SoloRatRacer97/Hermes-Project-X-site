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
    name: "ChatSales versus Hermes",
    mark: "CS",
    poweredBy: "AI sales follow-up comparison",
    footerDescription: "A side-by-side landing page for comparing fast ChatSales follow-up against the Hermes workflow.",
  },
  theme: createProjectXTheme({
    primary: "#27a4ff",
    secondary: "#0b2542",
  }),
  integration: {
    formWebhookUrl: "https://hooks.zapier.com/hooks/catch/26623925/uj1eyis/",
    formSource: "chatsales-versus-hermes",
  },
  images: {
    hero: "/images/hero-blue-collar-team.png",
    contact: "/images/service-handshake.png",
    carousel: [
      {
        "eyebrow": "Speed-to-lead",
        "title": "Respond while the lead is still thinking about the job.",
        "description": "ChatSales versus Hermes starts with the first minute: how quickly the system acknowledges intent, asks the right question, and keeps the customer moving.",
        "image": "/images/hvac-plumbing.png",
        "alt": "Service technicians preparing for a fast customer follow-up workflow"
      },
      {
        "eyebrow": "Qualification",
        "title": "Collect useful details without sounding like a script.",
        "description": "The comparison highlights how ChatSales can qualify intent, urgency, location, and service fit while avoiding repeated questions and dead-end form logic.",
        "image": "/images/hvac-plumbing.png",
        "alt": "Residential service professionals reviewing customer details before handoff"
      },
      {
        "eyebrow": "Handoff",
        "title": "Move qualified conversations to the right human at the right time.",
        "description": "Show where Hermes-style automation stops, where ChatSales keeps context intact, and how owners or estimators get cleaner conversations.",
        "image": "/images/construction-handyman.png",
        "alt": "Service team reviewing a qualified lead handoff"
      },
      {
        "eyebrow": "Reliability",
        "title": "Keep the workflow useful when one path fails.",
        "description": "A good comparison includes fallback behavior, escalation rules, and recovery paths so prospects can see how the system behaves under pressure.",
        "image": "/images/service-handshake.png",
        "alt": "Friendly service professional confirming a reliable customer handoff"
      }
    ] satisfies readonly ProjectXCarouselItem[],
  },
  industries: [
    "Speed-to-Lead",
    "AI Text Follow-Up",
    "Lead Qualification",
    "Human Handoff",
    "Fallback Routing",
    "Service Business Sales"
  ],
  proofPoints: [
    "ChatSales versus Hermes",
    "Built for service leads",
    "Demo-ready comparison",
  ],
} as const;
