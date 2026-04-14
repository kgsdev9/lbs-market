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
            <a v-if="cv.website" :href="addHttp(cv.website)" target="_blank" class="cv-link-white">🔗 {{ cv.website }}</a>
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
              <div class="cc-eb">
                <div class="cc-et">
                  <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="cc-pos cv-link-accent" :style="{color:accentColor}">{{ p.name }}</a>
                  <span v-else class="cc-pos">{{ p.name }}</span>
                  <span v-if="p.tech" class="cc-tech">{{ p.tech }}</span>
                </div>
                <p v-if="p.description" class="cc-txt cc-desc">{{ p.description }}</p>
              </div>
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
        <div class="cm-contacts">
          <span v-if="cv.email">{{ cv.email }}</span>
          <span v-if="cv.phone">{{ cv.phone }}</span>
          <span v-if="cv.city">{{ cv.city }}{{ cv.country ? ', ' + cv.country : '' }}</span>
          <a v-if="cv.website" :href="addHttp(cv.website)" target="_blank" class="cv-link-muted">{{ cv.website }}</a>
        </div>
      </div>
      <div class="cm-div" :style="{background:accentColor}"></div>
      <p v-if="cv.summary" class="cm-summary">{{ cv.summary }}</p>
      <div v-if="cv.experiences.some(e=>e.position)" class="cm-sec">
        <div class="cm-sec-t" :style="{borderBottomColor:accentColor}">EXPÉRIENCES</div>
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
      <div v-if="cv.education.some(e=>e.degree)" class="cm-sec">
        <div class="cm-sec-t" :style="{borderBottomColor:accentColor}">FORMATION</div>
        <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="cm-entry">
          <div class="cm-el"><div class="cm-date">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+'–'+e.anneeFin : e.year }}</div></div>
          <div class="cm-er"><div class="cm-pos">{{ e.degree }}</div><div class="cm-co">{{ e.school }}</div></div>
        </div>
      </div>
      <div v-if="cv.skills.some(s=>s.name)" class="cm-sec">
        <div class="cm-sec-t" :style="{borderBottomColor:accentColor}">COMPÉTENCES</div>
        <div class="cm-tags"><span v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="cm-tag" :style="{borderColor:accentColor,color:accentColor}">{{ s.name }}</span></div>
      </div>
      <div v-if="cv.languages.some(l=>l.name)" class="cm-sec">
        <div class="cm-sec-t" :style="{borderBottomColor:accentColor}">LANGUES</div>
        <div class="cm-lang-grid">
          <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="cm-lang-item">
            <div class="cm-lang-top"><span class="cm-lang-name">{{ l.name }}</span><span class="cm-lang-lvl" :style="{color:accentColor}">{{ l.level }}</span></div>
            <div class="cm-lang-bar-bg"><div class="cm-lang-bar-fill" :style="{background:accentColor,width:l.level==='Notions'?'20%':l.level==='Débutant'?'30%':l.level==='Intermédiaire'?'55%':l.level==='Avancé'?'75%':l.level==='Courant'?'85%':l.level==='Bilingue'||l.level==='Natif'?'100%':'60%'}"></div></div>
          </div>
        </div>
      </div>
      <div v-if="cv.aptitudes.some(a=>a.name)" class="cm-sec">
        <div class="cm-sec-t" :style="{borderBottomColor:accentColor}">APTITUDES</div>
        <div class="cm-aptitudes-grid">
          <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="cm-aptitude-item">
            <div class="cm-apt-top"><span class="cm-apt-name">{{ a.name }}</span></div>
            <div class="cm-lang-bar-bg"><div class="cm-lang-bar-fill" :style="{background:'#f59e0b',width:(a.level*25)+'%'}"></div></div>
          </div>
        </div>
      </div>
      <div v-if="cv.centresInteret.some(c=>c.name)" class="cm-sec">
        <div class="cm-sec-t" :style="{borderBottomColor:accentColor}">CENTRES D'INTÉRÊT</div>
        <div class="cm-tags"><span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="cm-tag" :style="{borderColor:'#9ca3af',color:'#6b7280'}">{{ c.name }}</span></div>
      </div>
      <div v-if="cv.projects.some(p=>p.name)" class="cm-sec">
        <div class="cm-sec-t" :style="{borderBottomColor:accentColor}">PROJETS</div>
        <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="cm-entry">
          <div class="cm-el"><div class="cm-date" style="font-size:11px">{{ p.tech }}</div></div>
          <div class="cm-er">
            <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="cm-pos cv-link-accent" :style="{color:accentColor}">{{ p.name }}</a>
            <div v-else class="cm-pos">{{ p.name }}</div>
            <p v-if="p.description" class="cm-desc">{{ p.description }}</p>
          </div>
        </div>
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
          <a v-if="cv.website" :href="addHttp(cv.website)" target="_blank" class="cmod-item cv-link-white">🔗 {{ cv.website }}</a>
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
          <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="cmod-entry">
            <div class="cmod-dot-b" :style="{background:accentColor}"></div>
            <div class="cmod-eb">
              <div class="cmod-et"><span class="cmod-pos">{{ e.position }}</span><span class="cmod-date">{{ e.startDate }} – {{ e.endDate||'Présent' }}</span></div>
              <div class="cmod-co">{{ e.company }}</div>
              <div v-if="hasBullets(e)" class="cmod-bullets"><div v-for="(b,bi) in getBullets(e)" :key="bi" class="cmod-bullet-line"><span class="cmod-bullet-dot" :style="{background:accentColor}"></span><span class="cmod-bullet-text">{{ b }}</span></div></div>
              <p v-else-if="e.description" class="cmod-desc">{{ e.description }}</p>
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
          <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="cmod-proj">
            <div class="cmod-proj-hd">
              <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="cmod-pos cv-link-accent" :style="{color:accentColor}">{{ p.name }}</a>
              <span v-else class="cmod-pos">{{ p.name }}</span>
              <span v-if="p.tech" class="cmod-tech">{{ p.tech }}</span>
            </div>
            <p v-if="p.description" class="cmod-desc">{{ p.description }}</p>
          </div>
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
            <a v-if="cv.website" :href="addHttp(cv.website)" target="_blank" class="cv-link-muted">{{ cv.website }}</a>
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
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="corp-entry">
              <div class="corp-et"><span class="corp-ep">{{ e.position }}</span><span class="corp-ed" :style="{background:accentColor+'18',color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div>
              <div class="corp-eco">{{ e.company }}</div>
              <div v-if="hasBullets(e)" class="corp-bullets"><div v-for="(b,bi) in getBullets(e)" :key="bi" class="corp-bullet-line"><span class="corp-bullet-dot" :style="{background:accentColor}"></span><span class="corp-bullet-text">{{ b }}</span></div></div>
              <p v-else-if="e.description" class="corp-txt" style="margin-top:3px">{{ e.description }}</p>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="corp-sec"><div class="corp-sec-t" :style="{borderColor:accentColor,color:accentColor}">FORMATION</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="corp-entry">
              <div class="corp-et"><span class="corp-ep">{{ e.degree }}</span><span class="corp-ed" :style="{background:accentColor+'18',color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</span></div>
              <div class="corp-eco">{{ e.school }}</div>
            </div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="corp-sec"><div class="corp-sec-t" :style="{borderColor:accentColor,color:accentColor}">APTITUDES</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="corp-skill">
              <div class="corp-sk-lbl">{{ a.name }}</div>
              <div class="corp-sk-track"><div class="corp-sk-fill" :style="{width:(a.level*25)+'%',background:'#f59e0b'}"></div></div>
            </div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="corp-sec"><div class="corp-sec-t" :style="{borderColor:accentColor,color:accentColor}">PROJETS</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="corp-entry">
              <div class="corp-et">
                <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="corp-ep cv-link-accent" :style="{color:accentColor}">{{ p.name }}</a>
                <span v-else class="corp-ep">{{ p.name }}</span>
              </div>
              <p v-if="p.description" class="corp-txt" style="margin-top:3px">{{ p.description }}</p>
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
            <a v-if="cv.website" :href="addHttp(cv.website)" target="_blank" class="cv-link-muted">🔗 {{ cv.website }}</a>
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
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="eleg-entry">
              <div class="eleg-marker" :style="{background:accentColor}"></div>
              <div>
                <div class="eleg-et"><span class="eleg-pos">{{ e.position }}</span><span class="eleg-date">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div>
                <div class="eleg-co">{{ e.company }}</div>
                <div v-if="hasBullets(e)" class="eleg-bullets"><div v-for="(b,bi) in getBullets(e)" :key="bi" class="eleg-bullet-line"><span class="eleg-bullet-dot" :style="{background:accentColor}"></span><span class="eleg-bullet-text">{{ b }}</span></div></div>
                <p v-else-if="e.description" class="eleg-desc">{{ e.description }}</p>
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
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="eleg-skill">
              <span class="eleg-sk-n">{{ a.name }}</span>
              <div class="eleg-dots"><span v-for="d in 4" :key="d" class="eleg-dot" :style="{background:d<=a.level?'#f59e0b':'#e5e7eb'}"></span></div>
            </div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="eleg-sec"><div class="eleg-sec-t" :style="{color:accentColor}">PROJETS</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="eleg-proj">
              <div class="eleg-proj-n">
                <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="cv-link-accent" :style="{color:accentColor}">{{ p.name }}</a>
                <span v-else>{{ p.name }}</span>
                <span v-if="p.tech" class="eleg-proj-tech">{{ p.tech }}</span>
              </div>
              <p v-if="p.description" class="eleg-desc">{{ p.description }}</p>
            </div>
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
            <a v-if="cv.website" :href="addHttp(cv.website)" target="_blank" class="cv-link-accent" :style="{color:accentColor}">{{ cv.website }}</a>
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
            <div class="dk-interests"><span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="dk-interest" :style="{background:accentColor+'22',color:accentColor}">{{ c.name }}</span></div>
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
                <div v-if="hasBullets(e)" class="dk-bullets"><div v-for="(b,bi) in getBullets(e)" :key="bi" class="dk-bullet-line"><span class="dk-bullet-dot" :style="{background:accentColor}"></span><span class="dk-bullet-text">{{ b }}</span></div></div>
                <p v-else-if="e.description" class="dk-txt dk-desc">{{ e.description }}</p>
              </div>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">FORMATION</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="dk-entry">
              <div class="dk-entry-dot" :style="{background:accentColor}"></div>
              <div><div class="dk-et"><span class="dk-pos">{{ e.degree }}</span><span class="dk-date" :style="{color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</span></div><div class="dk-co">{{ e.school }}</div></div>
            </div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="dk-sec"><div class="dk-sec-t" :style="{color:accentColor}">PROJETS</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="dk-proj">
              <div class="dk-proj-n">
                <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="cv-link-accent" :style="{color:accentColor}">{{ p.name }}</a>
                <span v-else>{{ p.name }}</span>
                <span v-if="p.tech" class="dk-tech" :style="{background:accentColor+'22',color:accentColor}">{{ p.tech }}</span>
              </div>
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
        <div class="tl-contacts">
          <span v-if="cv.email">✉ {{ cv.email }}</span><span v-if="cv.phone">📞 {{ cv.phone }}</span>
          <span v-if="cv.city">📍 {{ cv.city }}{{ cv.country?', '+cv.country:'' }}</span>
          <a v-if="cv.website" :href="addHttp(cv.website)" target="_blank" class="cv-link-muted">🔗 {{ cv.website }}</a>
        </div>
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
            <div class="tl-interests"><span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="tl-interest" :style="{background:accentColor+'15',color:accentColor}">{{ c.name }}</span></div>
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
                <div v-if="hasBullets(e)" class="tl-bullets"><div v-for="(b,bi) in getBullets(e)" :key="bi" class="tl-bullet-line"><span class="tl-bullet-dot" :style="{background:accentColor}"></span><span class="tl-bullet-text">{{ b }}</span></div></div>
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
          <div v-if="cv.projects.some(p=>p.name)" class="tl-sec"><div class="tl-sec-t" :style="{color:accentColor}">PROJETS</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="tl-item">
              <div class="tl-node" :style="{background:accentColor}"></div>
              <div class="tl-content">
                <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="tl-pos cv-link-accent" :style="{color:accentColor}">{{ p.name }}</a>
                <div v-else class="tl-pos">{{ p.name }}</div>
                <p v-if="p.description" class="tl-desc">{{ p.description }}</p>
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
            <a v-if="cv.website" :href="addHttp(cv.website)" target="_blank" class="cv-link-muted">{{ cv.website }}</a>
          </div>
        </div>
      </div>
      <div class="sw-divider" :style="{background:accentColor+'40'}"></div>
      <div class="sw-body">
        <div class="sw-left">
          <div v-if="cv.skills.some(s=>s.name)" class="sw-sec"><div class="sw-sec-t" :style="{color:accentColor}">COMPÉTENCES</div>
            <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="sw-skill"><span class="sw-sk-name">{{ s.name }}</span><div class="sw-sk-bar"><div :style="{width:(s.level*25)+'%',background:accentColor}" class="sw-sk-fill"></div></div></div>
          </div>
          <div v-if="cv.languages.some(l=>l.name)" class="sw-sec"><div class="sw-sec-t" :style="{color:accentColor}">LANGUES</div>
            <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="sw-lang"><span>{{ l.name }}</span><span class="sw-lang-lvl">{{ l.level }}</span></div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="sw-sec"><div class="sw-sec-t" :style="{color:accentColor}">FORMATION</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="sw-edu">
              <div class="sw-edu-year" :style="{color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+'–'+e.anneeFin : e.year }}</div>
              <div><div class="sw-edu-deg">{{ e.degree }}</div><div class="sw-edu-school">{{ e.school }}</div></div>
            </div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="sw-sec"><div class="sw-sec-t" :style="{color:accentColor}">INTÉRÊTS</div>
            <div class="sw-interests"><span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="sw-interest" :style="{color:accentColor}">{{ c.name }}</span></div>
          </div>
        </div>
        <div class="sw-right">
          <div v-if="cv.summary" class="sw-sec sw-profile"><p class="sw-summary">{{ cv.summary }}</p></div>
          <div v-if="cv.experiences.some(e=>e.position)" class="sw-sec"><div class="sw-sec-t" :style="{color:accentColor}">EXPÉRIENCES</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="sw-exp">
              <div class="sw-exp-head"><div><div class="sw-exp-pos">{{ e.position }}</div><div class="sw-exp-co">{{ e.company }}</div></div><div class="sw-exp-date" :style="{color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</div></div>
              <div v-if="hasBullets(e)" class="sw-bullets"><div v-for="(b,bi) in getBullets(e)" :key="bi" class="sw-bullet-line"><span class="sw-bullet-dot" :style="{background:accentColor}"></span><span class="sw-bullet-text">{{ b }}</span></div></div>
              <p v-else-if="e.description" class="sw-exp-desc">{{ e.description }}</p>
            </div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="sw-sec"><div class="sw-sec-t" :style="{color:accentColor}">APTITUDES</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="sw-skill"><span class="sw-sk-name">{{ a.name }}</span><div class="sw-sk-bar"><div :style="{width:(a.level*25)+'%',background:'#f59e0b'}" class="sw-sk-fill"></div></div></div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="sw-sec"><div class="sw-sec-t" :style="{color:accentColor}">PROJETS</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="sw-exp">
              <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="sw-exp-pos cv-link-accent" :style="{color:accentColor}">{{ p.name }}</a>
              <div v-else class="sw-exp-pos">{{ p.name }}</div>
              <p v-if="p.description" class="sw-exp-desc">{{ p.description }}</p>
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
            <h1 class="cr-name">{{ cv.firstName||'Prénom' }} <strong>{{ cv.lastName||'Nom' }}</strong></h1>
            <p class="cr-title-badge">{{ cv.title }}</p>
            <p v-if="cv.dateNaissance" style="font-size:12px;color:rgba(255,255,255,.7);margin:4px 0 0">🎂 {{ formatDate(cv.dateNaissance) }}</p>
          </div>
        </div>
        <div class="cr-hero-wave"></div>
      </div>
      <div class="cr-contacts-bar">
        <span v-if="cv.email">✉ {{ cv.email }}</span><span v-if="cv.phone">📞 {{ cv.phone }}</span>
        <span v-if="cv.city">📍 {{ cv.city }}{{ cv.country?', '+cv.country:'' }}</span>
        <a v-if="cv.website" :href="addHttp(cv.website)" target="_blank" class="cv-link-muted">🔗 {{ cv.website }}</a>
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
              <div style="display:flex;gap:2px"><span v-for="d in 4" :key="d" :style="{width:'9px',height:'9px',borderRadius:'50%',background:d<=a.level?'#f59e0b':'#e5e7eb',display:'inline-block'}"></span></div>
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
                <div v-if="hasBullets(e)" class="cr-bullets"><div v-for="(b,bi) in getBullets(e)" :key="bi" class="cr-bullet-line"><span class="cr-bullet-dot" :style="{background:accentColor}"></span><span class="cr-bullet-text">{{ b }}</span></div></div>
                <p v-else-if="e.description" class="cr-exp-desc">{{ e.description }}</p>
              </div>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="cr-sec"><div class="cr-sec-t" :style="{background:accentColor}">FORMATION</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="cr-exp">
              <div class="cr-exp-dot" :style="{background:accentColor}"></div>
              <div class="cr-exp-body"><div class="cr-exp-pos">{{ e.degree }}</div><div class="cr-exp-co">{{ e.school }} · {{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</div></div>
            </div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="cr-sec"><div class="cr-sec-t" :style="{background:accentColor}">PROJETS</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="cr-proj" :style="{borderLeftColor:accentColor}">
              <div class="cr-proj-name">
                <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="cv-link-accent" :style="{color:accentColor}">{{ p.name }}</a>
                <span v-else>{{ p.name }}</span>
                <span v-if="p.tech" class="cr-proj-tech">{{ p.tech }}</span>
              </div>
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
              <a v-if="cv.website" :href="addHttp(cv.website)" target="_blank" class="cv-link-accent" :style="{color:accentColor}"><span :style="{color:accentColor}">web:</span> {{ cv.website }}</a>
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
              <div class="tk-edu-deg">{{ e.degree }}</div><div class="tk-edu-school">{{ e.school }}</div>
            </div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="tk-sec"><div class="tk-sec-t" :style="{color:accentColor}">// intérêts</div>
            <div class="tk-interests"><span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="tk-interest" :style="{background:accentColor+'22',color:accentColor}">{{ c.name }}</span></div>
          </div>
        </div>
        <div class="tk-right">
          <div v-if="cv.summary" class="tk-sec"><div class="tk-sec-t" :style="{color:accentColor}">// about</div><p class="tk-summary">{{ cv.summary }}</p></div>
          <div v-if="cv.experiences.some(e=>e.position)" class="tk-sec"><div class="tk-sec-t" :style="{color:accentColor}">// experience</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="tk-exp">
              <div class="tk-exp-head"><span class="tk-exp-pos">{{ e.position }}</span><span class="tk-exp-date" :style="{color:accentColor}">{{ e.startDate }}{{ e.endDate?' → '+e.endDate:'' }}</span></div>
              <div class="tk-exp-co">@{{ e.company }}</div>
              <div v-if="hasBullets(e)" class="tk-bullets"><div v-for="(b,bi) in getBullets(e)" :key="bi" class="tk-bullet-line"><span class="tk-bullet-dot" :style="{background:accentColor}"></span><span class="tk-bullet-text">{{ b }}</span></div></div>
              <p v-else-if="e.description" class="tk-exp-desc">{{ e.description }}</p>
            </div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="tk-sec"><div class="tk-sec-t" :style="{color:accentColor}">// aptitudes</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="tk-skill"><span class="tk-sk-name">{{ a.name }}</span><div class="tk-sk-bar"><div :style="{width:(a.level*25)+'%',background:'#f59e0b'}" class="tk-sk-fill"></div></div></div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="tk-sec"><div class="tk-sec-t" :style="{color:accentColor}">// projects</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="tk-proj">
              <div class="tk-proj-head">
                <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="tk-proj-name cv-link-accent" :style="{color:accentColor}">{{ p.name }}</a>
                <span v-else class="tk-proj-name">{{ p.name }}</span>
                <span v-if="p.tech" class="tk-proj-tech" :style="{background:accentColor+'22',color:accentColor}">{{ p.tech }}</span>
              </div>
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
            <a v-if="cv.website" :href="addHttp(cv.website)" target="_blank" class="cv-link-muted">{{ cv.website }}</a>
            <span v-if="cv.dateNaissance">Né(e) le {{ formatDate(cv.dateNaissance) }}</span>
          </div>
        </div>
      </div>
      <div class="acad-divider"><div class="acad-div-line" :style="{background:accentColor}"></div></div>
      <div class="acad-body">
        <div class="acad-main">
          <div v-if="cv.summary" class="acad-sec"><div class="acad-sec-t" :style="{color:accentColor,borderBottomColor:accentColor+'33'}">Résumé</div><p class="acad-txt">{{ cv.summary }}</p></div>
          <div v-if="cv.education.some(e=>e.degree)" class="acad-sec"><div class="acad-sec-t" :style="{color:accentColor,borderBottomColor:accentColor+'33'}">Formation Académique</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="acad-entry">
              <div class="acad-entry-year" :style="{color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+'–'+e.anneeFin : e.year }}</div>
              <div class="acad-entry-body"><div class="acad-degree">{{ e.degree }}</div><div class="acad-school">{{ e.school }}</div></div>
            </div>
          </div>
          <div v-if="cv.experiences.some(e=>e.position)" class="acad-sec"><div class="acad-sec-t" :style="{color:accentColor,borderBottomColor:accentColor+'33'}">Expériences</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="acad-entry">
              <div class="acad-entry-year" :style="{color:accentColor}">{{ e.startDate }}<br/>{{ e.endDate }}</div>
              <div class="acad-entry-body">
                <div class="acad-degree">{{ e.position }}</div><div class="acad-school">{{ e.company }}</div>
                <div v-if="hasBullets(e)" class="acad-bullets"><div v-for="(b,bi) in getBullets(e)" :key="bi" class="acad-bullet-line"><span class="acad-bullet-dot" :style="{background:accentColor}"></span><span class="acad-bullet-text">{{ b }}</span></div></div>
                <p v-else-if="e.description" class="acad-desc">{{ e.description }}</p>
              </div>
            </div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="acad-sec"><div class="acad-sec-t" :style="{color:accentColor,borderBottomColor:accentColor+'33'}">Publications / Projets</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="acad-pub">
              <div class="acad-pub-bullet" :style="{background:accentColor}"></div>
              <div>
                <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="cv-link-accent" :style="{color:accentColor}"><strong>{{ p.name }}</strong></a>
                <strong v-else>{{ p.name }}</strong>
                <span v-if="p.tech" class="acad-pub-tech"> · {{ p.tech }}</span>
                <p v-if="p.description" class="acad-desc">{{ p.description }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="acad-aside">
          <div v-if="cv.skills.some(s=>s.name)" class="acad-sec"><div class="acad-sec-t" :style="{color:accentColor,borderBottomColor:accentColor+'33'}">Compétences</div>
            <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="acad-skill"><span class="acad-skill-name">{{ s.name }}</span><div class="acad-skill-dots"><span v-for="d in 4" :key="d" :style="{background:d<=s.level?accentColor:'#e5e7eb',width:'8px',height:'8px',borderRadius:'50%',display:'inline-block',margin:'0 1px'}"></span></div></div>
          </div>
          <div v-if="cv.languages.some(l=>l.name)" class="acad-sec"><div class="acad-sec-t" :style="{color:accentColor,borderBottomColor:accentColor+'33'}">Langues</div>
            <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="acad-lang"><span>{{ l.name }}</span><span class="acad-lang-lvl">{{ l.level }}</span></div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="acad-sec"><div class="acad-sec-t" :style="{color:accentColor,borderBottomColor:accentColor+'33'}">Intérêts</div>
            <div class="acad-interests"><span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="acad-interest" :style="{borderColor:accentColor+'55',color:accentColor}">{{ c.name }}</span></div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="acad-sec"><div class="acad-sec-t" :style="{color:accentColor,borderBottomColor:accentColor+'33'}">Aptitudes</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="acad-skill"><span class="acad-skill-name">{{ a.name }}</span><div class="acad-skill-dots"><span v-for="d in 4" :key="d" :style="{background:d<=a.level?'#f59e0b':'#e5e7eb',width:'8px',height:'8px',borderRadius:'50%',display:'inline-block',margin:'0 1px'}"></span></div></div>
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
          <span v-if="cv.website" class="lux-sep" :style="{color:accentColor}">◆</span>
          <a v-if="cv.website" :href="addHttp(cv.website)" target="_blank" class="cv-link-accent" :style="{color:accentColor}">{{ cv.website }}</a>
        </div>
        <div v-if="cv.dateNaissance" class="lux-dob">Né(e) le {{ formatDate(cv.dateNaissance) }}</div>
      </div>
      <div class="lux-body">
        <div class="lux-left">
          <div v-if="cv.skills.some(s=>s.name)" class="lux-sec"><div class="lux-sec-t" :style="{color:accentColor}">COMPÉTENCES</div>
            <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="lux-skill"><span class="lux-skill-name">{{ s.name }}</span><div class="lux-diamonds"><span v-for="d in 4" :key="d" :style="{color:d<=s.level?accentColor:'#d1d5db',fontSize:'11px'}">◆</span></div></div>
          </div>
          <div v-if="cv.languages.some(l=>l.name)" class="lux-sec"><div class="lux-sec-t" :style="{color:accentColor}">LANGUES</div>
            <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="lux-lang"><span>{{ l.name }}</span><span class="lux-lang-lvl" :style="{color:accentColor}">{{ l.level }}</span></div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="lux-sec"><div class="lux-sec-t" :style="{color:accentColor}">INTÉRÊTS</div>
            <div v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="lux-interest"><span :style="{color:accentColor}">◆</span> {{ c.name }}</div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="lux-sec"><div class="lux-sec-t" :style="{color:accentColor}">APTITUDES</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="lux-skill"><span class="lux-skill-name">{{ a.name }}</span><div class="lux-diamonds"><span v-for="d in 4" :key="d" :style="{color:d<=a.level?'#f59e0b':'#d1d5db',fontSize:'11px'}">◆</span></div></div>
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
                <div v-if="hasBullets(e)" class="lux-bullets"><div v-for="(b,bi) in getBullets(e)" :key="bi" class="lux-bullet-line"><span :style="{color:accentColor,fontSize:'11px'}">◆</span><span class="lux-bullet-text">{{ b }}</span></div></div>
                <p v-else-if="e.description" class="lux-desc">{{ e.description }}</p>
              </div>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="lux-sec"><div class="lux-sec-t" :style="{color:accentColor}">FORMATION</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="lux-entry">
              <div class="lux-entry-marker" :style="{background:accentColor}"></div>
              <div class="lux-entry-body"><div class="lux-pos">{{ e.degree }}</div><div class="lux-co">{{ e.school }} · {{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</div></div>
            </div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="lux-sec"><div class="lux-sec-t" :style="{color:accentColor}">PROJETS</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="lux-proj">
              <div class="lux-proj-name">
                <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="cv-link-accent" :style="{color:accentColor}">{{ p.name }}</a>
                <span v-else>{{ p.name }}</span>
                <span v-if="p.tech" class="lux-tech">{{ p.tech }}</span>
              </div>
              <p v-if="p.description" class="lux-desc">{{ p.description }}</p>
            </div>
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
          <div v-if="cv.website" class="grad-contact-item"><span class="grad-ci-icon">🔗</span><a :href="addHttp(cv.website)" target="_blank" class="cv-link-white">{{ cv.website }}</a></div>
        </div>
        <div class="grad-divider"></div>
        <div v-if="cv.languages.some(l=>l.name)" class="grad-blk"><div class="grad-blk-t">LANGUES</div>
          <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="grad-lang"><span>{{ l.name }}</span><span class="grad-lang-lvl">{{ l.level }}</span></div>
        </div>
        <div v-if="cv.centresInteret.some(c=>c.name)" class="grad-blk"><div class="grad-blk-t">INTÉRÊTS</div>
          <div class="grad-interests"><span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="grad-interest">{{ c.name }}</span></div>
        </div>
      </div>
      <div class="grad-main">
        <div v-if="cv.summary" class="grad-sec"><div class="grad-sec-t" :style="{color:accentColor}">À PROPOS</div><div class="grad-sec-bar" :style="{background:accentColor}"></div><p class="grad-txt">{{ cv.summary }}</p></div>
        <div v-if="cv.skills.some(s=>s.name)" class="grad-sec"><div class="grad-sec-t" :style="{color:accentColor}">COMPÉTENCES</div><div class="grad-sec-bar" :style="{background:accentColor}"></div>
          <div class="grad-skills-grid"><div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="grad-skill"><div class="grad-sk-top"><span class="grad-sk-name">{{ s.name }}</span><span class="grad-sk-pct" :style="{color:accentColor}">{{ s.level*25 }}%</span></div><div class="grad-sk-track"><div :style="{width:(s.level*25)+'%',background:accentColor}" class="grad-sk-fill"></div></div></div></div>
        </div>
        <div v-if="cv.experiences.some(e=>e.position)" class="grad-sec"><div class="grad-sec-t" :style="{color:accentColor}">EXPÉRIENCES</div><div class="grad-sec-bar" :style="{background:accentColor}"></div>
          <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="grad-entry">
            <div class="grad-entry-line" :style="{background:accentColor+'44'}"></div>
            <div class="grad-entry-dot" :style="{background:accentColor}"></div>
            <div class="grad-entry-body">
              <div class="grad-entry-top"><span class="grad-pos">{{ e.position }}</span><span class="grad-date" :style="{background:accentColor+'15',color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div>
              <div class="grad-co">{{ e.company }}</div>
              <div v-if="hasBullets(e)" class="grad-bullets"><div v-for="(b,bi) in getBullets(e)" :key="bi" class="grad-bullet-line"><span class="grad-bullet-dot" :style="{background:accentColor}"></span><span class="grad-bullet-text">{{ b }}</span></div></div>
              <p v-else-if="e.description" class="grad-desc">{{ e.description }}</p>
            </div>
          </div>
        </div>
        <div v-if="cv.education.some(e=>e.degree)" class="grad-sec"><div class="grad-sec-t" :style="{color:accentColor}">FORMATION</div><div class="grad-sec-bar" :style="{background:accentColor}"></div>
          <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="grad-entry">
            <div class="grad-entry-dot" :style="{background:accentColor}"></div>
            <div class="grad-entry-body"><div class="grad-entry-top"><span class="grad-pos">{{ e.degree }}</span><span class="grad-date" :style="{background:accentColor+'15',color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</span></div><div class="grad-co">{{ e.school }}</div></div>
          </div>
        </div>
        <div v-if="cv.aptitudes.some(a=>a.name)" class="grad-sec"><div class="grad-sec-t" :style="{color:accentColor}">APTITUDES</div><div class="grad-sec-bar" :style="{background:accentColor}"></div>
          <div class="grad-skills-grid"><div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="grad-skill"><div class="grad-sk-top"><span class="grad-sk-name">{{ a.name }}</span></div><div class="grad-sk-track"><div :style="{width:(a.level*25)+'%',background:'#f59e0b'}" class="grad-sk-fill"></div></div></div></div>
        </div>
        <div v-if="cv.projects.some(p=>p.name)" class="grad-sec"><div class="grad-sec-t" :style="{color:accentColor}">PROJETS</div><div class="grad-sec-bar" :style="{background:accentColor}"></div>
          <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="grad-proj">
            <div class="grad-proj-name">
              <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="cv-link-accent" :style="{color:accentColor}">{{ p.name }}</a>
              <span v-else>{{ p.name }}</span>
              <span v-if="p.tech" class="grad-proj-tech" :style="{background:accentColor+'15',color:accentColor}">{{ p.tech }}</span>
            </div>
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
          <div v-if="cv.website" class="cp-contact-line"><span class="cp-cl-icon" :style="{color:accentColor}">🔗</span> <a :href="addHttp(cv.website)" target="_blank" class="cv-link-muted">{{ cv.website }}</a></div>
        </div>
      </div>
      <div v-if="cv.summary" class="cp-summary-bar"><p class="cp-summary-txt">{{ cv.summary }}</p></div>
      <div class="cp-body">
        <div class="cp-main">
          <div v-if="cv.experiences.some(e=>e.position)" class="cp-sec"><div class="cp-sec-t" :style="{background:accentColor}">EXPÉRIENCES</div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="cp-entry">
              <div class="cp-entry-left"><div class="cp-entry-dates" :style="{color:accentColor}">{{ e.startDate }}<br/>{{ e.endDate }}</div><div class="cp-entry-vline" :style="{borderColor:accentColor+'44'}"></div></div>
              <div class="cp-entry-body">
                <div class="cp-entry-pos">{{ e.position }}</div><div class="cp-entry-co">{{ e.company }}</div>
                <div v-if="hasBullets(e)" class="cp-bullets"><div v-for="(b,bi) in getBullets(e)" :key="bi" class="cp-bullet-line"><span class="cp-bullet-dot" :style="{background:accentColor}"></span><span class="cp-bullet-text">{{ b }}</span></div></div>
                <p v-else-if="e.description" class="cp-entry-desc">{{ e.description }}</p>
              </div>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="cp-sec"><div class="cp-sec-t" :style="{background:accentColor}">FORMATION</div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="cp-entry">
              <div class="cp-entry-left"><div class="cp-entry-dates" :style="{color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+'–'+e.anneeFin : e.year }}</div><div class="cp-entry-vline" :style="{borderColor:accentColor+'44'}"></div></div>
              <div class="cp-entry-body"><div class="cp-entry-pos">{{ e.degree }}</div><div class="cp-entry-co">{{ e.school }}</div></div>
            </div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="cp-sec"><div class="cp-sec-t" :style="{background:accentColor}">PROJETS</div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="cp-proj">
              <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="cp-proj-name cv-link-accent" :style="{color:accentColor}">{{ p.name }}</a>
              <span v-else class="cp-proj-name">{{ p.name }}</span>
              <span v-if="p.tech" class="cp-proj-tech" :style="{background:accentColor+'15',color:accentColor}">{{ p.tech }}</span>
              <p v-if="p.description" class="cp-entry-desc">{{ p.description }}</p>
            </div>
          </div>
        </div>
        <div class="cp-aside">
          <div v-if="cv.skills.some(s=>s.name)" class="cp-sec"><div class="cp-sec-t" :style="{background:accentColor}">COMPÉTENCES</div>
            <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="cp-skill"><div class="cp-sk-info"><span class="cp-sk-name">{{ s.name }}</span></div><div class="cp-sk-track"><div :style="{width:(s.level*25)+'%',background:accentColor}" class="cp-sk-fill"></div></div></div>
          </div>
          <div v-if="cv.languages.some(l=>l.name)" class="cp-sec"><div class="cp-sec-t" :style="{background:accentColor}">LANGUES</div>
            <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="cp-lang"><span>{{ l.name }}</span><span class="cp-lang-lvl" :style="{background:accentColor+'22',color:accentColor}">{{ l.level }}</span></div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="cp-sec"><div class="cp-sec-t" :style="{background:accentColor}">APTITUDES</div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="cp-skill"><div class="cp-sk-info"><span class="cp-sk-name">{{ a.name }}</span></div><div class="cp-sk-track"><div :style="{width:(a.level*25)+'%',background:'#f59e0b'}" class="cp-sk-fill"></div></div></div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="cp-sec"><div class="cp-sec-t" :style="{background:accentColor}">INTÉRÊTS</div>
            <div class="cp-interests"><span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="cp-interest" :style="{borderColor:accentColor,color:accentColor}">{{ c.name }}</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         15. EXECUTIVE
    ══════════════════════════════════════════ -->
    <div v-if="selectedTpl==='executive'" class="cv-executive">
      <div class="ex-hd" style="background:#2d3f50">
        <div class="ex-photo-wrap" v-if="cv.photo"><img :src="cv.photo" class="ex-photo" @error="e=>e.target.style.display='none'"/></div>
        <div class="ex-hd-text">
          <h1 class="ex-name"><span class="ex-name-first" :style="{color:accentColor}">{{ cv.firstName||'Prénom' }}</span>&nbsp;<span class="ex-name-last">{{ cv.lastName||'Nom' }}</span></h1>
          <p class="ex-title">{{ cv.title||'Votre titre' }}</p>
          <div v-if="cv.dateNaissance" class="ex-dob">Né(e) le {{ formatDate(cv.dateNaissance) }}</div>
        </div>
      </div>
      <div class="ex-accent-bar" :style="{background:accentColor}"></div>
      <div class="ex-body">
        <div class="ex-left">
          <div class="ex-sec">
            <div class="ex-sec-t" :style="{color:accentColor}">Contact</div>
            <div class="ex-sec-line" :style="{background:accentColor}"></div>
            <div v-if="cv.phone" class="ex-contact-item"><div class="ex-ci-icon" :style="{background:accentColor}"><svg viewBox="0 0 24 24" width="12" height="12" fill="#fff"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg></div><span>{{ cv.phone }}</span></div>
            <div v-if="cv.email" class="ex-contact-item"><div class="ex-ci-icon" :style="{background:accentColor}"><svg viewBox="0 0 24 24" width="12" height="12" fill="#fff"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></div><span>{{ cv.email }}</span></div>
            <div v-if="cv.website" class="ex-contact-item"><div class="ex-ci-icon" :style="{background:accentColor}"><svg viewBox="0 0 24 24" width="12" height="12" fill="#fff"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.9 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg></div><a :href="addHttp(cv.website)" target="_blank" class="cv-link-muted">{{ cv.website }}</a></div>
            <div v-if="cv.city" class="ex-contact-item"><div class="ex-ci-icon" :style="{background:accentColor}"><svg viewBox="0 0 24 24" width="12" height="12" fill="#fff"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div><span>{{ cv.city }}{{ cv.country ? ', ' + cv.country : '' }}</span></div>
          </div>
          <div v-if="cv.skills.some(s=>s.name)" class="ex-sec"><div class="ex-sec-t" :style="{color:accentColor}">Compétences</div><div class="ex-sec-line" :style="{background:accentColor}"></div>
            <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="ex-skill-item"><div class="ex-skill-bullet" :style="{background:'#2d3f50'}"></div><span>{{ s.name }}</span></div>
          </div>
          <div v-if="cv.languages.some(l=>l.name)" class="ex-sec"><div class="ex-sec-t" :style="{color:accentColor}">Langues</div><div class="ex-sec-line" :style="{background:accentColor}"></div>
            <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="ex-lang"><span>{{ l.name }}</span><span class="ex-lang-lvl">{{ l.level }}</span></div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="ex-sec"><div class="ex-sec-t" :style="{color:accentColor}">Aptitudes</div><div class="ex-sec-line" :style="{background:accentColor}"></div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="ex-skill-item"><div class="ex-skill-bullet" :style="{background:'#f59e0b'}"></div><span>{{ a.name }}</span></div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="ex-sec"><div class="ex-sec-t" :style="{color:accentColor}">Intérêts</div><div class="ex-sec-line" :style="{background:accentColor}"></div>
            <div class="ex-interests"><span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="ex-interest-tag" :style="{borderColor:accentColor,color:accentColor}">{{ c.name }}</span></div>
          </div>
        </div>
        <div class="ex-right">
          <div v-if="cv.summary" class="ex-sec"><div class="ex-sec-t" :style="{color:accentColor}">Profil</div><div class="ex-sec-line" :style="{background:accentColor}"></div><p class="ex-profile-txt">{{ cv.summary }}</p></div>
          <div v-if="cv.experiences.some(e=>e.position)" class="ex-sec"><div class="ex-sec-t" :style="{color:accentColor}">Expériences</div><div class="ex-sec-line" :style="{background:accentColor}"></div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="ex-entry">
              <div class="ex-entry-left"><div class="ex-entry-company" style="color:#2d3f50">{{ e.company }}</div><div class="ex-entry-date">{{ e.startDate }}{{ e.endDate ? ' - ' + e.endDate : '' }}</div></div>
              <div class="ex-entry-right"><div class="ex-entry-pos">{{ e.position }}</div>
                <div v-if="hasBullets(e)" class="ex-bullets"><div v-for="(b,bi) in getBullets(e)" :key="bi" class="ex-bullet-line"><span class="ex-bullet-dot" :style="{background:accentColor}"></span><span class="ex-bullet-text">{{ b }}</span></div></div>
                <p v-else-if="e.description" class="ex-desc">{{ e.description }}</p>
              </div>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="ex-sec"><div class="ex-sec-t" :style="{color:accentColor}">Formation</div><div class="ex-sec-line" :style="{background:accentColor}"></div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="ex-entry">
              <div class="ex-entry-left"><div class="ex-entry-company" style="color:#2d3f50">{{ e.school }}</div><div class="ex-entry-date">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut + ' - ' + e.anneeFin : e.year }}</div></div>
              <div class="ex-entry-right"><div class="ex-entry-pos">{{ e.degree }}</div></div>
            </div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="ex-sec"><div class="ex-sec-t" :style="{color:accentColor}">Projets</div><div class="ex-sec-line" :style="{background:accentColor}"></div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="ex-entry">
              <div class="ex-entry-left"><div v-if="p.tech" class="ex-entry-date" style="font-size:11px">{{ p.tech }}</div></div>
              <div class="ex-entry-right">
                <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="ex-entry-pos cv-link-accent" :style="{color:accentColor}">{{ p.name }}</a>
                <div v-else class="ex-entry-pos">{{ p.name }}</div>
                <p v-if="p.description" class="ex-desc">{{ p.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         16. VLADIMIR
    ══════════════════════════════════════════ -->
    <div v-if="selectedTpl==='vladimir'" class="cv-vlad">
      <div class="vl-layout">
        <div class="vl-sidebar">
          <div class="vl-sidebar-top" style="background:#2b2b2b">
            <div class="vl-photo-ring-wrap">
              <div class="vl-photo-ring" :style="{borderColor:accentColor}">
                <img v-if="cv.photo" :src="cv.photo" class="vl-photo" @error="e=>e.target.style.display='none'"/>
                <div v-else class="vl-photo-init" :style="{color:accentColor}">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
              </div>
            </div>
            <div class="vl-sidebar-name-block">
              <h1 class="vl-name"><span class="vl-name-first">{{ cv.firstName||'Prénom' }}</span> <span class="vl-name-last" :style="{color:accentColor}">{{ cv.lastName||'Nom' }}</span></h1>
              <div class="vl-title-line"><span class="vl-job-title">{{ cv.title||'Votre titre' }}</span><span v-if="cv.yearsExp" class="vl-years-exp">{{ cv.yearsExp }} ans d'expérience</span></div>
            </div>
          </div>
          <div class="vl-sidebar-body">
            <div class="vl-info-block">
              <div v-if="cv.age||cv.nationality" class="vl-info-item"><div class="vl-info-icon" :style="{color:accentColor}"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg></div><span>{{ cv.age ? cv.age + ' ans' : '' }}{{ cv.age && cv.nationality ? ' - ' : '' }}{{ cv.nationality||'' }}</span></div>
              <div v-if="cv.city" class="vl-info-item"><div class="vl-info-icon" :style="{color:accentColor}"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div><span>{{ cv.city }}{{ cv.country ? ' - ' + cv.country : '' }}</span></div>
              <div v-if="cv.email" class="vl-info-item"><div class="vl-info-icon" :style="{color:accentColor}"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></div><span>{{ cv.email }}</span></div>
              <div v-if="cv.phone" class="vl-info-item"><div class="vl-info-icon" :style="{color:accentColor}"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg></div><span>{{ cv.phone }}</span></div>
              <div v-if="cv.website" class="vl-info-item"><div class="vl-info-icon" :style="{color:accentColor}"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.9 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg></div><a :href="addHttp(cv.website)" target="_blank" class="cv-link-white">{{ cv.website }}</a></div>
            </div>
            <div v-if="cv.skills.some(s=>s.name)" class="vl-sec">
              <div class="vl-sec-header"><div class="vl-sec-t">Compétences</div><div class="vl-sec-icon" :style="{background:accentColor}"><svg viewBox="0 0 24 24" width="13" height="13" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg></div></div>
              <div class="vl-skills-list"><div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="vl-skill-line">- {{ s.name }}</div></div>
            </div>
            <div v-if="cv.aptitudes.some(a=>a.name)" class="vl-sec"><div class="vl-aptitudes-title">Aptitudes</div><div class="vl-skills-list"><div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="vl-skill-line">- {{ a.name }}</div></div></div>
            <div v-if="cv.languages.some(l=>l.name)" class="vl-sec">
              <div class="vl-sec-header"><div class="vl-sec-t">Langues</div><div class="vl-sec-icon" :style="{background:accentColor}"><svg viewBox="0 0 24 24" width="13" height="13" fill="#fff"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg></div></div>
              <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="vl-lang-item"><div class="vl-lang-name">{{ l.name }}</div><div class="vl-lang-bar-wrap"><div class="vl-lang-bar-bg"><div class="vl-lang-bar-fill" :style="{width:l.level==='Débutant'?'25%':l.level==='Intermédiaire'?'50%':l.level==='Avancé'?'75%':'90%',background:accentColor}"></div></div></div></div>
            </div>
            <div v-if="cv.centresInteret.some(c=>c.name)" class="vl-sec">
              <div class="vl-sec-header"><div class="vl-sec-t">Hobbies</div><div class="vl-sec-icon" :style="{background:accentColor}"><svg viewBox="0 0 24 24" width="13" height="13" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg></div></div>
              <div class="vl-hobbies-grid"><div v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="vl-hobby-tag">{{ c.name }}</div></div>
            </div>
          </div>
        </div>
        <div class="vl-main">
          <div v-if="cv.summary" class="vl-msec"><div class="vl-msec-title" :style="{color:accentColor}">Présentation</div><div class="vl-msec-line" :style="{background:accentColor}"></div><p class="vl-summary-txt">{{ cv.summary }}</p></div>
          <div v-if="cv.experiences.some(e=>e.position)" class="vl-msec"><div class="vl-msec-title" :style="{color:accentColor}">Expériences professionnelles</div><div class="vl-msec-line" :style="{background:accentColor}"></div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="vl-exp-entry">
              <div class="vl-exp-date">{{ e.startDate }}{{ e.endDate ? ' - ' + e.endDate : ' à ce jour' }}</div>
              <div class="vl-exp-pos">{{ e.position }}</div><div class="vl-exp-company" :style="{color:accentColor}">{{ e.company }}</div>
              <div v-if="hasBullets(e)" class="vl-exp-bullets"><div v-for="(b,bi) in getBullets(e)" :key="bi" class="vl-exp-bullet-line">- {{ b }}</div></div>
              <p v-else-if="e.description" class="vl-exp-desc">{{ e.description }}</p>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="vl-msec"><div class="vl-msec-title" :style="{color:accentColor}">Formations &amp; Diplômes</div><div class="vl-msec-line" :style="{background:accentColor}"></div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="vl-edu-entry">
              <div class="vl-edu-date">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut + ' - ' + e.anneeFin : e.year }}<span v-if="e.mention" class="vl-edu-mention"> | {{ e.mention }}</span></div>
              <div class="vl-edu-degree">{{ e.degree }}</div><div class="vl-edu-school">{{ e.school }}</div>
            </div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="vl-msec"><div class="vl-msec-title" :style="{color:accentColor}">Informatique</div><div class="vl-msec-line" :style="{background:accentColor}"></div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="vl-proj-line">
              - <strong><a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="cv-link-accent" :style="{color:accentColor}">{{ p.name }}</a><span v-else>{{ p.name }}</span></strong><span v-if="p.description"> : {{ p.description }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         17. NEON DARK
    ══════════════════════════════════════════ -->
    <div v-if="selectedTpl==='neondark'" class="cv-neondark">
      <div class="nd-header">
        <div class="nd-header-bg" :style="{background:`linear-gradient(135deg,#0f172a 60%,${accentColor}18 100%)`}"></div>
        <div class="nd-header-content">
          <div class="nd-photo-wrap">
            <img v-if="cv.photo" :src="cv.photo" class="nd-photo" @error="e=>e.target.style.display='none'"/>
            <div v-else class="nd-init" :style="{borderColor:accentColor,color:accentColor}">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
            <div class="nd-photo-ring" :style="{borderColor:accentColor}"></div>
          </div>
          <div class="nd-header-text">
            <h1 class="nd-name"><span class="nd-name-first">{{ cv.firstName||'Prénom' }}</span><span class="nd-name-last" :style="{color:accentColor}">{{ cv.lastName||'Nom' }}</span></h1>
            <p class="nd-title" :style="{color:accentColor+'bb'}">{{ cv.title }}</p>
            <div v-if="cv.dateNaissance" class="nd-dob">{{ formatDate(cv.dateNaissance) }}</div>
            <div class="nd-contacts">
              <span v-if="cv.email" class="nd-contact-pill" :style="{borderColor:accentColor+'44',color:'#94a3b8'}"><span :style="{color:accentColor}">✉</span> {{ cv.email }}</span>
              <span v-if="cv.phone" class="nd-contact-pill" :style="{borderColor:accentColor+'44',color:'#94a3b8'}"><span :style="{color:accentColor}">☏</span> {{ cv.phone }}</span>
              <span v-if="cv.city" class="nd-contact-pill" :style="{borderColor:accentColor+'44',color:'#94a3b8'}"><span :style="{color:accentColor}">⌖</span> {{ cv.city }}{{ cv.country?', '+cv.country:'' }}</span>
              <a v-if="cv.website" :href="addHttp(cv.website)" target="_blank" class="nd-contact-pill cv-link-neon" :style="{borderColor:accentColor+'44',color:accentColor}"><span :style="{color:accentColor}">⊕</span> {{ cv.website }}</a>
            </div>
          </div>
        </div>
        <div class="nd-header-line" :style="{background:`linear-gradient(90deg,transparent,${accentColor},transparent)`}"></div>
      </div>
      <div class="nd-body">
        <div class="nd-left">
          <div v-if="cv.skills.some(s=>s.name)" class="nd-sec">
            <div class="nd-sec-t" :style="{color:accentColor}"><span class="nd-sec-icon" :style="{background:accentColor+'22',color:accentColor}">⚡</span>COMPÉTENCES</div>
            <div class="nd-sec-line" :style="{background:accentColor}"></div>
            <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="nd-skill"><div class="nd-sk-head"><span class="nd-sk-name">{{ s.name }}</span><span class="nd-sk-pct" :style="{color:accentColor}">{{ s.level*25 }}%</span></div><div class="nd-sk-track"><div class="nd-sk-fill" :style="{width:(s.level*25)+'%',background:`linear-gradient(90deg,${accentColor}88,${accentColor})`}"></div></div></div>
          </div>
          <div v-if="cv.languages.some(l=>l.name)" class="nd-sec">
            <div class="nd-sec-t" :style="{color:accentColor}"><span class="nd-sec-icon" :style="{background:accentColor+'22',color:accentColor}">◎</span>LANGUES</div>
            <div class="nd-sec-line" :style="{background:accentColor}"></div>
            <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="nd-lang"><span class="nd-lang-name">{{ l.name }}</span><span class="nd-lang-lvl" :style="{background:accentColor+'22',color:accentColor,borderColor:accentColor+'44'}">{{ l.level }}</span></div>
          </div>
          <div v-if="cv.aptitudes.some(a=>a.name)" class="nd-sec">
            <div class="nd-sec-t" :style="{color:accentColor}"><span class="nd-sec-icon" :style="{background:accentColor+'22',color:accentColor}">◈</span>APTITUDES</div>
            <div class="nd-sec-line" :style="{background:accentColor}"></div>
            <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="nd-skill"><div class="nd-sk-head"><span class="nd-sk-name">{{ a.name }}</span></div><div class="nd-sk-track"><div class="nd-sk-fill" :style="{width:(a.level*25)+'%',background:'linear-gradient(90deg,#f59e0b88,#f59e0b)'}"></div></div></div>
          </div>
          <div v-if="cv.centresInteret.some(c=>c.name)" class="nd-sec">
            <div class="nd-sec-t" :style="{color:accentColor}"><span class="nd-sec-icon" :style="{background:accentColor+'22',color:accentColor}">◇</span>INTÉRÊTS</div>
            <div class="nd-sec-line" :style="{background:accentColor}"></div>
            <div class="nd-interests"><span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="nd-interest" :style="{borderColor:accentColor+'55',color:'#94a3b8'}">{{ c.name }}</span></div>
          </div>
        </div>
        <div class="nd-right">
          <div v-if="cv.summary" class="nd-sec">
            <div class="nd-sec-t" :style="{color:accentColor}"><span class="nd-sec-icon" :style="{background:accentColor+'22',color:accentColor}">▸</span>PROFIL</div>
            <div class="nd-sec-line" :style="{background:accentColor}"></div>
            <p class="nd-summary">{{ cv.summary }}</p>
          </div>
          <div v-if="cv.experiences.some(e=>e.position)" class="nd-sec">
            <div class="nd-sec-t" :style="{color:accentColor}"><span class="nd-sec-icon" :style="{background:accentColor+'22',color:accentColor}">◉</span>EXPÉRIENCES</div>
            <div class="nd-sec-line" :style="{background:accentColor}"></div>
            <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="nd-entry">
              <div class="nd-entry-node" :style="{background:accentColor}"></div>
              <div class="nd-entry-vline" :style="{borderColor:accentColor+'33'}"></div>
              <div class="nd-entry-body">
                <div class="nd-entry-top"><span class="nd-entry-pos">{{ e.position }}</span><span class="nd-entry-date" :style="{background:accentColor+'15',color:accentColor,borderColor:accentColor+'44'}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div>
                <div class="nd-entry-co" :style="{color:accentColor+'99'}">{{ e.company }}</div>
                <div v-if="hasBullets(e)" class="nd-bullets"><div v-for="(b,bi) in getBullets(e)" :key="bi" class="nd-bullet-line"><span class="nd-bullet-dot" :style="{background:accentColor}"></span><span class="nd-bullet-text">{{ b }}</span></div></div>
                <p v-else-if="e.description" class="nd-entry-desc">{{ e.description }}</p>
              </div>
            </div>
          </div>
          <div v-if="cv.education.some(e=>e.degree)" class="nd-sec">
            <div class="nd-sec-t" :style="{color:accentColor}"><span class="nd-sec-icon" :style="{background:accentColor+'22',color:accentColor}">◎</span>FORMATION</div>
            <div class="nd-sec-line" :style="{background:accentColor}"></div>
            <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="nd-entry">
              <div class="nd-entry-node" :style="{background:accentColor}"></div>
              <div class="nd-entry-body">
                <div class="nd-entry-top"><span class="nd-entry-pos">{{ e.degree }}</span><span class="nd-entry-date" :style="{background:accentColor+'15',color:accentColor,borderColor:accentColor+'44'}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</span></div>
                <div class="nd-entry-co" :style="{color:accentColor+'99'}">{{ e.school }}</div>
              </div>
            </div>
          </div>
          <div v-if="cv.projects.some(p=>p.name)" class="nd-sec">
            <div class="nd-sec-t" :style="{color:accentColor}"><span class="nd-sec-icon" :style="{background:accentColor+'22',color:accentColor}">▹</span>PROJETS</div>
            <div class="nd-sec-line" :style="{background:accentColor}"></div>
            <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="nd-proj" :style="{borderLeftColor:accentColor}">
              <div class="nd-proj-head">
                <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="nd-proj-name cv-link-neon" :style="{color:accentColor}">{{ p.name }}</a>
                <span v-else class="nd-proj-name">{{ p.name }}</span>
                <span v-if="p.tech" class="nd-proj-tech" :style="{background:accentColor+'15',color:accentColor,borderColor:accentColor+'44'}">{{ p.tech }}</span>
              </div>
              <p v-if="p.description" class="nd-entry-desc">{{ p.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div v-if="selectedTpl==='fold'" class="cv-fold">

  <!-- En-tête biseau -->
  <div class="fd-header">
    <div class="fd-header-fill" :style="{background:accentColor}"></div>
    <div class="fd-header-clip" :style="{borderTopColor:accentColor}"></div>
    <div class="fd-hd-content">
      <div class="fd-photo-wrap">
        <img v-if="cv.photo" :src="cv.photo" class="fd-photo" @error="e=>e.target.style.display='none'"/>
        <div v-else class="fd-init">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
      </div>
      <div class="fd-hd-text">
        <h1 class="fd-name">{{ cv.firstName||'Prénom' }} <strong>{{ cv.lastName||'Nom' }}</strong></h1>
        <p class="fd-title">{{ cv.title }}</p>
        <p v-if="cv.dateNaissance" class="fd-dob">Né(e) le {{ formatDate(cv.dateNaissance) }}</p>
        <div class="fd-contacts">
          <span v-if="cv.email">✉ {{ cv.email }}</span>
          <span v-if="cv.phone">☏ {{ cv.phone }}</span>
          <span v-if="cv.city">⌖ {{ cv.city }}{{ cv.country?', '+cv.country:'' }}</span>
          <a v-if="cv.website" :href="addHttp(cv.website)" target="_blank" class="cv-link-white">⊕ {{ cv.website }}</a>
        </div>
      </div>
    </div>
  </div>

  <!-- Corps -->
  <div class="fd-body">
    <div class="fd-left">
      <div v-if="cv.skills.some(s=>s.name)" class="fd-sec">
        <div class="fd-sec-t" :style="{color:accentColor}">COMPÉTENCES</div>
        <div class="fd-sec-rule" :style="{background:accentColor}"></div>
        <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="fd-skill">
          <div class="fd-sk-lbl">{{ s.name }}</div>
          <div class="fd-sk-track"><div class="fd-sk-fill" :style="{width:(s.level*25)+'%',background:accentColor}"></div></div>
        </div>
      </div>
      <div v-if="cv.aptitudes.some(a=>a.name)" class="fd-sec">
        <div class="fd-sec-t" :style="{color:accentColor}">APTITUDES</div>
        <div class="fd-sec-rule" :style="{background:accentColor}"></div>
        <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="fd-skill">
          <div class="fd-sk-lbl">{{ a.name }}</div>
          <div class="fd-sk-track"><div class="fd-sk-fill" :style="{width:(a.level*25)+'%',background:'#f59e0b'}"></div></div>
        </div>
      </div>
      <div v-if="cv.languages.some(l=>l.name)" class="fd-sec">
        <div class="fd-sec-t" :style="{color:accentColor}">LANGUES</div>
        <div class="fd-sec-rule" :style="{background:accentColor}"></div>
        <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="fd-lang">
          <span>{{ l.name }}</span><span class="fd-lang-lvl">{{ l.level }}</span>
        </div>
      </div>
      <div v-if="cv.centresInteret.some(c=>c.name)" class="fd-sec">
        <div class="fd-sec-t" :style="{color:accentColor}">INTÉRÊTS</div>
        <div class="fd-sec-rule" :style="{background:accentColor}"></div>
        <div class="fd-tags">
          <span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name"
            class="fd-tag" :style="{borderColor:accentColor+'55',color:accentColor}">{{ c.name }}</span>
        </div>
      </div>
    </div>

    <div class="fd-right">
      <div v-if="cv.summary" class="fd-sec">
        <div class="fd-sec-t" :style="{color:accentColor}">PROFIL</div>
        <div class="fd-sec-rule" :style="{background:accentColor}"></div>
        <p class="fd-txt">{{ cv.summary }}</p>
      </div>
      <div v-if="cv.experiences.some(e=>e.position)" class="fd-sec">
        <div class="fd-sec-t" :style="{color:accentColor}">EXPÉRIENCES</div>
        <div class="fd-sec-rule" :style="{background:accentColor}"></div>
        <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="fd-entry">
          <div class="fd-entry-side">
            <div class="fd-node" :style="{background:accentColor}"></div>
            <div class="fd-line" :style="{borderColor:accentColor+'33'}"></div>
          </div>
          <div class="fd-entry-body">
            <div class="fd-et">
              <span class="fd-pos">{{ e.position }}</span>
              <span class="fd-date" :style="{background:accentColor+'18',color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span>
            </div>
            <div class="fd-co">{{ e.company }}</div>
            <div v-if="hasBullets(e)" class="fd-bullets">
              <div v-for="(b,bi) in getBullets(e)" :key="bi" class="fd-bullet-line">
                <span class="fd-bullet-dot" :style="{background:accentColor}"></span>
                <span class="fd-bullet-text">{{ b }}</span>
              </div>
            </div>
            <p v-else-if="e.description" class="fd-desc">{{ e.description }}</p>
          </div>
        </div>
      </div>
      <div v-if="cv.education.some(e=>e.degree)" class="fd-sec">
        <div class="fd-sec-t" :style="{color:accentColor}">FORMATION</div>
        <div class="fd-sec-rule" :style="{background:accentColor}"></div>
        <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="fd-entry">
          <div class="fd-entry-side">
            <div class="fd-node" :style="{background:accentColor}"></div>
            <div class="fd-line" :style="{borderColor:accentColor+'33'}"></div>
          </div>
          <div class="fd-entry-body">
            <div class="fd-et">
              <span class="fd-pos">{{ e.degree }}</span>
              <span class="fd-date" :style="{background:accentColor+'18',color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</span>
            </div>
            <div class="fd-co">{{ e.school }}</div>
          </div>
        </div>
      </div>
      <div v-if="cv.projects.some(p=>p.name)" class="fd-sec">
        <div class="fd-sec-t" :style="{color:accentColor}">PROJETS</div>
        <div class="fd-sec-rule" :style="{background:accentColor}"></div>
        <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="fd-proj" :style="{borderLeftColor:accentColor}">
          <div class="fd-proj-head">
            <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="fd-pos cv-link-accent" :style="{color:accentColor}">{{ p.name }}</a>
            <span v-else class="fd-pos">{{ p.name }}</span>
            <span v-if="p.tech" class="fd-tech" :style="{background:accentColor+'15',color:accentColor}">{{ p.tech }}</span>
          </div>
          <p v-if="p.description" class="fd-desc">{{ p.description }}</p>
        </div>
      </div>
    </div>
  </div>
</div>


<div v-if="selectedTpl==='prism'" class="cv-prism">

  <!-- Barre latérale gauche fixe -->
  <div class="pr-sidebar" :style="{background:`linear-gradient(180deg,#1e293b 0%,#0f172a 100%)`}">
    <div class="pr-photo-area">
      <div class="pr-photo-ring" :style="{borderColor:accentColor}">
        <img v-if="cv.photo" :src="cv.photo" class="pr-photo" @error="e=>e.target.style.display='none'"/>
        <div v-else class="pr-init" :style="{color:accentColor}">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
      </div>
      <div class="pr-accent-dot" :style="{background:accentColor}"></div>
    </div>
    <div class="pr-id">
      <h1 class="pr-name">{{ cv.firstName||'Prénom' }}<br/><span :style="{color:accentColor}">{{ cv.lastName||'Nom' }}</span></h1>
      <p class="pr-title">{{ cv.title }}</p>
      <p v-if="cv.dateNaissance" class="pr-dob">{{ formatDate(cv.dateNaissance) }}</p>
    </div>
    <div class="pr-sidebar-div" :style="{background:accentColor}"></div>
    <div class="pr-contacts">
      <div v-if="cv.email" class="pr-ci"><span class="pr-ci-ico" :style="{color:accentColor}">✉</span><span>{{ cv.email }}</span></div>
      <div v-if="cv.phone" class="pr-ci"><span class="pr-ci-ico" :style="{color:accentColor}">☏</span><span>{{ cv.phone }}</span></div>
      <div v-if="cv.city" class="pr-ci"><span class="pr-ci-ico" :style="{color:accentColor}">⌖</span><span>{{ cv.city }}{{ cv.country?', '+cv.country:'' }}</span></div>
      <a v-if="cv.website" :href="addHttp(cv.website)" target="_blank" class="pr-ci cv-link-white"><span class="pr-ci-ico" :style="{color:accentColor}">⊕</span><span>{{ cv.website }}</span></a>
    </div>
    <div class="pr-sidebar-div" :style="{background:accentColor}"></div>
    <div v-if="cv.skills.some(s=>s.name)" class="pr-blk">
      <div class="pr-blk-t">COMPÉTENCES</div>
      <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="pr-skill">
        <div class="pr-sk-lbl">{{ s.name }}</div>
        <div class="pr-sk-track"><div class="pr-sk-fill" :style="{width:(s.level*25)+'%',background:accentColor}"></div></div>
      </div>
    </div>
    <div v-if="cv.aptitudes.some(a=>a.name)" class="pr-blk">
      <div class="pr-blk-t">APTITUDES</div>
      <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="pr-skill">
        <div class="pr-sk-lbl">{{ a.name }}</div>
        <div class="pr-sk-track"><div class="pr-sk-fill" :style="{width:(a.level*25)+'%',background:'#f59e0b'}"></div></div>
      </div>
    </div>
    <div v-if="cv.languages.some(l=>l.name)" class="pr-blk">
      <div class="pr-blk-t">LANGUES</div>
      <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="pr-lang">
        <span>{{ l.name }}</span><span class="pr-lang-lvl" :style="{color:accentColor}">{{ l.level }}</span>
      </div>
    </div>
    <div v-if="cv.centresInteret.some(c=>c.name)" class="pr-blk">
      <div class="pr-blk-t">INTÉRÊTS</div>
      <div class="pr-tags">
        <span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name"
          class="pr-tag" :style="{background:accentColor+'22',color:accentColor}">{{ c.name }}</span>
      </div>
    </div>
  </div>

  <!-- Contenu principal -->
  <div class="pr-main">
    <!-- Bandeau diagonal en haut -->
    <div class="pr-top-band" :style="{background:accentColor}">
      <div class="pr-band-clip"></div>
    </div>

    <div class="pr-content">
      <div v-if="cv.summary" class="pr-sec">
        <div class="pr-sec-t" :style="{color:accentColor}">
          <span class="pr-sec-icon" :style="{background:accentColor}">▸</span>PROFIL
        </div>
        <p class="pr-txt">{{ cv.summary }}</p>
      </div>
      <div v-if="cv.experiences.some(e=>e.position)" class="pr-sec">
        <div class="pr-sec-t" :style="{color:accentColor}">
          <span class="pr-sec-icon" :style="{background:accentColor}">▸</span>EXPÉRIENCES
        </div>
        <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="pr-entry">
          <div class="pr-entry-accent" :style="{background:accentColor}"></div>
          <div class="pr-entry-body">
            <div class="pr-et">
              <span class="pr-pos">{{ e.position }}</span>
              <span class="pr-date" :style="{background:accentColor+'18',color:accentColor,borderColor:accentColor+'44'}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span>
            </div>
            <div class="pr-co">{{ e.company }}</div>
            <div v-if="hasBullets(e)" class="pr-bullets">
              <div v-for="(b,bi) in getBullets(e)" :key="bi" class="pr-bullet-line">
                <span class="pr-bullet-dot" :style="{background:accentColor}"></span>
                <span class="pr-bullet-text">{{ b }}</span>
              </div>
            </div>
            <p v-else-if="e.description" class="pr-desc">{{ e.description }}</p>
          </div>
        </div>
      </div>
      <div v-if="cv.education.some(e=>e.degree)" class="pr-sec">
        <div class="pr-sec-t" :style="{color:accentColor}">
          <span class="pr-sec-icon" :style="{background:accentColor}">▸</span>FORMATION
        </div>
        <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.degree" class="pr-entry">
          <div class="pr-entry-accent" :style="{background:accentColor}"></div>
          <div class="pr-entry-body">
            <div class="pr-et">
              <span class="pr-pos">{{ e.degree }}</span>
              <span class="pr-date" :style="{background:accentColor+'18',color:accentColor,borderColor:accentColor+'44'}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : e.year }}</span>
            </div>
            <div class="pr-co">{{ e.school }}</div>
          </div>
        </div>
      </div>
      <div v-if="cv.projects.some(p=>p.name)" class="pr-sec">
        <div class="pr-sec-t" :style="{color:accentColor}">
          <span class="pr-sec-icon" :style="{background:accentColor}">▸</span>PROJETS
        </div>
        <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="pr-proj" :style="{borderColor:accentColor+'33'}">
          <div class="pr-proj-head">
            <a v-if="p.url" :href="addHttp(p.url)" target="_blank" class="pr-pos cv-link-accent" :style="{color:accentColor}">{{ p.name }}</a>
            <span v-else class="pr-pos">{{ p.name }}</span>
            <span v-if="p.tech" class="pr-tech" :style="{background:accentColor+'15',color:accentColor}">{{ p.tech }}</span>
          </div>
          <p v-if="p.description" class="pr-desc">{{ p.description }}</p>
        </div>
      </div>
    </div>
  </div>
</div>


  <!-- ─── SIDEBAR PRO ─────────────────────────────────────────────────────── -->
  <div v-if="selectedTpl==='sidebar'" class="cv-sidebar">
    <div class="sb-left">
      <div class="sb-photo-area">
        <img v-if="cv.photo" :src="cv.photo" class="sb-photo" @error="e=>e.target.style.display='none'"/>
        <div v-else class="sb-init" :style="{borderColor:accentColor,color:accentColor}">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
        <div class="sb-name">{{ cv.firstName }}<br/>{{ cv.lastName }}</div>
        <div class="sb-title" :style="{color:accentColor}">{{ cv.title }}</div>
      </div>
      <div class="sb-sec">
        <div class="sb-sec-t" :style="{color:accentColor}">CONTACT</div>
        <div v-if="cv.phone" class="sb-ci">
          <div class="sb-ci-ico" :style="{background:accentColor+'33'}">
            <svg viewBox="0 0 24 24" width="11" height="11" :fill="accentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
          </div><span>{{ cv.phone }}</span>
        </div>
        <div v-if="cv.email" class="sb-ci">
          <div class="sb-ci-ico" :style="{background:accentColor+'33'}">
            <svg viewBox="0 0 24 24" width="11" height="11" :fill="accentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          </div><span>{{ cv.email }}</span>
        </div>
        <div v-if="cv.city" class="sb-ci">
          <div class="sb-ci-ico" :style="{background:accentColor+'33'}">
            <svg viewBox="0 0 24 24" width="11" height="11" :fill="accentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          </div><span>{{ cv.city }}{{ cv.country ? ', '+cv.country : '' }}</span>
        </div>
        <div v-if="cv.dateNaissance" class="sb-ci">
          <div class="sb-ci-ico" style="font-size:9px">🎂</div>
          <span>{{ formatDate(cv.dateNaissance) }}</span>
        </div>
      </div>
      <div v-if="cv.skills.some(s=>s.name)" class="sb-sec">
        <div class="sb-sec-t" :style="{color:accentColor}">COMPÉTENCES</div>
        <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="sb-skill">
          <div class="sb-sk-n">{{ s.name }}</div>
          <div class="sb-sk-track"><div class="sb-sk-fill" :style="{width:(s.level*25)+'%',background:accentColor}"></div></div>
        </div>
      </div>
      <div v-if="cv.languages.some(l=>l.name)" class="sb-sec">
        <div class="sb-sec-t" :style="{color:accentColor}">LANGUES</div>
        <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="sb-lang">
          <span>{{ l.name }}</span><span :style="{color:accentColor,fontWeight:700}">{{ l.level }}</span>
        </div>
      </div>
      <div v-if="cv.aptitudes.some(a=>a.name)" class="sb-sec">
        <div class="sb-sec-t" :style="{color:accentColor}">APTITUDES</div>
        <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="sb-apt-item">
          <span class="sb-apt-n">{{ a.name }}</span>
          <div class="sb-apt-track"><div class="sb-apt-fill" :style="{width:(a.level*25)+'%'}"></div></div>
        </div>
      </div>
      <div v-if="cv.centresInteret.some(c=>c.name)" class="sb-sec">
        <div class="sb-sec-t" :style="{color:accentColor}">INTÉRÊTS</div>
        <div v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="sb-interest">{{ c.name }}</div>
      </div>
    </div>
    <div class="sb-right">
      <div class="sb-hd" :style="{borderBottomColor:accentColor}">
        <div class="sb-hd-name">{{ cv.firstName }} {{ cv.lastName }}</div>
        <div class="sb-hd-title" :style="{color:accentColor}">{{ cv.title }}</div>
      </div>
      <p v-if="cv.summary" class="sb-summary" :style="{background:accentColor+'08',borderLeftColor:accentColor}">{{ cv.summary }}</p>
      <div v-if="cv.experiences.some(e=>e.position)" class="sb-sec-r">
        <div class="sb-sec-t-r">EXPÉRIENCES PROFESSIONNELLES</div>
        <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.id" class="sb-entry" :style="{borderLeftColor:accentColor}">
          <div class="sb-entry-top">
            <span class="sb-pos">{{ e.position }}</span>
            <span class="sb-date" :style="{color:accentColor}">{{ e.startDate }}{{ e.endDate ? ' – '+e.endDate : '' }}</span>
          </div>
          <div class="sb-co">{{ e.company }}</div>
          <div v-if="hasBullets(e)" class="sb-bullets">
            <div v-for="(b,bi) in getBullets(e)" :key="bi" class="sb-bullet-line">
              <span class="sb-bullet-dot" :style="{background:accentColor}"></span>
              <span class="sb-bullet-text">{{ b }}</span>
            </div>
          </div>
          <p v-else-if="e.description" class="sb-desc">{{ e.description }}</p>
        </div>
      </div>
      <div v-if="cv.education.some(e=>e.degree)" class="sb-sec-r">
        <div class="sb-sec-t-r">FORMATION</div>
        <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.id" class="sb-entry" :style="{borderLeftColor:accentColor}">
          <div class="sb-entry-top">
            <span class="sb-pos">{{ e.degree }}</span>
            <span class="sb-date" :style="{color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : '' }}</span>
          </div>
          <div class="sb-co">{{ e.school }}</div>
        </div>
      </div>
      <div v-if="cv.projects.some(p=>p.name)" class="sb-sec-r">
        <div class="sb-sec-t-r">PROJETS</div>
        <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="sb-entry" :style="{borderLeftColor:accentColor}">
          <div class="sb-pos">
            <a v-if="p.url" :href="addHttp(p.url)" target="_blank" :style="{color:accentColor}">{{ p.name }}</a>
            <span v-else>{{ p.name }}</span>
          </div>
          <div v-if="p.tech" class="sb-co">{{ p.tech }}</div>
          <p v-if="p.description" class="sb-desc">{{ p.description }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ─── GREEN 2COL ──────────────────────────────────────────────────────── -->
  <div v-if="selectedTpl==='green2col'" class="cv-green2col">
    <div class="g2-top">
      <div class="g2-top-left">
        <div class="g2-name">{{ cv.firstName }} {{ cv.lastName }}</div>
        <div class="g2-title" :style="{color:accentColor}">{{ cv.title }}</div>
        <div class="g2-contacts">
          <span v-if="cv.phone">📞 {{ cv.phone }}</span>
          <span v-if="cv.email">✉ {{ cv.email }}</span>
          <span v-if="cv.city">📍 {{ cv.city }}{{ cv.country ? ', '+cv.country : '' }}</span>
        </div>
      </div>
      <img v-if="cv.photo" :src="cv.photo" class="g2-photo" :style="{borderColor:accentColor}" @error="e=>e.target.style.display='none'"/>
    </div>
    <div class="g2-divider" :style="{background:accentColor+'22'}"></div>
    <div class="g2-body">
      <div class="g2-left">
        <p v-if="cv.summary" class="g2-summary">{{ cv.summary }}</p>
        <div v-if="cv.experiences.some(e=>e.position)" class="g2-sec">
          <div class="g2-sec-t">EXPÉRIENCES</div>
          <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.id" class="g2-exp">
            <div class="g2-exp-head">
              <span class="g2-exp-pos">{{ e.position }}</span>
              <span class="g2-exp-date">{{ e.startDate }}{{ e.endDate ? ' – '+e.endDate : '' }}</span>
            </div>
            <div class="g2-exp-co" :style="{color:accentColor}">{{ e.company }}</div>
            <div v-if="hasBullets(e)" class="g2-bullets">
              <div v-for="(b,bi) in getBullets(e)" :key="bi" class="g2-bullet-line">
                <span class="g2-bullet-dot" :style="{background:accentColor}"></span>
                <span class="g2-bullet-text">{{ b }}</span>
              </div>
            </div>
            <p v-else-if="e.description" class="g2-desc">{{ e.description }}</p>
          </div>
        </div>
        <div v-if="cv.education.some(e=>e.degree)" class="g2-sec">
          <div class="g2-sec-t">ÉDUCATION</div>
          <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.id" class="g2-edu-item">
            <div class="g2-edu-year" :style="{color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : '' }}</div>
            <div class="g2-edu-deg">{{ e.degree }}</div>
            <div class="g2-edu-school">{{ e.school }}</div>
          </div>
        </div>
        <div v-if="cv.projects.some(p=>p.name)" class="g2-sec">
          <div class="g2-sec-t">PROJETS</div>
          <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="g2-proj" :style="{borderLeftColor:accentColor,background:accentColor+'08'}">
            <span class="g2-proj-name">
              <a v-if="p.url" :href="addHttp(p.url)" target="_blank" :style="{color:accentColor}">{{ p.name }}</a>
              <span v-else>{{ p.name }}</span>
            </span>
            <span v-if="p.tech" class="g2-proj-tech" :style="{background:accentColor,color:'#fff'}">{{ p.tech }}</span>
            <p v-if="p.description" class="g2-proj-desc">{{ p.description }}</p>
          </div>
        </div>
      </div>
      <div class="g2-right">
        <div v-if="cv.skills.some(s=>s.name)" class="g2-sec">
          <div class="g2-sec-t">COMPÉTENCES TECHNIQUES</div>
          <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="g2-skill">
            <div class="g2-sk-n">{{ s.name }}</div>
            <div class="g2-sk-dots">
              <div v-for="d in 4" :key="d" class="g2-sk-dot" :class="{on: d<=s.level}" :style="d<=s.level ? {background:accentColor} : {}"></div>
            </div>
          </div>
        </div>
        <div v-if="cv.languages.some(l=>l.name)" class="g2-sec">
          <div class="g2-sec-t">LANGUES</div>
          <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="g2-lang">
            <div class="g2-lang-top"><span>{{ l.name }}</span><span :style="{color:accentColor,fontWeight:700}">{{ l.level }}</span></div>
            <div class="g2-lang-bar"><div class="g2-lang-fill" :style="{background:accentColor,width:langBarWidth(l.level)}"></div></div>
          </div>
        </div>
        <div v-if="cv.aptitudes.some(a=>a.name)" class="g2-sec">
          <div class="g2-sec-t">APTITUDES</div>
          <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="g2-skill">
            <div class="g2-sk-n">{{ a.name }}</div>
            <div class="g2-sk-dots">
              <div v-for="d in 4" :key="d" class="g2-sk-dot" :style="d<=a.level ? {background:'#f59e0b'} : {}"></div>
            </div>
          </div>
        </div>
        <div v-if="cv.centresInteret.some(c=>c.name)" class="g2-sec">
          <div class="g2-sec-t">PASSIONS / INTÉRÊTS</div>
          <div v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="g2-interest">{{ c.name }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ─── NAVY ────────────────────────────────────────────────────────────── -->
  <div v-if="selectedTpl==='navy'" class="cv-navy">
    <div class="nv-hd" style="background:#1e3a5f">
      <img v-if="cv.photo" :src="cv.photo" class="nv-photo" :style="{borderColor:accentColor}" @error="e=>e.target.style.display='none'"/>
      <div v-else class="nv-init" :style="{background:accentColor+'33',border:'3px solid '+accentColor,color:accentColor}">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
      <div class="nv-hd-text">
        <div class="nv-name">{{ cv.firstName }} {{ cv.lastName }}</div>
        <div class="nv-title" :style="{color:accentColor}">{{ cv.title }}</div>
        <div class="nv-contacts">
          <span v-if="cv.email">✉ {{ cv.email }}</span>
          <span v-if="cv.phone">📞 {{ cv.phone }}</span>
          <span v-if="cv.city">📍 {{ cv.city }}{{ cv.country ? ', '+cv.country : '' }}</span>
          <span v-if="cv.dateNaissance">🎂 {{ formatDate(cv.dateNaissance) }}</span>
        </div>
      </div>
    </div>
    <div class="nv-accent-bar" :style="{background:accentColor}"></div>
    <div class="nv-body">
      <div class="nv-left">
        <div v-if="cv.skills.some(s=>s.name)" class="nv-sec">
          <div class="nv-sec-t"><div class="nv-sec-ico">⚡</div>COMPÉTENCES</div>
          <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="nv-skill">
            <div class="nv-sk-n">{{ s.name }}</div>
            <div class="nv-sk-track"><div class="nv-sk-fill" :style="{width:(s.level*25)+'%',background:accentColor}"></div></div>
          </div>
        </div>
        <div v-if="cv.languages.some(l=>l.name)" class="nv-sec">
          <div class="nv-sec-t"><div class="nv-sec-ico">🌍</div>LANGUES</div>
          <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="nv-lang">
            <span>{{ l.name }}</span>
            <span class="nv-lang-badge" :style="{background:accentColor+'15',color:accentColor}">{{ l.level }}</span>
          </div>
        </div>
        <div v-if="cv.aptitudes.some(a=>a.name)" class="nv-sec">
          <div class="nv-sec-t"><div class="nv-sec-ico">🎯</div>APTITUDES</div>
          <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="nv-apt-item">
            <span class="nv-apt-n">{{ a.name }}</span>
            <div class="nv-apt-track"><div style="height:100%;border-radius:99px;background:#f59e0b" :style="{width:(a.level*25)+'%'}"></div></div>
          </div>
        </div>
        <div v-if="cv.centresInteret.some(c=>c.name)" class="nv-sec">
          <div class="nv-sec-t"><div class="nv-sec-ico">❤️</div>INTÉRÊTS</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px">
            <span v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="nv-interest-tag">{{ c.name }}</span>
          </div>
        </div>
      </div>
      <div class="nv-right">
        <p v-if="cv.summary" class="nv-summary">{{ cv.summary }}</p>
        <div v-if="cv.experiences.some(e=>e.position)" class="nv-sec">
          <div class="nv-sec-t"><div class="nv-sec-ico">💼</div>EXPÉRIENCES PROFESSIONNELLES</div>
          <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.id" class="nv-card">
            <div class="nv-card-top">
              <span class="nv-pos">{{ e.position }}</span>
              <span class="nv-date-badge" :style="{background:accentColor+'15',color:accentColor}">{{ e.startDate }}{{ e.endDate ? ' – '+e.endDate : '' }}</span>
            </div>
            <div class="nv-co" :style="{color:accentColor}">{{ e.company }}</div>
            <div v-if="hasBullets(e)" class="nv-bullets">
              <div v-for="(b,bi) in getBullets(e)" :key="bi" class="nv-bullet-line">
                <span class="nv-bullet-dot" :style="{background:accentColor}"></span>
                <span class="nv-bullet-text">{{ b }}</span>
              </div>
            </div>
            <p v-else-if="e.description" style="font-size:12px;color:#555;margin-top:4px;line-height:1.6">{{ e.description }}</p>
          </div>
        </div>
        <div v-if="cv.education.some(e=>e.degree)" class="nv-sec">
          <div class="nv-sec-t"><div class="nv-sec-ico">🎓</div>FORMATION</div>
          <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.id" class="nv-card">
            <div class="nv-card-top">
              <span class="nv-pos">{{ e.degree }}</span>
              <span class="nv-date-badge" :style="{background:accentColor+'15',color:accentColor}">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : '' }}</span>
            </div>
            <div class="nv-co" :style="{color:accentColor}">{{ e.school }}</div>
          </div>
        </div>
        <div v-if="cv.projects.some(p=>p.name)" class="nv-sec">
          <div class="nv-sec-t"><div class="nv-sec-ico">🚀</div>PROJETS</div>
          <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="nv-card">
            <div class="nv-card-top">
              <span class="nv-pos">
                <a v-if="p.url" :href="addHttp(p.url)" target="_blank" :style="{color:accentColor}">{{ p.name }}</a>
                <span v-else>{{ p.name }}</span>
              </span>
              <span v-if="p.tech" class="nv-date-badge" :style="{background:accentColor+'15',color:accentColor}">{{ p.tech }}</span>
            </div>
            <p v-if="p.description" style="font-size:12px;color:#555;margin-top:4px;line-height:1.6">{{ p.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ─── CRIMSON ─────────────────────────────────────────────────────────── -->
  <div v-if="selectedTpl==='crimson'" class="cv-crimson">
    <div class="cr2-sidebar">
      <div class="cr2-photo-block">
        <img v-if="cv.photo" :src="cv.photo" class="cr2-photo" @error="e=>e.target.style.display='none'"/>
        <div v-else class="cr2-init">{{ (cv.firstName||'?')[0] }}{{ (cv.lastName||'')[0] }}</div>
        <div class="cr2-sidebar-name">{{ cv.firstName }}<br/>{{ cv.lastName }}</div>
        <div class="cr2-sidebar-title">{{ cv.title }}</div>
      </div>
      <div class="cr2-sidebar-body">
        <div class="cr2-sb-sec">
          <div class="cr2-sb-t">CONTACT</div>
          <div v-if="cv.phone" class="cr2-contact-item"><div class="cr2-ci-dot"></div><span>{{ cv.phone }}</span></div>
          <div v-if="cv.email" class="cr2-contact-item"><div class="cr2-ci-dot"></div><span>{{ cv.email }}</span></div>
          <div v-if="cv.city" class="cr2-contact-item"><div class="cr2-ci-dot"></div><span>{{ cv.city }}{{ cv.country ? ', '+cv.country : '' }}</span></div>
          <div v-if="cv.dateNaissance" class="cr2-contact-item"><div class="cr2-ci-dot"></div><span>{{ formatDate(cv.dateNaissance) }}</span></div>
        </div>
        <div v-if="cv.skills.some(s=>s.name)" class="cr2-sb-sec">
          <div class="cr2-sb-t">COMPÉTENCES</div>
          <div v-for="s in cv.skills.filter(s=>s.name)" :key="s.name" class="cr2-skill">
            <div class="cr2-sk-n">{{ s.name }}</div>
            <div class="cr2-sk-track"><div class="cr2-sk-fill" :style="{width:(s.level*25)+'%',background:accentColor}"></div></div>
          </div>
        </div>
        <div v-if="cv.languages.some(l=>l.name)" class="cr2-sb-sec">
          <div class="cr2-sb-t">LANGUES</div>
          <div v-for="l in cv.languages.filter(l=>l.name)" :key="l.name" class="cr2-lang">
            <span>{{ l.name }}</span><span style="color:#9b1c31;font-weight:700">{{ l.level }}</span>
          </div>
        </div>
        <div v-if="cv.aptitudes.some(a=>a.name)" class="cr2-sb-sec">
          <div class="cr2-sb-t">APTITUDES</div>
          <div v-for="a in cv.aptitudes.filter(a=>a.name)" :key="a.name" class="cr2-apt-item">
            <span class="cr2-apt-n">{{ a.name }}</span>
            <div class="cr2-apt-track"><div :style="{height:'100%',borderRadius:'99px',background:'#f59e0b',width:(a.level*25)+'%'}"></div></div>
          </div>
        </div>
        <div v-if="cv.centresInteret.some(c=>c.name)" class="cr2-sb-sec">
          <div class="cr2-sb-t">LOISIRS</div>
          <div v-for="c in cv.centresInteret.filter(c=>c.name)" :key="c.name" class="cr2-interest-item">{{ c.name }}</div>
        </div>
      </div>
    </div>
    <div class="cr2-main">
      <div class="cr2-main-name">{{ cv.firstName }} {{ cv.lastName }}</div>
      <div class="cr2-main-title">{{ cv.title }}</div>
      <div class="cr2-divider" :style="{background:`linear-gradient(to right,#9b1c31,${accentColor},transparent)`}"></div>
      <p v-if="cv.summary" class="cr2-summary">{{ cv.summary }}</p>
      <div v-if="cv.experiences.some(e=>e.position)" class="cr2-sec">
        <div class="cr2-sec-t">EXPÉRIENCES PROFESSIONNELLES</div>
        <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.id" class="cr2-entry">
          <div class="cr2-entry-top">
            <span class="cr2-pos">{{ e.position }}</span>
            <span class="cr2-date">{{ e.startDate }}{{ e.endDate ? ' – '+e.endDate : '' }}</span>
          </div>
          <div class="cr2-co">{{ e.company }}</div>
          <div v-if="hasBullets(e)" class="cr2-bullets">
            <div v-for="(b,bi) in getBullets(e)" :key="bi" class="cr2-bullet-line">
              <span class="cr2-bullet-dot"></span>
              <span class="cr2-bullet-text">{{ b }}</span>
            </div>
          </div>
          <p v-else-if="e.description" style="font-size:12.5px;color:#555;margin-top:3px;line-height:1.6">{{ e.description }}</p>
        </div>
      </div>
      <div v-if="cv.education.some(e=>e.degree)" class="cr2-sec">
        <div class="cr2-sec-t">FORMATION</div>
        <div v-for="e in cv.education.filter(e=>e.degree)" :key="e.id" class="cr2-entry">
          <div class="cr2-entry-top">
            <span class="cr2-pos">{{ e.degree }}</span>
            <span class="cr2-date">{{ e.anneeDebut && e.anneeFin ? e.anneeDebut+' – '+e.anneeFin : '' }}</span>
          </div>
          <div class="cr2-co">{{ e.school }}</div>
        </div>
      </div>
      <div v-if="cv.projects.some(p=>p.name)" class="cr2-sec">
        <div class="cr2-sec-t">PROJETS</div>
        <div v-for="p in cv.projects.filter(p=>p.name)" :key="p.name" class="cr2-entry">
          <div class="cr2-entry-top">
            <span class="cr2-pos">
              <a v-if="p.url" :href="addHttp(p.url)" target="_blank" style="color:#9b1c31">{{ p.name }}</a>
              <span v-else>{{ p.name }}</span>
            </span>
            <span v-if="p.tech" style="font-size:10.5px;color:#6b7280;font-style:italic">{{ p.tech }}</span>
          </div>
          <p v-if="p.description" style="font-size:12px;color:#555;margin-top:3px;line-height:1.6">{{ p.description }}</p>
        </div>
      </div>
    </div>
  </div>


  

  </div>
</template>

<script>
export default {
  name: 'TemplateCv',
  // props: {
  //   cv:          { type: Object,  required: true },
  //   selectedTpl: { type: String,  required: true },
  //   accentColor: { type: String,  required: true },
  // },

  props: {
  cv: {
    type: Object,
    required: false,
    default: () => ({
      firstName: '', lastName: '', title: '', email: '', phone: '',
      city: '', country: '', website: '', photo: '', summary: '',
      dateNaissance: '', age: '', nationality: '', yearsExp: '',
      skills: [], languages: [], aptitudes: [],
      centresInteret: [], experiences: [], education: [], projects: [],
    })
  },
  selectedTpl: { type: String,  required: false, default: 'classic'  },
  accentColor: { type: String,  required: false, default: '#2563eb'  },
},
  methods: {
    formatDate(d) {
      if (!d) return ''
      try { const [y,m,j] = d.split('-'); return `${j}/${m}/${y}` } catch { return d }
    },
    /**
     * Ajoute https:// si l'URL ne commence pas par http
     */
    addHttp(url) {
      if (!url) return '#'
      if (/^https?:\/\//i.test(url)) return url
      return 'https://' + url
    },
    hasBullets(e) {
      if (e.bullets && e.bullets.some(b => b && b.trim())) return true
      if (e.description) {
        const lines = e.description.split('\n').filter(l => l.trim())
        return lines.some(l => /^[-•*]\s/.test(l.trim()))
      }
      return false
    },
    langBarWidth(level) {
      const map = { 'Notions':'20%','Débutant':'30%','Intermédiaire':'55%','Avancé':'75%','Courant':'85%','Bilingue':'100%','Natif':'100%' }
      return map[level] || '60%'
    },
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
/* Police de base augmentée à 14px (légère augmentation) */
.cv-paper{width:794px;min-height:1123px;background:#fff;box-shadow:0 8px 40px rgba(0,0,0,.18);overflow:hidden;font-family:'DM Sans','Segoe UI',Arial,sans-serif;color:#1a1a1a;font-size:16px;line-height:1.55}

/* ══════════════════════════════════
   LIENS GLOBAUX — styles réutilisables
══════════════════════════════════ */
.cv-link-white{color:rgba(255,255,255,.85);text-decoration:underline;text-decoration-color:rgba(255,255,255,.35);text-underline-offset:2px;cursor:pointer}
.cv-link-white:hover{color:#fff;text-decoration-color:rgba(255,255,255,.8)}

.cv-link-muted{color:#6b7280;text-decoration:underline;text-decoration-color:rgba(107,114,128,.3);text-underline-offset:2px;cursor:pointer}
.cv-link-muted:hover{color:#374151;text-decoration-color:#374151}

.cv-link-accent{text-decoration:underline;text-decoration-color:currentColor;text-underline-offset:2px;cursor:pointer;font-weight:700}
.cv-link-accent:hover{opacity:.8}

.cv-link-neon{text-decoration:none;border-bottom:1px dashed currentColor;cursor:pointer}
.cv-link-neon:hover{opacity:.8}

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
  width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:6px}

.lux-bullet-line{gap:7px;align-items:flex-start}

.cc-bullet-text,.cm-bullet-text,.cmod-bullet-text,.corp-bullet-text,.eleg-bullet-text,
.dk-bullet-text,.tl-bullet-text,.sw-bullet-text,.cr-bullet-text,.tk-bullet-text,
.acad-bullet-text,.lux-bullet-text,.grad-bullet-text,.cp-bullet-text{
  font-size:12.5px;color:inherit;line-height:1.55}

/* ─────── 1. CLASSIQUE ─────── */
.cv-classic{display:flex;flex-direction:column;min-height:1123px}
.cc-hd{padding:28px 34px;display:flex;gap:18px;align-items:center}
/* Photo agrandie +40% : 74px → 104px */
.cc-photo{width:104px;height:104px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.35);flex-shrink:0}
.cc-name{color:#fff;font-size:26px;font-weight:800;margin:0 0 3px;letter-spacing:-.4px}
.cc-job{color:rgba(255,255,255,.82);font-size:14px;margin:0 0 4px}
.cc-dob{color:rgba(255,255,255,.65);font-size:12px;margin:0 0 6px}
.cc-contacts{display:flex;flex-wrap:wrap;gap:4px 12px}
.cc-contacts span,.cc-contacts a{color:rgba(255,255,255,.78);font-size:12px}
/* augmenter la taille de la colonne gauche */
.cc-body{display:grid;grid-template-columns:270px 1fr;flex:1} 
.cc-left{background:#f8fafc;padding:20px 14px;border-right:1px solid #e5e7eb}
.cc-right{padding:20px 24px}
.cc-sec{margin-bottom:18px}
.cc-sec-t{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-bottom:9px}
.cc-skill{margin-bottom:6px}
.cc-sk-lbl{font-size:12.5px;font-weight:600;color:#374151;margin-bottom:3px}
.cc-sk-track{height:4px;background:#e5e7eb;border-radius:99px;overflow:hidden}
.cc-sk-fill{height:100%;border-radius:99px}
.cc-lang{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:12.5px}
.cc-lang-lvl{color:#9ca3af;font-size:11.5px}
.cc-interests{display:flex;flex-wrap:wrap;gap:4px}
.cc-interest-tag{padding:2px 8px;border:1.5px solid;border-radius:99px;font-size:11.5px;font-weight:600}
.cc-txt{font-size:13px;color:#4b5563;line-height:1.7;margin:0}
.cc-entry{display:flex;gap:9px;margin-bottom:11px}
.cc-bar{width:3px;border-radius:2px;flex-shrink:0}
.cc-eb{flex:1}
.cc-et{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1px}
.cc-pos{font-size:13.5px;font-weight:700;color:#111}
.cc-date{font-size:11px;color:#9ca3af;white-space:nowrap;margin-left:6px;flex-shrink:0}
.cc-co{font-size:12px;color:#6b7280;margin-bottom:3px}
.cc-desc{font-size:12.5px;color:#555;line-height:1.6;margin:3px 0 0}
.cc-tech{font-size:10.5px;background:#f3f4f6;color:#6b7280;padding:1px 6px;border-radius:3px;white-space:nowrap}

/* ─────── 2. MINIMAL ─────── */
.cv-min{padding:46px 50px;min-height:1123px}
.cm-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
.cm-top-left{display:flex;align-items:center;gap:14px}
.cm-top-text{display:flex;flex-direction:column}
/* Photo agrandie : 68px → 95px */
.cm-photo{width:95px;height:95px;border-radius:50%;object-fit:cover;border:2px solid #e5e7eb;flex-shrink:0}
.cm-name{font-size:32px;font-weight:900;letter-spacing:-1px;color:#111;margin:0 0 5px;white-space:nowrap}
.cm-job{font-size:14.5px;color:#6b7280;margin:0 0 2px}
.cm-dob{font-size:12px;color:#9ca3af;margin:0}
.cm-contacts{text-align:right;display:flex;flex-direction:column;gap:3px}
.cm-contacts span,.cm-contacts a{font-size:12px;color:#6b7280}
.cm-div{height:2.5px;margin-bottom:16px;border-radius:99px}
.cm-summary{font-size:13.5px;color:#444;line-height:1.75;margin-bottom:20px}
.cm-sec{margin-bottom:20px}
.cm-sec-t{font-size:10px;font-weight:900;letter-spacing:1.5px;color:#9ca3af;margin-bottom:10px;border-bottom:1px solid #e5e7eb;padding-bottom:5px}
.cm-entry{display:grid;grid-template-columns:72px 1fr;gap:14px;margin-bottom:11px}
.cm-el .cm-date{font-size:11.5px;color:#9ca3af;line-height:1.5;padding-top:2px}
.cm-pos{font-size:14px;font-weight:700;color:#111;margin-bottom:2px}
.cm-co{font-size:12.5px;color:#6b7280;margin-bottom:2px}
.cm-desc{font-size:12.5px;color:#555;line-height:1.6;margin:0}
.cm-tags{display:flex;flex-wrap:wrap;gap:5px}
.cm-tag{padding:3px 11px;border:1.5px solid;border-radius:99px;font-size:12.5px;font-weight:600}
.cm-lang-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 24px}
.cm-lang-item{margin-bottom:4px}
.cm-lang-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px}
.cm-lang-name{font-size:13px;font-weight:600;color:#374151}
.cm-lang-lvl{font-size:11px;font-weight:700}
.cm-lang-bar-bg{height:4px;background:#e5e7eb;border-radius:99px;overflow:hidden}
.cm-lang-bar-fill{height:100%;border-radius:99px}
.cm-aptitudes-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 24px}
.cm-aptitude-item{margin-bottom:4px}
.cm-apt-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px}
.cm-apt-name{font-size:13px;font-weight:600;color:#374151}
.cm-bullets{display:flex;flex-direction:column;gap:3px;margin-top:4px}
.cm-bullet-line{display:flex;align-items:flex-start;gap:6px}
.cm-bullet-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:6px}

/* ─────── 3. MODERNE ─────── */
.cv-mod{display:grid;grid-template-columns:280px 1fr;min-height:1123px}
.cmod-aside{padding:28px 16px;display:flex;flex-direction:column}
.cmod-photo-wrap{display:flex;justify-content:center;margin-bottom:13px}
/* Photo agrandie : 84px → 118px */
.cmod-photo{width:118px;height:118px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.3)}
.cmod-init{width:118px;height:118px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:#fff}
.cmod-name{color:#fff;font-size:19px;font-weight:900;text-align:center;line-height:1.2;margin:0 0 4px}
.cmod-job{color:rgba(255,255,255,.72);font-size:12px;text-align:center;margin-bottom:4px}
.cmod-dob{color:rgba(255,255,255,.55);font-size:11px;text-align:center;margin-bottom:12px}
.cmod-blk{margin-bottom:14px}
.cmod-blk-t{font-size:9px;font-weight:900;letter-spacing:1.3px;color:rgba(255,255,255,.45);margin-bottom:6px;text-transform:uppercase}
.cmod-item{font-size:11.5px;color:rgba(255,255,255,.78);margin-bottom:4px;word-break:break-all}
.cmod-skill{margin-bottom:6px}
.cmod-sk-n{font-size:12px;color:rgba(255,255,255,.85);margin-bottom:3px;font-weight:600}
.cmod-dots{display:flex;gap:3px}
.cmod-dot{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.2)}
.cmod-dot.filled{background:rgba(255,255,255,.85)}
.cmod-lang{display:flex;justify-content:space-between;font-size:11.5px;color:rgba(255,255,255,.78);margin-bottom:3px}
.cmod-lang-lvl{color:rgba(255,255,255,.45)}
.cmod-interests{display:flex;flex-wrap:wrap;gap:4px}
.cmod-interest{font-size:10.5px;color:rgba(255,255,255,.7);background:rgba(255,255,255,.12);padding:2px 8px;border-radius:99px}
.cmod-main{padding:26px 22px;background:#fff}
.cmod-sec{margin-bottom:18px}
.cmod-sec-t{font-size:10px;font-weight:900;letter-spacing:1px;margin-bottom:10px;text-transform:uppercase}
.cmod-txt{font-size:13px;color:#4b5563;line-height:1.7;margin:0}
.cmod-entry{display:flex;gap:9px;margin-bottom:10px}
.cmod-dot-b{width:8px;height:8px;border-radius:50%;margin-top:4px;flex-shrink:0}
.cmod-eb{flex:1}
.cmod-et{display:flex;justify-content:space-between;align-items:flex-start}
.cmod-pos{font-size:13.5px;font-weight:700;color:#111}
.cmod-date{font-size:11px;color:#9ca3af;white-space:nowrap;margin-left:6px}
.cmod-co{font-size:12px;color:#6b7280;margin:2px 0 3px}
.cmod-desc{font-size:12.5px;color:#555;line-height:1.6;margin:0}
.cmod-proj{margin-bottom:9px;padding:8px;background:#f8fafc;border-radius:6px}
.cmod-proj-hd{display:flex;justify-content:space-between;margin-bottom:3px}
.cmod-tech{font-size:11px;color:#9ca3af}

/* ─────── 4. CORPORATE ─────── */
.cv-corp{display:flex;flex-direction:column;min-height:1123px}
.corp-top{display:flex;align-items:center;gap:18px;padding:26px 34px}
.corp-photo-wrap{flex-shrink:0}
/* Photo agrandie : 68px → 95px */
.corp-photo-img{width:95px;height:95px;border-radius:10px;object-fit:cover;border:2px solid #e5e7eb}
.corp-avatar{width:95px;height:95px;border-radius:10px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#6b7280}
.corp-name{font-size:24px;font-weight:900;color:#111;letter-spacing:-.4px;margin:0 0 3px}
.corp-job{font-size:14px;font-weight:700;margin:0 0 6px}
.corp-contacts{display:flex;flex-wrap:wrap;gap:3px 12px}
.corp-contacts span,.corp-contacts a{font-size:12px;color:#6b7280}
.corp-bar{height:4px}
.corp-body{display:grid;grid-template-columns:280px 1fr;flex:1}
.corp-left{padding:20px 14px;background:#fafafa;border-right:1px solid #e5e7eb}
.corp-right{padding:20px 24px}
.corp-sec{margin-bottom:18px}
.corp-sec-t{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1px;border-left:3px solid;padding-left:8px;margin-bottom:10px}
.corp-txt{font-size:13px;color:#4b5563;line-height:1.7;margin:0}
.corp-skill{margin-bottom:6px}
.corp-sk-lbl{font-size:12.5px;font-weight:600;color:#374151;margin-bottom:3px}
.corp-sk-track{height:4px;background:#e5e7eb;border-radius:99px;overflow:hidden}
.corp-sk-fill{height:100%;border-radius:99px}
.corp-lang{display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:12.5px}
.corp-lang-lvl{color:#fff;font-size:10px;padding:2px 6px;border-radius:99px;font-weight:700}
.corp-interests{display:flex;flex-wrap:wrap;gap:4px}
.corp-interest-tag{font-size:11px;color:#6b7280;background:#f3f4f6;padding:2px 7px;border-radius:3px}
.corp-entry{margin-bottom:12px}
.corp-et{display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;gap:6px}
.corp-ep{font-size:13.5px;font-weight:700;color:#111}
.corp-ed{font-size:10.5px;font-weight:600;padding:2px 7px;border-radius:99px;white-space:nowrap;flex-shrink:0}
.corp-eco{font-size:12px;color:#6b7280;margin-bottom:2px}

/* ─────── 5. ÉLÉGANT ─────── */
.cv-eleg{display:flex;flex-direction:column;min-height:1123px}
.eleg-hd{padding:28px 34px;display:flex;gap:20px;align-items:center;border-bottom:3px solid}
.eleg-photo-wrap{flex-shrink:0}
/* Photo agrandie : 78px → 109px */
.eleg-photo{width:109px;height:109px;border-radius:10px;object-fit:cover}
.eleg-init{width:109px;height:109px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900}
.eleg-hi{flex:1}
.eleg-name{font-size:28px;font-weight:400;color:#111;margin:0 0 4px;letter-spacing:-.3px}
.eleg-name strong{font-weight:800}
.eleg-job{font-size:14.5px;font-weight:600;margin:0 0 8px}
.eleg-contacts{display:flex;flex-wrap:wrap;gap:4px 14px}
.eleg-contacts span,.eleg-contacts a{font-size:12px;color:#6b7280}
.eleg-body{display:grid;grid-template-columns:280px 1fr}
.eleg-left{padding:20px 14px;background:#fafafa;border-right:1px solid #eee}
.eleg-right{padding:20px 24px}
.eleg-sec{margin-bottom:18px}
.eleg-sec-t{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-bottom:9px;padding-bottom:4px;border-bottom:1.5px solid currentColor}
.eleg-txt{font-size:13px;color:#555;line-height:1.7;margin:0}
.eleg-skill{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px}
.eleg-sk-n{font-size:13px;font-weight:600;color:#333}
.eleg-dots{display:flex;gap:3px}
.eleg-dot{width:9px;height:9px;border-radius:50%}
.eleg-lang{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:13px}
.eleg-lang-lvl{color:#9ca3af;font-size:12px}
.eleg-interests{display:flex;flex-wrap:wrap;gap:4px}
.eleg-interest{font-size:11.5px;color:#6b7280;background:#f3f4f6;padding:2px 8px;border-radius:99px}
.eleg-entry{display:flex;gap:10px;margin-bottom:12px}
.eleg-marker{width:3px;border-radius:2px;flex-shrink:0;margin-top:3px;min-height:12px}
.eleg-et{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1px}
.eleg-pos{font-size:14px;font-weight:700;color:#111}
.eleg-date{font-size:11px;color:#9ca3af;white-space:nowrap;margin-left:8px;flex-shrink:0}
.eleg-co{font-size:12.5px;color:#6b7280;margin-bottom:2px}
.eleg-desc{font-size:13px;color:#555;line-height:1.6;margin:2px 0 0}
.eleg-proj{margin-bottom:9px}
.eleg-proj-n{font-size:14px;font-weight:700;color:#111;margin-bottom:2px}
.eleg-proj-tech{font-size:10.5px;color:#9ca3af;background:#f3f4f6;padding:1px 6px;border-radius:3px;margin-left:6px;font-weight:400}

/* ─────── 6. DARK ─────── */
.cv-dark{display:flex;flex-direction:column;min-height:1123px;background:#111827}
.dk-hd{padding:28px 34px;display:flex;gap:18px;align-items:center;background:#1f2937}
/* Photo agrandie : 74px → 104px */
.dk-photo{width:104px;height:104px;border-radius:50%;object-fit:cover;flex-shrink:0}
.dk-photo-wrap{flex-shrink:0}
.dk-init{width:104px;height:104px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;flex-shrink:0;background:#111827}
.dk-name{color:#f9fafb;font-size:26px;font-weight:800;margin:0 0 3px;letter-spacing:-.4px}
.dk-job{font-size:14px;font-weight:700;margin:0 0 9px}
.dk-contacts{display:flex;flex-wrap:wrap;gap:4px 12px}
.dk-contacts span,.dk-contacts a{color:#9ca3af;font-size:12px}
.dk-divline{height:1px}
.dk-body{display:grid;grid-template-columns:280px 1fr;flex:1}
.dk-left{padding:20px 14px;background:#1f2937;border-right:1px solid #374151}
.dk-right{padding:20px 24px}
.dk-sec{margin-bottom:18px}
.dk-sec-t{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-bottom:9px}
.dk-skill{margin-bottom:7px}
.dk-sk-n{font-size:12.5px;font-weight:600;color:#d1d5db;margin-bottom:3px}
.dk-sk-track{height:4px;background:#374151;border-radius:99px;overflow:hidden}
.dk-sk-fill{height:100%;border-radius:99px}
.dk-lang{display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid #374151;font-size:12.5px;color:#d1d5db}
.dk-lang-lvl{font-size:10.5px;padding:2px 7px;border-radius:99px;font-weight:600}
.dk-interests{display:flex;flex-wrap:wrap;gap:4px}
.dk-interest{font-size:11px;padding:2px 8px;border-radius:99px;font-weight:600}
.dk-txt{font-size:13px;color:#9ca3af;line-height:1.7;margin:0}
.dk-entry{display:flex;gap:10px;margin-bottom:12px}
.dk-entry-dot{width:8px;height:8px;border-radius:50%;margin-top:4px;flex-shrink:0}
.dk-et{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1px}
.dk-pos{font-size:13.5px;font-weight:700;color:#f3f4f6}
.dk-date{font-size:11px;white-space:nowrap;margin-left:6px;flex-shrink:0;font-weight:600}
.dk-co{font-size:12px;color:#6b7280;margin-bottom:3px}
.dk-desc{font-size:12.5px;line-height:1.6;margin:2px 0 0}
.dk-proj{margin-bottom:10px;padding:10px;background:#1f2937;border-radius:7px}
.dk-proj-n{font-size:14px;font-weight:700;color:#f3f4f6;margin-bottom:4px}
.dk-tech{font-size:10.5px;padding:2px 7px;border-radius:4px;margin-left:7px;font-weight:600}

/* ─────── 7. TIMELINE ─────── */
.cv-tl{display:flex;flex-direction:column;min-height:1123px}
.tl-hd{padding:24px 32px;border-left:6px solid;background:#fafafa}
.tl-hd-inner{display:flex;align-items:center;gap:16px;margin-bottom:10px}
/* Photo agrandie : 64px → 90px */
.tl-photo{width:90px;height:90px;border-radius:50%;object-fit:cover;flex-shrink:0}
.tl-init{width:90px;height:90px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#fff;flex-shrink:0}
.tl-name{font-size:24px;font-weight:800;color:#111;margin:0 0 2px}
.tl-job{font-size:14px;font-weight:700;margin:0}
.tl-dob{font-size:12px;color:#9ca3af;margin:3px 0 0}
.tl-contacts{display:flex;flex-wrap:wrap;gap:4px 14px}
.tl-contacts span,.tl-contacts a{font-size:12px;color:#6b7280}
.tl-body{display:grid;grid-template-columns:280px 1fr;flex:1}
.tl-left{padding:20px 14px;background:#fafafa;border-right:1px solid #e5e7eb}
.tl-right{padding:20px 24px}
.tl-sec{margin-bottom:20px}
.tl-sec-t{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px}
.tl-summary{font-size:13px;color:#555;line-height:1.7;margin-bottom:16px}
.tl-skill{margin-bottom:7px}
.tl-sk-n{font-size:12.5px;font-weight:600;color:#374151;margin-bottom:3px}
.tl-sk-track{height:4px;background:#e5e7eb;border-radius:99px;overflow:hidden}
.tl-sk-fill{height:100%;border-radius:99px}
.tl-lang{display:flex;justify-content:space-between;font-size:12.5px;padding:4px 0;border-bottom:1px solid #f0f0f0}
.tl-interests{display:flex;flex-wrap:wrap;gap:4px}
.tl-interest{padding:2px 8px;border-radius:99px;font-size:11.5px;font-weight:600}
.tl-item{display:flex;gap:0;margin-bottom:16px;position:relative;padding-left:24px}
.tl-node{width:10px;height:10px;border-radius:50%;position:absolute;left:0;top:3px;flex-shrink:0}
.tl-line-v{position:absolute;left:4px;top:14px;bottom:-14px;width:0;border-left:1.5px dashed}
.tl-content{flex:1}
.tl-date-badge{display:inline-block;font-size:11px;font-weight:700;padding:2px 9px;border-radius:99px;margin-bottom:4px}
.tl-pos{font-size:14px;font-weight:700;color:#111;margin-bottom:1px}
.tl-co{font-size:12px;color:#6b7280;margin-bottom:3px}
.tl-desc{font-size:12.5px;color:#555;line-height:1.6;margin:0}

/* ─────── 8. SWISS ─────── */
.cv-swiss{display:flex;flex-direction:column;min-height:1123px;background:#fff}
.sw-top-bar{height:6px}
.sw-header{display:flex;gap:20px;align-items:center;padding:28px 36px 20px}
.sw-hd-left{flex-shrink:0}
/* Photo agrandie : 80px → 112px */
.sw-photo{width:112px;height:112px;border-radius:4px;object-fit:cover}
.sw-init{width:112px;height:112px;border-radius:4px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900}
.sw-hd-right{flex:1}
.sw-name{font-size:30px;font-weight:900;letter-spacing:-1px;color:#111;margin:0 0 4px;line-height:1.1}
.sw-title{font-size:15px;font-weight:500;color:#555;margin:0 0 10px}
.sw-contacts{display:flex;flex-wrap:wrap;gap:3px 16px}
.sw-contacts span,.sw-contacts a{font-size:12px;color:#888}
.sw-divider{height:1px;margin:0 36px 0}
.sw-body{display:grid;grid-template-columns:280px 1fr;flex:1;padding:20px 0}
.sw-left{padding:0 16px 0 36px;border-right:1px solid #f0f0f0}
.sw-right{padding:0 36px 0 28px}
.sw-sec{margin-bottom:22px}
.sw-profile{padding-bottom:18px;border-bottom:1px solid #f0f0f0;margin-bottom:22px}
.sw-sec-t{font-size:9.5px;font-weight:900;text-transform:uppercase;letter-spacing:1.8px;margin-bottom:10px}
.sw-summary{font-size:13.5px;color:#444;line-height:1.75;margin:0}
.sw-skill{display:flex;align-items:center;gap:8px;margin-bottom:7px}
.sw-sk-name{font-size:13px;font-weight:600;color:#333;min-width:80px}
.sw-sk-bar{flex:1;height:3px;background:#e5e7eb;border-radius:99px;overflow:hidden}
.sw-sk-fill{height:100%;border-radius:99px}
.sw-lang{display:flex;justify-content:space-between;font-size:12.5px;padding:4px 0;border-bottom:1px solid #f5f5f5}
.sw-lang-lvl{color:#999;font-size:11.5px}
.sw-edu{display:flex;gap:10px;margin-bottom:10px}
.sw-edu-year{font-size:12px;font-weight:700;min-width:50px;padding-top:1px}
.sw-edu-deg{font-size:13.5px;font-weight:700;color:#111}
.sw-edu-school{font-size:12px;color:#777}
.sw-interests{display:flex;flex-direction:column;gap:3px}
.sw-interest{font-size:12.5px;color:#555}
.sw-interests .sw-interest::before{content:'— ';opacity:.4}
.sw-exp{margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #f5f5f5}
.sw-exp:last-child{border-bottom:none}
.sw-exp-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px}
.sw-exp-pos{font-size:14px;font-weight:700;color:#111}
.sw-exp-co{font-size:12.5px;color:#666;margin-bottom:4px}
.sw-exp-date{font-size:11.5px;font-weight:600;white-space:nowrap;flex-shrink:0;margin-left:8px}
.sw-exp-desc{font-size:12.5px;color:#555;line-height:1.65;margin:0}

/* ─────── 9. CRÉATIF ─────── */
.cv-creative{display:flex;flex-direction:column;min-height:1123px}
.cr-hero{position:relative;padding:0;overflow:hidden}
.cr-hero-content{display:flex;align-items:center;gap:24px;padding:32px 34px 28px}
.cr-hero-wave{position:absolute;bottom:-1px;left:0;right:0;height:24px;background:#fff;clip-path:ellipse(55% 100% at 50% 100%)}
.cr-photo-wrap{flex-shrink:0}
/* Photo agrandie : 88px → 123px */
.cr-photo{width:123px;height:123px;border-radius:50%;object-fit:cover;border:4px solid rgba(255,255,255,.4)}
.cr-init{width:123px;height:123px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:900;color:#fff;border:3px solid rgba(255,255,255,.3)}
.cr-hero-text{color:#fff}
.cr-name{font-size:32px;font-weight:900;line-height:1.1;margin:0 0 8px;white-space:nowrap}
.cr-title-badge{display:inline-block;background:rgba(255,255,255,.25);backdrop-filter:blur(4px);padding:4px 14px;border-radius:99px;font-size:13px;font-weight:600;color:#fff;margin:0}
.cr-contacts-bar{display:flex;flex-wrap:wrap;gap:5px 16px;padding:12px 34px;background:#f8f9fa;border-bottom:1px solid #eee}
.cr-contacts-bar span,.cr-contacts-bar a{font-size:12px;color:#666}
.cr-body{display:grid;grid-template-columns:280px 1fr;flex:1}
.cr-left{padding:20px 14px;background:#fafafa;border-right:1px solid #eee}
.cr-right{padding:20px 22px}
.cr-sec{margin-bottom:18px}
.cr-sec-t{display:inline-block;font-size:9.5px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:#fff;padding:3px 10px;border-radius:4px;margin-bottom:10px}
.cr-summary{font-size:13px;color:#444;line-height:1.7;margin:0}
.cr-skill-tags{display:flex;flex-wrap:wrap;gap:5px}
.cr-skill-tag{padding:3px 10px;border:1.5px solid;border-radius:99px;font-size:12px;font-weight:600}
.cr-lang{display:flex;justify-content:space-between;font-size:13px;padding:5px 0;border-bottom:1px solid #eee;align-items:center}
.cr-lang-lvl{font-size:11px;font-weight:700;padding:2px 8px;border-radius:99px}
.cr-exp{display:flex;gap:10px;margin-bottom:14px}
.cr-exp-dot{width:9px;height:9px;border-radius:50%;margin-top:4px;flex-shrink:0}
.cr-exp-body{flex:1}
.cr-exp-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px}
.cr-exp-pos{font-size:14px;font-weight:700;color:#111}
.cr-exp-date{font-size:11px;font-weight:600;white-space:nowrap;margin-left:6px}
.cr-exp-co{font-size:12px;color:#6b7280;margin-bottom:3px}
.cr-exp-desc{font-size:12.5px;color:#555;line-height:1.6;margin:0}
.cr-proj{margin-bottom:10px;padding:10px 12px;background:#f8f9fa;border-radius:6px;border-left:3px solid}
.cr-proj-name{font-size:14px;font-weight:700;color:#111}
.cr-proj-tech{font-size:11px;color:#888;background:#eee;padding:1px 7px;border-radius:3px;margin-left:8px;font-weight:400}

/* ─────── 10. TECH ─────── */
.cv-tech{display:flex;flex-direction:column;min-height:1123px;background:#0d1117;color:#c9d1d9}
.tk-header{border-bottom:1px solid #30363d}
.tk-terminal-bar{display:flex;align-items:center;gap:6px;padding:8px 16px;background:#161b22;border-bottom:1px solid #30363d}
.tk-dot{width:10px;height:10px;border-radius:50%}
.tk-dot.red{background:#ff5f56}.tk-dot.yellow{background:#ffbd2e}.tk-dot.green{background:#27c93f}
.tk-terminal-title{font-size:12px;color:#8b949e;margin-left:8px;font-family:monospace}
.tk-hd-body{display:flex;gap:20px;align-items:center;padding:20px 24px}
.tk-hd-left{flex-shrink:0}
/* Photo agrandie : 80px → 112px */
.tk-photo{width:112px;height:112px;border-radius:8px;object-fit:cover;border:2px solid #30363d}
.tk-init{width:112px;height:112px;border-radius:8px;border:2px solid;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;background:#161b22}
.tk-hd-info{flex:1}
.tk-prompt{font-size:12.5px;color:#8b949e;font-family:monospace;margin-bottom:2px}
.tk-prompt-symbol{font-weight:700;margin-right:6px}
.tk-name{font-size:24px;font-weight:800;color:#f0f6fc;margin:0 0 4px;font-family:monospace}
.tk-role{font-size:14px;font-weight:600;margin:0 0 10px;font-family:monospace}
.tk-contacts{display:flex;flex-wrap:wrap;gap:4px 16px}
.tk-contacts span,.tk-contacts a{font-size:12px;color:#8b949e;font-family:monospace}
.tk-body{display:grid;grid-template-columns:280px 1fr;flex:1}
.tk-left{padding:20px 14px;background:#161b22;border-right:1px solid #30363d}
.tk-right{padding:20px 22px}
.tk-sec{margin-bottom:20px}
.tk-sec-t{font-size:12px;font-weight:700;font-family:monospace;margin-bottom:10px;letter-spacing:.5px}
.tk-skill{display:flex;align-items:center;gap:8px;margin-bottom:7px}
.tk-sk-name{font-size:12.5px;color:#c9d1d9;min-width:70px;font-family:monospace}
.tk-sk-bar{flex:1;height:3px;background:#30363d;border-radius:99px;overflow:hidden}
.tk-sk-fill{height:100%;border-radius:99px}
.tk-lang{display:flex;justify-content:space-between;font-size:12.5px;color:#c9d1d9;padding:4px 0;border-bottom:1px solid #21262d;font-family:monospace}
.tk-lang-lvl{font-size:11px}
.tk-edu{margin-bottom:10px}
.tk-edu-year{font-size:11.5px;font-family:monospace;font-weight:700;margin-bottom:1px}
.tk-edu-deg{font-size:13px;font-weight:700;color:#f0f6fc}
.tk-edu-school{font-size:12px;color:#8b949e}
.tk-interests{display:flex;flex-wrap:wrap;gap:4px}
.tk-interest{font-size:11px;padding:2px 8px;border-radius:3px;font-family:monospace;font-weight:600}
.tk-summary{font-size:13px;color:#8b949e;line-height:1.7;margin:0;font-family:monospace}
.tk-exp{margin-bottom:14px;padding:12px;background:#161b22;border-radius:6px;border:1px solid #30363d}
.tk-exp-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
.tk-exp-pos{font-size:14px;font-weight:700;color:#f0f6fc;font-family:monospace}
.tk-exp-date{font-size:11px;font-family:monospace;white-space:nowrap}
.tk-exp-co{font-size:12.5px;color:#8b949e;margin-bottom:5px;font-family:monospace}
.tk-exp-desc{font-size:12.5px;color:#8b949e;line-height:1.6;margin:0}
.tk-proj{margin-bottom:12px;padding:10px;background:#161b22;border-radius:6px;border:1px solid #30363d}
.tk-proj-head{display:flex;align-items:center;gap:8px;margin-bottom:5px}
.tk-proj-name{font-size:14px;font-weight:700;color:#f0f6fc;font-family:monospace}
.tk-proj-tech{font-size:10.5px;font-family:monospace;padding:2px 8px;border-radius:4px;font-weight:600}

/* ─────── 11. ACADÉMIQUE ─────── */
.cv-academic{display:flex;flex-direction:column;min-height:1123px;background:#fff}
.acad-header{display:flex;gap:22px;padding:28px 36px 22px;border-top:4px solid;border-bottom:1px solid #e5e7eb}
.acad-hd-left{flex-shrink:0}
/* Photo agrandie : 82px → 115px */
.acad-photo{width:115px;height:115px;border-radius:8px;object-fit:cover}
.acad-init{width:115px;height:115px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900}
.acad-hd-right{flex:1}
.acad-name{font-size:28px;font-weight:700;color:#111;margin:0 0 4px;font-family:'Georgia',serif;letter-spacing:-.3px}
.acad-lastname{font-style:italic}
.acad-title{font-size:14px;color:#555;margin:0 0 10px;font-style:italic}
.acad-meta{display:flex;flex-wrap:wrap;gap:3px 14px}
.acad-meta span,.acad-meta a{font-size:12px;color:#6b7280}
.acad-divider{padding:0 36px}
.acad-div-line{height:1px;margin:0}
.acad-body{display:grid;grid-template-columns:1fr 280px;padding:22px 36px;gap:28px;flex:1}
.acad-sec{margin-bottom:22px}
.acad-sec-t{font-size:10.5px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;padding-bottom:5px;border-bottom:1.5px solid;font-family:'Georgia',serif}
.acad-txt{font-size:13.5px;color:#444;line-height:1.75;margin:0}
.acad-entry{display:flex;gap:14px;margin-bottom:12px}
.acad-entry-year{font-size:11.5px;font-weight:700;min-width:55px;padding-top:2px;font-family:'Georgia',serif}
.acad-entry-body{flex:1}
.acad-degree{font-size:14px;font-weight:700;color:#111;margin-bottom:2px;font-family:'Georgia',serif}
.acad-school{font-size:12.5px;color:#6b7280;margin-bottom:2px}
.acad-desc{font-size:12.5px;color:#555;line-height:1.6;margin:3px 0 0}
.acad-pub{display:flex;gap:9px;margin-bottom:8px;padding:8px;background:#f9fafb;border-radius:5px}
.acad-pub-bullet{width:4px;border-radius:2px;flex-shrink:0;margin-top:3px}
.acad-pub-tech{font-style:italic;color:#9ca3af;font-size:12px}
.acad-skill{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.acad-skill-name{font-size:13px;color:#374151}
.acad-skill-dots{display:flex;gap:2px}
.acad-lang{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:13px}
.acad-lang-lvl{color:#9ca3af;font-size:11.5px;font-style:italic}
.acad-interests{display:flex;flex-wrap:wrap;gap:5px}
.acad-interest{padding:3px 9px;border:1.5px solid;border-radius:99px;font-size:12px;font-weight:600}

/* ─────── 12. LUXE ─────── */
.cv-luxury{display:flex;flex-direction:column;min-height:1123px;background:#fafaf8}
.lux-top{padding:30px 36px 20px;text-align:center;background:#fff;border-bottom:1px solid #e8e0d5}
.lux-ornament{font-size:12px;letter-spacing:6px;margin-bottom:10px;opacity:.5}
.lux-photo-area{display:flex;justify-content:center;margin-bottom:12px}
/* Photo agrandie : 88px → 123px */
.lux-photo{width:123px;height:123px;border-radius:50%;object-fit:cover;border:3px solid;border-color:#d4b896}
.lux-name{font-family:'Georgia',serif;font-size:28px;font-weight:400;letter-spacing:3px;color:#1a1a1a;text-transform:uppercase;margin:0 0 6px}
.lux-title{font-family:'Georgia',serif;font-size:14px;color:#7a6a55;font-style:italic;margin:0 0 12px}
.lux-rule{display:flex;align-items:center;gap:8px;margin:12px auto;max-width:300px}
.lux-rule-line{flex:1;height:1px}
.lux-rule-diamond{width:6px;height:6px;transform:rotate(45deg);flex-shrink:0}
.lux-contacts{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:4px 8px;font-size:12px;color:#666;margin-bottom:4px}
.lux-contacts a{font-size:12px}
.lux-sep{font-size:8px}
.lux-dob{font-size:12px;color:#9ca3af;margin-top:4px;font-style:italic}
.lux-body{display:grid;grid-template-columns:280px 1fr;flex:1}
.lux-left{padding:22px 16px;background:#fff;border-right:1px solid #e8e0d5}
.lux-right{padding:22px 28px}
.lux-sec{margin-bottom:20px}
.lux-sec-t{font-family:'Georgia',serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;padding-bottom:5px;border-bottom:1px solid currentColor}
.lux-skill{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;padding:3px 0}
.lux-skill-name{font-size:13px;color:#374151}
.lux-diamonds{display:flex;gap:1px}
.lux-lang{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f0ebe4;font-size:13px}
.lux-lang-lvl{font-size:11.5px;font-style:italic}
.lux-interest{display:flex;align-items:center;gap:6px;font-size:13px;color:#555;margin-bottom:5px}
.lux-txt{font-size:13px;color:#444;line-height:1.75;margin:0;font-family:'Georgia',serif}
.lux-entry{display:flex;gap:10px;margin-bottom:14px}
.lux-entry-marker{width:2px;flex-shrink:0;margin-top:3px}
.lux-entry-body{flex:1}
.lux-entry-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px}
.lux-pos{font-size:14px;font-weight:700;color:#111;font-family:'Georgia',serif}
.lux-date{font-size:11px;font-style:italic;white-space:nowrap;margin-left:8px;flex-shrink:0}
.lux-co{font-size:12.5px;color:#7a6a55;margin-bottom:3px}
.lux-desc{font-size:12.5px;color:#555;line-height:1.65;margin:2px 0 0}
.lux-proj{margin-bottom:10px;padding:8px 12px;border-left:2px solid;border-radius:0 4px 4px 0;background:#fff}
.lux-proj-name{font-size:14px;font-weight:700;color:#111;font-family:'Georgia',serif}
.lux-tech{font-size:11px;color:#9ca3af;margin-left:8px;font-style:italic}

/* ─────── 13. GRADIENT SIDEBAR ─────── */
.cv-gradient{display:grid;grid-template-columns:280px 1fr;min-height:1123px}
.grad-aside{padding:28px 18px;display:flex;flex-direction:column}
.grad-photo-wrap{display:flex;justify-content:center;margin-bottom:14px}
/* Photo agrandie : 86px → 120px */
.grad-photo{width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.35)}
.grad-init{width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;color:#fff}
.grad-name{color:#fff;font-size:18px;font-weight:400;text-align:center;line-height:1.2;margin:0 0 4px}
.grad-name strong{font-weight:900}
.grad-title{color:rgba(255,255,255,.75);font-size:12px;text-align:center;margin-bottom:4px}
.grad-dob{color:rgba(255,255,255,.55);font-size:11px;text-align:center;margin-bottom:10px}
.grad-divider{height:1px;background:rgba(255,255,255,.2);margin:12px 0}
.grad-contact-block{display:flex;flex-direction:column;gap:6px}
.grad-contact-item{display:flex;align-items:flex-start;gap:7px;font-size:11.5px;color:rgba(255,255,255,.8)}
.grad-ci-icon{flex-shrink:0;margin-top:1px}
.grad-contact-item a{color:rgba(255,255,255,.8)}
.grad-blk{margin-bottom:12px}
.grad-blk-t{font-size:9px;font-weight:900;letter-spacing:1.3px;color:rgba(255,255,255,.45);margin-bottom:7px;text-transform:uppercase}
.grad-lang{display:flex;justify-content:space-between;font-size:11.5px;color:rgba(255,255,255,.8);margin-bottom:3px}
.grad-lang-lvl{color:rgba(255,255,255,.5)}
.grad-interests{display:flex;flex-wrap:wrap;gap:4px}
.grad-interest{font-size:11px;color:rgba(255,255,255,.8);background:rgba(255,255,255,.15);padding:2px 8px;border-radius:99px}
.grad-main{padding:26px 24px;background:#fff}
.grad-sec{margin-bottom:20px}
.grad-sec-t{font-size:10.5px;font-weight:900;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px}
.grad-sec-bar{height:2.5px;border-radius:99px;margin-bottom:12px}
.grad-txt{font-size:13px;color:#4b5563;line-height:1.75;margin:0}
.grad-skills-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.grad-skill{margin-bottom:4px}
.grad-sk-top{display:flex;justify-content:space-between;margin-bottom:3px}
.grad-sk-name{font-size:12.5px;font-weight:600;color:#374151}
.grad-sk-pct{font-size:11px;font-weight:700}
.grad-sk-track{height:4px;background:#e5e7eb;border-radius:99px;overflow:hidden}
.grad-sk-fill{height:100%;border-radius:99px}
.grad-entry{display:flex;gap:10px;margin-bottom:14px;position:relative;padding-left:18px}
.grad-entry-line{position:absolute;left:5px;top:14px;bottom:-14px;width:1px}
.grad-entry-dot{position:absolute;left:0;top:4px;width:10px;height:10px;border-radius:50%;flex-shrink:0}
.grad-entry-body{flex:1}
.grad-entry-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px;flex-wrap:wrap;gap:4px}
.grad-pos{font-size:13.5px;font-weight:700;color:#111}
.grad-date{font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:99px;white-space:nowrap}
.grad-co{font-size:12px;color:#6b7280;margin-bottom:3px}
.grad-desc{font-size:12.5px;color:#555;line-height:1.6;margin:0}
.grad-proj{margin-bottom:10px;padding:10px;background:#f8fafc;border-radius:7px}
.grad-proj-name{font-size:14px;font-weight:700;color:#111;margin-bottom:4px}
.grad-proj-tech{font-size:10.5px;font-weight:700;padding:2px 7px;border-radius:4px;margin-left:7px}

/* ─────── 14. COMPACT PRO ─────── */
.cv-compact{display:flex;flex-direction:column;min-height:1123px;background:#fff}
.cp-header{display:flex;gap:16px;align-items:center;padding:20px 28px;border-bottom:3px solid}
.cp-photo-area{flex-shrink:0}
/* Photo agrandie : 68px → 95px */
.cp-photo{width:95px;height:95px;border-radius:8px;object-fit:cover}
.cp-init{width:95px;height:95px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900}
.cp-hd-center{flex:1}
.cp-name{font-size:23px;font-weight:400;color:#111;margin:0 0 3px;letter-spacing:-.3px}
.cp-title{font-size:14px;color:#555;margin:0}
.cp-hd-right{display:flex;flex-direction:column;gap:3px;min-width:210px}
.cp-contact-line{font-size:12px;color:#555;display:flex;align-items:center;gap:5px}
.cp-contact-line a{font-size:12px}
.cp-cl-icon{font-size:11px}
.cp-summary-bar{background:#f8fafc;border-bottom:1px solid #e5e7eb;padding:10px 28px}
.cp-summary-txt{font-size:13px;color:#555;line-height:1.65;margin:0}
.cp-body{display:grid;grid-template-columns:1fr 280px;flex:1}
.cp-main{padding:18px 24px}
.cp-aside{padding:18px 16px;background:#f9fafb;border-left:1px solid #e5e7eb}
.cp-sec{margin-bottom:18px}
.cp-sec-t{font-size:9.5px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:#fff;padding:3px 8px;border-radius:3px;display:inline-block;margin-bottom:10px}
.cp-entry{display:flex;gap:12px;margin-bottom:14px}
.cp-entry-left{display:flex;flex-direction:column;align-items:flex-end;gap:0;min-width:48px}
.cp-entry-dates{font-size:11px;font-weight:700;text-align:right;line-height:1.4}
.cp-entry-vline{flex:1;border-left:1.5px dashed;margin:4px 0;min-height:8px;align-self:center}
.cp-entry-body{flex:1}
.cp-entry-pos{font-size:13.5px;font-weight:700;color:#111;margin-bottom:2px}
.cp-entry-co{font-size:12px;color:#6b7280;margin-bottom:3px}
.cp-entry-desc{font-size:12.5px;color:#555;line-height:1.6;margin:2px 0 0}
.cp-proj{margin-bottom:10px;padding:8px;background:#fff;border-radius:5px;border:1px solid #e5e7eb}
.cp-proj-name{font-size:13.5px;font-weight:700;color:#111}
.cp-proj-tech{font-size:10.5px;font-weight:600;padding:2px 7px;border-radius:3px;margin-left:7px}
.cp-skill{margin-bottom:7px}
.cp-sk-info{margin-bottom:3px}
.cp-sk-name{font-size:12.5px;font-weight:600;color:#374151}
.cp-sk-track{height:4px;background:#e5e7eb;border-radius:99px;overflow:hidden}
.cp-sk-fill{height:100%;border-radius:99px}
.cp-lang{display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:12.5px}
.cp-lang-lvl{font-size:10.5px;padding:2px 7px;border-radius:99px;font-weight:700}
.cp-interests{display:flex;flex-wrap:wrap;gap:4px}
.cp-interest{padding:3px 9px;border:1.5px solid;border-radius:99px;font-size:11.5px;font-weight:600}

/* ─────── 15. EXECUTIVE ─────── */
.cv-executive{display:flex;flex-direction:column;min-height:1123px;background:#fff}
.ex-hd{padding:30px 40px;display:flex;align-items:center;gap:22px}
/* Photo agrandie : 82px → 115px */
.ex-photo{width:115px;height:115px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.3);flex-shrink:0}
.ex-photo-wrap{flex-shrink:0}
.ex-name{font-size:32px;font-weight:900;letter-spacing:2px;text-transform:uppercase;line-height:1.1;margin:0 0 6px;white-space:nowrap}
.ex-name-first{font-weight:900}
.ex-name-last{color:#fff;font-weight:300}
.ex-title{font-size:11.5px;letter-spacing:4px;color:#a0b4c6;text-transform:uppercase;font-weight:500;margin:0 0 4px}
.ex-dob{font-size:11.5px;color:#7a96aa;margin-top:4px}
.ex-accent-bar{height:4px;width:100%}
.ex-body{display:grid;grid-template-columns:280px 1fr;flex:1}
.ex-left{padding:26px 20px;background:#fff;border-right:1px solid #e8e8e8}
.ex-right{padding:26px 30px;background:#fff}
.ex-sec{margin-bottom:22px}
.ex-sec-t{font-size:10.5px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px}
.ex-sec-line{height:1.5px;margin-bottom:13px;opacity:.6}
.ex-contact-item{display:flex;align-items:center;gap:10px;margin-bottom:9px;font-size:12.5px;color:#444;word-break:break-all}
.ex-contact-item a{font-size:12.5px}
.ex-ci-icon{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ex-skill-item{display:flex;align-items:center;gap:9px;margin-bottom:7px;font-size:13px;color:#374151}
.ex-skill-bullet{width:6px;height:6px;transform:rotate(45deg);flex-shrink:0}
.ex-lang{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f0f0f0;font-size:12.5px;color:#333}
.ex-lang-lvl{color:#9ca3af;font-size:11.5px}
.ex-interests{display:flex;flex-wrap:wrap;gap:5px}
.ex-interest-tag{padding:2px 9px;border:1.5px solid;border-radius:99px;font-size:11.5px;font-weight:600}
.ex-profile-txt{font-size:13px;color:#444;line-height:1.8;margin:0}
.ex-entry{display:grid;grid-template-columns:130px 1fr;gap:14px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #f3f3f3}
.ex-entry:last-child{border-bottom:none}
.ex-entry-left{padding-top:2px}
.ex-entry-company{font-size:13px;font-weight:700;margin-bottom:2px}
.ex-entry-date{font-size:11.5px;color:#9ca3af;margin-top:1px}
.ex-entry-pos{font-size:13.5px;font-weight:800;text-transform:uppercase;color:#111;margin-bottom:5px;letter-spacing:.3px}
.ex-desc{font-size:12.5px;color:#555;line-height:1.65;margin:0}
.ex-bullets{display:flex;flex-direction:column;gap:3px;margin-top:3px}
.ex-bullet-line{display:flex;align-items:flex-start;gap:7px}
.ex-bullet-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:6px}
.ex-bullet-text{font-size:12.5px;color:#555;line-height:1.55}

/* ─────── 16. VLADIMIR ─────── */
.cv-vlad{width:794px;min-height:1123px;background:#fff;font-family:'DM Sans','Segoe UI',Arial,sans-serif;font-size:14px;color:#1a1a1a}
.vl-layout{display:grid;grid-template-columns:280px 1fr;min-height:1123px}
.vl-sidebar{background:#3a3a3a;display:flex;flex-direction:column;color:#e0e0e0}
.vl-sidebar-top{background:#2b2b2b;padding:28px 18px 22px;text-align:center}
.vl-photo-ring-wrap{display:flex;justify-content:center;margin-bottom:14px}
/* Photo agrandie : 110px → 154px */
.vl-photo-ring{width:154px;height:154px;border-radius:50%;border:4px solid;padding:3px;background:#2b2b2b;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.vl-photo{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}
.vl-photo-init{width:100%;height:100%;border-radius:50%;background:#444;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900}
.vl-name{font-size:19px;font-weight:900;text-transform:uppercase;letter-spacing:.5px;line-height:1.2;margin:0 0 6px;color:#fff;white-space:nowrap}
.vl-title-line{display:flex;flex-direction:column;gap:2px;align-items:center}
.vl-job-title{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#ccc}
.vl-years-exp{font-size:11.5px;color:#aaa;letter-spacing:.5px}
.vl-sidebar-body{padding:16px 16px 24px;display:flex;flex-direction:column;gap:0}
.vl-info-block{margin-bottom:18px;border-bottom:1px solid #555;padding-bottom:14px}
.vl-info-item{display:flex;align-items:flex-start;gap:9px;margin-bottom:8px;font-size:12px;color:#ccc;line-height:1.4}
.vl-info-item a{color:#ccc}
.vl-info-icon{flex-shrink:0;margin-top:1px}
.vl-sec{margin-bottom:18px}
.vl-sec-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.vl-sec-t{font-size:16px;font-weight:700;color:#fff;letter-spacing:.3px}
.vl-sec-icon{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.vl-skills-list{display:flex;flex-direction:column;gap:4px;background:#444;border-radius:6px;padding:10px 12px}
.vl-skill-line{font-size:12.5px;color:#ddd;line-height:1.6}
.vl-aptitudes-title{font-size:14px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#fff;margin-bottom:8px}
.vl-lang-item{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.vl-lang-name{font-size:12.5px;color:#ddd;min-width:60px}
.vl-lang-bar-wrap{flex:1}
.vl-lang-bar-bg{height:8px;background:#555;border-radius:99px;overflow:hidden}
.vl-lang-bar-fill{height:100%;border-radius:99px}
.vl-hobbies-grid{display:flex;flex-wrap:wrap;gap:5px}
.vl-hobby-tag{font-size:11.5px;color:#ddd;background:#555;padding:3px 9px;border-radius:4px}
.vl-main{padding:26px 28px;background:#fff}
.vl-msec{margin-bottom:22px}
.vl-msec-title{font-size:16px;font-weight:700;margin-bottom:4px}
.vl-msec-line{height:1.5px;margin-bottom:12px;opacity:.7}
.vl-summary-txt{font-size:13px;color:#333;line-height:1.8;font-style:italic;text-align:center;margin:0}
.vl-exp-entry{margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #f0f0f0}
.vl-exp-entry:last-child{border-bottom:none}
.vl-exp-date{font-size:12px;color:#666;font-style:italic;margin-bottom:3px}
.vl-exp-pos{font-size:13.5px;font-weight:800;text-transform:uppercase;color:#111;margin-bottom:2px;letter-spacing:.3px}
.vl-exp-company{font-size:13px;font-weight:700;margin-bottom:6px}
.vl-exp-bullets{display:flex;flex-direction:column;gap:3px}
.vl-exp-bullet-line{font-size:12.5px;color:#333;line-height:1.6}
.vl-exp-desc{font-size:12.5px;color:#333;line-height:1.6;margin:0}
.vl-edu-entry{margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #f0f0f0}
.vl-edu-entry:last-child{border-bottom:none}
.vl-edu-date{font-size:12px;font-weight:700;color:#333;margin-bottom:2px}
.vl-edu-mention{font-weight:700;text-transform:uppercase}
.vl-edu-degree{font-size:13.5px;font-weight:800;color:#111;margin-bottom:2px;text-transform:uppercase;letter-spacing:.2px}
.vl-edu-school{font-size:12.5px;color:#555;font-style:italic}
.vl-proj-line{font-size:13px;color:#333;line-height:1.75;padding:1px 0}

/* ─────── 17. NEON DARK ─────── */
.cv-neondark{display:flex;flex-direction:column;min-height:1123px;background:#0f172a;color:#e2e8f0;font-family:'DM Sans','Segoe UI',Arial,sans-serif}
.nd-header{position:relative;overflow:hidden;flex-shrink:0}
.nd-header-bg{position:absolute;inset:0;z-index:0}
.nd-header-content{position:relative;z-index:1;display:flex;gap:22px;align-items:center;padding:28px 32px 22px}
.nd-header-line{height:1px;opacity:.6}
.nd-photo-wrap{position:relative;flex-shrink:0}
/* Photo agrandie : 82px → 115px */
.nd-photo{width:115px;height:115px;border-radius:50%;object-fit:cover;display:block}
.nd-init{width:115px;height:115px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900;background:#1e293b}
.nd-photo-ring{position:absolute;inset:-4px;border-radius:50%;border:1.5px solid;opacity:.5}
.nd-header-text{flex:1}
.nd-name{font-size:28px;font-weight:900;margin:0 0 4px;letter-spacing:-.5px;line-height:1.1}
.nd-name-first{color:#f1f5f9;margin-right:7px}
.nd-title{font-size:13.5px;font-weight:600;margin:0 0 5px;letter-spacing:.5px;text-transform:uppercase}
.nd-dob{font-size:11.5px;color:#64748b;margin-bottom:8px}
.nd-contacts{display:flex;flex-wrap:wrap;gap:5px}
.nd-contact-pill{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;padding:3px 9px;border:1px solid;border-radius:99px;line-height:1}
.nd-body{display:grid;grid-template-columns:280px 1fr;flex:1}
.nd-left{padding:20px 16px;background:#0d1526;border-right:1px solid #1e293b}
.nd-right{padding:20px 24px}
.nd-sec{margin-bottom:20px}
.nd-sec-t{display:flex;align-items:center;gap:7px;font-size:9.5px;font-weight:900;letter-spacing:1.8px;text-transform:uppercase;margin-bottom:6px}
.nd-sec-icon{width:18px;height:18px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0}
.nd-sec-line{height:1px;margin-bottom:10px;opacity:.4}
.nd-skill{margin-bottom:8px}
.nd-sk-head{display:flex;justify-content:space-between;margin-bottom:3px}
.nd-sk-name{font-size:12.5px;font-weight:600;color:#cbd5e1}
.nd-sk-pct{font-size:10.5px;font-weight:700}
.nd-sk-track{height:3px;background:#1e293b;border-radius:99px;overflow:hidden}
.nd-sk-fill{height:100%;border-radius:99px;transition:width .3s}
.nd-lang{display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid #1e293b}
.nd-lang-name{font-size:12.5px;color:#cbd5e1}
.nd-lang-lvl{font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:99px;border:1px solid}
.nd-interests{display:flex;flex-wrap:wrap;gap:5px}
.nd-interest{font-size:11px;padding:3px 9px;border:1px solid;border-radius:99px;font-weight:500}
.nd-summary{font-size:13px;color:#94a3b8;line-height:1.75;margin:0}
.nd-entry{display:flex;gap:10px;margin-bottom:16px;position:relative;padding-left:20px}
.nd-entry-node{position:absolute;left:0;top:5px;width:8px;height:8px;border-radius:50%;flex-shrink:0;box-shadow:0 0 6px currentColor}
.nd-entry-vline{position:absolute;left:3px;top:14px;bottom:-16px;width:0;border-left:1px dashed}
.nd-entry-body{flex:1}
.nd-entry-top{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:5px;margin-bottom:3px}
.nd-entry-pos{font-size:13.5px;font-weight:700;color:#f1f5f9}
.nd-entry-date{font-size:10.5px;font-weight:700;padding:2px 9px;border-radius:99px;border:1px solid;white-space:nowrap}
.nd-entry-co{font-size:12px;font-weight:600;margin-bottom:5px;letter-spacing:.3px}
.nd-entry-desc{font-size:12.5px;color:#64748b;line-height:1.65;margin:0}
.nd-bullets{display:flex;flex-direction:column;gap:4px;margin-top:3px}
.nd-bullet-line{display:flex;align-items:flex-start;gap:7px}
.nd-bullet-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:6px}
.nd-bullet-text{font-size:12.5px;color:#64748b;line-height:1.55}
.nd-proj{margin-bottom:12px;padding:10px 12px;background:#1e293b;border-radius:7px;border-left:2px solid}
.nd-proj-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px}
.nd-proj-name{font-size:13.5px;font-weight:700;color:#f1f5f9}
.nd-proj-tech{font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:4px;border:1px solid}


/* ─────── FOLD ─────── */

.cv-fold{display:flex;flex-direction:column;min-height:1123px;background:#fff}
.fd-header{position:relative;height:155px;overflow:hidden;flex-shrink:0}
.fd-header-fill{position:absolute;inset:0;z-index:0}
.fd-header-clip{position:absolute;bottom:0;left:0;right:0;z-index:1;width:0;height:0;border-left:794px solid transparent;border-top:48px solid;border-top-color:inherit}
.fd-hd-content{position:relative;z-index:2;display:flex;align-items:center;gap:20px;padding:22px 32px 0}
.fd-photo-wrap{flex-shrink:0}
.fd-photo{width:110px;height:110px;border-radius:50%;object-fit:cover;border:4px solid rgba(255,255,255,.35)}
.fd-init{width:110px;height:110px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:#fff;border:3px solid rgba(255,255,255,.3)}
.fd-hd-text{flex:1}
.fd-name{font-size:26px;font-weight:400;color:#fff;margin:0 0 4px;white-space:nowrap;letter-spacing:-.3px}
.fd-name strong{font-weight:900}
.fd-title{font-size:13px;color:rgba(255,255,255,.75);margin:0 0 4px;text-transform:uppercase;letter-spacing:1px}
.fd-dob{font-size:11.5px;color:rgba(255,255,255,.5);margin:0 0 6px}
.fd-contacts{display:flex;flex-wrap:wrap;gap:3px 12px}
.fd-contacts span,.fd-contacts a{font-size:12px;color:rgba(255,255,255,.8)}
.fd-body{display:grid;grid-template-columns:280px 1fr;flex:1;margin-top:16px}
.fd-left{padding:20px 16px;border-right:1px solid #e5e7eb}
.fd-right{padding:20px 24px}
.fd-sec{margin-bottom:20px}
.fd-sec-t{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px}
.fd-sec-rule{height:2px;border-radius:99px;margin-bottom:12px}
.fd-skill{margin-bottom:7px}
.fd-sk-lbl{font-size:12.5px;font-weight:600;color:#374151;margin-bottom:3px}
.fd-sk-track{height:4px;background:#e5e7eb;border-radius:99px;overflow:hidden}
.fd-sk-fill{height:100%;border-radius:99px}
.fd-lang{display:flex;justify-content:space-between;font-size:12.5px;padding:4px 0;border-bottom:1px solid #f0f0f0}
.fd-lang-lvl{color:#9ca3af;font-size:11.5px}
.fd-tags{display:flex;flex-wrap:wrap;gap:4px}
.fd-tag{font-size:11.5px;font-weight:600;padding:2px 9px;border-radius:99px;border:1.5px solid}
.fd-txt{font-size:13px;color:#4b5563;line-height:1.75;margin:0}
.fd-entry{display:flex;gap:12px;margin-bottom:14px}
.fd-entry-side{display:flex;flex-direction:column;align-items:center;padding-top:4px;width:14px;flex-shrink:0}
.fd-node{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.fd-line{flex:1;border-left:1.5px dashed;margin-top:4px;min-height:10px}
.fd-entry-body{flex:1}
.fd-et{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:4px;margin-bottom:2px}
.fd-pos{font-size:13.5px;font-weight:700;color:#111}
.fd-date{font-size:10.5px;font-weight:700;padding:2px 9px;border-radius:99px;white-space:nowrap}
.fd-co{font-size:12px;color:#6b7280;margin-bottom:3px}
.fd-desc{font-size:12.5px;color:#555;line-height:1.6;margin:2px 0 0}
.fd-bullets{display:flex;flex-direction:column;gap:3px;margin-top:4px}
.fd-bullet-line{display:flex;align-items:flex-start;gap:6px}
.fd-bullet-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:6px}
.fd-bullet-text{font-size:12.5px;color:#555;line-height:1.55}
.fd-proj{margin-bottom:10px;padding:10px 12px;background:#f8fafc;border-radius:6px;border-left:3px solid}
.fd-proj-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px}
.fd-tech{font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:4px}


/* ─────── PRISM ─────── */
.cv-prism{display:grid;grid-template-columns:280px 1fr;min-height:1123px}
.pr-sidebar{display:flex;flex-direction:column;padding:0 0 24px;color:#e2e8f0}
.pr-photo-area{display:flex;justify-content:center;padding:30px 18px 16px;position:relative}
.pr-photo-ring{width:120px;height:120px;border-radius:50%;border:3px solid;padding:3px;background:#1e293b;flex-shrink:0}
.pr-photo{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}
.pr-init{width:100%;height:100%;border-radius:50%;background:#0f172a;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900}
.pr-accent-dot{position:absolute;bottom:12px;right:calc(50% - 68px);width:14px;height:14px;border-radius:50%;border:2px solid #1e293b}
.pr-id{padding:0 16px 12px;text-align:center}
.pr-name{font-size:20px;font-weight:900;text-transform:uppercase;letter-spacing:.5px;line-height:1.2;margin:0 0 5px;color:#fff}
.pr-title{font-size:11.5px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin:0 0 3px}
.pr-dob{font-size:11px;color:#475569;margin:0}
.pr-sidebar-div{height:1px;margin:10px 16px;opacity:.3}
.pr-contacts{display:flex;flex-direction:column;gap:7px;padding:0 16px 8px}
.pr-ci{display:flex;align-items:flex-start;gap:8px;font-size:11.5px;color:#94a3b8;text-decoration:none;word-break:break-all}
.pr-ci-ico{font-size:13px;flex-shrink:0;margin-top:1px}
.pr-blk{padding:0 16px 10px}
.pr-blk-t{font-size:9px;font-weight:900;letter-spacing:1.8px;text-transform:uppercase;color:#475569;margin-bottom:8px}
.pr-skill{margin-bottom:7px}
.pr-sk-lbl{font-size:12px;font-weight:600;color:#cbd5e1;margin-bottom:3px}
.pr-sk-track{height:3px;background:#1e3a5f;border-radius:99px;overflow:hidden}
.pr-sk-fill{height:100%;border-radius:99px}
.pr-lang{display:flex;justify-content:space-between;font-size:12px;color:#94a3b8;padding:4px 0;border-bottom:1px solid #1e293b}
.pr-lang-lvl{font-size:11px;font-weight:700}
.pr-tags{display:flex;flex-wrap:wrap;gap:4px}
.pr-tag{font-size:11px;padding:2px 8px;border-radius:4px;font-weight:600}
.pr-main{display:flex;flex-direction:column;background:#fff}
.pr-top-band{height:10px;flex-shrink:0;position:relative}
.pr-band-clip{position:absolute;bottom:-20px;left:0;width:100%;height:20px;background:#fff;clip-path:polygon(0 100%,100% 0,100% 100%)}
.pr-content{flex:1;padding:22px 26px}
.pr-sec{margin-bottom:20px}
.pr-sec-t{display:flex;align-items:center;gap:8px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px}
.pr-sec-icon{width:18px;height:18px;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#fff;flex-shrink:0}
.pr-txt{font-size:13px;color:#4b5563;line-height:1.75;margin:0}
.pr-entry{display:flex;gap:12px;margin-bottom:14px;padding:10px 12px;background:#f8fafc;border-radius:8px;border-left:0 solid transparent;position:relative;overflow:hidden}
.pr-entry-accent{position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:0}
.pr-entry-body{flex:1}
.pr-et{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:4px;margin-bottom:2px}
.pr-pos{font-size:13.5px;font-weight:700;color:#111}
.pr-date{font-size:10.5px;font-weight:700;padding:2px 9px;border-radius:99px;border:1px solid;white-space:nowrap}
.pr-co{font-size:12px;color:#6b7280;margin-bottom:3px}
.pr-desc{font-size:12.5px;color:#555;line-height:1.6;margin:2px 0 0}
.pr-bullets{display:flex;flex-direction:column;gap:3px;margin-top:4px}
.pr-bullet-line{display:flex;align-items:flex-start;gap:6px}
.pr-bullet-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:6px}
.pr-bullet-text{font-size:12.5px;color:#555;line-height:1.55}
.pr-proj{margin-bottom:10px;padding:10px 12px;background:#f8fafc;border-radius:7px;border:1px solid}
.pr-proj-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px}
.pr-tech{font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:4px}


/* ─────── SIDEBAR PRO ─────── */
.cv-sidebar{display:grid;grid-template-columns:280px 1fr;min-height:1123px;background:#fff}
.sb-left{background:#1e3a5f;color:#fff;padding:0 0 24px;display:flex;flex-direction:column}
.sb-photo-area{padding:30px 20px 18px;display:flex;flex-direction:column;align-items:center;border-bottom:1px solid rgba(255,255,255,.1)}
.sb-photo{width:110px;height:110px;border-radius:50%;object-fit:cover;border:3px solid;display:block}
.sb-init{width:110px;height:110px;border-radius:50%;background:rgba(255,255,255,.1);border:3px solid;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900}
.sb-name{font-size:16px;font-weight:900;color:#fff;text-align:center;margin-top:12px;line-height:1.3}
.sb-title{font-size:11.5px;text-align:center;margin-top:5px;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
.sb-sec{padding:14px 20px 4px}
.sb-sec-t{font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,.1)}
.sb-ci{display:flex;align-items:flex-start;gap:9px;margin-bottom:8px;font-size:11.5px;color:rgba(255,255,255,.8)}
.sb-ci-ico{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sb-skill{margin-bottom:7px}
.sb-sk-n{font-size:12px;color:rgba(255,255,255,.85);margin-bottom:3px}
.sb-sk-track{height:3px;background:rgba(255,255,255,.15);border-radius:99px;overflow:hidden}
.sb-sk-fill{height:100%;border-radius:99px}
.sb-lang{display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.8)}
.sb-apt-item{display:flex;align-items:center;gap:8px;margin-bottom:7px}
.sb-apt-n{font-size:12px;color:rgba(255,255,255,.85);flex:1}
.sb-apt-track{flex:1;height:4px;background:rgba(255,255,255,.2);border-radius:99px;overflow:hidden}
.sb-apt-fill{height:100%;border-radius:99px;background:#f59e0b}
.sb-interest{font-size:11.5px;color:rgba(255,255,255,.7);padding:2px 0;display:flex;align-items:center;gap:6px}
.sb-interest::before{content:'›';font-size:14px}
.sb-right{padding:26px 28px}
.sb-hd{margin-bottom:18px;padding-bottom:14px;border-bottom:3px solid}
.sb-hd-name{font-size:28px;font-weight:900;color:#1e3a5f;letter-spacing:-.5px;margin-bottom:4px}
.sb-hd-title{font-size:13.5px;font-weight:600}
.sb-sec-r{margin-bottom:18px}
.sb-sec-t-r{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1.8px;color:#1e3a5f;margin-bottom:10px;display:flex;align-items:center;gap:6px}
.sb-sec-t-r::after{content:'';flex:1;height:1.5px;background:rgba(30,58,95,.15)}
.sb-entry{margin-bottom:14px;padding-left:14px;border-left:2.5px solid}
.sb-entry-top{display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;margin-bottom:2px}
.sb-pos{font-size:14px;font-weight:700;color:#111}
.sb-date{font-size:11px;font-weight:700}
.sb-co{font-size:12.5px;color:#6b7280;margin-bottom:3px}
.sb-summary{font-size:13px;color:#374151;line-height:1.75;margin-bottom:16px;padding:12px 14px;border-radius:6px;border-left:3px solid}
.sb-desc{font-size:12.5px;color:#555;line-height:1.6;margin-top:4px}
.sb-bullets{display:flex;flex-direction:column;gap:3px;margin-top:5px}
.sb-bullet-line{display:flex;align-items:flex-start;gap:6px}
.sb-bullet-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:7px}
.sb-bullet-text{font-size:12.5px;color:#555;line-height:1.55}

/* ─────── GREEN 2COL ─────── */
.cv-green2col{min-height:1123px;padding:32px 36px;background:#fff}
.g2-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px}
.g2-top-left{flex:1}
.g2-name{font-size:30px;font-weight:900;color:#111;letter-spacing:-.5px;margin-bottom:4px}
.g2-title{font-size:14.5px;font-weight:700;margin-bottom:8px}
.g2-contacts{display:flex;flex-wrap:wrap;gap:3px 14px;font-size:11.5px;color:#6b7280}
.g2-photo{width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid;flex-shrink:0;margin-left:18px}
.g2-divider{height:2px;margin:14px 0}
.g2-body{display:grid;grid-template-columns:1fr 270px;gap:28px}
.g2-sec{margin-bottom:18px}
.g2-sec-t{font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;margin-bottom:10px}
.g2-exp{margin-bottom:14px}
.g2-exp-head{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:4px;margin-bottom:2px}
.g2-exp-pos{font-size:14px;font-weight:700;color:#111}
.g2-exp-date{font-size:11px;color:#9ca3af}
.g2-exp-co{font-size:12.5px;font-weight:600;margin-bottom:3px}
.g2-desc{font-size:12.5px;color:#555;line-height:1.6;margin-top:4px}
.g2-skill{margin-bottom:7px}
.g2-sk-n{font-size:12.5px;color:#374151;margin-bottom:3px}
.g2-sk-dots{display:flex;gap:5px}
.g2-sk-dot{width:11px;height:11px;border-radius:50%;background:#e5e7eb}
.g2-lang{margin-bottom:10px}
.g2-lang-top{display:flex;justify-content:space-between;font-size:12.5px;color:#374151;margin-bottom:3px}
.g2-lang-bar{height:4px;background:#e5e7eb;border-radius:99px;overflow:hidden}
.g2-lang-fill{height:100%;border-radius:99px}
.g2-interest{display:flex;align-items:center;gap:8px;font-size:12.5px;color:#6b7280;margin-bottom:6px}
.g2-interest::before{content:'●';font-size:8px}
.g2-edu-item{margin-bottom:12px}
.g2-edu-year{font-size:11px;font-weight:700;margin-bottom:2px}
.g2-edu-deg{font-size:13.5px;font-weight:700;color:#111;margin-bottom:2px}
.g2-edu-school{font-size:12px;color:#6b7280}
.g2-summary{font-size:13px;color:#374151;line-height:1.75;margin-bottom:16px}
.g2-proj{margin-bottom:12px;padding:10px 12px;border-radius:8px;border-left:3px solid}
.g2-proj-name{font-size:13.5px;font-weight:700;color:#111;margin-bottom:3px}
.g2-proj-tech{display:inline-block;font-size:10.5px;padding:1px 8px;border-radius:99px;color:#fff;margin-left:6px;font-weight:700}
.g2-proj-desc{font-size:12px;color:#555;margin-top:4px;line-height:1.6}
.g2-bullets{display:flex;flex-direction:column;gap:3px;margin-top:5px}
.g2-bullet-line{display:flex;align-items:flex-start;gap:6px}
.g2-bullet-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:7px}
.g2-bullet-text{font-size:12.5px;color:#555;line-height:1.55}

/* ─────── NAVY ─────── */
.cv-navy{display:flex;flex-direction:column;min-height:1123px;background:#f8f9fb}
.nv-hd{padding:24px 32px;display:flex;gap:18px;align-items:center}
.nv-photo{width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid;flex-shrink:0}
.nv-init{width:90px;height:90px;border-radius:50%;border:3px solid;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;flex-shrink:0}
.nv-hd-text{flex:1}
.nv-name{font-size:24px;font-weight:900;color:#fff;margin-bottom:4px;letter-spacing:-.3px}
.nv-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
.nv-contacts{display:flex;flex-wrap:wrap;gap:3px 14px;font-size:11.5px;color:rgba(255,255,255,.7)}
.nv-accent-bar{height:4px}
.nv-body{display:grid;grid-template-columns:280px 1fr;flex:1}
.nv-left{background:#fff;padding:20px 18px;border-right:1px solid #e5e7eb}
.nv-right{padding:20px 24px;background:#f8f9fb}
.nv-sec{margin-bottom:18px}
.nv-sec-t{display:flex;align-items:center;gap:8px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:#1e3a5f;margin-bottom:12px;padding-bottom:5px;border-bottom:2px solid rgba(30,58,95,.15)}
.nv-sec-ico{width:22px;height:22px;border-radius:4px;background:#1e3a5f;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0}
.nv-skill{margin-bottom:7px}
.nv-sk-n{font-size:12.5px;color:#374151;margin-bottom:3px;font-weight:600}
.nv-sk-track{height:5px;background:#e5e7eb;border-radius:99px;overflow:hidden}
.nv-sk-fill{height:100%;border-radius:99px}
.nv-lang{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;padding:5px 0;border-bottom:1px solid #f0f0f0}
.nv-lang-badge{font-size:10.5px;font-weight:700;padding:2px 9px;border-radius:99px}
.nv-interest-tag{display:inline-block;font-size:11px;padding:3px 10px;border-radius:99px;background:#1e3a5f15;color:#1e3a5f;margin:2px;font-weight:600}
.nv-card{background:#fff;border-radius:8px;padding:14px 16px;margin-bottom:12px;border:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,.04)}
.nv-card-top{display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;margin-bottom:4px}
.nv-pos{font-size:14px;font-weight:700;color:#111}
.nv-date-badge{font-size:10.5px;font-weight:700;padding:2px 9px;border-radius:99px;white-space:nowrap}
.nv-co{font-size:12.5px;font-weight:600;margin-bottom:4px}
.nv-summary{background:#fff;border-radius:8px;padding:14px 16px;margin-bottom:16px;border:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,.04);font-size:13px;color:#374151;line-height:1.75}
.nv-apt-item{display:flex;align-items:center;gap:8px;margin-bottom:7px}
.nv-apt-n{font-size:12.5px;color:#374151;flex:1}
.nv-apt-track{flex:1;height:5px;background:#e5e7eb;border-radius:99px;overflow:hidden}
.nv-bullets{display:flex;flex-direction:column;gap:3px;margin-top:5px}
.nv-bullet-line{display:flex;align-items:flex-start;gap:6px}
.nv-bullet-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:7px}
.nv-bullet-text{font-size:12.5px;color:#555;line-height:1.55}

/* ─────── CRIMSON ─────── */
.cv-crimson{display:grid;grid-template-columns:290px 1fr;min-height:1123px;background:#fff}
.cr2-sidebar{display:flex;flex-direction:column;background:#fff;border-right:1px solid #e5e7eb}
.cr2-photo-block{background:#9b1c31;padding:22px 18px 32px;position:relative;clip-path:polygon(0 0,100% 0,100% 85%,0 100%)}
.cr2-photo{width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.4);display:block;margin:0 auto 12px}
.cr2-init{width:96px;height:96px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;color:#fff;margin:0 auto 12px}
.cr2-sidebar-name{font-size:14px;font-weight:900;color:#fff;text-align:center;line-height:1.3}
.cr2-sidebar-title{font-size:10.5px;color:rgba(255,255,255,.75);text-align:center;margin-top:4px}
.cr2-sidebar-body{padding:14px 16px;flex:1}
.cr2-sb-sec{margin-bottom:16px}
.cr2-sb-t{font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:1.8px;color:#9b1c31;margin-bottom:8px;padding-bottom:3px;border-bottom:1.5px solid #9b1c3122}
.cr2-contact-item{display:flex;align-items:center;gap:7px;margin-bottom:7px;font-size:11.5px;color:#374151}
.cr2-ci-dot{width:6px;height:6px;border-radius:50%;background:#9b1c31;flex-shrink:0}
.cr2-skill{margin-bottom:7px}
.cr2-sk-n{font-size:12px;color:#374151;margin-bottom:3px}
.cr2-sk-track{height:4px;background:#f3f4f6;border-radius:99px;overflow:hidden}
.cr2-sk-fill{height:100%;border-radius:99px}
.cr2-lang{display:flex;justify-content:space-between;font-size:12px;padding:3px 0;border-bottom:1px solid #f0f0f0;color:#374151}
.cr2-interest-item{font-size:11.5px;color:#6b7280;padding:2px 0;display:flex;align-items:center;gap:6px}
.cr2-interest-item::before{content:'•';color:#9b1c31}
.cr2-apt-item{display:flex;align-items:center;gap:8px;margin-bottom:7px}
.cr2-apt-n{font-size:12px;color:#374151;flex:1}
.cr2-apt-track{flex:1;height:4px;background:#f3f4f6;border-radius:99px;overflow:hidden}
.cr2-main{padding:26px 24px}
.cr2-main-name{font-size:26px;font-weight:900;color:#1a1a1a;margin-bottom:4px;letter-spacing:-.5px}
.cr2-main-title{font-size:13.5px;color:#9b1c31;font-weight:600;margin-bottom:12px}
.cr2-divider{height:2px;margin-bottom:16px;border-radius:2px}
.cr2-sec{margin-bottom:18px}
.cr2-sec-t{font-size:14px;font-weight:800;color:#9b1c31;margin-bottom:12px;display:flex;align-items:center;gap:6px}
.cr2-sec-t::after{content:'';flex:1;height:1px;background:#9b1c3122}
.cr2-entry{margin-bottom:14px}
.cr2-entry-top{display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;margin-bottom:3px}
.cr2-pos{font-size:14px;font-weight:700;color:#111}
.cr2-date{font-size:11px;color:#9b1c31;font-weight:700}
.cr2-co{font-size:12.5px;color:#6b7280;margin-bottom:3px}
.cr2-summary{font-size:13px;color:#374151;line-height:1.75;margin-bottom:16px}
.cr2-bullets{display:flex;flex-direction:column;gap:3px;margin-top:5px}
.cr2-bullet-line{display:flex;align-items:flex-start;gap:6px}
.cr2-bullet-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:7px;background:#9b1c31}
.cr2-bullet-text{font-size:12.5px;color:#555;line-height:1.55}


</style>