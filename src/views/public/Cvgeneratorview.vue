<template>
  <div class="cvgen">

    <!-- TOPBAR -->
    <div class="cvgen-topbar">
      <div class="topbar-left">
        <div class="logo-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <div>
          <div class="logo-title">Générateur de CV</div>
          <div class="logo-sub">
            <span v-if="saving" class="save-saving">⟳ Sauvegarde...</span>
            <span v-else-if="lastSaved" class="save-ok">✓ Sauvegardé {{ lastSaved }}</span>
            <span v-else>Mise à jour en temps réel</span>
          </div>
        </div>
      </div>
      <div class="topbar-right">
        <div class="stepper-pills">
          <button v-for="(s, i) in steps" :key="s.id"
            class="step-pill" :class="{ active: currentStep===i, done: i<currentStep }"
            @click="goToStep(i)">
            <span class="step-check" v-if="i<currentStep">✓</span>
            <span v-else class="step-num">{{ i+1 }}</span>
            <span class="step-pill-label">{{ s.label }}</span>
          </button>
        </div>
        <button class="btn-pdf" @click="downloadPDF" :disabled="exporting">
          <span v-if="exporting" class="spin"></span>
          <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {{ exporting ? 'Export...' : 'PDF' }}
        </button>
      </div>
    </div>

    <!-- WORKSPACE -->
    <div class="workspace">

      <!-- Panneau gauche -->
      <div class="form-panel">
        <div class="step-header">
          <div>
            <div class="step-header-title">{{ steps[currentStep].title }}</div>
            <div class="step-header-sub">{{ steps[currentStep].sub }}</div>
          </div>
          <div class="step-nav">
            <button class="step-nav-btn" @click="prevStep" :disabled="currentStep===0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span class="step-nav-count">{{ currentStep+1 }}/{{ steps.length }}</span>
            <button class="step-nav-btn" @click="nextStep" :disabled="currentStep===steps.length-1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        <div class="form-body">

          <!-- ETAPE 1 : INFOS -->
          <div v-show="currentStep===0" class="pane">
            <div class="row2">
              <div class="f"><label>Prénom *</label><input v-model="cv.firstName" class="inp" placeholder="Jean"/></div>
              <div class="f"><label>Nom *</label><input v-model="cv.lastName" class="inp" placeholder="Kouadio"/></div>
            </div>
            <div class="row2">
              <div class="f"><label>Date de naissance</label><input v-model="cv.dateNaissance" type="date" class="inp"/></div>
              <div class="f"><label>Titre / Poste *</label><input v-model="cv.title" class="inp" placeholder="Développeur Full Stack Senior"/></div>
            </div>
            <div class="row2">
              <div class="f"><label>Email</label><input v-model="cv.email" type="email" class="inp" placeholder="jean@email.ci"/></div>
              <div class="f"><label>Téléphone</label><input v-model="cv.phone" class="inp" placeholder="+225 07 00 00"/></div>
            </div>
            <div class="row2">
              <div class="f"><label>Ville</label><input v-model="cv.city" class="inp" placeholder="Abidjan"/></div>
              <div class="f"><label>Pays</label><input v-model="cv.country" class="inp" placeholder="Côte d'Ivoire"/></div>
            </div>
            <div class="f"><label>LinkedIn / Portfolio</label><input v-model="cv.website" class="inp" placeholder="linkedin.com/in/..."/></div>
            <div class="f">
              <label>Résumé professionnel</label>
              <textarea v-model="cv.summary" class="inp ta" rows="4" placeholder="Développeur passionné avec X ans d'expérience..."></textarea>
            </div>
            <div class="f">
              <label>Photo de profil — Taille recommandée (592 x 592)</label>
              <div class="photo-upload-area">
                <div class="photo-preview-wrap">
                  <div class="photo-preview" :class="{'has-photo': cv.photo}">
                    <img v-if="cv.photo" :src="cv.photo" class="photo-preview-img" @error="cv.photo=''"/>
                    <div v-else class="photo-placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <label class="photo-overlay" for="photo-file-input">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </label>
                  </div>
                  <input id="photo-file-input" type="file" accept="image/*" class="photo-file-input" @change="onPhotoFile"/>
                </div>
                <div class="photo-controls">
                  <label for="photo-file-input" class="btn-photo-upload">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Choisir une photo
                  </label>
                  <button v-if="cv.photo" class="btn-photo-remove" @click="cv.photo=''">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Supprimer
                  </button>
                  <span v-if="photoUploading" class="photo-uploading"><span class="spin" style="border-color:#4f46e5;border-top-color:transparent"></span> Envoi...</span>
                  <span class="photo-hint">JPG, PNG · Max 5 Mo</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ETAPE 2 : EXPERIENCES -->
          <div v-show="currentStep===1" class="pane">
            <div class="pane-add-bar">
              <span class="pane-count">{{ cv.experiences.filter(e=>e.position).length }} expérience(s)</span>
              <button class="btn-add" @click="addExp">+ Ajouter</button>
            </div>
            <div v-if="!cv.experiences.length" class="pane-empty">
              <div style="font-size:32px">💼</div>
              <p>Ajoutez vos expériences professionnelles</p>
              <button class="btn-add-big" @click="addExp">+ Ajouter une expérience</button>
            </div>
            <div class="drag-hint" v-if="cv.experiences.length>1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
              Glissez pour réordonner
            </div>
            <div
              v-for="(e,i) in cv.experiences" :key="'exp'+i"
              class="entry"
              :class="{dragging: dragState.list==='experiences' && dragState.from===i, 'drag-over': dragState.list==='experiences' && dragState.over===i}"
              draggable="true"
              @dragstart="onDragStart('experiences',i,$event)"
              @dragover.prevent="onDragOver('experiences',i)"
              @dragleave="onDragLeave"
              @drop.prevent="onDrop('experiences',i)"
              @dragend="onDragEnd"
            >
              <div class="entry-head">
                <div style="display:flex;align-items:center;gap:7px">
                  <span class="drag-handle" title="Déplacer"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg></span>
                  <span class="entry-label">Expérience {{ i+1 }}</span>
                </div>
                <button class="btn-x" @click="cv.experiences.splice(i,1)">✕</button>
              </div>
              <div class="row2">
                <div class="f"><label>Poste *</label><input v-model="e.position" class="inp" placeholder="Dev Frontend"/></div>
                <div class="f"><label>Entreprise *</label><input v-model="e.company" class="inp" placeholder="ACME Corp"/></div>
              </div>
              <div class="row2">
                <div class="f"><label>Début</label><input v-model="e.startDate" class="inp" placeholder="Jan 2022"/></div>
                <div class="f"><label>Fin</label><input v-model="e.endDate" class="inp" placeholder="Présent"/></div>
              </div>
              <div class="f">
                <div class="desc-label-row">
                  <label>Description</label>
                  <div class="desc-mode-tabs">
                    <button class="desc-tab" :class="{active:(e.descMode||'bullets')==='bullets'}" @click="e.descMode='bullets'">☰ Puces</button>
                    <button class="desc-tab" :class="{active:e.descMode==='text'}" @click="e.descMode='text'">¶ Texte libre</button>
                  </div>
                </div>
                <div v-if="(e.descMode||'bullets')==='bullets'" class="bullets-editor">
                  <div class="bullets-hint">
                    Appuyez sur <kbd>Entrée</kbd> pour ajouter une puce · <kbd>Backspace</kbd> sur une puce vide pour supprimer
                  </div>
                  <div v-for="(b,bi) in e.bullets" :key="'b'+i+'-'+bi" class="bullet-row">
                    <span class="bullet-icon" :style="{color:accentColor}">•</span>
                    <input
                      v-model="e.bullets[bi]"
                      class="inp bullet-inp"
                      placeholder="Décrivez une mission, réalisation..."
                      @keydown.enter.prevent="addBullet(e, bi)"
                      @keydown.backspace="onBulletBackspace(e, bi, $event)"
                    />
                    <button class="btn-xs bullet-del" @click="removeBullet(e,bi)" v-if="e.bullets.length>1" title="Supprimer">✕</button>
                  </div>
                  <button class="btn-add-bullet" @click="addBullet(e, e.bullets.length-1)">+ Ajouter une puce</button>
                </div>
                <div v-else>
                  <textarea v-model="e.description" class="inp ta-sm" rows="4" placeholder="Décrivez vos missions...&#10;Commencez par - ou • pour créer des puces."></textarea>
                  <div class="desc-tip">💡 Commencez une ligne par <code>-</code> ou <code>•</code> pour créer des puces dans l'aperçu.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ETAPE 3 : FORMATION -->
          <div v-show="currentStep===2" class="pane">
            <div class="pane-add-bar">
              <span class="pane-count">{{ cv.education.filter(e=>e.degree).length }} formation(s)</span>
              <button class="btn-add" @click="cv.education.push({degree:'',school:'',year:'',anneeDebut:'',anneeFin:''})">+ Ajouter</button>
            </div>
            <div v-if="!cv.education.length" class="pane-empty">
              <div style="font-size:32px">🎓</div><p>Ajoutez vos diplômes</p>
              <button class="btn-add-big" @click="cv.education.push({degree:'',school:'',year:'',anneeDebut:'',anneeFin:''})">+ Ajouter</button>
            </div>
            <div class="drag-hint" v-if="cv.education.length>1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
              Glissez pour réordonner
            </div>
            <div v-for="(e,i) in cv.education" :key="'edu'+i" class="entry"
              :class="{dragging:dragState.list==='education'&&dragState.from===i,'drag-over':dragState.list==='education'&&dragState.over===i}"
              draggable="true" @dragstart="onDragStart('education',i,$event)" @dragover.prevent="onDragOver('education',i)"
              @dragleave="onDragLeave" @drop.prevent="onDrop('education',i)" @dragend="onDragEnd">
              <div class="entry-head">
                <div style="display:flex;align-items:center;gap:7px">
                  <span class="drag-handle"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg></span>
                  <span class="entry-label">Formation {{ i+1 }}</span>
                </div>
                <button class="btn-x" @click="cv.education.splice(i,1)">✕</button>
              </div>
              <div class="f"><label>Diplôme *</label><input v-model="e.degree" class="inp" placeholder="Master Informatique"/></div>
              <div class="f"><label>Établissement</label><input v-model="e.school" class="inp" placeholder="INPHB Yamoussoukro"/></div>
              <div class="row3">
                <div class="f"><label>Année affichage</label><input v-model="e.year" class="inp" placeholder="2021"/></div>
                <div class="f"><label>Année début</label><input v-model="e.anneeDebut" class="inp" placeholder="2019"/></div>
                <div class="f"><label>Année fin</label><input v-model="e.anneeFin" class="inp" placeholder="2021"/></div>
              </div>
            </div>
          </div>

          <!-- ETAPE 4 : COMPETENCES -->
          <div v-show="currentStep===3" class="pane">
            <div class="pane-add-bar">
              <span class="pane-count" style="font-weight:700;color:#333">⚡ Compétences</span>
              <button class="btn-add" @click="cv.skills.push({name:'',level:3})">+ Ajouter</button>
            </div>
            <div v-if="!cv.skills.length" class="pane-empty"><div style="font-size:28px">⚡</div><button class="btn-add-big" @click="cv.skills.push({name:'',level:3})">+ Ajouter une compétence</button></div>
            <div class="drag-hint" v-if="cv.skills.length>1"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg> Glissez pour réordonner</div>
            <div v-for="(s,i) in cv.skills" :key="'sk'+i" class="skill-row draggable-row"
              :class="{dragging:dragState.list==='skills'&&dragState.from===i,'drag-over':dragState.list==='skills'&&dragState.over===i}"
              draggable="true" @dragstart="onDragStart('skills',i,$event)" @dragover.prevent="onDragOver('skills',i)"
              @dragleave="onDragLeave" @drop.prevent="onDrop('skills',i)" @dragend="onDragEnd">
              <span class="drag-handle-sm"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg></span>
              <input v-model="s.name" class="inp" placeholder="Vue.js, Laravel..." style="flex:1"/>
              <div class="dots-input"><button v-for="d in 4" :key="d" class="dot-btn" :class="{filled:d<=s.level}" :style="d<=s.level?{background:accentColor,borderColor:accentColor}:{}" @click="s.level=d"></button></div>
              <button class="btn-xs" @click="cv.skills.splice(i,1)">✕</button>
            </div>

            <div class="pane-divider"></div>
            <div class="pane-add-bar" style="margin-top:4px"><span class="pane-count" style="font-weight:700;color:#333">🌍 Langues</span><button class="btn-add" @click="cv.languages.push({name:'',level:'Courant'})">+ Ajouter</button></div>
            <div class="drag-hint" v-if="cv.languages.length>1"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg> Glissez pour réordonner</div>
            <div v-for="(l,i) in cv.languages" :key="'lg'+i" class="skill-row draggable-row"
              :class="{dragging:dragState.list==='languages'&&dragState.from===i,'drag-over':dragState.list==='languages'&&dragState.over===i}"
              draggable="true" @dragstart="onDragStart('languages',i,$event)" @dragover.prevent="onDragOver('languages',i)"
              @dragleave="onDragLeave" @drop.prevent="onDrop('languages',i)" @dragend="onDragEnd">
              <span class="drag-handle-sm"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg></span>
              <input v-model="l.name" class="inp" placeholder="Français" style="flex:1"/>
              <select v-model="l.level" class="inp" style="width:120px;flex-shrink:0"><option>Natif</option><option>Courant</option><option>Intermédiaire</option><option>Notions</option></select>
              <button class="btn-xs" @click="cv.languages.splice(i,1)">✕</button>
            </div>

            <div class="pane-divider"></div>
            <div class="pane-add-bar" style="margin-top:4px"><span class="pane-count" style="font-weight:700;color:#333">🎯 Centres d'intérêt</span><button class="btn-add" @click="cv.centresInteret.push({name:''})">+ Ajouter</button></div>
            <div v-if="!cv.centresInteret.length" class="pane-empty" style="padding:12px 16px"><button class="btn-add-big" @click="cv.centresInteret.push({name:''})">+ Ajouter un centre d'intérêt</button></div>
            <div class="drag-hint" v-if="cv.centresInteret.length>1"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg> Glissez pour réordonner</div>
            <div v-for="(c,i) in cv.centresInteret" :key="'ci'+i" class="skill-row draggable-row"
              :class="{dragging:dragState.list==='centresInteret'&&dragState.from===i,'drag-over':dragState.list==='centresInteret'&&dragState.over===i}"
              draggable="true" @dragstart="onDragStart('centresInteret',i,$event)" @dragover.prevent="onDragOver('centresInteret',i)"
              @dragleave="onDragLeave" @drop.prevent="onDrop('centresInteret',i)" @dragend="onDragEnd">
              <span class="drag-handle-sm"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg></span>
              <input v-model="c.name" class="inp" placeholder="Musique, Sport, Voyage..." style="flex:1"/>
              <button class="btn-xs" @click="cv.centresInteret.splice(i,1)">✕</button>
            </div>

            <div class="pane-divider"></div>
            <div class="pane-add-bar" style="margin-top:4px"><span class="pane-count" style="font-weight:700;color:#333">🧠 Aptitudes</span><button class="btn-add" @click="cv.aptitudes.push({name:'',level:3})">+ Ajouter</button></div>
            <div class="hint-block">Les aptitudes sont optionnelles — ajoutez-les uniquement si pertinent (ex: Leadership, Communication…)</div>
            <div class="drag-hint" v-if="cv.aptitudes.length>1"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg> Glissez pour réordonner</div>
            <div v-for="(a,i) in cv.aptitudes" :key="'ap'+i" class="skill-row draggable-row"
              :class="{dragging:dragState.list==='aptitudes'&&dragState.from===i,'drag-over':dragState.list==='aptitudes'&&dragState.over===i}"
              draggable="true" @dragstart="onDragStart('aptitudes',i,$event)" @dragover.prevent="onDragOver('aptitudes',i)"
              @dragleave="onDragLeave" @drop.prevent="onDrop('aptitudes',i)" @dragend="onDragEnd">
              <span class="drag-handle-sm"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg></span>
              <input v-model="a.name" class="inp" placeholder="Leadership, Gestion d'équipe..." style="flex:1"/>
              <div class="dots-input"><button v-for="d in 4" :key="d" class="dot-btn" :class="{filled:d<=a.level}" :style="d<=a.level?{background:'#f59e0b',borderColor:'#f59e0b'}:{}" @click="a.level=d"></button></div>
              <button class="btn-xs" @click="cv.aptitudes.splice(i,1)">✕</button>
            </div>
          </div>

          <!-- ETAPE 5 : PROJETS -->
          <div v-show="currentStep===4" class="pane">
            <div class="pane-add-bar">
              <span class="pane-count">{{ cv.projects.filter(p=>p.name).length }} projet(s)</span>
              <button class="btn-add" @click="cv.projects.push({name:'',tech:'',description:'',url:''})">+ Ajouter</button>
            </div>
            <div v-if="!cv.projects.length" class="pane-empty"><div style="font-size:32px">🚀</div><p>Mettez en avant vos projets</p><button class="btn-add-big" @click="cv.projects.push({name:'',tech:'',description:'',url:''})">+ Ajouter un projet</button></div>
            <div v-for="(p,i) in cv.projects" :key="i" class="entry">
              <div class="entry-head"><span class="entry-label">Projet {{ i+1 }}</span><button class="btn-x" @click="cv.projects.splice(i,1)">✕</button></div>
              <div class="f"><label>Nom *</label><input v-model="p.name" class="inp" placeholder="Mon Application"/></div>
              <div class="f"><label>Technologies</label><input v-model="p.tech" class="inp" placeholder="Vue.js, Laravel, MySQL"/></div>
              <div class="f"><label>Description</label><textarea v-model="p.description" class="inp ta-sm" rows="2"></textarea></div>
              <div class="f"><label>Lien</label><input v-model="p.url" class="inp" placeholder="https://github.com/..."/></div>
            </div>
          </div>

          <!-- ETAPE 6 : MODELE -->
          <div v-show="currentStep===5" class="pane">
            <p class="pane-title">Choisissez votre modèle</p>
            <div class="tpl-grid">
              <div v-for="t in templates" :key="t.id" class="tpl-card" :class="{active:selectedTpl===t.id}" @click="selectedTpl=t.id;accentColor=t.defaultAccent">
                <div class="tpl-preview" :style="{borderColor:selectedTpl===t.id?accentColor:'#e5e7eb'}">
                  <div v-if="t.id==='classic'" class="tp-c"><div class="tp-c-hd" :style="{background:aod(t)}"><div class="tp-dot"></div><div><div class="tp-ln w70"></div><div class="tp-ln w50 mt2"></div></div></div><div class="tp-c-body"><div class="tp-c-left"><div class="tp-ln w90"></div><div class="tp-bar mt1" :style="{background:aod(t)}"></div><div class="tp-ln w70 mt2"></div><div class="tp-bar mt1" :style="{background:aod(t)}"></div></div><div class="tp-c-right"><div class="tp-ln w100"></div><div class="tp-ln w80 mt1"></div><div class="tp-ln w90 mt2"></div><div class="tp-ln w70 mt1"></div></div></div></div>
                  <div v-else-if="t.id==='minimal'" class="tp-m"><div class="tp-m-hd"><div class="tp-ln w60 bold"></div><div class="tp-ln w40 mt1"></div></div><div class="tp-divline mt2" :style="{background:aod(t)}"></div><div class="tp-ln w100 mt2"></div><div class="tp-ln w80 mt1"></div><div class="tp-2col mt2"><div><div class="tp-acc" :style="{background:aod(t)}"></div><div class="tp-ln w90 mt1"></div></div><div><div class="tp-acc" :style="{background:aod(t)}"></div><div class="tp-ln w90 mt1"></div></div></div></div>
                  <div v-else-if="t.id==='modern'" class="tp-mod"><div class="tp-mod-side" :style="{background:aod(t)}"><div class="tp-dot lg"></div><div class="tp-ln w80 mt2 wh"></div><div class="tp-ln w60 mt1 wh50"></div><div class="tp-ln w70 mt2 wh50"></div><div class="tp-ln w50 mt1 wh50"></div></div><div class="tp-mod-main"><div class="tp-acc" :style="{background:aod(t)}"></div><div class="tp-ln w100 mt1"></div><div class="tp-ln w80 mt1"></div><div class="tp-acc mt2" :style="{background:aod(t)}"></div><div class="tp-ln w100 mt1"></div></div></div>
                  <div v-else-if="t.id==='corporate'" class="tp-corp"><div class="tp-corp-hd"><div class="tp-sq"></div><div><div class="tp-ln w60 bold"></div><div class="tp-ln w40 mt1" :style="{background:aod(t)}"></div></div></div><div class="tp-corp-bar" :style="{background:aod(t)}"></div><div class="tp-2col"><div><div class="tp-ln w90"></div><div class="tp-bar mt1" :style="{background:aod(t)}"></div></div><div><div class="tp-ln w100"></div><div class="tp-ln w80 mt1"></div></div></div></div>
                  <div v-else-if="t.id==='elegant'" class="tp-eleg"><div class="tp-eleg-hd" :style="{borderBottomColor:aod(t)}"><div class="tp-ln w60 bold"></div><div class="tp-ln w40 mt1" :style="{background:aod(t)}"></div></div><div class="tp-2col mt2"><div><div class="tp-ln w80"></div><div class="tp-dot sm mt1"></div><div class="tp-ln w70 mt1"></div></div><div><div class="tp-ln w100"></div><div class="tp-ln w90 mt1"></div><div class="tp-ln w70 mt1"></div></div></div></div>
                  <div v-else-if="t.id==='dark'" class="tp-dark"><div class="tp-dark-hd"><div class="tp-dot lg dark"></div><div><div class="tp-ln w70 wh"></div><div class="tp-ln w50 mt1" :style="{background:aod(t)}"></div></div></div><div class="tp-dark-body"><div><div class="tp-ln w100 wh50"></div><div class="tp-ln w80 mt1 wh50"></div><div class="tp-ln w90 mt1 wh50"></div></div></div></div>
                  <div v-else-if="t.id==='timeline'" class="tp-tl"><div class="tp-tl-hd" :style="{background:aod(t)+'22',borderLeftColor:aod(t)}"><div class="tp-ln w60 bold"></div><div class="tp-ln w40 mt1"></div></div><div class="tp-tl-line" :style="{borderColor:aod(t)}"><div class="tp-tl-dot" :style="{background:aod(t)}"></div><div class="tp-ln w80"></div><div class="tp-tl-dot mt2" :style="{background:aod(t)}"></div><div class="tp-ln w60 mt2"></div></div></div>
                  <div v-else-if="t.id==='swiss'" class="tp-swiss"><div class="tp-sw-bar" :style="{background:aod(t)}"></div><div class="tp-sw-name"><div class="tp-ln w70 bold"></div></div><div class="tp-sw-grid"><div class="tp-sw-left"><div class="tp-ln w80"></div><div class="tp-ln w60 mt1"></div></div><div class="tp-sw-right"><div class="tp-ln w100"></div><div class="tp-ln w90 mt1"></div><div class="tp-ln w70 mt1"></div></div></div></div>
                  <div v-else-if="t.id==='creative'" class="tp-creative"><div class="tp-cr-hd" :style="{background:aod(t)+'dd'}"><div class="tp-cr-circle" :style="{borderColor:'rgba(255,255,255,.5)'}"></div><div class="tp-ln w60 mt2 wh"></div></div><div class="tp-cr-body"><div class="tp-ln w90"></div><div class="tp-ln w70 mt1"></div><div class="tp-cr-tag mt2" :style="{background:aod(t)+'22',borderColor:aod(t)}"></div></div></div>
                  <div v-else-if="t.id==='tech'" class="tp-tech"><div class="tp-tk-hd" :style="{background:'#0d1117'}"><div class="tp-ln w70 wh"></div><div class="tp-ln w50 mt1" :style="{background:aod(t)}"></div></div><div class="tp-tk-body"><div class="tp-tk-tag" :style="{background:aod(t)+'22',borderColor:aod(t)}"></div><div class="tp-ln w90 mt1"></div><div class="tp-ln w70 mt1"></div></div></div>
                  <div v-else-if="t.id==='academic'" class="tp-acad"><div class="tp-acad-hd" :style="{borderTopColor:aod(t)}"><div class="tp-ln w65 bold"></div><div class="tp-ln w40 mt1" :style="{background:aod(t)+'88'}"></div></div><div class="tp-2col mt2"><div><div class="tp-ln w80"></div><div class="tp-ln w60 mt1"></div><div class="tp-acc mt2" :style="{background:aod(t)}"></div></div><div><div class="tp-ln w100"></div><div class="tp-ln w80 mt1"></div><div class="tp-ln w90 mt2"></div></div></div></div>
                  <div v-else-if="t.id==='luxury'" class="tp-lux"><div class="tp-lux-hd"><div class="tp-lux-line" :style="{background:aod(t)}"></div><div class="tp-ln w60 bold" style="margin:3px auto;width:60%"></div><div class="tp-ln w40" style="margin:2px auto;width:40%"></div><div class="tp-lux-line" :style="{background:aod(t)}"></div></div><div class="tp-2col mt2"><div><div class="tp-ln w90"></div><div class="tp-ln w70 mt1"></div></div><div><div class="tp-ln w100"></div><div class="tp-ln w80 mt1"></div></div></div></div>
                  <div v-else-if="t.id==='gradient'" class="tp-grad"><div class="tp-grad-side" :style="{background:'linear-gradient(160deg,'+aod(t)+','+aod(t)+'88)'}"><div class="tp-dot lg" style="opacity:.7"></div><div class="tp-ln w80 mt2 wh"></div><div class="tp-ln w60 mt1 wh50"></div></div><div class="tp-grad-main"><div class="tp-ln w90"></div><div class="tp-ln w70 mt1"></div><div class="tp-ln w80 mt2"></div><div class="tp-ln w60 mt1"></div></div></div>
                  <div v-else-if="t.id==='compact'" class="tp-compact"><div class="tp-compact-hd" :style="{background:aod(t)+'15',borderBottom:'2px solid '+aod(t)}"><div class="tp-ln w70 bold"></div><div class="tp-ln w45 mt1"></div></div><div class="tp-compact-body"><div class="tp-compact-row"><div class="tp-compact-dot" :style="{background:aod(t)}"></div><div class="tp-ln w90"></div></div><div class="tp-compact-row mt1"><div class="tp-compact-dot" :style="{background:aod(t)}"></div><div class="tp-ln w70"></div></div><div class="tp-compact-row mt1"><div class="tp-compact-dot" :style="{background:aod(t)}"></div><div class="tp-ln w80"></div></div></div></div>
                  <div v-if="selectedTpl===t.id" class="tpl-badge" :style="{background:accentColor}">✓</div>
                </div>
                <div class="tpl-name">{{ t.name }}</div>
              </div>
            </div>
            <div class="color-section">
              <p class="color-title">Couleur principale</p>
              <div class="color-grid">
                <button v-for="c in colorPresets" :key="c.value" class="color-swatch" :class="{active:accentColor===c.value}" :style="{background:c.value}" :title="c.name" @click="accentColor=c.value">
                  <span v-if="accentColor===c.value" style="color:#fff;font-size:11px;font-weight:800">✓</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer nav -->
        <div class="form-footer">
          <button class="btn-prev" @click="prevStep" :disabled="currentStep===0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Précédent
          </button>
          <div class="step-dots">
            <span v-for="(s,i) in steps" :key="i" class="step-dot" :class="{active:i===currentStep,done:i<currentStep}" :style="i===currentStep?{background:accentColor}:{}" @click="goToStep(i)"></span>
          </div>
          <button v-if="currentStep<steps.length-1" class="btn-next" :style="{background:accentColor}" @click="nextStep">
            Suivant <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <button v-else class="btn-next" style="background:#22c55e" @click="downloadPDF" :disabled="exporting">
            <span v-if="exporting" class="spin"></span>
            {{ exporting?'Export...':'⬇ Télécharger PDF' }}
          </button>
        </div>
      </div>

      <!-- Apercu droit -->
      <div class="preview-panel">
        <div class="preview-bar">
          <div style="display:flex;align-items:center;gap:7px">
            <span class="live-dot"></span>
            <span class="live-label">Aperçu en direct</span>
          </div>
          <div style="display:flex;align-items:center;gap:5px">
            <button class="zoom-btn" @click="zoom=Math.max(0.3,zoom-0.1)">−</button>
            <span class="zoom-val">{{ Math.round(zoom*100) }}%</span>
            <button class="zoom-btn" @click="zoom=Math.min(1.4,zoom+0.1)">+</button>
            <button class="zoom-btn" style="width:auto;padding:0 8px;font-size:10px" @click="fitZoom">Ajuster</button>
          </div>
        </div>
        <div class="preview-stage" ref="previewStage">
          <div :style="{transform:`scale(${zoom})`,transformOrigin:'top center',display:'inline-block'}">
            <template-cv :cv="cvForTemplate" :selected-tpl="selectedTpl" :accent-color="accentColor"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/services/api'
