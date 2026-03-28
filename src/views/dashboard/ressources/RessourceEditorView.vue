<template>
  <div class="res-editor">

    <!-- ══ TOP BAR ══ -->
    <div class="topbar">
      <RouterLink to="/dashboard/ressources" class="back-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Retour
      </RouterLink>
      <div class="topbar-center">
        <div class="topbar-title">{{ isEdit ? 'Modifier la ressource' : 'Nouvelle ressource' }}</div>
        <div class="topbar-draft" v-if="form.title">{{ form.title }}</div>
      </div>
      <div class="topbar-actions">
        <button class="btn-save-draft" @click="doSave('pending')" :disabled="saving">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Brouillon
        </button>
        <button class="btn-publish" @click="doSave(form.status)" :disabled="saving || currentStep < 4">
          <span v-if="saving" class="spinner"/>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {{ isEdit ? 'Mettre à jour' : 'Publier' }}
        </button>
      </div>
    </div>

    <!-- ══ STEPPER ══ -->
    <div class="stepper-wrap">
      <div class="stepper">
        <template v-for="(step, i) in steps" :key="i">
          <div
            class="step"
            :class="{
              'step--active': currentStep === i + 1,
              'step--done':   currentStep > i + 1,
              'step--future': currentStep < i + 1,
            }"
            @click="currentStep > i + 1 ? currentStep = i + 1 : null"
          >
            <div class="step-circle">
              <svg v-if="currentStep > i + 1" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span v-else>{{ i + 1 }}</span>
            </div>
            <div class="step-info">
              <div class="step-label">{{ step.label }}</div>
              <div class="step-sub">{{ step.sub }}</div>
            </div>
          </div>
          <div v-if="i < steps.length - 1" class="step-connector" :class="{ 'step-connector--done': currentStep > i + 1 }"/>
        </template>
      </div>
    </div>

    <!-- ══ CONTENT ══ -->
    <div class="editor-body">

      <!-- ─── ÉTAPE 1 — Informations ─── -->
      <Transition name="slide" mode="out-in">
      <div v-if="currentStep === 1" key="s1" class="step-pane">
        <div class="step-hd">
          <div class="step-badge">01</div>
          <div>
            <h2 class="step-title">Informations de base</h2>
            <p class="step-sub2">Donne un nom et un type à ta ressource</p>
          </div>
        </div>

        <div class="dual-col">
          <div class="col-main">

            <div class="fld">
              <label class="fld-lbl">Titre <span class="req">*</span></label>
              <input v-model="form.title" class="fld-inp fld-inp--lg" placeholder="Ex: Dashboard Analytics Vue 3 + TailwindCSS"/>
              <span class="fld-hint">Sois précis et accrocheur — c'est le premier élément vu</span>
            </div>

            <div class="fld">
              <label class="fld-lbl">Description courte</label>
              <textarea v-model="form.short_description" class="fld-inp fld-textarea" rows="3" placeholder="Un résumé de 1-2 phrases affiché dans les listes..."/>
              <div class="fld-hint-row">
                <span>Affiché dans les aperçus et cartes</span>
                <span :class="{ 'c-red': form.short_description.length > 280 }">{{ form.short_description.length }}/300</span>
              </div>
            </div>

            <div class="fld">
              <label class="fld-lbl">Liens externes</label>
              <div class="links-stack">
                <div class="link-row">
                  <span class="link-ico">🐙</span>
                  <input v-model="form.github_link" class="fld-inp" placeholder="https://github.com/..."/>
                </div>
                <div class="link-row">
                  <span class="link-ico">🌐</span>
                  <input v-model="form.demo_link" class="fld-inp" placeholder="https://demo.exemple.com"/>
                </div>
              </div>
            </div>

          </div>

          <div class="col-side">
            <div class="side-box">
              <div class="side-box-ttl">Type de ressource</div>
              <div class="type-grid">
                <button v-for="t in types" :key="t.value" class="type-tile" :class="{ 'type-tile--on': form.type === t.value }" @click="form.type = t.value">
                  <span class="type-ico">{{ t.icon }}</span>
                  <span class="type-nm">{{ t.label }}</span>
                </button>
              </div>
            </div>

            <div class="side-box">
              <div class="side-box-ttl">Couleur de fond</div>
              <div class="clr-preview" :style="{ background: form.cover_color }">
                <span style="font-size:34px">{{ currentType?.icon || '📦' }}</span>
              </div>
              <div class="clr-row">
                <div v-for="c in coverColors" :key="c" class="clr-dot" :style="{ background: c }" :class="{ 'clr-dot--on': form.cover_color === c }" @click="form.cover_color = c"/>
              </div>
            </div>
          </div>
        </div>

        <div class="step-foot">
          <div/>
          <button class="btn-nxt" @click="currentStep++" :disabled="!step1Valid">
            Suivant — Fichier & Prix
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      </Transition>

      <!-- ─── ÉTAPE 2 — Fichier & Prix ─── -->
      <Transition name="slide" mode="out-in">
      <div v-if="currentStep === 2" key="s2" class="step-pane">
        <div class="step-hd">
          <div class="step-badge">02</div>
          <div>
            <h2 class="step-title">Fichier & Prix</h2>
            <p class="step-sub2">Upload le fichier principal et définis le prix</p>
          </div>
        </div>

        <div class="dual-col">
          <div class="col-main">

            <div class="fld">
              <label class="fld-lbl">Fichier principal <span class="req">*</span></label>

              <div v-if="existingFile && !newFile" class="exist-file">
                <div class="ef-ico">📦</div>
                <div class="ef-info">
                  <div class="ef-name">{{ existingFileName }}</div>
                  <div class="ef-meta">Fichier actuel</div>
                </div>
                <button class="ef-btn" @click="existingFile = null">Remplacer</button>
              </div>

              <div v-else class="drop-zone" :class="{ 'drop-zone--drag': fileDragging, 'drop-zone--ok': newFile }"
                @click="$refs.fileInput.click()"
                @dragover.prevent="fileDragging = true"
                @dragleave="fileDragging = false"
                @drop.prevent="handleFileDrop"
              >
                <div class="dz-inner">
                  <div class="dz-ico">
                    <svg v-if="!newFile" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span v-else style="font-size:40px">📦</span>
                  </div>
                  <div v-if="!newFile">
                    <div class="dz-main">Glisse ton fichier ici</div>
                    <div class="dz-sub">ou clique pour parcourir · ZIP, PDF, RAR — max 50 Mo</div>
                  </div>
                  <div v-else>
                    <div class="dz-main">{{ newFile.name }}</div>
                    <div class="dz-sub">{{ fileSize(newFile.size) }} · <span @click.stop="newFile = null" class="dz-remove">Supprimer</span></div>
                  </div>
                </div>
              </div>
              <input ref="fileInput" type="file" style="display:none" @change="handleFileChange"/>
            </div>

            <div class="fld">
              <label class="fld-lbl">Image de prévisualisation</label>
              <div class="img-drop" :class="{ 'img-drop--filled': form.preview_image }" @click="$refs.imageInput.click()" @dragover.prevent @drop.prevent="handleImageDrop">
                <img v-if="form.preview_image" :src="form.preview_image" class="img-preview"/>
                <div v-else class="img-placeholder">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>PNG, JPG — max 2 Mo</span>
                </div>
              </div>
              <input ref="imageInput" type="file" accept="image/*" style="display:none" @change="handleImageUpload"/>
              <button v-if="form.preview_image" class="rm-img-btn" @click="form.preview_image = null">✕ Supprimer l'image</button>
            </div>

          </div>

          <div class="col-side">
            <div class="side-box">
              <div class="side-box-ttl">Prix de vente</div>
              <div class="price-toggle-row">
                <button class="price-tog" :class="{ 'price-tog--on': !paidMode }" @click="paidMode = false; form.price = '0'">
                  <span class="pt-ico">🆓</span>
                  <span class="pt-lbl">Gratuit</span>
                </button>
                <button class="price-tog" :class="{ 'price-tog--on': paidMode }" @click="paidMode = true; if(!form.price || form.price=='0') form.price = ''">
                  <span class="pt-ico">💰</span>
                  <span class="pt-lbl">Payant</span>
                </button>
              </div>

              <Transition name="fd">
                <div v-if="paidMode" class="price-inp-wrap">
                  <span class="price-cur">FCFA</span>
                  <input v-model.number="form.price" class="fld-inp price-inp" type="number" min="0" step="100" placeholder="5000"/>
                </div>
              </Transition>
              <div v-if="!paidMode" class="free-chip">✅ Accès gratuit</div>
            </div>

            <div class="side-box">
              <div class="side-box-ttl">Statut</div>
              <div class="status-stack">
                <button v-for="s in statuses" :key="s.value" class="status-btn" :class="{ 'status-btn--on': form.status === s.value }" :style="form.status === s.value ? { background: s.bg, color: s.color, borderColor: s.color + '88' } : {}" @click="form.status = s.value">
                  {{ s.icon }} {{ s.label }}
                </button>
              </div>
              <p class="status-desc">{{ currentStatus.desc }}</p>
            </div>
          </div>
        </div>

        <div class="step-foot">
          <button class="btn-bck" @click="currentStep--">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <button class="btn-nxt" @click="currentStep++" :disabled="!step2Valid">
            Suivant — Description
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      </Transition>

      <!-- ─── ÉTAPE 3 — Description & Tags ─── -->

      <!-- ─── ÉTAPE 4 — Aperçu client ─── -->
      <Transition name="slide" mode="out-in">
      <div v-if="currentStep === 4" key="s4" class="step-pane">
        <div class="step-hd">
          <div class="step-badge preview-badge">👁</div>
          <div>
            <h2 class="step-title">Aperçu client</h2>
            <p class="step-sub2">Voici exactement ce que les clients verront sur la page de la ressource</p>
          </div>
          <div class="preview-live-chip">
            <span class="plc-dot"/>
            Vue client en direct
          </div>
        </div>

        <!-- ── RENDU PAGE RESSOURCE COMPLÈTE ── -->
        <div class="client-preview-wrap">

          <!-- Bandeau "mode aperçu" -->
          <div class="cp-banner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Mode aperçu — cette page est telle qu'elle apparaîtra aux visiteurs
          </div>

          <!-- Hero ressource -->
          <div class="cp-hero" :style="{ background: `linear-gradient(135deg, ${form.cover_color} 0%, var(--surface) 100%)` }">
            <div class="cp-hero-left">
              <!-- Breadcrumb -->
              <div class="cp-bc">Ressources <span>›</span> {{ currentType?.label || 'Type' }}</div>
              <!-- Badges -->
              <div class="cp-badges">
                <span class="cp-badge-type">{{ currentType?.icon }} {{ currentType?.label }}</span>
                <span class="cp-badge-status" :style="{ background: currentStatus.bg, color: currentStatus.color }">{{ currentStatus.icon }} {{ currentStatus.label }}</span>
              </div>
              <!-- Titre -->
              <h1 class="cp-title">{{ form.title || 'Titre de la ressource…' }}</h1>
              <!-- Short desc -->
              <p class="cp-short">{{ form.short_description || 'Aucune description courte.' }}</p>
              <!-- Tags -->
              <div v-if="selectedTags.length" class="cp-tags">
                <span v-for="tag in selectedTags" :key="tag.id" class="cp-tag">{{ tag.name }}</span>
              </div>
              <!-- Stats -->
              <div class="cp-stats">
                <span>👁 0 vues</span>
                <span class="cp-dot">·</span>
                <span>⬇ 0 téléchargements</span>
                <span v-if="form.github_link" class="cp-dot">·</span>
                <a v-if="form.github_link" :href="form.github_link" target="_blank" class="cp-github-link">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  Code source
                </a>
              </div>
            </div>

            <!-- Carte achat sticky -->
            <div class="cp-buy-card">
              <div class="cp-buy-cover" :style="{ background: form.cover_color }">
                <img v-if="form.preview_image" :src="form.preview_image" class="cp-buy-img"/>
                <span v-else style="font-size:52px">{{ currentType?.icon || '📦' }}</span>
              </div>
              <div class="cp-buy-body">
                <div class="cp-price" :class="{ 'cp-price--free': !paidMode }">
                  {{ !paidMode ? 'Gratuit' : (form.price ? Number(form.price).toLocaleString() + ' FCFA' : '—') }}
                </div>
                <button class="cp-cta-btn">
                  {{ !paidMode ? '⬇ Télécharger gratuitement' : '🛒 Acheter maintenant' }}
                </button>
                <button v-if="form.demo_link" class="cp-demo-btn">👁 Voir la démo</button>
                <div class="cp-includes">
                  <div class="cp-includes-ttl">Ce que tu obtiens</div>
                  <div class="cp-inc"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Accès immédiat au téléchargement</div>
                  <div class="cp-inc"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> {{ newFile ? newFile.name.split('.').pop().toUpperCase() : 'Fichier' }} téléchargeable</div>
                  <div class="cp-inc"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Mises à jour incluses</div>
                  <div v-if="form.github_link" class="cp-inc"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Code source GitHub</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Description complète rendue -->
          <div class="cp-body">
            <div class="cp-tabs">
              <span class="cp-tab cp-tab--on">Description</span>
              <span class="cp-tab">Créateur</span>
            </div>
            <div v-if="form.description" class="cp-desc-content" v-html="renderedDescription"/>
            <div v-else class="cp-no-desc">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <p>Aucune description rédigée pour le moment.</p>
              <button @click="currentStep = 3" class="cp-write-btn">✏️ Aller rédiger la description</button>
            </div>
          </div>

        </div>

        <!-- CTA d'approbation -->
        <div class="cp-approval">
          <div class="cp-approval-left">
            <div class="cp-approval-icon">🤔</div>
            <div>
              <div class="cp-approval-title">C'est ce que verront tes clients</div>
              <div class="cp-approval-sub">Si la présentation te convient, passe à l'étape finale pour publier.</div>
            </div>
          </div>
          <div class="cp-approval-actions">
            <button class="cp-btn-edit" @click="currentStep = 1">
              ✏️ Modifier
            </button>
            <button class="cp-btn-approve" @click="currentStep++">
              ✅ J'approuve — Continuer
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        <div class="step-foot" style="margin-top:16px">
          <button class="btn-bck" @click="currentStep--">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
        </div>
      </div>
      </Transition>

      <Transition name="slide" mode="out-in">
      <div v-if="currentStep === 3" key="s3" class="step-pane">
        <div class="step-hd">
          <div class="step-badge">03</div>
          <div>
            <h2 class="step-title">Description & Tags</h2>
            <p class="step-sub2">Détaille ta ressource pour maximiser sa visibilité</p>
          </div>
          <div class="split-toggle" @click="splitMode = !splitMode">
            <div class="split-knob" :class="{ on: splitMode }"/>
            <span>Aperçu live</span>
          </div>
        </div>

        <div class="dual-col">
          <div class="col-main">
            <div class="fld">
              <label class="fld-lbl">Description complète</label>
              <div class="md-bar">
                <button class="md-b" @click="wrap('**','**')"><b>B</b></button>
                <button class="md-b" @click="wrap('*','*')"><i>I</i></button>
                <button class="md-b" @click="wrap('`','`')"><code>`</code></button>
                <div class="md-sep"/>
                <button class="md-b" @click="insertLine('## ')">H2</button>
                <button class="md-b" @click="insertLine('### ')">H3</button>
                <button class="md-b" @click="insertLine('- ')">• liste</button>
                <div class="md-sep"/>
                <button class="md-b" @click="insertCode('bash')">bash</button>
                <button class="md-b" @click="insertCode('php')">php</button>
                <button class="md-b" @click="insertCode('javascript')">js</button>
                <button class="md-b" @click="insertCode('vue')">vue</button>
                <div class="md-sep"/>
                <button class="md-b md-b--toggle" :class="{ on: splitMode }" @click="splitMode = !splitMode">
                  {{ splitMode ? '▪ Split' : '▫ Split' }}
                </button>
              </div>
              <div class="md-wrap" :class="{ 'md-wrap--split': splitMode }">
                <textarea ref="editorRef" v-model="form.description" class="md-ta" placeholder="## À propos&#10;&#10;Décris ta ressource..."/>
                <div v-if="splitMode" class="md-prev">
                  <div class="md-prev-header">
                    <span class="md-prev-label">Aperçu live</span>
                    <span class="md-prev-wc">{{ wordCount }} mots</span>
                  </div>
                  <div class="md-prev-body" v-html="renderedDescription"/>
                </div>
              </div>
              <div class="md-foot">
                <span>{{ wordCount }} mots</span>
                <span>{{ form.description.length }} caractères</span>
              </div>
            </div>
          </div>

          <div class="col-side">
            <div class="side-box">
              <div class="side-box-ttl">
                Tags
                <span v-if="tagsLoading" class="dot-load"><span/><span/><span/></span>
              </div>
              <div class="tag-srch">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input v-model="tagSearch" class="tag-inp" placeholder="Rechercher…"/>
              </div>
              <div v-if="selectedTags.length" class="sel-tags">
                <span v-for="tag in selectedTags" :key="tag.id" class="sel-tag" @click="removeTag(tag.id)">{{ tag.name }} <span>×</span></span>
              </div>
              <p v-else class="no-tags-txt">Aucun tag sélectionné</p>
              <div v-if="tagsLoading" class="tag-skel-row">
                <span v-for="n in 8" :key="n" class="tag-skel"/>
              </div>
              <div v-else class="tag-cloud">
                <span v-for="tag in filteredAvailableTags" :key="tag.id" class="cloud-tag" :class="{ 'cloud-tag--on': isTagSelected(tag.id) }" @click="toggleTag(tag)">
                  {{ isTagSelected(tag.id) ? '✓' : '+' }} {{ tag.name }}
                </span>
                <span v-if="filteredAvailableTags.length === 0" class="no-tags-txt">Aucun résultat</span>
              </div>
            </div>
          </div>
        </div>

        <div class="step-foot">
          <button class="btn-bck" @click="currentStep--">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <button class="btn-nxt" @click="currentStep++">
            Voir l'aperçu client
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      </Transition>

      <!-- ─── ÉTAPE 4 — Récapitulatif ─── -->
      <Transition name="slide" mode="out-in">
      <div v-if="currentStep === 5" key="s5" class="step-pane">
        <div class="step-hd">
          <div class="step-badge">05</div>
          <div>
            <h2 class="step-title">Récapitulatif</h2>
            <p class="step-sub2">Aperçu complet de la ressource telle qu'elle sera vue</p>
          </div>
        </div>

        <div class="recap-layout">

          <!-- Preview card -->
          <div class="recap-preview">
            <div class="prev-card">
              <div class="prev-cover" :style="{ background: form.cover_color }">
                <img v-if="form.preview_image" :src="form.preview_image" class="prev-img"/>
                <span v-else class="prev-ico">{{ currentType?.icon || '📦' }}</span>
                <div class="prev-status-chip" :style="{ background: currentStatus.bg, color: currentStatus.color }">
                  {{ currentStatus.icon }} {{ currentStatus.label }}
                </div>
              </div>
              <div class="prev-body">
                <div class="prev-type">{{ currentType?.label }}</div>
                <div class="prev-ttl">{{ form.title || '—' }}</div>
                <div class="prev-desc">{{ form.short_description || 'Aucune description courte' }}</div>
                <div v-if="selectedTags.length" class="prev-tags">
                  <span v-for="t in selectedTags.slice(0,3)" :key="t.id" class="prev-tag">{{ t.name }}</span>
                </div>
                <div class="prev-foot">
                  <span class="prev-price" :class="{ 'prev-price--free': form.price == 0 }">
                    {{ form.price == 0 ? '🆓 Gratuit' : Number(form.price).toLocaleString() + ' FCFA' }}
                  </span>
                  <div class="prev-ext">
                    <span v-if="form.github_link">🐙</span>
                    <span v-if="form.demo_link">🌐</span>
                    <span v-if="newFile || existingFile">📦</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Checklist + details -->
          <div class="recap-right">

            <div class="checklist">
              <div class="cl-ttl">Checklist avant publication</div>
              <div v-for="c in checklist" :key="c.label" class="cl-item" :class="{ 'cl-item--ok': c.ok }">
                <div class="cl-dot" :class="c.ok ? 'cl-dot--ok' : 'cl-dot--warn'">
                  <svg v-if="c.ok" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <svg v-else width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>
                </div>
                <span class="cl-lbl">{{ c.label }}</span>
                <span v-if="!c.ok" class="cl-hint">{{ c.hint }}</span>
                <button v-if="!c.ok" class="cl-fix" @click="currentStep = c.step">Corriger</button>
              </div>
            </div>

            <div class="detail-tbl">
              <div class="dt-row">
                <span class="dt-k">Type</span>
                <span class="dt-v">{{ currentType?.icon }} {{ currentType?.label }}</span>
              </div>
              <div class="dt-row">
                <span class="dt-k">Fichier</span>
                <span class="dt-v">{{ newFile ? newFile.name : (existingFile ? existingFileName : '—') }}</span>
              </div>
              <div class="dt-row">
                <span class="dt-k">Prix</span>
                <span class="dt-v" :style="form.price == 0 ? 'color:#16a34a;font-weight:700' : ''">
                  {{ form.price == 0 ? 'Gratuit' : Number(form.price).toLocaleString() + ' FCFA' }}
                </span>
              </div>
              <div class="dt-row">
                <span class="dt-k">Tags</span>
                <span class="dt-v">{{ selectedTags.length ? selectedTags.map(t => t.name).join(', ') : '—' }}</span>
              </div>
              <div class="dt-row">
                <span class="dt-k">Statut</span>
                <span class="dt-v" :style="{ color: currentStatus.color }">{{ currentStatus.icon }} {{ currentStatus.label }}</span>
              </div>
            </div>

          </div>
        </div>

        <div class="step-foot">
          <button class="btn-bck" @click="currentStep--">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <div style="display:flex;gap:10px">
            <button class="btn-save-draft" @click="doSave('pending')" :disabled="saving">Sauvegarder brouillon</button>
            <button class="btn-publish btn-publish--lg" @click="doSave(form.status)" :disabled="saving">
              <span v-if="saving" class="spinner"/>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ isEdit ? 'Mettre à jour' : '🚀 Publier' }}
            </button>
          </div>
        </div>
      </div>
      </Transition>

    </div>

    <!-- ══ TOAST ══ -->
    <Transition name="tst">
      <div v-if="toast.show" class="toast" :class="{ 'toast--err': toast.error }">{{ toast.message }}</div>
    </Transition>

  </div>
</template>

<script>
import API from '@/services/api'
import { RouterLink } from 'vue-router'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import php from 'highlight.js/lib/languages/php'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import sql from 'highlight.js/lib/languages/sql'

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('php', php)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('vue', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('sql', sql)

export default {
  name: 'ResourceEditorStepper',
  components: { RouterLink },

  data() {
    return {
      currentStep: 1,
      saving: false,
      splitMode: false,
      fileDragging: false,
      newFile: null,
      existingFile: null,
      allTags: [],
      tagSearch: '',
      tagsLoading: false,
      toast: { show: false, message: '', error: false },

      steps: [
        { label: 'Informations', sub: 'Titre & type'     },
        { label: 'Fichier',      sub: 'Upload & prix'    },
        { label: 'Description',  sub: 'Contenu & tags'   },
        { label: 'Aperçu',       sub: 'Vue client'       },
        { label: 'Publication',  sub: 'Vérification'     },
      ],

      statuses: [
        { value: 'pending', icon: '⏳', label: 'En attente', bg: '#fef9c3', color: '#854d0e', desc: 'La ressource sera soumise à validation avant publication.' },
        { value: 'publish', icon: '✅', label: 'Publié',     bg: '#dcfce7', color: '#14532d', desc: 'La ressource sera visible par tous immédiatement.' },
      ],

      types: [
        { value: 'template',  icon: '🎨', label: 'Template'  },
        { value: 'plugin',    icon: '🔌', label: 'Plugin'    },
        { value: 'ebook',     icon: '📘', label: 'eBook'     },
        { value: 'snippet',   icon: '💡', label: 'Snippet'   },
        { value: 'component', icon: '🧩', label: 'Component' },
        { value: 'tool',      icon: '🛠', label: 'Outil'     },
      ],

      coverColors: ['#dbeafe','#dcfce7','#fef9c3','#ede9fe','#ffedd5','#fee2e2','#e0f2fe','#fce7f3','#f0fdf4','#f1f5f9'],

      paidMode: false,
      form: {
        title: '', short_description: '', description: '',
        preview_image: null, file_name: '', file_size: null,
        price: '0', status: 'pending',
        type: 'template', cover_color: '#dbeafe',
        github_link: '', demo_link: '', tags: [],
      },
    }
  },

  computed: {
    isEdit()       { return !!this.$route.params.id },
    currentType()  { return this.types.find(t => t.value === this.form.type) },
    currentStatus(){ return this.statuses.find(s => s.value === this.form.status) || this.statuses[0] },
    step1Valid()   { return this.form.title.trim().length > 2 },
    step2Valid()   { return !!(this.newFile || this.existingFile) },
    selectedTags() { return this.allTags.filter(t => this.form.tags.includes(t.id)) },
    filteredAvailableTags() {
      const q = this.tagSearch.trim().toLowerCase()
      return q ? this.allTags.filter(t => t.name.toLowerCase().includes(q)) : this.allTags
    },
    existingFileName() { return this.form.file_name || this.existingFile?.split('/').pop() || '' },
    wordCount() {
      if (!this.form.description) return 0
      return this.form.description.trim().split(/\s+/).filter(Boolean).length
    },
    checklist() {
      return [
        { label: 'Titre renseigné',      ok: this.form.title.trim().length > 2,          hint: 'Ajoute un titre',           step: 1 },
        { label: 'Type sélectionné',     ok: !!this.form.type,                            hint: 'Choisis un type',           step: 1 },
        { label: 'Fichier uploadé',      ok: !!(this.newFile || this.existingFile),       hint: 'Upload le fichier',         step: 2 },
        { label: 'Prix défini',          ok: this.form.price !== '',                      hint: 'Définis le prix',           step: 2 },
        { label: 'Description présente', ok: this.form.description.trim().length > 20,   hint: 'Ajoute une description',    step: 3 },
        { label: 'Au moins un tag',      ok: this.form.tags.length > 0,                  hint: 'Ajoute au moins un tag',    step: 3 },
      ]
    },
    renderedDescription() {
      let md = this.form.description
      if (!md) return '<p style="color:#aaa;font-style:italic">Aperçu ici…</p>'
      md = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        const language = lang || 'plaintext'
        let h
        try { h = hljs.highlight(code.trimEnd(), { language }).value }
        catch { h = code.trimEnd().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
        return `<pre style="margin:10px 0;border-radius:8px;overflow:hidden"><code class="hljs language-${language}" style="display:block;padding:14px;font-size:12.5px;line-height:1.7;background:#0d1117;font-family:monospace">${h}</code></pre>`
      })
      md = md.replace(/^## (.+)$/gm, '<h2 style="font-size:17px;font-weight:700;margin:16px 0 8px;color:var(--text)">$1</h2>')
      md = md.replace(/^### (.+)$/gm,'<h3 style="font-size:14px;font-weight:600;margin:12px 0 6px;color:var(--text)">$1</h3>')
      md = md.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      md = md.replace(/\*(.+?)\*/g,    '<em>$1</em>')
      md = md.replace(/`([^`]+)`/g,    '<code style="background:var(--surface2);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:12.5px;color:#e06c75">$1</code>')
      md = md.replace(/^- (.+)$/gm,    '<li style="margin:4px 0;color:var(--text2)">$1</li>')
      md = md.replace(/(<li[\s\S]*?<\/li>\n?)+/g, s => `<ul style="padding-left:14px;margin:8px 0">${s}</ul>`)
      md = md.replace(/\n\n(?!<)/g,    '</p><p style="margin:8px 0;color:var(--text2);line-height:1.8">')
      return '<p style="margin:8px 0;color:var(--text2);line-height:1.8">' + md + '</p>'
    },
  },

  async mounted() {
    this.fetchTags()
    if (this.isEdit) this.fetchResource()
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

    async fetchResource() {
      try {
        const { data } = await API.get(`/admin/resources/${this.$route.params.id}`)
        this.form = {
          title:             data.title             || '',
          short_description: data.short_description || '',
          description:       data.description       || '',
          preview_image:     data.preview_image     || null,
          file_name:         data.file_name         || '',
          file_size:         data.file_size         || null,
          price:             data.price             ?? '0',
          status:            data.status            || 'pending',
          type:              data.type              || 'template',
          cover_color:       data.cover_color       || '#dbeafe',
          github_link:       data.github_link       || '',
          demo_link:         data.demo_link         || '',
          tags:              data.tags ? data.tags.map(t => t.id) : [],
        }
        if (data.file_url) this.existingFile = data.file_url
        this.paidMode = data.price > 0
      } catch(e) { console.error(e) }
    },

    isTagSelected(id) { return this.form.tags.includes(id) },
    toggleTag(tag)    { this.isTagSelected(tag.id) ? this.removeTag(tag.id) : this.form.tags.push(tag.id) },
    removeTag(id)     { this.form.tags = this.form.tags.filter(x => x !== id) },

    handleFileChange(e)   { this.newFile = e.target.files[0] || null },
    handleFileDrop(e)     { this.fileDragging = false; const f = e.dataTransfer.files[0]; if (f) this.newFile = f },
    fileSize(bytes) {
      if (bytes < 1024)      return bytes + ' o'
      if (bytes < 1048576)   return (bytes/1024).toFixed(1) + ' Ko'
      return (bytes/1048576).toFixed(1) + ' Mo'
    },
    handleImageUpload(e) {
      const file = e.target.files[0]; if (!file) return
      const r = new FileReader(); r.onload = ev => { this.form.preview_image = ev.target.result }; r.readAsDataURL(file)
    },
    handleImageDrop(e) {
      const file = e.dataTransfer.files[0]; if (!file || !file.type.startsWith('image/')) return
      const r = new FileReader(); r.onload = ev => { this.form.preview_image = ev.target.result }; r.readAsDataURL(file)
    },

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

    async doSave(status) {
      if (!this.form.title.trim()) { this.showToast('Le titre est obligatoire', true); return }
      this.saving = true
      try {
        const fd = new FormData()
        fd.append('title',             this.form.title)
        fd.append('short_description', this.form.short_description || '')
        fd.append('description',       this.form.description || '')
        fd.append('price',             this.paidMode ? (this.form.price || 0) : 0)
        fd.append('status',            status)
        fd.append('type',              this.form.type)
        fd.append('cover_color',       this.form.cover_color)
        if (this.form.github_link) fd.append('github_link', this.form.github_link)
        if (this.form.demo_link)   fd.append('demo_link',   this.form.demo_link)
        this.form.tags.forEach(id => fd.append('tags[]', id))
        // URL B2 existante → pas besoin de renvoyer (non modifiée)
        // base64 (nouvelle image) → on envoie
        if (this.form.preview_image && this.form.preview_image.startsWith('data:')) {
          fd.append('preview_image', this.form.preview_image)
        }
        if (this.newFile)            fd.append('file', this.newFile)
        if (this.isEdit)             fd.append('_method', 'PUT')

        const url = this.isEdit ? `/admin/resources/${this.$route.params.id}` : '/admin/resources'
        await API.post(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        this.showToast(this.isEdit ? '✓ Ressource mise à jour' : '✓ Ressource publiée')
        setTimeout(() => this.$router.push('/dashboard/ressources'), 1200)
      } catch (error) {
        if (error.response?.status === 422) {
          const errs = error.response.data.errors
          this.showToast(Object.values(errs).flat().join(' · '), true)
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

<style scoped>
.res-editor { padding-bottom: 60px; }

/* ── Topbar ── */
.topbar { display:flex; align-items:center; gap:14px; padding:14px 0 20px; border-bottom:1px solid var(--border); margin-bottom:0; flex-wrap:wrap; }
.back-btn { display:flex; align-items:center; gap:5px; font-size:13px; font-weight:500; color:var(--text3); text-decoration:none; padding:6px 10px; border-radius:7px; transition:all .15s; }
.back-btn:hover { color:var(--text); background:var(--surface2); }
.topbar-center { flex:1; min-width:0; }
.topbar-title  { font-size:15px; font-weight:700; color:var(--text); }
.topbar-draft  { font-size:12px; color:var(--text4); margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.topbar-actions { display:flex; gap:8px; }
.btn-save-draft { display:flex; align-items:center; gap:6px; padding:8px 14px; border-radius:8px; border:1.5px solid var(--border); background:var(--surface); font-size:13px; font-weight:600; color:var(--text2); cursor:pointer; transition:all .15s; }
.btn-save-draft:hover { border-color:var(--text3); }
.btn-save-draft:disabled { opacity:.45; cursor:not-allowed; }
.btn-publish { display:flex; align-items:center; gap:6px; padding:8px 18px; border-radius:8px; background:var(--text); color:var(--surface); font-size:13px; font-weight:700; cursor:pointer; border:none; transition:all .15s; }
.btn-publish:hover:not(:disabled) { opacity:.85; transform:translateY(-1px); }
.btn-publish:disabled { opacity:.35; cursor:not-allowed; }
.btn-publish--lg { padding:10px 22px; font-size:14px; }

/* ── Stepper ── */
.stepper-wrap { padding:28px 0 24px; border-bottom:1px solid var(--border2); margin-bottom:36px; }
.stepper { display:flex; align-items:center; max-width:700px; }
.step { display:flex; align-items:center; gap:10px; cursor:pointer; }
.step--future { opacity:.4; cursor:default; }
.step-circle {
  width:34px; height:34px; border-radius:50%; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:700; border:2px solid var(--border);
  background:var(--surface); color:var(--text3); transition:all .2s;
}
.step--active .step-circle { background:var(--text); color:var(--surface); border-color:var(--text); }
.step--done   .step-circle { background:#16a34a; color:#fff; border-color:#16a34a; }
.step-info { display:flex; flex-direction:column; }
.step-label { font-size:13px; font-weight:600; color:var(--text3); white-space:nowrap; }
.step--active .step-label { color:var(--text); font-weight:700; }
.step--done   .step-label { color:#16a34a; }
.step-sub { font-size:11px; color:var(--text5); white-space:nowrap; }
.step-connector { flex:1; height:2px; background:var(--border2); margin:0 14px; min-width:20px; transition:background .3s; }
.step-connector--done { background:#16a34a; }

/* ── Step pane ── */
.step-pane { animation:paneIn .25s ease; }
@keyframes paneIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }

.step-hd { display:flex; align-items:center; gap:18px; margin-bottom:32px; }
.step-badge { width:50px; height:50px; border-radius:13px; background:var(--text); color:var(--surface); display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:800; font-family:monospace; flex-shrink:0; }
.step-title { font-size:21px; font-weight:800; color:var(--text); margin-bottom:3px; }
.step-sub2  { font-size:13.5px; color:var(--text3); }

/* ── Dual col ── */
.dual-col { display:grid; grid-template-columns:1fr 270px; gap:24px; align-items:start; }
.col-main { display:flex; flex-direction:column; gap:20px; }
.col-side { display:flex; flex-direction:column; gap:12px; }

/* ── Field ── */
.fld { display:flex; flex-direction:column; gap:6px; }
.fld-lbl { font-size:11.5px; font-weight:700; color:var(--text3); text-transform:uppercase; letter-spacing:.5px; font-family:monospace; }
.req { color:#ef4444; }
.fld-inp {
  padding:10px 13px; border:1.5px solid var(--border); border-radius:9px;
  background:var(--surface); color:var(--text); font-size:14px; font-family:inherit; width:100%; transition:all .18s;
}
.fld-inp:focus { outline:none; border-color:var(--text); box-shadow:0 0 0 3px rgba(0,0,0,.05); }
.fld-inp--lg { font-size:17px; font-weight:700; padding:12px 14px; }
.fld-textarea { resize:vertical; min-height:80px; }
.fld-hint { font-size:12px; color:var(--text5); }
.fld-hint-row { display:flex; justify-content:space-between; font-size:12px; color:var(--text5); }
.c-red { color:#ef4444 !important; }

/* ── Links ── */
.links-stack { display:flex; flex-direction:column; gap:8px; }
.link-row { display:flex; align-items:center; gap:8px; }
.link-ico { font-size:18px; flex-shrink:0; width:26px; text-align:center; }

/* ── Side box ── */
.side-box { background:var(--surface); border:1.5px solid var(--border); border-radius:12px; padding:16px; }
.side-box-ttl { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:var(--text4); margin-bottom:12px; font-family:monospace; display:flex; align-items:center; gap:8px; }

/* ── Type grid ── */
.type-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
.type-tile { display:flex; flex-direction:column; align-items:center; gap:3px; padding:10px 4px; border-radius:8px; border:1.5px solid var(--border); background:var(--surface); cursor:pointer; transition:all .15s; }
.type-tile:hover { border-color:var(--text3); background:var(--surface2); }
.type-tile--on { border-color:var(--text); background:var(--text); }
.type-ico { font-size:19px; }
.type-nm  { font-size:10px; font-weight:600; color:var(--text3); }
.type-tile--on .type-nm { color:var(--surface); }

/* ── Color ── */
.clr-preview { height:62px; border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:10px; transition:background .2s; }
.clr-row { display:flex; flex-wrap:wrap; gap:6px; }
.clr-dot { width:22px; height:22px; border-radius:50%; cursor:pointer; border:2px solid transparent; transition:all .12s; }
.clr-dot--on { border-color:var(--text); transform:scale(1.2); }

/* ── Drop zone ── */
.drop-zone { border:2px dashed var(--border); border-radius:12px; padding:28px 20px; cursor:pointer; transition:all .2s; background:var(--surface2); }
.drop-zone:hover, .drop-zone--drag { border-color:var(--text); background:var(--surface); }
.drop-zone--ok { border-style:solid; border-color:#16a34a; background:#f0fdf4; }
.dz-inner { display:flex; flex-direction:column; align-items:center; gap:8px; text-align:center; }
.dz-ico { color:var(--text4); }
.dz-main { font-size:14px; font-weight:600; color:var(--text); }
.dz-sub  { font-size:12px; color:var(--text4); }
.dz-remove { cursor:pointer; color:#ef4444; }
.exist-file { display:flex; align-items:center; gap:12px; padding:12px 14px; background:var(--surface2); border:1px solid var(--border); border-radius:10px; }
.ef-ico  { font-size:26px; flex-shrink:0; }
.ef-info { flex:1; min-width:0; }
.ef-name { font-size:13px; font-weight:600; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ef-meta { font-size:11px; color:var(--text4); }
.ef-btn  { font-size:12px; color:var(--text4); background:none; border:1px solid var(--border); border-radius:6px; padding:4px 10px; cursor:pointer; transition:all .15s; }
.ef-btn:hover { color:var(--text); border-color:var(--text3); }

/* ── Image drop ── */
.img-drop { border:2px dashed var(--border); border-radius:10px; min-height:96px; cursor:pointer; display:flex; align-items:center; justify-content:center; overflow:hidden; transition:border-color .2s; background:var(--surface2); }
.img-drop:hover { border-color:var(--text); }
.img-drop--filled { padding:0; border-style:solid; }
.img-placeholder { display:flex; flex-direction:column; align-items:center; gap:6px; color:var(--text4); font-size:12px; padding:20px; }
.img-preview { width:100%; display:block; border-radius:8px; }
.rm-img-btn { margin-top:6px; font-size:12px; color:var(--text4); background:none; border:none; cursor:pointer; }
.rm-img-btn:hover { color:#ef4444; }

/* ── Price ── */
.price-toggle-row { display:flex; gap:6px; margin-bottom:12px; }
.price-tog { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; padding:10px; border-radius:9px; border:1.5px solid var(--border); background:var(--surface); cursor:pointer; transition:all .15s; }
.price-tog--on { border-color:var(--text); background:var(--text); }
.pt-ico { font-size:18px; }
.pt-lbl { font-size:11px; font-weight:600; color:var(--text3); }
.price-tog--on .pt-lbl { color:var(--surface); }
.price-inp-wrap { position:relative; }
.price-cur { position:absolute; left:12px; top:50%; transform:translateY(-50%); font-size:11px; font-weight:700; color:var(--text4); pointer-events:none; }
.price-inp { padding-left:52px; font-size:18px; font-weight:800; }
.free-chip { text-align:center; font-size:13px; color:#16a34a; font-weight:600; padding:8px; background:#f0fdf4; border-radius:8px; border:1px solid #bbf7d0; }

/* ── Status ── */
.status-stack { display:flex; flex-direction:column; gap:6px; margin-bottom:10px; }
.status-btn { padding:9px 12px; border-radius:8px; border:1.5px solid var(--border); background:var(--surface); cursor:pointer; font-size:12.5px; font-weight:600; color:var(--text3); text-align:left; transition:all .15s; }
.status-btn:hover { border-color:var(--text3); }
.status-desc { font-size:11.5px; color:var(--text4); line-height:1.5; }

/* ── MD editor ── */
.md-bar { display:flex; align-items:center; gap:2px; flex-wrap:wrap; padding:7px 10px; background:var(--surface2); border:1px solid var(--border); border-bottom:none; border-radius:9px 9px 0 0; }
.md-b { padding:0 7px; height:26px; border:none; background:none; color:var(--text3); border-radius:4px; cursor:pointer; font-size:11.5px; font-weight:700; font-family:monospace; transition:all .1s; }
.md-b:hover { background:var(--surface); color:var(--text); }
.md-b--toggle.on { background:var(--text); color:var(--surface); }
.md-sep { width:1px; height:16px; background:var(--border); margin:0 3px; }
.md-wrap { display:flex; border:1px solid var(--border); border-radius:0 0 9px 9px; overflow:hidden; min-height:280px; }
.md-wrap--split .md-ta { width:50%; border-right:1px solid var(--border); }
.md-ta { flex:1; border:none; outline:none; resize:none; padding:16px 18px; font-size:13.5px; font-family:monospace; color:var(--text); background:var(--surface); line-height:1.8; min-height:280px; }
.md-prev { width:50%; padding:16px 18px; overflow-y:auto; background:var(--surface); min-height:280px; }
.md-foot { display:flex; justify-content:flex-end; gap:14px; padding:5px 12px; font-size:11px; color:var(--text5); background:var(--surface2); border:1px solid var(--border); border-top:none; border-radius:0 0 9px 9px; }

/* ── Tags ── */
.tag-srch { display:flex; align-items:center; gap:7px; padding:8px 10px; border:1.5px solid var(--border); border-radius:8px; background:var(--surface); margin-bottom:10px; color:var(--text4); }
.tag-inp  { flex:1; border:none; outline:none; font-size:13px; color:var(--text); background:transparent; }
.sel-tags { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:10px; }
.sel-tag  { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:20px; background:var(--text); color:var(--surface); font-size:11px; font-weight:600; cursor:pointer; transition:opacity .15s; }
.sel-tag:hover { opacity:.8; }
.tag-cloud { display:flex; flex-wrap:wrap; gap:5px; }
.cloud-tag { display:inline-flex; align-items:center; padding:3px 9px; border-radius:20px; background:var(--surface2); color:var(--text3); border:1px solid var(--border); font-size:11px; font-weight:500; cursor:pointer; transition:all .12s; }
.cloud-tag:hover { border-color:var(--text3); color:var(--text); }
.cloud-tag--on { background:var(--text); color:var(--surface); border-color:var(--text); }
.no-tags-txt { font-size:12px; color:var(--text5); margin-bottom:8px; display:block; }
.tag-skel-row { display:flex; flex-wrap:wrap; gap:5px; }
.tag-skel { height:25px; width:60px; border-radius:20px; background:var(--surface2); animation:pls .9s ease-in-out infinite alternate; }
@keyframes pls { from { opacity:.4 } to { opacity:1 } }
.dot-load { display:inline-flex; gap:3px; align-items:center; }
.dot-load span { width:4px; height:4px; border-radius:50%; background:var(--text5); animation:blink 1.2s infinite; }
.dot-load span:nth-child(2) { animation-delay:.2s; }
.dot-load span:nth-child(3) { animation-delay:.4s; }
@keyframes blink { 0%,100% { opacity:.2 } 50% { opacity:1 } }

/* ── Recap ── */
.recap-layout { display:grid; grid-template-columns:290px 1fr; gap:28px; align-items:start; }
.recap-right  { display:flex; flex-direction:column; gap:16px; }

.prev-card { border:1.5px solid var(--border); border-radius:14px; overflow:hidden; box-shadow:0 4px 18px rgba(0,0,0,.06); }
.prev-cover { height:155px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
.prev-img   { width:100%; height:100%; object-fit:cover; }
.prev-ico   { font-size:54px; }
.prev-status-chip { position:absolute; top:10px; right:10px; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; }
.prev-body  { padding:15px; }
.prev-type  { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--text4); margin-bottom:5px; font-family:monospace; }
.prev-ttl   { font-size:15px; font-weight:700; color:var(--text); margin-bottom:5px; line-height:1.3; }
.prev-desc  { font-size:12.5px; color:var(--text3); margin-bottom:10px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.prev-tags  { display:flex; gap:4px; flex-wrap:wrap; margin-bottom:10px; }
.prev-tag   { font-size:10.5px; padding:2px 7px; border-radius:20px; background:var(--surface2); color:var(--text3); border:1px solid var(--border); }
.prev-foot  { display:flex; align-items:center; justify-content:space-between; padding-top:10px; border-top:1px solid var(--border2); }
.prev-price { font-size:16px; font-weight:800; color:var(--text); }
.prev-price--free { color:#16a34a; }
.prev-ext   { display:flex; gap:6px; font-size:15px; }

/* ── Checklist ── */
.checklist { background:var(--surface); border:1.5px solid var(--border); border-radius:12px; padding:18px; }
.cl-ttl { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:var(--text4); margin-bottom:14px; font-family:monospace; }
.cl-item { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:8px; background:var(--surface2); margin-bottom:6px; }
.cl-item:last-child { margin-bottom:0; }
.cl-item--ok { background:transparent; }
.cl-dot { width:22px; height:22px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
.cl-dot--ok   { background:#dcfce7; color:#16a34a; }
.cl-dot--warn { background:#fef9c3; color:#854d0e; }
.cl-lbl  { font-size:13px; font-weight:500; color:var(--text2); flex:1; }
.cl-hint { font-size:11px; color:var(--text4); }
.cl-fix  { font-size:11px; font-weight:600; color:var(--text); background:none; border:none; cursor:pointer; padding:3px 8px; border-radius:5px; transition:background .15s; }
.cl-fix:hover { background:var(--surface2); }

.detail-tbl { background:var(--surface); border:1.5px solid var(--border); border-radius:12px; overflow:hidden; }
.dt-row { display:flex; justify-content:space-between; align-items:center; padding:10px 16px; border-bottom:1px solid var(--border2); font-size:13px; }
.dt-row:last-child { border-bottom:none; }
.dt-k { color:var(--text4); font-weight:500; }
.dt-v { color:var(--text2); font-weight:600; max-width:60%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

/* ── Step nav ── */
.step-foot { display:flex; align-items:center; justify-content:space-between; margin-top:36px; padding-top:20px; border-top:1px solid var(--border2); }
.btn-bck { display:flex; align-items:center; gap:6px; padding:9px 16px; border-radius:8px; border:1.5px solid var(--border); background:var(--surface); font-size:13px; font-weight:600; color:var(--text3); cursor:pointer; transition:all .15s; }
.btn-bck:hover { border-color:var(--text3); color:var(--text); }
.btn-nxt { display:flex; align-items:center; gap:6px; padding:10px 20px; border-radius:8px; background:var(--text); color:var(--surface); font-size:13.5px; font-weight:700; cursor:pointer; border:none; transition:all .15s; }
.btn-nxt:hover:not(:disabled) { opacity:.85; transform:translateY(-1px); box-shadow:0 4px 14px rgba(0,0,0,.15); }
.btn-nxt:disabled { opacity:.3; cursor:not-allowed; }

/* ── Spinner ── */
.spinner { width:14px; height:14px; border-radius:50%; border:2px solid rgba(255,255,255,.25); border-top-color:#fff; animation:spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg) } }

/* ── Toast ── */
.toast { position:fixed; bottom:24px; right:24px; background:#18181b; color:#fff; padding:12px 22px; border-radius:10px; font-size:13.5px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.25); z-index:500; }
.toast--err { background:#ef4444; }
.tst-enter-active { transition:all .3s cubic-bezier(.34,1.56,.64,1); }
.tst-leave-active { transition:all .2s ease; }
.tst-enter-from, .tst-leave-to { opacity:0; transform:translateY(16px) scale(.9); }

/* ── Slide transition ── */
.slide-enter-active { transition:all .28s cubic-bezier(.25,.46,.45,.94); }
.slide-leave-active { transition:all .2s ease; }
.slide-enter-from   { opacity:0; transform:translateX(22px); }
.slide-leave-to     { opacity:0; transform:translateX(-22px); }
.fd-enter-active, .fd-leave-active { transition:all .2s ease; }
.fd-enter-from, .fd-leave-to { opacity:0; transform:translateY(-6px); }

/* ── Split toggle ── */
.split-toggle { display:flex; align-items:center; gap:8px; cursor:pointer; margin-left:auto; font-size:12.5px; font-weight:600; color:var(--text3); transition:color .15s; }
.split-toggle:hover { color:var(--text); }
.split-knob { width:36px; height:20px; border-radius:10px; background:var(--border); position:relative; transition:background .2s; flex-shrink:0; }
.split-knob::after { content:''; position:absolute; width:14px; height:14px; border-radius:50%; background:#fff; top:3px; left:3px; transition:left .2s; box-shadow:0 1px 3px rgba(0,0,0,.2); }
.split-knob.on { background:var(--text); }
.split-knob.on::after { left:19px; }

/* ── MD Preview styled ── */
.md-prev { width:50%; display:flex; flex-direction:column; background:var(--surface); }
.md-prev-header { display:flex; align-items:center; justify-content:space-between; padding:8px 16px; background:var(--surface2); border-bottom:1px solid var(--border2); flex-shrink:0; }
.md-prev-label  { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:var(--accent,#4f46e5); font-family:monospace; }
.md-prev-wc     { font-size:11px; color:var(--text5); }
.md-prev-body   { flex:1; padding:16px 18px; overflow-y:auto; font-size:14px; line-height:1.8; color:var(--text2); }

/* ── Full Resource Preview ── */
.resource-full-preview { border:1.5px solid var(--border); border-radius:16px; overflow:hidden; margin-bottom:28px; box-shadow:0 4px 24px rgba(0,0,0,.06); }

.rfp-hero { display:grid; grid-template-columns:1fr 300px; gap:0; align-items:start; padding:40px 40px 36px; }
.rfp-hero-inner { padding-right:32px; }
.rfp-breadcrumb { font-size:12px; color:var(--text4); margin-bottom:14px; }
.rfp-breadcrumb span { margin:0 4px; opacity:.5; }
.rfp-badges { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
.rfp-type-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 12px; border-radius:20px; font-size:11.5px; font-weight:600; font-family:monospace; background:rgba(0,0,0,.08); color:var(--text2); }
.rfp-status-badge { padding:4px 12px; border-radius:20px; font-size:11.5px; font-weight:600; }
.rfp-status-badge--pub  { background:#dcfce7; color:#15803d; }
.rfp-status-badge--pend { background:#fef9c3; color:#854d0e; }
.rfp-title       { font-size:clamp(22px,3vw,34px); font-weight:800; color:var(--text); letter-spacing:-.8px; line-height:1.18; margin-bottom:12px; }
.rfp-short-desc  { font-size:15px; color:var(--text3); line-height:1.7; margin-bottom:14px; }
.rfp-tags        { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px; }
.rfp-tag         { padding:4px 10px; border-radius:6px; font-size:11.5px; font-weight:600; background:rgba(0,0,0,.07); color:var(--text2); border:1px solid rgba(0,0,0,.08); }
.rfp-meta        { display:flex; align-items:center; gap:12px; font-size:12.5px; color:var(--text3); flex-wrap:wrap; }
.rfp-meta span   { display:flex; align-items:center; gap:5px; }

.rfp-buy-card   { background:var(--surface); border:1.5px solid var(--border); border-radius:14px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.08); }
.rfp-buy-cover  { height:160px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.rfp-buy-img    { width:100%; height:100%; object-fit:cover; }
.rfp-buy-body   { padding:18px; }
.rfp-price      { font-size:28px; font-weight:800; color:var(--text); margin-bottom:14px; font-family:monospace; }
.rfp-price--free { color:#16a34a; }
.rfp-cta        { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.rfp-btn-main   { padding:12px; border-radius:9px; background:var(--text); color:var(--surface); font-size:13.5px; font-weight:700; text-align:center; }
.rfp-btn-demo   { padding:10px; border-radius:9px; border:1.5px solid var(--border); font-size:13px; font-weight:600; color:var(--text2); text-align:center; }
.rfp-includes   { border-top:1px solid var(--border2); padding-top:14px; }
.rfp-inc-ttl    { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--text4); margin-bottom:8px; font-family:monospace; }
.rfp-inc        { font-size:12.5px; color:var(--text2); margin-bottom:6px; }

.rfp-body       { padding:36px 40px; background:var(--surface); border-top:1px solid var(--border2); }
.rfp-tabs       { display:flex; gap:0; border-bottom:1px solid var(--border); margin-bottom:28px; }
.rfp-tab        { padding:10px 20px; font-size:13.5px; font-weight:600; color:var(--text3); border-bottom:2px solid transparent; cursor:pointer; margin-bottom:-1px; transition:all .15s; }
.rfp-tab--on    { color:var(--accent,#4f46e5); border-bottom-color:var(--accent,#4f46e5); }
.rfp-content    { font-size:15px; line-height:1.85; color:var(--text2); }
.rfp-empty      { text-align:center; padding:40px; color:var(--text4); }
.rfp-empty p    { margin-bottom:12px; font-size:14px; }
.rfp-empty-btn  { padding:8px 18px; border-radius:8px; background:var(--text); color:var(--surface); border:none; font-size:13px; font-weight:600; cursor:pointer; }

/* ── Responsive ── */
@media (max-width:900px) {
  .dual-col  { grid-template-columns:1fr; }
  .col-side  { order:-1; }
  .recap-layout { grid-template-columns:1fr; }
  .rfp-hero { grid-template-columns:1fr; padding:28px 24px; }
  .rfp-hero-inner { padding-right:0; margin-bottom:20px; }
  .rfp-body { padding:24px; }
}
@media (max-width:600px) {
  .step-label, .step-sub { display:none; }
  .step-connector { min-width:10px; margin:0 8px; }
  .step-title { font-size:18px; }
  .md-wrap--split .md-ta { width:100%; border-right:none; }
  .md-prev { display:none; }
  .split-toggle { display:none; }
}

/* ── Step 4 : Aperçu client ── */
.preview-badge { background: linear-gradient(135deg, #4f46e5, #7c3aed) !important; }
.preview-live-chip {
  display:flex; align-items:center; gap:6px; margin-left:auto;
  padding:6px 12px; border-radius:20px;
  background:#dcfce7; color:#15803d;
  font-size:11.5px; font-weight:700; font-family:monospace;
}
.plc-dot { width:7px; height:7px; border-radius:50%; background:#16a34a; animation:blink2 1.5s ease-in-out infinite; }
@keyframes blink2 { 0%,100% { opacity:1 } 50% { opacity:.3 } }

.client-preview-wrap { border:1.5px solid var(--border); border-radius:16px; overflow:hidden; margin-bottom:24px; box-shadow:0 6px 32px rgba(0,0,0,.08); }

.cp-banner { display:flex; align-items:center; gap:8px; padding:10px 20px; background:#fffbeb; border-bottom:1px solid #fde68a; font-size:12.5px; font-weight:600; color:#92400e; }

/* Hero */
.cp-hero { display:grid; grid-template-columns:1fr 300px; gap:32px; padding:40px; align-items:start; }
.cp-bc   { font-size:12px; color:var(--text4); margin-bottom:14px; }
.cp-bc span { margin:0 4px; opacity:.5; }
.cp-badges { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
.cp-badge-type   { display:inline-flex; align-items:center; gap:5px; padding:4px 12px; border-radius:20px; font-size:11.5px; font-weight:600; background:rgba(0,0,0,.08); color:var(--text2); font-family:monospace; }
.cp-badge-status { padding:4px 12px; border-radius:20px; font-size:11.5px; font-weight:600; }
.cp-title  { font-size:clamp(22px,3vw,34px); font-weight:800; color:var(--text); letter-spacing:-.8px; line-height:1.18; margin-bottom:12px; }
.cp-short  { font-size:15px; color:var(--text3); line-height:1.7; margin-bottom:14px; }
.cp-tags   { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; }
.cp-tag    { padding:4px 10px; border-radius:6px; font-size:11.5px; font-weight:600; background:rgba(0,0,0,.07); color:var(--text2); border:1px solid rgba(0,0,0,.08); }
.cp-stats  { display:flex; align-items:center; gap:8px; font-size:12.5px; color:var(--text4); flex-wrap:wrap; }
.cp-dot    { opacity:.4; }
.cp-github-link { display:inline-flex; align-items:center; gap:4px; color:var(--text3); text-decoration:none; font-weight:500; }
.cp-github-link:hover { color:var(--text); }

/* Buy card */
.cp-buy-card   { background:var(--surface); border:1.5px solid var(--border); border-radius:14px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.08); }
.cp-buy-cover  { height:160px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.cp-buy-img    { width:100%; height:100%; object-fit:cover; }
.cp-buy-body   { padding:18px; }
.cp-price      { font-size:28px; font-weight:800; color:var(--text); margin-bottom:14px; font-family:monospace; }
.cp-price--free { color:#16a34a; }
.cp-cta-btn    { width:100%; padding:13px; border-radius:9px; background:var(--text); color:var(--surface); font-size:13.5px; font-weight:700; border:none; cursor:default; margin-bottom:8px; display:block; text-align:center; }
.cp-demo-btn   { width:100%; padding:10px; border-radius:9px; border:1.5px solid var(--border); font-size:13px; font-weight:600; color:var(--text2); background:transparent; cursor:default; margin-bottom:16px; display:block; text-align:center; }
.cp-includes   { border-top:1px solid var(--border2); padding-top:14px; }
.cp-includes-ttl { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--text4); margin-bottom:10px; font-family:monospace; }
.cp-inc        { display:flex; align-items:center; gap:6px; font-size:12.5px; color:var(--text2); margin-bottom:7px; }

/* Body description */
.cp-body        { padding:36px 40px; background:var(--surface); border-top:1px solid var(--border2); }
.cp-tabs        { display:flex; gap:0; border-bottom:1px solid var(--border); margin-bottom:28px; }
.cp-tab         { padding:10px 20px; font-size:13.5px; font-weight:600; color:var(--text3); border-bottom:2px solid transparent; cursor:default; margin-bottom:-1px; }
.cp-tab--on     { color:var(--accent,#4f46e5); border-bottom-color:var(--accent,#4f46e5); }
.cp-desc-content { font-size:15px; line-height:1.85; color:var(--text2); }
.cp-no-desc     { display:flex; flex-direction:column; align-items:center; gap:12px; padding:48px 20px; color:var(--text4); text-align:center; }
.cp-no-desc p   { font-size:14px; }
.cp-write-btn   { padding:9px 20px; border-radius:8px; background:var(--text); color:var(--surface); border:none; font-size:13px; font-weight:600; cursor:pointer; }

/* Approval CTA */
.cp-approval {
  display:flex; align-items:center; justify-content:space-between;
  gap:20px; padding:20px 24px; flex-wrap:wrap;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border:1.5px solid #86efac; border-radius:12px;
  margin-bottom:8px;
}
.cp-approval-left  { display:flex; align-items:center; gap:14px; }
.cp-approval-icon  { font-size:32px; flex-shrink:0; }
.cp-approval-title { font-size:15px; font-weight:700; color:#14532d; margin-bottom:3px; }
.cp-approval-sub   { font-size:13px; color:#166534; opacity:.8; }
.cp-approval-actions { display:flex; gap:10px; flex-shrink:0; }
.cp-btn-edit { padding:9px 16px; border-radius:8px; border:1.5px solid #86efac; background:transparent; font-size:13px; font-weight:600; color:#15803d; cursor:pointer; transition:all .15s; }
.cp-btn-edit:hover { background:#dcfce7; }
.cp-btn-approve {
  display:flex; align-items:center; gap:7px;
  padding:10px 22px; border-radius:8px;
  background:#16a34a; color:#fff;
  font-size:14px; font-weight:700; border:none; cursor:pointer;
  transition:all .15s; box-shadow:0 3px 12px rgba(22,163,74,.3);
}
.cp-btn-approve:hover { background:#15803d; transform:translateY(-1px); box-shadow:0 5px 18px rgba(22,163,74,.4); }

</style>