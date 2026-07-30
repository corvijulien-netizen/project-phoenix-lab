(()=>{
  'use strict';

  const cfg=window.PHOENIX_LAB||{};
  const assets=cfg.assets||{};
  const P=window.PHOENIX;
  if(!P||document.documentElement.dataset.phoenixLabV9)return;
  document.documentElement.dataset.phoenixLabV9='true';

  const history=Array.isArray(P.history)?P.history:[];
  const D=history[history.length-1]||{};
  const project=P.project||{};
  const profile=P.profile||{};
  const totalDays=Number(project.totalDays)||365;
  const currentDay=Number(project.day)||1;
  const challengePct=Math.max(.27,Math.min(100,currentDay/totalDays*100));
  const startWeight=Number(profile.startWeightKg)||Number(D.weightKg)||0;
  const goalWeight=Number(profile.goalWeightKg)||80;
  const currentWeight=Number(D.weightKg)||startWeight;
  const weightLost=Math.max(0,startWeight-currentWeight);
  const totalToLose=Math.max(.1,startWeight-goalWeight);
  const weightPct=Math.max(0,Math.min(100,weightLost/totalToLose*100));

  const n0=value=>new Intl.NumberFormat('fr-FR',{maximumFractionDigits:0}).format(Number(value)||0);
  const n1=value=>new Intl.NumberFormat('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1}).format(Number(value)||0);
  const n2=value=>new Intl.NumberFormat('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(value)||0);
  const hm=hours=>{
    if(hours==null)return 'En attente';
    const minutes=Math.round(Number(hours)*60);
    return `${Math.floor(minutes/60)} h ${String(minutes%60).padStart(2,'0')}`;
  };
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
  const q=(selector,root=document)=>root.querySelector(selector);
  const qa=(selector,root=document)=>[...root.querySelectorAll(selector)];

  function replaceTextEverywhere(){
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const value=node.nodeValue||'';
      if(value.includes('Phoenix IA'))node.nodeValue=value.replace(/Phoenix IA/g,'Auren');
    });
    document.title=document.title.replace('Expérience augmentée','Expérience ultime');
  }

  function addScrollProgress(){
    if(q('.px-scroll-progress'))return;
    const bar=document.createElement('div');
    bar.className='px-scroll-progress';
    bar.setAttribute('aria-hidden','true');
    document.body.prepend(bar);
    const update=()=>{
      const max=document.documentElement.scrollHeight-innerHeight;
      bar.style.width=`${max>0?scrollY/max*100:0}%`;
    };
    addEventListener('scroll',update,{passive:true});
    addEventListener('resize',update,{passive:true});
    update();
  }

  function ensureMainAvatar(){
    qa('.lab-topic-avatar,.navAvatar,.lab-detail-avatar').forEach(node=>node.remove());
    qa('.topic img[src*="assets/avatars/"],.phoenix-side-nav img[src*="assets/avatars/"]').forEach(node=>node.remove());

    const card=q('.phoenixCard');
    if(!card)return;
    qa(':scope>img',card).slice(1).forEach(node=>node.remove());
    let image=q(':scope>img',card);
    if(!image){
      image=document.createElement('img');
      card.prepend(image);
    }
    image.className='lab-main-avatar';
    image.alt='Auren, guide principal de Project Phoenix';
    image.decoding='async';
    image.loading='eager';
    image.fetchPriority='high';
    image.src=assets.main||`${cfg.officialBase||''}phoenix.svg`;
    image.onerror=()=>{
      image.onerror=null;
      image.src=`${cfg.officialBase||''}phoenix.svg`;
    };

    let profileBlock=q('.auren-profile',card);
    if(!profileBlock){
      profileBlock=document.createElement('div');
      profileBlock.className='auren-profile';
      image.insertAdjacentElement('afterend',profileBlock);
    }
    profileBlock.innerHTML='<span class="auren-role">Guide officiel du challenge</span><h2>Auren</h2><p>Il transforme les données en repères clairs, protège l’honnêteté du suivi et raconte chaque étape de la reconstruction.</p>';
  }

  function upgradeHero(){
    const hero=q('.hero');
    if(!hero)return;
    const eyebrow=q('.eyebrow',hero);
    if(eyebrow)eyebrow.innerHTML='<i></i> Mission active · transformation publique';
    const title=q('h1',hero);
    if(title)title.innerHTML='365 jours pour rallumer <span>la meilleure version de moi-même.</span>';
    const lead=q('.lead',hero);
    if(lead)lead.innerHTML='<strong>Project Phoenix n’est pas une promesse.</strong> C’est une preuve construite jour après jour : mouvement, sommeil, corps, discipline et vérité des données.';
    const challengeTitle=q('.challengeText h2',hero);
    if(challengeTitle)challengeTitle.textContent=currentDay===1?'Le point zéro est enregistré. La mission commence.':`Jour ${currentDay} : la trajectoire est en mouvement.`;
    const challengeCopy=q('.challengeText p',hero);
    if(challengeCopy)challengeCopy.textContent='Chaque journée officielle ajoute une pièce au récit. Aucun chiffre inventé, aucune progression maquillée.';
    const dayRing=q('.dayRing',hero);
    if(dayRing)dayRing.style.setProperty('--px-day-progress',`${challengePct}%`);
    const yearBar=q('.yearbar i',hero);
    if(yearBar)yearBar.style.width=`${challengePct}%`;
    const yearMeta=q('.yearmeta b',hero);
    if(yearMeta)yearMeta.textContent=`${n2(challengePct)} %`;
  }

  function addSidebarStatus(){
    const nav=q('.phoenix-side-nav');
    if(!nav||q('.px-side-status',nav))return;
    const status=document.createElement('div');
    status.className='px-side-status';
    status.innerHTML=`
      <div class="px-side-status-top"><span>Progression annuelle</span><b>${currentDay} / ${totalDays}</b></div>
      <div class="px-side-track"><i style="width:${challengePct}%"></i></div>
      <div class="px-side-meta"><span>${n2(challengePct)} %</span><span>Score ${n0(D.score)} / 100</span></div>
      <div class="px-live"><i></i> Dernière donnée : ${project.lastUpdate||'mise à jour officielle'}</div>`;
    nav.append(status);
  }

  function chartSvg(){
    const width=760;
    const height=285;
    const left=48;
    const right=24;
    const top=30;
    const bottom=42;
    const plotW=width-left-right;
    const plotH=height-top-bottom;
    const maxWeight=Math.max(startWeight,currentWeight,...history.map(item=>Number(item.weightKg)||0))+2;
    const minWeight=Math.min(goalWeight,currentWeight,...history.map(item=>Number(item.weightKg)||999))-2;
    const y=value=>top+(maxWeight-value)/(maxWeight-minWeight)*plotH;
    const x=index=>history.length<=1?left:left+index/(history.length-1)*plotW;
    const target=`M ${left} ${y(startWeight)} C ${left+plotW*.34} ${y(startWeight-4)} ${left+plotW*.73} ${y(goalWeight+8)} ${left+plotW} ${y(goalWeight)}`;
    const real=history.length?history.map((item,index)=>`${index?'L':'M'} ${x(index)} ${y(Number(item.weightKg)||currentWeight)}`).join(' '):`M ${left} ${y(currentWeight)}`;
    const dots=history.map((item,index)=>`<circle class="px-chart-dot" cx="${x(index)}" cy="${y(Number(item.weightKg)||currentWeight)}" r="7"><title>${item.date||''} : ${n1(item.weightKg)} kg</title></circle>`).join('');
    const currentX=history.length<=1?left:x(history.length-1);
    const currentY=y(currentWeight);
    const bubbleX=Math.min(width-145,currentX+14);
    const labels=[maxWeight,(maxWeight+minWeight)/2,minWeight];
    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Trajectoire du poids de ${n1(startWeight)} vers ${n1(goalWeight)} kilogrammes">
        <defs><linearGradient id="pxLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#48dcf4"/><stop offset=".55" stop-color="#5da8ff"/><stop offset="1" stop-color="#9a78ff"/></linearGradient></defs>
        ${labels.map(value=>`<line class="px-chart-grid" x1="${left}" y1="${y(value)}" x2="${width-right}" y2="${y(value)}"/><text class="px-chart-label" x="${left-8}" y="${y(value)+4}" text-anchor="end">${n0(value)} kg</text>`).join('')}
        <path class="px-chart-target" d="${target}"/>
        <path class="px-chart-real" d="${real}"/>
        ${dots}
        <circle cx="${left+plotW}" cy="${y(goalWeight)}" r="7" fill="#09172c" stroke="rgba(178,198,225,.62)" stroke-width="4"/>
        <rect class="px-chart-bubble" x="${bubbleX}" y="${Math.max(3,currentY-35)}" width="124" height="29" rx="8"/>
        <text class="px-chart-bubble-text" x="${bubbleX+62}" y="${Math.max(3,currentY-35)+19}" text-anchor="middle">${n1(currentWeight)} kg · actuel</text>
        <text class="px-chart-label" x="${left}" y="${height-8}">${(project.start||D.date||'').split('-').reverse().join('/')}</text>
        <text class="px-chart-label" x="${width-right}" y="${height-8}" text-anchor="end">Objectif ${n1(goalWeight)} kg</text>
      </svg>`;
  }

  function yearMap(){
    const cells=[];
    for(let day=1;day<=totalDays;day++){
      cells.push(`<i class="px-day${day<=currentDay?' is-done':''}${day===currentDay?' is-today':''}" title="Jour ${day}"></i>`);
    }
    return cells.join('');
  }

  function missionHtml(){
    const stepDone=Number(D.steps)>=10000;
    const sleepDone=Number(D.sleepHours)>=7;
    return `
      <div class="px-mission ${stepDone?'is-done':'is-wait'}"><span class="px-mission-icon">👟</span><div><b>Activer le corps</b><small>${n0(D.steps)} pas enregistrés · cible 10 000</small></div><span class="px-mission-status">${stepDone?'Validé':'En cours'}</span></div>
      <div class="px-mission ${sleepDone?'is-done':'is-wait'}"><span class="px-mission-icon">☾</span><div><b>Protéger la récupération</b><small>${hm(D.sleepHours)} · cible 7 heures</small></div><span class="px-mission-status">${sleepDone?'Validé':'À consolider'}</span></div>
      <div class="px-mission is-wait"><span class="px-mission-icon">🥗</span><div><b>Documenter la nutrition</b><small>${D.mealCount==null?'Première saisie encore attendue':`${n0(D.mealCount)} repas consignés`}</small></div><span class="px-mission-status">${D.mealCount==null?'À renseigner':'Suivi'}</span></div>`;
  }

  function buildCommandCenter(){
    if(q('#phoenix-command-center'))return;
    const hero=q('.hero');
    if(!hero)return;
    const nextTarget=currentWeight>110?110:currentWeight>105?105:currentWeight>100?100:90;
    const targetGap=Math.max(0,currentWeight-nextTarget);
    const activityPct=clamp((Number(D.steps)||0)/10000*100,0,100);
    const sleepPct=clamp((Number(D.sleepHours)||0)/7*100,0,100);
    const bmi=Number(D.bmi)||0;
    const level=Math.max(1,Math.floor(currentDay/7)+1);
    const xp=currentDay%7/7*100||14;

    const section=document.createElement('section');
    section.id='phoenix-command-center';
    section.className='px-command';
    section.innerHTML=`
      <header class="px-command-head">
        <div><span class="px-kicker">Phoenix Command Center</span><h2>Le tableau de bord qui raconte la transformation.</h2><p>Une lecture immédiate du corps, de l’effort et de la trajectoire — construite uniquement avec les données officiellement publiées.</p></div>
        <div class="px-sync"><i></i> Données validées · Jour ${currentDay}</div>
      </header>

      <div class="px-metrics">
        <article class="px-metric"><small>Poids officiel</small><strong>${n1(currentWeight)} <span>kg</span></strong><p>${weightLost>0?`−${n1(weightLost)} kg depuis le départ`:'Point zéro de référence'}</p><div class="px-mini-track"><i style="width:${Math.max(2,weightPct)}%"></i></div></article>
        <article class="px-metric"><small>Mouvement</small><strong>${n0(D.steps)} <span>pas</span></strong><p>${n2(D.distanceKm)} km · ${n0(D.exerciseMin)} min d’exercice</p><div class="px-mini-track"><i style="width:${activityPct}%"></i></div></article>
        <article class="px-metric"><small>Récupération</small><strong>${hm(D.sleepHours)}</strong><p>${n0(D.sleepDeepMin)} min profond · ${n0(D.sleepRemMin)} min REM</p><div class="px-mini-track"><i style="width:${sleepPct}%"></i></div></article>
        <article class="px-metric"><small>Corps</small><strong>${n1(D.bodyFatPct)} <span>% MG</span></strong><p>IMC ${n1(bmi)} · taille ${n1(D.waistCm)} cm</p><div class="px-mini-track"><i style="width:${clamp(100-(Number(D.bodyFatPct)||0),8,100)}%"></i></div></article>
      </div>

      <div class="px-command-grid">
        <article class="px-panel">
          <div class="px-panel-head"><div><span class="px-kicker">Trajectoire officielle</span><h3>De ${n1(startWeight)} à ${n1(goalWeight)} kg</h3><p>La ligne pleine utilise les pesées réelles. Le pointillé montre uniquement le cap, jamais une promesse de date.</p></div><div class="px-range" aria-label="Période du graphique"><button class="is-active" type="button" data-range="1">1J</button><button type="button" data-range="7">7J</button><button type="button" data-range="30">30J</button></div></div>
          <div class="px-chart">${chartSvg()}</div>
          <div class="px-chart-foot"><span>Prochain palier : <b>${nextTarget} kg</b></span><span>${targetGap?`${n1(targetGap)} kg à franchir`:'Palier atteint'}</span></div>
          <div class="px-chart-message" aria-live="polite">Une seule journée officielle est disponible. Cette vue s’enrichira automatiquement.</div>
        </article>

        <article class="px-panel">
          <div class="px-panel-head"><div><span class="px-kicker">Indice Phoenix</span><h3>État global du Jour ${currentDay}</h3></div></div>
          <div class="px-score-layout"><div class="px-score-ring" style="--score:${clamp(Number(D.score)||0,0,100)}"><div><strong>${n0(D.score)}</strong><span>sur 100</span></div></div><div class="px-score-copy"><h3>${Number(D.score)>=90?'Départ exceptionnel':Number(D.score)>=75?'Trajectoire solide':'Base à construire'}</h3><p>Le score synthétise les indicateurs publics du jour. Il sert de repère visuel, pas de diagnostic médical.</p></div></div>
          <div class="px-xp"><div class="px-xp-row"><span>Niveau Phoenix ${level}</span><b>${n0(xp)} % vers le niveau suivant</b></div><div class="px-xp-track"><i style="width:${xp}%"></i></div></div>
        </article>
      </div>

      <div class="px-lower-grid">
        <article class="px-panel"><span class="px-kicker">Missions du jour</span><h3 style="margin:5px 0 0">Trois leviers, aucune complication.</h3><div class="px-missions">${missionHtml()}</div></article>
        <article class="px-panel px-briefing"><span class="px-kicker">Briefing d’Auren</span><blockquote>Tu n’as pas besoin d’être parfait pendant 365 jours. Tu dois seulement rendre la prochaine bonne décision plus facile que la mauvaise.</blockquote><footer>Analyse du Jour ${currentDay} · fondée sur les données disponibles</footer><div class="px-briefing-tags"><span>Point fort : activité</span><span>Priorité : récupération</span><span>Prochaine donnée : nutrition</span></div></article>
      </div>

      <div class="px-journey"><div class="px-journey-head"><h3>La trace des 365 jours</h3><span>${currentDay} journée${currentDay>1?'s':''} officiellement enregistrée${currentDay>1?'s':''}</span></div><div class="px-year-map" role="img" aria-label="${currentDay} jour suivi sur ${totalDays}">${yearMap()}</div><div class="px-year-legend"><span>${(project.start||'').split('-').reverse().join('/')}</span><span>Chaque case est une journée réelle</span><span>${(project.end||'').split('-').reverse().join('/')}</span></div></div>`;

    hero.insertAdjacentElement('afterend',section);
  }

  function setupRangeButtons(){
    const message=q('.px-chart-message');
    qa('.px-range button').forEach(button=>button.addEventListener('click',()=>{
      qa('.px-range button').forEach(item=>item.classList.remove('is-active'));
      button.classList.add('is-active');
      if(message){
        message.classList.toggle('is-visible',button.dataset.range!=='1'||history.length<2);
        message.textContent=button.dataset.range==='1'?'Vue de la journée officielle.':`La vue ${button.dataset.range} jours se construira dès que suffisamment de journées seront disponibles.`;
      }
    }));
  }

  function decorateTopics(){
    const cards=qa('.summaryGrid .topic');
    cards.forEach((card,index)=>{
      card.classList.add('lab-reveal');
      if(!q('.px-module-index',card)){
        const number=document.createElement('span');
        number.className='px-module-index';
        number.textContent=String(index+1).padStart(2,'0');
        card.append(number);
      }
    });
    const sectionTitle=q('#synthese .sectionHead h2');
    if(sectionTitle)sectionTitle.textContent='Sept modules pour lire une seule transformation';
    const sectionCopy=q('#synthese .sectionHead p');
    if(sectionCopy)sectionCopy.textContent='Chaque module ouvre un niveau de détail différent. Les tendances apparaissent uniquement lorsque l’historique devient suffisant.';
  }

  function activateNavigation(){
    const detail=location.pathname.endsWith('details.html');
    const theme=new URLSearchParams(location.search).get('theme');
    qa('.phoenix-side-nav a').forEach(link=>{
      const active=detail?theme&&link.href.includes(`theme=${theme}`):link.getAttribute('href')==='#top';
      link.classList.toggle('is-active',Boolean(active));
      if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
    });
  }

  function detailMetrics(theme){
    const metrics={
      activite:[['Pas',n0(D.steps)],['Distance',`${n2(D.distanceKm)} km`],['Exercice',`${n0(D.exerciseMin)} min`]],
      sommeil:[['Sommeil',hm(D.sleepHours)],['Profond',`${n0(D.sleepDeepMin)} min`],['REM',`${n0(D.sleepRemMin)} min`]],
      nutrition:[['Calories',D.loggedCaloriesKcal==null?'En attente':`${n0(D.loggedCaloriesKcal)} kcal`],['Protéines',D.proteinG==null?'En attente':`${n0(D.proteinG)} g`],['Repas',D.mealCount==null?'En attente':n0(D.mealCount)]],
      transformation:[['Poids',`${n1(D.weightKg)} kg`],['Masse grasse',`${n1(D.bodyFatPct)} %`],['Tour de taille',`${n1(D.waistCm)} cm`]],
      sante:[['FC repos',`${n0(D.restingHR)} bpm`],['HRV',`${n1(D.hrvMs)} ms`],['FC max',`${n0(D.maxHR)} bpm`]],
      journal:[['Jour',`${currentDay} / ${totalDays}`],['Date',(D.date||'').split('-').reverse().join('/')],['Score',`${n0(D.score)} / 100`]],
      trophees:[['Débloqués',n0(D.trophiesUnlocked)],['Série',`${currentDay} jour${currentDay>1?'s':''}`],['Prochain cap','7 jours']]
    };
    return metrics[theme]||metrics.activite;
  }

  function enhanceDetails(){
    const theme=new URLSearchParams(location.search).get('theme')||'activite';
    const section=q('.section');
    if(!section)return;
    qa('.lab-detail-avatar,.lab-analysis>img').forEach(node=>node.remove());
    if(!q('.px-detail-overview',section)){
      const overview=document.createElement('div');
      overview.className='px-detail-overview';
      overview.innerHTML=detailMetrics(theme).map(([label,value])=>`<article class="px-detail-metric"><span>${label}</span><b>${value}</b></article>`).join('');
      section.prepend(overview);
    }
    if(!q('.lab-analysis',section)){
      const messages={
        activite:['Une journée très active.','La priorité est maintenant de transformer ce volume exceptionnel en rythme durable.'],
        sommeil:['Une base correcte, pas encore une tendance.','Plusieurs nuits seront nécessaires avant de conclure sur la récupération.'],
        nutrition:['Le vide vaut mieux qu’une invention.','Aucune donnée nutritionnelle ne sera affichée tant qu’elle n’est pas réellement consignée.'],
        transformation:['Le point zéro est complet.','Poids, masse grasse et tour de taille donnent une base solide aux futures comparaisons.'],
        sante:['Lire les tendances, jamais diagnostiquer.','Fréquence cardiaque et HRV sont présentées comme des repères de suivi.'],
        journal:['Les chiffres ont besoin d’une histoire.','Le journal conserve les décisions, les difficultés et les victoires derrière les données.'],
        trophees:['Les jalons rendent l’effort visible.','Chaque trophée récompense une action réellement enregistrée.']
      };
      const [title,text]=messages[theme]||messages.activite;
      const note=document.createElement('div');
      note.className='lab-analysis';
      note.innerHTML=`<small>Analyse d’Auren</small><h3>${title}</h3><p>${text}</p>`;
      section.prepend(note);
    }
  }

  function revealOnScroll(){
    const nodes=qa('.lab-reveal,.px-command,.px-panel,.px-metric');
    nodes.forEach(node=>node.classList.add('lab-reveal'));
    if(!('IntersectionObserver'in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){
      nodes.forEach(node=>node.classList.add('is-visible'));
      return;
    }
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }),{threshold:.06,rootMargin:'0px 0px -30px'});
    nodes.forEach(node=>observer.observe(node));
  }

  function avatarParallax(){
    const card=q('.phoenixCard');
    if(!card||!matchMedia('(pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    card.addEventListener('pointermove',event=>{
      const rect=card.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      card.style.transform=`perspective(1000px) rotateY(${x*4}deg) rotateX(${-y*3}deg)`;
    });
    card.addEventListener('pointerleave',()=>{card.style.transform=''});
  }

  replaceTextEverywhere();
  addScrollProgress();
  ensureMainAvatar();
  upgradeHero();
  addSidebarStatus();
  activateNavigation();

  if(location.pathname.endsWith('details.html')){
    enhanceDetails();
  }else{
    buildCommandCenter();
    setupRangeButtons();
    decorateTopics();
  }

  avatarParallax();
  revealOnScroll();
})();