import TemplateCv from './Templatecv.vue'

export default {
  name: 'CVGeneratorView',
  components: { TemplateCv },
  data() {
    return {
      currentStep: 0,
      cvProfileId: null,
      loadingProfile: true,
      saving: false,
      saveTimeout: null,
      lastSaved: null,
      selectedTpl: 'classic',
      accentColor: '#2563eb',
      zoom: 0.72,
      exporting: false,
      photoUploading: false,
      steps: [
        { id:'personal',   label:'Infos',       title:'👤 Informations personnelles',      sub:'Vos coordonnées, date de naissance et profil' },
        { id:'experience', label:'Expériences', title:'💼 Expériences professionnelles',    sub:'Vos postes et missions' },
        { id:'education',  label:'Formation',   title:'🎓 Formations & Diplômes',           sub:'Votre parcours académique avec dates' },
        { id:'skills',     label:'Compétences', title:'⚡ Compétences, Langues & Intérêts', sub:"Skills, langues, aptitudes, centres d'intérêt" },
        { id:'projects',   label:'Projets',     title:'🚀 Projets',                         sub:'Vos réalisations notables' },
        { id:'template',   label:'Modèle',      title:'🎨 Choisir un modèle',              sub:'Style et couleur de votre CV' },
      ],
      templates: [
        { id:'classic',   name:'Classique',    defaultAccent:'#2563eb' },
        { id:'minimal',   name:'Minimaliste',  defaultAccent:'#111827' },
        { id:'modern',    name:'Moderne',      defaultAccent:'#7c3aed' },
        { id:'executive', name:'Executive',    defaultAccent:'#c5982a' },
        { id:'corporate', name:'Corporate',    defaultAccent:'#0f766e' },
        { id:'elegant',   name:'Élégant',      defaultAccent:'#b45309' },
        { id:'dark',      name:'Dark',         defaultAccent:'#6366f1' },
        { id:'timeline',  name:'Timeline',     defaultAccent:'#0891b2' },
        { id:'swiss',     name:'Swiss',        defaultAccent:'#e11d48' },
        { id:'creative',  name:'Créatif',      defaultAccent:'#7c3aed' },
        { id:'tech',      name:'Tech',         defaultAccent:'#22c55e' },
        { id:'academic',  name:'Académique',   defaultAccent:'#1d4ed8' },
        { id:'luxury',    name:'Luxe',         defaultAccent:'#92400e' },
        { id:'gradient',  name:'Gradient',     defaultAccent:'#4f46e5' },
        { id:'compact',   name:'Compact Pro',  defaultAccent:'#0e7490' },
        { id:'vladimir',  name:'Vladimir',     defaultAccent:'#e8950a' },
        { id:'neondark',  name:'Neon Dark',    defaultAccent:'#22d3ee' },
      ],
      colorPresets: [
        {name:'Bleu',value:'#2563eb'},{name:'Indigo',value:'#4f46e5'},{name:'Violet',value:'#7c3aed'},{name:'Rose',value:'#db2777'},
        {name:'Rouge',value:'#dc2626'},{name:'Crimson',value:'#e11d48'},{name:'Orange',value:'#ea580c'},{name:'Ambre',value:'#b45309'},
        {name:'Vert',value:'#16a34a'},{name:'Emeraude',value:'#059669'},{name:'Teal',value:'#0f766e'},{name:'Cyan',value:'#0891b2'},
        {name:'Tech',value:'#22c55e'},{name:'Ardoise',value:'#475569'},{name:'Noir',value:'#111827'},
      ],
      cv: {
        firstName:'', lastName:'', dateNaissance:'', title:'',
        email:'', phone:'', city:'', country:'',
        website:'', summary:'', photo:'', photoUrl:'',
        experiences:[], education:[], skills:[], languages:[],
        projects:[], centresInteret:[], aptitudes:[],
      },
      dragState: { list: null, from: null, over: null },
    }
  },

  computed: {
    // cvForTemplate : UNIQUEMENT pour l'aperçu visuel
    // Il filtre les bullets vides pour l'affichage, mais NE SERT PAS à la sauvegarde
    cvForTemplate() {
      return {
        ...this.cv,
        experiences: this.cv.experiences.map(e => {
          const isBullets = (e.descMode || 'bullets') === 'bullets'
          return {
            ...e,
            bullets: isBullets
              ? (e.bullets || []).filter(b => b && b.trim())
              : [],
            description: isBullets ? '' : (e.description || ''),
          }
        }),
      }
    },
  },

  watch: {
    cv:          { deep:true, handler() { this.scheduleSave() } },
    selectedTpl() { this.scheduleSave() },
    accentColor()  { this.scheduleSave() },
  },
  async created() { await this.loadProfile() },
  mounted()       { this.$nextTick(() => this.fitZoom()) },

  methods: {
    nextStep()  { if (this.currentStep < this.steps.length-1) this.currentStep++ },
    prevStep()  { if (this.currentStep > 0) this.currentStep-- },
    goToStep(i) { this.currentStep = i },
    aod(t) { return this.selectedTpl===t.id ? this.accentColor : t.defaultAccent },

    addExp() {
      this.cv.experiences.push({
        position:'', company:'', startDate:'', endDate:'',
        description:'', bullets:[''], descMode:'bullets'
      })
    },
    addBullet(exp, index) {
      exp.bullets.splice(index + 1, 0, '')
      this.$nextTick(() => {
        const inputs = this.$el.querySelectorAll('.bullet-inp')
        if (inputs[index + 1]) inputs[index + 1].focus()
      })
    },
    removeBullet(exp, index) {
      if (exp.bullets.length <= 1) { exp.bullets[0] = ''; return }
      exp.bullets.splice(index, 1)
    },
    onBulletBackspace(exp, index, event) {
      if (index > 0 && exp.bullets[index] === '') {
        event.preventDefault()
        exp.bullets.splice(index, 1)
        this.$nextTick(() => {
          const inputs = this.$el.querySelectorAll('.bullet-inp')
          if (inputs[index - 1]) inputs[index - 1].focus()
        })
      }
    },
    onDragStart(list, index, evt) {
      this.dragState.list = list; this.dragState.from = index; this.dragState.over = index
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('text/plain', index)
    },
    onDragOver(list, index) { if (this.dragState.list !== list) return; this.dragState.over = index },
    onDragLeave() {},
    onDrop(list, toIndex) {
      const fromIndex = this.dragState.from
      if (fromIndex === null || fromIndex === toIndex || this.dragState.list !== list) return
      const arr = this.cv[list]
      const moved = arr.splice(fromIndex, 1)[0]
      arr.splice(toIndex, 0, moved)
      this.dragState = { list: null, from: null, over: null }
    },
    onDragEnd() { this.dragState = { list: null, from: null, over: null } },
    fitZoom() {
      const stage = this.$refs.previewStage
      if (!stage) return
      this.zoom = Math.min(Math.max((stage.clientWidth - 48) / 794, 0.3), 1.2)
    },
    async onPhotoFile(e) {
      const file = e.target.files[0]
      if (!file) return
      if (file.size > 5 * 1024 * 1024) { alert('La photo ne doit pas dépasser 5 Mo.'); return }
      const reader = new FileReader()
      reader.onload = (ev) => { this.cv.photo = ev.target.result }
      reader.readAsDataURL(file)
      this.photoUploading = true
      try {
        const formData = new FormData()
        formData.append('photo', file)
        const { data } = await API.post('/cv-profiles/upload-photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        this.cv.photo = data.url; this.cv.photoUrl = data.url
      } catch (err) { console.warn('Upload photo échoué:', err) }
      finally { this.photoUploading = false; e.target.value = '' }
    },
    async loadProfile() {
      this.loadingProfile = true
      try { const { data } = await API.get('/cv-profiles/mine'); this.applyProfile(data) }
      catch (e) { console.error('Erreur chargement:', e) }
      finally { this.loadingProfile = false }
    },
    applyProfile(data) {
      this.cvProfileId = data.id
      this.selectedTpl = data.template    || 'classic'
      this.accentColor = data.accentColor || '#2563eb'
      this.cv = {
        firstName: data.firstName||'', lastName: data.lastName||'', dateNaissance: data.dateNaissance||'',
        title: data.title||'', email: data.email||'', phone: data.phone||'',
        city: data.city||'', country: data.country||'', website: data.website||'',
        summary: data.summary||'', photo: data.photo||'', photoUrl: data.photo||'',
        experiences: (data.experiences||[]).map(e => ({
          position:    e.position    || '',
          company:     e.company     || '',
          startDate:   e.startDate   || '',
          endDate:     e.endDate     || '',
          description: e.description || '',
          descMode:    e.descMode    || 'bullets',
          // Le backend retourne déjà [''] si vide, on l'utilise directement
          bullets: Array.isArray(e.bullets) && e.bullets.length > 0
            ? e.bullets
            : [''],
        })),
        education:      (data.education||[]).map(e=>({
          degree:     e.degree     || '',
          school:     e.school     || '',
          year:       e.year       || '',
          anneeDebut: e.anneeDebut || '',
          anneeFin:   e.anneeFin   || '',
        })),
        skills:         (data.skills||[]).map(s=>({ name:s.name||'', level:s.level||3 })),
        languages:      (data.languages||[]).map(l=>({ name:l.name||'', level:l.level||'Courant' })),
        projects:       (data.projects||[]).map(p=>({ name:p.name||'', tech:p.tech||'', description:p.description||'', url:p.url||'' })),
        centresInteret: (data.centresInteret||[]).map(c=>({ name:c.name||'' })),
        aptitudes:      (data.aptitudes||[]).map(a=>({ name:a.name||'', level:a.level||3 })),
      }
    },
    scheduleSave() {
      if (!this.cvProfileId || this.loadingProfile) return
      clearTimeout(this.saveTimeout)
      this.saveTimeout = setTimeout(() => this.autoSave(), 1500)
    },
    async autoSave() {
      if (!this.cvProfileId) return
      this.saving = true
      try {
        // ── IMPORTANT : on envoie this.cv (données brutes) et NON cvForTemplate ──
        // cvForTemplate filtre les bullets vides → les expériences semblent vides
        // this.cv contient les vraies données avec bullets brutes
        await API.put(`/cv-profiles/${this.cvProfileId}/full`, {
          ...this.cv,
          photo:       this.cv.photo,
          template:    this.selectedTpl,
          accentColor: this.accentColor,
        })
        const n = new Date()
        this.lastSaved = `à ${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`
      } catch (e) { console.error('Erreur save:', e) }
      finally { this.saving = false }
    },

    async downloadPDF() {
  this.exporting = true
  const prevZoom = this.zoom
  try {
    if (!window.html2canvas) {
      await new Promise((ok,ko) => { const s=document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'; s.onload=ok; s.onerror=ko; document.head.appendChild(s) })
    }
    if (!window.jspdf) {
      await new Promise((ok,ko) => { const s=document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'; s.onload=ok; s.onerror=ko; document.head.appendChild(s) })
    }

    let photoBackup = null
    if (this.cv.photo && this.cv.photo.startsWith('http')) {
      photoBackup = this.cv.photo
      try { this.cv.photo = await this.toBase64(this.cv.photo); await this.$nextTick() } catch(e) { console.warn(e) }
    }

    this.zoom = 1; await this.$nextTick(); await new Promise(r => setTimeout(r, 600))

    const el = document.getElementById('cv-render')
    const orig = { width: el.style.width, minHeight: el.style.minHeight, fontSize: el.style.fontSize, position: el.style.position }

    el.style.width     = '794px'
    el.style.minHeight = '1123px'
    el.style.fontSize  = '13px'
    el.style.position  = 'relative'

    await new Promise(r => setTimeout(r, 300))

    // ── Capture EXACTEMENT comme l'ancien (height fixe 1123px) ──
    const canvas = await window.html2canvas(el, {
      scale: 3, useCORS: true, allowTaint: true, backgroundColor: '#ffffff',
      width: 794, height: 1123,
      windowWidth: 794, windowHeight: 1123,
      scrollX: 0, scrollY: 0, x: 0, y: 0,
      logging: false, imageTimeout: 15000, removeContainer: true,
      onclone: (doc) => {
        const cel = doc.getElementById('cv-render')
        if (cel) {
          cel.style.webkitFontSmoothing = 'antialiased'
          cel.style.textRendering = 'optimizeLegibility'
          cel.style.transform = 'none'
          cel.style.willChange = 'auto'
          cel.style.filter = 'none'
        }
      }
    })

    // ── Capture la suite si le contenu dépasse 1123px ──
    // On mesure la vraie hauteur totale
    const totalHeight = el.scrollHeight
    let canvas2 = null

    if (totalHeight > 1123) {
      // Capture le reste à partir de 1123px avec une marge haute de 20px
      const MARGE = 20  // px de marge en haut de la page 2
      const reste  = totalHeight - 1123

      canvas2 = await window.html2canvas(el, {
        scale: 3, useCORS: true, allowTaint: true, backgroundColor: '#ffffff',
        width: 794, height: reste + MARGE,
        windowWidth: 794, windowHeight: totalHeight,
        scrollX: 0, scrollY: 0,
        x: 0, y: 1123 - MARGE,  // commence MARGE px avant la coupure
        logging: false, imageTimeout: 15000, removeContainer: true,
        onclone: (doc) => {
          const cel = doc.getElementById('cv-render')
          if (cel) {
            cel.style.webkitFontSmoothing = 'antialiased'
            cel.style.textRendering = 'optimizeLegibility'
            cel.style.transform = 'none'
            cel.style.willChange = 'auto'
            cel.style.filter = 'none'
            // Hauteur totale pour que html2canvas voie tout le contenu
            cel.style.height = totalHeight + 'px'
          }
        }
      })
    }

    const { jsPDF } = window.jspdf
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
    const pageW = pdf.internal.pageSize.getWidth()   // 210mm
    const pageH = pdf.internal.pageSize.getHeight()  // 297mm

    // ── Page 1 : exactement comme l'ancien ──
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pageW, pageH, undefined, 'FAST')

    // ── Page 2 si contenu déborde ──
    if (canvas2) {
      pdf.addPage()

      // Calcule la hauteur mm du canvas2
      // canvas2.height = (reste + MARGE) * 3 (scale=3)
      const MARGE    = 20
      const pxToMm   = pageW / 794
      const heightMm = ((canvas2.height / 3)) * pxToMm

      pdf.addImage(canvas2.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pageW, heightMm, undefined, 'FAST')
    }

    pdf.save(`CV_${this.cv.firstName || 'CV'}_${this.cv.lastName || ''}.pdf`)

    el.style.width     = orig.width
    el.style.minHeight = orig.minHeight
    el.style.fontSize  = orig.fontSize
    el.style.position  = orig.position

    if (photoBackup) { this.cv.photo = photoBackup; this.cv.photoUrl = photoBackup }

  } catch(e) {
    console.error('PDF error:', e)
    alert('Erreur lors de la génération du PDF.')
  } finally {
    this.zoom = prevZoom
    this.exporting = false
  }
},
    toBase64(url) {
      return new Promise((resolve, reject) => {
        API.get('/proxy-image', { params:{url}, responseType:'arraybuffer' })
          .then(r => {
            const b = new Uint8Array(r.data); let s = ''
            b.forEach(x => s += String.fromCharCode(x))
            resolve(`data:${r.headers['content-type']||'image/jpeg'};base64,${window.btoa(s)}`)
          })
          .catch(() => {
            const img = new Image(); img.crossOrigin = 'anonymous'
            img.onload = () => {
              const c = document.createElement('canvas')
              c.width = img.naturalWidth||300; c.height = img.naturalHeight||300
              c.getContext('2d').drawImage(img, 0, 0)
              resolve(c.toDataURL('image/jpeg', 0.92))
            }
            img.onerror = reject
            img.src = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now()
          })
      })
    },
  },
}
</script>

<style scoped>
.cvgen{display:flex;flex-direction:column;height:100vh;overflow:hidden;background:#f5f6f8;font-family:'DM Sans',sans-serif}
.cvgen-topbar{display:flex;align-items:center;justify-content:space-between;padding:0 20px;height:56px;background:#fff;border-bottom:1px solid #eaecef;flex-shrink:0;gap:12px}
.topbar-left{display:flex;align-items:center;gap:10px}
.logo-box{width:32px;height:32px;background:#111827;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0}
.logo-title{font-size:13.5px;font-weight:700;color:#111;line-height:1.2}
.logo-sub{font-size:10px;color:#aaa}
.save-saving{color:#f59e0b}.save-ok{color:#22c55e}
.topbar-right{display:flex;align-items:center;gap:8px}
.stepper-pills{display:flex;gap:3px;background:#f5f6f8;padding:3px;border-radius:10px}
.step-pill{display:flex;align-items:center;gap:4px;padding:5px 9px;border-radius:7px;border:none;background:transparent;font-size:11px;font-weight:600;color:#888;cursor:pointer;font-family:inherit;transition:all .15s}
.step-pill:hover{background:#fff;color:#333}
.step-pill.active{background:#fff;color:#111;box-shadow:0 1px 4px rgba(0,0,0,.1)}
.step-pill.done{color:#22c55e}
.step-num{width:15px;height:15px;border-radius:50%;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-size:8.5px;font-weight:800;color:#888;flex-shrink:0}
.step-pill.active .step-num{background:#111827;color:#fff}
.step-check{width:15px;height:15px;border-radius:50%;background:#22c55e;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;flex-shrink:0}
.step-pill-label{white-space:nowrap}
.btn-pdf{display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:8px;background:#111827;color:#fff;border:none;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:opacity .15s;flex-shrink:0}
.btn-pdf:hover{opacity:.85}.btn-pdf:disabled{opacity:.5;cursor:not-allowed}
.workspace{display:grid;grid-template-columns:380px 1fr;flex:1;overflow:hidden}
.form-panel{display:flex;flex-direction:column;background:#fff;border-right:1px solid #eaecef;overflow:hidden}
.step-header{padding:13px 16px 11px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.step-header-title{font-size:13.5px;font-weight:800;color:#111}
.step-header-sub{font-size:10.5px;color:#aaa;margin-top:1px}
.step-nav{display:flex;align-items:center;gap:5px}
.step-nav-btn{width:24px;height:24px;border-radius:6px;border:1px solid #e5e7eb;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#666}
.step-nav-btn:hover:not(:disabled){background:#f5f6f8}
.step-nav-btn:disabled{opacity:.3;cursor:not-allowed}
.step-nav-count{font-size:10.5px;color:#aaa;font-weight:600;min-width:30px;text-align:center}
.form-body{flex:1;overflow-y:auto;padding:14px}
.form-body::-webkit-scrollbar{width:3px}
.form-body::-webkit-scrollbar-thumb{background:#e5e7eb}
.photo-upload-area{display:flex;gap:12px;align-items:flex-start;padding:12px;border:1.5px dashed #e5e7eb;border-radius:10px;background:#fafafa}
.photo-preview-wrap{position:relative;flex-shrink:0}
.photo-preview{width:72px;height:72px;border-radius:50%;border:2px solid #e5e7eb;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#f0f2f5;position:relative;cursor:pointer}
.photo-preview.has-photo{border-color:#d1d5db}
.photo-preview-img{width:100%;height:100%;object-fit:cover}
.photo-placeholder{color:#aaa}
.photo-overlay{position:absolute;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s;cursor:pointer;color:#fff;border-radius:50%}
.photo-preview:hover .photo-overlay{opacity:1}
.photo-file-input{display:none}
.photo-controls{display:flex;flex-direction:column;gap:6px;flex:1}
.btn-photo-upload{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:7px;border:1.5px solid #e5e7eb;background:#fff;font-size:12px;font-weight:600;color:#374151;cursor:pointer;font-family:inherit;transition:all .15s}
.btn-photo-upload:hover{border-color:#111;color:#111}
.btn-photo-remove{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border-radius:6px;border:1px solid #fecaca;background:#fef2f2;font-size:11px;font-weight:600;color:#dc2626;cursor:pointer;font-family:inherit}
.btn-photo-remove:hover{background:#fee2e2}
.photo-uploading{display:flex;align-items:center;gap:6px;font-size:11px;color:#6b7280}
.photo-hint{font-size:10.5px;color:#aaa}
.pane{display:flex;flex-direction:column;gap:10px}
.pane-title{font-size:13.5px;font-weight:800;color:#111;margin:0}
.pane-add-bar{display:flex;align-items:center;justify-content:space-between}
.pane-count{font-size:11px;color:#888}
.pane-empty{text-align:center;padding:28px 16px;color:#aaa;font-size:12.5px;line-height:2}
.btn-add-big{margin-top:6px;padding:7px 14px;border-radius:7px;border:1.5px dashed #d1d5db;background:transparent;font-size:12.5px;font-weight:700;color:#666;cursor:pointer;font-family:inherit}
.pane-divider{height:1px;background:#f0f0f0;margin:6px 0}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.f{display:flex;flex-direction:column;gap:3px}
.f label{font-size:11px;font-weight:600;color:#6b7280}
.inp{padding:7px 10px;border:1.5px solid #e5e7eb;border-radius:7px;font-size:12.5px;font-family:inherit;background:#fff;color:#111;outline:none;width:100%;transition:border-color .15s;box-sizing:border-box}
.inp:focus{border-color:#111827}
.ta{min-height:76px;resize:vertical}
.ta-sm{min-height:52px;resize:vertical}
.btn-add{padding:4px 9px;border-radius:5px;border:1.5px dashed #d1d5db;background:transparent;font-size:11px;font-weight:700;color:#6b7280;cursor:pointer;font-family:inherit}
.btn-add:hover{border-color:#111;color:#111}
.entry{border:1px solid #e5e7eb;border-radius:8px;padding:9px;background:#fafafa;display:flex;flex-direction:column;gap:6px}
.entry-head{display:flex;justify-content:space-between;align-items:center}
.entry-label{font-size:10.5px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px}
.btn-x{background:none;border:none;cursor:pointer;color:#ccc;font-size:11px;padding:2px 4px;border-radius:3px}
.btn-x:hover{background:#fee2e2;color:#dc2626}
.skill-row{display:flex;align-items:center;gap:6px;margin-bottom:4px}
.dots-input{display:flex;gap:3px;flex-shrink:0}
.dot-btn{width:10px;height:10px;border-radius:50%;border:2px solid #d1d5db;background:transparent;cursor:pointer;padding:0;transition:all .12s}
.dot-btn:hover{transform:scale(1.25)}
.btn-xs{background:none;border:1px solid #e5e7eb;cursor:pointer;color:#aaa;font-size:9.5px;padding:3px 5px;border-radius:4px;flex-shrink:0}
.btn-xs:hover{background:#fee2e2;color:#dc2626;border-color:transparent}
.hint-block{font-size:10.5px;color:#9ca3af;background:#f9fafb;padding:6px 10px;border-radius:6px;border:1px dashed #e5e7eb}
.desc-label-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:2px}
.desc-label-row label{margin:0}
.desc-mode-tabs{display:flex;gap:2px;background:#f3f4f6;padding:2px;border-radius:6px}
.desc-tab{padding:3px 9px;border-radius:4px;border:none;background:transparent;font-size:10.5px;font-weight:600;color:#9ca3af;cursor:pointer;font-family:inherit;transition:all .15s}
.desc-tab.active{background:#fff;color:#111;box-shadow:0 1px 3px rgba(0,0,0,.1)}
.bullets-editor{display:flex;flex-direction:column;gap:4px;background:#f9fafb;border:1.5px solid #e5e7eb;border-radius:7px;padding:8px}
.bullets-hint{font-size:10px;color:#aaa;margin-bottom:4px;line-height:1.5}
.bullets-hint kbd{background:#e5e7eb;border-radius:3px;padding:1px 4px;font-size:9.5px;color:#555;font-family:monospace}
.bullet-row{display:flex;align-items:center;gap:6px}
.bullet-icon{font-size:14px;flex-shrink:0;line-height:1;margin-bottom:1px}
.bullet-inp{flex:1;padding:5px 8px;border:1.5px solid #e5e7eb;border-radius:6px;font-size:12px;font-family:inherit;background:#fff;color:#111;outline:none;transition:border-color .15s;box-sizing:border-box}
.bullet-inp:focus{border-color:#111827}
.bullet-del{flex-shrink:0;opacity:.4}
.bullet-del:hover{opacity:1}
.btn-add-bullet{margin-top:2px;padding:4px 10px;border-radius:5px;border:1.5px dashed #d1d5db;background:transparent;font-size:11px;font-weight:600;color:#9ca3af;cursor:pointer;font-family:inherit;align-self:flex-start;transition:all .15s}
.btn-add-bullet:hover{border-color:#6b7280;color:#374151}
.desc-tip{font-size:10.5px;color:#9ca3af;margin-top:4px;padding:4px 8px;background:#f9fafb;border-radius:5px;border:1px dashed #e5e7eb}
.desc-tip code{background:#e5e7eb;padding:1px 4px;border-radius:3px;font-size:10px}
.tpl-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-bottom:4px}
.tpl-card{cursor:pointer;transition:transform .15s}
.tpl-card:hover{transform:translateY(-2px)}
.tpl-preview{border:2px solid #e5e7eb;border-radius:9px;overflow:hidden;padding:7px;background:#fff;position:relative;aspect-ratio:.75;transition:border-color .15s}
.tpl-badge{position:absolute;top:4px;right:4px;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:8px;font-weight:800}
.tpl-name{font-size:9.5px;font-weight:600;color:#555;text-align:center;margin-top:4px}
.tp-c,.tp-m,.tp-mod,.tp-corp,.tp-eleg,.tp-dark,.tp-tl,.tp-swiss,.tp-creative,.tp-tech,.tp-acad,.tp-lux,.tp-grad,.tp-compact{height:100%;display:flex;flex-direction:column;gap:2px}
.tp-ln{height:2.5px;border-radius:2px;background:#e5e7eb}
.tp-bar{height:2.5px;border-radius:2px;opacity:.7}
.tp-divline,.tp-acc{height:2px;border-radius:2px}
.tp-dot{width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.4);flex-shrink:0}
.tp-dot.lg{width:18px;height:18px;background:rgba(255,255,255,.35);margin:0 auto}
.tp-dot.sm{width:20px;height:20px;background:#e5e7eb;margin:0 auto}
.tp-dot.dark{background:#374151}
.tp-sq{width:13px;height:13px;border-radius:3px;background:#e5e7eb;flex-shrink:0}
.tp-c-hd{padding:4px;border-radius:3px;display:flex;gap:3px;align-items:center}
.tp-c-body,.tp-2col{display:flex;gap:3px;flex:1;margin-top:2px}
.tp-c-left{width:32%;background:#f8fafc;padding:2px;border-radius:2px;display:flex;flex-direction:column;gap:2px}
.tp-c-right{flex:1;display:flex;flex-direction:column;gap:2px;padding:2px}
.tp-mod-side{width:32%;padding:3px;border-radius:3px;display:flex;flex-direction:column;align-items:center;gap:2px}
.tp-mod-main{flex:1;padding:3px;display:flex;flex-direction:column;gap:2px}
.tp-corp-hd{display:flex;gap:3px;align-items:center;margin-bottom:2px}
.tp-corp-bar{height:2px;margin:2px 0}
.tp-m-hd{display:flex;justify-content:space-between;align-items:flex-start}
.tp-eleg-hd{border-bottom:2px solid;padding-bottom:4px;margin-bottom:4px}
.tp-dark-hd{display:flex;gap:3px;align-items:center;padding:3px;background:#1f2937;border-radius:3px}
.tp-dark-body{flex:1;background:#111827;padding:3px;border-radius:3px;margin-top:2px;display:flex;flex-direction:column;gap:2px}
.tp-tl-hd{border-left:3px solid;padding:3px 3px 3px 5px;margin-bottom:3px;background:rgba(0,0,0,.04);border-radius:0 3px 3px 0}
.tp-tl-line{position:relative;padding-left:6px;border-left:1.5px solid;display:flex;flex-direction:column;gap:3px;margin-left:3px}
.tp-tl-dot{width:6px;height:6px;border-radius:50%;position:relative}
.tp-sw-bar{height:3px;border-radius:0;margin-bottom:3px}
.tp-sw-name{margin-bottom:3px}
.tp-sw-grid{display:flex;gap:3px;flex:1}
.tp-sw-left,.tp-sw-right{flex:1;display:flex;flex-direction:column;gap:2px}
.tp-cr-hd{height:30%;border-radius:3px 3px 0 0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4px}
.tp-cr-circle{width:14px;height:14px;border-radius:50%;border:2px solid}
.tp-cr-body{flex:1;padding:3px;display:flex;flex-direction:column;gap:2px}
.tp-cr-tag{height:6px;border-radius:3px;border:1px solid;width:60%}
.tp-tk-hd{padding:4px;border-radius:3px 3px 0 0;display:flex;flex-direction:column;gap:2px}
.tp-tk-body{flex:1;padding:3px;display:flex;flex-direction:column;gap:2px}
.tp-tk-tag{height:6px;border-radius:2px;border:1px solid;width:50%}
.tp-acad-hd{border-top:3px solid;padding:4px 3px 3px;margin-bottom:3px;display:flex;flex-direction:column;gap:2px}
.tp-lux-hd{display:flex;flex-direction:column;align-items:center;gap:2px;padding:3px}
.tp-lux-line{height:1.5px;width:100%}
.tp-grad-side{width:35%;padding:3px;border-radius:3px;display:flex;flex-direction:column;align-items:center;gap:2px}
.tp-grad-main{flex:1;padding:3px;display:flex;flex-direction:column;gap:2px}
.tp-compact-hd{padding:4px;border-radius:3px;margin-bottom:3px;display:flex;flex-direction:column;gap:2px}
.tp-compact-body{flex:1;padding:2px;display:flex;flex-direction:column;gap:3px}
.tp-compact-row{display:flex;align-items:center;gap:3px}
.tp-compact-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.wh{background:rgba(255,255,255,.75)!important}
.wh50{background:rgba(255,255,255,.35)!important}
.bold{background:#222!important;height:3.5px!important}
.w100{width:100%}.w90{width:90%}.w80{width:80%}.w70{width:70%}.w65{width:65%}.w60{width:60%}.w50{width:50%}.w45{width:45%}.w40{width:40%}
.mt1{margin-top:2px}.mt2{margin-top:4px}.mt3{margin-top:6px}
.color-section{margin-top:10px}
.color-title{font-size:11px;font-weight:700;color:#555;margin-bottom:7px}
.color-grid{display:flex;flex-wrap:wrap;gap:5px}
.color-swatch{width:24px;height:24px;border-radius:50%;border:2px solid transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .15s;padding:0}
.color-swatch.active{border-color:#fff;box-shadow:0 0 0 2px currentColor;transform:scale(1.15)}
.color-swatch:hover{transform:scale(1.15)}
.form-footer{padding:9px 14px;border-top:1px solid #eaecef;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:#fff}
.btn-prev{display:flex;align-items:center;gap:4px;padding:6px 11px;border-radius:7px;border:1px solid #e5e7eb;background:#fff;font-size:12px;font-weight:600;color:#555;cursor:pointer;font-family:inherit}
.btn-prev:hover:not(:disabled){background:#f5f6f8}
.btn-prev:disabled{opacity:.3;cursor:not-allowed}
.btn-next{display:flex;align-items:center;gap:4px;padding:6px 13px;border-radius:7px;border:none;color:#fff;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:opacity .15s}
.btn-next:hover:not(:disabled){opacity:.85}
.btn-next:disabled{opacity:.5;cursor:not-allowed}
.step-dots{display:flex;gap:4px}
.step-dot{width:6px;height:6px;border-radius:50%;background:#e5e7eb;cursor:pointer;transition:all .2s}
.step-dot.active{width:16px;border-radius:3px}
.step-dot.done{background:#22c55e}
.preview-panel{display:flex;flex-direction:column;background:#e8eaed;overflow:hidden}
.preview-bar{display:flex;align-items:center;justify-content:space-between;padding:6px 12px;background:#fff;border-bottom:1px solid #eaecef;flex-shrink:0}
.live-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.live-label{font-size:11px;font-weight:600;color:#888}
.zoom-btn{height:22px;border-radius:5px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;font-size:13px;font-weight:700;color:#555;padding:0 6px;display:flex;align-items:center;line-height:1}
.zoom-btn:hover{background:#f5f5f5}
.zoom-val{font-size:11px;font-weight:700;color:#555;min-width:34px;text-align:center}
.preview-stage{flex:1;overflow:auto;padding:22px;display:flex;justify-content:center;align-items:flex-start}
.spin{display:inline-block;width:11px;height:11px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:sp .6s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
.drag-hint{display:flex;align-items:center;gap:5px;font-size:10.5px;color:#aaa;margin-bottom:4px;padding:3px 6px;background:#f9fafb;border-radius:5px;border:1px dashed #e5e7eb}
.drag-handle{display:flex;align-items:center;cursor:grab;color:#bbb;padding:2px 3px;border-radius:3px;transition:color .15s}
.drag-handle:hover{color:#6b7280;background:#f0f0f0}
.drag-handle:active{cursor:grabbing}
.drag-handle-sm{display:flex;align-items:center;cursor:grab;color:#bbb;padding:2px 3px;border-radius:3px;flex-shrink:0;transition:color .15s}
.drag-handle-sm:hover{color:#6b7280}
.drag-handle-sm:active{cursor:grabbing}
.draggable-row{transition:background .12s,box-shadow .12s;border-radius:7px;padding:2px 3px}
.entry.dragging,.draggable-row.dragging{opacity:.35;background:#f0f9ff!important;box-shadow:0 0 0 2px #bfdbfe;border-radius:7px}
.entry.drag-over,.draggable-row.drag-over{background:#eff6ff!important;box-shadow:0 0 0 2px #3b82f6;border-radius:7px;transform:scale(1.01)}
@media(max-width:1200px){.workspace{grid-template-columns:340px 1fr}}
@media(max-width:900px){.workspace{grid-template-columns:1fr;grid-template-rows:55vh 1fr;overflow:auto;height:auto}.cvgen{height:auto}.cvgen-topbar{flex-wrap:wrap;height:auto;padding:10px 16px;gap:8px}.stepper-pills{flex-wrap:wrap}.step-pill-label{display:none}.tpl-grid{grid-template-columns:repeat(5,1fr)}}
@media(max-width:600px){.tpl-grid{grid-template-columns:repeat(4,1fr)}}
</style>