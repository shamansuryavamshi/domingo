export interface Review {
  id: string;
  text: string;
  name: string;
  date: string;
  product: string;
  featured?: boolean;
}

export const MAX_SHOWN = 4;

export const reviews: Review[] = [
  {
    id: "placeholder-1",
    text: "Add the first Domingo review here. Swap this placeholder for a real customer's words — the layout and typography are already built around it.",
    name: "First reviewer",
    date: "Sunday",
    product: "Crème Brûlée",
    featured: true,
  },
  {
    id: "placeholder-2",
    text: "Add another review in lib/reviews.ts. Replace this text and the display name with a real review when it lands.",
    name: "Second reviewer",
    date: "Sunday",
    product: "Weekly special",
  },
  {
    id: "placeholder-3",
    text: "Reviews are pulled from this data file — no page code needs to change when new words arrive.",
    name: "Third reviewer",
    date: "Sunday",
    product: "Weekly special",
  },
  {
    id: "placeholder-4",
    text: "Keep the tone short, personal and specific — the studio makes a single dessert each week.",
    name: "Fourth reviewer",
    date: "Sunday",
    product: "Weekly special",
  },
];