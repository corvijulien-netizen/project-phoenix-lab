(()=>{
  'use strict';
  const cfg=window.PHOENIX_LAB||{};
  const A=cfg.assets||{};
  const H=window.PHOENIX;
  if(!H||document.documentElement.dataset.phoenixLabEnhanced)return;
  document.documentElement.dataset.phoenixLabEnhanced='true';

  const D=H.history[H.history.length-1];
  const topicOrder=['activite','sommeil','nutrition','transformation','sante','journal','trophees'];
  const classMap=[['activity','activite'],['sleep','sommeil'],['nutrition','nutrition'],['transform','transformation'],['health','sante'],['journal','journal'],['trophies','trophees']];
  const navMap=[['activity-link','activite'],['sleep-link','sommeil'],['nutrition-link','nutrition'],['transform-link','transformation'],['health-link','sante'],['journal-link','journal'],['trophy-link','trophees']];
  const f0=n=>new Intl.NumberFormat('fr-FR',{maximumFractionDigits:0}).format(n);
  const f1=n=>new Intl.NumberFormat('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1}).format(n);
  const f2=n=>new Intl.NumberFormat('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
  const hm=h=>{if(h==null)return 'En attente';const m=Math.round(h*60);return Math.floor(m/60)+' h '+String(m%60).padStart(2,'0')};
  const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));

  function safeImg(key,alt='',lazy=true){
    const img=document.createElement('img');
    img.alt=alt;
    if(lazy)img.loading='lazy';
    img.decoding='async';
    img.src=A[key]||cfg.officialBase+'phoenix.svg';
    img.onerror=()=>{img.onerror=null;img.src=cfg.officialBase+'phoenix.svg'};
    return img;
  }

  function enhanceNavigation(){
    document.querySelectorAll('.phoenix-side-nav a,.phoenix-mobile-nav a').forEach(a=>{
      const href=a.getAttribute('href')||'';
      const found=topicOrder.find(k=>href.includes('theme='+k));
      if(!found)return;
      const old=a.querySelector('.navIcon');
      if(old)old.replaceWith(Object.assign(safeImg(found,'',true),{className:'navAvatar'}));
    });
  }

  function observeReveals(){
    const nodes=document.querySelectorAll('.lab-reveal');
    if(!('IntersectionObserver'in window)){nodes.forEach(n=>n.classList.add('is-visible'));return}
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.08});
    nodes.forEach(n=>io.observe(n));
  }

  function animateNumber(el,target,duration=900){
    if(!el||matchMedia('(prefers-reduced-motion: reduce)').matches){if(el)el.textContent=target;return}
    const start=performance.now();
    const step=now=>{const p=clamp((now-start)/duration,0,1);const eased=1-Math.pow(1-p,3);el.textContent=Math.round(target*eased);if(p<1)requestAnimationFrame(step)};
    requestAnimationFrame(step);
  }

  function buildPulse(){
    const hero=document.querySelector('.hero');
    if(!hero||document.querySelector('.lab-pulse'))return;
    const pulse=document.createElement('section');
    pulse.className='lab-pulse lab-reveal';
    pulse.append(safeImg('sante','Phoenix Santé',false));
    const copy=document.createElement('div');
    copy.innerHTML='<small>Phoenix Pulse</small><h3>Un départ très actif. La récupération devient la priorité.</h3><p>'+f0(D.steps)+' pas et '+f2(D.distanceKm)+' km créent un excellent point zéro. La prochaine victoire sera une nuit régulière et une journée bien hydratée.</p>';
    const score=document.createElement('div');score.className='lab-pulse-score';score.textContent='0';score.setAttribute('aria-label','Score Phoenix '+D.score+' sur 100');
    pulse.append(copy,score);
    hero.insertAdjacentElement('afterend',pulse);

    const focus=document.createElement('div');focus.className='lab-focus lab-reveal';
    const activityGoal=14000,sleepGoal=7;
    const activityPct=clamp(D.steps/activityGoal*100,0,100),sleepPct=clamp(D.sleepHours/sleepGoal*100,0,100);
    const current=D.weightKg,start=H.profile.startWeightKg,firstTarget=110;
    const weightPct=clamp((start-current)/(start-firstTarget)*100,0,100);
    focus.innerHTML='<article><span>Objectif activité</span><b>'+f0(activityGoal)+' pas · '+(D.steps>=activityGoal?'dépassé':'en cours')+'</b><i style="width:'+activityPct+'%"></i></article><article><span>Sommeil cible</span><b>'+f0(sleepGoal)+' h · '+(D.sleepHours>=sleepGoal?'atteint':'à consolider')+'</b><i style="width:'+sleepPct+'%"></i></article><article><span>Premier palier</span><b>'+firstTarget+' kg</b><i style="width:'+weightPct+'%"></i></article>';
    pulse.insertAdjacentElement('afterend',focus);
    setTimeout(()=>animateNumber(score,D.score),150);
  }

  function enhanceTopics(){
    document.querySelectorAll('.topic').forEach(card=>{
      if(card.querySelector('.lab-topic-avatar'))return;
      const hit=classMap.find(([cls])=>card.classList.contains(cls));
      if(!hit)return;
      const box=document.createElement('div');box.className='lab-topic-avatar';
      box.append(safeImg(hit[1],'Phoenix '+H.topics[hit[1]].title));
      card.prepend(box);card.classList.add('lab-reveal');
    });
    const heroImg=document.querySelector('.phoenixCard>img');
    if(heroImg){heroImg.src=A.main;heroImg.onerror=()=>{heroImg.src=cfg.officialBase+'phoenix.svg'}}
  }

  function yearMap(){
    const map=document.createElement('div');map.className='lab-year-map';map.setAttribute('role','img');map.setAttribute('aria-label',H.project.day+' jour suivi sur '+H.project.totalDays);
    for(let i=1;i<=H.project.totalDays;i++){
      const cell=document.createElement('i');cell.className='lab-day'+(i<=H.project.day?' is-done':'')+(i===H.project.day?' is-today':'');cell.title='Jour '+i;map.append(cell);
    }
    return map;
  }

  function milestonesHtml(){
    const start=H.profile.startWeightKg,current=D.weightKg,targets=[110,105,100,90,80];
    return targets.map(target=>{
      const pct=clamp((start-current)/(start-target)*100,0,100);
      const status=current<=target?'Atteint':Math.max(0,current-target).toLocaleString('fr-FR',{maximumFractionDigits:1})+' kg';
      return '<div class="lab-milestone"><strong>'+target+' kg</strong><div class="lab-milestone-track"><i style="width:'+pct+'%"></i></div><small>'+status+'</small></div>';
    }).join('');
  }

  function trophyHtml(){
    const items=[['🔥','Jour 1','Challenge officiellement lancé'],['⚖️','Pesée officielle',f1(D.weightKg)+' kg enregistrés'],['👟','10 000 pas',f0(D.steps)+' pas'],['🗺️','Premier 10 km',f2(D.distanceKm)+' km au total']];
    return items.slice(0,D.trophiesUnlocked||0).map(x=>'<article class="lab-trophy"><div class="lab-trophy-icon">'+x[0]+'</div><b>'+x[1]+'</b><span>'+x[2]+'</span></article>').join('');
  }

  function buildCommandCenter(){
    if(document.querySelector('#lab-command-center'))return;
    const anchor=document.querySelector('#synthese')||document.querySelector('.section');
    if(!anchor)return;
    const section=document.createElement('section');section.id='lab-command-center';section.className='lab-command lab-reveal';
    section.innerHTML='<header class="lab-command-head"><div><span class="lab-kicker">Centre de progression</span><h2>Une vision claire des 365 jours</h2><p>Le quotidien reste simple. Les tendances, les paliers et l’histoire s’enrichissent automatiquement avec chaque journée officielle.</p></div><div class="lab-day-badge">Jour '+H.project.day+' / '+H.project.totalDays+'</div></header>';
    const grid=document.createElement('div');grid.className='lab-command-grid';
    const calendar=document.createElement('article');calendar.className='lab-panel';calendar.innerHTML='<div class="lab-panel-head"><h3>Calendrier de régularité</h3><span>'+H.project.day+' journée suivie</span></div>';calendar.append(yearMap());calendar.insertAdjacentHTML('beforeend','<div class="lab-year-legend"><span>'+H.project.start.split('-').reverse().join('/')+'</span><span>'+H.project.end.split('-').reverse().join('/')+'</span></div>');
    const story=document.createElement('article');story.className='lab-panel';const storyRow=document.createElement('div');storyRow.className='lab-story';storyRow.append(safeImg('journal','Phoenix Journal'));const storyCopy=document.createElement('div');storyCopy.innerHTML='<span class="lab-kicker">Chapitre actuel</span><h3>'+D.journalTitle+'</h3><p>'+D.journalText+'</p>';storyRow.append(storyCopy);story.append(storyRow);story.insertAdjacentHTML('beforeend','<div class="lab-milestones">'+milestonesHtml()+'</div>');
    grid.append(calendar,story);section.append(grid);

    const insights=document.createElement('div');insights.className='lab-insights';
    const insightData=[
      ['activite','Charge du jour',f0(D.steps)+' pas','Une activité très élevée dès le lancement. La récupération compte autant que le volume.'],
      ['sommeil','Récupération',hm(D.sleepHours),'Durée correcte pour le point zéro. La tendance deviendra utile après plusieurs nuits.'],
      ['sante','Signaux corporels',f0(D.restingHR)+' bpm','La fréquence au repos et la HRV seront interprétées comme des tendances, jamais comme un diagnostic.']
    ];
    insightData.forEach(([key,title,value,body])=>{const card=document.createElement('article');card.className='lab-insight';const top=document.createElement('div');top.className='lab-insight-top';top.append(safeImg(key,'',true));const val=document.createElement('strong');val.className='lab-insight-value';val.textContent=value;top.append(val);card.append(top);card.insertAdjacentHTML('beforeend','<h3>'+title+'</h3><p>'+body+'</p>');insights.append(card)});
    section.append(insights);
    const trophies=document.createElement('div');trophies.className='lab-panel';trophies.style.marginTop='16px';trophies.innerHTML='<div class="lab-panel-head"><h3>Premiers trophées</h3><span>'+(D.trophiesUnlocked||0)+' débloqués</span></div><div class="lab-trophy-strip">'+trophyHtml()+'</div><div class="lab-provenance"><i></i>Données issues du suivi officiel du '+D.date.split('-').reverse().join('/')+' · aucune donnée nutritionnelle inventée</div>';section.append(trophies);
    anchor.parentNode.insertBefore(section,anchor);
  }

  function detailsMessage(key){
    return {
      activite:['Charge élevée, récupération prioritaire.','16 617 pas et 130 minutes d’exercice : un départ exceptionnel, à équilibrer avec du repos.'],
      sommeil:['Durée atteinte, tendance à construire.','7 h 11 est une base correcte. La régularité sur sept nuits donnera une lecture plus fiable.'],
      nutrition:['Journal encore vide : aucune donnée inventée.','La prochaine étape est de saisir repas, protéines et hydratation avec un niveau de précision réaliste.'],
      transformation:['Le point zéro est complet.','112,5 kg, 34,1 % de masse grasse et 108,3 cm de tour de taille créent la base officielle.'],
      sante:['Une valeur ne fait pas une tendance.','La HRV et la fréquence cardiaque doivent être lues sur plusieurs jours, sans diagnostic automatique.'],
      journal:['Le contexte donne du sens aux chiffres.','La marche, la pesée et le sommeil composent le premier chapitre du challenge.'],
      trophees:['Quatre jalons déjà débloqués.','Jour 1, pesée officielle, 10 000 pas et premier 10 km lancent la collection.']
    }[key];
  }

  function detailContext(key){
    const sets={
      activite:[['Pas',f0(D.steps)],['Distance',f2(D.distanceKm)+' km'],['Exercice',f0(D.exerciseMin)+' min']],
      sommeil:[['Total',hm(D.sleepHours)],['Profond',f0(D.sleepDeepMin)+' min'],['REM',f0(D.sleepRemMin)+' min']],
      nutrition:[['Calories','En attente'],['Protéines','En attente'],['Repas','En attente']],
      transformation:[['Poids',f1(D.weightKg)+' kg'],['Masse grasse',f1(D.bodyFatPct)+' %'],['Taille',f1(D.waistCm)+' cm']],
      sante:[['FC repos',f0(D.restingHR)+' bpm'],['HRV',f1(D.hrvMs)+' ms'],['FC max',f0(D.maxHR)+' bpm']],
      journal:[['Jour',H.project.day+' / '+H.project.totalDays],['Départ','29/07/2026'],['Score',D.score+' / 100']],
      trophees:[['Débloqués',f0(D.trophiesUnlocked)],['Série',H.project.day+' jour'],['Prochain palier','7 jours']]
    };
    return (sets[key]||sets.activite).map(x=>'<div><span>'+x[0]+'</span><b>'+x[1]+'</b></div>').join('');
  }

  function enhanceDetails(){
    const qs=new URLSearchParams(location.search),key=H.topics[qs.get('theme')]?qs.get('theme'):'activite';
    const hero=document.querySelector('.detailHero');
    if(hero&&!hero.querySelector('.lab-detail-avatar')){const box=document.createElement('div');box.className='lab-detail-avatar';box.append(safeImg(key,'Phoenix '+H.topics[key].title,false));hero.append(box)}
    const section=document.querySelector('.section');
    if(section&&!section.querySelector('.lab-analysis')){
      const m=detailsMessage(key),note=document.createElement('div');note.className='lab-analysis lab-reveal';note.append(safeImg(key,'',true));const copy=document.createElement('div');copy.innerHTML='<small>Phoenix analyse</small><h3>'+m[0]+'</h3><p>'+m[1]+'</p>';note.append(copy);section.prepend(note);
      const filters=section.querySelector('.filters');if(filters){const context=document.createElement('div');context.className='lab-context lab-reveal';context.innerHTML=detailContext(key);filters.insertAdjacentElement('afterend',context)}
    }
  }

  // Conserver les icônes et la disposition de la navigation officielle.
  if(location.pathname.endsWith('details.html'))enhanceDetails();else{enhanceTopics();buildPulse();buildCommandCenter()}
  observeReveals();
})();