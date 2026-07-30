(()=>{
  'use strict';

  const cfg=window.PHOENIX_LAB||{};
  const assets=cfg.assets||{};
  const phoenix=window.PHOENIX;
  if(!phoenix||document.documentElement.dataset.phoenixLabPremium)return;
  document.documentElement.dataset.phoenixLabPremium='true';

  const latest=phoenix.history?.[phoenix.history.length-1]||{};
  const number0=n=>new Intl.NumberFormat('fr-FR',{maximumFractionDigits:0}).format(Number(n)||0);
  const number1=n=>new Intl.NumberFormat('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1}).format(Number(n)||0);
  const number2=n=>new Intl.NumberFormat('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(n)||0);
  const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
  const sleepText=h=>{if(h==null)return 'En attente';const m=Math.round(h*60);return `${Math.floor(m/60)} h ${String(m%60).padStart(2,'0')}`};

  function injectPremiumLayout(){
    if(document.querySelector('#phoenix-premium-layout'))return;
    const style=document.createElement('style');
    style.id='phoenix-premium-layout';
    style.textContent=`
      /* Phoenix Lab V8 — grand écran, navigation forte, un seul avatar */
      html{scroll-behavior:smooth}
      body{overflow-x:hidden;background:radial-gradient(circle at 5% 8%,rgba(65,146,255,.13),transparent 28%),radial-gradient(circle at 92% 3%,rgba(157,112,255,.10),transparent 24%),#07101f!important}
      body>header.wrap.nav{display:none!important}

      .lab-topic-avatar,.navAvatar,.lab-pulse>img,.lab-story>img,.lab-insight img,.lab-analysis>img,.lab-detail-avatar{display:none!important}
      .topic .lab-topic-avatar{display:none!important}

      .phoenixCard{position:relative!important;overflow:hidden!important;min-height:560px!important;padding:22px 22px 26px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;background:radial-gradient(circle at 50% 20%,rgba(71,157,255,.22),transparent 42%),linear-gradient(155deg,rgba(19,40,74,.96),rgba(8,19,38,.98))!important;border:1px solid rgba(111,167,255,.22)!important;box-shadow:0 30px 75px rgba(0,0,0,.38)!important}
      .phoenixCard:before{display:block!important;content:""!important;position:absolute!important;inset:-35%!important;background:radial-gradient(circle,rgba(92,168,255,.17),transparent 58%)!important;animation:labPulse 7s ease-in-out infinite!important;pointer-events:none!important}
      .phoenixCard>img,.phoenixCard>.lab-main-avatar{display:block!important;position:relative!important;z-index:2!important;width:min(100%,330px)!important;height:auto!important;aspect-ratio:1/1.08!important;object-fit:cover!important;object-position:center 18%!important;margin:0 auto!important;border-radius:27px!important;border:3px solid rgba(255,255,255,.10)!important;filter:drop-shadow(0 24px 34px rgba(0,0,0,.42))!important;box-shadow:0 0 0 1px rgba(103,172,255,.18),0 25px 60px rgba(0,0,0,.28)!important;animation:labFloat 5.4s ease-in-out infinite!important}
      .auren-profile{position:relative!important;z-index:3!important;width:100%!important;padding:22px 8px 3px!important;text-align:center!important}
      .auren-profile .auren-role{display:block!important;color:#58dcf4!important;font-size:10px!important;font-weight:900!important;letter-spacing:.15em!important;text-transform:uppercase!important}
      .auren-profile h2{margin:8px 0 10px!important;font-size:38px!important;line-height:1!important;letter-spacing:-.04em!important}
      .auren-profile p{max-width:340px!important;margin:0 auto!important;color:#b7c5d9!important;font-size:13px!important;line-height:1.65!important}

      .lab-pulse{grid-template-columns:minmax(0,1fr) auto!important}
      .lab-story{grid-template-columns:1fr!important}
      .lab-insight-top{justify-content:flex-end!important}
      .lab-analysis{grid-template-columns:1fr!important}
      .detailHero{min-height:0!important;padding-right:24px!important;padding-bottom:24px!important}
      .topic{min-height:0!important}

      @media(min-width:1101px){
        .app-shell{display:grid!important;grid-template-columns:clamp(250px,18vw,325px) minmax(0,1fr)!important;gap:clamp(24px,2vw,38px)!important;width:100%!important;max-width:none!important;margin:0!important;padding:0 clamp(22px,2.4vw,46px) 90px!important;align-items:start!important}
        .app-shell>main,.app-shell>.content,.app-shell>.app-main,.app-shell>div:not(.phoenix-side-nav){min-width:0!important;width:100%!important;max-width:none!important}
        .phoenix-side-nav{display:grid!important;position:sticky!important;left:auto!important;right:auto!important;top:16px!important;width:100%!important;min-width:0!important;min-height:calc(100vh - 32px)!important;max-height:calc(100vh - 32px)!important;height:auto!important;margin:16px 0 0!important;padding:20px 16px!important;grid-template-columns:1fr!important;align-content:start!important;gap:8px!important;overflow:auto!important;border-radius:28px!important;background:linear-gradient(180deg,rgba(15,31,58,.96),rgba(8,20,40,.97))!important;border:1px solid rgba(122,166,225,.18)!important;box-shadow:0 28px 70px rgba(0,0,0,.34)!important}
        .phoenix-side-nav:before{content:"PROJECT PHOENIX";display:block;padding:9px 12px 17px;margin-bottom:4px;border-bottom:1px solid rgba(143,170,213,.14);color:#7fdcf1;font-size:10px;font-weight:900;letter-spacing:.16em;text-align:center}
        .phoenix-side-nav a{min-height:64px!important;padding:9px 12px!important;display:grid!important;grid-template-columns:46px minmax(0,1fr)!important;place-items:center start!important;gap:12px!important;border-radius:16px!important;text-align:left!important;font-size:13px!important;transition:transform .2s ease,background .2s ease,border-color .2s ease!important}
        .phoenix-side-nav a:hover{transform:translateX(4px)!important;background:rgba(72,139,239,.12)!important;border-color:rgba(93,160,255,.22)!important}
        .phoenix-side-nav a.active,.phoenix-side-nav a[aria-current="page"]{background:linear-gradient(135deg,rgba(52,124,245,.21),rgba(139,99,246,.14))!important;border-color:rgba(92,159,255,.25)!important}
        .phoenix-side-nav a .navIcon{justify-self:center!important;font-size:29px!important}
        .phoenix-side-nav a>span:last-child{display:block!important;font-size:13px!important;line-height:1.15!important;font-weight:800!important}
        .phoenix-mobile-nav{display:none!important}
        .summaryGrid{grid-template-columns:minmax(300px,360px) minmax(0,1fr)!important;gap:24px!important;align-items:start!important}
        .hero,.section,.lab-command,.lab-pulse,.lab-focus{width:100%!important;max-width:none!important}
      }

      @media(min-width:1500px){
        .app-shell{grid-template-columns:340px minmax(0,1fr)!important;padding-left:42px!important;padding-right:42px!important}
        .phoenixCard{min-height:620px!important}
        .phoenixCard>img,.phoenixCard>.lab-main-avatar{width:350px!important}
      }

      @media(max-width:1100px){
        .phoenixCard{min-height:auto!important}
        .phoenixCard>img,.phoenixCard>.lab-main-avatar{width:min(100%,280px)!important}
      }

      @media(max-width:700px){
        .phoenixCard{padding:16px!important}
        .phoenixCard>img,.phoenixCard>.lab-main-avatar{width:min(100%,230px)!important;border-radius:22px!important}
        .auren-profile h2{font-size:30px!important}
      }
    `;
    document.head.append(style);
  }

  function createImage(key,alt,lazy=true){
    const image=document.createElement('img');
    image.alt=alt;
    image.decoding='async';
    if(lazy)image.loading='lazy';
    image.src=assets[key]||`${cfg.officialBase||''}phoenix.svg`;
    image.onerror=()=>{image.onerror=null;image.src=`${cfg.officialBase||''}phoenix.svg`};
    return image;
  }

  function keepOnlyMainAvatar(){
    document.querySelectorAll('.lab-topic-avatar,.navAvatar').forEach(node=>node.remove());
    document.querySelectorAll('.topic img[src*="assets/avatars/"],.phoenix-side-nav img[src*="assets/avatars/"]').forEach(node=>node.remove());

    const card=document.querySelector('.phoenixCard');
    if(!card)return;

    let image=card.querySelector(':scope>img');
    if(!image){
      image=createImage('main','Auren, avatar principal de Project Phoenix',false);
      card.prepend(image);
    }
    if(assets.main)image.src=assets.main;
    image.className='lab-main-avatar';
    image.loading='eager';
    image.fetchPriority='high';
  }

  function personalizeAuren(){
    const card=document.querySelector('.phoenixCard');
    if(!card)return;

    const walker=document.createTreeWalker(card,NodeFilter.SHOW_TEXT);
    const textNodes=[];
    while(walker.nextNode())textNodes.push(walker.currentNode);
    textNodes.forEach(node=>{
      if((node.nodeValue||'').includes('Phoenix IA'))node.nodeValue=node.nodeValue.replace(/Phoenix IA/g,'Auren');
    });

    let profile=card.querySelector('.auren-profile');
    if(!profile){
      profile=document.createElement('div');
      profile.className='auren-profile';
      profile.innerHTML='<span class="auren-role">Guide officiel du challenge</span><h2>Auren</h2><p>Ton compagnon de route dans Project Phoenix. Il transforme les données en repères clairs, suit les progrès et raconte la transformation avec honnêteté.</p>';
      const image=card.querySelector(':scope>img');
      if(image)image.insertAdjacentElement('afterend',profile);else card.prepend(profile);
    }
  }

  function revealOnScroll(){
    const nodes=document.querySelectorAll('.topic,.lab-pulse,.lab-focus,.lab-command');
    nodes.forEach(node=>node.classList.add('lab-reveal'));
    if(!('IntersectionObserver'in window)){nodes.forEach(n=>n.classList.add('is-visible'));return;}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
    }),{threshold:.07});
    nodes.forEach(node=>observer.observe(node));
  }

  function buildPulse(){
    const hero=document.querySelector('.hero');
    if(!hero||document.querySelector('.lab-pulse'))return;
    const pulse=document.createElement('section');
    pulse.className='lab-pulse';
    pulse.innerHTML=`<div><small>Phoenix Pulse</small><h3>Un départ très actif. La récupération devient la priorité.</h3><p>${number0(latest.steps)} pas et ${number2(latest.distanceKm)} km créent un excellent point zéro. La prochaine victoire sera une nuit régulière et une journée bien hydratée.</p></div><div class="lab-pulse-score" aria-label="Score Phoenix ${latest.score||0} sur 100">${latest.score||0}</div>`;
    hero.insertAdjacentElement('afterend',pulse);

    const focus=document.createElement('div');
    focus.className='lab-focus';
    const activityGoal=14000;
    const sleepGoal=7;
    const firstTarget=110;
    const start=phoenix.profile?.startWeightKg||latest.weightKg||115;
    focus.innerHTML=`
      <article><span>Objectif activité</span><b>${number0(activityGoal)} pas · ${(latest.steps||0)>=activityGoal?'dépassé':'en cours'}</b><i style="width:${clamp((latest.steps||0)/activityGoal*100,0,100)}%"></i></article>
      <article><span>Sommeil cible</span><b>${sleepGoal} h · ${(latest.sleepHours||0)>=sleepGoal?'atteint':'à consolider'}</b><i style="width:${clamp((latest.sleepHours||0)/sleepGoal*100,0,100)}%"></i></article>
      <article><span>Premier palier</span><b>${firstTarget} kg</b><i style="width:${clamp((start-(latest.weightKg||start))/(start-firstTarget)*100,0,100)}%"></i></article>`;
    pulse.insertAdjacentElement('afterend',focus);
  }

  function yearMap(){
    const total=phoenix.project?.totalDays||365;
    const current=phoenix.project?.day||1;
    const map=document.createElement('div');
    map.className='lab-year-map';
    map.setAttribute('role','img');
    map.setAttribute('aria-label',`${current} jour suivi sur ${total}`);
    for(let day=1;day<=total;day++){
      const cell=document.createElement('i');
      cell.className=`lab-day${day<=current?' is-done':''}${day===current?' is-today':''}`;
      cell.title=`Jour ${day}`;
      map.append(cell);
    }
    return map;
  }

  function milestoneRows(){
    const start=phoenix.profile?.startWeightKg||latest.weightKg||115;
    const current=latest.weightKg||start;
    return [110,105,100,90,80].map(target=>{
      const percentage=clamp((start-current)/(start-target)*100,0,100);
      const status=current<=target?'Atteint':`${number1(Math.max(0,current-target))} kg`;
      return `<div class="lab-milestone"><strong>${target} kg</strong><div class="lab-milestone-track"><i style="width:${percentage}%"></i></div><small>${status}</small></div>`;
    }).join('');
  }

  function buildCommandCenter(){
    if(document.querySelector('#lab-command-center'))return;
    const anchor=document.querySelector('#synthese')||document.querySelector('.section');
    if(!anchor)return;

    const section=document.createElement('section');
    section.id='lab-command-center';
    section.className='lab-command';
    section.innerHTML=`<header class="lab-command-head"><div><span class="lab-kicker">Centre de progression</span><h2>Une vision claire des 365 jours</h2><p>Le quotidien reste simple. Les tendances, les paliers et l’histoire s’enrichissent à chaque journée officielle.</p></div><div class="lab-day-badge">Jour ${phoenix.project?.day||1} / ${phoenix.project?.totalDays||365}</div></header>`;

    const grid=document.createElement('div');
    grid.className='lab-command-grid';
    const calendar=document.createElement('article');
    calendar.className='lab-panel';
    calendar.innerHTML=`<div class="lab-panel-head"><h3>Calendrier de régularité</h3><span>${phoenix.project?.day||1} journée suivie</span></div>`;
    calendar.append(yearMap());
    calendar.insertAdjacentHTML('beforeend',`<div class="lab-year-legend"><span>${(phoenix.project?.start||'2026-07-29').split('-').reverse().join('/')}</span><span>${(phoenix.project?.end||'2027-07-28').split('-').reverse().join('/')}</span></div>`);

    const story=document.createElement('article');
    story.className='lab-panel';
    story.innerHTML=`<div class="lab-story"><div><span class="lab-kicker">Chapitre actuel</span><h3>${latest.journalTitle||'Le départ'}</h3><p>${latest.journalText||'Le premier chapitre de Project Phoenix est lancé.'}</p></div></div><div class="lab-milestones">${milestoneRows()}</div>`;
    grid.append(calendar,story);
    section.append(grid);

    const insights=document.createElement('div');
    insights.className='lab-insights';
    [
      ['Charge du jour',`${number0(latest.steps)} pas`,'Une activité très élevée dès le lancement. La récupération compte autant que le volume.'],
      ['Récupération',sleepText(latest.sleepHours),'La durée est correcte pour le point zéro. La tendance deviendra utile après plusieurs nuits.'],
      ['Signaux corporels',`${number0(latest.restingHR)} bpm`,'Les indicateurs cardiaques sont présentés comme des tendances, jamais comme un diagnostic.']
    ].forEach(([title,value,text])=>{
      const card=document.createElement('article');
      card.className='lab-insight';
      card.innerHTML=`<div class="lab-insight-top"><strong class="lab-insight-value">${value}</strong></div><h3>${title}</h3><p>${text}</p>`;
      insights.append(card);
    });
    section.append(insights);
    anchor.parentNode.insertBefore(section,anchor);
  }

  function enhanceDetails(){
    document.querySelectorAll('.lab-detail-avatar,.lab-analysis>img').forEach(node=>node.remove());
    const params=new URLSearchParams(location.search);
    const key=params.get('theme')||'activite';
    const messages={
      activite:['Charge élevée, récupération prioritaire.','Le départ est exceptionnel. La prochaine étape consiste à rendre ce volume soutenable.'],
      sommeil:['Durée atteinte, tendance à construire.','Une seule nuit donne un point de départ ; la régularité donnera la vraie lecture.'],
      nutrition:['Aucune donnée nutritionnelle inventée.','Le journal s’enrichira uniquement avec des repas réellement consignés.'],
      transformation:['Le point zéro est posé.','Le poids, les mensurations et les photos permettront de voir la progression complète.'],
      sante:['Une valeur ne fait pas une tendance.','Les données de santé restent des repères de suivi et non un diagnostic.'],
      journal:['Le contexte donne du sens aux chiffres.','Chaque journée raconte les choix, les difficultés et les victoires.'],
      trophees:['Chaque étape compte.','Les trophées transforment les habitudes régulières en jalons visibles.']
    };
    const section=document.querySelector('.section');
    if(section&&!section.querySelector('.lab-analysis')){
      const message=messages[key]||messages.activite;
      const note=document.createElement('div');
      note.className='lab-analysis';
      note.innerHTML=`<div><small>Phoenix analyse</small><h3>${message[0]}</h3><p>${message[1]}</p></div>`;
      section.prepend(note);
    }
  }

  injectPremiumLayout();
  keepOnlyMainAvatar();

  if(location.pathname.endsWith('details.html')){
    enhanceDetails();
  }else{
    personalizeAuren();
    buildPulse();
    buildCommandCenter();
  }

  revealOnScroll();
})();
