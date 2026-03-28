<template>
  <div class="cvgen">

    <!-- ══ TOPBAR ══ -->
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

    <!-- ══ WORKSPACE ══ -->
    <div class="workspace">

      <!-- ── Panneau gauche ── -->
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

          <!-- ══ ÉTAPE 1 : INFOS PERSONNELLES ══ -->
          <div v-show="currentStep===0" class="pane">
            <div class="row2">
              <div class="f"><label>Prénom *</label><input v-model="cv.firstName" class="inp" placeholder="Jean"/></div>
              <div class="f"><label>Nom *</label><input v-model="cv.lastName" class="inp" placeholder="Kouadio"/></div>
            </div>
            <!-- ── NOUVEAU : date de naissance ── -->
            <div class="row2">
              <div class="f">
                <label>Date de naissance</label>
                <input v-model="cv.dateNaissance" type="date" class="inp" />
              </div>
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

            <!-- ── PHOTO UPLOAD ── -->
            <div class="f">
              <label>Photo de profil</label>
              <div class="photo-upload-area">
                <div class="photo-preview-wrap">
                  <div class="photo-preview" :class="{'has-photo': cv.photo}">
                    <img v-if="cv.photo" :src="cv.photo" class="photo-preview-img" @error="cv.photo=''"/>
                    <div v-else class="photo-placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <label class="photo-overlay" for="photo-file-input">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </label>
                  </div>
                  <input id="photo-file-input" type="file" accept="image/*" class="photo-file-input" @change="onPhotoFile"/>
                </div>
                <div class="photo-controls">
                  <label for="photo-file-input" class="btn-photo-upload">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Choisir une photo
                  </label>
                  <button v-if="cv.photo" class="btn-photo-remove" @click="cv.photo=''">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Supprimer
                  </button>
                  <span v-if="photoUploading" class="photo-uploading">
                    <span class="spin" style="border-color:#4f46e5;border-top-color:transparent"></span>
                    Envoi...
                  </span>
                  <span class="photo-hint">JPG, PNG · Max 5 Mo</span>
                </div>
              </div>
              <div class="photo-url-row">
                <span class="photo-url-or">ou URL directe</span>
                <input v-model="cv.photoUrl" class="inp inp-sm" placeholder="https://..." @input="cv.photo = cv.photoUrl"/>
              </div>
            </div>
          </div>

          <!-- ══ ÉTAPE 2 : EXPÉRIENCES ══ -->
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
                  <span class="drag-handle" title="Déplacer">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                  </span>
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
              <div class="f"><label>Description</label><textarea v-model="e.description" class="inp ta-sm" rows="3" placeholder="Missions et réalisations..."></textarea></div>

            </div>
          </div>

          <!-- ══ ÉTAPE 3 : FORMATION ══ -->
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
            <div
              v-for="(e,i) in cv.education" :key="'edu'+i"
              class="entry"
              :class="{dragging: dragState.list==='education' && dragState.from===i, 'drag-over': dragState.list==='education' && dragState.over===i}"
              draggable="true"
              @dragstart="onDragStart('education',i,$event)"
              @dragover.prevent="onDragOver('education',i)"
              @dragleave="onDragLeave"
              @drop.prevent="onDrop('education',i)"
              @dragend="onDragEnd"
            >
              <div class="entry-head">
                <div style="display:flex;align-items:center;gap:7px">
                  <span class="drag-handle" title="Déplacer">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                  </span>
                  <span class="entry-label">Formation {{ i+1 }}</span>
                </div>
                <button class="btn-x" @click="cv.education.splice(i,1)">✕</button>
              </div>
              <div class="f"><label>Diplôme *</label><input v-model="e.degree" class="inp" placeholder="Master Informatique"/></div>
              <div class="f"><label>Établissement</label><input v-model="e.school" class="inp" placeholder="INPHB Yamoussoukro"/></div>
              <div class="row3">
                <div class="f"><label>Année (affichage)</label><input v-model="e.year" class="inp" placeholder="2021"/></div>
                <div class="f"><label>Année début</label><input v-model="e.anneeDebut" class="inp" placeholder="2019"/></div>
                <div class="f"><label>Année fin</label><input v-model="e.anneeFin" class="inp" placeholder="2021"/></div>
              </div>
            </div>
          </div>

          <!-- ══ ÉTAPE 4 : COMPÉTENCES + LANGUES + CENTRES D'INTÉRÊT + APTITUDES ══ -->
          <div v-show="currentStep===3" class="pane">

            <!-- ── COMPÉTENCES ── -->
            <div class="pane-add-bar">
              <span class="pane-count" style="font-weight:700;color:#333">⚡ Compétences</span>
              <button class="btn-add" @click="cv.skills.push({name:'',level:3})">+ Ajouter</button>
            </div>
            <div v-if="!cv.skills.length" class="pane-empty">
              <div style="font-size:28px">⚡</div>
              <button class="btn-add-big" @click="cv.skills.push({name:'',level:3})">+ Ajouter une compétence</button>
            </div>
            <div class="drag-hint" v-if="cv.skills.length>1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
              Glissez pour réordonner
            </div>
            <div
              v-for="(s,i) in cv.skills" :key="'sk'+i"
              class="skill-row draggable-row"
              :class="{dragging: dragState.list==='skills' && dragState.from===i, 'drag-over': dragState.list==='skills' && dragState.over===i}"
              draggable="true"
              @dragstart="onDragStart('skills',i,$event)"
              @dragover.prevent="onDragOver('skills',i)"
              @dragleave="onDragLeave"
              @drop.prevent="onDrop('skills',i)"
              @dragend="onDragEnd"
            >
              <span class="drag-handle-sm" title="Déplacer">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
              </span>
              <input v-model="s.name" class="inp" placeholder="Vue.js, Laravel..." style="flex:1"/>
              <div class="dots-input">
                <button v-for="d in 4" :key="d" class="dot-btn" :class="{filled:d<=s.level}"
                  :style="d<=s.level?{background:accentColor,borderColor:accentColor}:{}"
                  @click="s.level=d"></button>
              </div>
              <button class="btn-xs" @click="cv.skills.splice(i,1)">✕</button>
            </div>

            <div class="pane-divider"></div>

            <!-- ── LANGUES ── -->
            <div class="pane-add-bar" style="margin-top:4px">
              <span class="pane-count" style="font-weight:700;color:#333">🌍 Langues</span>
              <button class="btn-add" @click="cv.languages.push({name:'',level:'Courant'})">+ Ajouter</button>
            </div>
            <div class="drag-hint" v-if="cv.languages.length>1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
              Glissez pour réordonner
            </div>
            <div
              v-for="(l,i) in cv.languages" :key="'lg'+i"
              class="skill-row draggable-row"
              :class="{dragging: dragState.list==='languages' && dragState.from===i, 'drag-over': dragState.list==='languages' && dragState.over===i}"
              draggable="true"
              @dragstart="onDragStart('languages',i,$event)"
              @dragover.prevent="onDragOver('languages',i)"
              @dragleave="onDragLeave"
              @drop.prevent="onDrop('languages',i)"
              @dragend="onDragEnd"
            >
              <span class="drag-handle-sm" title="Déplacer">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
              </span>
              <input v-model="l.name" class="inp" placeholder="Français" style="flex:1"/>
              <select v-model="l.level" class="inp" style="width:120px;flex-shrink:0">
                <option>Natif</option><option>Courant</option><option>Intermédiaire</option><option>Notions</option>
              </select>
              <button class="btn-xs" @click="cv.languages.splice(i,1)">✕</button>
            </div>

            <div class="pane-divider"></div>

            <!-- ── CENTRES D'INTÉRÊT ── -->
            <div class="pane-add-bar" style="margin-top:4px">
              <span class="pane-count" style="font-weight:700;color:#333">🎯 Centres d'intérêt</span>
              <button class="btn-add" @click="cv.centresInteret.push({name:''})">+ Ajouter</button>
            </div>
            <div v-if="!cv.centresInteret.length" class="pane-empty" style="padding:12px 16px">
              <button class="btn-add-big" @click="cv.centresInteret.push({name:''})">+ Ajouter un centre d'intérêt</button>
            </div>
            <div class="drag-hint" v-if="cv.centresInteret.length>1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
              Glissez pour réordonner
            </div>
            <div
              v-for="(c,i) in cv.centresInteret" :key="'ci'+i"
              class="skill-row draggable-row"
              :class="{dragging: dragState.list==='centresInteret' && dragState.from===i, 'drag-over': dragState.list==='centresInteret' && dragState.over===i}"
              draggable="true"
              @dragstart="onDragStart('centresInteret',i,$event)"
              @dragover.prevent="onDragOver('centresInteret',i)"
              @dragleave="onDragLeave"
              @drop.prevent="onDrop('centresInteret',i)"
              @dragend="onDragEnd"
            >
              <span class="drag-handle-sm" title="Déplacer">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
              </span>
              <input v-model="c.name" class="inp" placeholder="Musique, Sport, Voyage..." style="flex:1"/>
              <button class="btn-xs" @click="cv.centresInteret.splice(i,1)">✕</button>
            </div>

            <div class="pane-divider"></div>

            <!-- ── APTITUDES ── -->
            <div class="pane-add-bar" style="margin-top:4px">
              <span class="pane-count" style="font-weight:700;color:#333">🧠 Aptitudes</span>
              <button class="btn-add" @click="cv.aptitudes.push({name:'',level:3})">+ Ajouter</button>
            </div>
            <div class="hint-block">Les aptitudes sont optionnelles — ajoutez-les uniquement si pertinent (ex: Leadership, Communication…)</div>
            <div class="drag-hint" v-if="cv.aptitudes.length>1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
              Glissez pour réordonner
            </div>
            <div
              v-for="(a,i) in cv.aptitudes" :key="'ap'+i"
              class="skill-row draggable-row"
              :class="{dragging: dragState.list==='aptitudes' && dragState.from===i, 'drag-over': dragState.list==='aptitudes' && dragState.over===i}"
              draggable="true"
              @dragstart="onDragStart('aptitudes',i,$event)"
              @dragover.prevent="onDragOver('aptitudes',i)"
              @dragleave="onDragLeave"
              @drop.prevent="onDrop('aptitudes',i)"
              @dragend="onDragEnd"
            >
              <span class="drag-handle-sm" title="Déplacer">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
              </span>
              <input v-model="a.name" class="inp" placeholder="Leadership, Gestion d'équipe..." style="flex:1"/>
              <div class="dots-input">
                <button v-for="d in 4" :key="d" class="dot-btn" :class="{filled:d<=a.level}"
                  :style="d<=a.level?{background:'#f59e0b',borderColor:'#f59e0b'}:{}"
                  @click="a.level=d"></button>
              </div>
              <button class="btn-xs" @click="cv.aptitudes.splice(i,1)">✕</button>
            </div>

          </div>

          <!-- ══ ÉTAPE 5 : PROJETS ══ -->
          <div v-show="currentStep===4" class="pane">
            <div class="pane-add-bar">
              <span class="pane-count">{{ cv.projects.filter(p=>p.name).length }} projet(s)</span>
              <button class="btn-add" @click="cv.projects.push({name:'',tech:'',description:'',url:''})">+ Ajouter</button>
            </div>
            <div v-if="!cv.projects.length" class="pane-empty">
              <div style="font-size:32px">🚀</div><p>Mettez en avant vos projets</p>
              <button class="btn-add-big" @click="cv.projects.push({name:'',tech:'',description:'',url:''})">+ Ajouter un projet</button>
            </div>
            <div v-for="(p,i) in cv.projects" :key="i" class="entry">
              <div class="entry-head"><span class="entry-label">Projet {{ i+1 }}</span><button class="btn-x" @click="cv.projects.splice(i,1)">✕</button></div>
              <div class="f"><label>Nom *</label><input v-model="p.name" class="inp" placeholder="Mon Application"/></div>
              <div class="f"><label>Technologies</label><input v-model="p.tech" class="inp" placeholder="Vue.js, Laravel, MySQL"/></div>
              <div class="f"><label>Description</label><textarea v-model="p.description" class="inp ta-sm" rows="2"></textarea></div>
              <div class="f"><label>Lien</label><input v-model="p.url" class="inp" placeholder="https://github.com/..."/></div>
            </div>
          </div>

          <!-- ══ ÉTAPE 6 : MODÈLE ══ -->
          <div v-show="currentStep===5" class="pane">
            <p class="pane-title">Choisissez votre modèle</p>
            <div class="tpl-grid">
              <div v-for="t in templates" :key="t.id"
                class="tpl-card" :class="{active:selectedTpl===t.id}"
                @click="selectedTpl=t.id; accentColor=t.defaultAccent">
                <div class="tpl-preview" :style="{borderColor:selectedTpl===t.id?accentColor:'#e5e7eb'}">
                  <!-- Classic -->
                  <div v-if="t.id==='classic'" class="tp-c">
                    <div class="tp-c-hd" :style="{background:aod(t)}"><div class="tp-dot"></div><div><div class="tp-ln w70"></div><div class="tp-ln w50 mt2"></div></div></div>
                    <div class="tp-c-body"><div class="tp-c-left"><div class="tp-ln w90"></div><div class="tp-bar mt1" :style="{background:aod(t)}"></div><div class="tp-ln w70 mt2"></div><div class="tp-bar mt1" :style="{background:aod(t)}"></div></div><div class="tp-c-right"><div class="tp-ln w100"></div><div class="tp-ln w80 mt1"></div><div class="tp-ln w90 mt2"></div><div class="tp-ln w70 mt1"></div></div></div>
                  </div>
                  <!-- Minimal -->
                  <div v-else-if="t.id==='minimal'" class="tp-m">
                    <div class="tp-m-hd"><div class="tp-ln w60 bold"></div><div class="tp-ln w40 mt1"></div></div>
                    <div class="tp-divline mt2" :style="{background:aod(t)}"></div>
                    <div class="tp-ln w100 mt2"></div><div class="tp-ln w80 mt1"></div>
                    <div class="tp-2col mt2"><div><div class="tp-acc" :style="{background:aod(t)}"></div><div class="tp-ln w90 mt1"></div></div><div><div class="tp-acc" :style="{background:aod(t)}"></div><div class="tp-ln w90 mt1"></div></div></div>
                  </div>
                  <!-- Modern -->
                  <div v-else-if="t.id==='modern'" class="tp-mod">
                    <div class="tp-mod-side" :style="{background:aod(t)}"><div class="tp-dot lg"></div><div class="tp-ln w80 mt2 wh"></div><div class="tp-ln w60 mt1 wh50"></div><div class="tp-ln w70 mt2 wh50"></div><div class="tp-ln w50 mt1 wh50"></div></div>
                    <div class="tp-mod-main"><div class="tp-acc" :style="{background:aod(t)}"></div><div class="tp-ln w100 mt1"></div><div class="tp-ln w80 mt1"></div><div class="tp-acc mt2" :style="{background:aod(t)}"></div><div class="tp-ln w100 mt1"></div></div>
                  </div>
                  <!-- Corporate -->
                  <div v-else-if="t.id==='corporate'" class="tp-corp">
                    <div class="tp-corp-hd"><div class="tp-sq"></div><div><div class="tp-ln w60 bold"></div><div class="tp-ln w40 mt1" :style="{background:aod(t)}"></div></div></div>
                    <div class="tp-corp-bar" :style="{background:aod(t)}"></div>
                    <div class="tp-2col"><div><div class="tp-ln w90"></div><div class="tp-bar mt1" :style="{background:aod(t)}"></div></div><div><div class="tp-ln w100"></div><div class="tp-ln w80 mt1"></div></div></div>
                  </div>
                  <!-- Elegant -->
                  <div v-else-if="t.id==='elegant'" class="tp-eleg">
                    <div class="tp-eleg-hd" :style="{borderBottomColor:aod(t)}"><div class="tp-ln w60 bold"></div><div class="tp-ln w40 mt1" :style="{background:aod(t)}"></div></div>
                    <div class="tp-2col mt2"><div><div class="tp-ln w80"></div><div class="tp-dot sm mt1"></div><div class="tp-ln w70 mt1"></div></div><div><div class="tp-ln w100"></div><div class="tp-ln w90 mt1"></div><div class="tp-ln w70 mt1"></div></div></div>
                  </div>
                  <!-- Dark -->
                  <div v-else-if="t.id==='dark'" class="tp-dark">
                    <div class="tp-dark-hd"><div class="tp-dot lg dark"></div><div><div class="tp-ln w70 wh"></div><div class="tp-ln w50 mt1" :style="{background:aod(t)}"></div></div></div>
                    <div class="tp-dark-body"><div><div class="tp-ln w100 wh50"></div><div class="tp-ln w80 mt1 wh50"></div><div class="tp-ln w90 mt1 wh50"></div></div></div>
                  </div>
                  <!-- Timeline -->
                  <div v-else-if="t.id==='timeline'" class="tp-tl">
                    <div class="tp-tl-hd" :style="{background:aod(t)+'22',borderLeftColor:aod(t)}"><div class="tp-ln w60 bold"></div><div class="tp-ln w40 mt1"></div></div>
                    <div class="tp-tl-line" :style="{borderColor:aod(t)}">
                      <div class="tp-tl-dot" :style="{background:aod(t)}"></div><div class="tp-ln w80"></div>
                      <div class="tp-tl-dot mt2" :style="{background:aod(t)}"></div><div class="tp-ln w60 mt2"></div>
                    </div>
                  </div>
                  <!-- Swiss -->
                  <div v-else-if="t.id==='swiss'" class="tp-swiss">
                    <div class="tp-sw-bar" :style="{background:aod(t)}"></div>
                    <div class="tp-sw-name"><div class="tp-ln w70 bold"></div></div>
                    <div class="tp-sw-grid">
                      <div class="tp-sw-left"><div class="tp-ln w80"></div><div class="tp-ln w60 mt1"></div></div>
                      <div class="tp-sw-right"><div class="tp-ln w100"></div><div class="tp-ln w90 mt1"></div><div class="tp-ln w70 mt1"></div></div>
                    </div>
                  </div>
                  <!-- Creative -->
                  <div v-else-if="t.id==='creative'" class="tp-creative">
                    <div class="tp-cr-hd" :style="{background:aod(t)+'dd'}">
                      <div class="tp-cr-circle" :style="{borderColor:'rgba(255,255,255,.5)'}"></div>
                      <div class="tp-ln w60 mt2 wh"></div>
                    </div>
                    <div class="tp-cr-body">
                      <div class="tp-ln w90"></div><div class="tp-ln w70 mt1"></div>
                      <div class="tp-cr-tag mt2" :style="{background:aod(t)+'22',borderColor:aod(t)}"></div>
                    </div>
                  </div>
                  <!-- Tech -->
                  <div v-else-if="t.id==='tech'" class="tp-tech">
                    <div class="tp-tk-hd" :style="{background:'#0d1117'}">
                      <div class="tp-ln w70 wh"></div>
                      <div class="tp-ln w50 mt1" :style="{background:aod(t)}"></div>
                    </div>
                    <div class="tp-tk-body">
                      <div class="tp-tk-tag" :style="{background:aod(t)+'22',borderColor:aod(t)}"></div>
                      <div class="tp-ln w90 mt1"></div><div class="tp-ln w70 mt1"></div>
                    </div>
                  </div>
                  <!-- ── NOUVEAU : Académique ── -->
                  <div v-else-if="t.id==='academic'" class="tp-acad">
                    <div class="tp-acad-hd" :style="{borderTopColor:aod(t)}">
                      <div class="tp-ln w65 bold"></div>
                      <div class="tp-ln w40 mt1" :style="{background:aod(t)+'88'}"></div>
                    </div>
                    <div class="tp-2col mt2">
                      <div><div class="tp-ln w80"></div><div class="tp-ln w60 mt1"></div><div class="tp-acc mt2" :style="{background:aod(t)}"></div></div>
                      <div><div class="tp-ln w100"></div><div class="tp-ln w80 mt1"></div><div class="tp-ln w90 mt2"></div></div>
                    </div>
                  </div>
                  <!-- ── NOUVEAU : Luxe ── -->
                  <div v-else-if="t.id==='luxury'" class="tp-lux">
                    <div class="tp-lux-hd">
                      <div class="tp-lux-line" :style="{background:aod(t)}"></div>
                      <div class="tp-ln w60 bold" style="margin:3px auto;width:60%"></div>
                      <div class="tp-ln w40" style="margin:2px auto;width:40%"></div>
                      <div class="tp-lux-line" :style="{background:aod(t)}"></div>
                    </div>
                    <div class="tp-2col mt2">
                      <div><div class="tp-ln w90"></div><div class="tp-ln w70 mt1"></div></div>
                      <div><div class="tp-ln w100"></div><div class="tp-ln w80 mt1"></div></div>
                    </div>
                  </div>
                  <!-- ── NOUVEAU : Sidebar Gradient ── -->
                  <div v-else-if="t.id==='gradient'" class="tp-grad">
                    <div class="tp-grad-side" :style="{background:`linear-gradient(160deg,${aod(t)},${aod(t)}88)`}">
                      <div class="tp-dot lg" style="opacity:.7"></div>
                      <div class="tp-ln w80 mt2 wh"></div>
                      <div class="tp-ln w60 mt1 wh50"></div>
                    </div>
                    <div class="tp-grad-main">
                      <div class="tp-ln w90"></div><div class="tp-ln w70 mt1"></div>
                      <div class="tp-ln w80 mt2"></div><div class="tp-ln w60 mt1"></div>
                    </div>
                  </div>
                  <!-- ── NOUVEAU : Compact Pro ── -->
                  <div v-else-if="t.id==='compact'" class="tp-compact">
                    <div class="tp-compact-hd" :style="{background:aod(t)+'15',borderBottom:`2px solid ${aod(t)}`}">
                      <div class="tp-ln w70 bold"></div>
                      <div class="tp-ln w45 mt1"></div>
                    </div>
                    <div class="tp-compact-body">
                      <div class="tp-compact-row"><div class="tp-compact-dot" :style="{background:aod(t)}"></div><div class="tp-ln w90"></div></div>
                      <div class="tp-compact-row mt1"><div class="tp-compact-dot" :style="{background:aod(t)}"></div><div class="tp-ln w70"></div></div>
                      <div class="tp-compact-row mt1"><div class="tp-compact-dot" :style="{background:aod(t)}"></div><div class="tp-ln w80"></div></div>
                    </div>
                  </div>

                  <div v-if="selectedTpl===t.id" class="tpl-badge" :style="{background:accentColor}">✓</div>
                </div>
                <div class="tpl-name">{{ t.name }}</div>
              </div>
            </div>
            <div class="color-section">
              <p class="color-title">Couleur principale</p>
              <div class="color-grid">
                <button v-for="c in colorPresets" :key="c.value" class="color-swatch"
                  :class="{active:accentColor===c.value}"
                  :style="{background:c.value}" :title="c.name"
                  @click="accentColor=c.value">
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
            <span v-for="(s,i) in steps" :key="i" class="step-dot"
              :class="{active:i===currentStep,done:i<currentStep}"
              :style="i===currentStep?{background:accentColor}:{}"
              @click="goToStep(i)"></span>
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

      <!-- ── Aperçu droit ── -->
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
                        <div class="cc-eb"><div class="cc-et"><span class="cc-pos">{{ e.position }}</span><span class="cc-date">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div><div class="cc-co">{{ e.company }}</div><p v-if="e.description" class="cc-txt cc-desc">{{ e.description }}</p></div>
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
                  <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="cm-entry"><div class="cm-el"><div class="cm-date">{{ e.startDate }}<br/>{{ e.endDate }}</div></div><div class="cm-er"><div class="cm-pos">{{ e.position }}</div><div class="cm-co">{{ e.company }}</div><p v-if="e.description" class="cm-desc">{{ e.description }}</p></div></div>
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
                      <div class="cmod-eb"><div class="cmod-et"><span class="cmod-pos">{{ e.position }}</span><span class="cmod-date">{{ e.startDate }} – {{ e.endDate||'Présent' }}</span></div><div class="cmod-co">{{ e.company }}</div><p v-if="e.description" class="cmod-desc">{{ e.description }}</p></div>
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
                        <div class="corp-eco">{{ e.company }}</div><p v-if="e.description" class="corp-txt" style="margin-top:3px">{{ e.description }}</p>
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
                        <div><div class="eleg-et"><span class="eleg-pos">{{ e.position }}</span><span class="eleg-date">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div><div class="eleg-co">{{ e.company }}</div><p v-if="e.description" class="eleg-desc">{{ e.description }}</p></div>
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
                        <div><div class="dk-et"><span class="dk-pos">{{ e.position }}</span><span class="dk-date" :style="{color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div><div class="dk-co">{{ e.company }}</div><p v-if="e.description" class="dk-txt dk-desc">{{ e.description }}</p></div>
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
                        <div class="tl-content"><div class="tl-date-badge" :style="{background:accentColor+'15',color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</div><div class="tl-pos">{{ e.position }}</div><div class="tl-co">{{ e.company }}</div><p v-if="e.description" class="tl-desc">{{ e.description }}</p></div>
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
                    <div v-if="cv.summary" class="sw-sec sw-profile">
                      <p class="sw-summary">{{ cv.summary }}</p>
                    </div>
                    <div v-if="cv.experiences.some(e=>e.position)" class="sw-sec">
                      <div class="sw-sec-t" :style="{color:accentColor}">EXPÉRIENCES</div>
                      <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="sw-exp">
                        <div class="sw-exp-head">
                          <div><div class="sw-exp-pos">{{ e.position }}</div><div class="sw-exp-co">{{ e.company }}</div></div>
                          <div class="sw-exp-date" :style="{color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</div>
                        </div>
                        <p v-if="e.description" class="sw-exp-desc">{{ e.description }}</p>
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
                        <div class="cr-exp-body"><div class="cr-exp-top"><span class="cr-exp-pos">{{ e.position }}</span><span class="cr-exp-date" :style="{color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div><div class="cr-exp-co">{{ e.company }}</div><p v-if="e.description" class="cr-exp-desc">{{ e.description }}</p></div>
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
                        <p v-if="e.description" class="tk-exp-desc">{{ e.description }}</p>
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
                   11. ACADÉMIQUE ── NOUVEAU
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
                        <div class="acad-entry-body">
                          <div class="acad-degree">{{ e.degree }}</div>
                          <div class="acad-school">{{ e.school }}</div>
                        </div>
                      </div>
                    </div>
                    <div v-if="cv.experiences.some(e=>e.position)" class="acad-sec">
                      <div class="acad-sec-t" :style="{color:accentColor,borderBottomColor:accentColor+'33'}">Expériences</div>
                      <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="acad-entry">
                        <div class="acad-entry-year" :style="{color:accentColor}">{{ e.startDate }}<br/>{{ e.endDate }}</div>
                        <div class="acad-entry-body">
                          <div class="acad-degree">{{ e.position }}</div>
                          <div class="acad-school">{{ e.company }}</div>
                          <p v-if="e.description" class="acad-desc">{{ e.description }}</p>
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
                   12. LUXE ── NOUVEAU
              ══════════════════════════════════════════ -->
              <div v-if="selectedTpl==='luxury'" class="cv-luxury">
                <div class="lux-top">
                  <div class="lux-ornament" :style="{color:accentColor}">◆ ◆ ◆</div>
                  <div class="lux-photo-area">
                    <img v-if="cv.photo" :src="cv.photo" class="lux-photo" @error="e=>e.target.style.display='none'"/>
                  </div>
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
                        <div class="lux-diamonds">
                          <span v-for="d in 4" :key="d" :style="{color:d<=s.level?accentColor:'#d1d5db',fontSize:'10px'}">◆</span>
                        </div>
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
                        <div class="lux-diamonds">
                          <span v-for="d in 4" :key="d" :style="{color:d<=a.level?'#f59e0b':'#d1d5db',fontSize:'10px'}">◆</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="lux-right">
                    <div v-if="cv.summary" class="lux-sec"><div class="lux-sec-t" :style="{color:accentColor}">PROFIL</div><p class="lux-txt">{{ cv.summary }}</p></div>
                    <div v-if="cv.experiences.some(e=>e.position)" class="lux-sec"><div class="lux-sec-t" :style="{color:accentColor}">EXPÉRIENCES</div>
                      <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="lux-entry">
                        <div class="lux-entry-marker" :style="{background:accentColor}"></div>
                        <div class="lux-entry-body"><div class="lux-entry-top"><span class="lux-pos">{{ e.position }}</span><span class="lux-date" :style="{color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div><div class="lux-co">{{ e.company }}</div><p v-if="e.description" class="lux-desc">{{ e.description }}</p></div>
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
                   13. GRADIENT SIDEBAR ── NOUVEAU
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
                      <div class="grad-entry-body"><div class="grad-entry-top"><span class="grad-pos">{{ e.position }}</span><span class="grad-date" :style="{background:accentColor+'15',color:accentColor}">{{ e.startDate }}{{ e.endDate?' – '+e.endDate:'' }}</span></div><div class="grad-co">{{ e.company }}</div><p v-if="e.description" class="grad-desc">{{ e.description }}</p></div>
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
                   14. COMPACT PRO ── NOUVEAU
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
                <div v-if="cv.summary" class="cp-summary-bar">
                  <p class="cp-summary-txt">{{ cv.summary }}</p>
                </div>
                <div class="cp-body">
                  <div class="cp-main">
                    <div v-if="cv.experiences.some(e=>e.position)" class="cp-sec">
                      <div class="cp-sec-t" :style="{background:accentColor}">EXPÉRIENCES</div>
                      <div v-for="e in cv.experiences.filter(e=>e.position)" :key="e.position" class="cp-entry">
                        <div class="cp-entry-left">
                          <div class="cp-entry-dates" :style="{color:accentColor}">{{ e.startDate }}<br/>{{ e.endDate }}</div>
                          <div class="cp-entry-vline" :style="{borderColor:accentColor+'44'}"></div>
                        </div>
                        <div class="cp-entry-body"><div class="cp-entry-pos">{{ e.position }}</div><div class="cp-entry-co">{{ e.company }}</div><p v-if="e.description" class="cp-entry-desc">{{ e.description }}</p></div>
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

            </div><!-- fin cv-render -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/services/api'

