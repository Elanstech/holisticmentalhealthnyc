/* ============================================================
   HOLISTIC MENTAL HEALTH SERVICES
   script.js — no external dependencies.

   01  Config
   02  Promo bar + offer window clock
   03  Header: sticky, scrollspy, drawer, smooth anchors
   04  Hero video (lazy, connection-aware)
   05  Reveal on scroll
   06  Stat counters
   07  Carousel (services / team / stories)
   08  Modal manager (services, Therapy P.L.U.S., neurofeedback)
   09  FAQ filter
   10  Floating actions
   11  Bootstrap
   ============================================================ */


/* ============================================================
   01  CONFIG
   ------------------------------------------------------------
   The contact form is an Elfsight embed — its recipients are
   configured in the Elfsight dashboard, not here.

   OFFER_WINDOW controls the live "offer window" indicator in
   the promo bar and the offer card. Hours are 24-hour local time.
   ============================================================ */

const CONFIG = {
  offerWindow: { open: 9, close: 14 }   // 9:00 AM – 2:00 PM
};


/* ============================================================
   02  PROMO BAR + OFFER WINDOW CLOCK
   ============================================================ */

class OfferWindow {
  constructor() {
    this.bar = document.getElementById('promoBar');
    this.close = document.getElementById('promoClose');
    this.tag = document.getElementById('promoStatus');
    this.tagText = this.tag ? this.tag.querySelector('.promo-status-text') : null;
    this.clock = document.getElementById('offerClock');
    this.clockState = document.getElementById('offerClockState');

    this.restoreDismissal();
    if (this.close) this.close.addEventListener('click', () => this.dismiss());

    this.update();
    setInterval(() => this.update(), 60000);
  }

  restoreDismissal() {
    try {
      if (sessionStorage.getItem('promoDismissed') === '1' && this.bar) {
        this.bar.classList.add('is-dismissed');
      }
    } catch (e) { /* storage unavailable — leave the bar visible */ }
  }

  dismiss() {
    if (this.bar) this.bar.classList.add('is-dismissed');
    try { sessionStorage.setItem('promoDismissed', '1'); } catch (e) {}
  }

  isOpen() {
    const hour = new Date().getHours();
    return hour >= CONFIG.offerWindow.open && hour < CONFIG.offerWindow.close;
  }

  update() {
    const open = this.isOpen();

    if (this.tag) {
      this.tag.classList.toggle('is-open', open);
      if (this.tagText) this.tagText.textContent = open ? 'Open now' : '9am–2pm offer';
    }

    if (this.clock && this.clockState) {
      this.clock.classList.toggle('is-open', open);
      this.clockState.textContent = open
        ? 'Booking window open now — closes at 2:00 PM'
        : 'Opens again at 9:00 AM';
    }
  }
}


/* ============================================================
   03  HEADER
   ============================================================ */

