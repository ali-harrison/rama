export const HERO_LETTERS = ["R", "A", "M", "A"] as const;
export type HeroLetter = (typeof HERO_LETTERS)[number];

export const PROXIMITY_RADIUS = 250;
export const MAX_FREQUENCY = 0.035;
export const MAX_SCALE = 30;

export const MARQUEE_TEXT =
  "RAW SERIES — 06.25 — AOTEAROA — GARMENTS MADE VISIBLE — RAMA — ";

export const PARALLAX_SPEEDS = [-15, -28, -20, -30] as const;
export const PARALLAX_SCRUBS = [1.6, 1.0, 1.3, 0.8] as const;

export interface Garment {
  title: string;
  label: string;
  fabric: string;
  image: string;
}

export const GARMENTS: Garment[] = [
  {
    title: "unfinished Jacket",
    label: "01 — outerwear",
    fabric: "raw linen / exposed selvedge",
    image: "https://i.pinimg.com/736x/b1/0b/f8/b10bf8d87d14786dbe02f03a401b7812.jpg",
  },
  {
    title: "seam Trouser",
    label: "02 — bottoms",
    fabric: "undyed cotton twill",
    image: "https://i1-c.pinimg.com/1200x/34/07/75/340775e52203409836924654659049bd.jpg",
  },
  {
    title: "WARP shirt",
    label: "03 — shirting",
    fabric: "handwoven khadi",
    image: "https://i1-c.pinimg.com/1200x/f1/7a/90/f17a904c123acacea1a27f2654a10b19.jpg",
  },
  {
    title: "fold Coat",
    label: "04 — layering",
    fabric: "washed hemp canvas",
    image: "https://i1-c.pinimg.com/1200x/38/58/c9/3858c9998798be878806d0d0cd946387.jpg",
  },
];

export const MANIFESTO_LINES: string[] = [
  "We don't hide the making.",
  "Every seam is a decision left visible.",
  "Every thread-end a small refusal",
  "to pretend this was born finished.",
  "",
  "RAMA is light —",
  "the kind that shows what's really there.",
  "Not perfection. presence.",
  "",
  "These garments carry the workshop",
  "in their bones. They age.",
  "They soften. They remember",
  "every wear.",
];

export interface ProcessStep {
  number: string;
  title: string;
  text: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "i",
    title: "Source",
    text: "Fibres chosen before they're refined. We work with what the earth offers — unbleached, undyed, unapologetic. Each bolt carries the memory of its field.",
  },
  {
    number: "ii",
    title: "Cut",
    text: "Patterns laid by hand on studio floors. No digital nesting, no optimization. The fabric decides where the scissors go. Waste becomes pocket linings.",
  },
  {
    number: "iii",
    title: "Construct",
    text: "Seams left open where tradition says to close them. Thread tension kept slightly loose — deliberate slack that lets the garment breathe and move with the body, not against it.",
  },
  {
    number: "iv",
    title: "Finish",
    text: "There is no finish. Each garment leaves the workshop in a state of becoming. The wearer completes it. Creases, fades, repairs — these are not damage. They are authorship.",
  },
];
