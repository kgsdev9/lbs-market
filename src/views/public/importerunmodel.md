<!-- ══════════════════════════════════════════
     15. NEON DARK
     À coller dans TemplateCv.vue parmi les autres templates.
     N'oubliez pas d'ajouter dans CVGeneratorView.vue → tableau templates[] :
     { id: 'neondark', name: 'Neon Dark', defaultAccent: '#22d3ee' }
══════════════════════════════════════════ -->

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


<!-- ════════════════════════════════════════
     CSS — à ajouter dans le <style scoped>
     de TemplateCv.vue
════════════════════════════════════════ -->
<!--
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
*/