export default {
  name: 'CVGeneratorView',
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
        { id:'personal',   label:'Infos',       title:'👤 Informations personnelles',   sub:'Vos coordonnées, date de naissance et profil' },
        { id:'experience', label:'Expériences', title:'💼 Expériences professionnelles', sub:'Vos postes et missions' },
        { id:'education',  label:'Formation',   title:'🎓 Formations & Diplômes',        sub:'Votre parcours académique avec dates' },
        { id:'skills',     label:'Compétences', title:'⚡ Compétences, Langues & Intérêts', sub:'Skills, langues, aptitudes, centres d\'intérêt' },
        { id:'projects',   label:'Projets',     title:'🚀 Projets',                      sub:'Vos réalisations notables' },
        { id:'template',   label:'Modèle',      title:'🎨 Choisir un modèle',            sub:'Style et couleur de votre CV' },
      ],

      templates: [
        { id:'classic',   name:'Classique',    defaultAccent:'#2563eb' },
        { id:'minimal',   name:'Minimaliste',  defaultAccent:'#111827' },
        { id:'modern',    name:'Moderne',      defaultAccent:'#7c3aed' },
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
      ],

      colorPresets: [
        {name:'Bleu',     value:'#2563eb'},{name:'Indigo',    value:'#4f46e5'},
        {name:'Violet',   value:'#7c3aed'},{name:'Rose',      value:'#db2777'},
        {name:'Rouge',    value:'#dc2626'},{name:'Crimson',   value:'#e11d48'},
        {name:'Orange',   value:'#ea580c'},{name:'Ambre',     value:'#b45309'},
        {name:'Vert',     value:'#16a34a'},{name:'Emeraude',  value:'#059669'},
        {name:'Teal',     value:'#0f766e'},{name:'Cyan',      value:'#0891b2'},
        {name:'Tech',     value:'#22c55e'},{name:'Ardoise',   value:'#475569'},
        {name:'Noir',     value:'#111827'},
      ],

      cv: {
        firstName:'', lastName:'', dateNaissance:'', title:'',
        email:'', phone:'', city:'', country:'',
        website:'', summary:'', photo:'', photoUrl:'',
        experiences:[], education:[], skills:[], languages:[],
        projects:[], centresInteret:[], aptitudes:[],
      },

      // ── Drag & Drop state ──
      dragState: { list: null, from: null, over: null },
    }
  },

  watch: {
    cv:          { deep:true, handler() { this.scheduleSave() } },
    selectedTpl() { this.scheduleSave() },
    accentColor()  { this.scheduleSave() },
  },

  async created() { await this.loadProfile() },
  mounted()       { this.$nextTick(() => this.fitZoom()) },

  methods: {
    nextStep()   { if (this.currentStep < this.steps.length-1) this.currentStep++ },
    prevStep()   { if (this.currentStep > 0) this.currentStep-- },
    goToStep(i)  { this.currentStep = i },
    // addExp()     { this.cv.experiences.push({position:'',company:'',startDate:'',endDate:'',description:''}) },
    addExp() {
  this.cv.experiences.push({
    position:'', company:'', startDate:'', endDate:'',
    description:'',
    bullets: ['']   // ← AJOUTER
  })
  },


  addBullet(exp, index) {
  exp.bullets.splice(index + 1, 0, '')
  this.$nextTick(() => {
    const inputs = this.$el.querySelectorAll('.bullet-inp')
    if (inputs[index + 1]) inputs[index + 1].focus()
  })
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

    aod(t)       { return this.selectedTpl===t.id ? this.accentColor : t.defaultAccent },

    // ══ Drag & Drop ══
    onDragStart(list, index, evt) {
      this.dragState.list = list
      this.dragState.from = index
      this.dragState.over = index
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('text/plain', index)
    },
    onDragOver(list, index) {
      if (this.dragState.list !== list) return
      this.dragState.over = index
    },
    onDragLeave() {
      // on laisse over en place pour eviter le flickering
    },
    onDrop(list, toIndex) {
      const fromIndex = this.dragState.from
      if (fromIndex === null || fromIndex === toIndex || this.dragState.list !== list) return
      const arr = this.cv[list]
      const moved = arr.splice(fromIndex, 1)[0]
      arr.splice(toIndex, 0, moved)
      this.dragState = { list: null, from: null, over: null }
    },
    onDragEnd() {
      this.dragState = { list: null, from: null, over: null }
    },

    // Formater date ISO -> JJ/MM/AAAA
    formatDate(d) {
      if (!d) return ''
      try {
        const [y,m,j] = d.split('-')
        return `${j}/${m}/${y}`
      } catch { return d }
    },

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
        this.cv.photo    = data.url
        this.cv.photoUrl = data.url
      } catch (err) { console.warn('Upload photo échoué:', err) }
      finally { this.photoUploading = false; e.target.value = '' }
    },

    async loadProfile() {
      this.loadingProfile = true
      try {
        const { data } = await API.get('/cv-profiles/mine')
        this.applyProfile(data)
      } catch (e) { console.error('Erreur chargement:', e) }
      finally { this.loadingProfile = false }
    },

    applyProfile(data) {
      this.cvProfileId  = data.id
      this.selectedTpl  = data.template    || 'classic'
      this.accentColor  = data.accentColor || '#2563eb'
      this.cv = {
        firstName:      data.firstName     || '',
        lastName:       data.lastName      || '',
        dateNaissance:  data.dateNaissance || '',
        title:          data.title         || '',
        email:          data.email         || '',
        phone:          data.phone         || '',
        city:           data.city          || '',
        country:        data.country       || '',
        website:        data.website       || '',
        summary:        data.summary       || '',
        photo:          data.photo         || '',
        photoUrl:       data.photo         || '',
        // experiences: (data.experiences||[]).map(e=>({
        //   position:    e.position    || '',
        //   company:     e.company     || '',
        //   startDate:   e.startDate   || '',
        //   endDate:     e.endDate     || '',
        //   description: e.description || '',
        // })),

        experiences: (data.experiences||[]).map(e=>({
  position:    e.position    || '',
  company:     e.company     || '',
  startDate:   e.startDate   || '',
  endDate:     e.endDate     || '',
  description: e.description || '',
  // Migration : si bullets existe, on l'utilise, sinon on split la description
  bullets: e.bullets?.length
    ? e.bullets
    : (e.description ? e.description.split('\n').filter(Boolean) : ['']),
})),
        education: (data.education||[]).map(e=>({
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
    // 1. Charger html2canvas
    if (!window.html2canvas) {
      await new Promise((ok, ko) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
        s.onload = ok; s.onerror = ko; document.head.appendChild(s)
      })
    }

    // 2. Charger jsPDF
    if (!window.jspdf) {
      await new Promise((ok, ko) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        s.onload = ok; s.onerror = ko; document.head.appendChild(s)
      })
    }

    // 3. Convertir photo URL en base64 si besoin
    let photoBackup = null
    if (this.cv.photo && this.cv.photo.startsWith('http')) {
      photoBackup = this.cv.photo
      try {
        const b64 = await this.toBase64(this.cv.photo)
        this.cv.photo = b64
        await this.$nextTick()
      } catch (e) { console.warn('Photo non convertie:', e) }
    }

    // 4. Zoom à 1 + attendre rendu complet
    this.zoom = 1
    await this.$nextTick()
    await new Promise(r => setTimeout(r, 600))

    const el = document.getElementById('cv-render')

    // 5. Sauvegarder styles originaux de l'élément
    const origElStyle = {
      width:     el.style.width,
      minHeight: el.style.minHeight,
      fontSize:  el.style.fontSize,
      position:  el.style.position,
    }

    // 6. Forcer les dimensions exactes A4 pour le rendu
    el.style.width     = '794px'
    el.style.minHeight = '1123px'
    el.style.fontSize  = '13px'
    el.style.position  = 'relative'

    await new Promise(r => setTimeout(r, 300))

    // 7. Capture à scale 3 (~216 DPI) avec rendu texte optimisé
    const canvas = await window.html2canvas(el, {
      scale:           3,
      useCORS:         true,
      allowTaint:      true,
      backgroundColor: '#ffffff',
      width:           794,
      height:          1123,
      windowWidth:     794,
      windowHeight:    1123,
      scrollX:         0,
      scrollY:         0,
      x:               0,
      y:               0,
      logging:         false,
      imageTimeout:    15000,
      removeContainer: true,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById('cv-render')
        if (clonedEl) {
          // Forcer le rendu sub-pixel du texte
          clonedEl.style.webkitFontSmoothing = 'antialiased'
          clonedEl.style.mozOsxFontSmoothing = 'grayscale'
          clonedEl.style.textRendering       = 'optimizeLegibility'
          // Désactiver les transformations qui floutent
          clonedEl.style.transform           = 'none'
          clonedEl.style.webkitTransform     = 'none'
          // Éviter la pixellisation des bordures et ombres
          clonedEl.style.willChange          = 'auto'
          clonedEl.style.filter              = 'none'
        }
      }
    })

    // 8. JPEG qualité 95% — bon compromis netteté / poids (~1-3 Mo)
    const imgData = canvas.toDataURL('image/jpeg', 0.95)

    // 9. Créer PDF A4 avec compression activée
    const { jsPDF } = window.jspdf
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit:        'mm',
      format:      'a4',
      compress:    true,
    })

    const pdfW = pdf.internal.pageSize.getWidth()   // 210 mm
    const pdfH = pdf.internal.pageSize.getHeight()  // 297 mm

    // 10. Image pleine page avec compression FAST
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH, undefined, 'FAST')

    // 11. Télécharger
    pdf.save(`CV_${this.cv.firstName || 'CV'}_${this.cv.lastName || ''}.pdf`)

    // 12. Restaurer les styles de l'élément
    el.style.width     = origElStyle.width
    el.style.minHeight = origElStyle.minHeight
    el.style.fontSize  = origElStyle.fontSize
    el.style.position  = origElStyle.position

    // 13. Restaurer la photo originale
    if (photoBackup) {
      this.cv.photo    = photoBackup
      this.cv.photoUrl = photoBackup
    }

  } catch (e) {
    console.error('PDF error:', e)
    alert('Erreur lors de la génération du PDF.')
  } finally {
    this.zoom = prevZoom
    this.exporting = false
  }
},

    toBase64(url) {
      return new Promise((resolve, reject) => {
        API.get('/proxy-image', { params:{ url }, responseType:'arraybuffer' })
          .then(response => {
            const bytes  = new Uint8Array(response.data)
            let binary   = ''; bytes.forEach(b => binary += String.fromCharCode(b))
            const b64    = window.btoa(binary)
            const mime   = response.headers['content-type'] || 'image/jpeg'
            resolve(`data:${mime};base64,${b64}`)
          })
          .catch(() => {
            const img = new Image(); img.crossOrigin = 'anonymous'
            img.onload = () => {
              const canvas = document.createElement('canvas')
              canvas.width  = img.naturalWidth  || 300
              canvas.height = img.naturalHeight || 300
              canvas.getContext('2d').drawImage(img, 0, 0)
              resolve(canvas.toDataURL('image/jpeg', 0.92))
            }
            img.onerror = reject
            img.src = url + (url.includes('?')? '&':'?') + '_t=' + Date.now()
          })
      })
    },
  },
}
</script>

