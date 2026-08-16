(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

    const header = document.querySelector('[data-site-header]');
    const navToggle = document.querySelector('[data-nav-toggle]');
    if (header && navToggle) {
      const setOpen = open => {
        header.classList.toggle('nav-open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        const label = navToggle.querySelector('span');
        if (label) label.textContent = open ? 'CLOSE' : 'MENU';
      };
      navToggle.addEventListener('click', () => setOpen(!header.classList.contains('nav-open')));
      header.querySelectorAll('.top-nav a').forEach(link => link.addEventListener('click', () => setOpen(false)));
      document.addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
      window.addEventListener('resize', () => { if (window.innerWidth >= 840) setOpen(false); });
    }

    const filterButtons = [...document.querySelectorAll('[data-research-filter]')];
    const researchCards = [...document.querySelectorAll('[data-research-tags]')];
    filterButtons.forEach(btn => btn.addEventListener('click', () => {
      const filter = btn.dataset.researchFilter;
      filterButtons.forEach(b => b.classList.toggle('active', b === btn));
      researchCards.forEach(card => {
        const tags = (card.dataset.researchTags || '').split(/\s+/).filter(Boolean);
        card.hidden = filter !== 'all' && !tags.includes(filter);
      });
    }));
  });
})();
