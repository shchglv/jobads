import type { City, Offer, Profession, SiteConfig } from './types';
import raw from './professions.json';

export const site: SiteConfig = raw.site as SiteConfig;
export const offers: Offer[] = (raw.offers as Offer[]) ?? [];
export const cities: City[] = (raw.cities as City[]) ?? [];

export const OFFER_CATEGORIES = [...new Set(offers.map((o) => o.category ?? 'Другое'))];

/** Группирует офферы с одинаковой компанией и ролью: сливает гео, остальное берёт из первого. */
export function groupOffers(list: Offer[]): Offer[] {
  const map = new Map<string, Offer>();
  for (const o of list) {
    const key = `${o.company}|${o.role}`;
    const existing = map.get(key);
    if (existing) {
      const geos = new Set(
        [...existing.geo.split(','), ...o.geo.split(',')].map((s) => s.trim()).filter(Boolean),
      );
      existing.geo = [...geos].join(', ');
    } else {
      map.set(key, { ...o });
    }
  }
  return [...map.values()];
}

/** Реальная ли это партнёрская ссылка (не заглушка example.com). */
export function isLiveLink(url: string): boolean {
  return !url.includes('example.com');
}

/** Покрывает ли оффер данный город (по полю geo). */
export function offerCoversCity(offer: Offer, cityName: string): boolean {
  const geo = (offer.geo ?? '').toLowerCase();
  const city = cityName.trim().toLowerCase();
  if (!geo) return true;
  if (geo.includes('росси')) return true; // «Россия» — вся страна
  return geo.split(',').some((g) => g.trim() === city || g.includes(city));
}

export function cityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

const CATEGORY: Record<string, string> = {
  courier: 'Доставка',
  'courier-auto': 'Доставка',
  'taxi-driver': 'Транспорт',
  'driver-b': 'Транспорт',
  'driver-c': 'Транспорт',
  storekeeper: 'Склад',
  picker: 'Склад',
  loader: 'Склад',
  packer: 'Склад',
  forklift: 'Склад',
  seller: 'Торговля',
  'call-center': 'Офис',
  'mobilnyi-bankir': 'Продажи',
  'alfa-agent': 'Продажи',
  'menedzher-razvitie': 'Продажи',
  'predstavitel-ul': 'Продажи',
  'kliner': 'Клининг',
};

const HUES = [232, 262, 21, 152, 190, 330, 42, 262, 21, 152, 232, 190];

export const professions: Profession[] = (raw.professions as Profession[]).map((p, i) => ({
  ...p,
  category: CATEGORY[p.slug] ?? 'Другое',
  featured: i < 3,
  hue: HUES[i % HUES.length],
}));

export const CATEGORIES = [...new Set(professions.map((p) => p.category))];

export function bySlug(slug: string): Profession | undefined {
  return professions.find((p) => p.slug === slug);
}

export function related(slug: string, count = 3): Profession[] {
  const idx = professions.findIndex((p) => p.slug === slug);
  return professions.filter((_, i) => i !== idx).slice(0, count);
}
