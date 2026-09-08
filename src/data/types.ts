export interface SiteConfig {
  name: string;
  tagline: string;
  erid?: string;
  city: string;
  city_in: string;
  country: string;
  country_in: string;
  year: number;
  hero_emojis: string[];
  hero_h1: string;
  hero_sub: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RefLink {
  name: string;
  url: string;
}

export interface Profession {
  slug: string;
  title: string;
  title_ins: string;
  emoji: string;
  short: string;
  salary: string;
  salary_min: number;
  salary_max: number;
  experience: string;
  schedule: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  faq: FaqItem[];
  links: { name: string; url: string }[];
  intents?: { h: string; p: string }[];
  hue?: number;
  category?: string;
  geo?: string;
}

export interface City {
  slug: string;
  name: string;
  name_in: string;
}

export interface Offer {
  id: number;
  company: string;
  role: string;
  type: 'lead' | 'sale';
  goal: string;
  payout: string;
  hold: number;
  geo: string;
  status: string;
  link?: string;
  category?: string;
  profession?: string;
}

export interface SiteData {
  domain: string;
  site: SiteConfig;
  faq: FaqItem[];
  professions: Profession[];
  offers: Offer[];
}
