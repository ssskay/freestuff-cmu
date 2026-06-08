/**
 * Single source of school-specific configuration.
 *
 * Everything that another school would need to change to fork this site lives
 * here: branding, the category taxonomy, eligibility options, the curated
 * homepage collections, the scenario filters, and the map model. Pages and the
 * data layer read from this module rather than hardcoding values inline.
 */

/**
 * PACK FILES (the full per-school edit surface — see recipes/recipe-fork.md):
 *   src/content/resources.json, src/content/building-footprints.json,
 *   public/tokens.css (--color-accent), public/og.png (generated),
 *   this file (SITE + MAP + taxonomy + collections + scenarios),
 *   agents/verify.config.json.
 * The map's anchor/center/copy now live in MAP below (no longer a constant in
 * map.astro). Everything else is shared engine — do not edit it in a fork; send
 * changes upstream.
 */

import type { Resource } from './lib/catalog';

/** School / site branding. The single place a fork edits to rebrand. */
export const SITE = {
  school: 'Carnegie Mellon',
  name: 'Free Stuff @ Carnegie Mellon',
  tagline: 'Your complete catalog of free perks',
  url: 'https://freestuff-cmu.vercel.app',
  /** Public repo — used for the "fork this" + "report an issue" links. */
  github: 'https://github.com/ssskay/freestuff-cmu',
  /** School email domain, used for form placeholders. Pack value: your school's domain. */
  emailDomain: 'andrew.cmu.edu',
} as const;

/**
 * Bounding box that all geocoded resources must fall within — the catalog-data
 * test asserts every pin is inside it. Pack value: set to your campus's box.
 * CMU is urban: this box covers the Oakland campus core where the pins cluster.
 */
export const CAMPUS_BOUNDS = { minLat: 40.439, maxLat: 40.448, minLng: -79.951, maxLng: -79.939 } as const;

/**
 * The campus map model. Two shapes a school can take:
 *  - Single-anchor (e.g. Dartmouth's Green): one central marker that holds every
 *    "available anywhere" resource — the "from one bench, all the WiFi" conceit.
 *    Set `anchor` to that point + its copy.
 *  - No anchor (e.g. an urban / multi-campus school like CMU): set `anchor: null`.
 *    Online resources then carry no fake pin; they appear under a labeled list
 *    instead, and the map frames purely on the real building pins.
 */
export const MAP = {
  /** Map page hero. */
  title: 'Free stuff, all over campus',
  deck: 'Gyms, museums, makerspaces, a food pantry, the free city bus — plus every online tool your Andrew ID unlocks. Here is where to find it.',
  description:
    'An interactive map of free things around Carnegie Mellon — from the fitness center to the Carnegie Museums to everything online your Andrew ID unlocks.',
  /** Initial view + framing fallback. Centroid of the pinned campus core. */
  center: [40.4435, -79.9442] as [number, number],
  /**
   * Optional single "available anywhere" anchor marker. null = no anchor pin;
   * online resources are listed under `anywhereHeading` instead. CMU is urban
   * with no single green to sit on, so it opts out.
   */
  anchor: null as { lat: number; lng: number; label: string; glyph?: string; blurb: string } | null,
  /** Heading + lead for the no-coordinates ("available anywhere") resource list. */
  anywhereHeading: 'Available anywhere — online & with your Andrew ID',
  anywhereBlurb:
    'Log in from a dorm, a café, or the bus: these are yours from anywhere, no trip across campus required.',
} as const;

/** Allowed resource categories. Mirrors the DB category constraint (run gen:schema). */
export const CATEGORIES = [
  'software',
  'library',
  'career',
  'tepper',
  'health',
  'campus-life',
  'outdoor',
  'transportation',
  'money',
  'alumni-only',
] as const;
export type Category = (typeof CATEGORIES)[number];

/**
 * Student-facing display labels for category slugs. Decouples the human label
 * from the storage slug so jargon ("tepper", "money") reads clearly without a
 * data migration. Falls back to a de-hyphenated slug for unknown values.
 */
export const CATEGORY_LABELS: Record<Category, string> = {
  software: 'Software & Apps',
  library: 'Library & Research',
  career: 'Career',
  tepper: 'Tepper (Business School)',
  health: 'Health & Wellness',
  'campus-life': 'Arts & Campus Life',
  outdoor: 'Outdoor & Adventure',
  transportation: 'Transportation',
  money: 'Funding & Discounts',
  'alumni-only': 'Alumni',
};

export function categoryLabel(slug: string): string {
  return (CATEGORY_LABELS as Record<string, string>)[slug] ?? slug.replace(/-/g, ' ');
}

/** Who a resource can be available to. */
export const ELIGIBILITY = ['student', 'faculty', 'staff', 'alumni', 'public'] as const;
export type Eligibility = (typeof ELIGIBILITY)[number];

/**
 * Issue types a user can report. Single source of truth shared by the client,
 * the data layer, and the DB CHECK constraint.
 */
export const ISSUE_TYPES = [
  'broken-link',
  'wrong-info',
  'outdated',
  'eligibility',
  'other',
] as const;
export type IssueType = (typeof ISSUE_TYPES)[number];

