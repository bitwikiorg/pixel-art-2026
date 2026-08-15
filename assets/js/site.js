(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
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