class Header {
  constructor() {
    this.header = document.getElementById('siteHeader');
    this.rail = document.getElementById('scrollRail');
    this.toggle = document.getElementById('navToggle');
    this.drawer = document.getElementById('drawer');
    this.scrim = document.getElementById('drawerScrim');
    this.closeBtn = document.getElementById('drawerClose');
    this.links = Array.from(document.querySelectorAll('[data-nav]'));
    this.sections = this.links
      .map(a => document.getElementById(a.getAttribute('data-nav')))
      .filter(Boolean);
    this.ticking = false;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.onScroll();

    if (this.toggle) this.toggle.addEventListener('click', () => this.toggleDrawer());
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeDrawer());
    if (this.scrim) this.scrim.addEventListener('click', () => this.closeDrawer());

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.drawerOpen) this.closeDrawer();
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        this.closeDrawer();
        this.scrollTo(target);
        history.replaceState(null, '', id);
      });
    });
  }

  scrollTo(target) {
    const offset = this.header ? this.header.offsetHeight + 12 : 100;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
  }

  onScroll() {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      const y = window.pageYOffset;
      if (this.header) this.header.classList.toggle('is-stuck', y > 30);
      if (this.rail) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        this.rail.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
      }
      this.spy(y);
      this.ticking = false;
    });
  }

  spy(y) {
    const line = y + (this.header ? this.header.offsetHeight : 90) + 90;
    let current = null;
    this.sections.forEach(section => { if (section.offsetTop <= line) current = section.id; });
    this.links.forEach(link => link.classList.toggle('is-active', link.getAttribute('data-nav') === current));
  }

  toggleDrawer() { this.drawerOpen ? this.closeDrawer() : this.openDrawer(); }

  openDrawer() {
    this.drawerOpen = true;
    this.drawer.classList.add('is-open');
    this.drawer.setAttribute('aria-hidden', 'false');
    this.scrim.hidden = false;
    requestAnimationFrame(() => this.scrim.classList.add('is-open'));
    this.toggle.classList.add('is-open');
    this.toggle.setAttribute('aria-expanded', 'true');
    this.toggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('is-locked');
  }

  closeDrawer() {
    if (!this.drawerOpen) return;
    this.drawerOpen = false;
    this.drawer.classList.remove('is-open');
    this.drawer.setAttribute('aria-hidden', 'true');
    this.scrim.classList.remove('is-open');
    setTimeout(() => { this.scrim.hidden = true; }, 300);
    this.toggle.classList.remove('is-open');
    this.toggle.setAttribute('aria-expanded', 'false');
    this.toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('is-locked');
  }
}


/* ============================================================
   04  HERO VIDEO
   ------------------------------------------------------------
   The <source> carries data-src, so the browser downloads
   nothing until we decide it's worth it: desktop only, in
   view, not on a metered or slow connection, motion allowed.
   ============================================================ */

class HeroVideo {
  constructor() {
    this.video = document.getElementById('heroVideo');
    this.hero = document.querySelector('.hero');
    if (!this.video || !this.hero) return;
    this.loaded = false;
    this.init();
  }

  shouldSkip() {
    if (window.innerWidth <= 768) return true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    const c = navigator.connection;
    if (c && (c.saveData || /2g/.test(c.effectiveType || ''))) return true;
    return false;
  }

  init() {
    if (this.shouldSkip()) return; // gradient fallback stays

    if (!('IntersectionObserver' in window)) { this.load(); return; }

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.load();
        } else if (this.loaded) {
          this.video.pause();
        }
      });
    }, { threshold: 0.15 });
    io.observe(this.hero);

    document.addEventListener('visibilitychange', () => {
      if (!this.loaded) return;
      document.hidden ? this.video.pause() : this.video.play().catch(() => {});
    });

    this.video.addEventListener('playing', () => this.video.classList.add('is-playing'), { once: true });
    this.video.addEventListener('error', () => this.video.remove());
  }

  load() {
    if (this.loaded) return;
    this.loaded = true;
    const source = this.video.querySelector('source[data-src]');
    if (source) {
      source.src = source.getAttribute('data-src');
      source.removeAttribute('data-src');
      this.video.load();
    }
    this.video.play().catch(() => {
      this.video.muted = true;
      this.video.play().catch(() => this.video.remove());
    });
  }
}


/* ============================================================
   05  REVEAL ON SCROLL
   ============================================================ */

class Reveal {
  constructor(selector = '.reveal') {
    const items = document.querySelectorAll(selector);
    if (!items.length || !('IntersectionObserver' in window)) {
      items.forEach(i => i.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('is-in'), i * 70);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    items.forEach(i => io.observe(i));
  }
}


/* ============================================================
   06  STAT COUNTERS
   ============================================================ */

class Counters {
  constructor() {
    const nums = document.querySelectorAll('.stat-num');
    if (!nums.length) return;
    if (!('IntersectionObserver' in window)) {
      nums.forEach(n => this.finish(n));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        this.run(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    nums.forEach(n => io.observe(n));
  }

  finish(el) {
    el.textContent = `${el.getAttribute('data-target')}${el.getAttribute('data-suffix') || ''}`;
  }

  run(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}


/* ============================================================
   07  CAROUSEL
   ============================================================ */

class Carousel {
  constructor(root) {
    this.root = root;
    this.viewport = root.querySelector('.carousel-viewport');
    this.track = root.querySelector('.carousel-track');
    this.prev = root.querySelector('[data-dir="prev"]');
    this.next = root.querySelector('[data-dir="next"]');
    this.dotsBox = root.querySelector('.carousel-dots');
    if (!this.viewport || !this.track) return;
    this.targets = [0];
    this.init();
  }

  init() {
    this.measure();
    this.buildDots();
    if (this.prev) this.prev.addEventListener('click', () => this.step(-1));
    if (this.next) this.next.addEventListener('click', () => this.step(1));
    this.viewport.addEventListener('scroll', () => this.onScroll(), { passive: true });

    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => { this.measure(); this.buildDots(); this.sync(); }, 150);
    });

    // card widths depend on fonts and images, so re-measure once settled
    window.addEventListener('load', () => { this.measure(); this.buildDots(); this.sync(); });

    this.sync();
  }

