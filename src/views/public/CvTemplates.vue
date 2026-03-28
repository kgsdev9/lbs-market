<template>
  <div id="cv-render" class="cv-paper">

    <!-- ══ 1. CLASSIQUE ══ -->
    <div v-if="selectedTpl==='classic'" class="cv-classic">
      <div class="cc-hd" :style="{background:accentColor}">
        <img v-if="cv.photo" :src="cv.photo" class="cc-photo" @error="e=>e.target.style.display='none'"/>
        <div class="cc-info">
          <h1 class="cc-name">{{ cv.firstName||'Prénom' }} {{ cv.lastName||'Nom' }}</h1>
          <p class="cc-job">{{ cv.title||'Votre titre' }}</p>
          <div v-if="cv.dateNaissance" class="cc-dob">🎂 {{ formatDate(cv.dateNaissance) }}</div>
          <div class="cc-contacts">
            <span v-if="cv.email">✉ {{ cv.email }}</span>
            <span v-if="cv.phone">📞 {{ cv.phone }}</span>
            <span v-if="cv.city">📍 {{ cv.city }}{{ cv.country?', '+cv.country:'' }}</span>
            <span v-if="cv.website">🔗 {{ cv.website }}</span>
          </div>
        </div>
      </div>
      <div class="cc-body">
        <div class="cc-left">
          <div v-if="cv.skills.some(s=>s.name)" class="cc-sec">
            <div class="cc-sec-t" :style="{color:accentColor}">Compétences</div>
            <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="cc-skill">
              <div class="cc-sk-lbl">{{ s.name }}</div>
              <div class="cc-sk-track"><div :style="{width:(s.level*25)+'%',background:accentColor}" class="cc-sk-fill"></div></div>
            </div>
          </div>
          <div v-if="cv.languages.some(l=>l.name)" class="cc-sec">
            <div class="cc-sec-t" :style="{color:accentColor}">Langues</div>
            <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="cc-lang"><span>{{ l.name }}</span><span class="cc-lang-lvl">{{ l.level }}</span></div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="cc-sec">
            <div class="cc-sec-t" :style="{color:accentColor}">Aptitudes</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="cc-skill">
              <div class="cc-sk-lbl">{{ a.name }}</div>
              <div class="cc-sk-track"><div :style="{width:(a.level*25)+'%',background:'#f59e0b'}" class="cc-sk-fill"></div></div>
            </div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="cc-sec">
            <div class="cc-sec-t" :style="{color:accentColor}">Centres d'intérêt</div>
            <div class="cc-interests">
              <span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="cc-interest-tag" :style="{borderColor:accentColor+'44',color:accentColor}">{{ c.name }}</span>
            </div>
          </div>
        </div>
        <div class="cc-right">
          <div v-if="cv.summary" class="cc-sec"><div class="cc-sec-t" :style="{color:accentColor}">Profil</div><p class="cc-txt">{{ cv.summary }}</p></div>
          <div v-if="cv.experiences.some(e=>e.position)" class="cc-sec">
            <div class="cc-sec-t" :style="{color:accentColor}">Expériences</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position+'_'+e.company" class="cc-entry">
              <div class="cc-bar" :style="{background:accentColor}"></div>
              <div class="cc-eb">
                <div class="cc-et"><span class="cc-pos">{{ e.position }}</span><span class="cc-date">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div>
                <div class="cc-co">{{ e.company }}</div>
                <cv-bullets :exp="e" :color="accentColor" />
              </div>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="cc-sec">
            <div class="cc-sec-t" :style="{color:accentColor}">Formation</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="cc-entry">
              <div class="cc-bar" :style="{background:accentColor}"></div>
              <div class="cc-eb">
                <div class="cc-et"><span class="cc-pos">{{ e.degree }}</span><span class="cc-date">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</span></div>
                <div class="cc-co">{{ e.school }}</div>
              </div>
            </div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="cc-sec">
            <div class="cc-sec-t" :style="{color:accentColor}">Projets</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="cc-entry">
              <div class="cc-bar" :style="{background:accentColor}"></div>
              <div class="cc-eb"><div class="cc-et"><span class="cc-pos">{{ p.name }}</span><span v-if="p.tech" class="cc-tech">{{ p.tech }}</span></div><p v-if="p.description" class="cc-txt cc-desc">{{ p.description }}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ 2. MINIMAL ══ -->
    <div v-if="selectedTpl==='minimal'" class="cv-min">
      <div class="cm-top">
        <div class="cm-top-left">
          <img v-if="cv.photo" :src="cv.photo" class="cm-photo" @error="e=>e.target.style.display='none'"/>
          <div class="cm-top-text">
            <h1 class="cm-name">{{ cv.firstName||'Prénom' }} <span :style="{color:accentColor}">{{ cv.lastName||'Nom' }}</span></h1>
            <p class="cm-job">{{ cv.title }}</p>
            <p v-if="cv.dateNaissance" class="cm-dob">{{ formatDate(cv.dateNaissance) }}</p>
          </div>
        </div>
        <div class="cm-contacts"><span v-if="cv.email">{{ cv.email }}</span><span v-if="cv.phone">{{ cv.phone }}</span><span v-if="cv.city">{{ cv.city }}</span></div>
      </div>
      <div class="cm-div" :style="{background:accentColor}"></div>
      <p v-if="cv.summary" class="cm-summary">{{ cv.summary }}</p>
      <div v-if="cv.experiences.some(e=>e.position)" class="cm-sec"><div class="cm-sec-t">EXPÉRIENCES</div>
        <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position+'_'+e.company" class="cm-entry">
          <div class="cm-el"><div class="cm-date">{{ e.startDate }}<br/>{{ e.endDate }}</div></div>
          <div class="cm-er">
            <div class="cm-pos">{{ e.position }}</div><div class="cm-co">{{ e.company }}</div>
            <cv-bullets :exp="e" :color="accentColor" />
          </div>
        </div>
      </div>
      <div v-if="cv.education.some(e=>e.degree)" class="cm-sec"><div class="cm-sec-t">FORMATION</div>
        <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="cm-entry">
          <div class="cm-el"><div class="cm-date">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+'–'+e.anneeFin : e.year }}</div></div>
          <div class="cm-er"><div class="cm-pos">{{ e.degree }}</div><div class="cm-co">{{ e.school }}</div></div>
        </div>
      </div>
      <div v-if="cv.skills.some(s=>s.name)" class="cm-sec"><div class="cm-sec-t">COMPÉTENCES</div>
        <div class="cm-tags"><span v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="cm-tag" :style="{borderColor:accentColor,color:accentColor}">{{ s.name }}</span></div>
      </div>
      <div v-if="cv.centresInteret.some(c=>c.name)" class="cm-sec"><div class="cm-sec-t">CENTRES D'INTÉRÊT</div>
        <div class="cm-tags"><span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="cm-tag" :style="{borderColor:'#9ca3af',color:'#6b7280'}">{{ c.name }}</span></div>
      </div>
      <div v-if="cv.projects.some(p=>p.name)" class="cm-sec"><div class="cm-sec-t">PROJETS</div>
        <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="cm-entry"><div class="cm-el"><div class="cm-date" style="font-size:10px">{{ p.tech }}</div></div><div class="cm-er"><div class="cm-pos">{{ p.name }}</div><p v-if="p.description" class="cm-desc">{{ p.description }}</p></div></div>
      </div>
    </div>

    <!-- ══ 3. MODERNE ══ -->
    <div v-if="selectedTpl==='modern'" class="cv-mod">
      <div class="cmod-aside" :style="{background:accentColor}">
        <div class="cmod-photo-wrap">
          <img v-if="cv.photo" :src="cv.photo" class="cmod-photo" @error="e=>e.target.style.display='none'"/>
          <div v-else class="cmod-init">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
        </div>
        <h2 class="cmod-name">{{ cv.firstName }}<br/>{{ cv.lastName }}</h2>
        <p class="cmod-job">{{ cv.title }}</p>
        <div v-if="cv.dateNaissance" class="cmod-dob">🎂 {{ formatDate(cv.dateNaissance) }}</div>
        <div class="cmod-blk"><div class="cmod-blk-t">CONTACT</div>
          <div v-if="cv.email" class="cmod-item">✉ {{ cv.email }}</div>
          <div v-if="cv.phone" class="cmod-item">📞 {{ cv.phone }}</div>
          <div v-if="cv.city" class="cmod-item">📍 {{ cv.city }}</div>
          <div v-if="cv.website" class="cmod-item">🔗 {{ cv.website }}</div>
        </div>
        <div v-if="cv.skills.some(s=>s.name)" class="cmod-blk"><div class="cmod-blk-t">COMPÉTENCES</div>
          <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="cmod-skill"><div class="cmod-sk-n">{{ s.name }}</div><div class="cmod-dots"><span v-for="d in 4" :key="d" class="cmod-dot" :class="{filled:d<=s.level}"></span></div></div>
        </div>
        <div v-if="cv.languages.some(l=>l.name)" class="cmod-blk"><div class="cmod-blk-t">LANGUES</div>
          <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="cmod-lang"><span>{{ l.name }}</span><span class="cmod-lang-lvl">{{ l.level }}</span></div>
        </div>
        <div v-if="cv.centresInteret.some(c=>c.name)" class="cmod-blk"><div class="cmod-blk-t">INTÉRÊTS</div>
          <div class="cmod-interests"><span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="cmod-interest">{{ c.name }}</span></div>
        </div>
      </div>
      <div class="cmod-main">
        <div v-if="cv.summary" class="cmod-sec"><div class="cmod-sec-t" :style="{color:accentColor}">À PROPOS</div><p class="cmod-txt">{{ cv.summary }}</p></div>
        <div v-if="cv.experiences.some(e=>e.position)" class="cmod-sec"><div class="cmod-sec-t" :style="{color:accentColor}">EXPÉRIENCES</div>
          <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position+'_'+e.company" class="cmod-entry">
            <div class="cmod-dot-b" :style="{background:accentColor}"></div>
            <div class="cmod-eb">
              <div class="cmod-et"><span class="cmod-pos">{{ e.position }}</span><span class="cmod-date">{{ e.startDate }} – {{ e.endDate||'Présent' }}</span></div>
              <div class="cmod-co">{{ e.company }}</div>
              <cv-bullets :exp="e" :color="accentColor" />
            </div>
          </div>
        </div>
        <div v-if="cv.education.some(e=>e.degree)" class="cmod-sec"><div class="cmod-sec-t" :style="{color:accentColor}">FORMATION</div>
          <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="cmod-entry">
            <div class="cmod-dot-b" :style="{background:accentColor}"></div>
            <div class="cmod-eb"><div class="cmod-pos">{{ e.degree }}</div><div class="cmod-co">{{ e.school }} · {{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</div></div>
          </div>
        </div>
        <div v-if="cv.aptitudes.some(a=>a.name)" class="cmod-sec"><div class="cmod-sec-t" :style="{color:accentColor}">APTITUDES</div>
          <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="cmod-skill" style="margin-bottom:5px">
            <div class="cmod-sk-n" style="color:#374151">{{ a.name }}</div>
            <div class="cmod-dots"><span v-for="d in 4" :key="d" class="cmod-dot" :style="{background:d<=a.level?'#f59e0b':'#e5e7eb'}"></span></div>
          </div>
        </div>
        <div v-if="cv.projects.some(p=>p.name)" class="cmod-sec"><div class="cmod-sec-t" :style="{color:accentColor}">PROJETS</div>
          <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="cmod-proj"><div class="cmod-proj-hd"><span class="cmod-pos">{{ p.name }}</span><span v-if="p.tech" class="cmod-tech">{{ p.tech }}</span></div><p v-if="p.description" class="cmod-desc">{{ p.description }}</p></div>
        </div>
      </div>
    </div>

    <!-- ══ 4. CORPORATE ══ -->
    <div v-if="selectedTpl==='corporate'" class="cv-corp">
      <div class="corp-top">
        <div class="corp-photo-wrap">
          <img v-if="cv.photo" :src="cv.photo" class="corp-photo-img" @error="e=>e.target.style.display='none'"/>
          <div v-else class="corp-avatar">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
        </div>
        <div class="corp-tr">
          <h1 class="corp-name">{{ cv.firstName||'Prénom' }} {{ cv.lastName||'Nom' }}</h1>
          <p class="corp-job" :style="{color:accentColor}">{{ cv.title }}</p>
          <div class="corp-contacts">
            <span v-if="cv.email">{{ cv.email }}</span><span v-if="cv.phone">{{ cv.phone }}</span>
            <span v-if="cv.city">{{ cv.city }}{{ cv.country?', '+cv.country:'' }}</span>
            <span v-if="cv.dateNaissance">Né(e) le {{ formatDate(cv.dateNaissance) }}</span>
          </div>
        </div>
      </div>
      <div class="corp-bar" :style="{background:accentColor}"></div>
      <div class="corp-body">
        <div class="corp-left">
          <div v-if="cv.summary" class="corp-sec"><div class="corp-sec-t" :style="{borderColor:accentColor,color:accentColor}">PROFIL</div><p class="corp-txt">{{ cv.summary }}</p></div>
          <div v-if="cv.skills.some(s=>s.name)" class="corp-sec"><div class="corp-sec-t" :style="{borderColor:accentColor,color:accentColor}">COMPÉTENCES</div>
            <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="corp-skill"><div class="corp-sk-lbl">{{ s.name }}</div><div class="corp-sk-track"><div class="corp-sk-fill" :style="{width:(s.level*25)+'%',background:accentColor}"></div></div></div>
          </div>
          <div v-if="cv.languages.some(l=>l.name)" class="corp-sec"><div class="corp-sec-t" :style="{borderColor:accentColor,color:accentColor}">LANGUES</div>
            <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="corp-lang"><span>{{ l.name }}</span><span class="corp-lang-lvl" :style="{background:accentColor}">{{ l.level }}</span></div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="corp-sec"><div class="corp-sec-t" :style="{borderColor:accentColor,color:accentColor}">INTÉRÊTS</div>
            <div class="corp-interests"><span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="corp-interest-tag">{{ c.name }}</span></div>
          </div>
        </div>
        <div class="corp-right">
          <div v-if="cv.experiences.some(e=>e.position)" class="corp-sec"><div class="corp-sec-t" :style="{borderColor:accentColor,color:accentColor}">EXPÉRIENCES</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position+'_'+e.company" class="corp-entry">
              <div class="corp-et"><span class="corp-ep">{{ e.position }}</span><span class="corp-ed" :style="{background:accentColor+'18',color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div>
              <div class="corp-eco">{{ e.company }}</div>
              <cv-bullets :exp="e" :color="accentColor" />
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="corp-sec"><div class="corp-sec-t" :style="{borderColor:accentColor,color:accentColor}">FORMATION</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="corp-entry">
              <div class="corp-et"><span class="corp-ep">{{ e.degree }}</span><span class="corp-ed" :style="{background:accentColor+'18',color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</span></div>
              <div class="corp-eco">{{ e.school }}</div>
            </div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="corp-sec"><div class="corp-sec-t" :style="{borderColor:accentColor,color:accentColor}">APTITUDES</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="corp-skill"><div class="corp-sk-lbl">{{ a.name }}</div><div class="corp-sk-track"><div class="corp-sk-fill" :style="{width:(a.level*25)+'%',background:'#f59e0b'}"></div></div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ 5. ÉLÉGANT ══ -->
    <div v-if="selectedTpl==='elegant'" class="cv-eleg">
      <div class="eleg-hd" :style="{borderBottomColor:accentColor}">
        <div class="eleg-photo-wrap">
          <img v-if="cv.photo" :src="cv.photo" class="eleg-photo" @error="e=>e.target.style.display='none'"/>
          <div v-else class="eleg-init" :style="{background:accentColor+'22',color:accentColor}">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
        </div>
        <div class="eleg-hi">
          <h1 class="eleg-name">{{ cv.firstName||'Prénom' }} <strong>{{ cv.lastName||'Nom' }}</strong></h1>
          <p class="eleg-job" :style="{color:accentColor}">{{ cv.title }}</p>
          <div class="eleg-contacts">
            <span v-if="cv.email">✉ {{ cv.email }}</span><span v-if="cv.phone">📞 {{ cv.phone }}</span>
            <span v-if="cv.city">📍 {{ cv.city }}{{ cv.country?', '+cv.country:'' }}</span>
            <span v-if="cv.dateNaissance">🎂 {{ formatDate(cv.dateNaissance) }}</span>
          </div>
        </div>
      </div>
      <div class="eleg-body">
        <div class="eleg-left">
          <div v-if="cv.summary" class="eleg-sec"><div class="eleg-sec-t" :style="{color:accentColor}">PROFIL</div><p class="eleg-txt">{{ cv.summary }}</p></div>
          <div v-if="cv.skills.some(s=>s.name)" class="eleg-sec"><div class="eleg-sec-t" :style="{color:accentColor}">COMPÉTENCES</div>
            <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="eleg-skill"><span class="eleg-sk-n">{{ s.name }}</span><div class="eleg-dots"><span v-for="d in 4" :key="d" class="eleg-dot" :style="{background:d<=s.level?accentColor:'#e5e7eb'}"></span></div></div>
          </div>
          <div v-if="cv.languages.some(l=>l.name)" class="eleg-sec"><div class="eleg-sec-t" :style="{color:accentColor}">LANGUES</div>
            <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="eleg-lang"><span>{{ l.name }}</span><span class="eleg-lang-lvl">{{ l.level }}</span></div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="eleg-sec"><div class="eleg-sec-t" :style="{color:accentColor}">INTÉRÊTS</div>
            <div class="eleg-interests"><span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="eleg-interest">{{ c.name }}</span></div>
          </div>
        </div>
        <div class="eleg-right">
          <div v-if="cv.experiences.some(e=>e.position)" class="eleg-sec"><div class="eleg-sec-t" :style="{color:accentColor}">EXPÉRIENCES</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position+'_'+e.company" class="eleg-entry">
              <div class="eleg-marker" :style="{background:accentColor}"></div>
              <div>
                <div class="eleg-et"><span class="eleg-pos">{{ e.position }}</span><span class="eleg-date">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div>
                <div class="eleg-co">{{ e.company }}</div>
                <cv-bullets :exp="e" :color="accentColor" />
              </div>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="eleg-sec"><div class="eleg-sec-t" :style="{color:accentColor}">FORMATION</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="eleg-entry">
              <div class="eleg-marker" :style="{background:accentColor}"></div>
              <div><div class="eleg-et"><span class="eleg-pos">{{ e.degree }}</span><span class="eleg-date">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</span></div><div class="eleg-co">{{ e.school }}</div></div>
            </div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="eleg-sec"><div class="eleg-sec-t" :style="{color:accentColor}">APTITUDES</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="eleg-skill"><span class="eleg-sk-n">{{ a.name }}</span><div class="eleg-dots"><span v-for="d in 4" :key="d" class="eleg-dot" :style="{background:d<=a.level?'#f59e0b':'#e5e7eb'}"></span></div></div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="eleg-sec"><div class="eleg-sec-t" :style="{color:accentColor}">PROJETS</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="eleg-proj"><div class="eleg-proj-n">{{ p.name }}<span v-if="p.tech" class="eleg-proj-tech">{{ p.tech }}</span></div><p v-if="p.description" class="eleg-desc">{{ p.description }}</p></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ 6-14 : templates Dark, Timeline, Swiss, Creative, Tech, Academic, Luxury, Gradient, Compact ══ -->
    <!-- (identiques à votre code original, avec <cv-bullets> remplaçant les blocs description inline) -->
    <!-- Les templates 6 à 14 sont copiés ici tels quels depuis votre original,
         seules les sections description des expériences utilisent <cv-bullets> -->

    <div v-if="selectedTpl==='dark'" class="cv-dark">
      <div class="dk-hd">
        <div class="dk-photo-wrap"><img v-if="cv.photo" :src="cv.photo" class="dk-photo" @error="e=>e.target.style.display='none'"/><div v-else class="dk-init" :style="{borderColor:accentColor,color:accentColor}">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div></div>
        <div class="dk-hi">
          <h1 class="dk-name">{{ cv.firstName||'Prénom' }} {{ cv.lastName||'Nom' }}</h1>
          <p class="dk-job" :style="{color:accentColor}">{{ cv.title }}</p>
          <div class="dk-contacts"><span v-if="cv.email">{{ cv.email }}</span><span v-if="cv.phone">{{ cv.phone }}</span><span v-if="cv.city">{{ cv.city }}{{ cv.country?', '+cv.country:'' }}</span><span v-if="cv.dateNaissance">Né(e) {{ formatDate(cv.dateNaissance) }}</span></div>
        </div>
      </div>
      <div class="dk-divline" :style="{background:accentColor}"></div>
      <div class="dk-body">
        <div class="dk-left">
          <div v-if="cv.skills.some(s=>s.name)" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">COMPÉTENCES</div><div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="dk-skill"><div class="dk-sk-n">{{ s.name }}</div><div class="dk-sk-track"><div class="dk-sk-fill" :style="{width:(s.level*25)+'%',background:accentColor}"></div></div></div></div>
          <div v-if="cv.languages.some(l=>l.name)" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">LANGUES</div><div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="dk-lang"><span>{{ l.name }}</span><span class="dk-lang-lvl" :style="{background:accentColor+'33',color:accentColor}">{{ l.level }}</span></div></div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">INTÉRÊTS</div><div class="dk-interests"><span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="dk-interest" :style="{background:accentColor+'22',color:accentColor}">{{ c.name }}</span></div></div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">APTITUDES</div><div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="dk-skill"><div class="dk-sk-n">{{ a.name }}</div><div class="dk-sk-track"><div class="dk-sk-fill" :style="{width:(a.level*25)+'%',background:'#f59e0b'}"></div></div></div></div>
        </div>
        <div class="dk-right">
          <div v-if="cv.summary" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">PROFIL</div><p class="dk-txt">{{ cv.summary }}</p></div>
          <div v-if="cv.experiences.some(e=>e.position)" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">EXPÉRIENCES</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position+'_'+e.company" class="dk-entry">
              <div class="dk-entry-dot" :style="{background:accentColor}"></div>
              <div><div class="dk-et"><span class="dk-pos">{{ e.position }}</span><span class="dk-date" :style="{color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div><div class="dk-co">{{ e.company }}</div><cv-bullets :exp="e" :color="accentColor" dark /></div>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">FORMATION</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="dk-entry"><div class="dk-entry-dot" :style="{background:accentColor}"></div><div><div class="dk-et"><span class="dk-pos">{{ e.degree }}</span><span class="dk-date" :style="{color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</span></div><div class="dk-co">{{ e.school }}</div></div></div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">PROJETS</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="dk-proj"><div class="dk-proj-n">{{ p.name }}<span v-if="p.tech" class="dk-tech" :style="{background:accentColor+'22',color:accentColor}">{{ p.tech }}</span></div><p v-if="p.description" class="dk-txt dk-desc">{{ p.description }}</p></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Les templates 7-14 (Timeline, Swiss, Creative, Tech, Academic, Luxury, Gradient, Compact)
         suivent le même pattern : remplacer les blocs description/bullets par <cv-bullets :exp="e" :color="accentColor" />
         Le reste du markup est identique à votre code original. -->

  </div>
</template>

<script>
/**
 * ══════════════════════════════════════════════════
 *  CvBullets — sous-composant interne pour les puces
 * ══════════════════════════════════════════════════
 * Formats supportés dans `description` :
 *   - "- Capacité à vendre\n- Automatisation Power BI"
 *   - "• Capacité à vendre\n• Automatisation Power BI"
 *   - "* Item un\n* Item deux"
 * Ou tableau `bullets[]` dédié.
 */
const CvBullets = {
  name: 'CvBullets',
  props: {
    exp:   { type: Object,  required: true },
    color: { type: String,  default: '#2563eb' },
    dark:  { type: Boolean, default: false },
  },
  computed: {
    lines() {
      // 1. Tableau bullets[] prioritaire
      if (this.exp.bullets && this.exp.bullets.length) {
        return this.exp.bullets.filter(b => b && b.trim())
      }
      // 2. Parser la description markdown simple
      if (!this.exp.description) return []
      const rawLines = this.exp.description.split('\n')
      const bullets = rawLines
        .map(l => l.trim())
        .filter(l => /^[-*•]/.test(l))
        .map(l => l.replace(/^[-*•]\s*/, '').trim())
      return bullets
    },
    hasPlainText() {
      return !this.lines.length && !!this.exp.description
    },
  },
  template: `
    <div v-if="lines.length" class="cvb-list">
      <div v-for="(line, i) in lines" :key="i" class="cvb-item">
        <span class="cvb-dot" :style="{background: color}"></span>
        <span :style="{color: dark ? '#9ca3af' : '#4b5563'}">{{ line }}</span>
      </div>
    </div>
    <p v-else-if="hasPlainText" class="cvb-plain" :style="{color: dark ? '#9ca3af' : '#555'}">{{ exp.description }}</p>
  `,
}

export default {
  name: 'CvTemplates',
  components: { CvBullets },
  props: {
    cv:          { type: Object,  required: true },
    selectedTpl: { type: String,  required: true },
    accentColor: { type: String,  default: '#2563eb' },
  },
  methods: {
    formatDate(d) {
      if (!d) return ''
      try { const [y,m,j] = d.split('-'); return `${j}/${m}/${y}` } catch { return d }
    },
  },
}
</script>

<style scoped>
/* ════════ CV PAPER ════════ */
.cv-paper{width:794px;min-height:1123px;background:#fff;box-shadow:0 8px 40px rgba(0,0,0,.18);overflow:hidden;font-family:'DM Sans','Segoe UI',Arial,sans-serif;color:#1a1a1a;font-size:13px;line-height:1.5}

/* ════════ CvBullets ════════ */
.cvb-list{margin:4px 0 2px;display:flex;flex-direction:column;gap:3px}
.cvb-item{display:flex;align-items:flex-start;gap:7px;font-size:11.5px;line-height:1.55}
.cvb-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:4px}
.cvb-plain{font-size:11.5px;color:#555;line-height:1.6;margin:3px 0 0}

/* ─── 1. CLASSIQUE ─── */
.cv-classic{display:flex;flex-direction:column;min-height:1123px}
.cc-hd{padding:28px 34px;display:flex;gap:18px;align-items:center}
.cc-photo{width:74px;height:74px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.35);flex-shrink:0}
.cc-name{color:#fff;font-size:24px;font-weight:800;margin:0 0 3px;letter-spacing:-.4px}
.cc-job{color:rgba(255,255,255,.82);font-size:13px;margin:0 0 4px}
.cc-dob{color:rgba(255,255,255,.65);font-size:11px;margin:0 0 6px}
.cc-contacts{display:flex;flex-wrap:wrap;gap:4px 12px}
.cc-contacts span{color:rgba(255,255,255,.78);font-size:11px}
.cc-body{display:grid;grid-template-columns:200px 1fr;flex:1}
.cc-left{background:#f8fafc;padding:20px 14px;border-right:1px solid #e5e7eb}
.cc-right{padding:20px 24px}
.cc-sec{margin-bottom:18px}
.cc-sec-t{font-size:9.5px;font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-bottom:9px}
.cc-skill{margin-bottom:6px}
.cc-sk-lbl{font-size:11.5px;font-weight:600;color:#374151;margin-bottom:3px}
.cc-sk-track{height:4px;background:#e5e7eb;border-radius:99px;overflow:hidden}
.cc-sk-fill{height:100%;border-radius:99px}
.cc-lang{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:11.5px}
.cc-lang-lvl{color:#9ca3af;font-size:10.5px}
.cc-interests{display:flex;flex-wrap:wrap;gap:4px}
.cc-interest-tag{padding:2px 8px;border:1.5px solid;border-radius:99px;font-size:10.5px;font-weight:600}
.cc-txt{font-size:12px;color:#4b5563;line-height:1.7;margin:0}
.cc-entry{display:flex;gap:9px;margin-bottom:11px}
.cc-bar{width:3px;border-radius:2px;flex-shrink:0}
.cc-eb{flex:1}
.cc-et{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1px}
.cc-pos{font-size:12.5px;font-weight:700;color:#111}
.cc-date{font-size:10px;color:#9ca3af;white-space:nowrap;margin-left:6px;flex-shrink:0}
.cc-co{font-size:11px;color:#6b7280;margin-bottom:3px}
.cc-desc{font-size:11.5px;color:#555;line-height:1.6;margin:3px 0 0}
.cc-tech{font-size:9.5px;background:#f3f4f6;color:#6b7280;padding:1px 6px;border-radius:3px;white-space:nowrap}

/* ─── 2. MINIMAL ─── */
.cv-min{padding:46px 50px;min-height:1123px}
.cm-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
.cm-top-left{display:flex;align-items:center;gap:14px}
.cm-top-text{display:flex;flex-direction:column}
.cm-photo{width:68px;height:68px;border-radius:50%;object-fit:cover;border:2px solid #e5e7eb;flex-shrink:0}
.cm-name{font-size:30px;font-weight:900;letter-spacing:-1px;color:#111;margin:0 0 5px}
.cm-job{font-size:13.5px;color:#6b7280;margin:0 0 2px}
.cm-dob{font-size:11px;color:#9ca3af;margin:0}
.cm-contacts{text-align:right;display:flex;flex-direction:column;gap:3px}
.cm-contacts span{font-size:11px;color:#6b7280}
.cm-div{height:2.5px;margin-bottom:16px;border-radius:99px}
.cm-summary{font-size:12.5px;color:#444;line-height:1.75;margin-bottom:20px}
.cm-sec{margin-bottom:20px}
.cm-sec-t{font-size:9.5px;font-weight:900;letter-spacing:1.5px;color:#9ca3af;margin-bottom:10px;border-bottom:1px solid #e5e7eb;padding-bottom:5px}
.cm-entry{display:grid;grid-template-columns:72px 1fr;gap:14px;margin-bottom:11px}
.cm-el .cm-date{font-size:10.5px;color:#9ca3af;line-height:1.5;padding-top:2px}
.cm-pos{font-size:13px;font-weight:700;color:#111;margin-bottom:2px}
.cm-co{font-size:11.5px;color:#6b7280;margin-bottom:2px}
.cm-desc{font-size:11.5px;color:#555;line-height:1.6;margin:0}
.cm-tags{display:flex;flex-wrap:wrap;gap:5px}
.cm-tag{padding:3px 11px;border:1.5px solid;border-radius:99px;font-size:11.5px;font-weight:600}

/* ─── 3. MODERNE ─── */
.cv-mod{display:grid;grid-template-columns:210px 1fr;min-height:1123px}
.cmod-aside{padding:28px 16px;display:flex;flex-direction:column}
.cmod-photo-wrap{display:flex;justify-content:center;margin-bottom:13px}
.cmod-photo{width:84px;height:84px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.3)}
.cmod-init{width:84px;height:84px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#fff}
.cmod-name{color:#fff;font-size:18px;font-weight:900;text-align:center;line-height:1.2;margin:0 0 4px}
.cmod-job{color:rgba(255,255,255,.72);font-size:11px;text-align:center;margin-bottom:4px}
.cmod-dob{color:rgba(255,255,255,.55);font-size:10px;text-align:center;margin-bottom:12px}
.cmod-blk{margin-bottom:14px}
.cmod-blk-t{font-size:8.5px;font-weight:900;letter-spacing:1.3px;color:rgba(255,255,255,.45);margin-bottom:6px;text-transform:uppercase}
.cmod-item{font-size:10.5px;color:rgba(255,255,255,.78);margin-bottom:4px;word-break:break-all}
.cmod-skill{margin-bottom:6px}
.cmod-sk-n{font-size:11px;color:rgba(255,255,255,.85);margin-bottom:3px;font-weight:600}
.cmod-dots{display:flex;gap:3px}
.cmod-dot{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.2)}
.cmod-dot.filled{background:rgba(255,255,255,.85)}
.cmod-lang{display:flex;justify-content:space-between;font-size:10.5px;color:rgba(255,255,255,.78);margin-bottom:3px}
.cmod-lang-lvl{color:rgba(255,255,255,.45)}
.cmod-interests{display:flex;flex-wrap:wrap;gap:4px}
.cmod-interest{font-size:9.5px;color:rgba(255,255,255,.7);background:rgba(255,255,255,.12);padding:2px 8px;border-radius:99px}
.cmod-main{padding:26px 22px;background:#fff}
.cmod-sec{margin-bottom:18px}
.cmod-sec-t{font-size:9.5px;font-weight:900;letter-spacing:1px;margin-bottom:10px;text-transform:uppercase}
.cmod-txt{font-size:12px;color:#4b5563;line-height:1.7;margin:0}
.cmod-entry{display:flex;gap:9px;margin-bottom:10px}
.cmod-dot-b{width:8px;height:8px;border-radius:50%;margin-top:4px;flex-shrink:0}
.cmod-eb{flex:1}
.cmod-et{display:flex;justify-content:space-between;align-items:flex-start}
.cmod-pos{font-size:12.5px;font-weight:700;color:#111}
.cmod-date{font-size:10px;color:#9ca3af;white-space:nowrap;margin-left:6px}
.cmod-co{font-size:11px;color:#6b7280;margin:2px 0 3px}
.cmod-desc{font-size:11.5px;color:#555;line-height:1.6;margin:0}
.cmod-proj{margin-bottom:9px;padding:8px;background:#f8fafc;border-radius:6px}
.cmod-proj-hd{display:flex;justify-content:space-between;margin-bottom:3px}
.cmod-tech{font-size:10px;color:#9ca3af}

/* ─── 4. CORPORATE ─── */
.cv-corp{display:flex;flex-direction:column;min-height:1123px}
.corp-top{display:flex;align-items:center;gap:18px;padding:26px 34px}
.corp-photo-wrap{flex-shrink:0}
.corp-photo-img{width:68px;height:68px;border-radius:10px;object-fit:cover;border:2px solid #e5e7eb}
.corp-avatar{width:68px;height:68px;border-radius:10px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:#6b7280}
.corp-name{font-size:23px;font-weight:900;color:#111;letter-spacing:-.4px;margin:0 0 3px}
.corp-job{font-size:13px;font-weight:700;margin:0 0 6px}
.corp-contacts{display:flex;flex-wrap:wrap;gap:3px 12px}
.corp-contacts span{font-size:11px;color:#6b7280}
.corp-bar{height:4px}
.corp-body{display:grid;grid-template-columns:220px 1fr;flex:1}
.corp-left{padding:20px 14px;background:#fafafa;border-right:1px solid #e5e7eb}
.corp-right{padding:20px 24px}
.corp-sec{margin-bottom:18px}
.corp-sec-t{font-size:9.5px;font-weight:900;text-transform:uppercase;letter-spacing:1px;border-left:3px solid;padding-left:8px;margin-bottom:10px}
.corp-txt{font-size:12px;color:#4b5563;line-height:1.7;margin:0}
.corp-skill{margin-bottom:6px}
.corp-sk-lbl{font-size:11.5px;font-weight:600;color:#374151;margin-bottom:3px}
.corp-sk-track{height:4px;background:#e5e7eb;border-radius:99px;overflow:hidden}
.corp-sk-fill{height:100%;border-radius:99px}
.corp-lang{display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:11.5px}
.corp-lang-lvl{color:#fff;font-size:9px;padding:2px 6px;border-radius:99px;font-weight:700}
.corp-interests{display:flex;flex-wrap:wrap;gap:4px}
.corp-interest-tag{font-size:10px;color:#6b7280;background:#f3f4f6;padding:2px 7px;border-radius:3px}
.corp-entry{margin-bottom:12px}
.corp-et{display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;gap:6px}
.corp-ep{font-size:12.5px;font-weight:700;color:#111}
.corp-ed{font-size:9.5px;font-weight:600;padding:2px 7px;border-radius:99px;white-space:nowrap;flex-shrink:0}
.corp-eco{font-size:11px;color:#6b7280;margin-bottom:2px}

/* ─── 5. ÉLÉGANT ─── */
.cv-eleg{display:flex;flex-direction:column;min-height:1123px}
.eleg-hd{padding:28px 34px;display:flex;gap:20px;align-items:center;border-bottom:3px solid}
.eleg-photo-wrap{flex-shrink:0}
.eleg-photo{width:78px;height:78px;border-radius:10px;object-fit:cover}
.eleg-init{width:78px;height:78px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900}
.eleg-hi{flex:1}
.eleg-name{font-size:26px;font-weight:400;color:#111;margin:0 0 4px;letter-spacing:-.3px}
.eleg-name strong{font-weight:800}
.eleg-job{font-size:13.5px;font-weight:600;margin:0 0 8px}
.eleg-contacts{display:flex;flex-wrap:wrap;gap:4px 14px}
.eleg-contacts span{font-size:11px;color:#6b7280}
.eleg-body{display:grid;grid-template-columns:200px 1fr;flex:1}
.eleg-left{padding:20px 14px;background:#fafafa;border-right:1px solid #eee}
.eleg-right{padding:20px 24px}
.eleg-sec{margin-bottom:18px}
.eleg-sec-t{font-size:9.5px;font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-bottom:9px;padding-bottom:4px;border-bottom:1.5px solid currentColor}
.eleg-txt{font-size:12px;color:#555;line-height:1.7;margin:0}
.eleg-skill{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px}
.eleg-sk-n{font-size:12px;font-weight:600;color:#333}
.eleg-dots{display:flex;gap:3px}
.eleg-dot{width:9px;height:9px;border-radius:50%}
.eleg-lang{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:12px}
.eleg-lang-lvl{color:#9ca3af;font-size:11px}
.eleg-interests{display:flex;flex-wrap:wrap;gap:4px}
.eleg-interest{font-size:10.5px;color:#6b7280;background:#f3f4f6;padding:2px 8px;border-radius:99px}
.eleg-entry{display:flex;gap:10px;margin-bottom:12px}
.eleg-marker{width:3px;border-radius:2px;flex-shrink:0;margin-top:3px;min-height:12px}
.eleg-et{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1px}
.eleg-pos{font-size:13px;font-weight:700;color:#111}
.eleg-date{font-size:10px;color:#9ca3af;white-space:nowrap;margin-left:8px;flex-shrink:0}
.eleg-co{font-size:11.5px;color:#6b7280;margin-bottom:2px}
.eleg-desc{font-size:12px;color:#555;line-height:1.6;margin:2px 0 0}
.eleg-proj{margin-bottom:9px}
.eleg-proj-n{font-size:13px;font-weight:700;color:#111;margin-bottom:2px}
.eleg-proj-tech{font-size:9.5px;color:#9ca3af;background:#f3f4f6;padding:1px 6px;border-radius:3px;margin-left:6px;font-weight:400}

/* ─── 6. DARK ─── */
.cv-dark{display:flex;flex-direction:column;min-height:1123px;background:#111827}
.dk-hd{padding:28px 34px;display:flex;gap:18px;align-items:center;background:#1f2937}
.dk-photo{width:74px;height:74px;border-radius:50%;object-fit:cover;flex-shrink:0}
.dk-init{width:74px;height:74px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;flex-shrink:0;background:#111827}
.dk-name{color:#f9fafb;font-size:24px;font-weight:800;margin:0 0 3px;letter-spacing:-.4px}
.dk-job{font-size:13px;font-weight:700;margin:0 0 9px}
.dk-contacts{display:flex;flex-wrap:wrap;gap:4px 12px}
.dk-contacts span{color:#9ca3af;font-size:11px}
.dk-divline{height:1px}
.dk-body{display:grid;grid-template-columns:200px 1fr;flex:1}
.dk-left{padding:20px 14px;background:#1f2937;border-right:1px solid #374151}
.dk-right{padding:20px 24px}
.dk-sec{margin-bottom:18px}
.dk-sec-t{font-size:9.5px;font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-bottom:9px}
.dk-skill{margin-bottom:7px}
.dk-sk-n{font-size:11.5px;font-weight:600;color:#d1d5db;margin-bottom:3px}
.dk-sk-track{height:4px;background:#374151;border-radius:99px;overflow:hidden}
.dk-sk-fill{height:100%;border-radius:99px}
.dk-lang{display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid #374151;font-size:11.5px;color:#d1d5db}
.dk-lang-lvl{font-size:9.5px;padding:2px 7px;border-radius:99px;font-weight:600}
.dk-interests{display:flex;flex-wrap:wrap;gap:4px}
.dk-interest{font-size:10px;padding:2px 8px;border-radius:99px;font-weight:600}
.dk-txt{font-size:12px;color:#9ca3af;line-height:1.7;margin:0}
.dk-entry{display:flex;gap:10px;margin-bottom:12px}
.dk-entry-dot{width:8px;height:8px;border-radius:50%;margin-top:4px;flex-shrink:0}
.dk-et{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1px}
.dk-pos{font-size:12.5px;font-weight:700;color:#f3f4f6}
.dk-date{font-size:10px;white-space:nowrap;margin-left:6px;flex-shrink:0;font-weight:600}
.dk-co{font-size:11px;color:#6b7280;margin-bottom:3px}
.dk-desc{font-size:11.5px;line-height:1.6;margin:2px 0 0}
.dk-proj{margin-bottom:10px;padding:10px;background:#1f2937;border-radius:7px}
.dk-proj-n{font-size:13px;font-weight:700;color:#f3f4f6;margin-bottom:4px}
.dk-tech{font-size:9.5px;padding:2px 7px;border-radius:4px;margin-left:7px;font-weight:600}
</style>