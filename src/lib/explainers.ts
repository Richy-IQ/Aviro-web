// Plain-language explanations of every number Aviro shows.
//
// A first-time farmer should never meet a term like "FCR" without being able
// to find out, in one tap, what it means and whether their number is good.

export interface Explainer {
  term: string;
  short: string;
  what: string;
  why: string;
  good: string;
}

export const EXPLAINERS = {
  fcr: {
    term: "Feed conversion (FCR)",
    short: "How many kilograms of feed it takes to add one kilogram of bird.",
    what:
      "Divide all the feed you have given by the total live weight of your birds. An FCR of 1.6 means 1.6kg of feed produced 1kg of bird.",
    why:
      "Feed is usually about two thirds of what a cycle costs you. A small improvement here moves your profit more than anything else you can control.",
    good: "Under 1.7 is good. Between 1.7 and 1.8 is workable. Above 1.8 means feed, water or health needs attention.",
  },
  mortality: {
    term: "Mortality",
    short: "The share of birds you started with that have died.",
    what:
      "Every bird that dies has already eaten feed you paid for, so it costs you twice: the chick and everything it consumed.",
    why:
      "Deaths cluster around causes you can fix — brooding temperature, dirty water, a missed vaccination. Tracking the day it happens tells you which.",
    good: "Under 5% across a full cycle is good. Above 7% means something went wrong that is worth finding.",
  },
  costPerBird: {
    term: "Cost per bird",
    short: "Everything you have spent, divided by the birds still alive.",
    what:
      "Includes the chick, all feed, medication, transport and any other spending — shared across the birds you still have.",
    why:
      "This is the number to compare against the price a buyer offers. If you do not know it, you cannot know whether a price is fair.",
    good: "Compare it to your expected selling price per bird. The gap is your profit.",
  },
  projectedProfit: {
    term: "Projected profit",
    short: "What this cycle would earn if you sold today at today's price.",
    what:
      "Your birds' current weight multiplied by today's market rate, minus everything you have spent so far.",
    why:
      "It turns a pen full of birds into a number you can plan around, and shows early whether a cycle is heading the right way.",
    good: "It should climb steadily. If it flattens or falls, feed cost is outrunning weight gain.",
  },
  sellWindow: {
    term: "Best day to sell",
    short: "The day your profit stops growing.",
    what:
      "Birds keep gaining weight, but each extra day costs feed. Aviro projects both forward and finds where the gap between them is widest.",
    why:
      "Selling late is one of the most common and least visible ways to lose money — the birds look bigger, so it feels right.",
    good: "Sell on or close to the marked day. Every day after quietly costs you.",
  },
} as const satisfies Record<string, Explainer>;

export type ExplainerKey = keyof typeof EXPLAINERS;
