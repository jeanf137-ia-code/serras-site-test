
// Base path support (GitHub Pages project site vs local)
const BASE_PATH = (() => {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (window.location.hostname.endsWith('github.io') && parts.length >= 1) {
    return '/' + parts[0] + '/';
  }
  return '/';
})();
const withBase = (p) => (p.startsWith('http') ? p : (p.startsWith('/') ? (BASE_PATH.replace(/\/$/,'') + p) : (BASE_PATH + p)));
// SERRAS — Site test v2 (i18n + motion + form + chatbot placeholder)
(async function(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if(toggle && nav){
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('mobile');
    });
  }

  let dict = null;
  try{
    const res = await fetch('/i18n.json', {cache:'no-store'});
    dict = await res.json();
  }catch(e){ dict = null; }

  const getParam = (k) => new URLSearchParams(location.search).get(k);
  const setParam = (k,v) => {
    const u = new URL(location.href);
    u.searchParams.set(k,v);
    history.replaceState({}, '', u.toString());
  };

  const savedLang = localStorage.getItem('serras_lang');
  const initial = getParam('lang') || savedLang || 'fr';
  let lang = (initial === 'en') ? 'en' : 'fr';

  function applyLang(){
    if(!dict) return;
    const map = dict[lang] || dict.fr;
    document.documentElement.lang = (lang === 'en') ? 'en' : 'fr-CA';
    for(const el of document.querySelectorAll('[data-i18n]')){
      const key = el.getAttribute('data-i18n');
      if(map[key] != null) el.textContent = map[key];
    }
    for(const el of document.querySelectorAll('[data-i18n-html]')){
      const key = el.getAttribute('data-i18n-html');
      if(map[key] != null) el.innerHTML = map[key];
    }
  }

  const langBtn = document.querySelector('[data-lang-toggle]');
  if(langBtn){
    langBtn.addEventListener('click', () => {
      lang = (lang === 'fr') ? 'en' : 'fr';
      localStorage.setItem('serras_lang', lang);
      setParam('lang', lang);
      applyLang();
    });
  }
  localStorage.setItem('serras_lang', lang);
  setParam('lang', lang);
  applyLang();

  const obs = new IntersectionObserver((entries) => {
    for(const e of entries){
      if(e.isIntersecting) e.target.classList.add('in');
    }
  }, {threshold: 0.12});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  const bot = document.querySelector('.chatbot');
  if(bot){
    const btn = bot.querySelector('[data-chat-launch]');
    const close = bot.querySelector('[data-chat-close]');
    if(btn) btn.addEventListener('click', () => bot.classList.toggle('open'));
    if(close) close.addEventListener('click', () => bot.classList.remove('open'));
  }

  const form = document.querySelector('#leadForm');
  if(form){
    const notice = document.querySelector('#formNotice');
    const saveKey = 'serras_lead_draft_v2';

    try{
      const saved = JSON.parse(localStorage.getItem(saveKey) || 'null');
      if(saved && typeof saved === 'object'){
        for(const [k,v] of Object.entries(saved)){
          const el = form.elements.namedItem(k);
          if(!el) continue;
          if(el.type === 'checkbox') el.checked = !!v;
          else el.value = v;
        }
      }
    }catch(e){}

    let t;
    form.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const data = {};
        for(const el of form.elements){
          if(!el.name) continue;
          if(el.type === 'checkbox') data[el.name] = el.checked;
          else data[el.name] = el.value;
        }
        try{ localStorage.setItem(saveKey, JSON.stringify(data)); }catch(e){}
      }, 250);
    });

    const projectType = form.elements.namedItem('project_type');
    const residential = document.querySelector('[data-section="residential"]');
    const commercial = document.querySelector('[data-section="commercial"]');
    const applyType = () => {
      const val = (projectType && projectType.value) || '';
      if(residential) residential.style.display = (val === 'residential') ? 'block' : 'none';
      if(commercial) commercial.style.display = (val === 'commercial') ? 'block' : 'none';
    };
    if(projectType){
      projectType.addEventListener('change', applyType);
      applyType();
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const payload = {};
      fd.forEach((v,k)=> payload[k]=v);
      payload.lang = localStorage.getItem('serras_lang') || 'fr';
      payload.page = location.pathname;

      console.log('[DEMO] lead payload', payload);

      try{ localStorage.removeItem(saveKey); }catch(e){}
      form.reset();
      applyType();
      if(notice){
        notice.classList.add('show');
        notice.innerHTML = "✅ Merci! (démo) Votre demande a été captée.<br><span class='small'>Prochaine étape: branchement API → BATISCOPE/Soumission.</span>";
        setTimeout(()=> notice.classList.remove('show'), 9000);
      }
    });
  }
})();