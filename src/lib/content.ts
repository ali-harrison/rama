export const HERO_LETTERS = ["R", "A", "M", "A"] as const;
export type HeroLetter = (typeof HERO_LETTERS)[number];

export const PROXIMITY_RADIUS = 250;
export const MAX_FREQUENCY = 0.035;
export const MAX_SCALE = 30;

// The page is one day of light passing over the garments.
// Each chapter owns a sky; the backdrop scrubs between them on scroll.
export interface Chapter {
  id: string;
  label: string;
  time: string;
  skyTop: string;
  skyBottom: string;
  ink: string;
}

export const INK_DARK = "#1F1E1C";
export const INK_LIGHT = "#F1ECE2";

export const CHAPTERS: Chapter[] = [
  { id: "first-light", label: "First light", time: "05:42", skyTop: "#AEB8C2", skyBottom: "#EDE6DB", ink: INK_DARK },
  { id: "manifesto", label: "Manifesto", time: "08:15", skyTop: "#E3CFA6", skyBottom: "#F3EEE4", ink: INK_DARK },
  { id: "collection", label: "Collection", time: "12:00", skyTop: "#C6D3D9", skyBottom: "#F2F0EA", ink: INK_DARK },
  { id: "workshop", label: "Workshop", time: "17:48", skyTop: "#D6935A", skyBottom: "#F0D3B3", ink: INK_DARK },
  // Lookbook brings its own backdrop, so its sky only shows in the blend above it
  { id: "lookbook", label: "Lookbook", time: "20:56", skyTop: "#9A7F8C", skyBottom: "#E2BFAE", ink: INK_LIGHT },
];

export const chapter = (id: string) => CHAPTERS.find((c) => c.id === id)!;

const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

// Floating image placement is expressed in grid columns (of 12) so every frame
// lands on a gridline. `top` is relative to the chapter; `speed` drives parallax.
export interface FloatShot {
  src: string;
  alt: string;
  fig: string;
  caption: string;
  col: number;
  span: number;
  top: string;
  speed: number;
  ratio?: string;
}

export const FIRST_LIGHT_SHOTS: FloatShot[] = [
  {
    src: unsplash("1490481651871-ab68de25d43d"),
    alt: "Pale linen and cotton garments airing on a white rail",
    fig: "fig. 01",
    caption: "linen, airing out",
    col: 0,
    span: 3,
    top: "30%",
    speed: -60,
  },
  {
    src: unsplash("1418065460487-3e41a6c84dc5"),
    alt: "Pine forest dissolving into morning fog",
    fig: "fig. 02",
    caption: "05:42, mist",
    col: 9,
    span: 2,
    top: "7%",
    speed: -140,
  },
  {
    src: unsplash("1470071459604-3b5ec3a7fe05"),
    alt: "Low cloud rolling over green hills at sunrise",
    fig: "fig. 03",
    caption: "first light on the ridge",
    col: 9,
    span: 3,
    top: "62%",
    speed: -30,
    ratio: "4/5",
  },
];

export const MANIFESTO_SHOTS: FloatShot[] = [
  {
    src: unsplash("1434389677669-e08b4cac3105"),
    alt: "Undyed knit poncho hanging against a pale wall",
    fig: "fig. 04",
    caption: "undyed, unhemmed",
    col: 1,
    span: 2,
    top: "12%",
    speed: -110,
  },
  {
    src: unsplash("1558171813-4c088753af8f"),
    alt: "Washed chambray shirt draped over a workshop chair",
    fig: "fig. 05",
    caption: "left where it was taken off",
    col: 9,
    span: 3,
    top: "46%",
    speed: -50,
  },
];

export const WORKSHOP_SHOTS: FloatShot[] = [
  {
    src: unsplash("1445205170230-053b83016050"),
    alt: "Rail of neutral garments in a window-lit studio",
    fig: "fig. 10",
    caption: "the rail, 17:48",
    col: 0,
    span: 2,
    top: "4%",
    speed: -120,
  },
  {
    src: unsplash("1558769132-cb1aea458c5e"),
    alt: "Oat and cream knitwear hanging beside dried grasses",
    fig: "fig. 11",
    caption: "wool, resting",
    col: 10,
    span: 2,
    top: "10%",
    speed: -70,
  },
];

export const LOOKBOOK_BACKDROP = {
  src: unsplash("1506905925346-21bda4d32df4", 2400),
  alt: "Mountain peaks above a sea of cloud at dusk",
};

export interface Garment {
  title: string;
  label: string;
  fabric: string;
  image: string;
}

export const GARMENTS: Garment[] = [
  {
    title: "Unfinished jacket",
    label: "01 — outerwear",
    fabric: "raw linen / exposed selvedge",
    image: "https://i.pinimg.com/736x/b1/0b/f8/b10bf8d87d14786dbe02f03a401b7812.jpg",
  },
  {
    title: "Seam trouser",
    label: "02 — bottoms",
    fabric: "undyed cotton twill",
    image: "https://i1-c.pinimg.com/1200x/34/07/75/340775e52203409836924654659049bd.jpg",
  },
  {
    title: "Warp shirt",
    label: "03 — shirting",
    fabric: "handwoven khadi",
    image: "https://i1-c.pinimg.com/1200x/f1/7a/90/f17a904c123acacea1a27f2654a10b19.jpg",
  },
  {
    title: "Fold coat",
    label: "04 — layering",
    fabric: "washed hemp canvas",
    image: "https://i1-c.pinimg.com/1200x/38/58/c9/3858c9998798be878806d0d0cd946387.jpg",
  },
];

export const MANIFESTO = {
  heading: "We don't hide the making.",
  body: "Every seam is a decision left visible. Every thread-end a small refusal to pretend this was born finished.",
  light: "RAMA is light — the kind that shows what's really there.",
  aside: "Not perfection. Presence.",
};

export interface ProcessStep {
  number: string;
  title: string;
  text: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "i",
    title: "Source",
    text: "Fibres chosen before they're refined. Unbleached, undyed, unapologetic. Each bolt carries the memory of its field.",
  },
  {
    number: "ii",
    title: "Cut",
    text: "Patterns laid by hand on the studio floor. The fabric decides where the scissors go. Waste becomes pocket linings.",
  },
  {
    number: "iii",
    title: "Construct",
    text: "Seams left open where tradition says to close them. Thread tension kept loose — slack that lets the garment move with the body.",
  },
  {
    number: "iv",
    title: "Finish",
    text: "There is no finish. The wearer completes it. Creases, fades, repairs — not damage. Authorship.",
  },
];
