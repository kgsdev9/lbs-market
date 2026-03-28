<template>
  <div class="pj-shell">

    <!-- ══ TOP BAR ══ -->
    <div class="pj-topbar">
      <RouterLink to="/dashboard/projets" class="pj-back">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Projets
      </RouterLink>
      <div class="pj-topbar-mid">
        <div class="pj-topbar-title">{{ isEdit ? 'Modifier le projet' : 'Nouveau projet' }}</div>
        <div v-if="form.title" class="pj-topbar-draft">{{ form.title }}</div>
      </div>
      <div class="pj-topbar-right">
        <div class="pj-status-row">
          <button v-for="s in statuses" :key="s.value" class="pj-status-btn" :class="{ on: form.status === s.value }" @click="form.status = s.value">
            {{ s.icon }} {{ s.label }}
          </button>
        </div>
        <button class="pj-save-btn" @click="save" :disabled="saving">
          <span v-if="saving" class="pj-spinner"/>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          {{ saving ? 'Sauvegarde...' : (isEdit ? 'Mettre à jour' : 'Sauvegarder') }}
        </button>
      </div>
    </div>

    <!-- ══ STEPPER ══ -->
    <div class="pj-stepper">
      <template v-for="(s, i) in steps" :key="i">
        <div class="pj-step"
          :class="{ 'pj-step--on': currentStep === i+1, 'pj-step--done': currentStep > i+1, 'pj-step--off': currentStep < i+1 }"
          @click="currentStep > i+1 ? currentStep = i+1 : null"
        >
          <div class="pj-step-dot">
            <svg v-if="currentStep > i+1" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span v-else>{{ i+1 }}</span>
          </div>
          <div class="pj-step-info">
            <span class="pj-step-lbl">{{ s.label }}</span>
            <span class="pj-step-sub">{{ s.sub }}</span>
          </div>
        </div>
        <div v-if="i < steps.length-1" class="pj-step-line" :class="{ done: currentStep > i+1 }"/>
      </template>
    </div>

    <!-- ══ BODY ══ -->
    <div class="pj-body">

      <!-- ─── ÉTAPE 1 — Infos & Liens ─── -->
      <Transition name="sl" mode="out-in">
      <div v-if="currentStep === 1" key="s1" class="pj-pane">
        <div class="pj-ph">
          <div class="pj-pnum">01</div>
          <div>
            <h2 class="pj-ptitle">Informations du projet</h2>
            <p class="pj-psub">Titre, résumé, liens et image de couverture</p>
          </div>
        </div>

        <div class="pj-grid">
          <div class="pj-col-main">

            <div class="pj-fld">
              <label class="pj-lbl">Titre du projet <span class="pj-req">*</span></label>
              <input v-model="form.title" class="pj-inp pj-inp--lg" placeholder="Ex: Dashboard Admin Vue 3 + Laravel"/>
              <span class="pj-hint">Clair et précis — c'est la première chose que les gens voient</span>
            </div>

            <div class="pj-fld">
              <label class="pj-lbl">Résumé court</label>
              <textarea v-model="form.excerpt" class="pj-inp pj-textarea" rows="3" placeholder="Une phrase ou deux qui résument l'essentiel du projet..."/>
              <div class="pj-hint-row">
                <span>Affiché dans les listes et aperçus</span>
                <span :class="{ 'pj-warn': form.excerpt.length > 190 }">{{ form.excerpt.length }}/200</span>
              </div>
            </div>

            <div class="pj-fld">
              <label class="pj-lbl">Liens</label>
              <div class="pj-links">
                <div class="pj-link-row">
                  <span class="pj-link-ico">🐙</span>
                  <input v-model="form.github_link" class="pj-inp" placeholder="https://github.com/..."/>
                </div>
                <div class="pj-link-row">
                  <span class="pj-link-ico">🌐</span>
                  <input v-model="form.demo_link" class="pj-inp" placeholder="https://monprojet.com"/>
                </div>
              </div>
            </div>

          </div>

          <div class="pj-col-side">

            <div class="pj-side-box">
              <div class="pj-side-ttl">Image de couverture</div>
              <div class="pj-img-zone" :class="{ 'pj-img-zone--filled': form.image }" @click="$refs.imageInput.click()" @dragover.prevent @drop.prevent="handleDrop">
                <img v-if="form.image" :src="form.image" class="pj-img-preview"/>
                <div v-else class="pj-img-ph">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>PNG, JPG — max 2 Mo</span>
                </div>
              </div>
              <input ref="imageInput" type="file" accept="image/*" style="display:none" @change="handleImageUpload"/>
              <button v-if="form.image" class="pj-rm-img" @click="form.image = null">✕ Supprimer</button>
            </div>

            <div class="pj-side-box">
              <div class="pj-side-ttl">Statut du projet</div>
              <div class="pj-status-stack">
                <button v-for="s in statuses" :key="s.value" class="pj-status-tile" :class="{ on: form.status === s.value }" :style="form.status === s.value ? { background: s.bg, color: s.color, borderColor: s.color+'66' } : {}" @click="form.status = s.value">
                  <span class="pj-st-icon">{{ s.icon }}</span>
                  <div>
                    <div class="pj-st-lbl">{{ s.label }}</div>
                    <div class="pj-st-desc">{{ s.desc }}</div>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>

        <div class="pj-nav">
          <div/>
          <button class="pj-btn-nxt" @click="currentStep++" :disabled="!step1Valid">
            Suivant — Description
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      </Transition>

      <!-- ─── ÉTAPE 2 — Description ─── -->
      <Transition name="sl" mode="out-in">
      <div v-if="currentStep === 2" key="s2" class="pj-pane pj-pane--editor">
        <div class="pj-ph">
          <div class="pj-pnum">02</div>
          <div>
            <h2 class="pj-ptitle">Description complète</h2>
            <p class="pj-psub">Détaille la stack, les fonctionnalités, l'architecture...</p>
          </div>
          <div class="pj-split-toggle" @click="splitMode = !splitMode">
            <div class="pj-split-knob" :class="{ on: splitMode }"/>
            <span>Aperçu live</span>
          </div>
        </div>

        <div class="pj-editor-wrap" :class="{ split: splitMode }">
          <div class="pj-editor-left">
            <div class="pj-toolbar">
              <button class="pj-tb" @click="wrap('**','**')"><b>B</b></button>
              <button class="pj-tb" @click="wrap('*','*')"><i>I</i></button>
              <button class="pj-tb" @click="wrap('`','`')"><code>`</code></button>
              <div class="pj-tsep"/>
              <button class="pj-tb" @click="insertLine('## ')">H2</button>
              <button class="pj-tb" @click="insertLine('### ')">H3</button>
              <button class="pj-tb" @click="insertLine('- ')">• liste</button>
              <button class="pj-tb" @click="insertLine('> ')">❝</button>
              <div class="pj-tsep"/>
              <button class="pj-tb" @click="insertCode('bash')">bash</button>
              <button class="pj-tb" @click="insertCode('php')">php</button>
              <button class="pj-tb" @click="insertCode('javascript')">js</button>
              <button class="pj-tb" @click="insertCode('vue')">vue</button>
              <button class="pj-tb" @click="insertCode('sql')">sql</button>
              <div class="pj-tsep"/>
              <button class="pj-tb" @click="wrap('[','](url)')">🔗</button>
              <div class="pj-tright">
                <span class="pj-wc">{{ wordCount }} mots</span>
              </div>
            </div>
            <textarea ref="editorRef" v-model="form.description" class="pj-textarea-md" placeholder="## À propos du projet&#10;&#10;Décris ton projet ici...&#10;&#10;## Stack technique&#10;&#10;- Vue 3 + Vite&#10;- Laravel 11&#10;- MySQL"/>
          </div>

          <div v-if="splitMode" class="pj-preview-right">
            <div class="pj-prev-hd">
              <span class="pj-prev-badge">Aperçu live</span>
              <span class="pj-prev-wc">{{ wordCount }} mots</span>
            </div>
            <div class="pj-prev-body" v-html="renderedContent"/>
          </div>
        </div>

        <div class="pj-nav">
          <button class="pj-btn-bck" @click="currentStep--">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <button class="pj-btn-nxt" @click="currentStep++">
            Suivant — Niveau & Tags
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      </Transition>

      <!-- ─── ÉTAPE 3 — Niveau & Tags ─── -->
      <Transition name="sl" mode="out-in">
      <div v-if="currentStep === 3" key="s3" class="pj-pane">
        <div class="pj-ph">
          <div class="pj-pnum">03</div>
          <div>
            <h2 class="pj-ptitle">Niveau & Tags</h2>
            <p class="pj-psub">Catégorise ton projet pour améliorer sa visibilité</p>
          </div>
        </div>

        <div class="pj-grid">
          <div class="pj-col-main">

            <!-- Niveau -->
            <div class="pj-fld">
              <label class="pj-lbl">Niveau de difficulté</label>
              <div class="pj-levels">
                <button v-for="l in levels" :key="l.value" class="pj-level-card" :class="{ on: form.level === l.value }" @click="form.level = l.value">
                  <div class="pj-lc-icon">{{ l.icon }}</div>
                  <div class="pj-lc-info">
                    <div class="pj-lc-name">{{ l.label }}</div>
                    <div class="pj-lc-desc">{{ l.desc }}</div>
                  </div>
                  <div v-if="form.level === l.value" class="pj-lc-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </button>
              </div>
            </div>

            <!-- Tags -->
            <div class="pj-fld">
              <label class="pj-lbl">
                Tags
                <span v-if="tagsLoading" class="pj-tld"><span/><span/><span/></span>
              </label>
              <div class="pj-tag-srch">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input v-model="tagSearch" class="pj-tag-inp" placeholder="Rechercher un tag…"/>
              </div>
              <div v-if="selectedTags.length" class="pj-sel-tags">
                <span v-for="tag in selectedTags" :key="tag.id" class="pj-sel-tag" @click="removeTag(tag.id)">
                  {{ tag.name }}
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </span>
              </div>
              <p v-else class="pj-no-tags">Aucun tag sélectionné</p>
              <div v-if="tagsLoading" class="pj-tag-skel">
                <span v-for="n in 10" :key="n" class="pj-ts"/>
              </div>
              <div v-else class="pj-tag-cloud">
                <span v-for="tag in filteredAvailableTags" :key="tag.id" class="pj-cloud-tag" :class="{ on: isSelected(tag.id) }" @click="toggleTag(tag)">
                  {{ isSelected(tag.id) ? '✓' : '+' }} {{ tag.name }}
                </span>
                <span v-if="filteredAvailableTags.length === 0" class="pj-no-tags">Aucun résultat</span>
              </div>
            </div>

          </div>

          <div class="pj-col-side">
            <div class="pj-side-box pj-tip-box">
              <div class="pj-side-ttl">💡 Conseils</div>
              <ul class="pj-tips">
                <li>Choisis le niveau qui correspond vraiment aux prérequis</li>
                <li>Utilise les tags des technos principales</li>
                <li>3-6 tags c'est l'idéal</li>
                <li>Ajoute le statut actuel du projet</li>
              </ul>
              <div v-if="selectedTags.length" class="pj-tags-count">{{ selectedTags.length }} tag{{ selectedTags.length > 1 ? 's' : '' }}</div>
            </div>
          </div>
        </div>

        <div class="pj-nav">
          <button class="pj-btn-bck" @click="currentStep--">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <button class="pj-btn-nxt" @click="currentStep++">
            Voir l'aperçu client
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      </Transition>

      <!-- ─── ÉTAPE 4 — Aperçu client ─── -->
      <Transition name="sl" mode="out-in">
      <div v-if="currentStep === 4" key="s4" class="pj-pane">
        <div class="pj-ph">
          <div class="pj-pnum pj-pnum--eye">👁</div>
          <div>
            <h2 class="pj-ptitle">Aperçu client</h2>
            <p class="pj-psub">Voici exactement ce que les visiteurs verront sur la page du projet</p>
          </div>
          <div class="pj-live-chip">
            <span class="pj-live-dot"/>
            Vue client en direct
          </div>
        </div>

        <!-- Rendu page projet complète -->
        <div class="pj-client-preview">

          <!-- Bandeau aperçu -->
          <div class="pj-cp-banner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Mode aperçu — cette page est telle qu'elle apparaîtra aux visiteurs
          </div>

          <!-- Hero projet -->
          <div class="pj-cp-hero">
            <div class="pj-cp-left">
              <!-- Breadcrumb -->
              <div class="pj-cp-bc">Projets <span>›</span> {{ currentLevelObj?.label }}</div>
              <!-- Badges -->
              <div class="pj-cp-badges">
                <span class="pj-cp-badge-status" :style="{ background: currentStatusObj.bg, color: currentStatusObj.color }">{{ currentStatusObj.icon }} {{ currentStatusObj.label }}</span>
                <span class="pj-cp-badge-level" :class="'lvl-' + form.level">{{ currentLevelObj?.icon }} {{ currentLevelObj?.label }}</span>
              </div>
              <!-- Titre -->
              <h1 class="pj-cp-title">{{ form.title || 'Titre du projet…' }}</h1>
              <!-- Excerpt -->
              <p class="pj-cp-excerpt">{{ form.excerpt || 'Résumé du projet…' }}</p>
              <!-- Tags -->
              <div v-if="selectedTags.length" class="pj-cp-tags">
                <span v-for="tag in selectedTags" :key="tag.id" class="pj-cp-tag">{{ tag.name }}</span>
              </div>
              <!-- Actions -->
              <div class="pj-cp-actions">
                <a v-if="form.github_link" :href="form.github_link" target="_blank" class="pj-cp-btn pj-cp-btn--primary">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  Voir sur GitHub
                </a>
                <a v-if="form.demo_link" :href="form.demo_link" target="_blank" class="pj-cp-btn pj-cp-btn--outline">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Demo live
                </a>
                <span v-if="!form.github_link && !form.demo_link" class="pj-cp-no-links">Aucun lien renseigné</span>
              </div>
            </div>

            <!-- Image / auteur -->
            <div class="pj-cp-right">
              <div class="pj-cp-cover">
                <img v-if="form.image" :src="form.image" class="pj-cp-cover-img"/>
                <div v-else class="pj-cp-cover-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>Image de couverture</span>
                </div>
              </div>
              <div class="pj-cp-author-card">
                <div class="pj-cp-author-ttl">Auteur du projet</div>
                <div class="pj-cp-author">
                  <div class="pj-cp-avatar">?</div>
                  <div>
                    <div class="pj-cp-author-name">Ton nom ici</div>
                    <div class="pj-cp-author-role">Développeur</div>
                  </div>
                </div>
                <div class="pj-cp-contribute">
                  <div class="pj-cp-contribute-ttl">Contribuer</div>
                  <p>Ce projet est open source. Pull requests et issues bienvenus !</p>
                  <div v-if="form.github_link" class="pj-cp-fork-btn">🔱 Fork sur GitHub</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Description rendue -->
          <div class="pj-cp-body">
            <div v-if="form.description" class="pj-cp-content" v-html="renderedContent"/>
            <div v-else class="pj-cp-empty">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <p>Aucune description rédigée.</p>
              <button @click="currentStep = 2" class="pj-cp-write-btn">✏️ Aller rédiger</button>
            </div>
          </div>

        </div>

        <!-- CTA approbation -->
        <div class="pj-approval">
          <div class="pj-approval-left">
            <div class="pj-approval-emoji">🤔</div>
            <div>
              <div class="pj-approval-title">C'est ce que verront les visiteurs</div>
              <div class="pj-approval-sub">Si la présentation te convient, passe à l'étape finale pour publier.</div>
            </div>
          </div>
          <div class="pj-approval-btns">
            <button class="pj-approval-edit" @click="currentStep = 1">✏️ Modifier</button>
            <button class="pj-approval-ok" @click="currentStep++">
              ✅ J'approuve — Continuer
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        <div class="pj-nav" style="margin-top:16px">
          <button class="pj-btn-bck" @click="currentStep--">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
        </div>
      </div>
      </Transition>

      <!-- ─── ÉTAPE 5 — Publication ─── -->
      <Transition name="sl" mode="out-in">
      <div v-if="currentStep === 5" key="s5" class="pj-pane">
        <div class="pj-ph">
          <div class="pj-pnum">05</div>
          <div>
            <h2 class="pj-ptitle">Publication</h2>
            <p class="pj-psub">Vérifie la checklist et publie ton projet</p>
          </div>
        </div>

        <div class="pj-recap-layout">

          <!-- Mini preview -->
          <div class="pj-recap-left">
            <div class="pj-mini-card">
              <div class="pj-mc-cover" :style="{ background: currentStatusObj.bg }">
                <img v-if="form.image" :src="form.image" class="pj-mc-img"/>
                <div v-else class="pj-mc-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
              </div>
              <div class="pj-mc-body">
                <div class="pj-mc-badges">
                  <span class="pj-mc-badge-status" :style="{ background: currentStatusObj.bg, color: currentStatusObj.color }">{{ currentStatusObj.icon }} {{ currentStatusObj.label }}</span>
                  <span class="pj-mc-badge-level" :class="'lvl-' + form.level">{{ currentLevelObj?.icon }} {{ currentLevelObj?.label }}</span>
                </div>
                <div class="pj-mc-title">{{ form.title || '—' }}</div>
                <div class="pj-mc-excerpt">{{ form.excerpt || 'Aucun résumé' }}</div>
                <div v-if="selectedTags.length" class="pj-mc-tags">
                  <span v-for="t in selectedTags.slice(0,4)" :key="t.id" class="pj-mc-tag">{{ t.name }}</span>
                </div>
                <div class="pj-mc-links">
                  <span v-if="form.github_link">🐙 GitHub</span>
                  <span v-if="form.demo_link">🌐 Démo</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Checklist + détails -->
          <div class="pj-recap-right">

            <div class="pj-checklist">
              <div class="pj-cl-ttl">Checklist avant publication</div>
              <div v-for="c in checklist" :key="c.label" class="pj-cl-item" :class="{ ok: c.ok }">
                <div class="pj-cl-dot" :class="c.ok ? 'pj-cl-ok' : 'pj-cl-warn'">
                  <svg v-if="c.ok" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <svg v-else width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>
                </div>
                <span class="pj-cl-lbl">{{ c.label }}</span>
                <span v-if="!c.ok" class="pj-cl-hint">{{ c.hint }}</span>
                <button v-if="!c.ok" class="pj-cl-fix" @click="currentStep = c.step">Corriger →</button>
              </div>
            </div>

            <div class="pj-detail-tbl">
              <div class="pj-dt-row">
                <span class="pj-dt-k">Statut</span>
                <span class="pj-dt-v" :style="{ color: currentStatusObj.color }">{{ currentStatusObj.icon }} {{ currentStatusObj.label }}</span>
              </div>
              <div class="pj-dt-row">
                <span class="pj-dt-k">Niveau</span>
                <span class="pj-dt-v">{{ currentLevelObj?.icon }} {{ currentLevelObj?.label }}</span>
              </div>
              <div class="pj-dt-row">
                <span class="pj-dt-k">Tags</span>
                <span class="pj-dt-v">{{ selectedTags.length ? selectedTags.map(t=>t.name).join(', ') : '—' }}</span>
              </div>
              <div class="pj-dt-row">
                <span class="pj-dt-k">GitHub</span>
                <span class="pj-dt-v">{{ form.github_link || '—' }}</span>
              </div>
              <div class="pj-dt-row">
                <span class="pj-dt-k">Description</span>
                <span class="pj-dt-v">{{ wordCount }} mots</span>
              </div>
            </div>

          </div>
        </div>

        <div class="pj-nav">
          <button class="pj-btn-bck" @click="currentStep--">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <div style="display:flex;gap:10px">
            <button class="pj-btn-draft" @click="save" :disabled="saving">💾 Sauvegarder</button>
            <button class="pj-btn-publish" @click="save" :disabled="saving">
              <span v-if="saving" class="pj-spinner"/>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ isEdit ? 'Mettre à jour' : '🚀 Publier le projet' }}
            </button>
          </div>
        </div>
      </div>
      </Transition>

    </div>

    <!-- ══ TOAST ══ -->
    <Transition name="tst">
      <div v-if="toast.show" class="pj-toast" :class="{ err: toast.error }">{{ toast.message }}</div>
    </Transition>

  </div>
</template>

<script>
import API from '@/services/api'
import { RouterLink } from 'vue-router'
import hljs from 'highlight.js/lib/core'
import bash       from 'highlight.js/lib/languages/bash'
import php        from 'highlight.js/lib/languages/php'
import javascript from 'highlight.js/lib/languages/javascript'
import xml        from 'highlight.js/lib/languages/xml'
import css        from 'highlight.js/lib/languages/css'
import json       from 'highlight.js/lib/languages/json'
import sql        from 'highlight.js/lib/languages/sql'

hljs.registerLanguage('bash',       bash)
hljs.registerLanguage('shell',      bash)
hljs.registerLanguage('php',        php)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js',         javascript)
hljs.registerLanguage('vue',        xml)
hljs.registerLanguage('html',       xml)
hljs.registerLanguage('css',        css)
hljs.registerLanguage('json',       json)
hljs.registerLanguage('sql',        sql)

export default {
  name: 'ProjetEditorStepper',
  components: { RouterLink },

  data() {
    return {
      currentStep: 1,
      saving: false,
      splitMode: true,
      allTags: [], tagSearch: '', tagsLoading: false,
      toast: { show: false, message: '', error: false },

      steps: [
        { label: 'Informations', sub: 'Titre & liens'   },
        { label: 'Description',  sub: 'Contenu live'    },
        { label: 'Niveau & Tags', sub: 'Catégorisation' },
        { label: 'Aperçu',       sub: 'Vue client'      },
        { label: 'Publication',  sub: 'Vérification'    },
      ],

      statuses: [
        { value: 'dev',        icon: '⚙️',  label: 'En dev',     bg: '#fef9c3', color: '#854d0e', desc: 'En cours de développement.' },
        { value: 'testing',    icon: '🧪',  label: 'Tests',      bg: '#ede9fe', color: '#5b21b6', desc: 'Phase de tests et corrections.' },
        { value: 'production', icon: '🚀',  label: 'Production', bg: '#dcfce7', color: '#14532d', desc: 'En ligne et opérationnel.' },
      ],

      levels: [
        { value: 'debutant',      icon: '🌱', label: 'Débutant',      desc: 'Concepts de base, code bien commenté.' },
        { value: 'intermediaire', icon: '⚡', label: 'Intermédiaire', desc: 'Bases solides, patterns courants.' },
        { value: 'professionnel', icon: '🔥', label: 'Professionnel', desc: 'Architecture complexe, optimisations.' },
      ],

      form: {
        title: '', excerpt: '', description: '', image: null,
        status: 'dev', level: 'intermediaire',
        github_link: '', demo_link: '', tags: [],
      },
    }
  },

  computed: {
    isEdit()         { return !!this.$route.params.id },
    currentStatusObj(){ return this.statuses.find(s => s.value === this.form.status) || this.statuses[0] },
    currentLevelObj() { return this.levels.find(l => l.value === this.form.level) || this.levels[1] },
    step1Valid()      { return this.form.title.trim().length > 2 },
    wordCount() { return this.form.description ? this.form.description.trim().split(/\s+/).filter(Boolean).length : 0 },
    selectedTags()    { return this.allTags.filter(t => this.form.tags.includes(t.id)) },
    filteredAvailableTags() {
      const q = this.tagSearch.trim().toLowerCase()
      return q ? this.allTags.filter(t => t.name.toLowerCase().includes(q)) : this.allTags
    },

    checklist() {
      return [
        { label: 'Titre renseigné',     ok: this.form.title.trim().length > 2,       hint: 'Ajoute un titre',             step: 1 },
        { label: 'Résumé présent',       ok: this.form.excerpt.trim().length > 5,     hint: 'Ajoute un résumé court',      step: 1 },
        { label: 'Description rédigée',  ok: this.form.description.trim().length > 30, hint: 'Rédige la description',      step: 2 },
        { label: 'Niveau défini',        ok: !!this.form.level,                       hint: 'Choisis un niveau',           step: 3 },
        { label: 'Au moins un tag',      ok: this.form.tags.length > 0,              hint: 'Ajoute au moins un tag',      step: 3 },
        { label: 'Lien GitHub ou Démo',  ok: !!(this.form.github_link || this.form.demo_link), hint: 'Ajoute un lien', step: 1 },
      ]
    },

    renderedContent() {
      let md = this.form.description
      if (!md) return '<p style="color:#aaa;font-style:italic">Commence à écrire...</p>'
      md = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        const language = lang || 'plaintext'
        const label    = lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : 'Code'
        let highlighted
        try { highlighted = hljs.highlight(code.trimEnd(), { language }).value }
        catch { highlighted = code.trimEnd().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
        const encoded = btoa(unescape(encodeURIComponent(code.trimEnd())))
        return `<div class="pj-code"><div class="pj-code-hd"><span>&lt;/&gt; ${label}</span><button onclick="cpCode(this)" data-code="${encoded}" class="pj-code-copy"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button></div><pre><code class="hljs language-${language}">${highlighted}</code></pre></div>`
      })
      let h2n = 0
      md = md.replace(/^## (.+)$/gm, (_, t) => { h2n++; return `<h2 class="pj-h2"><span class="pj-h2n">${h2n}</span>${t}</h2>` })
      md = md.replace(/^### (.+)$/gm, '<h3 class="pj-h3">$1</h3>')
      md = md.replace(/^# (.+)$/gm,   '<h1 class="pj-h1">$1</h1>')
      md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      md = md.replace(/\*(.+?)\*/g,     '<em>$1</em>')
      md = md.replace(/`([^`]+)`/g,     '<code class="pj-ic">$1</code>')
      md = md.replace(/^> (.+)$/gm,     '<blockquote class="pj-bq">$1</blockquote>')
      md = md.replace(/^- (.+)$/gm,     '<li>$1</li>')
      md = md.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, s => `<ul class="pj-ul">${s}</ul>`)
      md = md.replace(/\n\n(?!<)/g, '</p><p class="pj-p">')
      return '<p class="pj-p">' + md + '</p>'
    },
  },

  async mounted() {
    this.fetchTags()
    if (this.isEdit) this.fetchProject()
    window.cpCode = (btn) => {
      const code = decodeURIComponent(escape(atob(btn.dataset.code)))
      navigator.clipboard.writeText(code).then(() => {
        btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
        btn.classList.add('copied')
        setTimeout(() => {
          btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`
          btn.classList.remove('copied')
        }, 2000)
      })
    }
  },
  beforeUnmount() { delete window.cpCode },

  methods: {
    async fetchTags() {
      this.tagsLoading = true
      try {
        const { data } = await API.get('/admin/tags')
        this.allTags = Array.isArray(data) ? data : (data.data || [])
      } catch(e) { console.error(e) }
      finally { this.tagsLoading = false }
    },

    async fetchProject() {
      try {
        const { data } = await API.get(`/admin/projects/${this.$route.params.id}`)
        this.form = {
          title:       data.title         || '',
          excerpt:     data.excerpt        || '',
          description: data.description    || '',
          image:       data.image          || null,
          status:      data.status         || 'dev',
          level:       data.level          || 'intermediaire',
          github_link: data.github_link    || '',
          demo_link:   data.demo_link      || '',
          tags:        data.tags ? data.tags.map(t => t.id) : [],
        }
      } catch(e) { console.error(e) }
    },

    isSelected(id) { return this.form.tags.includes(id) },
    toggleTag(tag) { this.isSelected(tag.id) ? this.removeTag(tag.id) : this.form.tags.push(tag.id) },
    removeTag(id)  { this.form.tags = this.form.tags.filter(x => x !== id) },

    wrap(before, after) {
      const el = this.$refs.editorRef; if (!el) return
      const s = el.selectionStart, e = el.selectionEnd
      const sel = this.form.description.substring(s, e)
      this.form.description = this.form.description.substring(0, s) + before + sel + after + this.form.description.substring(e)
      this.$nextTick(() => { el.selectionStart = s + before.length; el.selectionEnd = s + before.length + sel.length; el.focus() })
    },
    insertLine(prefix) {
      const el = this.$refs.editorRef
      const s  = el ? el.selectionStart : this.form.description.length
      this.form.description = this.form.description.substring(0, s) + '\n' + prefix + this.form.description.substring(s)
      this.$nextTick(() => el && el.focus())
    },
    insertCode(lang) {
      const el = this.$refs.editorRef
      const s  = el ? el.selectionStart : this.form.description.length
      this.form.description = this.form.description.substring(0, s) + `\n\`\`\`${lang}\n\n\`\`\`\n` + this.form.description.substring(s)
      this.$nextTick(() => { if(el){ const c = s + lang.length + 5; el.selectionStart = c; el.selectionEnd = c; el.focus() } })
    },
    handleImageUpload(e) {
      const file = e.target.files[0]; if (!file) return
      const r = new FileReader(); r.onload = ev => { this.form.image = ev.target.result }; r.readAsDataURL(file)
    },
    handleDrop(e) {
      const file = e.dataTransfer.files[0]; if (!file || !file.type.startsWith('image/')) return
      const r = new FileReader(); r.onload = ev => { this.form.image = ev.target.result }; r.readAsDataURL(file)
    },

    async save() {
      if (!this.form.title.trim()) { this.showToast('Le titre est obligatoire', true); return }
      this.saving = true
      try {
        const payload = {
          title: this.form.title, excerpt: this.form.excerpt, description: this.form.description,
          image: this.form.image, status: this.form.status, level: this.form.level,
          github_link: this.form.github_link, demo_link: this.form.demo_link, tags: this.form.tags,
        }
        const url    = this.isEdit ? `/admin/projects/${this.$route.params.id}` : '/admin/projects'
        const method = this.isEdit ? 'put' : 'post'
        await API[method](url, payload)
        this.showToast(this.isEdit ? '✓ Projet mis à jour' : '✓ Projet sauvegardé')
        setTimeout(() => this.$router.push('/dashboard/projets'), 1200)
      } catch (error) {
        if (error.response?.status === 422) {
          const errors = error.response.data.errors
          this.showToast(Object.values(errors).flat().join(' · '), true)
        } else {
          this.showToast('Une erreur est survenue', true)
        }
      } finally { this.saving = false }
    },

    showToast(message, error = false) {
      this.toast = { show: true, message, error }
      setTimeout(() => { this.toast.show = false }, 3500)
    },
  },
}
</script>

<style src="highlight.js/styles/github-dark.css"/>

<style scoped>
.pj-shell { padding-bottom: 60px; }

/* ── Topbar ── */
.pj-topbar { display:flex; align-items:center; gap:14px; padding:13px 0 18px; border-bottom:1px solid var(--border); flex-wrap:wrap; }
.pj-back { display:flex; align-items:center; gap:5px; font-size:13px; font-weight:500; color:var(--text3); text-decoration:none; padding:6px 10px; border-radius:7px; transition:all .15s; }
.pj-back:hover { color:var(--text); background:var(--surface2); }
.pj-topbar-mid { flex:1; min-width:0; }
.pj-topbar-title { font-size:15px; font-weight:700; color:var(--text); }
.pj-topbar-draft { font-size:12px; color:var(--text4); margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.pj-topbar-right { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.pj-status-row { display:flex; gap:4px; }
.pj-status-btn { padding:5px 10px; border-radius:20px; border:1.5px solid var(--border); background:var(--surface); font-size:12px; font-weight:600; color:var(--text3); cursor:pointer; transition:all .15s; }
.pj-status-btn.on { background:var(--text); color:var(--surface); border-color:var(--text); }
.pj-save-btn { display:flex; align-items:center; gap:6px; padding:8px 18px; border-radius:8px; background:var(--accent,#4f46e5); color:var(--accent-fg,#fff); font-size:13px; font-weight:700; cursor:pointer; border:none; transition:all .15s; }
.pj-save-btn:hover:not(:disabled) { opacity:.88; transform:translateY(-1px); }
.pj-save-btn:disabled { opacity:.35; cursor:not-allowed; }

/* ── Stepper ── */
.pj-stepper { display:flex; align-items:center; padding:22px 0 20px; border-bottom:1px solid var(--border2); margin-bottom:32px; max-width:780px; }
.pj-step { display:flex; align-items:center; gap:9px; cursor:pointer; }
.pj-step--off { opacity:.4; cursor:default; }
.pj-step-dot { width:32px; height:32px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; border:2px solid var(--border); background:var(--surface); color:var(--text3); transition:all .2s; }
.pj-step--on   .pj-step-dot { background:var(--text); color:var(--surface); border-color:var(--text); }
.pj-step--done .pj-step-dot { background:#16a34a; color:#fff; border-color:#16a34a; }
.pj-step-info { display:flex; flex-direction:column; }
.pj-step-lbl { font-size:12.5px; font-weight:600; color:var(--text3); white-space:nowrap; }
.pj-step--on   .pj-step-lbl { color:var(--text); font-weight:700; }
.pj-step--done .pj-step-lbl { color:#16a34a; }
.pj-step-sub { font-size:10.5px; color:var(--text5); white-space:nowrap; }
.pj-step-line { flex:1; height:2px; background:var(--border2); margin:0 10px; min-width:14px; transition:background .3s; }
.pj-step-line.done { background:#16a34a; }

/* ── Pane ── */
.pj-pane { animation:pjIn .25s ease; }
@keyframes pjIn { from { opacity:0; transform:translateY(7px) } to { opacity:1; transform:translateY(0) } }

.pj-ph { display:flex; align-items:center; gap:16px; margin-bottom:28px; }
.pj-pnum { width:48px; height:48px; border-radius:12px; background:var(--text); color:var(--surface); display:flex; align-items:center; justify-content:center; font-size:17px; font-weight:800; font-family:monospace; flex-shrink:0; }
.pj-pnum--eye { background:linear-gradient(135deg,#4f46e5,#7c3aed); font-size:22px; }
.pj-ptitle { font-size:20px; font-weight:800; color:var(--text); margin-bottom:3px; }
.pj-psub   { font-size:13.5px; color:var(--text3); }

/* ── Grid ── */
.pj-grid     { display:grid; grid-template-columns:1fr 270px; gap:24px; align-items:start; }
.pj-col-main { display:flex; flex-direction:column; gap:18px; }
.pj-col-side { display:flex; flex-direction:column; gap:12px; }

/* ── Fields ── */
.pj-fld  { display:flex; flex-direction:column; gap:6px; }
.pj-lbl  { font-size:11.5px; font-weight:700; color:var(--text3); text-transform:uppercase; letter-spacing:.5px; font-family:monospace; display:flex; align-items:center; gap:8px; }
.pj-req  { color:#ef4444; }
.pj-inp  { padding:10px 13px; border:1.5px solid var(--border); border-radius:9px; background:var(--surface); color:var(--text); font-size:14px; font-family:inherit; width:100%; transition:all .18s; }
.pj-inp:focus { outline:none; border-color:var(--text); box-shadow:0 0 0 3px rgba(0,0,0,.05); }
.pj-inp--lg { font-size:17px; font-weight:700; padding:12px 14px; }
.pj-textarea { resize:vertical; min-height:80px; }
.pj-hint     { font-size:12px; color:var(--text5); }
.pj-hint-row { display:flex; justify-content:space-between; font-size:12px; color:var(--text5); }
.pj-warn     { color:#ef4444 !important; }
.pj-links    { display:flex; flex-direction:column; gap:8px; }
.pj-link-row { display:flex; align-items:center; gap:8px; }
.pj-link-ico { font-size:18px; flex-shrink:0; width:26px; text-align:center; }

/* ── Side box ── */
.pj-side-box { background:var(--surface); border:1.5px solid var(--border); border-radius:12px; padding:16px; }
.pj-side-ttl { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:var(--text4); margin-bottom:12px; font-family:monospace; }

/* ── Image upload ── */
.pj-img-zone { border:2px dashed var(--border); border-radius:10px; min-height:120px; cursor:pointer; display:flex; align-items:center; justify-content:center; overflow:hidden; transition:border-color .2s; background:var(--surface2); }
.pj-img-zone:hover { border-color:var(--text3); }
.pj-img-zone--filled { padding:0; border-style:solid; border-color:var(--border); }
.pj-img-ph { display:flex; flex-direction:column; align-items:center; gap:6px; color:var(--text4); font-size:12px; padding:20px; }
.pj-img-preview { width:100%; display:block; border-radius:8px; }
.pj-rm-img { margin-top:8px; font-size:12px; color:var(--text4); background:none; border:none; cursor:pointer; }
.pj-rm-img:hover { color:#ef4444; }

/* ── Status tiles ── */
.pj-status-stack { display:flex; flex-direction:column; gap:6px; }
.pj-status-tile  { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:9px; border:1.5px solid var(--border); background:var(--surface); cursor:pointer; text-align:left; transition:all .15s; }
.pj-status-tile:hover { border-color:var(--text3); }
.pj-st-icon { font-size:20px; flex-shrink:0; }
.pj-st-lbl  { font-size:12.5px; font-weight:600; color:var(--text2); }
.pj-st-desc { font-size:11px; color:var(--text4); }

/* ── Editor ── */
.pj-pane--editor .pj-ph { margin-bottom:16px; }
.pj-split-toggle { display:flex; align-items:center; gap:7px; cursor:pointer; margin-left:auto; font-size:12.5px; font-weight:600; color:var(--text3); }
.pj-split-toggle:hover { color:var(--text); }
.pj-split-knob { width:36px; height:20px; border-radius:10px; background:var(--border); position:relative; transition:background .2s; flex-shrink:0; }
.pj-split-knob::after { content:''; position:absolute; width:14px; height:14px; border-radius:50%; background:#fff; top:3px; left:3px; transition:left .2s; box-shadow:0 1px 3px rgba(0,0,0,.2); }
.pj-split-knob.on { background:var(--text); }
.pj-split-knob.on::after { left:19px; }
.pj-editor-wrap { display:grid; grid-template-columns:1fr; border:1.5px solid var(--border); border-radius:12px; overflow:hidden; min-height:460px; }
.pj-editor-wrap.split { grid-template-columns:1fr 1fr; }
.pj-editor-left { display:flex; flex-direction:column; border-right:1px solid var(--border2); }
.pj-editor-wrap:not(.split) .pj-editor-left { border-right:none; }
.pj-toolbar { display:flex; align-items:center; gap:2px; padding:8px 12px; background:var(--surface2); border-bottom:1px solid var(--border2); flex-wrap:wrap; }
.pj-tb { padding:0 7px; height:26px; border:none; background:none; color:var(--text3); border-radius:4px; cursor:pointer; font-size:11.5px; font-weight:700; font-family:monospace; transition:all .1s; }
.pj-tb:hover { background:var(--surface); color:var(--text); }
.pj-tsep { width:1px; height:16px; background:var(--border); margin:0 3px; }
.pj-tright { margin-left:auto; }
.pj-wc { font-size:11px; color:var(--text5); font-family:monospace; }
.pj-textarea-md { flex:1; border:none; outline:none; resize:none; padding:18px 20px; font-size:13.5px; font-family:monospace; color:var(--text); background:var(--surface); line-height:1.9; min-height:460px; }
.pj-preview-right { display:flex; flex-direction:column; background:var(--surface); overflow-y:auto; }
.pj-prev-hd { display:flex; align-items:center; justify-content:space-between; padding:9px 16px; background:var(--surface2); border-bottom:1px solid var(--border2); flex-shrink:0; }
.pj-prev-badge { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:var(--accent,#4f46e5); font-family:monospace; }
.pj-prev-wc    { font-size:11px; color:var(--text5); }
.pj-prev-body  { padding:18px 20px; flex:1; font-size:14.5px; line-height:1.8; color:var(--text2); overflow-y:auto; }

/* ── Levels ── */
.pj-levels { display:flex; flex-direction:column; gap:8px; }
.pj-level-card { display:flex; align-items:center; gap:12px; padding:12px 16px; border:1.5px solid var(--border); border-radius:10px; background:var(--surface); cursor:pointer; text-align:left; transition:all .15s; }
.pj-level-card:hover { border-color:var(--text3); }
.pj-level-card.on { border-color:var(--text); background:var(--surface2); }
.pj-lc-icon { font-size:22px; flex-shrink:0; }
.pj-lc-info { flex:1; }
.pj-lc-name { font-size:13.5px; font-weight:600; color:var(--text); }
.pj-lc-desc { font-size:12px; color:var(--text4); margin-top:2px; }
.pj-lc-check { width:24px; height:24px; border-radius:50%; background:#16a34a; color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

/* ── Tags ── */
.pj-tld { display:inline-flex; gap:3px; align-items:center; }
.pj-tld span { width:4px; height:4px; border-radius:50%; background:var(--text5); animation:blink 1.2s infinite; }
.pj-tld span:nth-child(2) { animation-delay:.2s; }
.pj-tld span:nth-child(3) { animation-delay:.4s; }
@keyframes blink { 0%,100% { opacity:.2 } 50% { opacity:1 } }
.pj-tag-srch { display:flex; align-items:center; gap:8px; padding:9px 12px; border:1.5px solid var(--border); border-radius:9px; background:var(--surface); color:var(--text4); margin-bottom:12px; }
.pj-tag-inp  { flex:1; border:none; outline:none; font-size:13.5px; color:var(--text); background:transparent; }
.pj-sel-tags { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:12px; }
.pj-sel-tag  { display:inline-flex; align-items:center; gap:5px; padding:5px 11px; border-radius:20px; background:var(--text); color:var(--surface); font-size:12px; font-weight:600; cursor:pointer; transition:opacity .15s; }
.pj-sel-tag:hover { opacity:.8; }
.pj-no-tags  { font-size:12px; color:var(--text5); margin-bottom:10px; display:block; }
.pj-tag-skel { display:flex; flex-wrap:wrap; gap:6px; }
.pj-ts       { height:32px; width:72px; border-radius:20px; background:var(--surface2); animation:pls .9s ease-in-out infinite alternate; }
@keyframes pls { from { opacity:.4 } to { opacity:1 } }
.pj-tag-cloud { display:flex; flex-wrap:wrap; gap:6px; }
.pj-cloud-tag { display:inline-flex; align-items:center; gap:4px; padding:6px 12px; border-radius:20px; background:var(--surface2); color:var(--text3); border:1.5px solid var(--border); font-size:12.5px; font-weight:500; cursor:pointer; transition:all .12s; }
.pj-cloud-tag:hover { border-color:var(--text3); color:var(--text); }
.pj-cloud-tag.on { background:var(--text); color:var(--surface); border-color:var(--text); }
.pj-tip-box .pj-tips { margin:0; padding-left:16px; display:flex; flex-direction:column; gap:5px; }
.pj-tip-box .pj-tips li { font-size:12.5px; color:var(--text3); line-height:1.5; }
.pj-tags-count { margin-top:12px; padding:7px 12px; background:var(--surface2); font-size:12.5px; font-weight:600; color:var(--text2); text-align:center; border-radius:8px; }

/* ── Aperçu client ── */
.pj-live-chip { display:flex; align-items:center; gap:6px; margin-left:auto; padding:6px 12px; border-radius:20px; background:#dcfce7; color:#15803d; font-size:11.5px; font-weight:700; font-family:monospace; }
.pj-live-dot  { width:7px; height:7px; border-radius:50%; background:#16a34a; animation:blink2 1.5s ease-in-out infinite; }
@keyframes blink2 { 0%,100% { opacity:1 } 50% { opacity:.3 } }

.pj-client-preview { border:1.5px solid var(--border); border-radius:16px; overflow:hidden; margin-bottom:24px; box-shadow:0 6px 32px rgba(0,0,0,.07); }
.pj-cp-banner { display:flex; align-items:center; gap:8px; padding:10px 20px; background:#fffbeb; border-bottom:1px solid #fde68a; font-size:12.5px; font-weight:600; color:#92400e; }

.pj-cp-hero { display:grid; grid-template-columns:1fr 280px; gap:32px; padding:40px; align-items:start; background:var(--surface2); }
.pj-cp-bc   { font-size:12px; color:var(--text4); margin-bottom:14px; }
.pj-cp-bc span { margin:0 4px; opacity:.4; }
.pj-cp-badges { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
.pj-cp-badge-status { padding:4px 12px; border-radius:20px; font-size:11.5px; font-weight:600; }
.pj-cp-badge-level  { padding:4px 12px; border-radius:20px; font-size:11.5px; font-weight:600; }
.lvl-debutant      { background:#dcfce7; color:#15803d; }
.lvl-intermediaire { background:#fef9c3; color:#854d0e; }
.lvl-professionnel { background:#ede9fe; color:#6d28d9; }
.pj-cp-title   { font-size:clamp(22px,3vw,34px); font-weight:800; color:var(--text); letter-spacing:-.8px; line-height:1.18; margin-bottom:12px; }
.pj-cp-excerpt { font-size:15px; color:var(--text3); line-height:1.7; margin-bottom:14px; }
.pj-cp-tags    { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:18px; }
.pj-cp-tag     { padding:4px 10px; border-radius:6px; font-size:11.5px; font-weight:600; background:rgba(0,0,0,.07); color:var(--text2); border:1px solid rgba(0,0,0,.07); font-family:monospace; }
.pj-cp-actions { display:flex; gap:10px; flex-wrap:wrap; }
.pj-cp-btn     { display:inline-flex; align-items:center; gap:7px; padding:10px 18px; border-radius:8px; font-size:13px; font-weight:600; text-decoration:none; transition:all .15s; }
.pj-cp-btn--primary { background:var(--text); color:var(--surface); }
.pj-cp-btn--outline { border:1.5px solid var(--border); color:var(--text2); background:transparent; }
.pj-cp-no-links { font-size:12.5px; color:var(--text5); }
.pj-cp-cover { border:1.5px solid var(--border); border-radius:12px; overflow:hidden; height:180px; display:flex; align-items:center; justify-content:center; background:var(--surface); margin-bottom:12px; }
.pj-cp-cover-img { width:100%; height:100%; object-fit:cover; }
.pj-cp-cover-placeholder { display:flex; flex-direction:column; align-items:center; gap:6px; color:var(--text4); font-size:11px; }
.pj-cp-author-card { background:var(--surface); border:1.5px solid var(--border); border-radius:12px; padding:14px; }
.pj-cp-author-ttl  { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--text4); margin-bottom:10px; font-family:monospace; }
.pj-cp-author      { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
.pj-cp-avatar      { width:36px; height:36px; border-radius:50%; background:var(--accent,#4f46e5); color:var(--accent-fg,#fff); display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; flex-shrink:0; }
.pj-cp-author-name { font-size:13px; font-weight:600; color:var(--text); }
.pj-cp-author-role { font-size:11px; color:var(--text4); }
.pj-cp-contribute  { border-top:1px solid var(--border2); padding-top:12px; }
.pj-cp-contribute-ttl { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--text4); margin-bottom:6px; font-family:monospace; }
.pj-cp-contribute p { font-size:12px; color:var(--text3); margin-bottom:10px; line-height:1.5; }
.pj-cp-fork-btn { padding:8px; border-radius:8px; background:var(--surface2); border:1px solid var(--border); font-size:12.5px; font-weight:600; color:var(--text2); text-align:center; }
.pj-cp-body    { padding:36px 40px; background:var(--surface); border-top:1px solid var(--border2); }
.pj-cp-content { font-size:15px; line-height:1.85; color:var(--text2); }
.pj-cp-empty   { display:flex; flex-direction:column; align-items:center; gap:12px; padding:48px; color:var(--text4); text-align:center; }
.pj-cp-empty p { font-size:14px; }
.pj-cp-write-btn { padding:9px 20px; border-radius:8px; background:var(--text); color:var(--surface); border:none; font-size:13px; font-weight:600; cursor:pointer; }

/* ── Approval ── */
.pj-approval { display:flex; align-items:center; justify-content:space-between; gap:20px; padding:20px 24px; flex-wrap:wrap; background:linear-gradient(135deg,#f0fdf4,#ecfdf5); border:1.5px solid #86efac; border-radius:12px; margin-bottom:8px; }
.pj-approval-left  { display:flex; align-items:center; gap:14px; }
.pj-approval-emoji { font-size:32px; flex-shrink:0; }
.pj-approval-title { font-size:15px; font-weight:700; color:#14532d; margin-bottom:3px; }
.pj-approval-sub   { font-size:13px; color:#166534; opacity:.8; }
.pj-approval-btns  { display:flex; gap:10px; flex-shrink:0; }
.pj-approval-edit { padding:9px 16px; border-radius:8px; border:1.5px solid #86efac; background:transparent; font-size:13px; font-weight:600; color:#15803d; cursor:pointer; transition:all .15s; }
.pj-approval-edit:hover { background:#dcfce7; }
.pj-approval-ok { display:flex; align-items:center; gap:7px; padding:10px 22px; border-radius:8px; background:#16a34a; color:#fff; font-size:14px; font-weight:700; border:none; cursor:pointer; transition:all .15s; box-shadow:0 3px 12px rgba(22,163,74,.3); }
.pj-approval-ok:hover { background:#15803d; transform:translateY(-1px); }

/* ── Recap ── */
.pj-recap-layout { display:grid; grid-template-columns:260px 1fr; gap:24px; align-items:start; margin-bottom:24px; }
.pj-recap-right  { display:flex; flex-direction:column; gap:16px; }

.pj-mini-card { border:1.5px solid var(--border); border-radius:14px; overflow:hidden; }
.pj-mc-cover  { height:130px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.pj-mc-img    { width:100%; height:100%; object-fit:cover; }
.pj-mc-placeholder { display:flex; flex-direction:column; align-items:center; gap:6px; color:var(--text4); font-size:11px; }
.pj-mc-body   { padding:14px; }
.pj-mc-badges { display:flex; gap:5px; flex-wrap:wrap; margin-bottom:8px; }
.pj-mc-badge-status, .pj-mc-badge-level { padding:3px 9px; border-radius:20px; font-size:10.5px; font-weight:600; }
.pj-mc-title  { font-size:14px; font-weight:700; color:var(--text); margin-bottom:5px; }
.pj-mc-excerpt { font-size:12px; color:var(--text3); margin-bottom:8px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.pj-mc-tags   { display:flex; flex-wrap:wrap; gap:4px; margin-bottom:8px; }
.pj-mc-tag    { font-size:10.5px; padding:2px 7px; border-radius:20px; background:var(--surface2); color:var(--text3); border:1px solid var(--border); font-family:monospace; }
.pj-mc-links  { display:flex; gap:8px; font-size:11.5px; color:var(--text4); }

/* ── Checklist ── */
.pj-checklist { background:var(--surface); border:1.5px solid var(--border); border-radius:12px; padding:18px; }
.pj-cl-ttl   { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:var(--text4); margin-bottom:14px; font-family:monospace; }
.pj-cl-item  { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:8px; background:var(--surface2); margin-bottom:6px; }
.pj-cl-item.ok { background:transparent; }
.pj-cl-dot   { width:22px; height:22px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
.pj-cl-ok    { background:#dcfce7; color:#16a34a; }
.pj-cl-warn  { background:#fef9c3; color:#854d0e; }
.pj-cl-lbl   { font-size:13px; font-weight:500; color:var(--text2); flex:1; }
.pj-cl-hint  { font-size:11.5px; color:var(--text4); }
.pj-cl-fix   { font-size:12px; font-weight:600; color:var(--text); background:none; border:none; cursor:pointer; padding:3px 8px; border-radius:5px; white-space:nowrap; }
.pj-cl-fix:hover { background:var(--surface2); }
.pj-detail-tbl { background:var(--surface); border:1.5px solid var(--border); border-radius:12px; overflow:hidden; }
.pj-dt-row { display:flex; justify-content:space-between; align-items:center; padding:10px 16px; border-bottom:1px solid var(--border2); font-size:13px; }
.pj-dt-row:last-child { border-bottom:none; }
.pj-dt-k { color:var(--text4); font-weight:500; }
.pj-dt-v { color:var(--text2); font-weight:600; max-width:65%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:right; }

/* ── Nav ── */
.pj-nav { display:flex; align-items:center; justify-content:space-between; margin-top:32px; padding-top:20px; border-top:1px solid var(--border2); }
.pj-btn-bck { display:flex; align-items:center; gap:6px; padding:9px 16px; border-radius:8px; border:1.5px solid var(--border); background:var(--surface); font-size:13px; font-weight:600; color:var(--text3); cursor:pointer; transition:all .15s; }
.pj-btn-bck:hover { border-color:var(--text3); color:var(--text); }
.pj-btn-nxt { display:flex; align-items:center; gap:6px; padding:10px 20px; border-radius:8px; background:var(--text); color:var(--surface); font-size:13.5px; font-weight:700; cursor:pointer; border:none; transition:all .15s; }
.pj-btn-nxt:hover:not(:disabled) { opacity:.85; transform:translateY(-1px); box-shadow:0 4px 14px rgba(0,0,0,.15); }
.pj-btn-nxt:disabled { opacity:.3; cursor:not-allowed; }
.pj-btn-draft { display:flex; align-items:center; gap:6px; padding:9px 16px; border-radius:8px; border:1.5px solid var(--border); background:var(--surface); font-size:13px; font-weight:600; color:var(--text2); cursor:pointer; transition:all .15s; }
.pj-btn-draft:hover { border-color:var(--text3); }
.pj-btn-draft:disabled { opacity:.4; cursor:not-allowed; }
.pj-btn-publish { display:flex; align-items:center; gap:6px; padding:10px 22px; border-radius:8px; background:var(--accent,#4f46e5); color:var(--accent-fg,#fff); font-size:14px; font-weight:700; cursor:pointer; border:none; transition:all .15s; }
.pj-btn-publish:hover:not(:disabled) { opacity:.88; transform:translateY(-1px); box-shadow:0 4px 16px rgba(0,0,0,.2); }
.pj-btn-publish:disabled { opacity:.35; cursor:not-allowed; }

/* ── Prose ── */
:deep(.pj-p)  { margin:14px 0; line-height:1.9; color:var(--text2); font-size:15.5px; }
:deep(.pj-h1) { font-size:26px; font-weight:800; margin:32px 0 14px; color:var(--text); }
:deep(.pj-h2) { display:flex; align-items:center; gap:12px; font-size:20px; font-weight:700; margin:32px 0 14px; color:var(--text); }
:deep(.pj-h2n){ display:inline-flex; align-items:center; justify-content:center; min-width:28px; height:28px; padding:0 7px; background:#18181b; color:#fff; font-size:12px; font-weight:700; border-radius:7px; font-family:monospace; flex-shrink:0; }
:deep(.pj-h3) { font-size:17px; font-weight:600; margin:24px 0 10px; color:var(--text); }
:deep(.pj-ul) { padding-left:6px; margin:14px 0; list-style:none; }
:deep(.pj-ul li) { position:relative; padding-left:22px; margin:8px 0; line-height:1.8; color:var(--text2); font-size:15.5px; }
:deep(.pj-ul li::before) { content:'•'; position:absolute; left:0; color:#18181b; font-weight:900; font-size:18px; line-height:1.6; }
:deep(.pj-bq)  { border-left:4px solid #18181b; padding:12px 20px; margin:22px 0; background:var(--surface2); border-radius:0 10px 10px 0; color:var(--text3); font-style:italic; }
:deep(.pj-ic)  { background:var(--surface2); padding:2px 7px; border-radius:5px; font-family:monospace; font-size:13.5px; color:#e06c75; border:1px solid var(--border); }
:deep(.pj-code) { margin:20px 0; border-radius:12px; overflow:hidden; border:1px solid var(--border); }
:deep(.pj-code-hd) { display:flex; align-items:center; justify-content:space-between; padding:10px 16px; background:var(--surface); border-bottom:1px solid var(--border); font-size:12px; font-weight:500; color:var(--text3); font-family:monospace; }
:deep(.pj-code-copy) { width:26px; height:26px; display:flex; align-items:center; justify-content:center; border-radius:6px; border:1px solid var(--border); background:transparent; color:var(--text3); cursor:pointer; transition:all .15s; }
:deep(.pj-code-copy:hover) { background:var(--surface2); color:var(--text); }
:deep(.pj-code-copy.copied) { background:#1a7f37; color:#fff; border-color:#1a7f37; }
:deep(.pj-code pre)  { margin:0; padding:20px; overflow-x:auto; background:#0d1117; }
:deep(.pj-code code) { font-size:13.5px; line-height:1.8; font-family:monospace; }

/* ── Spinner / Toast ── */
.pj-spinner { width:13px; height:13px; border-radius:50%; border:2px solid rgba(255,255,255,.25); border-top-color:#fff; animation:spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg) } }
.pj-toast { position:fixed; bottom:24px; right:24px; background:#18181b; color:#fff; padding:12px 22px; border-radius:10px; font-size:13.5px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.25); z-index:500; }
.pj-toast.err { background:#ef4444; }
.tst-enter-active { transition:all .3s cubic-bezier(.34,1.56,.64,1); }
.tst-leave-active { transition:all .2s ease; }
.tst-enter-from, .tst-leave-to { opacity:0; transform:translateY(16px) scale(.9); }

/* ── Slide ── */
.sl-enter-active { transition:all .28s cubic-bezier(.25,.46,.45,.94); }
.sl-leave-active { transition:all .2s ease; }
.sl-enter-from   { opacity:0; transform:translateX(22px); }
.sl-leave-to     { opacity:0; transform:translateX(-22px); }

/* ── Responsive ── */
@media (max-width:900px) {
  .pj-grid { grid-template-columns:1fr; }
  .pj-col-side { order:-1; }
  .pj-editor-wrap.split { grid-template-columns:1fr; }
  .pj-preview-right { display:none; }
  .pj-cp-hero { grid-template-columns:1fr; padding:28px 24px; }
  .pj-cp-body { padding:24px; }
  .pj-recap-layout { grid-template-columns:1fr; }
}
@media (max-width:600px) {
  .pj-step-lbl, .pj-step-sub { display:none; }
  .pj-step-line { min-width:8px; margin:0 6px; }
  .pj-ptitle { font-size:17px; }
  .pj-status-row { display:none; }
  .pj-split-toggle { display:none; }
}
</style>