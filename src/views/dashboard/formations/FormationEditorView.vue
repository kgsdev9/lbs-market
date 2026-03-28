<template>
  <div class="fed">

    <!-- ══ TOP BAR ══ -->
    <div class="fed-topbar">
      <RouterLink to="/dashboard/formations" class="fed-back">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Retour
      </RouterLink>
      <div class="fed-topbar-center">
        <div class="fed-topbar-label">{{ isEdit ? 'Modifier' : 'Nouvelle formation' }}</div>
        <div class="fed-topbar-title" v-if="form.title">{{ form.title }}</div>
      </div>
      <div class="fed-topbar-actions">
        <button class="fed-btn-draft" @click="save('draft')" :disabled="saving">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Brouillon
        </button>
        <button class="fed-btn-publish" @click="save('published')" :disabled="saving || currentStep < 5">
          <span v-if="saving" class="fed-spinner"/>
          <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {{ isEdit ? 'Mettre à jour' : 'Publier' }}
        </button>
      </div>
    </div>

    <!-- ══ STEPPER ══ -->
    <div class="fed-stepper">
      <div
        v-for="(step, i) in steps" :key="i"
        class="fed-step"
        :class="{
          'is-active':    currentStep === i + 1,
          'is-done':      currentStep > i + 1,
          'is-future':    currentStep < i + 1,
        }"
        @click="currentStep > i + 1 ? currentStep = i + 1 : null"
      >
        <div class="fed-step-dot">
          <svg v-if="currentStep > i + 1" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span v-else>{{ i + 1 }}</span>
        </div>
        <div class="fed-step-text">
          <div class="fed-step-name">{{ step.name }}</div>
          <div class="fed-step-hint">{{ step.hint }}</div>
        </div>
        <div v-if="i < steps.length - 1" class="fed-step-bar" :class="{ done: currentStep > i + 1 }"/>
      </div>
    </div>

    <!-- ══ CORPS ══ -->
    <div class="fed-body">

      <!-- ─── ÉTAPE 1 — Informations ─── -->
      <Transition name="fed-slide" mode="out-in">
      <div v-if="currentStep === 1" key="s1" class="fed-pane">
        <div class="fed-pane-header">
          <div class="fed-pane-badge">01</div>
          <div>
            <div class="fed-pane-title">Informations générales</div>
            <div class="fed-pane-sub">Titre, description et paramètres de ta formation</div>
          </div>
        </div>

        <div class="fed-cols">
          <div class="fed-col-main">

            <!-- Titre + sous-titre -->
            <div class="fed-card">
              <div class="fed-card-ttl">Présentation</div>
              <div class="fed-field">
                <label class="fed-label">Titre <span class="req">*</span></label>
                <input v-model="form.title" class="fed-input fed-input-xl" placeholder="Ex: Apprendre Laravel de zéro à héros"/>
                <div class="fed-hint">Sois précis et accrocheur</div>
              </div>
              <div class="fed-field">
                <label class="fed-label">Sous-titre <span class="req">*</span></label>
                <input v-model="form.subtitle" class="fed-input" placeholder="Ex: Maîtrise Laravel en 30 jours avec des projets réels"/>
              </div>
            </div>

            <!-- Description markdown -->
            <div class="fed-card">
              <div class="fed-card-ttl">Description complète</div>
              <div class="fed-md-bar">
                <button class="fed-md-btn" @click="wrapDesc('**','**')"><b>B</b></button>
                <button class="fed-md-btn" @click="wrapDesc('*','*')"><i>I</i></button>
                <div class="fed-md-sep"/>
                <button class="fed-md-btn" @click="insertDesc('## ')">H2</button>
                <button class="fed-md-btn" @click="insertDesc('### ')">H3</button>
                <button class="fed-md-btn" @click="insertDesc('- ')">• liste</button>
                <button class="fed-md-btn" @click="insertDesc('> ')">❝</button>
                <div class="fed-md-sep"/>
                <button class="fed-md-btn" :class="{ on: showDescPreview }" @click="showDescPreview = !showDescPreview">
                  {{ showDescPreview ? '✏ Éditer' : '👁 Aperçu' }}
                </button>
              </div>
              <textarea
                v-if="!showDescPreview"
                ref="descRef"
                v-model="form.description"
                class="fed-input fed-textarea fed-md-area"
                rows="11"
                placeholder="## À propos&#10;&#10;Cette formation t'apprendra...&#10;&#10;## Ce que tu vas apprendre&#10;&#10;- Créer une API REST complète&#10;- Gérer l'authentification"
              />
              <div v-else class="fed-md-preview" v-html="renderMd(form.description)"/>
            </div>

            <!-- Objectifs -->
            <div class="fed-card">
              <div class="fed-card-ttl">Ce que l'étudiant va apprendre</div>
              <div class="fed-field" style="margin-bottom:4px">
                <div class="fed-hint">Ces points s'affichent en grand sur la page de la formation</div>
              </div>
              <div v-for="(item, i) in form.objectives" :key="i" class="fed-obj-row">
                <div class="fed-obj-check">✓</div>
                <input v-model="form.objectives[i]" class="fed-input" :placeholder="`Objectif ${i+1} — Ex: Créer une API REST complète`"/>
                <button @click="form.objectives.splice(i, 1)" class="fed-rm-btn">✕</button>
              </div>
              <button @click="form.objectives.push('')" class="fed-add-obj-btn">+ Ajouter un objectif</button>
            </div>

          </div>

          <div class="fed-col-side">

            <!-- Paramètres -->
            <div class="fed-card">
              <div class="fed-card-ttl">Paramètres</div>
              <div class="fed-field">
                <label class="fed-label">Niveau</label>
                <div class="fed-level-row">
                  <button v-for="lvl in levels" :key="lvl.value" class="fed-level-btn" :class="{ on: form.level === lvl.value }" @click="form.level = lvl.value">{{ lvl.label }}</button>
                </div>
              </div>
              <div class="fed-field">
                <label class="fed-label">Prix (FCFA)</label>
                <input v-model="form.price" class="fed-input" placeholder="0 = gratuit"/>
              </div>
              <div class="fed-field">
                <label class="fed-label">Durée estimée</label>
                <input v-model="form.duration" class="fed-input" placeholder="Ex: 12h30"/>
              </div>
              <div class="fed-field">
                <label class="fed-label">Badge</label>
                <select v-model="form.badge" class="fed-input fed-select">
                  <option value="">Aucun</option>
                  <option value="bestseller">Bestseller</option>
                  <option value="popular">Populaire</option>
                  <option value="new">Nouveau</option>
                  <option value="featured">À la une</option>
                </select>
              </div>
            </div>

            <!-- Image de couverture -->
            <div class="fed-card">
              <div class="fed-card-ttl">Image de couverture</div>
              <div
                class="fed-img-zone"
                :class="{ filled: form.image }"
                @click="$refs.imageInput.click()"
              >
                <img v-if="form.image" :src="form.image" class="fed-img-preview"/>
                <div v-else class="fed-img-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>Clique pour uploader</span>
                  <span style="font-size:10.5px;color:var(--text5)">PNG, JPG — max 2 Mo</span>
                </div>
              </div>
              <input ref="imageInput" type="file" accept="image/*" style="display:none" @change="onImageChange"/>
              <button v-if="form.image" class="fed-img-rm" @click="form.image = null">✕ Supprimer</button>
            </div>

            <!-- Couleur -->
            <div class="fed-card">
              <div class="fed-card-ttl">Couleur de couverture</div>
              <div class="fed-color-preview" :style="{ background: form.cover_color }">
                <span style="font-size:32px">🎓</span>
              </div>
              <div class="fed-color-row">
                <div v-for="c in coverColors" :key="c" class="fed-color-dot" :style="{ background: c }" :class="{ on: form.cover_color === c }" @click="form.cover_color = c"/>
              </div>
            </div>

            <!-- Tags -->
            <div class="fed-card">
              <div class="fed-card-ttl">
                Tags
                <span v-if="tagsLoading" class="fed-loading-dot"><span/><span/><span/></span>
              </div>
              <input v-model="tagSearch" class="fed-input" placeholder="Rechercher…" style="margin-bottom:10px"/>
              <div v-if="selectedTags.length" class="fed-sel-tags">
                <span v-for="tag in selectedTags" :key="tag.id" class="fed-tag-sel" @click="removeTag(tag.id)">{{ tag.name }} ×</span>
              </div>
              <div v-if="tagsLoading" class="fed-tag-skels">
                <span v-for="n in 6" :key="n" class="fed-tag-skel"/>
              </div>
              <div v-else class="fed-tag-cloud">
                <span v-for="tag in filteredAvailableTags" :key="tag.id" class="fed-tag" :class="{ on: isTagSelected(tag.id) }" @click="toggleTag(tag)">
                  {{ isTagSelected(tag.id) ? '✓' : '+' }} {{ tag.name }}
                </span>
                <span v-if="filteredAvailableTags.length === 0" style="font-size:12px;color:var(--text5)">Aucun résultat</span>
              </div>
            </div>

          </div>
        </div>

        <div class="fed-foot">
          <div/>
          <button class="fed-btn-next" :disabled="!step1Valid" @click="currentStep++">
            Suivant — Modules
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      </Transition>

      <!-- ─── ÉTAPE 2 — Modules ─── -->
      <Transition name="fed-slide" mode="out-in">
      <div v-if="currentStep === 2" key="s2" class="fed-pane">
        <div class="fed-pane-header">
          <div class="fed-pane-badge">02</div>
          <div>
            <div class="fed-pane-title">Modules de la formation</div>
            <div class="fed-pane-sub">Organise ta formation en chapitres</div>
          </div>
        </div>

        <div class="fed-modules">
          <div v-for="(mod, i) in form.modules" :key="mod.tempId" class="fed-module-card">
            <div class="fed-module-head">
              <div class="fed-module-num">{{ String(i+1).padStart(2,'0') }}</div>
              <input v-model="mod.title" class="fed-input fed-module-input" :placeholder="`Module ${i+1} — Ex: Introduction à Laravel`"/>
              <input v-model="mod.duration" class="fed-input" style="width:90px;flex-shrink:0" placeholder="Durée"/>
              <button @click="form.modules.splice(i, 1)" class="fed-rm-btn">✕</button>
            </div>
            <div class="fed-field" style="margin-top:10px;padding-left:44px">
              <label class="fed-label">Description du module</label>
              <textarea v-model="mod.description" class="fed-input" rows="2" placeholder="Ce module couvre..."/>
            </div>
          </div>
          <button @click="addModule" class="fed-add-module-btn">+ Ajouter un module</button>
        </div>

        <div class="fed-foot">
          <button class="fed-btn-back" @click="currentStep--">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <button class="fed-btn-next" :disabled="!step2Valid" @click="currentStep++">
            Suivant — Leçons
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      </Transition>

      <!-- ─── ÉTAPE 3 — Leçons ─── -->
      <Transition name="fed-slide" mode="out-in">
      <div v-if="currentStep === 3" key="s3" class="fed-pane">
        <div class="fed-pane-header">
          <div class="fed-pane-badge">03</div>
          <div>
            <div class="fed-pane-title">Leçons par module</div>
            <div class="fed-pane-sub">Ajoute les leçons dans chaque module</div>
          </div>
        </div>

        <div class="fed-mod-tabs">
          <button v-for="(mod, i) in form.modules" :key="i" class="fed-mod-tab" :class="{ on: activeModule === i }" @click="activeModule = i">
            <span class="fed-mod-tab-n">{{ String(i+1).padStart(2,'0') }}</span>
            {{ mod.title || `Module ${i+1}` }}
            <span class="fed-mod-tab-c">{{ mod.lessons?.length ?? 0 }}</span>
          </button>
        </div>

        <div v-if="form.modules[activeModule]" class="fed-lessons">
          <div v-for="(lesson, li) in form.modules[activeModule].lessons" :key="li" class="fed-lesson-card">
            <div class="fed-lesson-head">
              <div class="fed-lesson-num">{{ String(li+1).padStart(2,'0') }}</div>
              <div class="fed-lesson-types">
                <button v-for="t in lessonTypes" :key="t.value" class="fed-lesson-type" :class="{ on: lesson.type === t.value }" @click="lesson.type = t.value">{{ t.icon }} {{ t.label }}</button>
              </div>
              <button class="fed-access-pill" :class="{ free: lesson.is_free }" @click="lesson.is_free = !lesson.is_free">
                {{ lesson.is_free ? '🔓 Gratuit' : '🔒 Payant' }}
              </button>
              <button @click="form.modules[activeModule].lessons.splice(li, 1)" class="fed-rm-btn">✕</button>
            </div>
            <div class="fed-lesson-inputs">
              <input v-model="lesson.title" class="fed-input" :placeholder="`Leçon ${li+1} — Ex: Installer Laravel`" style="flex:1"/>
              <input v-model="lesson.duration" class="fed-input" style="width:90px;flex-shrink:0" placeholder="Durée"/>
            </div>
            <div class="fed-lesson-content">
              <div v-if="lesson.type === 'video' || lesson.type === 'mixed'" class="fed-field">
                <label class="fed-label">🎬 URL vidéo</label>
                <input v-model="lesson.video_url" class="fed-input" placeholder="https://youtube.com/embed/..."/>
              </div>
              <div v-if="lesson.type === 'pdf' || lesson.type === 'mixed'" class="fed-field">
                <label class="fed-label">📝 Contenu Markdown</label>
                <div class="fed-md-bar">
                  <button class="fed-md-btn" @click="wrapLesson(li,'**','**')"><b>B</b></button>
                  <button class="fed-md-btn" @click="wrapLesson(li,'*','*')"><i>I</i></button>
                  <div class="fed-md-sep"/>
                  <button class="fed-md-btn" @click="insertLesson(li,'## ')">H2</button>
                  <button class="fed-md-btn" @click="insertLesson(li,'- ')">• liste</button>
                  <button class="fed-md-btn" @click="insertCodeLesson(li,'bash')">$ bash</button>
                  <button class="fed-md-btn" @click="insertCodeLesson(li,'php')">PHP</button>
                  <button class="fed-md-btn" @click="insertCodeLesson(li,'javascript')">JS</button>
                  <div class="fed-md-sep"/>
                  <button class="fed-md-btn" :class="{ on: lesson.showPreview }" @click="lesson.showPreview = !lesson.showPreview">
                    {{ lesson.showPreview ? '✏ Éditer' : '👁 Aperçu' }}
                  </button>
                </div>
                <textarea v-if="!lesson.showPreview" :ref="el => lessonRefs[li] = el" v-model="lesson.content" class="fed-input fed-textarea fed-md-area" rows="7" placeholder="Rédigez en Markdown..."/>
                <div v-else class="fed-md-preview" v-html="renderMd(lesson.content)"/>
              </div>
            </div>
          </div>
          <button @click="addLesson" class="fed-add-module-btn">+ Ajouter une leçon au module {{ activeModule + 1 }}</button>
        </div>

        <div class="fed-foot">
          <button class="fed-btn-back" @click="currentStep--">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <button class="fed-btn-next" @click="currentStep++">
            Suivant — Aperçu
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      </Transition>

      <!-- ─── ÉTAPE 4 — PRÉVISUALISATION CLIENT ─── -->
      <Transition name="fed-slide" mode="out-in">
      <div v-if="currentStep === 4" key="s4" class="fed-pane">
        <div class="fed-pane-header">
          <div class="fed-pane-badge fed-pane-badge--eye">👁</div>
          <div>
            <div class="fed-pane-title">Aperçu client</div>
            <div class="fed-pane-sub">Tel que les visiteurs verront ta formation</div>
          </div>
          <div class="fed-live-chip"><span class="fed-live-dot"/>Vue client en direct</div>
        </div>

        <!-- ── CARTE APERÇU ── -->
        <div class="fed-preview-wrap">

          <div class="fed-preview-notice">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Mode aperçu — voici exactement ce que verront les visiteurs
          </div>

          <!-- Hero de la page formation -->
          <div class="fprev-hero" :style="{ background: `linear-gradient(135deg, ${form.cover_color}cc 0%, var(--surface) 100%)` }">
            <div class="fprev-hero-left">
              <!-- Breadcrumb -->
              <div class="fprev-bc">Formations <span>›</span> {{ levelLabel }}</div>

              <!-- Badge niveau + badge spécial -->
              <div class="fprev-badges">
                <span class="fprev-badge-level">🎓 {{ levelLabel }}</span>
                <span v-if="form.badge" class="fprev-badge-special">⭐ {{ badgeLabel }}</span>
              </div>

              <!-- Titre -->
              <h1 class="fprev-title">{{ form.title || 'Titre de la formation…' }}</h1>
              <p class="fprev-subtitle">{{ form.subtitle || 'Sous-titre…' }}</p>

              <!-- Tags -->
              <div v-if="selectedTags.length" class="fprev-tags">
                <span v-for="t in selectedTags" :key="t.id" class="fprev-tag">{{ t.name }}</span>
              </div>

              <!-- Meta stats -->
              <div class="fprev-meta">
                <span>📚 {{ form.modules.length }} module(s)</span>
                <span class="fprev-sep">·</span>
                <span>🎬 {{ totalLessons }} leçon(s)</span>
                <span class="fprev-sep">·</span>
                <span>⏱ {{ form.duration || '—' }}</span>
                <span v-if="freeLessons" class="fprev-sep">·</span>
                <span v-if="freeLessons">🔓 {{ freeLessons }} gratuite(s)</span>
              </div>
            </div>

            <!-- Carte achat -->
            <div class="fprev-buy-card">
              <div class="fprev-buy-cover" :style="{ background: form.cover_color }">
                <img v-if="form.image" :src="form.image" class="fprev-buy-img"/>
                <span v-else style="font-size:52px">🎓</span>
              </div>
              <div class="fprev-buy-body">
                <div class="fprev-price" :class="{ free: form.price == 0 }">
                  {{ form.price == 0 ? 'Gratuit' : Number(form.price).toLocaleString() + ' FCFA' }}
                </div>
                <button class="fprev-cta">
                  {{ form.price == 0 ? '🎓 S\'inscrire gratuitement' : '🛒 Acheter la formation' }}
                </button>
                <div class="fprev-includes">
                  <div class="fprev-inc-ttl">Inclus dans cette formation</div>
                  <div class="fprev-inc" v-if="form.duration"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> {{ form.duration }} de contenu</div>
                  <div class="fprev-inc"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> {{ totalLessons }} leçons</div>
                  <div class="fprev-inc"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Accès à vie</div>
                  <div class="fprev-inc"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Certificat de fin</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Objectifs -->
          <div v-if="form.objectives.filter(o => o.trim()).length" class="fprev-objectives">
            <div class="fprev-section-ttl">Ce que tu vas apprendre</div>
            <div class="fprev-obj-grid">
              <div v-for="(obj, i) in form.objectives.filter(o => o.trim())" :key="i" class="fprev-obj-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {{ obj }}
              </div>
            </div>
          </div>

          <!-- Description rendue -->
          <div class="fprev-desc-section">
            <div class="fprev-desc-tabs">
              <span class="fprev-desc-tab fprev-desc-tab--on">Description</span>
              <span class="fprev-desc-tab">Programme</span>
            </div>
            <div v-if="form.description" class="fprev-desc-body" v-html="renderMd(form.description)"/>
            <div v-else class="fprev-no-desc">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <p>Aucune description rédigée.</p>
              <button @click="currentStep = 1" class="fprev-write-btn">✏️ Aller écrire la description</button>
            </div>
          </div>

          <!-- Programme / Modules -->
          <div class="fprev-program">
            <div class="fprev-section-ttl">Programme de la formation</div>
            <div class="fprev-program-stats">{{ form.modules.length }} modules · {{ totalLessons }} leçons · {{ form.duration || '—' }}</div>
            <div v-for="(mod, i) in form.modules" :key="i" class="fprev-mod-row">
              <div class="fprev-mod-head">
                <div class="fprev-mod-left">
                  <div class="fprev-mod-num">{{ String(i+1).padStart(2,'0') }}</div>
                  <div class="fprev-mod-info">
                    <div class="fprev-mod-title">{{ mod.title || `Module ${i+1}` }}</div>
                    <div class="fprev-mod-meta">{{ mod.lessons?.length ?? 0 }} leçon(s){{ mod.duration ? ' · ' + mod.duration : '' }}</div>
                  </div>
                </div>
              </div>
              <div v-if="mod.lessons?.length" class="fprev-lessons-list">
                <div v-for="(lesson, li) in mod.lessons" :key="li" class="fprev-lesson-row">
                  <span class="fprev-lesson-ico">{{ lessonTypes.find(t => t.value === lesson.type)?.icon || '🎬' }}</span>
                  <span class="fprev-lesson-title">{{ lesson.title || `Leçon ${li+1}` }}</span>
                  <span v-if="lesson.is_free" class="fprev-lesson-free">Gratuit</span>
                  <span v-if="lesson.duration" class="fprev-lesson-dur">{{ lesson.duration }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- CTA approbation -->
        <div class="fprev-approve">
          <div class="fprev-approve-left">
            <div class="fprev-approve-ico">🤔</div>
            <div>
              <div class="fprev-approve-title">C'est ce que verront tes étudiants</div>
              <div class="fprev-approve-sub">Si tu es satisfait, continue vers le récapitulatif final.</div>
            </div>
          </div>
          <div class="fprev-approve-btns">
            <button class="fprev-btn-edit" @click="currentStep = 1">✏️ Modifier</button>
            <button class="fprev-btn-ok" @click="currentStep++">
              ✅ J'approuve — Continuer
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        <div class="fed-foot">
          <button class="fed-btn-back" @click="currentStep--">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
        </div>
      </div>
      </Transition>

      <!-- ─── ÉTAPE 5 — Récapitulatif ─── -->
      <Transition name="fed-slide" mode="out-in">
      <div v-if="currentStep === 5" key="s5" class="fed-pane">
        <div class="fed-pane-header">
          <div class="fed-pane-badge">05</div>
          <div>
            <div class="fed-pane-title">Récapitulatif final</div>
            <div class="fed-pane-sub">Vérifie tout avant de {{ isEdit ? 'mettre à jour' : 'publier' }}</div>
          </div>
        </div>

        <div class="fed-recap-grid">
          <div class="fed-card">
            <div class="fed-card-ttl">Formation <button class="fed-recap-edit" @click="currentStep=1">✏ Modifier</button></div>
            <div class="fed-recap-row"><span>Titre</span><span>{{ form.title }}</span></div>
            <div class="fed-recap-row"><span>Niveau</span><span>{{ levelLabel }}</span></div>
            <div class="fed-recap-row"><span>Prix</span><span>{{ form.price == 0 ? 'Gratuit' : Number(form.price).toLocaleString() + ' FCFA' }}</span></div>
            <div class="fed-recap-row"><span>Durée</span><span>{{ form.duration || '—' }}</span></div>
            <div class="fed-recap-row"><span>Badge</span><span>{{ badgeLabel || '—' }}</span></div>
            <div class="fed-recap-row"><span>Tags</span><span>{{ selectedTags.length ? selectedTags.map(t => t.name).join(', ') : '—' }}</span></div>
          </div>

          <div class="fed-card">
            <div class="fed-card-ttl">Structure <button class="fed-recap-edit" @click="currentStep=2">✏ Modifier</button></div>
            <div class="fed-recap-stats">
              <div class="fed-rstat"><div class="fed-rstat-n">{{ form.modules.length }}</div><div class="fed-rstat-l">Modules</div></div>
              <div class="fed-rstat"><div class="fed-rstat-n">{{ totalLessons }}</div><div class="fed-rstat-l">Leçons</div></div>
              <div class="fed-rstat"><div class="fed-rstat-n">{{ freeLessons }}</div><div class="fed-rstat-l">Gratuites</div></div>
            </div>
            <div v-for="(mod, i) in form.modules" :key="i" class="fed-recap-mod">
              <span class="fed-recap-mod-n">{{ String(i+1).padStart(2,'0') }}</span>
              <span class="fed-recap-mod-t">{{ mod.title }}</span>
              <span class="fed-recap-mod-c">{{ mod.lessons?.length ?? 0 }} leçon(s)</span>
            </div>
          </div>
        </div>

        <!-- Checklist -->
        <div class="fed-card" style="margin-top:16px">
          <div class="fed-card-ttl">Checklist avant publication</div>
          <div class="fed-checklist">
            <div v-for="c in checklist" :key="c.label" class="fed-check-row" :class="{ ok: c.valid }">
              <span class="fed-check-ico">{{ c.valid ? '✅' : '⚠️' }}</span>
              <span class="fed-check-lbl">{{ c.label }}</span>
              <span v-if="!c.valid" class="fed-check-hint">{{ c.hint }}</span>
            </div>
          </div>
        </div>

        <div class="fed-foot">
          <button class="fed-btn-back" @click="currentStep--">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <div style="display:flex;gap:10px">
            <button class="fed-btn-draft" @click="save('draft')" :disabled="saving">Brouillon</button>
            <button class="fed-btn-publish fed-btn-publish--lg" @click="save('published')" :disabled="saving">
              <span v-if="saving" class="fed-spinner"/>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ isEdit ? '💾 Mettre à jour' : '🚀 Publier la formation' }}
            </button>
          </div>
        </div>
      </div>
      </Transition>

    </div><!-- fed-body -->

    <!-- ══ TOAST ══ -->
    <Transition name="fed-toast">
      <div v-if="saved" class="fed-toast">{{ isEdit ? '✓ Formation mise à jour' : '✓ Formation sauvegardée' }}</div>
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

