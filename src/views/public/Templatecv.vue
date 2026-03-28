<template>
  <div id="cv-render" class="cv-paper">

    <!-- ══════════════════════════════════════════
         1. CLASSIQUE
    ══════════════════════════════════════════ -->
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
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="cc-entry">
              <div class="cc-bar" :style="{background:accentColor}"></div>
              <div class="cc-eb">
                <div class="cc-et"><span class="cc-pos">{{ e.position }}</span><span class="cc-date">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div>
                <div class="cc-co">{{ e.company }}</div>
                <div v-if="hasBullets(e)" class="cc-bullets">
                  <div v-for="(b,bi) in getBullets(e)" :key="bi" class="cc-bullet-line">
                    <span class="cc-bullet-dot" :style="{background:accentColor}"></span>
                    <span class="cc-bullet-text">{{ b }}</span>
                  </div>
                </div>
                <p v-else-if="e.description" class="cc-txt cc-desc">{{ e.description }}</p>
              </div>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="cc-sec">
            <div class="cc-sec-t" :style="{color:accentColor}">Formation</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="cc-entry">
              <div class="cc-bar" :style="{background:accentColor}"></div>
              <div class="cc-eb">
                <div class="cc-et">
                  <span class="cc-pos">{{ e.degree }}</span>
                  <span class="cc-date">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</span>
                </div>
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

    <!-- ══════════════════════════════════════════
         2. MINIMAL
    ══════════════════════════════════════════ -->
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
        <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="cm-entry">
          <div class="cm-el"><div class="cm-date">{{ e.startDate }}<br/>{{ e.endDate }}</div></div>
          <div class="cm-er">
            <div class="cm-pos">{{ e.position }}</div>
            <div class="cm-co">{{ e.company }}</div>
            <div v-if="hasBullets(e)" class="cm-bullets">
              <div v-for="(b,bi) in getBullets(e)" :key="bi" class="cm-bullet-line">
                <span class="cm-bullet-dot" :style="{background:accentColor}"></span>
                <span class="cm-bullet-text">{{ b }}</span>
              </div>
            </div>
            <p v-else-if="e.description" class="cm-desc">{{ e.description }}</p>
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

    <!-- ══════════════════════════════════════════
         3. MODERNE
    ══════════════════════════════════════════ -->
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
          <div class="cmod-interests">
            <span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="cmod-interest">{{ c.name }}</span>
          </div>
        </div>
      </div>
      <div class="cmod-main">
        <div v-if="cv.summary" class="cmod-sec"><div class="cmod-sec-t" :style="{color:accentColor}">À PROPOS</div><p class="cmod-txt">{{ cv.summary }}</p></div>
        <div v-if="cv.experiences.some(e=>e.position)" class="cmod-sec"><div class="cmod-sec-t" :style="{color:accentColor}">EXPÉRIENCES</div>
          <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="cmod-entry">
            <div class="cmod-dot-b" :style="{background:accentColor}"></div>
            <div class="cmod-eb">
              <div class="cmod-et"><span class="cmod-pos">{{ e.position }}</span><span class="cmod-date">{{ e.startDate }} – {{ e.endDate||'Présent' }}</span></div>
              <div class="cmod-co">{{ e.company }}</div>
              <div v-if="hasBullets(e)" class="cmod-bullets">
                <div v-for="(b,bi) in getBullets(e)" :key="bi" class="cmod-bullet-line">
                  <span class="cmod-bullet-dot" :style="{background:accentColor}"></span>
                  <span class="cmod-bullet-text">{{ b }}</span>
                </div>
              </div>
              <p v-else-if="e.description" class="cmod-desc">{{ e.description }}</p>
            </div>
          </div>
        </div>
        <div v-if="cv.education.some(e=>e.degree)" class="cmod-sec"><div class="cmod-sec-t" :style="{color:accentColor}">FORMATION</div>
          <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="cmod-entry">
            <div class="cmod-dot-b" :style="{background:accentColor}"></div>
            <div class="cmod-eb">
              <div class="cmod-pos">{{ e.degree }}</div>
              <div class="cmod-co">{{ e.school }} · {{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</div>
            </div>
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

    <!-- ══════════════════════════════════════════
         4. CORPORATE
    ══════════════════════════════════════════ -->
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
            <div class="corp-interests">
              <span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="corp-interest-tag">{{ c.name }}</span>
            </div>
          </div>
        </div>
        <div class="corp-right">
          <div v-if="cv.experiences.some(e=>e.position)" class="corp-sec"><div class="corp-sec-t" :style="{borderColor:accentColor,color:accentColor}">EXPÉRIENCES</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="corp-entry">
              <div class="corp-et"><span class="corp-ep">{{ e.position }}</span><span class="corp-ed" :style="{background:accentColor+'18',color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div>
              <div class="corp-eco">{{ e.company }}</div>
              <div v-if="hasBullets(e)" class="corp-bullets">
                <div v-for="(b,bi) in getBullets(e)" :key="bi" class="corp-bullet-line">
                  <span class="corp-bullet-dot" :style="{background:accentColor}"></span>
                  <span class="corp-bullet-text">{{ b }}</span>
                </div>
              </div>
              <p v-else-if="e.description" class="corp-txt" style="margin-top:3px">{{ e.description }}</p>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="corp-sec"><div class="corp-sec-t" :style="{borderColor:accentColor,color:accentColor}">FORMATION</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="corp-entry">
              <div class="corp-et">
                <span class="corp-ep">{{ e.degree }}</span>
                <span class="corp-ed" :style="{background:accentColor+'18',color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</span>
              </div>
              <div class="corp-eco">{{ e.school }}</div>
            </div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="corp-sec"><div class="corp-sec-t" :style="{borderColor:accentColor,color:accentColor}">APTITUDES</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="corp-skill">
              <div class="corp-sk-lbl">{{ a.name }}</div>
              <div class="corp-sk-track"><div class="corp-sk-fill" :style="{width:(a.level*25)+'%',background:'#f59e0b'}"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         5. ÉLÉGANT
    ══════════════════════════════════════════ -->
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
            <div class="eleg-interests">
              <span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="eleg-interest">{{ c.name }}</span>
            </div>
          </div>
        </div>
        <div class="eleg-right">
          <div v-if="cv.experiences.some(e=>e.position)" class="eleg-sec"><div class="eleg-sec-t" :style="{color:accentColor}">EXPÉRIENCES</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="eleg-entry">
              <div class="eleg-marker" :style="{background:accentColor}"></div>
              <div>
                <div class="eleg-et"><span class="eleg-pos">{{ e.position }}</span><span class="eleg-date">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div>
                <div class="eleg-co">{{ e.company }}</div>
                <div v-if="hasBullets(e)" class="eleg-bullets">
                  <div v-for="(b,bi) in getBullets(e)" :key="bi" class="eleg-bullet-line">
                    <span class="eleg-bullet-dot" :style="{background:accentColor}"></span>
                    <span class="eleg-bullet-text">{{ b }}</span>
                  </div>
                </div>
                <p v-else-if="e.description" class="eleg-desc">{{ e.description }}</p>
              </div>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="eleg-sec"><div class="eleg-sec-t" :style="{color:accentColor}">FORMATION</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="eleg-entry">
              <div class="eleg-marker" :style="{background:accentColor}"></div>
              <div>
                <div class="eleg-et">
                  <span class="eleg-pos">{{ e.degree }}</span>
                  <span class="eleg-date">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</span>
                </div>
                <div class="eleg-co">{{ e.school }}</div>
              </div>
            </div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="eleg-sec"><div class="eleg-sec-t" :style="{color:accentColor}">APTITUDES</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="eleg-skill">
              <span class="eleg-sk-n">{{ a.name }}</span>
              <div class="eleg-dots"><span v-for="d in 4" :key="d" class="eleg-dot" :style="{background:d<=a.level?'#f59e0b':'#e5e7eb'}"></span></div>
            </div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="eleg-sec"><div class="eleg-sec-t" :style="{color:accentColor}">PROJETS</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="eleg-proj"><div class="eleg-proj-n">{{ p.name }}<span v-if="p.tech" class="eleg-proj-tech">{{ p.tech }}</span></div><p v-if="p.description" class="eleg-desc">{{ p.description }}</p></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         6. DARK
    ══════════════════════════════════════════ -->
    <div v-if="selectedTpl==='dark'" class="cv-dark">
      <div class="dk-hd">
        <div class="dk-photo-wrap">
          <img v-if="cv.photo" :src="cv.photo" class="dk-photo" @error="e=>e.target.style.display='none'"/>
          <div v-else class="dk-init" :style="{borderColor:accentColor,color:accentColor}">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
        </div>
        <div class="dk-hi">
          <h1 class="dk-name">{{ cv.firstName||'Prénom' }} {{ cv.lastName||'Nom' }}</h1>
          <p class="dk-job" :style="{color:accentColor}">{{ cv.title }}</p>
          <div class="dk-contacts">
            <span v-if="cv.email">{{ cv.email }}</span><span v-if="cv.phone">{{ cv.phone }}</span>
            <span v-if="cv.city">{{ cv.city }}{{ cv.country?', '+cv.country:'' }}</span>
            <span v-if="cv.dateNaissance">Né(e) {{ formatDate(cv.dateNaissance) }}</span>
          </div>
        </div>
      </div>
      <div class="dk-divline" :style="{background:accentColor}"></div>
      <div class="dk-body">
        <div class="dk-left">
          <div v-if="cv.skills.some(s=>s.name)" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">COMPÉTENCES</div>
            <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="dk-skill"><div class="dk-sk-n">{{ s.name }}</div><div class="dk-sk-track"><div class="dk-sk-fill" :style="{width:(s.level*25)+'%',background:accentColor}"></div></div></div>
          </div>
          <div v-if="cv.languages.some(l=>l.name)" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">LANGUES</div>
            <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="dk-lang"><span>{{ l.name }}</span><span class="dk-lang-lvl" :style="{background:accentColor+'33',color:accentColor}">{{ l.level }}</span></div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">INTÉRÊTS</div>
            <div class="dk-interests">
              <span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="dk-interest" :style="{background:accentColor+'22',color:accentColor}">{{ c.name }}</span>
            </div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">APTITUDES</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="dk-skill"><div class="dk-sk-n">{{ a.name }}</div><div class="dk-sk-track"><div class="dk-sk-fill" :style="{width:(a.level*25)+'%',background:'#f59e0b'}"></div></div></div>
          </div>
        </div>
        <div class="dk-right">
          <div v-if="cv.summary" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">PROFIL</div><p class="dk-txt">{{ cv.summary }}</p></div>
          <div v-if="cv.experiences.some(e=>e.position)" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">EXPÉRIENCES</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="dk-entry">
              <div class="dk-entry-dot" :style="{background:accentColor}"></div>
              <div>
                <div class="dk-et"><span class="dk-pos">{{ e.position }}</span><span class="dk-date" :style="{color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div>
                <div class="dk-co">{{ e.company }}</div>
                <div v-if="hasBullets(e)" class="dk-bullets">
                  <div v-for="(b,bi) in getBullets(e)" :key="bi" class="dk-bullet-line">
                    <span class="dk-bullet-dot" :style="{background:accentColor}"></span>
                    <span class="dk-bullet-text">{{ b }}</span>
                  </div>
                </div>
                <p v-else-if="e.description" class="dk-txt dk-desc">{{ e.description }}</p>
              </div>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">FORMATION</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="dk-entry">
              <div class="dk-entry-dot" :style="{background:accentColor}"></div>
              <div>
                <div class="dk-et">
                  <span class="dk-pos">{{ e.degree }}</span>
                  <span class="dk-date" :style="{color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</span>
                </div>
                <div class="dk-co">{{ e.school }}</div>
              </div>
            </div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">PROJETS</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="dk-proj">
              <div class="dk-proj-n">{{ p.name }}<span v-if="p.tech" class="dk-tech" :style="{background:accentColor+'22',color:accentColor}">{{ p.tech }}</span></div>
              <p v-if="p.description" class="dk-txt dk-desc">{{ p.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         7. TIMELINE
    ══════════════════════════════════════════ -->
    <div v-if="selectedTpl==='timeline'" class="cv-tl">
      <div class="tl-hd" :style="{borderLeftColor:accentColor}">
        <div class="tl-hd-inner">
          <img v-if="cv.photo" :src="cv.photo" class="tl-photo" @error="e=>e.target.style.display='none'"/>
          <div v-else class="tl-init" :style="{background:accentColor}">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
          <div>
            <h1 class="tl-name">{{ cv.firstName||'Prénom' }} {{ cv.lastName||'Nom' }}</h1>
            <p class="tl-job" :style="{color:accentColor}">{{ cv.title }}</p>
            <p v-if="cv.dateNaissance" class="tl-dob">Né(e) le {{ formatDate(cv.dateNaissance) }}</p>
          </div>
        </div>
        <div class="tl-contacts"><span v-if="cv.email">✉ {{ cv.email }}</span><span v-if="cv.phone">📞 {{ cv.phone }}</span><span v-if="cv.city">📍 {{ cv.city }}{{ cv.country?', '+cv.country:'' }}</span></div>
      </div>
      <div class="tl-body">
        <div class="tl-left">
          <p v-if="cv.summary" class="tl-summary">{{ cv.summary }}</p>
          <div v-if="cv.skills.some(s=>s.name)" class="tl-sec"><div class="tl-sec-t" :style="{color:accentColor}">COMPÉTENCES</div>
            <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="tl-skill"><div class="tl-sk-n">{{ s.name }}</div><div class="tl-sk-track"><div :style="{width:(s.level*25)+'%',background:accentColor}" class="tl-sk-fill"></div></div></div>
          </div>
          <div v-if="cv.languages.some(l=>l.name)" class="tl-sec"><div class="tl-sec-t" :style="{color:accentColor}">LANGUES</div>
            <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="tl-lang"><span>{{ l.name }}</span><span>{{ l.level }}</span></div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="tl-sec"><div class="tl-sec-t" :style="{color:accentColor}">INTÉRÊTS</div>
            <div class="tl-interests">
              <span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="tl-interest" :style="{background:accentColor+'15',color:accentColor}">{{ c.name }}</span>
            </div>
          </div>
        </div>
        <div class="tl-right">
          <div v-if="cv.experiences.some(e=>e.position)" class="tl-sec"><div class="tl-sec-t" :style="{color:accentColor}">EXPÉRIENCES</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="tl-item">
              <div class="tl-node" :style="{background:accentColor}"></div>
              <div class="tl-line-v" :style="{borderColor:accentColor+'44'}"></div>
              <div class="tl-content">
                <div class="tl-date-badge" :style="{background:accentColor+'15',color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</div>
                <div class="tl-pos">{{ e.position }}</div>
                <div class="tl-co">{{ e.company }}</div>
                <div v-if="hasBullets(e)" class="tl-bullets">
                  <div v-for="(b,bi) in getBullets(e)" :key="bi" class="tl-bullet-line">
                    <span class="tl-bullet-dot" :style="{background:accentColor}"></span>
                    <span class="tl-bullet-text">{{ b }}</span>
                  </div>
                </div>
                <p v-else-if="e.description" class="tl-desc">{{ e.description }}</p>
              </div>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="tl-sec"><div class="tl-sec-t" :style="{color:accentColor}">FORMATION</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="tl-item">
              <div class="tl-node" :style="{background:accentColor}"></div>
              <div class="tl-content">
                <div class="tl-date-badge" :style="{background:accentColor+'15',color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</div>
                <div class="tl-pos">{{ e.degree }}</div>
                <div class="tl-co">{{ e.school }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         8. SWISS
    ══════════════════════════════════════════ -->
    <div v-if="selectedTpl==='swiss'" class="cv-swiss">
      <div class="sw-top-bar" :style="{background:accentColor}"></div>
      <div class="sw-header">
        <div class="sw-hd-left">
          <img v-if="cv.photo" :src="cv.photo" class="sw-photo" @error="e=>e.target.style.display='none'"/>
          <div v-else class="sw-init" :style="{color:accentColor}">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
        </div>
        <div class="sw-hd-right">
          <h1 class="sw-name"><span :style="{color:accentColor}">{{ cv.firstName||'Prénom' }}</span> {{ cv.lastName||'Nom' }}</h1>
          <p class="sw-title">{{ cv.title }}</p>
          <div class="sw-contacts">
            <span v-if="cv.email">{{ cv.email }}</span><span v-if="cv.phone">{{ cv.phone }}</span>
            <span v-if="cv.city">{{ cv.city }}{{ cv.country?', '+cv.country:'' }}</span>
            <span v-if="cv.dateNaissance">{{ formatDate(cv.dateNaissance) }}</span>
          </div>
        </div>
      </div>
      <div class="sw-divider" :style="{background:accentColor+'40'}"></div>
      <div class="sw-body">
        <div class="sw-left">
          <div v-if="cv.skills.some(s=>s.name)" class="sw-sec">
            <div class="sw-sec-t" :style="{color:accentColor}">COMPÉTENCES</div>
            <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="sw-skill">
              <span class="sw-sk-name">{{ s.name }}</span>
              <div class="sw-sk-bar"><div :style="{width:(s.level*25)+'%',background:accentColor}" class="sw-sk-fill"></div></div>
            </div>
          </div>
          <div v-if="cv.languages.some(l=>l.name)" class="sw-sec">
            <div class="sw-sec-t" :style="{color:accentColor}">LANGUES</div>
            <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="sw-lang">
              <span>{{ l.name }}</span><span class="sw-lang-lvl">{{ l.level }}</span>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="sw-sec">
            <div class="sw-sec-t" :style="{color:accentColor}">FORMATION</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="sw-edu">
              <div class="sw-edu-year" :style="{color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+'–'+e.anneeFin : e.year }}</div>
              <div><div class="sw-edu-deg">{{ e.degree }}</div><div class="sw-edu-school">{{ e.school }}</div></div>
            </div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="sw-sec">
            <div class="sw-sec-t" :style="{color:accentColor}">INTÉRÊTS</div>
            <div class="sw-interests">
              <span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="sw-interest" :style="{color:accentColor}">{{ c.name }}</span>
            </div>
          </div>
        </div>
        <div class="sw-right">
          <div v-if="cv.summary" class="sw-sec sw-profile"><p class="sw-summary">{{ cv.summary }}</p></div>
          <div v-if="cv.experiences.some(e=>e.position)" class="sw-sec">
            <div class="sw-sec-t" :style="{color:accentColor}">EXPÉRIENCES</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="sw-exp">
              <div class="sw-exp-head">
                <div><div class="sw-exp-pos">{{ e.position }}</div><div class="sw-exp-co">{{ e.company }}</div></div>
                <div class="sw-exp-date" :style="{color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</div>
              </div>
              <div v-if="hasBullets(e)" class="sw-bullets">
                <div v-for="(b,bi) in getBullets(e)" :key="bi" class="sw-bullet-line">
                  <span class="sw-bullet-dot" :style="{background:accentColor}"></span>
                  <span class="sw-bullet-text">{{ b }}</span>
                </div>
              </div>
              <p v-else-if="e.description" class="sw-exp-desc">{{ e.description }}</p>
            </div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="sw-sec">
            <div class="sw-sec-t" :style="{color:accentColor}">APTITUDES</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="sw-skill">
              <span class="sw-sk-name">{{ a.name }}</span>
              <div class="sw-sk-bar"><div :style="{width:(a.level*25)+'%',background:'#f59e0b'}" class="sw-sk-fill"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         9. CRÉATIF
    ══════════════════════════════════════════ -->
    <div v-if="selectedTpl==='creative'" class="cv-creative">
      <div class="cr-hero" :style="{background:accentColor}">
        <div class="cr-hero-content">
          <div class="cr-photo-wrap">
            <img v-if="cv.photo" :src="cv.photo" class="cr-photo" @error="e=>e.target.style.display='none'"/>
            <div v-else class="cr-init">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
          </div>
          <div class="cr-hero-text">
            <h1 class="cr-name">{{ cv.firstName||'Prénom' }}<br/><strong>{{ cv.lastName||'Nom' }}</strong></h1>
            <p class="cr-title-badge">{{ cv.title }}</p>
            <p v-if="cv.dateNaissance" style="font-size:11px;color:rgba(255,255,255,.7);margin:4px 0 0">🎂 {{ formatDate(cv.dateNaissance) }}</p>
          </div>
        </div>
        <div class="cr-hero-wave"></div>
      </div>
      <div class="cr-contacts-bar">
        <span v-if="cv.email">✉ {{ cv.email }}</span><span v-if="cv.phone">📞 {{ cv.phone }}</span>
        <span v-if="cv.city">📍 {{ cv.city }}{{ cv.country?', '+cv.country:'' }}</span>
      </div>
      <div class="cr-body">
        <div class="cr-left">
          <div v-if="cv.summary" class="cr-sec"><div class="cr-sec-t" :style="{background:accentColor}">PROFIL</div><p class="cr-summary">{{ cv.summary }}</p></div>
          <div v-if="cv.skills.some(s=>s.name)" class="cr-sec"><div class="cr-sec-t" :style="{background:accentColor}">COMPÉTENCES</div>
            <div class="cr-skill-tags"><span v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="cr-skill-tag" :style="{borderColor:accentColor,color:accentColor}">{{ s.name }}</span></div>
          </div>
          <div v-if="cv.languages.some(l=>l.name)" class="cr-sec"><div class="cr-sec-t" :style="{background:accentColor}">LANGUES</div>
            <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="cr-lang"><span>{{ l.name }}</span><span class="cr-lang-lvl" :style="{background:accentColor+'22',color:accentColor}">{{ l.level }}</span></div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="cr-sec"><div class="cr-sec-t" :style="{background:accentColor}">INTÉRÊTS</div>
            <div class="cr-skill-tags"><span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="cr-skill-tag" :style="{borderColor:'#9ca3af',color:'#6b7280'}">{{ c.name }}</span></div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="cr-sec"><div class="cr-sec-t" :style="{background:accentColor}">APTITUDES</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="cr-lang">
              <span>{{ a.name }}</span>
              <div style="display:flex;gap:2px">
                <span v-for="d in 4" :key="d" :style="{width:'8px',height:'8px',borderRadius:'50%',background:d<=a.level?'#f59e0b':'#e5e7eb',display:'inline-block'}"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="cr-right">
          <div v-if="cv.experiences.some(e=>e.position)" class="cr-sec"><div class="cr-sec-t" :style="{background:accentColor}">EXPÉRIENCES</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="cr-exp">
              <div class="cr-exp-dot" :style="{background:accentColor}"></div>
              <div class="cr-exp-body">
                <div class="cr-exp-top"><span class="cr-exp-pos">{{ e.position }}</span><span class="cr-exp-date" :style="{color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div>
                <div class="cr-exp-co">{{ e.company }}</div>
                <div v-if="hasBullets(e)" class="cr-bullets">
                  <div v-for="(b,bi) in getBullets(e)" :key="bi" class="cr-bullet-line">
                    <span class="cr-bullet-dot" :style="{background:accentColor}"></span>
                    <span class="cr-bullet-text">{{ b }}</span>
                  </div>
                </div>
                <p v-else-if="e.description" class="cr-exp-desc">{{ e.description }}</p>
              </div>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="cr-sec"><div class="cr-sec-t" :style="{background:accentColor}">FORMATION</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="cr-exp">
              <div class="cr-exp-dot" :style="{background:accentColor}"></div>
              <div class="cr-exp-body">
                <div class="cr-exp-pos">{{ e.degree }}</div>
                <div class="cr-exp-co">{{ e.school }} · {{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</div>
              </div>
            </div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="cr-sec"><div class="cr-sec-t" :style="{background:accentColor}">PROJETS</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="cr-proj">
              <div class="cr-proj-name">{{ p.name }}<span v-if="p.tech" class="cr-proj-tech">{{ p.tech }}</span></div>
              <p v-if="p.description" class="cr-exp-desc">{{ p.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         10. TECH
    ══════════════════════════════════════════ -->
    <div v-if="selectedTpl==='tech'" class="cv-tech">
      <div class="tk-header">
        <div class="tk-terminal-bar">
          <span class="tk-dot red"></span><span class="tk-dot yellow"></span><span class="tk-dot green"></span>
          <span class="tk-terminal-title">cv.json</span>
        </div>
        <div class="tk-hd-body">
          <div class="tk-hd-left">
            <img v-if="cv.photo" :src="cv.photo" class="tk-photo" @error="e=>e.target.style.display='none'"/>
            <div v-else class="tk-init" :style="{borderColor:accentColor,color:accentColor}">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
          </div>
          <div class="tk-hd-info">
            <div class="tk-prompt"><span class="tk-prompt-symbol" :style="{color:accentColor}">$</span> whoami</div>
            <h1 class="tk-name">{{ cv.firstName||'Prénom' }} {{ cv.lastName||'Nom' }}</h1>
            <div class="tk-prompt"><span class="tk-prompt-symbol" :style="{color:accentColor}">$</span> cat role.txt</div>
            <p class="tk-role" :style="{color:accentColor}">{{ cv.title }}</p>
            <div class="tk-contacts">
              <span v-if="cv.email"><span :style="{color:accentColor}">email:</span> {{ cv.email }}</span>
              <span v-if="cv.phone"><span :style="{color:accentColor}">tel:</span> {{ cv.phone }}</span>
              <span v-if="cv.city"><span :style="{color:accentColor}">loc:</span> {{ cv.city }}{{ cv.country?', '+cv.country:'' }}</span>
              <span v-if="cv.dateNaissance"><span :style="{color:accentColor}">dob:</span> {{ formatDate(cv.dateNaissance) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="tk-body">
        <div class="tk-left">
          <div v-if="cv.skills.some(s=>s.name)" class="tk-sec"><div class="tk-sec-t" :style="{color:accentColor}">// skills</div>
            <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="tk-skill"><span class="tk-sk-name">{{ s.name }}</span><div class="tk-sk-bar"><div :style="{width:(s.level*25)+'%',background:accentColor}" class="tk-sk-fill"></div></div></div>
          </div>
          <div v-if="cv.languages.some(l=>l.name)" class="tk-sec"><div class="tk-sec-t" :style="{color:accentColor}">// langues</div>
            <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="tk-lang"><span>{{ l.name }}</span><span class="tk-lang-lvl" :style="{color:accentColor}">{{ l.level }}</span></div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="tk-sec"><div class="tk-sec-t" :style="{color:accentColor}">// formation</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="tk-edu">
              <div class="tk-edu-year" :style="{color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+'–'+e.anneeFin : e.year }}</div>
              <div class="tk-edu-deg">{{ e.degree }}</div>
              <div class="tk-edu-school">{{ e.school }}</div>
            </div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="tk-sec"><div class="tk-sec-t" :style="{color:accentColor}">// intérêts</div>
            <div class="tk-interests">
              <span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="tk-interest" :style="{background:accentColor+'22',color:accentColor}">{{ c.name }}</span>
            </div>
          </div>
        </div>
        <div class="tk-right">
          <div v-if="cv.summary" class="tk-sec"><div class="tk-sec-t" :style="{color:accentColor}">// about</div><p class="tk-summary">{{ cv.summary }}</p></div>
          <div v-if="cv.experiences.some(e=>e.position)" class="tk-sec"><div class="tk-sec-t" :style="{color:accentColor}">// experience</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="tk-exp">
              <div class="tk-exp-head"><span class="tk-exp-pos">{{ e.position }}</span><span class="tk-exp-date" :style="{color:accentColor}">{{ e.startDate }}{{ e.endDate?' → '+e.endDate:'' }}</span></div>
              <div class="tk-exp-co">@{{ e.company }}</div>
              <div v-if="hasBullets(e)" class="tk-bullets">
                <div v-for="(b,bi) in getBullets(e)" :key="bi" class="tk-bullet-line">
                  <span class="tk-bullet-dot" :style="{background:accentColor}"></span>
                  <span class="tk-bullet-text">{{ b }}</span>
                </div>
              </div>
              <p v-else-if="e.description" class="tk-exp-desc">{{ e.description }}</p>
            </div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="tk-sec"><div class="tk-sec-t" :style="{color:accentColor}">// aptitudes</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="tk-skill"><span class="tk-sk-name">{{ a.name }}</span><div class="tk-sk-bar"><div :style="{width:(a.level*25)+'%',background:'#f59e0b'}" class="tk-sk-fill"></div></div></div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="tk-sec"><div class="tk-sec-t" :style="{color:accentColor}">// projects</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="tk-proj">
              <div class="tk-proj-head"><span class="tk-proj-name">{{ p.name }}</span><span v-if="p.tech" class="tk-proj-tech" :style="{background:accentColor+'22',color:accentColor}">{{ p.tech }}</span></div>
              <p v-if="p.description" class="tk-exp-desc">{{ p.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         11. ACADÉMIQUE
    ══════════════════════════════════════════ -->
    <div v-if="selectedTpl==='academic'" class="cv-academic">
      <div class="acad-header" :style="{borderTopColor:accentColor}">
        <div class="acad-hd-left">
          <img v-if="cv.photo" :src="cv.photo" class="acad-photo" @error="e=>e.target.style.display='none'"/>
          <div v-else class="acad-init" :style="{background:accentColor+'15',color:accentColor}">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
        </div>
        <div class="acad-hd-right">
          <h1 class="acad-name">{{ cv.firstName||'Prénom' }} <span class="acad-lastname" :style="{color:accentColor}">{{ cv.lastName||'Nom' }}</span></h1>
          <p class="acad-title">{{ cv.title }}</p>
          <div class="acad-meta">
            <span v-if="cv.email">{{ cv.email }}</span>
            <span v-if="cv.phone">{{ cv.phone }}</span>
            <span v-if="cv.city">{{ cv.city }}{{ cv.country?', '+cv.country:'' }}</span>
            <span v-if="cv.website">{{ cv.website }}</span>
            <span v-if="cv.dateNaissance">Né(e) le {{ formatDate(cv.dateNaissance) }}</span>
          </div>
        </div>
      </div>
      <div class="acad-divider"><div class="acad-div-line" :style="{background:accentColor}"></div></div>
      <div class="acad-body">
        <div class="acad-main">
          <div v-if="cv.summary" class="acad-sec">
            <div class="acad-sec-t" :style="{color:accentColor,borderBottomColor:accentColor+'33'}">Résumé</div>
            <p class="acad-txt">{{ cv.summary }}</p>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="acad-sec">
            <div class="acad-sec-t" :style="{color:accentColor,borderBottomColor:accentColor+'33'}">Formation Académique</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="acad-entry">
              <div class="acad-entry-year" :style="{color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+'–'+e.anneeFin : e.year }}</div>
              <div class="acad-entry-body"><div class="acad-degree">{{ e.degree }}</div><div class="acad-school">{{ e.school }}</div></div>
            </div>
          </div>
          <div v-if="cv.experiences.some(e=>e.position)" class="acad-sec">
            <div class="acad-sec-t" :style="{color:accentColor,borderBottomColor:accentColor+'33'}">Expériences</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="acad-entry">
              <div class="acad-entry-year" :style="{color:accentColor}">{{ e.startDate }}<br/>{{ e.endDate }}</div>
              <div class="acad-entry-body">
                <div class="acad-degree">{{ e.position }}</div>
                <div class="acad-school">{{ e.company }}</div>
                <div v-if="hasBullets(e)" class="acad-bullets">
                  <div v-for="(b,bi) in getBullets(e)" :key="bi" class="acad-bullet-line">
                    <span class="acad-bullet-dot" :style="{background:accentColor}"></span>
                    <span class="acad-bullet-text">{{ b }}</span>
                  </div>
                </div>
                <p v-else-if="e.description" class="acad-desc">{{ e.description }}</p>
              </div>
            </div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="acad-sec">
            <div class="acad-sec-t" :style="{color:accentColor,borderBottomColor:accentColor+'33'}">Publications / Projets</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="acad-pub">
              <div class="acad-pub-bullet" :style="{background:accentColor}"></div>
              <div><strong>{{ p.name }}</strong><span v-if="p.tech" class="acad-pub-tech"> · {{ p.tech }}</span><p v-if="p.description" class="acad-desc">{{ p.description }}</p></div>
            </div>
          </div>
        </div>
        <div class="acad-aside">
          <div v-if="cv.skills.some(s=>s.name)" class="acad-sec">
            <div class="acad-sec-t" :style="{color:accentColor,borderBottomColor:accentColor+'33'}">Compétences</div>
            <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="acad-skill">
              <span class="acad-skill-name">{{ s.name }}</span>
              <div class="acad-skill-dots"><span v-for="d in 4" :key="d" :style="{background:d<=s.level?accentColor:'#e5e7eb',width:'7px',height:'7px',borderRadius:'50%',display:'inline-block',margin:'0 1px'}"></span></div>
            </div>
          </div>
          <div v-if="cv.languages.some(l=>l.name)" class="acad-sec">
            <div class="acad-sec-t" :style="{color:accentColor,borderBottomColor:accentColor+'33'}">Langues</div>
            <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="acad-lang"><span>{{ l.name }}</span><span class="acad-lang-lvl">{{ l.level }}</span></div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="acad-sec">
            <div class="acad-sec-t" :style="{color:accentColor,borderBottomColor:accentColor+'33'}">Intérêts</div>
            <div class="acad-interests">
              <span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="acad-interest" :style="{borderColor:accentColor+'55',color:accentColor}">{{ c.name }}</span>
            </div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="acad-sec">
            <div class="acad-sec-t" :style="{color:accentColor,borderBottomColor:accentColor+'33'}">Aptitudes</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="acad-skill">
              <span class="acad-skill-name">{{ a.name }}</span>
              <div class="acad-skill-dots"><span v-for="d in 4" :key="d" :style="{background:d<=a.level?'#f59e0b':'#e5e7eb',width:'7px',height:'7px',borderRadius:'50%',display:'inline-block',margin:'0 1px'}"></span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         12. LUXE
    ══════════════════════════════════════════ -->
    <div v-if="selectedTpl==='luxury'" class="cv-luxury">
      <div class="lux-top">
        <div class="lux-ornament" :style="{color:accentColor}">◆ ◆ ◆</div>
        <div class="lux-photo-area"><img v-if="cv.photo" :src="cv.photo" class="lux-photo" @error="e=>e.target.style.display='none'"/></div>
        <h1 class="lux-name">{{ (cv.firstName||'Prénom').toUpperCase() }} <span :style="{color:accentColor}">{{ (cv.lastName||'NOM').toUpperCase() }}</span></h1>
        <p class="lux-title">{{ cv.title }}</p>
        <div class="lux-rule"><div class="lux-rule-line" :style="{background:accentColor}"></div><div class="lux-rule-diamond" :style="{background:accentColor}"></div><div class="lux-rule-line" :style="{background:accentColor}"></div></div>
        <div class="lux-contacts">
          <span v-if="cv.email">{{ cv.email }}</span>
          <span class="lux-sep" :style="{color:accentColor}">◆</span>
          <span v-if="cv.phone">{{ cv.phone }}</span>
          <span v-if="cv.city" class="lux-sep" :style="{color:accentColor}">◆</span>
          <span v-if="cv.city">{{ cv.city }}{{ cv.country?', '+cv.country:'' }}</span>
        </div>
        <div v-if="cv.dateNaissance" class="lux-dob">Né(e) le {{ formatDate(cv.dateNaissance) }}</div>
      </div>
      <div class="lux-body">
        <div class="lux-left">
          <div v-if="cv.skills.some(s=>s.name)" class="lux-sec">
            <div class="lux-sec-t" :style="{color:accentColor}">COMPÉTENCES</div>
            <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="lux-skill">
              <span class="lux-skill-name">{{ s.name }}</span>
              <div class="lux-diamonds"><span v-for="d in 4" :key="d" :style="{color:d<=s.level?accentColor:'#d1d5db',fontSize:'10px'}">◆</span></div>
            </div>
          </div>
          <div v-if="cv.languages.some(l=>l.name)" class="lux-sec">
            <div class="lux-sec-t" :style="{color:accentColor}">LANGUES</div>
            <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="lux-lang"><span>{{ l.name }}</span><span class="lux-lang-lvl" :style="{color:accentColor}">{{ l.level }}</span></div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="lux-sec">
            <div class="lux-sec-t" :style="{color:accentColor}">INTÉRÊTS</div>
            <div v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="lux-interest"><span :style="{color:accentColor}">◆</span> {{ c.name }}</div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="lux-sec">
            <div class="lux-sec-t" :style="{color:accentColor}">APTITUDES</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="lux-skill">
              <span class="lux-skill-name">{{ a.name }}</span>
              <div class="lux-diamonds"><span v-for="d in 4" :key="d" :style="{color:d<=a.level?'#f59e0b':'#d1d5db',fontSize:'10px'}">◆</span></div>
            </div>
          </div>
        </div>
        <div class="lux-right">
          <div v-if="cv.summary" class="lux-sec"><div class="lux-sec-t" :style="{color:accentColor}">PROFIL</div><p class="lux-txt">{{ cv.summary }}</p></div>
          <div v-if="cv.experiences.some(e=>e.position)" class="lux-sec"><div class="lux-sec-t" :style="{color:accentColor}">EXPÉRIENCES</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="lux-entry">
              <div class="lux-entry-marker" :style="{background:accentColor}"></div>
              <div class="lux-entry-body">
                <div class="lux-entry-top"><span class="lux-pos">{{ e.position }}</span><span class="lux-date" :style="{color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div>
                <div class="lux-co">{{ e.company }}</div>
                <div v-if="hasBullets(e)" class="lux-bullets">
                  <div v-for="(b,bi) in getBullets(e)" :key="bi" class="lux-bullet-line">
                    <span :style="{color:accentColor,fontSize:'10px'}">◆</span>
                    <span class="lux-bullet-text">{{ b }}</span>
                  </div>
                </div>
                <p v-else-if="e.description" class="lux-desc">{{ e.description }}</p>
              </div>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="lux-sec"><div class="lux-sec-t" :style="{color:accentColor}">FORMATION</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="lux-entry">
              <div class="lux-entry-marker" :style="{background:accentColor}"></div>
              <div class="lux-entry-body">
                <div class="lux-pos">{{ e.degree }}</div>
                <div class="lux-co">{{ e.school }} · {{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</div>
              </div>
            </div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="lux-sec"><div class="lux-sec-t" :style="{color:accentColor}">PROJETS</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="lux-proj"><div class="lux-proj-name">{{ p.name }}<span v-if="p.tech" class="lux-tech">{{ p.tech }}</span></div><p v-if="p.description" class="lux-desc">{{ p.description }}</p></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         13. GRADIENT SIDEBAR
    ══════════════════════════════════════════ -->
    <div v-if="selectedTpl==='gradient'" class="cv-gradient">
      <div class="grad-aside" :style="{background:`linear-gradient(160deg, ${accentColor} 0%, ${accentColor}bb 100%)`}">
        <div class="grad-photo-wrap">
          <img v-if="cv.photo" :src="cv.photo" class="grad-photo" @error="e=>e.target.style.display='none'"/>
          <div v-else class="grad-init">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
        </div>
        <h2 class="grad-name">{{ cv.firstName||'Prénom' }}<br/><strong>{{ cv.lastName||'Nom' }}</strong></h2>
        <p class="grad-title">{{ cv.title }}</p>
        <div v-if="cv.dateNaissance" class="grad-dob">🎂 {{ formatDate(cv.dateNaissance) }}</div>
        <div class="grad-divider"></div>
        <div class="grad-contact-block">
          <div v-if="cv.email" class="grad-contact-item"><span class="grad-ci-icon">✉</span><span>{{ cv.email }}</span></div>
          <div v-if="cv.phone" class="grad-contact-item"><span class="grad-ci-icon">📞</span><span>{{ cv.phone }}</span></div>
          <div v-if="cv.city" class="grad-contact-item"><span class="grad-ci-icon">📍</span><span>{{ cv.city }}{{ cv.country?', '+cv.country:'' }}</span></div>
          <div v-if="cv.website" class="grad-contact-item"><span class="grad-ci-icon">🔗</span><span>{{ cv.website }}</span></div>
        </div>
        <div class="grad-divider"></div>
        <div v-if="cv.languages.some(l=>l.name)" class="grad-blk">
          <div class="grad-blk-t">LANGUES</div>
          <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="grad-lang"><span>{{ l.name }}</span><span class="grad-lang-lvl">{{ l.level }}</span></div>
        </div>
        <div v-if="cv.centresInteret.some(c=>c.name)" class="grad-blk">
          <div class="grad-blk-t">INTÉRÊTS</div>
          <div class="grad-interests">
            <span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="grad-interest">{{ c.name }}</span>
          </div>
        </div>
      </div>
      <div class="grad-main">
        <div v-if="cv.summary" class="grad-sec">
          <div class="grad-sec-t" :style="{color:accentColor}">À PROPOS</div>
          <div class="grad-sec-bar" :style="{background:accentColor}"></div>
          <p class="grad-txt">{{ cv.summary }}</p>
        </div>
        <div v-if="cv.skills.some(s=>s.name)" class="grad-sec">
          <div class="grad-sec-t" :style="{color:accentColor}">COMPÉTENCES</div>
          <div class="grad-sec-bar" :style="{background:accentColor}"></div>
          <div class="grad-skills-grid">
            <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="grad-skill">
              <div class="grad-sk-top"><span class="grad-sk-name">{{ s.name }}</span><span class="grad-sk-pct" :style="{color:accentColor}">{{ s.level*25 }}%</span></div>
              <div class="grad-sk-track"><div :style="{width:(s.level*25)+'%',background:accentColor}" class="grad-sk-fill"></div></div>
            </div>
          </div>
        </div>
        <div v-if="cv.experiences.some(e=>e.position)" class="grad-sec">
          <div class="grad-sec-t" :style="{color:accentColor}">EXPÉRIENCES</div>
          <div class="grad-sec-bar" :style="{background:accentColor}"></div>
          <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="grad-entry">
            <div class="grad-entry-line" :style="{background:accentColor+'44'}"></div>
            <div class="grad-entry-dot" :style="{background:accentColor}"></div>
            <div class="grad-entry-body">
              <div class="grad-entry-top"><span class="grad-pos">{{ e.position }}</span><span class="grad-date" :style="{background:accentColor+'15',color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div>
              <div class="grad-co">{{ e.company }}</div>
              <div v-if="hasBullets(e)" class="grad-bullets">
                <div v-for="(b,bi) in getBullets(e)" :key="bi" class="grad-bullet-line">
                  <span class="grad-bullet-dot" :style="{background:accentColor}"></span>
                  <span class="grad-bullet-text">{{ b }}</span>
                </div>
              </div>
              <p v-else-if="e.description" class="grad-desc">{{ e.description }}</p>
            </div>
          </div>
        </div>
        <div v-if="cv.education.some(e=>e.degree)" class="grad-sec">
          <div class="grad-sec-t" :style="{color:accentColor}">FORMATION</div>
          <div class="grad-sec-bar" :style="{background:accentColor}"></div>
          <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="grad-entry">
            <div class="grad-entry-dot" :style="{background:accentColor}"></div>
            <div class="grad-entry-body">
              <div class="grad-entry-top">
                <span class="grad-pos">{{ e.degree }}</span>
                <span class="grad-date" :style="{background:accentColor+'15',color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</span>
              </div>
              <div class="grad-co">{{ e.school }}</div>
            </div>
          </div>
        </div>
        <div v-if="cv.aptitudes.some(a=>a.name)" class="grad-sec">
          <div class="grad-sec-t" :style="{color:accentColor}">APTITUDES</div>
          <div class="grad-sec-bar" :style="{background:accentColor}"></div>
          <div class="grad-skills-grid">
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="grad-skill">
              <div class="grad-sk-top"><span class="grad-sk-name">{{ a.name }}</span></div>
              <div class="grad-sk-track"><div :style="{width:(a.level*25)+'%',background:'#f59e0b'}" class="grad-sk-fill"></div></div>
            </div>
          </div>
        </div>
        <div v-if="cv.projects.some(p=>p.name)" class="grad-sec">
          <div class="grad-sec-t" :style="{color:accentColor}">PROJETS</div>
          <div class="grad-sec-bar" :style="{background:accentColor}"></div>
          <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="grad-proj">
            <div class="grad-proj-name">{{ p.name }}<span v-if="p.tech" class="grad-proj-tech" :style="{background:accentColor+'15',color:accentColor}">{{ p.tech }}</span></div>
            <p v-if="p.description" class="grad-desc">{{ p.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         14. COMPACT PRO
    ══════════════════════════════════════════ -->
    <div v-if="selectedTpl==='compact'" class="cv-compact">
      <div class="cp-header" :style="{borderBottomColor:accentColor}">
        <div class="cp-photo-area">
          <img v-if="cv.photo" :src="cv.photo" class="cp-photo" @error="e=>e.target.style.display='none'"/>
          <div v-else class="cp-init" :style="{background:accentColor,color:'#fff'}">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
        </div>
        <div class="cp-hd-center">
          <h1 class="cp-name">{{ cv.firstName||'Prénom' }} <strong :style="{color:accentColor}">{{ cv.lastName||'Nom' }}</strong></h1>
          <p class="cp-title">{{ cv.title }}</p>
        </div>
        <div class="cp-hd-right">
          <div v-if="cv.email" class="cp-contact-line"><span class="cp-cl-icon" :style="{color:accentColor}">✉</span> {{ cv.email }}</div>
          <div v-if="cv.phone" class="cp-contact-line"><span class="cp-cl-icon" :style="{color:accentColor}">📞</span> {{ cv.phone }}</div>
          <div v-if="cv.city" class="cp-contact-line"><span class="cp-cl-icon" :style="{color:accentColor}">📍</span> {{ cv.city }}{{ cv.country?', '+cv.country:'' }}</div>
          <div v-if="cv.dateNaissance" class="cp-contact-line"><span class="cp-cl-icon" :style="{color:accentColor}">🎂</span> {{ formatDate(cv.dateNaissance) }}</div>
        </div>
      </div>
      <div v-if="cv.summary" class="cp-summary-bar"><p class="cp-summary-txt">{{ cv.summary }}</p></div>
      <div class="cp-body">
        <div class="cp-main">
          <div v-if="cv.experiences.some(e=>e.position)" class="cp-sec">
            <div class="cp-sec-t" :style="{background:accentColor}">EXPÉRIENCES</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="cp-entry">
              <div class="cp-entry-left">
                <div class="cp-entry-dates" :style="{color:accentColor}">{{ e.startDate }}<br/>{{ e.endDate }}</div>
                <div class="cp-entry-vline" :style="{borderColor:accentColor+'44'}"></div>
              </div>
              <div class="cp-entry-body">
                <div class="cp-entry-pos">{{ e.position }}</div>
                <div class="cp-entry-co">{{ e.company }}</div>
                <div v-if="hasBullets(e)" class="cp-bullets">
                  <div v-for="(b,bi) in getBullets(e)" :key="bi" class="cp-bullet-line">
                    <span class="cp-bullet-dot" :style="{background:accentColor}"></span>
                    <span class="cp-bullet-text">{{ b }}</span>
                  </div>
                </div>
                <p v-else-if="e.description" class="cp-entry-desc">{{ e.description }}</p>
              </div>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="cp-sec">
            <div class="cp-sec-t" :style="{background:accentColor}">FORMATION</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="cp-entry">
              <div class="cp-entry-left">
                <div class="cp-entry-dates" :style="{color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+'–'+e.anneeFin : e.year }}</div>
                <div class="cp-entry-vline" :style="{borderColor:accentColor+'44'}"></div>
              </div>
              <div class="cp-entry-body"><div class="cp-entry-pos">{{ e.degree }}</div><div class="cp-entry-co">{{ e.school }}</div></div>
            </div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="cp-sec">
            <div class="cp-sec-t" :style="{background:accentColor}">PROJETS</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="cp-proj">
              <span class="cp-proj-name">{{ p.name }}</span>
              <span v-if="p.tech" class="cp-proj-tech" :style="{background:accentColor+'15',color:accentColor}">{{ p.tech }}</span>
              <p v-if="p.description" class="cp-entry-desc">{{ p.description }}</p>
            </div>
          </div>
        </div>
        <div class="cp-aside">
          <div v-if="cv.skills.some(s=>s.name)" class="cp-sec">
            <div class="cp-sec-t" :style="{background:accentColor}">COMPÉTENCES</div>
            <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="cp-skill">
              <div class="cp-sk-info"><span class="cp-sk-name">{{ s.name }}</span></div>
              <div class="cp-sk-track"><div :style="{width:(s.level*25)+'%',background:accentColor}" class="cp-sk-fill"></div></div>
            </div>
          </div>
          <div v-if="cv.languages.some(l=>l.name)" class="cp-sec">
            <div class="cp-sec-t" :style="{background:accentColor}">LANGUES</div>
            <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="cp-lang"><span>{{ l.name }}</span><span class="cp-lang-lvl" :style="{background:accentColor+'22',color:accentColor}">{{ l.level }}</span></div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="cp-sec">
            <div class="cp-sec-t" :style="{background:accentColor}">APTITUDES</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="cp-skill">
              <div class="cp-sk-info"><span class="cp-sk-name">{{ a.name }}</span></div>
              <div class="cp-sk-track"><div :style="{width:(a.level*25)+'%',background:'#f59e0b'}" class="cp-sk-fill"></div></div>
            </div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="cp-sec">
            <div class="cp-sec-t" :style="{background:accentColor}">INTÉRÊTS</div>
            <div class="cp-interests">
              <span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="cp-interest" :style="{borderColor:accentColor,color:accentColor}">{{ c.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- ── RENDU (dans <template> de TemplateCv.vue) ── -->
<div v-if="selectedTpl==='neondark'" class="cv-neondark">

  <!-- HEADER -->
  <div class="nd-header">
    <div class="nd-header-bg" :style="{background:`linear-gradient(135deg,#0f172a 60%,${accentColor}18 100%)`}"></div>
    <div class="nd-header-content">
      <div class="nd-photo-wrap">
        <img v-if="cv.photo" :src="cv.photo" class="nd-photo" @error="e=>e.target.style.display='none'"/>
        <div v-else class="nd-init" :style="{borderColor:accentColor,color:accentColor}">
          {{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}
        </div>
        <div class="nd-photo-ring" :style="{borderColor:accentColor}"></div>
      </div>
      <div class="nd-header-text">
        <h1 class="nd-name">
          <span class="nd-name-first">{{ cv.firstName||'Prénom' }}</span>
          <span class="nd-name-last" :style="{color:accentColor}">{{ cv.lastName||'Nom' }}</span>
        </h1>
        <p class="nd-title" :style="{color:accentColor+'bb'}">{{ cv.title }}</p>
        <div v-if="cv.dateNaissance" class="nd-dob">{{ formatDate(cv.dateNaissance) }}</div>
        <div class="nd-contacts">
          <span v-if="cv.email" class="nd-contact-pill" :style="{borderColor:accentColor+'44',color:'#94a3b8'}">
            <span :style="{color:accentColor}">✉</span> {{ cv.email }}
          </span>
          <span v-if="cv.phone" class="nd-contact-pill" :style="{borderColor:accentColor+'44',color:'#94a3b8'}">
            <span :style="{color:accentColor}">☏</span> {{ cv.phone }}
          </span>
          <span v-if="cv.city" class="nd-contact-pill" :style="{borderColor:accentColor+'44',color:'#94a3b8'}">
            <span :style="{color:accentColor}">⌖</span> {{ cv.city }}{{ cv.country?', '+cv.country:'' }}
          </span>
          <span v-if="cv.website" class="nd-contact-pill" :style="{borderColor:accentColor+'44',color:'#94a3b8'}">
            <span :style="{color:accentColor}">⊕</span> {{ cv.website }}
          </span>
        </div>
      </div>
    </div>
    <!-- ligne néon sous le header -->
    <div class="nd-header-line" :style="{background:`linear-gradient(90deg,transparent,${accentColor},transparent)`}"></div>
  </div>

  <!-- BODY -->
  <div class="nd-body">

    <!-- COLONNE GAUCHE -->
    <div class="nd-left">

      <div v-if="cv.skills.some(s=>s.name)" class="nd-sec">
        <div class="nd-sec-t" :style="{color:accentColor}">
          <span class="nd-sec-icon" :style="{background:accentColor+'22',color:accentColor}">⚡</span>
          COMPÉTENCES
        </div>
        <div class="nd-sec-line" :style="{background:accentColor}"></div>
        <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="nd-skill">
          <div class="nd-sk-head">
            <span class="nd-sk-name">{{ s.name }}</span>
            <span class="nd-sk-pct" :style="{color:accentColor}">{{ s.level*25 }}%</span>
          </div>
          <div class="nd-sk-track">
            <div class="nd-sk-fill" :style="{width:(s.level*25)+'%',background:`linear-gradient(90deg,${accentColor}88,${accentColor})`}"></div>
          </div>
        </div>
      </div>

      <div v-if="cv.languages.some(l=>l.name)" class="nd-sec">
        <div class="nd-sec-t" :style="{color:accentColor}">
          <span class="nd-sec-icon" :style="{background:accentColor+'22',color:accentColor}">◎</span>
          LANGUES
        </div>
        <div class="nd-sec-line" :style="{background:accentColor}"></div>
        <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="nd-lang">
          <span class="nd-lang-name">{{ l.name }}</span>
          <span class="nd-lang-lvl" :style="{background:accentColor+'22',color:accentColor,borderColor:accentColor+'44'}">{{ l.level }}</span>
        </div>
      </div>

      <div v-if="cv.aptitudes.some(a=>a.name)" class="nd-sec">
        <div class="nd-sec-t" :style="{color:accentColor}">
          <span class="nd-sec-icon" :style="{background:accentColor+'22',color:accentColor}">◈</span>
          APTITUDES
        </div>
        <div class="nd-sec-line" :style="{background:accentColor}"></div>
        <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="nd-skill">
          <div class="nd-sk-head">
            <span class="nd-sk-name">{{ a.name }}</span>
          </div>
          <div class="nd-sk-track">
            <div class="nd-sk-fill" :style="{width:(a.level*25)+'%',background:'linear-gradient(90deg,#f59e0b88,#f59e0b)'}"></div>
          </div>
        </div>
      </div>

      <div v-if="cv.centresInteret.some(c=>c.name)" class="nd-sec">
        <div class="nd-sec-t" :style="{color:accentColor}">
          <span class="nd-sec-icon" :style="{background:accentColor+'22',color:accentColor}">◇</span>
          INTÉRÊTS
        </div>
        <div class="nd-sec-line" :style="{background:accentColor}"></div>
        <div class="nd-interests">
          <span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name"
            class="nd-interest" :style="{borderColor:accentColor+'55',color:'#94a3b8'}">
            {{ c.name }}
          </span>
        </div>
      </div>

    </div>

    <!-- COLONNE DROITE -->
    <div class="nd-right">

      <div v-if="cv.summary" class="nd-sec">
        <div class="nd-sec-t" :style="{color:accentColor}">
          <span class="nd-sec-icon" :style="{background:accentColor+'22',color:accentColor}">▸</span>
          PROFIL
        </div>
        <div class="nd-sec-line" :style="{background:accentColor}"></div>
        <p class="nd-summary">{{ cv.summary }}</p>
      </div>

      <div v-if="cv.experiences.some(e=>e.position)" class="nd-sec">
        <div class="nd-sec-t" :style="{color:accentColor}">
          <span class="nd-sec-icon" :style="{background:accentColor+'22',color:accentColor}">◉</span>
          EXPÉRIENCES
        </div>
        <div class="nd-sec-line" :style="{background:accentColor}"></div>
        <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="nd-entry">
          <div class="nd-entry-node" :style="{background:accentColor}"></div>
          <div class="nd-entry-vline" :style="{borderColor:accentColor+'33'}"></div>
          <div class="nd-entry-body">
            <div class="nd-entry-top">
              <span class="nd-entry-pos">{{ e.position }}</span>
              <span class="nd-entry-date" :style="{background:accentColor+'15',color:accentColor,borderColor:accentColor+'44'}">
                {{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}
              </span>
            </div>
            <div class="nd-entry-co" :style="{color:accentColor+'99'}">{{ e.company }}</div>
            <!-- puces ou texte libre -->
            <div v-if="hasBullets(e)" class="nd-bullets">
              <div v-for="(b,bi) in getBullets(e)" :key="bi" class="nd-bullet-line">
                <span class="nd-bullet-dot" :style="{background:accentColor}"></span>
                <span class="nd-bullet-text">{{ b }}</span>
              </div>
            </div>
            <p v-else-if="e.description" class="nd-entry-desc">{{ e.description }}</p>
          </div>
        </div>
      </div>

      <div v-if="cv.education.some(e=>e.degree)" class="nd-sec">
        <div class="nd-sec-t" :style="{color:accentColor}">
          <span class="nd-sec-icon" :style="{background:accentColor+'22',color:accentColor}">◎</span>
          FORMATION
        </div>
        <div class="nd-sec-line" :style="{background:accentColor}"></div>
        <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="nd-entry">
          <div class="nd-entry-node" :style="{background:accentColor}"></div>
          <div class="nd-entry-body">
            <div class="nd-entry-top">
              <span class="nd-entry-pos">{{ e.degree }}</span>
              <span class="nd-entry-date" :style="{background:accentColor+'15',color:accentColor,borderColor:accentColor+'44'}">
                {{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}
              </span>
            </div>
            <div class="nd-entry-co" :style="{color:accentColor+'99'}">{{ e.school }}</div>
          </div>
        </div>
      </div>

      <div v-if="cv.projects.some(p=>p.name)" class="nd-sec">
        <div class="nd-sec-t" :style="{color:accentColor}">
          <span class="nd-sec-icon" :style="{background:accentColor+'22',color:accentColor}">▹</span>
          PROJETS
        </div>
        <div class="nd-sec-line" :style="{background:accentColor}"></div>
        <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="nd-proj">
          <div class="nd-proj-head">
            <span class="nd-proj-name">{{ p.name }}</span>
            <span v-if="p.tech" class="nd-proj-tech" :style="{background:accentColor+'15',color:accentColor,borderColor:accentColor+'44'}">{{ p.tech }}</span>
          </div>
          <p v-if="p.description" class="nd-entry-desc">{{ p.description }}</p>
        </div>
      </div>

    </div>
  </div>
</div>


  </div>
</template>

<script>
export default {
  name: 'TemplateCv',
  props: {
    cv:          { type: Object,  required: true },
    selectedTpl: { type: String,  required: true },
    accentColor: { type: String,  required: true },
  },
  methods: {
    formatDate(d) {
      if (!d) return ''
      try { const [y,m,j] = d.split('-'); return `${j}/${m}/${y}` } catch { return d }
    },
    /**
     * Retourne true si l'expérience a des puces à afficher.
     * On détecte : bullets[] non vide OU description avec lignes commençant par - / • / *
     */
    hasBullets(e) {
      if (e.bullets && e.bullets.some(b => b && b.trim())) return true
      if (e.description) {
        const lines = e.description.split('\n').filter(l => l.trim())
        return lines.some(l => /^[-•*]\s/.test(l.trim()))
      }
      return false
    },
    /**
     * Retourne le tableau de puces à afficher.
     * Priorité : bullets[] > parsing de description
     */
    getBullets(e) {
      if (e.bullets && e.bullets.some(b => b && b.trim())) {
        return e.bullets.filter(b => b && b.trim())
      }
      if (e.description) {
        return e.description
          .split('\n')
          .map(l => l.trim())
          .filter(l => l)
          .map(l => l.replace(/^[-•*]\s*/, ''))
          .filter(l => l)
      }
      return []
    },
  },
}
</script>

<style scoped>
/* ════════════ CV PAPER ════════════ */
.cv-paper{width:794px;min-height:1123px;background:#fff;box-shadow:0 8px 40px rgba(0,0,0,.18);overflow:hidden;font-family:'DM Sans','Segoe UI',Arial,sans-serif;color:#1a1a1a;font-size:13px;line-height:1.5}

/* ── Bullet lists partagées (tous templates) ── */
.cc-bullets,.cm-bullets,.cmod-bullets,.corp-bullets,.eleg-bullets,.dk-bullets,
.tl-bullets,.sw-bullets,.cr-bullets,.tk-bullets,.acad-bullets,.lux-bullets,
.grad-bullets,.cp-bullets{display:flex;flex-direction:column;gap:3px;margin-top:4px}

.cc-bullet-line,.cm-bullet-line,.cmod-bullet-line,.corp-bullet-line,.eleg-bullet-line,
.dk-bullet-line,.tl-bullet-line,.sw-bullet-line,.cr-bullet-line,.tk-bullet-line,
.acad-bullet-line,.lux-bullet-line,.grad-bullet-line,.cp-bullet-line{
  display:flex;align-items:flex-start;gap:6px}

.cc-bullet-dot,.cm-bullet-dot,.cmod-bullet-dot,.corp-bullet-dot,.eleg-bullet-dot,
.dk-bullet-dot,.tl-bullet-dot,.sw-bullet-dot,.cr-bullet-dot,.tk-bullet-dot,
.acad-bullet-dot,.grad-bullet-dot,.cp-bullet-dot{
  width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:5px}

.lux-bullet-line{gap:7px;align-items:flex-start}

.cc-bullet-text,.cm-bullet-text,.cmod-bullet-text,.corp-bullet-text,.eleg-bullet-text,
.dk-bullet-text,.tl-bullet-text,.sw-bullet-text,.cr-bullet-text,.tk-bullet-text,
.acad-bullet-text,.lux-bullet-text,.grad-bullet-text,.cp-bullet-text{
  font-size:11.5px;color:inherit;line-height:1.55}

/* ─────── 1. CLASSIQUE ─────── */
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
.cc-bullet-text{color:#4b5563}

/* ─────── 2. MINIMAL ─────── */
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
.cm-bullet-text{color:#555}

/* ─────── 3. MODERNE ─────── */
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
.cmod-bullet-text{color:#555}

/* ─────── 4. CORPORATE ─────── */
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
.corp-bullet-text{color:#4b5563}

/* ─────── 5. ÉLÉGANT ─────── */
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
.eleg-bullet-text{color:#555}

/* ─────── 6. DARK ─────── */
.cv-dark{display:flex;flex-direction:column;min-height:1123px;background:#111827}
.dk-hd{padding:28px 34px;display:flex;gap:18px;align-items:center;background:#1f2937}
.dk-photo{width:74px;height:74px;border-radius:50%;object-fit:cover;flex-shrink:0}
.dk-photo-wrap{flex-shrink:0}
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
.dk-bullet-text{color:#9ca3af}

/* ─────── 7. TIMELINE ─────── */
.cv-tl{display:flex;flex-direction:column;min-height:1123px}
.tl-hd{padding:24px 32px;border-left:6px solid;background:#fafafa}
.tl-hd-inner{display:flex;align-items:center;gap:16px;margin-bottom:10px}
.tl-photo{width:64px;height:64px;border-radius:50%;object-fit:cover;flex-shrink:0}
.tl-init{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:#fff;flex-shrink:0}
.tl-name{font-size:22px;font-weight:800;color:#111;margin:0 0 2px}
.tl-job{font-size:13px;font-weight:700;margin:0}
.tl-dob{font-size:11px;color:#9ca3af;margin:3px 0 0}
.tl-contacts{display:flex;flex-wrap:wrap;gap:4px 14px}
.tl-contacts span{font-size:11px;color:#6b7280}
.tl-body{display:grid;grid-template-columns:210px 1fr;flex:1}
.tl-left{padding:20px 14px;background:#fafafa;border-right:1px solid #e5e7eb}
.tl-right{padding:20px 24px}
.tl-sec{margin-bottom:20px}
.tl-sec-t{font-size:9.5px;font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px}
.tl-summary{font-size:12px;color:#555;line-height:1.7;margin-bottom:16px}
.tl-skill{margin-bottom:7px}
.tl-sk-n{font-size:11.5px;font-weight:600;color:#374151;margin-bottom:3px}
.tl-sk-track{height:4px;background:#e5e7eb;border-radius:99px;overflow:hidden}
.tl-sk-fill{height:100%;border-radius:99px}
.tl-lang{display:flex;justify-content:space-between;font-size:11.5px;padding:4px 0;border-bottom:1px solid #f0f0f0}
.tl-interests{display:flex;flex-wrap:wrap;gap:4px}
.tl-interest{padding:2px 8px;border-radius:99px;font-size:10.5px;font-weight:600}
.tl-item{display:flex;gap:0;margin-bottom:16px;position:relative;padding-left:24px}
.tl-node{width:10px;height:10px;border-radius:50%;position:absolute;left:0;top:3px;flex-shrink:0}
.tl-line-v{position:absolute;left:4px;top:14px;bottom:-14px;width:0;border-left:1.5px dashed}
.tl-content{flex:1}
.tl-date-badge{display:inline-block;font-size:10px;font-weight:700;padding:2px 9px;border-radius:99px;margin-bottom:4px}
.tl-pos{font-size:13px;font-weight:700;color:#111;margin-bottom:1px}
.tl-co{font-size:11px;color:#6b7280;margin-bottom:3px}
.tl-desc{font-size:11.5px;color:#555;line-height:1.6;margin:0}
.tl-bullet-text{color:#555}

/* ─────── 8. SWISS ─────── */
.cv-swiss{display:flex;flex-direction:column;min-height:1123px;background:#fff}
.sw-top-bar{height:6px}
.sw-header{display:flex;gap:20px;align-items:center;padding:28px 36px 20px}
.sw-hd-left{flex-shrink:0}
.sw-photo{width:80px;height:80px;border-radius:4px;object-fit:cover}
.sw-init{width:80px;height:80px;border-radius:4px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900}
.sw-hd-right{flex:1}
.sw-name{font-size:28px;font-weight:900;letter-spacing:-1px;color:#111;margin:0 0 4px;line-height:1.1}
.sw-title{font-size:14px;font-weight:500;color:#555;margin:0 0 10px}
.sw-contacts{display:flex;flex-wrap:wrap;gap:3px 16px}
.sw-contacts span{font-size:11px;color:#888}
.sw-divider{height:1px;margin:0 36px 0}
.sw-body{display:grid;grid-template-columns:220px 1fr;flex:1;padding:20px 0}
.sw-left{padding:0 16px 0 36px;border-right:1px solid #f0f0f0}
.sw-right{padding:0 36px 0 28px}
.sw-sec{margin-bottom:22px}
.sw-profile{padding-bottom:18px;border-bottom:1px solid #f0f0f0;margin-bottom:22px}
.sw-sec-t{font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:1.8px;margin-bottom:10px}
.sw-summary{font-size:12.5px;color:#444;line-height:1.75;margin:0}
.sw-skill{display:flex;align-items:center;gap:8px;margin-bottom:7px}
.sw-sk-name{font-size:12px;font-weight:600;color:#333;min-width:80px}
.sw-sk-bar{flex:1;height:3px;background:#e5e7eb;border-radius:99px;overflow:hidden}
.sw-sk-fill{height:100%;border-radius:99px}
.sw-lang{display:flex;justify-content:space-between;font-size:11.5px;padding:4px 0;border-bottom:1px solid #f5f5f5}
.sw-lang-lvl{color:#999;font-size:10.5px}
.sw-edu{display:flex;gap:10px;margin-bottom:10px}
.sw-edu-year{font-size:11px;font-weight:700;min-width:50px;padding-top:1px}
.sw-edu-deg{font-size:12.5px;font-weight:700;color:#111}
.sw-edu-school{font-size:11px;color:#777}
.sw-interests{display:flex;flex-direction:column;gap:3px}
.sw-interest{font-size:11.5px;color:#555}
.sw-interests .sw-interest::before{content:'— ';opacity:.4}
.sw-exp{margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #f5f5f5}
.sw-exp:last-child{border-bottom:none}
.sw-exp-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px}
.sw-exp-pos{font-size:13px;font-weight:700;color:#111}
.sw-exp-co{font-size:11.5px;color:#666;margin-bottom:4px}
.sw-exp-date{font-size:10.5px;font-weight:600;white-space:nowrap;flex-shrink:0;margin-left:8px}
.sw-exp-desc{font-size:11.5px;color:#555;line-height:1.65;margin:0}
.sw-bullet-text{color:#555}

/* ─────── 9. CRÉATIF ─────── */
.cv-creative{display:flex;flex-direction:column;min-height:1123px}
.cr-hero{position:relative;padding:0;overflow:hidden}
.cr-hero-content{display:flex;align-items:center;gap:24px;padding:32px 34px 28px}
.cr-hero-wave{position:absolute;bottom:-1px;left:0;right:0;height:24px;background:#fff;clip-path:ellipse(55% 100% at 50% 100%)}
.cr-photo-wrap{flex-shrink:0}
.cr-photo{width:88px;height:88px;border-radius:50%;object-fit:cover;border:4px solid rgba(255,255,255,.4)}
.cr-init{width:88px;height:88px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:#fff;border:3px solid rgba(255,255,255,.3)}
.cr-hero-text{color:#fff}
.cr-name{font-size:30px;font-weight:900;line-height:1.1;margin:0 0 8px}
.cr-title-badge{display:inline-block;background:rgba(255,255,255,.25);backdrop-filter:blur(4px);padding:4px 14px;border-radius:99px;font-size:12px;font-weight:600;color:#fff;margin:0}
.cr-contacts-bar{display:flex;flex-wrap:wrap;gap:5px 16px;padding:12px 34px;background:#f8f9fa;border-bottom:1px solid #eee}
.cr-contacts-bar span{font-size:11px;color:#666}
.cr-body{display:grid;grid-template-columns:220px 1fr;flex:1}
.cr-left{padding:20px 14px;background:#fafafa;border-right:1px solid #eee}
.cr-right{padding:20px 22px}
.cr-sec{margin-bottom:18px}
.cr-sec-t{display:inline-block;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:#fff;padding:3px 10px;border-radius:4px;margin-bottom:10px}
.cr-summary{font-size:12px;color:#444;line-height:1.7;margin:0}
.cr-skill-tags{display:flex;flex-wrap:wrap;gap:5px}
.cr-skill-tag{padding:3px 10px;border:1.5px solid;border-radius:99px;font-size:11px;font-weight:600}
.cr-lang{display:flex;justify-content:space-between;font-size:12px;padding:5px 0;border-bottom:1px solid #eee;align-items:center}
.cr-lang-lvl{font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px}
.cr-exp{display:flex;gap:10px;margin-bottom:14px}
.cr-exp-dot{width:9px;height:9px;border-radius:50%;margin-top:4px;flex-shrink:0}
.cr-exp-body{flex:1}
.cr-exp-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px}
.cr-exp-pos{font-size:13px;font-weight:700;color:#111}
.cr-exp-date{font-size:10px;font-weight:600;white-space:nowrap;margin-left:6px}
.cr-exp-co{font-size:11px;color:#6b7280;margin-bottom:3px}
.cr-exp-desc{font-size:11.5px;color:#555;line-height:1.6;margin:0}
.cr-proj{margin-bottom:10px;padding:10px 12px;background:#f8f9fa;border-radius:6px;border-left:3px solid}
.cr-proj-name{font-size:13px;font-weight:700;color:#111}
.cr-proj-tech{font-size:10px;color:#888;background:#eee;padding:1px 7px;border-radius:3px;margin-left:8px;font-weight:400}
.cr-bullet-text{color:#555}

/* ─────── 10. TECH ─────── */
.cv-tech{display:flex;flex-direction:column;min-height:1123px;background:#0d1117;color:#c9d1d9}
.tk-header{border-bottom:1px solid #30363d}
.tk-terminal-bar{display:flex;align-items:center;gap:6px;padding:8px 16px;background:#161b22;border-bottom:1px solid #30363d}
.tk-dot{width:10px;height:10px;border-radius:50%}
.tk-dot.red{background:#ff5f56}.tk-dot.yellow{background:#ffbd2e}.tk-dot.green{background:#27c93f}
.tk-terminal-title{font-size:11px;color:#8b949e;margin-left:8px;font-family:monospace}
.tk-hd-body{display:flex;gap:20px;align-items:center;padding:20px 24px}
.tk-hd-left{flex-shrink:0}
.tk-photo{width:80px;height:80px;border-radius:8px;object-fit:cover;border:2px solid #30363d}
.tk-init{width:80px;height:80px;border-radius:8px;border:2px solid;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;background:#161b22}
.tk-hd-info{flex:1}
.tk-prompt{font-size:11.5px;color:#8b949e;font-family:monospace;margin-bottom:2px}
.tk-prompt-symbol{font-weight:700;margin-right:6px}
.tk-name{font-size:22px;font-weight:800;color:#f0f6fc;margin:0 0 4px;font-family:monospace}
.tk-role{font-size:13px;font-weight:600;margin:0 0 10px;font-family:monospace}
.tk-contacts{display:flex;flex-wrap:wrap;gap:4px 16px}
.tk-contacts span{font-size:11px;color:#8b949e;font-family:monospace}
.tk-body{display:grid;grid-template-columns:210px 1fr;flex:1}
.tk-left{padding:20px 14px;background:#161b22;border-right:1px solid #30363d}
.tk-right{padding:20px 22px}
.tk-sec{margin-bottom:20px}
.tk-sec-t{font-size:11px;font-weight:700;font-family:monospace;margin-bottom:10px;letter-spacing:.5px}
.tk-skill{display:flex;align-items:center;gap:8px;margin-bottom:7px}
.tk-sk-name{font-size:11.5px;color:#c9d1d9;min-width:70px;font-family:monospace}
.tk-sk-bar{flex:1;height:3px;background:#30363d;border-radius:99px;overflow:hidden}
.tk-sk-fill{height:100%;border-radius:99px}
.tk-lang{display:flex;justify-content:space-between;font-size:11.5px;color:#c9d1d9;padding:4px 0;border-bottom:1px solid #21262d;font-family:monospace}
.tk-lang-lvl{font-size:10px}
.tk-edu{margin-bottom:10px}
.tk-edu-year{font-size:10.5px;font-family:monospace;font-weight:700;margin-bottom:1px}
.tk-edu-deg{font-size:12px;font-weight:700;color:#f0f6fc}
.tk-edu-school{font-size:11px;color:#8b949e}
.tk-interests{display:flex;flex-wrap:wrap;gap:4px}
.tk-interest{font-size:10px;padding:2px 8px;border-radius:3px;font-family:monospace;font-weight:600}
.tk-summary{font-size:12px;color:#8b949e;line-height:1.7;margin:0;font-family:monospace}
.tk-exp{margin-bottom:14px;padding:12px;background:#161b22;border-radius:6px;border:1px solid #30363d}
.tk-exp-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
.tk-exp-pos{font-size:13px;font-weight:700;color:#f0f6fc;font-family:monospace}
.tk-exp-date{font-size:10px;font-family:monospace;white-space:nowrap}
.tk-exp-co{font-size:11.5px;color:#8b949e;margin-bottom:5px;font-family:monospace}
.tk-exp-desc{font-size:11.5px;color:#8b949e;line-height:1.6;margin:0}
.tk-proj{margin-bottom:12px;padding:10px;background:#161b22;border-radius:6px;border:1px solid #30363d}
.tk-proj-head{display:flex;align-items:center;gap:8px;margin-bottom:5px}
.tk-proj-name{font-size:13px;font-weight:700;color:#f0f6fc;font-family:monospace}
.tk-proj-tech{font-size:9.5px;font-family:monospace;padding:2px 8px;border-radius:4px;font-weight:600}
.tk-bullet-text{color:#8b949e;font-family:monospace}

/* ─────── 11. ACADÉMIQUE ─────── */
.cv-academic{display:flex;flex-direction:column;min-height:1123px;background:#fff}
.acad-header{display:flex;gap:22px;padding:28px 36px 22px;border-top:4px solid;border-bottom:1px solid #e5e7eb}
.acad-hd-left{flex-shrink:0}
.acad-photo{width:82px;height:82px;border-radius:8px;object-fit:cover}
.acad-init{width:82px;height:82px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900}
.acad-hd-right{flex:1}
.acad-name{font-size:26px;font-weight:700;color:#111;margin:0 0 4px;font-family:'Georgia',serif;letter-spacing:-.3px}
.acad-lastname{font-style:italic}
.acad-title{font-size:13px;color:#555;margin:0 0 10px;font-style:italic}
.acad-meta{display:flex;flex-wrap:wrap;gap:3px 14px}
.acad-meta span{font-size:11px;color:#6b7280}
.acad-divider{padding:0 36px}
.acad-div-line{height:1px;margin:0}
.acad-body{display:grid;grid-template-columns:1fr 230px;padding:22px 36px;gap:28px;flex:1}
.acad-sec{margin-bottom:22px}
.acad-sec-t{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;padding-bottom:5px;border-bottom:1.5px solid;font-family:'Georgia',serif}
.acad-txt{font-size:12.5px;color:#444;line-height:1.75;margin:0}
.acad-entry{display:flex;gap:14px;margin-bottom:12px}
.acad-entry-year{font-size:10.5px;font-weight:700;min-width:55px;padding-top:2px;font-family:'Georgia',serif}
.acad-entry-body{flex:1}
.acad-degree{font-size:13px;font-weight:700;color:#111;margin-bottom:2px;font-family:'Georgia',serif}
.acad-school{font-size:11.5px;color:#6b7280;margin-bottom:2px}
.acad-desc{font-size:11.5px;color:#555;line-height:1.6;margin:3px 0 0}
.acad-pub{display:flex;gap:9px;margin-bottom:8px;padding:8px;background:#f9fafb;border-radius:5px}
.acad-pub-bullet{width:4px;border-radius:2px;flex-shrink:0;margin-top:3px}
.acad-pub-tech{font-style:italic;color:#9ca3af;font-size:11px}
.acad-skill{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.acad-skill-name{font-size:12px;color:#374151}
.acad-skill-dots{display:flex;gap:2px}
.acad-lang{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:12px}
.acad-lang-lvl{color:#9ca3af;font-size:10.5px;font-style:italic}
.acad-interests{display:flex;flex-wrap:wrap;gap:5px}
.acad-interest{padding:3px 9px;border:1.5px solid;border-radius:99px;font-size:11px;font-weight:600}
.acad-bullet-text{color:#555}

/* ─────── 12. LUXE ─────── */
.cv-luxury{display:flex;flex-direction:column;min-height:1123px;background:#fafaf8}
.lux-top{padding:30px 36px 20px;text-align:center;background:#fff;border-bottom:1px solid #e8e0d5}
.lux-ornament{font-size:11px;letter-spacing:6px;margin-bottom:10px;opacity:.5}
.lux-photo-area{display:flex;justify-content:center;margin-bottom:12px}
.lux-photo{width:88px;height:88px;border-radius:50%;object-fit:cover;border:3px solid;border-color:#d4b896}
.lux-name{font-family:'Georgia',serif;font-size:26px;font-weight:400;letter-spacing:3px;color:#1a1a1a;text-transform:uppercase;margin:0 0 6px}
.lux-title{font-family:'Georgia',serif;font-size:13px;color:#7a6a55;font-style:italic;margin:0 0 12px}
.lux-rule{display:flex;align-items:center;gap:8px;margin:12px auto;max-width:300px}
.lux-rule-line{flex:1;height:1px}
.lux-rule-diamond{width:6px;height:6px;transform:rotate(45deg);flex-shrink:0}
.lux-contacts{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:4px 8px;font-size:11px;color:#666;margin-bottom:4px}
.lux-sep{font-size:8px}
.lux-dob{font-size:11px;color:#9ca3af;margin-top:4px;font-style:italic}
.lux-body{display:grid;grid-template-columns:220px 1fr;flex:1}
.lux-left{padding:22px 16px;background:#fff;border-right:1px solid #e8e0d5}
.lux-right{padding:22px 28px}
.lux-sec{margin-bottom:20px}
.lux-sec-t{font-family:'Georgia',serif;font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;padding-bottom:5px;border-bottom:1px solid currentColor}
.lux-skill{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;padding:3px 0}
.lux-skill-name{font-size:12px;color:#374151}
.lux-diamonds{display:flex;gap:1px}
.lux-lang{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f0ebe4;font-size:12px}
.lux-lang-lvl{font-size:10.5px;font-style:italic}
.lux-interest{display:flex;align-items:center;gap:6px;font-size:12px;color:#555;margin-bottom:5px}
.lux-txt{font-size:12px;color:#444;line-height:1.75;margin:0;font-family:'Georgia',serif}
.lux-entry{display:flex;gap:10px;margin-bottom:14px}
.lux-entry-marker{width:2px;flex-shrink:0;margin-top:3px}
.lux-entry-body{flex:1}
.lux-entry-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px}
.lux-pos{font-size:13px;font-weight:700;color:#111;font-family:'Georgia',serif}
.lux-date{font-size:10px;font-style:italic;white-space:nowrap;margin-left:8px;flex-shrink:0}
.lux-co{font-size:11.5px;color:#7a6a55;margin-bottom:3px}
.lux-desc{font-size:11.5px;color:#555;line-height:1.65;margin:2px 0 0}
.lux-proj{margin-bottom:10px;padding:8px 12px;border-left:2px solid;border-radius:0 4px 4px 0;background:#fff}
.lux-proj-name{font-size:13px;font-weight:700;color:#111;font-family:'Georgia',serif}
.lux-tech{font-size:10px;color:#9ca3af;margin-left:8px;font-style:italic}
.lux-bullet-text{color:#555;font-size:11.5px}

/* ─────── 13. GRADIENT SIDEBAR ─────── */
.cv-gradient{display:grid;grid-template-columns:220px 1fr;min-height:1123px}
.grad-aside{padding:28px 18px;display:flex;flex-direction:column}
.grad-photo-wrap{display:flex;justify-content:center;margin-bottom:14px}
.grad-photo{width:86px;height:86px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.35)}
.grad-init{width:86px;height:86px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;color:#fff}
.grad-name{color:#fff;font-size:17px;font-weight:400;text-align:center;line-height:1.2;margin:0 0 4px}
.grad-name strong{font-weight:900}
.grad-title{color:rgba(255,255,255,.75);font-size:11px;text-align:center;margin-bottom:4px}
.grad-dob{color:rgba(255,255,255,.55);font-size:10px;text-align:center;margin-bottom:10px}
.grad-divider{height:1px;background:rgba(255,255,255,.2);margin:12px 0}
.grad-contact-block{display:flex;flex-direction:column;gap:6px}
.grad-contact-item{display:flex;align-items:flex-start;gap:7px;font-size:10.5px;color:rgba(255,255,255,.8)}
.grad-ci-icon{flex-shrink:0;margin-top:1px}
.grad-blk{margin-bottom:12px}
.grad-blk-t{font-size:8.5px;font-weight:900;letter-spacing:1.3px;color:rgba(255,255,255,.45);margin-bottom:7px;text-transform:uppercase}
.grad-lang{display:flex;justify-content:space-between;font-size:10.5px;color:rgba(255,255,255,.8);margin-bottom:3px}
.grad-lang-lvl{color:rgba(255,255,255,.5)}
.grad-interests{display:flex;flex-wrap:wrap;gap:4px}
.grad-interest{font-size:10px;color:rgba(255,255,255,.8);background:rgba(255,255,255,.15);padding:2px 8px;border-radius:99px}
.grad-main{padding:26px 24px;background:#fff}
.grad-sec{margin-bottom:20px}
.grad-sec-t{font-size:10px;font-weight:900;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px}
.grad-sec-bar{height:2.5px;border-radius:99px;margin-bottom:12px}
.grad-txt{font-size:12px;color:#4b5563;line-height:1.75;margin:0}
.grad-skills-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.grad-skill{margin-bottom:4px}
.grad-sk-top{display:flex;justify-content:space-between;margin-bottom:3px}
.grad-sk-name{font-size:11.5px;font-weight:600;color:#374151}
.grad-sk-pct{font-size:10px;font-weight:700}
.grad-sk-track{height:4px;background:#e5e7eb;border-radius:99px;overflow:hidden}
.grad-sk-fill{height:100%;border-radius:99px}
.grad-entry{display:flex;gap:10px;margin-bottom:14px;position:relative;padding-left:18px}
.grad-entry-line{position:absolute;left:5px;top:14px;bottom:-14px;width:1px}
.grad-entry-dot{position:absolute;left:0;top:4px;width:10px;height:10px;border-radius:50%;flex-shrink:0}
.grad-entry-body{flex:1}
.grad-entry-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px;flex-wrap:wrap;gap:4px}
.grad-pos{font-size:12.5px;font-weight:700;color:#111}
.grad-date{font-size:9.5px;font-weight:700;padding:2px 8px;border-radius:99px;white-space:nowrap}
.grad-co{font-size:11px;color:#6b7280;margin-bottom:3px}
.grad-desc{font-size:11.5px;color:#555;line-height:1.6;margin:0}
.grad-proj{margin-bottom:10px;padding:10px;background:#f8fafc;border-radius:7px}
.grad-proj-name{font-size:13px;font-weight:700;color:#111;margin-bottom:4px}
.grad-proj-tech{font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:4px;margin-left:7px}
.grad-bullet-text{color:#555}

/* ─────── 14. COMPACT PRO ─────── */
.cv-compact{display:flex;flex-direction:column;min-height:1123px;background:#fff}
.cp-header{display:flex;gap:16px;align-items:center;padding:20px 28px;border-bottom:3px solid}
.cp-photo-area{flex-shrink:0}
.cp-photo{width:68px;height:68px;border-radius:8px;object-fit:cover}
.cp-init{width:68px;height:68px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900}
.cp-hd-center{flex:1}
.cp-name{font-size:22px;font-weight:400;color:#111;margin:0 0 3px;letter-spacing:-.3px}
.cp-title{font-size:13px;color:#555;margin:0}
.cp-hd-right{display:flex;flex-direction:column;gap:3px;min-width:200px}
.cp-contact-line{font-size:11px;color:#555;display:flex;align-items:center;gap:5px}
.cp-cl-icon{font-size:10px}
.cp-summary-bar{background:#f8fafc;border-bottom:1px solid #e5e7eb;padding:10px 28px}
.cp-summary-txt{font-size:12px;color:#555;line-height:1.65;margin:0}
.cp-body{display:grid;grid-template-columns:1fr 220px;flex:1}
.cp-main{padding:18px 24px}
.cp-aside{padding:18px 16px;background:#f9fafb;border-left:1px solid #e5e7eb}
.cp-sec{margin-bottom:18px}
.cp-sec-t{font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:#fff;padding:3px 8px;border-radius:3px;display:inline-block;margin-bottom:10px}
.cp-entry{display:flex;gap:12px;margin-bottom:14px}
.cp-entry-left{display:flex;flex-direction:column;align-items:flex-end;gap:0;min-width:48px}
.cp-entry-dates{font-size:10px;font-weight:700;text-align:right;line-height:1.4}
.cp-entry-vline{flex:1;border-left:1.5px dashed;margin:4px 0;min-height:8px;align-self:center}
.cp-entry-body{flex:1}
.cp-entry-pos{font-size:12.5px;font-weight:700;color:#111;margin-bottom:2px}
.cp-entry-co{font-size:11px;color:#6b7280;margin-bottom:3px}
.cp-entry-desc{font-size:11.5px;color:#555;line-height:1.6;margin:2px 0 0}
.cp-proj{margin-bottom:10px;padding:8px;background:#fff;border-radius:5px;border:1px solid #e5e7eb}
.cp-proj-name{font-size:12.5px;font-weight:700;color:#111}
.cp-proj-tech{font-size:9.5px;font-weight:600;padding:2px 7px;border-radius:3px;margin-left:7px}
.cp-skill{margin-bottom:7px}
.cp-sk-info{margin-bottom:3px}
.cp-sk-name{font-size:11.5px;font-weight:600;color:#374151}
.cp-sk-track{height:4px;background:#e5e7eb;border-radius:99px;overflow:hidden}
.cp-sk-fill{height:100%;border-radius:99px}
.cp-lang{display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:11.5px}
.cp-lang-lvl{font-size:9.5px;padding:2px 7px;border-radius:99px;font-weight:700}
.cp-interests{display:flex;flex-wrap:wrap;gap:4px}
.cp-interest{padding:3px 9px;border:1.5px solid;border-radius:99px;font-size:10.5px;font-weight:600}
.cp-bullet-text{color:#555}



/* ─────── 15. NEON DARK ─────── */
.cv-neondark{display:flex;flex-direction:column;min-height:1123px;background:#0f172a;color:#e2e8f0;font-family:'DM Sans','Segoe UI',Arial,sans-serif}

.nd-header{position:relative;overflow:hidden;flex-shrink:0}
.nd-header-bg{position:absolute;inset:0;z-index:0}
.nd-header-content{position:relative;z-index:1;display:flex;gap:22px;align-items:center;padding:28px 32px 22px}
.nd-header-line{height:1px;opacity:.6}

.nd-photo-wrap{position:relative;flex-shrink:0}
.nd-photo{width:82px;height:82px;border-radius:50%;object-fit:cover;display:block}
.nd-init{width:82px;height:82px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;background:#1e293b}
.nd-photo-ring{position:absolute;inset:-4px;border-radius:50%;border:1.5px solid;opacity:.5}

.nd-header-text{flex:1}
.nd-name{font-size:26px;font-weight:900;margin:0 0 4px;letter-spacing:-.5px;line-height:1.1}
.nd-name-first{color:#f1f5f9;margin-right:7px}
.nd-title{font-size:12.5px;font-weight:600;margin:0 0 5px;letter-spacing:.5px;text-transform:uppercase}
.nd-dob{font-size:10.5px;color:#64748b;margin-bottom:8px}
.nd-contacts{display:flex;flex-wrap:wrap;gap:5px}
.nd-contact-pill{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;padding:3px 9px;border:1px solid;border-radius:99px;line-height:1}

.nd-body{display:grid;grid-template-columns:210px 1fr;flex:1}

.nd-left{padding:20px 16px;background:#0d1526;border-right:1px solid #1e293b}
.nd-right{padding:20px 24px}

.nd-sec{margin-bottom:20px}
.nd-sec-t{display:flex;align-items:center;gap:7px;font-size:9px;font-weight:900;letter-spacing:1.8px;text-transform:uppercase;margin-bottom:6px}
.nd-sec-icon{width:18px;height:18px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0}
.nd-sec-line{height:1px;margin-bottom:10px;opacity:.4}

.nd-skill{margin-bottom:8px}
.nd-sk-head{display:flex;justify-content:space-between;margin-bottom:3px}
.nd-sk-name{font-size:11.5px;font-weight:600;color:#cbd5e1}
.nd-sk-pct{font-size:9.5px;font-weight:700}
.nd-sk-track{height:3px;background:#1e293b;border-radius:99px;overflow:hidden}
.nd-sk-fill{height:100%;border-radius:99px;transition:width .3s}

.nd-lang{display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid #1e293b}
.nd-lang-name{font-size:11.5px;color:#cbd5e1}
.nd-lang-lvl{font-size:9.5px;font-weight:700;padding:2px 8px;border-radius:99px;border:1px solid}

.nd-interests{display:flex;flex-wrap:wrap;gap:5px}
.nd-interest{font-size:10px;padding:3px 9px;border:1px solid;border-radius:99px;font-weight:500}

.nd-summary{font-size:12px;color:#94a3b8;line-height:1.75;margin:0}

.nd-entry{display:flex;gap:10px;margin-bottom:16px;position:relative;padding-left:20px}
.nd-entry-node{position:absolute;left:0;top:5px;width:8px;height:8px;border-radius:50%;flex-shrink:0;box-shadow:0 0 6px currentColor}
.nd-entry-vline{position:absolute;left:3px;top:14px;bottom:-16px;width:0;border-left:1px dashed}
.nd-entry-body{flex:1}
.nd-entry-top{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:5px;margin-bottom:3px}
.nd-entry-pos{font-size:12.5px;font-weight:700;color:#f1f5f9}
.nd-entry-date{font-size:9.5px;font-weight:700;padding:2px 9px;border-radius:99px;border:1px solid;white-space:nowrap}
.nd-entry-co{font-size:11px;font-weight:600;margin-bottom:5px;letter-spacing:.3px}
.nd-entry-desc{font-size:11.5px;color:#64748b;line-height:1.65;margin:0}

.nd-bullets{display:flex;flex-direction:column;gap:4px;margin-top:3px}
.nd-bullet-line{display:flex;align-items:flex-start;gap:7px}
.nd-bullet-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:5px}
.nd-bullet-text{font-size:11.5px;color:#64748b;line-height:1.55}

.nd-proj{margin-bottom:12px;padding:10px 12px;background:#1e293b;border-radius:7px;border-left:2px solid}
.nd-proj-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px}
.nd-proj-name{font-size:12.5px;font-weight:700;color:#f1f5f9}
.nd-proj-tech{font-size:9.5px;font-weight:700;padding:2px 8px;border-radius:4px;border:1px solid}




</style>