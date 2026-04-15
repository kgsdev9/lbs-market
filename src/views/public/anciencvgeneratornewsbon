<template>
  <div class="cvgen">

    <!-- TOPBAR -->
    <div class="cvgen-topbar">
      <div class="topbar-left">
        <div class="logo-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
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
          <button v-for="(s, i) in steps" :key="s.id" class="step-pill"
            :class="{ active: currentStep === i, done: i < currentStep }" @click="goToStep(i)">
            <span class="step-check" v-if="i < currentStep">✓</span>
            <span v-else class="step-num">{{ i + 1 }}</span>
            <span class="step-pill-label">{{ s.label }}</span>
          </button>
        </div>
        <button class="btn-pdf" @click="downloadPDF" :disabled="exporting">
          <span v-if="exporting" class="spin"></span>
          <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
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
            <button class="step-nav-btn" @click="prevStep" :disabled="currentStep === 0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span class="step-nav-count">{{ currentStep + 1 }}/{{ steps.length }}</span>
            <button class="step-nav-btn" @click="nextStep" :disabled="currentStep === steps.length - 1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div class="form-body">

          <!-- ETAPE 1 : INFOS -->
          <div v-show="currentStep === 0" class="pane">
            <div class="row2">
              <div class="f"><label>Prénom *</label><input v-model="cv.firstName" class="inp" placeholder="Jean" /></div>
              <div class="f"><label>Nom *</label><input v-model="cv.lastName" class="inp" placeholder="Kouadio" /></div>
            </div>
            <div class="row2">
              <div class="f"><label>Date de naissance</label><input v-model="cv.dateNaissance" type="date" class="inp" /></div>
              <div class="f"><label>Titre / Poste *</label><input v-model="cv.title" class="inp" placeholder="Développeur Full Stack Senior" /></div>
            </div>
            <div class="row2">
              <div class="f"><label>Email</label><input v-model="cv.email" type="email" class="inp" placeholder="jean@email.ci" /></div>
              <div class="f"><label>Téléphone</label><input v-model="cv.phone" class="inp" placeholder="+225 07 00 00" /></div>
            </div>
            <div class="row2">
              <div class="f"><label>Ville</label><input v-model="cv.city" class="inp" placeholder="Abidjan" /></div>
              <div class="f"><label>Pays</label><input v-model="cv.country" class="inp" placeholder="Côte d'Ivoire" /></div>
            </div>
            <div class="f"><label>LinkedIn / Portfolio</label><input v-model="cv.website" class="inp" placeholder="linkedin.com/in/..." /></div>
            <div class="f">
              <label>Résumé professionnel</label>
              <textarea v-model="cv.summary" class="inp ta" rows="4" placeholder="Développeur passionné avec X ans d'expérience..."></textarea>
            </div>
            <div class="f">
              <label>Photo de profil — Taille recommandée (592 x 592)</label>
              <div class="photo-upload-area">
                <div class="photo-preview-wrap">
                  <div class="photo-preview" :class="{ 'has-photo': cv.photo }">
                    <img v-if="cv.photo" :src="cv.photo" class="photo-preview-img" @error="cv.photo = ''" />
                    <div v-else class="photo-placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <label class="photo-overlay" for="photo-file-input">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </label>
                  </div>
                  <input id="photo-file-input" type="file" accept="image/*" class="photo-file-input" @change="onPhotoFile" />
                </div>
                <div class="photo-controls">
                  <label for="photo-file-input" class="btn-photo-upload">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Choisir une photo
                  </label>
                  <button v-if="cv.photo" class="btn-photo-remove" @click="cv.photo = ''">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Supprimer
                  </button>
                  <span v-if="photoUploading" class="photo-uploading"><span class="spin" style="border-color:#4f46e5;border-top-color:transparent"></span> Envoi...</span>
                  <span class="photo-hint">JPG, PNG · Max 5 Mo</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ETAPE 2 : EXPERIENCES -->
          <div v-show="currentStep === 1" class="pane">
            <div class="pane-add-bar">
              <span class="pane-count">{{cv.experiences.filter(e => e.position).length}} expérience(s)</span>
              <button class="btn-add" @click="addExp">+ Ajouter</button>
            </div>
            <div v-if="!cv.experiences.length" class="pane-empty">
              <div style="font-size:32px">💼</div>
              <p>Ajoutez vos expériences professionnelles</p>
              <button class="btn-add-big" @click="addExp">+ Ajouter une expérience</button>
            </div>
            <div class="drag-hint" v-if="cv.experiences.length > 1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg>
              Glissez pour réordonner
            </div>
            <div v-for="(e, i) in cv.experiences" :key="'exp' + i" class="entry"
              :class="{ dragging: dragState.list === 'experiences' && dragState.from === i, 'drag-over': dragState.list === 'experiences' && dragState.over === i }"
              draggable="true" @dragstart="onDragStart('experiences', i, $event)"
              @dragover.prevent="onDragOver('experiences', i)" @dragleave="onDragLeave"
              @drop.prevent="onDrop('experiences', i)" @dragend="onDragEnd">
              <div class="entry-head">
                <div style="display:flex;align-items:center;gap:7px">
                  <span class="drag-handle" title="Déplacer"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg></span>
                  <span class="entry-label">Expérience {{ i + 1 }}</span>
                </div>
                <button class="btn-x" @click="cv.experiences.splice(i, 1)">✕</button>
              </div>
              <div class="row2">
                <div class="f"><label>Poste *</label><input v-model="e.position" class="inp" placeholder="Dev Frontend" /></div>
                <div class="f"><label>Entreprise *</label><input v-model="e.company" class="inp" placeholder="ACME Corp" /></div>
              </div>
              <div class="row2">
                <div class="f"><label>Début</label><input v-model="e.startDate" class="inp" placeholder="Jan 2022" /></div>
                <div class="f"><label>Fin</label><input v-model="e.endDate" class="inp" placeholder="Présent" /></div>
              </div>
              <div class="f">
                <div class="desc-label-row">
                  <label>Description</label>
                  <div class="desc-mode-tabs">
                    <button class="desc-tab" :class="{ active: (e.descMode || 'bullets') === 'bullets' }" @click="e.descMode = 'bullets'">☰ Puces</button>
                    <button class="desc-tab" :class="{ active: e.descMode === 'text' }" @click="e.descMode = 'text'">¶ Texte libre</button>
                  </div>
                </div>
                <div v-if="(e.descMode || 'bullets') === 'bullets'" class="bullets-editor">
                  <div class="bullets-hint">Appuyez sur <kbd>Entrée</kbd> pour ajouter une puce · <kbd>Backspace</kbd> sur une puce vide pour supprimer</div>
                  <div v-for="(b, bi) in e.bullets" :key="'b' + i + '-' + bi" class="bullet-row">
                    <span class="bullet-icon" :style="{ color: accentColor }">•</span>
                    <input v-model="e.bullets[bi]" class="inp bullet-inp" placeholder="Décrivez une mission, réalisation..." @keydown.enter.prevent="addBullet(e, bi)" @keydown.backspace="onBulletBackspace(e, bi, $event)" />
                    <button class="btn-xs bullet-del" @click="removeBullet(e, bi)" v-if="e.bullets.length > 1" title="Supprimer">✕</button>
                  </div>
                  <button class="btn-add-bullet" @click="addBullet(e, e.bullets.length - 1)">+ Ajouter une puce</button>
                </div>
                <div v-else>
                  <textarea v-model="e.description" class="inp ta-sm" rows="4" placeholder="Décrivez vos missions...&#10;Commencez par - ou • pour créer des puces."></textarea>
                  <div class="desc-tip">💡 Commencez une ligne par <code>-</code> ou <code>•</code> pour créer des puces dans l'aperçu.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ETAPE 3 : FORMATION -->
          <div v-show="currentStep === 2" class="pane">
            <div class="pane-add-bar">
              <span class="pane-count">{{cv.education.filter(e => e.degree).length}} formation(s)</span>
              <button class="btn-add" @click="cv.education.push({ degree: '', school: '', year: '', anneeDebut: '', anneeFin: '' })">+ Ajouter</button>
            </div>
            <div v-if="!cv.education.length" class="pane-empty">
              <div style="font-size:32px">🎓</div>
              <p>Ajoutez vos diplômes</p>
              <button class="btn-add-big" @click="cv.education.push({ degree: '', school: '', year: '', anneeDebut: '', anneeFin: '' })">+ Ajouter</button>
            </div>
            <div class="drag-hint" v-if="cv.education.length > 1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg>
              Glissez pour réordonner
            </div>
            <div v-for="(e, i) in cv.education" :key="'edu' + i" class="entry"
              :class="{ dragging: dragState.list === 'education' && dragState.from === i, 'drag-over': dragState.list === 'education' && dragState.over === i }"
              draggable="true" @dragstart="onDragStart('education', i, $event)"
              @dragover.prevent="onDragOver('education', i)" @dragleave="onDragLeave"
              @drop.prevent="onDrop('education', i)" @dragend="onDragEnd">
              <div class="entry-head">
                <div style="display:flex;align-items:center;gap:7px">
                  <span class="drag-handle"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg></span>
                  <span class="entry-label">Formation {{ i + 1 }}</span>
                </div>
                <button class="btn-x" @click="cv.education.splice(i, 1)">✕</button>
              </div>
              <div class="f"><label>Diplôme *</label><input v-model="e.degree" class="inp" placeholder="Master Informatique" /></div>
              <div class="f"><label>Établissement</label><input v-model="e.school" class="inp" placeholder="INPHB Yamoussoukro" /></div>
              <div class="row3">
                <div class="f"><label>Année affichage</label><input v-model="e.year" class="inp" placeholder="2021" /></div>
                <div class="f"><label>Année début</label><input v-model="e.anneeDebut" class="inp" placeholder="2019" /></div>
                <div class="f"><label>Année fin</label><input v-model="e.anneeFin" class="inp" placeholder="2021" /></div>
              </div>
            </div>
          </div>

          <!-- ETAPE 4 : COMPETENCES -->
          <div v-show="currentStep === 3" class="pane">
            <div class="pane-add-bar">
              <span class="pane-count" style="font-weight:700;color:#333">⚡ Compétences</span>
              <button class="btn-add" @click="cv.skills.push({ name: '', level: 3 })">+ Ajouter</button>
            </div>
            <div v-if="!cv.skills.length" class="pane-empty">
              <div style="font-size:28px">⚡</div><button class="btn-add-big" @click="cv.skills.push({ name: '', level: 3 })">+ Ajouter une compétence</button>
            </div>
            <div class="drag-hint" v-if="cv.skills.length > 1"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg> Glissez pour réordonner</div>
            <div v-for="(s, i) in cv.skills" :key="'sk' + i" class="skill-row draggable-row"
              :class="{ dragging: dragState.list === 'skills' && dragState.from === i, 'drag-over': dragState.list === 'skills' && dragState.over === i }"
              draggable="true" @dragstart="onDragStart('skills', i, $event)" @dragover.prevent="onDragOver('skills', i)"
              @dragleave="onDragLeave" @drop.prevent="onDrop('skills', i)" @dragend="onDragEnd">
              <span class="drag-handle-sm"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg></span>
              <input v-model="s.name" class="inp" placeholder="Vue.js, Laravel..." style="flex:1" />
              <div class="dots-input"><button v-for="d in 4" :key="d" class="dot-btn" :class="{ filled: d <= s.level }" :style="d <= s.level ? { background: accentColor, borderColor: accentColor } : {}" @click="s.level = d"></button></div>
              <button class="btn-xs" @click="cv.skills.splice(i, 1)">✕</button>
            </div>

            <div class="pane-divider"></div>
            <div class="pane-add-bar" style="margin-top:4px"><span class="pane-count" style="font-weight:700;color:#333">🌍 Langues</span><button class="btn-add" @click="cv.languages.push({ name: '', level: 'Courant' })">+ Ajouter</button></div>
            <div class="drag-hint" v-if="cv.languages.length > 1"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg> Glissez pour réordonner</div>
            <div v-for="(l, i) in cv.languages" :key="'lg' + i" class="skill-row draggable-row"
              :class="{ dragging: dragState.list === 'languages' && dragState.from === i, 'drag-over': dragState.list === 'languages' && dragState.over === i }"
              draggable="true" @dragstart="onDragStart('languages', i, $event)" @dragover.prevent="onDragOver('languages', i)"
              @dragleave="onDragLeave" @drop.prevent="onDrop('languages', i)" @dragend="onDragEnd">
              <span class="drag-handle-sm"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg></span>
              <input v-model="l.name" class="inp" placeholder="Français" style="flex:1" />
              <select v-model="l.level" class="inp" style="width:120px;flex-shrink:0">
                <option>Natif</option><option>Courant</option><option>Intermédiaire</option><option>Notions</option>
              </select>
              <button class="btn-xs" @click="cv.languages.splice(i, 1)">✕</button>
            </div>

            <div class="pane-divider"></div>
            <div class="pane-add-bar" style="margin-top:4px"><span class="pane-count" style="font-weight:700;color:#333">🎯 Centres d'intérêt</span><button class="btn-add" @click="cv.centresInteret.push({ name: '' })">+ Ajouter</button></div>
            <div v-if="!cv.centresInteret.length" class="pane-empty" style="padding:12px 16px"><button class="btn-add-big" @click="cv.centresInteret.push({ name: '' })">+ Ajouter un centre d'intérêt</button></div>
            <div class="drag-hint" v-if="cv.centresInteret.length > 1"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg> Glissez pour réordonner</div>
            <div v-for="(c, i) in cv.centresInteret" :key="'ci' + i" class="skill-row draggable-row"
              :class="{ dragging: dragState.list === 'centresInteret' && dragState.from === i, 'drag-over': dragState.list === 'centresInteret' && dragState.over === i }"
              draggable="true" @dragstart="onDragStart('centresInteret', i, $event)" @dragover.prevent="onDragOver('centresInteret', i)"
              @dragleave="onDragLeave" @drop.prevent="onDrop('centresInteret', i)" @dragend="onDragEnd">
              <span class="drag-handle-sm"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg></span>
              <input v-model="c.name" class="inp" placeholder="Musique, Sport, Voyage..." style="flex:1" />
              <button class="btn-xs" @click="cv.centresInteret.splice(i, 1)">✕</button>
            </div>

            <div class="pane-divider"></div>
            <div class="pane-add-bar" style="margin-top:4px"><span class="pane-count" style="font-weight:700;color:#333">🧠 Aptitudes</span><button class="btn-add" @click="cv.aptitudes.push({ name: '', level: 3 })">+ Ajouter</button></div>
            <div class="hint-block">Les aptitudes sont optionnelles — ajoutez-les uniquement si pertinent (ex: Leadership, Communication…)</div>
            <div class="drag-hint" v-if="cv.aptitudes.length > 1"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg> Glissez pour réordonner</div>
            <div v-for="(a, i) in cv.aptitudes" :key="'ap' + i" class="skill-row draggable-row"
              :class="{ dragging: dragState.list === 'aptitudes' && dragState.from === i, 'drag-over': dragState.list === 'aptitudes' && dragState.over === i }"
              draggable="true" @dragstart="onDragStart('aptitudes', i, $event)" @dragover.prevent="onDragOver('aptitudes', i)"
              @dragleave="onDragLeave" @drop.prevent="onDrop('aptitudes', i)" @dragend="onDragEnd">
              <span class="drag-handle-sm"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg></span>
              <input v-model="a.name" class="inp" placeholder="Leadership, Gestion d'équipe..." style="flex:1" />
              <div class="dots-input"><button v-for="d in 4" :key="d" class="dot-btn" :class="{ filled: d <= a.level }" :style="d <= a.level ? { background: '#f59e0b', borderColor: '#f59e0b' } : {}" @click="a.level = d"></button></div>
              <button class="btn-xs" @click="cv.aptitudes.splice(i, 1)">✕</button>
            </div>
          </div>

          <!-- ETAPE 5 : PROJETS -->
          <div v-show="currentStep === 4" class="pane">
            <div class="pane-add-bar">
              <span class="pane-count">{{cv.projects.filter(p => p.name).length}} projet(s)</span>
              <button class="btn-add" @click="cv.projects.push({ name: '', tech: '', description: '', url: '' })">+ Ajouter</button>
            </div>
            <div v-if="!cv.projects.length" class="pane-empty">
              <div style="font-size:32px">🚀</div>
              <p>Mettez en avant vos projets</p><button class="btn-add-big" @click="cv.projects.push({ name: '', tech: '', description: '', url: '' })">+ Ajouter un projet</button>
            </div>
            <div v-for="(p, i) in cv.projects" :key="i" class="entry">
              <div class="entry-head"><span class="entry-label">Projet {{ i + 1 }}</span><button class="btn-x" @click="cv.projects.splice(i, 1)">✕</button></div>
              <div class="f"><label>Nom *</label><input v-model="p.name" class="inp" placeholder="Mon Application" /></div>
              <div class="f"><label>Technologies</label><input v-model="p.tech" class="inp" placeholder="Vue.js, Laravel, MySQL" /></div>
              <div class="f"><label>Description</label><textarea v-model="p.description" class="inp ta-sm" rows="2"></textarea></div>
              <div class="f"><label>Lien</label><input v-model="p.url" class="inp" placeholder="https://github.com/..." /></div>
            </div>
          </div>

          <!-- ETAPE 6 : MODELE -->
          <div v-show="currentStep === 5" class="pane">
            <p class="pane-title">Choisissez votre modèle</p>
            <div class="tpl-grid">
              <div v-for="t in templates" :key="t.id" class="tpl-card" :class="{ active: selectedTpl === t.id }" @click="selectedTpl = t.id; accentColor = t.defaultAccent">
                <div class="tpl-preview" :style="{ borderColor: selectedTpl === t.id ? accentColor : '#e5e7eb' }">
                  <div v-if="selectedTpl === t.id" class="tpl-badge" :style="{ background: accentColor }">✓</div>
                </div>
                <div class="tpl-name">{{ t.name || t.label }}</div>
              </div>
            </div>
            <div class="color-section">
              <p class="color-title">Couleur principale</p>
              <div class="color-grid">
                <button v-for="c in colorPresets" :key="c.value" class="color-swatch" :class="{ active: accentColor === c.value }" :style="{ background: c.value }" :title="c.name" @click="accentColor = c.value">
                  <span v-if="accentColor === c.value" style="color:#fff;font-size:11px;font-weight:800">✓</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer nav -->
        <div class="form-footer">
          <button class="btn-prev" @click="prevStep" :disabled="currentStep === 0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6" /></svg>
            Précédent
          </button>
          <div class="step-dots">
            <span v-for="(s, i) in steps" :key="i" class="step-dot" :class="{ active: i === currentStep, done: i < currentStep }" :style="i === currentStep ? { background: accentColor } : {}" @click="goToStep(i)"></span>
          </div>
          <button v-if="currentStep < steps.length - 1" class="btn-next" :style="{ background: accentColor }" @click="nextStep">
            Suivant <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
          <button v-else class="btn-next" style="background:#22c55e" @click="downloadPDF" :disabled="exporting">
            <span v-if="exporting" class="spin"></span>
            {{ exporting ? 'Export...' : '⬇ Télécharger PDF' }}
          </button>
        </div>
      </div>

      <!-- Apercu droit avec pagination -->
      <div class="preview-panel">
        <div class="preview-bar">
          <div style="display:flex;align-items:center;gap:7px">
            <span class="live-dot"></span>
            <span class="live-label">Aperçu en direct</span>
            <span v-if="calculatedPageCount > 1" class="page-info-badge">{{ calculatedPageCount }} pages</span>
          </div>
          <div style="display:flex;align-items:center;gap:5px">
            <button class="zoom-btn" @click="zoom = Math.max(0.3, zoom - 0.1)">−</button>
            <span class="zoom-val">{{ Math.round(zoom * 100) }}%</span>
            <button class="zoom-btn" @click="zoom = Math.min(1.4, zoom + 0.1)">+</button>
            <button class="zoom-btn" style="width:auto;padding:0 8px;font-size:10px" @click="fitZoom">Ajuster</button>
          </div>
        </div>
        <div class="preview-stage" ref="previewStage">
          <div :style="{ transform: `scale(${zoom})`, transformOrigin: 'top center', display: 'inline-block' }">
            <div class="cv-paginated-wrapper">
              <template-cv :cv="cvForTemplate" :selected-tpl="selectedTpl" :accent-color="accentColor" />
              <!-- Page indicators -->
              <div v-for="p in calculatedPageCount" :key="'page'+p" class="page-overlay" :style="{top: (p - 1) * 1123 + 'px'}">
                <div class="page-number">Page {{ p }}</div>
              </div>
              <!-- Cut lines -->
              <template v-if="calculatedPageCount > 1">
                <div v-for="p in (calculatedPageCount - 1)" :key="'cut'+p" class="page-cut-line" :style="{top: p * 1123 + 'px'}">
                  <div class="page-cut-label">— Coupure page {{ p }} / {{ p + 1 }} —</div>
                </div>
              </template>
            </div>
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
      cvCredits: 0,
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
      calculatedPageCount: 1,
      steps: [
        { id: 'personal', label: 'Infos', title: '👤 Informations personnelles', sub: 'Vos coordonnées, date de naissance et profil' },
        { id: 'experience', label: 'Expériences', title: '💼 Expériences professionnelles', sub: 'Vos postes et missions' },
        { id: 'education', label: 'Formation', title: '🎓 Formations & Diplômes', sub: 'Votre parcours académique avec dates' },
        { id: 'skills', label: 'Compétences', title: '⚡ Compétences, Langues & Intérêts', sub: "Skills, langues, aptitudes, centres d'intérêt" },
        { id: 'projects', label: 'Projets', title: '🚀 Projets', sub: 'Vos réalisations notables' },
        { id: 'template', label: 'Modèle', title: '🎨 Choisir un modèle', sub: 'Style et couleur de votre CV' },
      ],
      templates: [
        { id: 'classic', name: 'Classique', defaultAccent: '#2563eb' },
        { id: 'minimal', name: 'Minimaliste', defaultAccent: '#111827' },
        { id: 'modern', name: 'Moderne', defaultAccent: '#7c3aed' },
        { id: 'executive', name: 'Executive', defaultAccent: '#c5982a' },
        { id: 'corporate', name: 'Corporate', defaultAccent: '#0f766e' },
        { id: 'elegant', name: 'Élégant', defaultAccent: '#b45309' },
        { id: 'dark', name: 'Dark', defaultAccent: '#6366f1' },
        { id: 'timeline', name: 'Timeline', defaultAccent: '#0891b2' },
        { id: 'swiss', name: 'Swiss', defaultAccent: '#e11d48' },
        { id: 'creative', name: 'Créatif', defaultAccent: '#7c3aed' },
        { id: 'tech', name: 'Tech', defaultAccent: '#22c55e' },
        { id: 'academic', name: 'Académique', defaultAccent: '#1d4ed8' },
        { id: 'luxury', name: 'Luxe', defaultAccent: '#92400e' },
        { id: 'gradient', name: 'Gradient', defaultAccent: '#4f46e5' },
        { id: 'compact', name: 'Compact Pro', defaultAccent: '#0e7490' },
        { id: 'vladimir', name: 'Vladimir', defaultAccent: '#e8950a' },
        { id: 'neondark', name: 'Neon Dark', defaultAccent: '#22d3ee' },
        { id: 'fold', name: 'Fold', defaultAccent: '#c2410c' },
        { id: 'prism', name: 'Prism', defaultAccent: '#7c3aed' },
        { id: 'sidebar', name: 'Sidebar Pro', defaultAccent: '#1e3a5f' },
        { id: 'green2col', name: 'Green 2Col', defaultAccent: '#059669' },
        { id: 'navy', name: 'Navy', defaultAccent: '#1e3a5f' },
        { id: 'crimson', name: 'Crimson', defaultAccent: '#9b1c31' },
      ],
      colorPresets: [
        { name: 'Bleu', value: '#2563eb' }, { name: 'Indigo', value: '#4f46e5' }, { name: 'Violet', value: '#7c3aed' }, { name: 'Rose', value: '#db2777' },
        { name: 'Rouge', value: '#dc2626' }, { name: 'Crimson', value: '#e11d48' }, { name: 'Orange', value: '#ea580c' }, { name: 'Ambre', value: '#b45309' },
        { name: 'Vert', value: '#16a34a' }, { name: 'Emeraude', value: '#059669' }, { name: 'Teal', value: '#0f766e' }, { name: 'Cyan', value: '#0891b2' },
        { name: 'Tech', value: '#22c55e' }, { name: 'Ardoise', value: '#475569' }, { name: 'Noir', value: '#111827' },
      ],
      cv: {
        firstName: '', lastName: '', dateNaissance: '', title: '',
        email: '', phone: '', city: '', country: '',
        website: '', summary: '', photo: '', photoUrl: '',
        experiences: [], education: [], skills: [], languages: [],
        projects: [], centresInteret: [], aptitudes: [],
      },
      dragState: { list: null, from: null, over: null },
    }
  },

  computed: {
    cvForTemplate() {
      return {
        ...this.cv,
        experiences: this.cv.experiences.map(e => {
          const isBullets = (e.descMode || 'bullets') === 'bullets'
          return {
            ...e,
            bullets: isBullets ? (e.bullets || []).filter(b => b && b.trim()) : [],
            description: isBullets ? '' : (e.description || ''),
          }
        }),
      }
    },
  },

  watch: {
    cv: {
      deep: true,
      handler() {
        this.scheduleSave()
        this.updatePageCount()
      }
    },
    selectedTpl() {
      this.scheduleSave()
      this.updatePageCount()
    },
    accentColor() { this.scheduleSave() },
  },

  async created() { await this.loadProfile() },

  mounted() {
    this.$nextTick(() => {
      this.fitZoom()
      this.updatePageCount()
    })
  },

  methods: {
    nextStep() { if (this.currentStep < this.steps.length - 1) this.currentStep++ },
    prevStep() { if (this.currentStep > 0) this.currentStep-- },
    goToStep(i) { this.currentStep = i },
    aod(t) { return this.selectedTpl === t.id ? this.accentColor : t.defaultAccent },

    updatePageCount() {
      this.applySmartPageBreaks()
    },

    /* ═══════════════════════════════════════════════════════════
       FIX 1+2 : applySmartPageBreaks — multi-pass algorithm
       - Pass 1 : titres de section orphelins (derniers 120px)
       - Pass 2 : entrées qui chevauchent une limite de page
       Chaque pass fait break+restart après insertion d'un spacer
       pour recalculer les positions correctement.
    ═══════════════════════════════════════════════════════════ */
    applySmartPageBreaks() {
      this.$nextTick(() => {
        setTimeout(() => {
          const el = document.getElementById('cv-render')
          if (!el) return

          const PAGE_H = 1123

          // Nettoyage complet des spacers précédents
          el.querySelectorAll('.cv-page-break-spacer').forEach(s => s.remove())

          // Sélecteurs
          const entrySelectors = [
            '.cc-entry, .cm-entry, .cmod-entry, .corp-entry, .eleg-entry, .dk-entry',
            '.tl-item, .sw-exp, .cr-exp, .tk-exp, .acad-entry, .lux-entry',
            '.grad-entry, .cp-entry, .ex-entry, .vl-exp-entry, .vl-edu-entry',
            '.nd-entry, .fd-entry, .pr-entry, .sb-entry, .g2-exp, .g2-edu-item',
            '.nv-card, .cr2-entry',
            '.cmod-proj, .dk-proj, .cr-proj, .tk-proj, .lux-proj, .grad-proj',
            '.cp-proj, .nd-proj, .fd-proj, .pr-proj, .g2-proj, .acad-pub',
            '.cc-skill, .corp-skill, .dk-skill, .tl-skill, .sw-skill',
            '.grad-skill, .cp-skill, .nd-skill, .fd-skill, .pr-skill',
          ].join(', ')

          const sectionTitleSelectors = [
            '.cc-sec-t, .cm-sec-t, .cmod-sec-t, .corp-sec-t, .eleg-sec-t, .dk-sec-t',
            '.tl-sec-t, .sw-sec-t, .cr-sec-t, .tk-sec-t, .acad-sec-t, .lux-sec-t',
            '.grad-sec-t, .cp-sec-t, .ex-sec-t, .vl-msec-title, .nd-sec-t',
            '.fd-sec-t, .pr-sec-t, .sb-sec-t-r, .g2-sec-t, .nv-sec-t, .cr2-sec-t',
          ].join(', ')

          const sectionContainerSelectors =
            '.cc-sec, .cm-sec, .cmod-sec, .corp-sec, .eleg-sec, .dk-sec, ' +
            '.tl-sec, .sw-sec, .cr-sec, .tk-sec, .acad-sec, .lux-sec, ' +
            '.grad-sec, .cp-sec, .ex-sec, .vl-msec, .nd-sec, ' +
            '.fd-sec, .pr-sec, .sb-sec-r, .g2-sec, .nv-sec, .cr2-sec'

          // ══ PASS 1 : Titres de section orphelins ══
          let maxPasses = 15
          let changed = true

          while (changed && maxPasses-- > 0) {
            changed = false
            const titles = el.querySelectorAll(sectionTitleSelectors)
            const elRect = el.getBoundingClientRect()

            for (const title of titles) {
              const titleRect = title.getBoundingClientRect()
              const titleTop = titleRect.top - elRect.top
              const titleBottom = titleRect.bottom - elRect.top

              if (titleTop < 1) continue

              const pageStart = Math.floor(titleTop / PAGE_H)
              const pageBoundary = (pageStart + 1) * PAGE_H
              const distanceToBoundary = pageBoundary - titleTop

              // Titre dans les derniers 120px de la page → pousser la section
              if (distanceToBoundary > 0 && distanceToBoundary < 120 && titleTop > PAGE_H * 0.3) {
                const spacerHeight = distanceToBoundary + 12
                const spacer = document.createElement('div')
                spacer.className = 'cv-page-break-spacer'
                spacer.style.height = spacerHeight + 'px'
                spacer.style.width = '100%'
                spacer.style.flexShrink = '0'

                const parentSec = title.closest(sectionContainerSelectors)
                const target = parentSec || title
                target.parentNode.insertBefore(spacer, target)
                changed = true
                break // restart — positions ont changé
              }

              // Titre qui chevauche directement une limite
              if (titleTop < pageBoundary && titleBottom > pageBoundary) {
                const spacerHeight = (pageBoundary - titleTop) + 12
                const spacer = document.createElement('div')
                spacer.className = 'cv-page-break-spacer'
                spacer.style.height = spacerHeight + 'px'
                spacer.style.width = '100%'
                spacer.style.flexShrink = '0'

                const parentSec = title.closest(sectionContainerSelectors)
                const target = parentSec || title
                target.parentNode.insertBefore(spacer, target)
                changed = true
                break
              }
            }
          }

          // ══ PASS 1.5 : Sections complètes qui chevauchent une limite ══
          // Si une section (titre + entrées) est coupée entre 2 pages
          // ET qu'elle est assez petite pour tenir sur 1 page → pousser toute la section
          maxPasses = 10
          changed = true

          while (changed && maxPasses-- > 0) {
            changed = false
            const sections = el.querySelectorAll(sectionContainerSelectors)
            const elRect = el.getBoundingClientRect()

            for (const sec of sections) {
              const rect = sec.getBoundingClientRect()
              const secTop = rect.top - elRect.top
              const secBottom = rect.bottom - elRect.top
              const secHeight = rect.height

              if (secHeight < 2 || secTop < 1) continue

              const pageStart = Math.floor(secTop / PAGE_H)
              const pageBoundary = (pageStart + 1) * PAGE_H

              // La section chevauche-t-elle une limite de page ?
              if (secTop < pageBoundary && secBottom > pageBoundary) {
                // La section est-elle assez petite pour tenir sur 1 page ? (< 55%)
                if (secHeight < PAGE_H * 0.55) {
                  const spacerHeight = (pageBoundary - secTop) + 10
                  const spacer = document.createElement('div')
                  spacer.className = 'cv-page-break-spacer'
                  spacer.style.height = spacerHeight + 'px'
                  spacer.style.width = '100%'
                  spacer.style.flexShrink = '0'
                  sec.parentNode.insertBefore(spacer, sec)
                  changed = true
                  break // restart
                }
              }
            }
          }

          // ══ PASS 2 : Entrées / blocs qui chevauchent une limite ══
          maxPasses = 20
          changed = true

          while (changed && maxPasses-- > 0) {
            changed = false
            const nodes = el.querySelectorAll(entrySelectors)
            const elRect = el.getBoundingClientRect()

            for (const node of nodes) {
              if (node.classList.contains('cv-page-break-spacer')) continue

              const rect = node.getBoundingClientRect()
              const nodeTop = rect.top - elRect.top
              const nodeBottom = rect.bottom - elRect.top
              const nodeHeight = rect.height

              if (nodeHeight < 2) continue

              const pageStart = Math.floor(nodeTop / PAGE_H)
              const pageBoundary = (pageStart + 1) * PAGE_H

              if (nodeTop < pageBoundary && nodeBottom > pageBoundary) {
                if (nodeHeight < PAGE_H * 0.7) {
                  const spacerHeight = (pageBoundary - nodeTop) + 10
                  const spacer = document.createElement('div')
                  spacer.className = 'cv-page-break-spacer'
                  spacer.style.height = spacerHeight + 'px'
                  spacer.style.width = '100%'
                  spacer.style.flexShrink = '0'
                  node.parentNode.insertBefore(spacer, node)
                  changed = true
                  break // restart — positions ont changé
                }
              }
            }
          }

          // Nombre de pages
          const finalHeight = el.scrollHeight
          this.calculatedPageCount = Math.max(1, Math.ceil(finalHeight / PAGE_H))
        }, 200)
      })
    },

    addExp() {
      this.cv.experiences.push({
        position: '', company: '', startDate: '', endDate: '',
        description: '', bullets: [''], descMode: 'bullets'
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
    onDragLeave() { },
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
      try {
        const { data } = await API.get('/cv-profiles/mine')
        this.applyProfile(data)
        const res = await API.get('/cv-credits/balance')
        this.cvCredits = res.data.data.balance
      } catch (e) {
        console.error('Erreur chargement:', e)
      } finally {
        this.loadingProfile = false
      }
    },
    applyProfile(data) {
      this.cvProfileId = data.id
      this.selectedTpl = data.template || 'classic'
      this.accentColor = data.accentColor || '#2563eb'
      this.cv = {
        firstName: data.firstName || '', lastName: data.lastName || '', dateNaissance: data.dateNaissance || '',
        title: data.title || '', email: data.email || '', phone: data.phone || '',
        city: data.city || '', country: data.country || '', website: data.website || '',
        summary: data.summary || '', photo: data.photo || '', photoUrl: data.photo || '',
        experiences: (data.experiences || []).map(e => ({
          position: e.position || '', company: e.company || '', startDate: e.startDate || '', endDate: e.endDate || '',
          description: e.description || '', descMode: e.descMode || 'bullets',
          bullets: Array.isArray(e.bullets) && e.bullets.length > 0 ? e.bullets : [''],
        })),
        education: (data.education || []).map(e => ({
          degree: e.degree || '', school: e.school || '', year: e.year || '',
          anneeDebut: e.anneeDebut || '', anneeFin: e.anneeFin || '',
        })),
        skills: (data.skills || []).map(s => ({ name: s.name || '', level: s.level || 3 })),
        languages: (data.languages || []).map(l => ({ name: l.name || '', level: l.level || 'Courant' })),
        projects: (data.projects || []).map(p => ({ name: p.name || '', tech: p.tech || '', description: p.description || '', url: p.url || '' })),
        centresInteret: (data.centresInteret || []).map(c => ({ name: c.name || '' })),
        aptitudes: (data.aptitudes || []).map(a => ({ name: a.name || '', level: a.level || 3 })),
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
          ...this.cv, photo: this.cv.photo, template: this.selectedTpl, accentColor: this.accentColor,
        })
        const n = new Date()
        this.lastSaved = `à ${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`
      } catch (e) { console.error('Erreur save:', e) }
      finally { this.saving = false }
    },

    /* ═══════════════════════════════════════════════════════════
       FIX 3 : downloadPDF — photo backup systématique
       - Backup TOUJOURS cv.photo + cv.photoUrl avant export
       - Nettoyage spacers après export (try + catch + finally)
       - Restore garanti même en cas d'erreur
    ═══════════════════════════════════════════════════════════ */
   async downloadPDF() {
  this.exporting = true;
  try {
    const { data } = await API.post('/cv-credits/use', { cv_profile_id: this.cvProfileId })
    if (!data.success) {
      alert('Crédit insuffisant. Veuillez recharger votre compte.')
      this.$router.push({ name: 'cv-credits-recharge' })
      this.exporting = false
      return
    }
    this.cvCredits = data.balance
  } catch (e) {
    if (e.response?.status === 402) {
      alert('Crédit insuffisant. Veuillez recharger votre compte.')
      this.$router.push({ name: 'cv-credits-recharge' })
    } else {
      alert('Erreur lors de la vérification du crédit.')
    }
    this.exporting = false
    return
  }

  const prevZoom = this.zoom

  try {
    if (!window.html2canvas) {
      await new Promise((ok, ko) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'; s.onload = ok; s.onerror = ko; document.head.appendChild(s) })
    }
    if (!window.jspdf) {
      await new Promise((ok, ko) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'; s.onload = ok; s.onerror = ko; document.head.appendChild(s) })
    }

    this.zoom = 1
    await this.$nextTick()
    await new Promise(r => setTimeout(r, 600))

    const el = document.getElementById('cv-render')
    const orig = {
      width: el.style.width, minHeight: el.style.minHeight, fontSize: el.style.fontSize,
      position: el.style.position, height: el.style.height, overflow: el.style.overflow
    }

    el.style.width = '794px'
    el.style.minHeight = '1123px'
    el.style.fontSize = '13px'
    el.style.position = 'relative'
    el.style.height = 'auto'
    el.style.overflow = 'visible'

    await new Promise(r => setTimeout(r, 400))

    // Smart page breaks pour l'export
    this.applySmartPageBreaks()
    await new Promise(r => setTimeout(r, 500))

    const SCALE = 3
    const PAGE_W_PX = 794
    const PAGE_H_PX = 1123
    const PAGE_W_MM = 210
    const PAGE_H_MM = 297
    const totalHeight = el.scrollHeight

    el.style.height = totalHeight + 'px'
    await new Promise(r => setTimeout(r, 200))

    // Référence à toBase64 pour utilisation dans onclone
    const toBase64Fn = this.toBase64.bind(this)

    const fullCanvas = await window.html2canvas(el, {
      scale: SCALE, useCORS: true, allowTaint: true, backgroundColor: '#ffffff',
      width: PAGE_W_PX, height: totalHeight, windowWidth: 1200, windowHeight: totalHeight,
      scrollX: 0, scrollY: 0, x: 0, y: 0,
      logging: false, imageTimeout: 15000, removeContainer: true,
      onclone: async (doc) => {
        const cel = doc.getElementById('cv-render')
        if (cel) {
          cel.style.width = PAGE_W_PX + 'px'
          cel.style.minWidth = PAGE_W_PX + 'px'
          cel.style.maxWidth = PAGE_W_PX + 'px'
          cel.style.height = totalHeight + 'px'
          cel.style.overflow = 'visible'
          cel.style.transform = 'none'
          cel.style.webkitFontSmoothing = 'antialiased'
          cel.style.textRendering = 'optimizeLegibility'
          cel.style.willChange = 'auto'
          cel.style.filter = 'none'

          // Convertir les images HTTP → base64 DANS LE CLONE uniquement
          const imgs = cel.querySelectorAll('img')
          for (const img of imgs) {
            if (img.src && img.src.startsWith('http')) {
              try {
                img.src = await toBase64Fn(img.src)
              } catch (e) { console.warn('Clone img conversion failed:', e) }
            }
          }
        }
        const style = doc.createElement('style')
        style.textContent = '@media(max-width:1200px){.workspace{grid-template-columns:380px 1fr !important}} @media(max-width:900px){.workspace{grid-template-columns:380px 1fr !important}} #cv-render, #cv-render *{max-width:none !important}'
        doc.head.appendChild(style)
      }
    })

    const { jsPDF } = window.jspdf
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
    const scaledPageW = PAGE_W_PX * SCALE
    const scaledPageH = PAGE_H_PX * SCALE
    const totalPages = Math.max(1, Math.ceil(fullCanvas.height / scaledPageH))

    for (let page = 0; page < totalPages; page++) {
      const srcY = page * scaledPageH
      const srcH = Math.min(scaledPageH, fullCanvas.height - srcY)
      if (page > 0 && srcH < scaledPageH * 0.08) break
      if (page > 0) pdf.addPage()

      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = scaledPageW
      pageCanvas.height = scaledPageH
      const ctx = pageCanvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, scaledPageW, scaledPageH)
      ctx.drawImage(fullCanvas, 0, srcY, scaledPageW, srcH, 0, 0, scaledPageW, srcH)
      pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, PAGE_W_MM, PAGE_H_MM, undefined, 'FAST')
    }

    pdf.save(`CV_${this.cv.firstName || 'CV'}_${this.cv.lastName || ''}.pdf`)

    // ══ RESTAURATION STYLES ══
    el.style.width = orig.width
    el.style.minHeight = orig.minHeight
    el.style.fontSize = orig.fontSize
    el.style.position = orig.position
    el.style.height = orig.height
    el.style.overflow = orig.overflow

    // Nettoyage spacers d'export
    el.querySelectorAll('.cv-page-break-spacer').forEach(s => s.remove())

  } catch (e) {
    console.error('PDF error:', e)
    alert('Erreur lors de la génération du PDF.')
    try { await API.post('/cv-credits/refund', { cv_profile_id: this.cvProfileId }); this.cvCredits++ } catch (_) { }

    // Nettoyage en cas d'erreur
    const el = document.getElementById('cv-render')
    if (el) el.querySelectorAll('.cv-page-break-spacer').forEach(s => s.remove())
  } finally {
    this.zoom = prevZoom
    this.exporting = false
    this.$nextTick(() => this.updatePageCount())
  }
},

    toBase64(url) {
      return new Promise((resolve, reject) => {
        API.get('/proxy-image', { params: { url }, responseType: 'arraybuffer' })
          .then(r => {
            const b = new Uint8Array(r.data); let s = ''
            b.forEach(x => s += String.fromCharCode(x))
            resolve(`data:${r.headers['content-type'] || 'image/jpeg'};base64,${window.btoa(s)}`)
          })
          .catch(() => {
            const img = new Image(); img.crossOrigin = 'anonymous'
            img.onload = () => {
              const c = document.createElement('canvas')
              c.width = img.naturalWidth || 300; c.height = img.naturalHeight || 300
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
/* ════════ PAGINATION VISUELLE ════════ */
.cv-paginated-wrapper{position:relative;display:inline-block}
.page-overlay{position:absolute;left:0;width:794px;height:1123px;pointer-events:none;box-sizing:border-box}
.page-number{position:absolute;top:6px;right:8px;font-size:9px;font-weight:700;color:#bbb;background:#f5f6f8;padding:2px 8px;border-radius:4px;pointer-events:none;z-index:10}
.page-info-badge{font-size:10px;font-weight:700;color:#ef4444;background:#fef2f2;padding:2px 8px;border-radius:99px;border:1px solid #fecaca}
.page-cut-line{position:absolute;left:-20px;right:-20px;height:0;z-index:20;pointer-events:none}
.page-cut-line::before{content:'';position:absolute;left:20px;right:20px;top:-1px;height:2px;background:repeating-linear-gradient(90deg,#ef4444 0,#ef4444 6px,transparent 6px,transparent 12px);opacity:.6}
.page-cut-line::after{content:'';position:absolute;left:0;right:0;top:-12px;height:24px;background:linear-gradient(to bottom,rgba(239,68,68,.06),rgba(239,68,68,.12),rgba(239,68,68,.06));pointer-events:none}
.page-cut-label{position:absolute;left:50%;transform:translateX(-50%);top:-9px;font-size:9px;font-weight:700;color:#ef4444;background:#fff;padding:1px 10px;border-radius:4px;border:1px solid #fecaca;white-space:nowrap;z-index:21}

/* ════════ LAYOUT ════════ */
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
.step-nav-btn:hover:not(:disabled){background:#f5f6f8}.step-nav-btn:disabled{opacity:.3;cursor:not-allowed}
.step-nav-count{font-size:10.5px;color:#aaa;font-weight:600;min-width:30px;text-align:center}
.form-body{flex:1;overflow-y:auto;padding:14px}
.form-body::-webkit-scrollbar{width:3px}.form-body::-webkit-scrollbar-thumb{background:#e5e7eb}
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
.ta{min-height:76px;resize:vertical}.ta-sm{min-height:52px;resize:vertical}
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
.bullet-del{flex-shrink:0;opacity:.4}.bullet-del:hover{opacity:1}
.btn-add-bullet{margin-top:2px;padding:4px 10px;border-radius:5px;border:1.5px dashed #d1d5db;background:transparent;font-size:11px;font-weight:600;color:#9ca3af;cursor:pointer;font-family:inherit;align-self:flex-start;transition:all .15s}
.btn-add-bullet:hover{border-color:#6b7280;color:#374151}
.desc-tip{font-size:10.5px;color:#9ca3af;margin-top:4px;padding:4px 8px;background:#f9fafb;border-radius:5px;border:1px dashed #e5e7eb}
.desc-tip code{background:#e5e7eb;padding:1px 4px;border-radius:3px;font-size:10px}
.tpl-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-bottom:4px}
.tpl-card{cursor:pointer;transition:transform .15s}.tpl-card:hover{transform:translateY(-2px)}
.tpl-preview{border:2px solid #e5e7eb;border-radius:9px;overflow:hidden;padding:7px;background:#fff;position:relative;aspect-ratio:.75;transition:border-color .15s}
.tpl-badge{position:absolute;top:4px;right:4px;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:8px;font-weight:800}
.tpl-name{font-size:9.5px;font-weight:600;color:#555;text-align:center;margin-top:4px}
.color-section{margin-top:10px}.color-title{font-size:11px;font-weight:700;color:#555;margin-bottom:7px}
.color-grid{display:flex;flex-wrap:wrap;gap:5px}
.color-swatch{width:24px;height:24px;border-radius:50%;border:2px solid transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .15s;padding:0}
.color-swatch.active{border-color:#fff;box-shadow:0 0 0 2px currentColor;transform:scale(1.15)}
.color-swatch:hover{transform:scale(1.15)}
.form-footer{padding:9px 14px;border-top:1px solid #eaecef;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:#fff}
.btn-prev{display:flex;align-items:center;gap:4px;padding:6px 11px;border-radius:7px;border:1px solid #e5e7eb;background:#fff;font-size:12px;font-weight:600;color:#555;cursor:pointer;font-family:inherit}
.btn-prev:hover:not(:disabled){background:#f5f6f8}.btn-prev:disabled{opacity:.3;cursor:not-allowed}
.btn-next{display:flex;align-items:center;gap:4px;padding:6px 13px;border-radius:7px;border:none;color:#fff;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:opacity .15s}
.btn-next:hover:not(:disabled){opacity:.85}.btn-next:disabled{opacity:.5;cursor:not-allowed}
.step-dots{display:flex;gap:4px}
.step-dot{width:6px;height:6px;border-radius:50%;background:#e5e7eb;cursor:pointer;transition:all .2s}
.step-dot.active{width:16px;border-radius:3px}.step-dot.done{background:#22c55e}
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
.drag-handle:hover{color:#6b7280;background:#f0f0f0}.drag-handle:active{cursor:grabbing}
.drag-handle-sm{display:flex;align-items:center;cursor:grab;color:#bbb;padding:2px 3px;border-radius:3px;flex-shrink:0;transition:color .15s}
.drag-handle-sm:hover{color:#6b7280}.drag-handle-sm:active{cursor:grabbing}
.draggable-row{transition:background .12s,box-shadow .12s;border-radius:7px;padding:2px 3px}
.entry.dragging,.draggable-row.dragging{opacity:.35;background:#f0f9ff !important;box-shadow:0 0 0 2px #bfdbfe;border-radius:7px}
.entry.drag-over,.draggable-row.drag-over{background:#eff6ff !important;box-shadow:0 0 0 2px #3b82f6;border-radius:7px;transform:scale(1.01)}

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