/** Predicate over a resource, used for collection and scenario membership. */
type ResourceMatcher = (r: Pick<Resource, 'id' | 'name' | 'category'>) => boolean;

const nameIncludes =
  (...names: string[]): ResourceMatcher =>
  (r) =>
    names.some((n) => r.name.includes(n));

const idIncludes =
  (...keywords: string[]): ResourceMatcher =>
  (r) =>
    keywords.some((kw) => r.id?.includes(kw));

const inCategory =
  (...cats: string[]): ResourceMatcher =>
  (r) =>
    cats.includes(r.category);

const anyOf =
  (...matchers: ResourceMatcher[]): ResourceMatcher =>
  (r) =>
    matchers.some((m) => m(r));

/**
 * Curated homepage collections. Membership is computed server-side over the
 * normalized catalog (where `id` is the stable slug), then serialized to the
 * client so filtering matches by membership rather than re-deriving by category.
 */
export const CURATED_COLLECTIONS: Array<{ key: string; label: string; match: ResourceMatcher }> = [
  {
    key: 'software',
    label: 'Software & Cloud',
    match: anyOf(inCategory('software'), nameIncludes('LinkedIn Learning', "O'Reilly")),
  },
  {
    key: 'creative',
    label: 'For Creatives',
    match: anyOf(
      nameIncludes('Adobe', 'IDeATe', 'Miller', 'Frame', 'School of Music', 'School of Drama', 'Arts Pass')
    ),
  },
  {
    key: 'data',
    label: 'Data & Finance',
    match: nameIncludes('MATLAB', 'Mathematica', 'Bloomberg', 'WRDS', 'Capital IQ', 'Data & Code', 'Research Databases'),
  },
  {
    key: 'research',
    label: 'Research & Writing',
    match: anyOf(inCategory('library'), nameIncludes("O'Reilly", 'Interlibrary')),
  },
  {
    key: 'wellness',
    label: 'Health & Recreation',
    match: anyOf(inCategory('health'), nameIncludes('Intramural', 'Explorers')),
  },
  {
    key: 'career',
    label: 'Career & Professional',
    match: anyOf(inCategory('career'), inCategory('tepper'), nameIncludes('LinkedIn Learning')),
  },
];

/**
 * Scenario filters. Each scenario page renders its own hero/copy but pulls its
 * resource set from here so the membership rules live in one place.
 */
export const SCENARIOS: Record<string, { match: ResourceMatcher }> = {
  'grad-school': {
    match: nameIncludes(
      'Research Databases',
      'Interlibrary',
      "O'Reilly",
      'Counseling',
      'TimelyCare',
      'KiltHub',
      'Data & Code',
      'Digital Collections'
    ),
  },
  'job-hunt': {
    match: anyOf(
      inCategory('career'),
      inCategory('tepper'),
      nameIncludes('LinkedIn Learning', 'Handshake', 'Printing')
    ),
  },
  'data-analysis': {
    match: nameIncludes(
      'MATLAB',
      'Mathematica',
      'Bloomberg',
      'WRDS',
      'Capital IQ',
      'Data & Code',
      'Research Databases'
    ),
  },
  creative: {
    match: nameIncludes(
      'Adobe',
      'IDeATe',
      'Miller',
      'Frame',
      'School of Music',
      'School of Drama',
      'Arts Pass'
    ),
  },
  adventure: {
    match: anyOf(
      nameIncludes('Arts Pass', 'Explorers', 'Pittsburgh Regional', 'NightSafe', 'Intramural', 'Zipcar', 'Miller')
    ),
  },
  'save-money': {
    match: anyOf(
      inCategory('money'),
      nameIncludes('Pittsburgh Regional', 'Headspace', 'Pantry', 'Printing')
    ),
  },
};

/** Metadata for the scenarios hub page. */
export const SCENARIO_CARDS = [
  { slug: 'grad-school', icon: '📚', title: 'Applying to grad school?', blurb: 'Research databases, writing support, KiltHub, and free counseling for the most important proposal of your life.' },
  { slug: 'job-hunt', icon: '💼', title: 'Job hunting?', blurb: 'Handshake, lifelong career coaching, LinkedIn Learning, and a $25k Bloomberg Terminal.' },
  { slug: 'data-analysis', icon: '📊', title: 'Running data analysis?', blurb: 'MATLAB, Mathematica, WRDS, S&P Capital IQ, and Bloomberg Terminals across campus.' },
  { slug: 'creative', icon: '🎨', title: 'Building a portfolio?', blurb: "Adobe Creative Cloud, IDeATe's laser cutters and 3D printers, and the Miller ICA." },
  { slug: 'adventure', icon: '🏙️', title: 'New to Pittsburgh?', blurb: 'Free transit anywhere in the city, the Arts Pass to eight museums, and the Explorers Club.' },
  { slug: 'save-money', icon: '💰', title: 'Tight on cash?', blurb: 'Free bus rides, the CMU Pantry, $40/semester printing, and emergency support grants.' },
] as const;
