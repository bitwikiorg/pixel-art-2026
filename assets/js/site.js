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
  const activateLab=(target)=>{
    if(!target||!tabs.some(tab=>tab.dataset.labTab===target))return;
    tabs.forEach(tab=>tab.classList.toggle('active',tab.dataset.labTab===target));
    sections.forEach(section=>section.hidden=section.dataset.labSection!==target);
  };
  const activateFromHash=()=>{
    if(!location.hash)return;
    const section=document.querySelector(location.hash);
    if(section&&section.dataset&&section.dataset.labSection)activateLab(section.dataset.labSection);
  };
  tabs.forEach(tab=>tab.addEventListener('click',()=>activateLab(tab.dataset.labTab)));
  activateFromHash();
  window.addEventListener('hashchange',activateFromHash);
});