  /* Snap targets come from the cards themselves rather than from the
     viewport width — the viewport carries horizontal padding, so using
     clientWidth as a page size overshoots by the gutter on every step. */
  measure() {
    const cards = Array.from(this.track.children);
    if (!cards.length) { this.targets = [0]; return; }

    const base = cards[0].offsetLeft;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const trackStyles = getComputedStyle(this.track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;

    const viewStyles = getComputedStyle(this.viewport);
    const inner = this.viewport.clientWidth
      - (parseFloat(viewStyles.paddingLeft) || 0)
      - (parseFloat(viewStyles.paddingRight) || 0);

    const perView = Math.max(1, Math.round((inner + gap) / (cardWidth + gap)));
    const maxScroll = Math.max(0, this.viewport.scrollWidth - this.viewport.clientWidth);

    this.targets = [];
    for (let i = 0; i < cards.length; i += perView) {
      this.targets.push(Math.min(cards[i].offsetLeft - base, maxScroll));
    }
    // drop duplicate end positions so the last dot isn't a dead stop
    this.targets = this.targets.filter((v, i, arr) => i === 0 || v > arr[i - 1] + 1);
  }

  buildDots() {
    if (!this.dotsBox) return;
    const count = this.targets.length;
    if (this.dotsBox.childElementCount === count) return;
    this.dotsBox.innerHTML = '';
    this.targets.forEach((left, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to page ${i + 1}`);
      dot.addEventListener('click', () => this.viewport.scrollTo({ left, behavior: 'smooth' }));
      this.dotsBox.appendChild(dot);
    });
  }

  step(dir) {
    const current = this.viewport.scrollLeft;
    const target = dir > 0
      ? this.targets.find(t => t > current + 4)
      : [...this.targets].reverse().find(t => t < current - 4);
    this.viewport.scrollTo({ left: target !== undefined ? target : (dir > 0 ? this.targets[this.targets.length - 1] : 0), behavior: 'smooth' });
  }

  onScroll() {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => { this.sync(); this.raf = null; });
  }

  sync() {
    const { scrollLeft, clientWidth, scrollWidth } = this.viewport;

    if (this.dotsBox) {
      let nearest = 0;
      let best = Infinity;
      this.targets.forEach((t, i) => {
        const d = Math.abs(t - scrollLeft);
        if (d < best) { best = d; nearest = i; }
      });
      Array.from(this.dotsBox.children).forEach((dot, i) => dot.classList.toggle('is-active', i === nearest));
    }

    if (this.prev) this.prev.disabled = scrollLeft < 8;
    if (this.next) this.next.disabled = scrollLeft + clientWidth >= scrollWidth - 8;
  }
}


/* ============================================================
   08  MODALS
   ============================================================ */

const Modals = {
  current: null,

  open(el) {
    if (!el) return;
    this.close();
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('is-open'));
    document.body.classList.add('is-locked');
    this.current = el;
    const close = el.querySelector('.modal-close');
    if (close) close.focus({ preventScroll: true });
  },

  close() {
    const el = this.current;
    if (!el) return;
    el.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    setTimeout(() => { el.hidden = true; }, 300);
    this.current = null;
  },

  bind(el) {
    if (!el || el.dataset.bound) return;
    el.dataset.bound = '1';
    el.querySelectorAll('[data-close], [data-close-scroll]').forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });
  },

  init() {
    document.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); });
    document.querySelectorAll('.modal').forEach(m => this.bind(m));
  }
};

class ServiceModals {
  constructor() {
    this.modal = document.getElementById('serviceModal');
    this.body = document.getElementById('serviceModalBody');
    if (!this.modal || !this.body) return;

    document.querySelectorAll('[data-modal]').forEach(btn => {
      btn.addEventListener('click', () => this.open(btn.getAttribute('data-modal')));
    });
  }

  open(key) {
    const tpl = document.getElementById(`tpl-${key}`);
    if (!tpl) return;
    this.body.innerHTML = tpl.innerHTML;
    this.body.querySelectorAll('[data-close-scroll]').forEach(btn => {
      btn.addEventListener('click', () => Modals.close());
    });
    Modals.open(this.modal);
  }
}


/* ============================================================
   09  FAQ FILTER
   ============================================================ */

class FAQ {
  constructor() {
    this.section = document.getElementById('faq');
    if (!this.section) return;
    this.filters = this.section.querySelectorAll('.faq-filter');
    this.items = this.section.querySelectorAll('.faq-item');

    this.filters.forEach(btn => {
      btn.addEventListener('click', () => this.apply(btn));
    });

    // one open at a time
    this.items.forEach(item => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        this.items.forEach(other => { if (other !== item) other.open = false; });
      });
    });
  }

  apply(btn) {
    const category = btn.getAttribute('data-category');
    this.filters.forEach(f => {
      const on = f === btn;
      f.classList.toggle('is-active', on);
      f.setAttribute('aria-selected', String(on));
    });
    this.items.forEach(item => {
      const match = category === 'all' || item.getAttribute('data-category') === category;
      item.hidden = !match;
      if (!match) item.open = false;
    });
  }
}


/* ============================================================
   10  FLOATING ACTIONS
   ============================================================ */

class FloatingActions {
  constructor() {
    this.fab = document.getElementById('fab');
    this.main = document.getElementById('fabMain');
    this.top = document.getElementById('toTop');
    this.open = false;

    if (this.main) {
      this.main.addEventListener('click', e => { e.stopPropagation(); this.toggle(); });
      document.addEventListener('click', e => { if (this.open && !this.fab.contains(e.target)) this.shut(); });
      this.fab.querySelectorAll('.fab-item').forEach(item => {
        item.addEventListener('click', () => setTimeout(() => this.shut(), 250));
      });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') this.shut(); });
    }

    if (this.top) this.top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.onScroll();
  }

  onScroll() {
    const show = window.pageYOffset > 500;
    if (this.fab) this.fab.classList.toggle('is-visible', show);
    if (this.top) this.top.classList.toggle('is-visible', show);
    if (!show) this.shut();
  }

  toggle() { this.open ? this.shut() : this.show(); }

  show() {
    this.open = true;
    this.fab.classList.add('is-open');
    this.main.setAttribute('aria-expanded', 'true');
  }

  shut() {
    if (!this.open) return;
    this.open = false;
    this.fab.classList.remove('is-open');
    this.main.setAttribute('aria-expanded', 'false');
  }
}


/* ============================================================
   11  BOOTSTRAP
   ============================================================ */

class App {
  constructor() {
    Modals.init();

    new OfferWindow();
    new Header();
    new HeroVideo();
    new Reveal();
    new Counters();

    document.querySelectorAll('[data-carousel]').forEach(el => new Carousel(el));

    new ServiceModals();

    const tpOpen = document.getElementById('tpOpen');
    const tpModal = document.getElementById('tpModal');
    if (tpOpen && tpModal) tpOpen.addEventListener('click', () => Modals.open(tpModal));

    const nfOpen = document.getElementById('nfOpen');
    const nfModal = document.getElementById('nfModal');
    if (nfOpen && nfModal) nfOpen.addEventListener('click', () => Modals.open(nfModal));

    new FAQ();
    new FloatingActions();

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  }
}

document.addEventListener('DOMContentLoaded', () => new App());