<style scoped>
/* ══ Shell ══ */
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

/* ══ Workspace ══ */
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

/* ══ Photo upload ══ */
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
.photo-url-row{display:flex;align-items:center;gap:8px;margin-top:6px}
.photo-url-or{font-size:10.5px;color:#aaa;white-space:nowrap}
.inp-sm{font-size:12px;padding:5px 8px}

/* ══ Pane ══ */
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
.inp{padding:7px 10px;border:1.5px solid #e5e7eb;border-radius:7px;font-size:12.5px;font-family:inherit;background:#fff;color:#111;outline:none;width:100%;transition:border-color .15s}
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

/* ══ Templates grid ══ */
.tpl-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-bottom:4px}
.tpl-card{cursor:pointer;transition:transform .15s}
.tpl-card:hover{transform:translateY(-2px)}
.tpl-preview{border:2px solid #e5e7eb;border-radius:9px;overflow:hidden;padding:7px;background:#fff;position:relative;aspect-ratio:.75;transition:border-color .15s}
.tpl-badge{position:absolute;top:4px;right:4px;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:8px;font-weight:800}
.tpl-name{font-size:9.5px;font-weight:600;color:#555;text-align:center;margin-top:4px}

/* mini preview atoms */
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
/* Académique mini */
.tp-acad-hd{border-top:3px solid;padding:4px 3px 3px;margin-bottom:3px;display:flex;flex-direction:column;gap:2px}
/* Luxe mini */
.tp-lux-hd{display:flex;flex-direction:column;align-items:center;gap:2px;padding:3px}
.tp-lux-line{height:1.5px;width:100%}
/* Gradient mini */
.tp-grad-side{width:35%;padding:3px;border-radius:3px;display:flex;flex-direction:column;align-items:center;gap:2px}
.tp-grad-main{flex:1;padding:3px;display:flex;flex-direction:column;gap:2px}
/* Compact mini */
.tp-compact-hd{padding:4px;border-radius:3px;margin-bottom:3px;display:flex;flex-direction:column;gap:2px}
.tp-compact-body{flex:1;padding:2px;display:flex;flex-direction:column;gap:3px}
.tp-compact-row{display:flex;align-items:center;gap:3px}
.tp-compact-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.wh{background:rgba(255,255,255,.75)!important}
.wh50{background:rgba(255,255,255,.35)!important}
.bold{background:#222!important;height:3.5px!important}
.w100{width:100%}.w90{width:90%}.w80{width:80%}.w70{width:70%}.w65{width:65%}.w60{width:60%}.w50{width:50%}.w45{width:45%}.w40{width:40%}
.mt1{margin-top:2px}.mt2{margin-top:4px}.mt3{margin-top:6px}

/* ══ Colors ══ */
.color-section{margin-top:10px}
.color-title{font-size:11px;font-weight:700;color:#555;margin-bottom:7px}
.color-grid{display:flex;flex-wrap:wrap;gap:5px}
.color-swatch{width:24px;height:24px;border-radius:50%;border:2px solid transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .15s;padding:0}
.color-swatch.active{border-color:#fff;box-shadow:0 0 0 2px currentColor;transform:scale(1.15)}
.color-swatch:hover{transform:scale(1.15)}

/* ══ Footer ══ */
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

/* ══ Preview ══ */
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

/* ════════════ CV PAPER ════════════ */
.cv-paper{width:794px;min-height:1123px;background:#fff;box-shadow:0 8px 40px rgba(0,0,0,.18);overflow:hidden;font-family:'DM Sans','Segoe UI',Arial,sans-serif;color:#1a1a1a;font-size:13px;line-height:1.5}

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

/* ─────── 6. DARK ─────── */
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
.sw-proj{margin-bottom:10px}
.sw-proj-name{font-size:13px;font-weight:700;color:#111}
.sw-proj-tech{font-size:10.5px;font-weight:600;margin-left:8px}

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
.acad-main{}
.acad-aside{}
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

/* ══ Drag & Drop ══ */
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

/* ══ Responsive ══ */
@media(max-width:1200px){.workspace{grid-template-columns:340px 1fr}}
@media(max-width:900px){
  .workspace{grid-template-columns:1fr;grid-template-rows:55vh 1fr;overflow:auto;height:auto}
  .cvgen{height:auto}
  .cvgen-topbar{flex-wrap:wrap;height:auto;padding:10px 16px;gap:8px}
  .stepper-pills{flex-wrap:wrap}
  .step-pill-label{display:none}
  .tpl-grid{grid-template-columns:repeat(5,1fr)}
}
@media(max-width:600px){.tpl-grid{grid-template-columns:repeat(4,1fr)}}
</style>