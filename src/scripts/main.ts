/* Интерактив: тема, фильтры, живой поиск, reveal-анимации */

// --- Текущий город в шапке ---
const cityLabel = document.querySelector('[data-current-city]');
if (cityLabel) {
  const fromBody = document.body.dataset.cityName;
  cityLabel.textContent = fromBody || 'Москва';
}

// --- Тема ---
const root = document.documentElement;
const stored = localStorage.getItem('theme');
if (stored === 'dark') root.setAttribute('data-theme', 'dark');

document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
});

// --- Reveal при скролле ---
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// --- Ротация слов в заголовке каталога ---
const rotator = document.querySelector('[data-rotate]');
if (rotator) {
  const words = ['курьером', 'водителем', 'кладовщиком', 'грузчиком', 'мобильным банкиром', 'продавцом', 'упаковщиком', 'оператором'];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % words.length;
    rotator.classList.add('is-fading');
    setTimeout(() => {
      rotator.textContent = words[i];
      rotator.classList.remove('is-fading');
    }, 300);
  }, 2600);
}

// --- Каталог: фильтры по категориям + живой поиск ---
const chips = document.querySelectorAll('[data-filter]');
const searchInput = document.querySelector('[data-search]');
const cards = Array.from(document.querySelectorAll('[data-job], [data-offer]'));
const emptyState = document.querySelector('[data-empty]');
const countEl = document.querySelector('[data-count]');

let activeFilter = 'all';
let query = '';

function applyFilters() {
  let visible = 0;
  cards.forEach((card) => {
    const cat = card.dataset.category || '';
    const hay = (card.dataset.search || '').toLowerCase();
    const matchCat = activeFilter === 'all' || cat === activeFilter;
    const matchQuery = query === '' || hay.includes(query);
    const show = matchCat && matchQuery;
    card.classList.toggle('is-hidden', !show);
    if (show) visible++;
  });
  if (emptyState) emptyState.classList.toggle('is-visible', visible === 0);
  if (countEl) countEl.textContent = `${visible} из ${cards.length}`;
}

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter || 'all';
    applyFilters();
  });
});

if (searchInput) {
  searchInput.addEventListener('input', () => {
    query = searchInput.value.trim();
    applyFilters();
  });
}
applyFilters();
