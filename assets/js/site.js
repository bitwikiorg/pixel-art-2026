document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

  const filterButtons=[...document.querySelectorAll('[data-research-filter]')];
  const researchCards=[...document.querySelectorAll('[data-research-tags]')];
  filterButtons.forEach(btn=>btn.addEventListener('click',()=>{
    const filter=btn.dataset.researchFilter;
    filterButtons.forEach(b=>b.classList.toggle('active',b===btn));
    researchCards.forEach(card=>{
      const tags=(card.dataset.researchTags||'').split(/\s+/);
      card.hidden=filter!=='all'&&!tags.includes(filter);
    });
  }));

  const tabs=[...document.querySelectorAll('[data-lab-tab]')];
  const sections=[...document.querySelectorAll('[data-lab-section]')];
  tabs.forEach(tab=>tab.addEventListener('click',()=>{
    const target=tab.dataset.labTab;
    tabs.forEach(t=>t.classList.toggle('active',t===tab));
    sections.forEach(section=>section.hidden=section.dataset.labSection!==target);
  }));
});