hljs.registerLanguage('bash',       bash)
hljs.registerLanguage('php',        php)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('html',       xml)

export default {
  name: 'FormationEditorView',
  components: { RouterLink },

  data() {
    return {
      currentStep:     1,
      activeModule:    0,
      showDescPreview: false,
      saving:          false,
      saved:           false,
      lessonRefs:      [],
      allTags:         [],
      tagSearch:       '',
      tagsLoading:     false,

      steps: [
        { name: 'Informations', hint: 'Titre & paramètres' },
        { name: 'Modules',      hint: 'Chapitres'          },
        { name: 'Leçons',       hint: 'Contenu'            },
        { name: 'Aperçu',       hint: 'Vue client'         },
        { name: 'Publication',  hint: 'Récapitulatif'      },
      ],
      levels: [
        { value: 'debutant',       label: 'Débutant'      },
        { value: 'intermediaire',  label: 'Intermédiaire' },
        { value: 'professionnel',  label: 'Professionnel' },
      ],
      coverColors: ['#dbeafe','#dcfce7','#fef9c3','#ede9fe','#ffedd5','#fee2e2','#e0f2fe','#fce7f3','#f0fdf4','#f1f5f9'],
      lessonTypes: [
        { value: 'video', icon: '🎬', label: 'Vidéo' },
        { value: 'pdf',   icon: '📄', label: 'PDF'   },
        { value: 'quiz',  icon: '📝', label: 'Quiz'  },
        { value: 'mixed', icon: '🔀', label: 'Mixte' },
      ],

      form: {
        title: '', subtitle: '', description: '',
        image: null,
        level: 'debutant', price: 0, duration: '', badge: '',
        cover_color: '#dbeafe', tags: [],
        objectives: ['', '', ''],
        modules: [{ tempId: 1, title: '', description: '', duration: '', lessons: [] }],
      },
    }
  },

  computed: {
    isEdit()    { return !!this.$route.params.id },
    levelLabel() {
      return this.levels.find(l => l.value === this.form.level)?.label || this.form.level
    },
    badgeLabel() {
      const map = { bestseller: 'Bestseller', popular: 'Populaire', new: 'Nouveau', featured: 'À la une' }
      return map[this.form.badge] || ''
    },
    step1Valid() { return this.form.title.trim().length > 3 && this.form.subtitle.trim().length > 3 && this.form.description.trim().length > 10 },
    step2Valid() { return this.form.modules.length > 0 && this.form.modules.every(m => m.title.trim().length > 0) },
    totalLessons() { return this.form.modules.reduce((a, m) => a + (m.lessons?.length ?? 0), 0) },
    freeLessons()  { return this.form.modules.reduce((a, m) => a + (m.lessons?.filter(l => l.is_free).length ?? 0), 0) },
    selectedTags() { return this.allTags.filter(t => this.form.tags.includes(t.id)) },
    filteredAvailableTags() {
      const q = this.tagSearch.trim().toLowerCase()
      return q ? this.allTags.filter(t => t.name.toLowerCase().includes(q)) : this.allTags
    },
    checklist() {
      return [
        { label: 'Titre renseigné',      valid: this.form.title.trim().length > 3,               hint: 'Ajoute un titre' },
        { label: 'Description complète', valid: this.form.description.trim().length > 50,         hint: 'Min 50 caractères' },
        { label: 'Au moins un module',   valid: this.form.modules.length > 0,                     hint: 'Ajoute un module' },
        { label: 'Au moins une leçon',   valid: this.totalLessons > 0,                            hint: 'Ajoute une leçon' },
        { label: 'Une leçon gratuite',   valid: this.freeLessons > 0,                             hint: 'Offre un aperçu gratuit' },
        { label: 'Prix défini',          valid: this.form.price !== '' && this.form.price !== null, hint: 'Définis un prix (0 = gratuit)' },
      ]
    },
  },

  async mounted() {
    await this.fetchTags()
    if (this.isEdit) this.fetchFormation()
  },

  methods: {
    async fetchTags() {
      this.tagsLoading = true
      try {
        const { data } = await API.get('/admin/tags')
        this.allTags = Array.isArray(data) ? data : (data.data || [])
      } catch(e) { console.error(e) }
      finally { this.tagsLoading = false }
    },

    async fetchFormation() {
      try {
        const { data } = await API.get(`/admin/formations/${this.$route.params.id}`)
        this.form = {
          title: data.title, subtitle: data.subtitle || '', description: data.description || '',
          level: data.level || 'debutant', price: data.price ?? 0, duration: data.duration || '',
          badge: data.badge || '', cover_color: data.cover_color || '#dbeafe',
          tags: data.tags ? data.tags.map(t => t.id) : [],
          image: data.image || null,
          objectives: data.objectives?.length ? data.objectives : ['','',''],
          modules: data.modules?.length
            ? data.modules.map((m, i) => ({
                tempId: m.id || Date.now() + i, title: m.title || '',
                description: m.description || '', duration: m.duration || '',
                lessons: (m.lessons || []).map(l => ({
                  title: l.title || '', type: l.type || 'video', duration: l.duration || '',
                  video_url: l.video_url || '', content: l.content || '',
                  is_free: l.is_free || false, showPreview: false,
                })),
              }))
            : [{ tempId: 1, title: '', description: '', duration: '', lessons: [] }],
        }
      } catch(e) { console.error(e) }
    },

    // ── Image base64 ──
    onImageChange(e) {
      const file = e.target.files[0]; if (!file) return
      const reader = new FileReader()
      reader.onload = ev => { this.form.image = ev.target.result }
      reader.readAsDataURL(file)
    },

    isTagSelected(id)  { return this.form.tags.includes(id) },
    toggleTag(tag)     { this.isTagSelected(tag.id) ? this.removeTag(tag.id) : this.form.tags.push(tag.id) },
    removeTag(id)      { this.form.tags = this.form.tags.filter(x => x !== id) },

    addModule() {
      this.form.modules.push({ tempId: Date.now(), title: '', description: '', duration: '', lessons: [] })
      this.activeModule = this.form.modules.length - 1
    },
    addLesson() {
      const mod = this.form.modules[this.activeModule]
      if (!mod) return
      if (!Array.isArray(mod.lessons)) mod.lessons = []
      mod.lessons.push({ title: '', type: 'video', duration: '', video_url: '', content: '', is_free: false, showPreview: false })
    },

    wrapDesc(b, a) {
      const el = this.$refs.descRef; if (!el) return
      const s = el.selectionStart, e = el.selectionEnd
      const sel = this.form.description.substring(s, e)
      this.form.description = this.form.description.substring(0, s) + b + sel + a + this.form.description.substring(e)
    },
    insertDesc(prefix) {
      const el = this.$refs.descRef
      const s  = el ? el.selectionStart : this.form.description.length
      this.form.description = this.form.description.substring(0, s) + '\n' + prefix + this.form.description.substring(s)
    },
    wrapLesson(li, b, a) {
      const el = this.lessonRefs[li]; if (!el) return
      const lesson = this.form.modules[this.activeModule].lessons[li]
      const s = el.selectionStart, e = el.selectionEnd
      const sel = lesson.content.substring(s, e)
      lesson.content = lesson.content.substring(0, s) + b + sel + a + lesson.content.substring(e)
    },
    insertLesson(li, prefix) {
      const lesson = this.form.modules[this.activeModule].lessons[li]
      const el = this.lessonRefs[li]
      const s  = el ? el.selectionStart : lesson.content.length
      lesson.content = lesson.content.substring(0, s) + '\n' + prefix + lesson.content.substring(s)
    },
    insertCodeLesson(li, lang) {
      const lesson = this.form.modules[this.activeModule].lessons[li]
      lesson.content += `\n\`\`\`${lang}\n\n\`\`\`\n`
    },

    renderMd(md) {
      if (!md) return '<p style="color:#aaa;font-style:italic">Aperçu ici…</p>'
      md = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        const l = lang || 'plaintext'; let h
        try { h = hljs.highlight(code.trimEnd(), { language: l }).value }
        catch { h = code.trimEnd().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
        return `<pre style="margin:12px 0;border-radius:8px;overflow:hidden"><code class="hljs language-${l}" style="display:block;padding:14px;font-size:12.5px;line-height:1.7;background:#0d1117;font-family:monospace">${h}</code></pre>`
      })
      let n = 0
      md = md.replace(/^## (.+)$/gm, (_, t) => { n++; return `<h2 style="font-size:17px;font-weight:700;margin:18px 0 10px;color:var(--text);display:flex;align-items:center;gap:8px"><span style="display:inline-flex;align-items:center;justify-content:center;min-width:24px;height:24px;padding:0 5px;background:#18181b;color:#fff;font-size:11px;font-weight:700;border-radius:5px;font-family:monospace">${n}</span>${t}</h2>` })
      md = md.replace(/^### (.+)$/gm,'<h3 style="font-size:14px;font-weight:600;margin:14px 0 7px;color:var(--text)">$1</h3>')
      md = md.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      md = md.replace(/\*(.+?)\*/g,'<em>$1</em>')
      md = md.replace(/`([^`]+)`/g,'<code style="background:var(--surface2);padding:2px 5px;border-radius:4px;font-family:monospace;font-size:12.5px;color:#e06c75">$1</code>')
      md = md.replace(/^> (.+)$/gm,'<blockquote style="border-left:3px solid var(--border);padding:8px 14px;margin:12px 0;background:var(--surface2);border-radius:0 6px 6px 0;color:var(--text3);font-style:italic">$1</blockquote>')
      md = md.replace(/^- (.+)$/gm,'<li style="margin:5px 0;color:var(--text2);padding-left:4px">$1</li>')
      md = md.replace(/(<li[\s\S]*?<\/li>\n?)+/g, s => `<ul style="padding-left:14px;margin:10px 0;list-style:disc">${s}</ul>`)
      md = md.replace(/\n\n(?!<)/g,'</p><p style="margin:8px 0;color:var(--text2);line-height:1.8">')
      return '<p style="margin:8px 0;color:var(--text2);line-height:1.8">' + md + '</p>'
    },

    async save(status) {
      this.saving = true
      try {
        const payload = {
          title: this.form.title, subtitle: this.form.subtitle, description: this.form.description,
          image: this.form.image || null,
          level: this.form.level, price: this.form.price, duration: this.form.duration,
          badge: this.form.badge, cover_color: this.form.cover_color,
          tags: this.form.tags, objectives: this.form.objectives.filter(o => o.trim()),
          modules: this.form.modules, status,
        }
        const url    = this.isEdit ? `/admin/formations/${this.$route.params.id}` : '/admin/formations'
        const method = this.isEdit ? 'put' : 'post'
        await API[method](url, payload)
        this.saved = true
        setTimeout(() => { this.saved = false }, 2500)
        if (status === 'published' || this.isEdit) this.$router.push('/dashboard/formations')
      } catch(e) {
        console.error(e.response?.data || e.message)
        if (e.response?.status === 422) alert('Erreurs :\n' + Object.values(e.response.data.errors).flat().join('\n'))
      } finally { this.saving = false }
    },
  },
}
</script>

<style src="highlight.js/styles/github-dark.css" />

<style scoped>
/* ══ SHELL ══ */
.fed { padding-bottom: 60px; min-height: 100vh; }

/* ══ TOPBAR ══ */
.fed-topbar { display:flex; align-items:center; gap:14px; padding:14px 0 22px; border-bottom:1px solid var(--border); margin-bottom:0; flex-wrap:wrap; }
.fed-back { display:flex; align-items:center; gap:5px; font-size:13px; font-weight:500; color:var(--text3); text-decoration:none; padding:6px 10px; border-radius:7px; transition:all .15s; flex-shrink:0; }
.fed-back:hover { background:var(--surface2); color:var(--text); }
.fed-topbar-center { flex:1; min-width:0; }
.fed-topbar-label  { font-size:12px; font-weight:600; color:var(--text4); text-transform:uppercase; letter-spacing:.5px; font-family:monospace; }
.fed-topbar-title  { font-size:15px; font-weight:700; color:var(--text); margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.fed-topbar-actions { display:flex; gap:8px; flex-shrink:0; }

.fed-btn-draft {
  display:flex; align-items:center; gap:6px; padding:8px 14px;
  border:1.5px solid var(--border); border-radius:8px;
  background:var(--surface); color:var(--text2);
  font-size:13px; font-weight:600; cursor:pointer; transition:all .15s;
}
.fed-btn-draft:hover:not(:disabled) { border-color:var(--text3); }
.fed-btn-draft:disabled { opacity:.4; cursor:not-allowed; }

.fed-btn-publish {
  display:flex; align-items:center; gap:6px; padding:8px 18px;
  border-radius:8px; background:var(--text); color:var(--surface);
  font-size:13px; font-weight:700; cursor:pointer; border:none; transition:all .15s;
}
.fed-btn-publish--lg { padding:10px 24px; font-size:14px; }
.fed-btn-publish:hover:not(:disabled) { opacity:.85; transform:translateY(-1px); }
.fed-btn-publish:disabled { opacity:.3; cursor:not-allowed; }
.fed-spinner { width:13px; height:13px; border-radius:50%; border:2px solid rgba(255,255,255,.25); border-top-color:#fff; animation:spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg) } }

/* ══ STEPPER ══ */
.fed-stepper { display:flex; align-items:center; padding:24px 0 28px; border-bottom:1px solid var(--border2); margin-bottom:36px; }
.fed-step { display:flex; align-items:center; gap:10px; }
.fed-step.is-future { opacity:.4; cursor:default; }
.fed-step.is-done, .fed-step.is-active { cursor:pointer; }
.fed-step-dot {
  width:34px; height:34px; border-radius:50%; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:700; font-family:monospace;
  border:2px solid var(--border); background:var(--surface); color:var(--text3);
  transition:all .2s;
}
.fed-step.is-active .fed-step-dot { background:var(--text); color:var(--surface); border-color:var(--text); }
.fed-step.is-done   .fed-step-dot { background:#16a34a; color:#fff; border-color:#16a34a; }
.fed-step-name { font-size:13px; font-weight:600; color:var(--text3); white-space:nowrap; }
.fed-step-hint { font-size:11px; color:var(--text5); white-space:nowrap; }
.fed-step.is-active .fed-step-name { color:var(--text); font-weight:700; }
.fed-step.is-done   .fed-step-name { color:#16a34a; }
.fed-step-bar { flex:1; height:2px; background:var(--border2); margin:0 14px; min-width:18px; transition:background .3s; }
.fed-step-bar.done { background:#16a34a; }

/* ══ PANE ══ */
.fed-pane-header { display:flex; align-items:center; gap:18px; margin-bottom:32px; }
.fed-pane-badge {
  width:50px; height:50px; border-radius:13px;
  background:var(--text); color:var(--surface);
  display:flex; align-items:center; justify-content:center;
  font-size:18px; font-weight:800; font-family:monospace; flex-shrink:0;
}
.fed-pane-badge--eye { background:linear-gradient(135deg,#4f46e5,#7c3aed); }
.fed-pane-title { font-size:21px; font-weight:800; color:var(--text); margin-bottom:3px; }
.fed-pane-sub   { font-size:13.5px; color:var(--text3); }
.fed-live-chip  { display:flex; align-items:center; gap:6px; margin-left:auto; padding:6px 12px; border-radius:20px; background:#dcfce7; color:#15803d; font-size:11.5px; font-weight:700; font-family:monospace; }
.fed-live-dot   { width:7px; height:7px; border-radius:50%; background:#16a34a; animation:blink 1.5s ease-in-out infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

/* ══ LAYOUT COLS ══ */
.fed-cols    { display:grid; grid-template-columns:1fr 276px; gap:22px; align-items:start; }
.fed-col-main { display:flex; flex-direction:column; gap:18px; }
.fed-col-side { display:flex; flex-direction:column; gap:14px; }

/* ══ CARDS ══ */
.fed-card { background:var(--surface); border:1.5px solid var(--border); border-radius:14px; padding:20px 22px; display:flex; flex-direction:column; gap:14px; }
.fed-card-ttl { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:var(--text4); font-family:monospace; display:flex; align-items:center; justify-content:space-between; }

/* ══ FIELDS ══ */
.fed-field { display:flex; flex-direction:column; gap:6px; }
.fed-label { font-size:11.5px; font-weight:700; color:var(--text3); text-transform:uppercase; letter-spacing:.4px; font-family:monospace; }
.req { color:#ef4444; }
.fed-input { padding:9px 12px; border:1.5px solid var(--border); border-radius:8px; background:var(--surface); color:var(--text); font-size:13.5px; font-family:inherit; width:100%; transition:all .18s; }
.fed-input:focus { outline:none; border-color:var(--text); box-shadow:0 0 0 3px rgba(0,0,0,.05); }
.fed-input-xl   { font-size:16px; font-weight:700; padding:11px 13px; }
.fed-textarea   { resize:vertical; min-height:80px; }
.fed-select     { cursor:pointer; }
.fed-hint { font-size:12px; color:var(--text5); }

/* ══ MARKDOWN ══ */
.fed-md-bar { display:flex; align-items:center; gap:2px; flex-wrap:wrap; padding:6px 10px; background:var(--surface2); border:1.5px solid var(--border); border-bottom:none; border-radius:8px 8px 0 0; }
.fed-md-btn { padding:0 7px; height:26px; border:none; background:none; color:var(--text3); border-radius:4px; cursor:pointer; font-size:11.5px; font-weight:700; font-family:monospace; transition:all .1s; }
.fed-md-btn:hover { background:var(--surface); color:var(--text); }
.fed-md-btn.on   { background:var(--text); color:var(--surface); }
.fed-md-sep { width:1px; height:16px; background:var(--border); margin:0 3px; }
.fed-md-area { border-radius:0 0 8px 8px !important; border-top-left-radius:0 !important; border-top-right-radius:0 !important; font-family:monospace !important; font-size:13px !important; line-height:1.8 !important; min-height:220px; }
.fed-md-preview { border:1.5px solid var(--border); border-radius:0 0 8px 8px; padding:16px; min-height:220px; background:var(--surface); font-size:14px; line-height:1.8; }

/* ══ OBJECTIFS ══ */
.fed-obj-row { display:flex; align-items:center; gap:8px; margin-bottom:7px; }
.fed-obj-check { color:#16a34a; font-weight:700; font-size:15px; flex-shrink:0; }
.fed-rm-btn { background:none; border:none; color:var(--text4); cursor:pointer; font-size:14px; padding:4px 6px; border-radius:5px; transition:all .12s; flex-shrink:0; }
.fed-rm-btn:hover { background:var(--surface2); color:#ef4444; }
.fed-add-obj-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 12px; border:1.5px dashed var(--border); border-radius:7px; background:none; color:var(--text4); font-size:12.5px; cursor:pointer; transition:all .15s; margin-top:4px; }
.fed-add-obj-btn:hover { border-color:var(--text3); color:var(--text); }

/* ══ NIVEAU ══ */
.fed-level-row { display:flex; gap:6px; }
.fed-level-btn { flex:1; padding:6px 4px; border:1.5px solid var(--border); border-radius:7px; background:var(--surface); color:var(--text3); font-size:12px; font-weight:500; cursor:pointer; transition:all .15s; }
.fed-level-btn.on { background:var(--text); color:var(--surface); border-color:var(--text); }

/* ══ IMAGE UPLOAD ══ */
.fed-img-zone { width:100%; height:120px; border:2px dashed var(--border); border-radius:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; overflow:hidden; transition:border-color .2s; background:var(--surface2); }
.fed-img-zone:hover { border-color:var(--text3); }
.fed-img-zone.filled { border-style:solid; padding:0; }
.fed-img-preview  { width:100%; height:100%; object-fit:cover; }
.fed-img-placeholder { display:flex; flex-direction:column; align-items:center; gap:6px; color:var(--text4); font-size:12px; text-align:center; padding:12px; }
.fed-img-rm { margin-top:6px; font-size:12px; color:var(--text4); background:none; border:none; cursor:pointer; }
.fed-img-rm:hover { color:#ef4444; }

/* ══ COULEURS ══ */
.fed-color-preview { height:56px; border-radius:9px; display:flex; align-items:center; justify-content:center; transition:background .2s; }
.fed-color-row { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
.fed-color-dot { width:22px; height:22px; border-radius:50%; cursor:pointer; border:2px solid transparent; transition:all .12s; }
.fed-color-dot.on { border-color:var(--text); transform:scale(1.2); }

/* ══ TAGS ══ */
.fed-sel-tags { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:8px; }
.fed-tag-sel  { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:20px; background:var(--text); color:var(--surface); font-size:11px; font-weight:600; cursor:pointer; }
.fed-tag-sel:hover { opacity:.8; }
.fed-tag-cloud { display:flex; flex-wrap:wrap; gap:5px; }
.fed-tag { display:inline-flex; align-items:center; padding:3px 9px; border-radius:20px; background:var(--surface2); color:var(--text3); border:1px solid var(--border); font-size:11px; font-weight:500; cursor:pointer; transition:all .12s; }
.fed-tag:hover { border-color:var(--text3); color:var(--text); }
.fed-tag.on    { background:var(--text); color:var(--surface); border-color:var(--text); }
.fed-tag-skels { display:flex; flex-wrap:wrap; gap:5px; }
.fed-tag-skel  { height:25px; width:60px; border-radius:20px; background:var(--surface2); animation:pulse .9s ease-in-out infinite alternate; }
@keyframes pulse { from{opacity:.5} to{opacity:1} }
.fed-loading-dot { display:inline-flex; gap:3px; align-items:center; }
.fed-loading-dot span { width:4px; height:4px; border-radius:50%; background:var(--text5); animation:ldot 1.2s infinite; }
.fed-loading-dot span:nth-child(2){animation-delay:.2s}
.fed-loading-dot span:nth-child(3){animation-delay:.4s}
@keyframes ldot { 0%,100%{opacity:.2} 50%{opacity:1} }

/* ══ MODULES ══ */
.fed-modules       { display:flex; flex-direction:column; gap:10px; }
.fed-module-card   { background:var(--surface); border:1.5px solid var(--border); border-radius:12px; padding:16px 18px; }
.fed-module-head   { display:flex; align-items:center; gap:10px; }
.fed-module-num    { width:30px; height:30px; border-radius:50%; background:var(--surface2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:var(--text3); font-family:monospace; flex-shrink:0; }
.fed-module-input  { flex:1; }
.fed-add-module-btn { display:flex; align-items:center; justify-content:center; gap:6px; padding:10px; border:1.5px dashed var(--border); border-radius:10px; background:none; color:var(--text4); font-size:13px; cursor:pointer; transition:all .15s; margin-top:4px; }
.fed-add-module-btn:hover { border-color:var(--text3); color:var(--text); background:var(--surface2); }

/* ══ MODULE TABS ══ */
.fed-mod-tabs { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:20px; }
.fed-mod-tab  { display:flex; align-items:center; gap:7px; padding:8px 14px; border-radius:8px; border:1.5px solid var(--border); background:var(--surface); color:var(--text3); cursor:pointer; font-size:13px; font-weight:500; transition:all .15s; }
.fed-mod-tab.on { background:var(--text); color:var(--surface); border-color:var(--text); }
.fed-mod-tab-n  { font-family:monospace; font-size:11px; font-weight:700; }
.fed-mod-tab-c  { font-size:11px; opacity:.7; background:rgba(255,255,255,.15); padding:1px 6px; border-radius:20px; }
.fed-mod-tab:not(.on) .fed-mod-tab-c { background:var(--surface2); color:var(--text4); }

/* ══ LEÇONS ══ */
.fed-lessons      { display:flex; flex-direction:column; gap:12px; }
.fed-lesson-card  { background:var(--surface); border:1.5px solid var(--border); border-radius:12px; padding:16px 18px; }
.fed-lesson-head  { display:flex; align-items:center; gap:8px; margin-bottom:12px; flex-wrap:wrap; }
.fed-lesson-num   { width:27px; height:27px; border-radius:50%; background:var(--surface2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:var(--text3); font-family:monospace; flex-shrink:0; }
.fed-lesson-types { display:flex; gap:4px; flex-wrap:wrap; }
.fed-lesson-type  { padding:4px 9px; border-radius:20px; border:1.5px solid var(--border); background:var(--surface); color:var(--text3); cursor:pointer; font-size:11.5px; font-weight:500; transition:all .15s; }
.fed-lesson-type.on { background:var(--text); color:var(--surface); border-color:var(--text); }
.fed-access-pill  { padding:4px 10px; border-radius:20px; border:1.5px solid var(--border); background:var(--surface); color:var(--text4); cursor:pointer; font-size:11.5px; font-weight:500; transition:all .15s; }
.fed-access-pill.free { background:#dcfce7; color:#15803d; border-color:#86efac; }
.fed-lesson-inputs { display:flex; gap:8px; margin-bottom:12px; }
.fed-lesson-content { display:flex; flex-direction:column; gap:12px; }

/* ══ PRÉVISUALISATION ══ */
.fed-preview-wrap { border:1.5px solid var(--border); border-radius:16px; overflow:hidden; margin-bottom:24px; box-shadow:0 4px 24px rgba(0,0,0,.06); }
.fed-preview-notice { display:flex; align-items:center; gap:8px; padding:10px 20px; background:#fffbeb; border-bottom:1px solid #fde68a; font-size:12.5px; font-weight:600; color:#92400e; }

/* Hero formation */
.fprev-hero { display:grid; grid-template-columns:1fr 290px; gap:32px; padding:40px; align-items:start; }
.fprev-bc   { font-size:12px; color:var(--text4); margin-bottom:14px; }
.fprev-bc span { margin:0 4px; opacity:.5; }
.fprev-badges { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px; }
.fprev-badge-level   { display:inline-flex; align-items:center; gap:5px; padding:4px 12px; border-radius:20px; font-size:11.5px; font-weight:600; background:rgba(0,0,0,.07); color:var(--text2); font-family:monospace; }
.fprev-badge-special { padding:4px 12px; border-radius:20px; font-size:11.5px; font-weight:600; background:#fef9c3; color:#854d0e; }
.fprev-title    { font-size:clamp(20px,3vw,32px); font-weight:800; color:var(--text); letter-spacing:-.6px; line-height:1.2; margin-bottom:10px; }
.fprev-subtitle { font-size:15px; color:var(--text3); line-height:1.7; margin-bottom:14px; }
.fprev-tags  { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; }
.fprev-tag   { padding:4px 10px; border-radius:6px; font-size:11.5px; font-weight:600; background:rgba(0,0,0,.07); color:var(--text2); }
.fprev-meta  { display:flex; align-items:center; gap:8px; font-size:12.5px; color:var(--text4); flex-wrap:wrap; }
.fprev-sep   { opacity:.4; }

/* Carte achat */
.fprev-buy-card  { background:var(--surface); border:1.5px solid var(--border); border-radius:14px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.08); }
.fprev-buy-cover { height:150px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.fprev-buy-img   { width:100%; height:100%; object-fit:cover; }
.fprev-buy-body  { padding:18px; }
.fprev-price     { font-size:26px; font-weight:800; color:var(--text); margin-bottom:14px; font-family:monospace; }
.fprev-price.free { color:#16a34a; }
.fprev-cta { width:100%; padding:12px; border-radius:9px; background:var(--text); color:var(--surface); font-size:13.5px; font-weight:700; border:none; cursor:default; margin-bottom:16px; display:block; text-align:center; }
.fprev-includes   { border-top:1px solid var(--border2); padding-top:14px; }
.fprev-inc-ttl    { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--text4); margin-bottom:10px; font-family:monospace; }
.fprev-inc        { display:flex; align-items:center; gap:6px; font-size:12.5px; color:var(--text2); margin-bottom:7px; }

/* Objectifs */
.fprev-objectives { padding:32px 40px; background:var(--surface2); border-top:1px solid var(--border2); }
.fprev-section-ttl { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--text4); margin-bottom:16px; font-family:monospace; }
.fprev-obj-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.fprev-obj-item { display:flex; align-items:center; gap:8px; font-size:13.5px; color:var(--text2); }

/* Description */
.fprev-desc-section { padding:32px 40px; background:var(--surface); border-top:1px solid var(--border2); }
.fprev-desc-tabs    { display:flex; gap:0; border-bottom:1px solid var(--border); margin-bottom:24px; }
.fprev-desc-tab     { padding:10px 20px; font-size:13.5px; font-weight:600; color:var(--text3); border-bottom:2px solid transparent; margin-bottom:-1px; }
.fprev-desc-tab--on { color:var(--accent,#4f46e5); border-bottom-color:var(--accent,#4f46e5); }
.fprev-desc-body    { font-size:14.5px; line-height:1.85; color:var(--text2); }
.fprev-no-desc      { display:flex; flex-direction:column; align-items:center; gap:12px; padding:40px; color:var(--text4); text-align:center; }
.fprev-no-desc p    { font-size:14px; }
.fprev-write-btn    { padding:8px 18px; border-radius:8px; background:var(--text); color:var(--surface); border:none; font-size:13px; font-weight:600; cursor:pointer; }

/* Programme */
.fprev-program { padding:32px 40px; border-top:1px solid var(--border2); background:var(--surface); }
.fprev-program-stats { font-size:13px; color:var(--text4); margin-bottom:20px; }
.fprev-mod-row  { border:1.5px solid var(--border); border-radius:12px; overflow:hidden; margin-bottom:10px; }
.fprev-mod-head { padding:14px 18px; background:var(--surface2); }
.fprev-mod-left { display:flex; align-items:center; gap:12px; }
.fprev-mod-num  { width:32px; height:32px; border-radius:8px; background:var(--text); color:var(--surface); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; font-family:monospace; flex-shrink:0; }
.fprev-mod-title { font-size:14px; font-weight:700; color:var(--text); }
.fprev-mod-meta  { font-size:12px; color:var(--text4); margin-top:2px; }
.fprev-lessons-list { padding:8px 18px; }
.fprev-lesson-row   { display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid var(--border2); font-size:13px; }
.fprev-lesson-row:last-child { border-bottom:none; }
.fprev-lesson-ico   { font-size:14px; flex-shrink:0; }
.fprev-lesson-title { flex:1; color:var(--text2); }
.fprev-lesson-free  { padding:2px 8px; border-radius:20px; background:#dcfce7; color:#15803d; font-size:11px; font-weight:600; }
.fprev-lesson-dur   { font-size:12px; color:var(--text4); }

/* Approbation */
.fprev-approve { display:flex; align-items:center; justify-content:space-between; gap:20px; padding:20px 24px; flex-wrap:wrap; background:linear-gradient(135deg,#f0fdf4,#ecfdf5); border:1.5px solid #86efac; border-radius:12px; margin-bottom:8px; }
.fprev-approve-left  { display:flex; align-items:center; gap:14px; }
.fprev-approve-ico   { font-size:32px; flex-shrink:0; }
.fprev-approve-title { font-size:15px; font-weight:700; color:#14532d; margin-bottom:3px; }
.fprev-approve-sub   { font-size:13px; color:#166534; opacity:.8; }
.fprev-approve-btns  { display:flex; gap:10px; flex-shrink:0; }
.fprev-btn-edit { padding:9px 16px; border-radius:8px; border:1.5px solid #86efac; background:transparent; font-size:13px; font-weight:600; color:#15803d; cursor:pointer; transition:all .15s; }
.fprev-btn-edit:hover { background:#dcfce7; }
.fprev-btn-ok   { display:flex; align-items:center; gap:7px; padding:10px 20px; border-radius:8px; background:#16a34a; color:#fff; font-size:14px; font-weight:700; border:none; cursor:pointer; transition:all .15s; box-shadow:0 3px 12px rgba(22,163,74,.3); }
.fprev-btn-ok:hover { background:#15803d; transform:translateY(-1px); }

/* ══ RÉCAPITULATIF ══ */
.fed-recap-grid  { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.fed-recap-edit  { font-size:11px; font-weight:600; color:var(--text4); background:none; border:none; cursor:pointer; padding:2px 8px; border-radius:5px; }
.fed-recap-edit:hover { background:var(--surface2); color:var(--text); }
.fed-recap-row   { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border2); font-size:13px; }
.fed-recap-row span:first-child { color:var(--text4); }
.fed-recap-row span:last-child  { color:var(--text); font-weight:500; max-width:60%; text-align:right; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.fed-recap-stats { display:flex; gap:20px; margin-bottom:14px; }
.fed-rstat       { text-align:center; }
.fed-rstat-n     { font-size:28px; font-weight:800; color:var(--text); font-family:monospace; }
.fed-rstat-l     { font-size:12px; color:var(--text4); }
.fed-recap-mod   { display:flex; align-items:center; gap:8px; padding:7px 0; border-bottom:1px solid var(--border2); font-size:13px; }
.fed-recap-mod-n { font-family:monospace; font-size:11px; color:var(--text4); flex-shrink:0; }
.fed-recap-mod-t { flex:1; color:var(--text2); font-weight:500; }
.fed-recap-mod-c { font-size:11px; color:var(--text4); }

/* ══ CHECKLIST ══ */
.fed-checklist  { display:flex; flex-direction:column; gap:9px; }
.fed-check-row  { display:flex; align-items:center; gap:10px; font-size:13.5px; color:var(--text3); }
.fed-check-row.ok { color:var(--text2); }
.fed-check-ico  { font-size:16px; flex-shrink:0; }
.fed-check-lbl  { font-weight:500; flex:1; }
.fed-check-hint { font-size:12px; color:var(--text4); }

/* ══ NAV PIED ══ */
.fed-foot { display:flex; align-items:center; justify-content:space-between; margin-top:36px; padding-top:20px; border-top:1px solid var(--border2); }
.fed-btn-back { display:flex; align-items:center; gap:6px; padding:9px 16px; border-radius:8px; border:1.5px solid var(--border); background:var(--surface); color:var(--text3); font-size:13px; font-weight:600; cursor:pointer; transition:all .15s; }
.fed-btn-back:hover { border-color:var(--text3); color:var(--text); }
.fed-btn-next { display:flex; align-items:center; gap:6px; padding:10px 20px; border-radius:8px; background:var(--text); color:var(--surface); font-size:13.5px; font-weight:700; cursor:pointer; border:none; transition:all .15s; }
.fed-btn-next:hover:not(:disabled) { opacity:.85; transform:translateY(-1px); box-shadow:0 4px 14px rgba(0,0,0,.15); }
.fed-btn-next:disabled { opacity:.3; cursor:not-allowed; }

/* ══ TOAST ══ */
.fed-toast { position:fixed; bottom:24px; right:24px; background:#18181b; color:#fff; padding:12px 22px; border-radius:10px; font-size:13.5px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.25); z-index:500; }
.fed-toast-enter-active { transition:all .3s cubic-bezier(.34,1.56,.64,1); }
.fed-toast-leave-active { transition:all .2s ease; }
.fed-toast-enter-from, .fed-toast-leave-to { opacity:0; transform:translateY(16px) scale(.9); }

/* ══ SLIDE TRANSITION ══ */
.fed-slide-enter-active { transition:all .28s cubic-bezier(.25,.46,.45,.94); }
.fed-slide-leave-active { transition:all .2s ease; }
.fed-slide-enter-from   { opacity:0; transform:translateX(20px); }
.fed-slide-leave-to     { opacity:0; transform:translateX(-20px); }

/* ══ RESPONSIVE ══ */
@media (max-width:900px) {
  .fed-cols        { grid-template-columns:1fr; }
  .fed-col-side    { order:-1; }
  .fed-recap-grid  { grid-template-columns:1fr; }
  .fprev-hero      { grid-template-columns:1fr; padding:28px 24px; }
  .fprev-objectives, .fprev-desc-section, .fprev-program { padding:24px; }
  .fprev-obj-grid  { grid-template-columns:1fr; }
}
@media (max-width:600px) {
  .fed-step-text   { display:none; }
  .fed-step-bar    { min-width:8px; margin:0 8px; }
  .fed-topbar-label { display:none; }
  .fprev-hero      { padding:20px 16px; }
}
</style>