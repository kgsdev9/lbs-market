<template>
  <div class="ae-shell">

    <!-- ══ TOP BAR ══ -->
    <div class="ae-topbar">
      <RouterLink to="/dashboard/articles" class="ae-back">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Articles
      </RouterLink>
      <div class="ae-topbar-mid">
        <div class="ae-title">{{ isEdit ? "Modifier l'article" : 'Nouvel article' }}</div>
        <div v-if="form.title" class="ae-draft-name">{{ form.title }}</div>
      </div>
      <div class="ae-topbar-right">
        <div class="ae-status-row">
          <button class="ae-status-btn" :class="{ on: form.status === 'draft' }" @click="form.status = 'draft'">📝 Brouillon</button>
          <button class="ae-status-btn" :class="{ on: form.status === 'published' }" @click="form.status = 'published'">🚀 Publié</button>
        </div>
        <button class="ae-save-btn" @click="saveAs" :disabled="saving">
          <span v-if="saving" class="ae-spinner"/>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          {{ saving ? 'Sauvegarde...' : (isEdit ? 'Mettre à jour' : 'Sauvegarder') }}
        </button>
      </div>
    </div>

    <!-- ══ STEPPER ══ -->
    <div class="ae-stepper">
      <template v-for="(s, i) in steps" :key="i">
        <div class="ae-step" :class="{ 'ae-step--on': currentStep === i+1, 'ae-step--done': currentStep > i+1, 'ae-step--off': currentStep < i+1 }"
          @click="currentStep > i+1 ? currentStep = i+1 : null">
          <div class="ae-step-dot">
            <svg v-if="currentStep > i+1" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span v-else>{{ i+1 }}</span>
          </div>
          <div class="ae-step-txt">
            <span class="ae-step-lbl">{{ s.label }}</span>
            <span class="ae-step-sub">{{ s.sub }}</span>
          </div>
        </div>
        <div v-if="i < steps.length-1" class="ae-step-line" :class="{ done: currentStep > i+1 }"/>
      </template>
    </div>

    <!-- ══ BODY ══ -->
    <div class="ae-body">

      <!-- ─── ÉTAPE 1 — Infos ─── -->
      <Transition name="sl" mode="out-in">
      <div v-if="currentStep === 1" key="s1" class="ae-pane">
        <div class="ae-ph">
          <div class="ae-pnum">01</div>
          <div>
            <h2 class="ae-ptitle">Informations de base</h2>
            <p class="ae-psub">Titre, accroche et méta-données de l'article</p>
          </div>
        </div>

        <div class="ae-grid">
          <div class="ae-col-main">

            <div class="ae-field">
              <label class="ae-lbl">Titre de l'article <span class="ae-req">*</span></label>
              <textarea v-model="form.title" class="ae-input ae-title-ta" placeholder="Un titre percutant pour ton article..." rows="2"/>
              <div class="ae-hint">{{ form.title.length }}/120 caractères — sois clair et précis</div>
            </div>

            <div class="ae-field">
              <label class="ae-lbl">Résumé / accroche</label>
              <textarea v-model="form.excerpt" class="ae-input ae-excerpt-ta" rows="3" placeholder="2-3 phrases qui donnent envie de lire l'article..."/>
              <div class="ae-hint-row">
                <span>Affiché dans les listes et les aperçus</span>
                <span :class="{ 'ae-warn': form.excerpt.length > 280 }">{{ form.excerpt.length }}/300</span>
              </div>
            </div>

          </div>

          <div class="ae-col-side">

            <!-- ── IMAGE DE COUVERTURE ── -->
            <div class="ae-side-box">
              <div class="ae-side-ttl">Image de couverture</div>
              <div class="ae-img-zone" :class="{ filled: form.image }" @click="$refs.imgInput.click()">
                <img v-if="form.image" :src="form.image" class="ae-img-preview"/>
                <div v-else class="ae-img-ph">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>Clique pour uploader</span>
                  <span style="font-size:10.5px;color:var(--text5)">PNG, JPG — max 2 Mo</span>
                </div>
              </div>
              <input ref="imgInput" type="file" accept="image/*" style="display:none" @change="onImageChange"/>
              <button v-if="form.image" class="ae-img-rm" @click="form.image = null">✕ Supprimer</button>
            </div>

            <div class="ae-side-box">
              <div class="ae-side-ttl">Couleur de couverture</div>
              <div class="ae-clr-preview" :style="{ background: form.coverColor }">
                <span style="font-size:32px">✍️</span>
              </div>
              <div class="ae-clr-row">
                <div v-for="c in coverColors" :key="c" class="ae-clr" :style="{ background: c }" :class="{ on: form.coverColor === c }" @click="form.coverColor = c"/>
              </div>
            </div>

            <div class="ae-side-box">
              <div class="ae-side-ttl">Temps de lecture</div>
              <input v-model="form.readTime" class="ae-input" placeholder="ex: 8 min"/>
            </div>

          </div>
        </div>

        <div class="ae-nav">
          <div/>
          <button class="ae-btn-next" @click="currentStep++" :disabled="!step1Valid">
            Suivant — Contenu
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      </Transition>

      <!-- ─── ÉTAPE 2 — Contenu ─── -->
      <Transition name="sl" mode="out-in">
      <div v-if="currentStep === 2" key="s2" class="ae-pane ae-pane--editor">
        <div class="ae-ph">
          <div class="ae-pnum">02</div>
          <div>
            <h2 class="ae-ptitle">Rédaction du contenu</h2>
            <p class="ae-psub">Écris ton article en Markdown — aperçu en temps réel</p>
          </div>
          <div class="ae-split-toggle" @click="splitMode = !splitMode">
            <div class="ae-split-knob" :class="{ on: splitMode }"/>
            <span>Split view</span>
          </div>
        </div>

        <div class="ae-editor-wrap" :class="{ split: splitMode }">
          <div class="ae-editor-side">
            <div class="ae-toolbar">
              <button class="ae-tb" @click="wrap('**','**')"><b>B</b></button>
              <button class="ae-tb" @click="wrap('*','*')"><i>I</i></button>
              <button class="ae-tb" @click="wrap('`','`')"><code>`</code></button>
              <div class="ae-tsep"/>
              <button class="ae-tb" @click="insertLine('## ')">H2</button>
              <button class="ae-tb" @click="insertLine('### ')">H3</button>
              <button class="ae-tb" @click="insertLine('- ')">• liste</button>
              <button class="ae-tb" @click="insertLine('> ')">❝ quote</button>
              <div class="ae-tsep"/>
              <button class="ae-tb" @click="insertCode('bash')">bash</button>
              <button class="ae-tb" @click="insertCode('php')">php</button>
              <button class="ae-tb" @click="insertCode('javascript')">js</button>
              <button class="ae-tb" @click="insertCode('vue')">vue</button>
              <button class="ae-tb" @click="insertCode('sql')">sql</button>
              <div class="ae-tsep"/>
              <button class="ae-tb" @click="wrap('[','](url)')">🔗</button>
              <div class="ae-tright">
                <span class="ae-wordcount">{{ wordCount }} mots</span>
              </div>
            </div>
            <textarea
              ref="editorRef"
              v-model="form.content"
              class="ae-textarea"
              placeholder="## Introduction&#10;&#10;Commence à écrire ton article ici...&#10;&#10;```bash&#10;npm install&#10;```"
            />
          </div>
          <div v-if="splitMode" class="ae-preview-side">
            <div class="ae-preview-header">
              <span class="ae-preview-badge">Aperçu live</span>
              <span class="ae-preview-readtime">{{ form.readTime || '—' }}</span>
            </div>
            <div class="ae-preview-content" v-html="renderedContent"/>
          </div>
        </div>

        <div class="ae-nav">
          <button class="ae-btn-back" @click="currentStep--">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <button class="ae-btn-next" @click="currentStep++">
            Suivant — Tags
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      </Transition>

      <!-- ─── ÉTAPE 3 — Tags ─── -->
      <Transition name="sl" mode="out-in">
      <div v-if="currentStep === 3" key="s3" class="ae-pane">
        <div class="ae-ph">
          <div class="ae-pnum">03</div>
          <div>
            <h2 class="ae-ptitle">Tags & Catégories</h2>
            <p class="ae-psub">Classe ton article pour améliorer sa découvrabilité</p>
          </div>
        </div>

        <div class="ae-grid">
          <div class="ae-col-main">
            <div class="ae-tags-search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input v-model="tagSearch" class="ae-tags-search" placeholder="Rechercher un tag…"/>
            </div>
            <div v-if="selectedTags.length" class="ae-sel-tags">
              <div class="ae-sel-tags-lbl">Tags sélectionnés</div>
              <div class="ae-sel-tags-list">
                <span v-for="tag in selectedTags" :key="tag.id" class="ae-sel-tag" @click="removeTag(tag.id)">
                  {{ tag.name }}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </span>
              </div>
            </div>
            <div class="ae-avail-tags-wrap">
              <div class="ae-avail-tags-lbl">Cliquer pour ajouter</div>
              <div v-if="tagsLoading" class="ae-tags-skel">
                <span v-for="n in 10" :key="n" class="ae-tag-skel"/>
              </div>
              <div v-else class="ae-avail-tags">
                <span v-for="tag in filteredAvailableTags" :key="tag.id" class="ae-avail-tag" :class="{ on: isTagSelected(tag.id) }" @click="toggleTag(tag)">
                  <span v-if="isTagSelected(tag.id)">✓</span>
                  <span v-else>+</span>
                  {{ tag.name }}
                </span>
                <span v-if="filteredAvailableTags.length === 0" class="ae-no-tags">Aucun tag trouvé</span>
              </div>
            </div>
          </div>
          <div class="ae-col-side">
            <div class="ae-side-box ae-tags-tip">
              <div class="ae-side-ttl">💡 Conseils</div>
              <ul class="ae-tip-list">
                <li>Utilise 3-5 tags pertinents</li>
                <li>Privilégie les tags populaires</li>
                <li>Spécifie la techno principale</li>
                <li>Ajoute le niveau si applicable</li>
              </ul>
              <div v-if="selectedTags.length" class="ae-tags-count-chip">
                {{ selectedTags.length }} tag{{ selectedTags.length > 1 ? 's' : '' }} sélectionné{{ selectedTags.length > 1 ? 's' : '' }}
              </div>
            </div>
          </div>
        </div>

        <div class="ae-nav">
          <button class="ae-btn-back" @click="currentStep--">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <button class="ae-btn-next" @click="currentStep++">
            Suivant — Récapitulatif
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      </Transition>

      <!-- ─── ÉTAPE 4 — Récapitulatif + Preview ─── -->
      <Transition name="sl" mode="out-in">
      <div v-if="currentStep === 4" key="s4" class="ae-pane">
        <div class="ae-ph">
          <div class="ae-pnum">04</div>
          <div>
            <h2 class="ae-ptitle">Récapitulatif & Preview</h2>
            <p class="ae-psub">L'article tel qu'il sera vu par les lecteurs</p>
          </div>
        </div>

        <div class="ae-article-preview">

          <!-- Hero -->
          <div class="ap-hero" :style="{ background: `linear-gradient(135deg, ${form.coverColor} 0%, var(--surface) 100%)` }">
            <div class="ap-hero-inner">
              <div v-if="selectedTags.length" class="ap-tags">
                <span v-for="tag in selectedTags.slice(0,3)" :key="tag.id" class="ap-tag">{{ tag.name }}</span>
              </div>
              <h1 class="ap-title">{{ form.title || "Titre de l'article..." }}</h1>
              <p class="ap-excerpt">{{ form.excerpt || "Résumé de l'article..." }}</p>
              <div class="ap-meta">
                <div class="ap-author">
                  <div class="ap-avatar">{{ authorInitials }}</div>
                  <div>
                    <div class="ap-author-name">{{ auth.user?.name || 'Auteur' }}</div>
                    <div class="ap-author-role">Auteur · {{ today }}</div>
                  </div>
                </div>
                <div class="ap-stats">
                  <span>📖 {{ form.readTime || '5 min' }}</span>
                  <span class="ap-sep">·</span>
                  <span class="ap-status-chip" :class="form.status === 'published' ? 'chip-green' : 'chip-gray'">
                    {{ form.status === 'published' ? '🚀 Publié' : '📝 Brouillon' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Cover banner — image si disponible, sinon couleur + emoji -->
          <div class="ap-cover-banner" :style="form.image ? {} : { background: form.coverColor }">
            <img v-if="form.image" :src="form.image" class="ap-cover-img"/>
            <div v-else class="ap-cover-icon">✍️</div>
          </div>

          <!-- Corps -->
          <div class="ap-body">
            <div v-if="form.content" class="ap-content" v-html="renderedContent"/>
            <div v-else class="ap-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <p>Aucun contenu rédigé pour le moment.</p>
              <button class="ap-write-btn" @click="currentStep = 2">✏️ Aller rédiger</button>
            </div>
          </div>

        </div>

        <!-- Checklist -->
        <div class="ae-checklist">
          <div class="ae-cl-ttl">Checklist avant publication</div>
          <div class="ae-cl-items">
            <div v-for="c in checklist" :key="c.label" class="ae-cl-item" :class="{ ok: c.ok }">
              <div class="ae-cl-dot" :class="c.ok ? 'ae-cl-ok' : 'ae-cl-warn'">
                <svg v-if="c.ok" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                <svg v-else width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>
              </div>
              <span class="ae-cl-lbl">{{ c.label }}</span>
              <span v-if="!c.ok" class="ae-cl-hint">{{ c.hint }}</span>
              <button v-if="!c.ok" class="ae-cl-fix" @click="currentStep = c.step">Corriger →</button>
            </div>
          </div>
        </div>

        <div class="ae-nav">
          <button class="ae-btn-back" @click="currentStep--">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <div style="display:flex;gap:10px">
            <button class="ae-draft-save" @click="form.status='draft'; saveAs()" :disabled="saving">💾 Sauvegarder brouillon</button>
            <button class="ae-publish-btn" @click="form.status='published'; saveAs()" :disabled="saving">
              <span v-if="saving" class="ae-spinner"/>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ isEdit ? 'Mettre à jour' : "🚀 Publier l'article" }}
            </button>
          </div>
        </div>
      </div>
      </Transition>

    </div>

    <!-- ══ TOAST ══ -->
    <Transition name="tst">
      <div v-if="toast.show" class="ae-toast" :class="{ err: toast.error }">{{ toast.message }}</div>
    </Transition>

  </div>
</template>

<script>
import API from '@/services/api'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
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
  name: 'ArticleEditorStepper',
  components: { RouterLink },

  setup() {
    const auth = useAuthStore()
    return { auth }
  },

  data() {
    return {
      currentStep: 1,
      splitMode:   true,
      saving:      false,
      allTags:     [],
      tagSearch:   '',
      tagsLoading: false,
      toast: { show: false, message: '', error: false },

      steps: [
        { label: 'Informations', sub: 'Titre & méta'    },
        { label: 'Contenu',      sub: 'Rédaction live'  },
        { label: 'Tags',         sub: 'Catégorisation'  },
        { label: 'Publication',  sub: 'Preview finale'  },
      ],

      coverColors: ['#dbeafe','#dcfce7','#fef9c3','#ede9fe','#ffedd5','#fee2e2','#e0f2fe','#fce7f3','#f0fdf4','#f1f5f9'],

      form: {
        title:      '',
        excerpt:    '',
        content:    '',
        image:      null,   // ← base64
        tags:       [],
        coverColor: '#dbeafe',
        readTime:   '5 min',
        status:     'draft',
      },
    }
  },

  computed: {
    isEdit()     { return !!this.$route.params.id },
    step1Valid() { return this.form.title.trim().length > 3 },
    selectedTags() { return this.allTags.filter(t => this.form.tags.includes(t.id)) },
    filteredAvailableTags() {
      const q = this.tagSearch.trim().toLowerCase()
      return q ? this.allTags.filter(t => t.name.toLowerCase().includes(q)) : this.allTags
    },
    wordCount() {
      if (!this.form.content) return 0
      return this.form.content.trim().split(/\s+/).filter(Boolean).length
    },
    authorInitials() {
      const name = this.auth.user?.name
      if (!name) return '?'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
    },
    today() {
      return new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    },
    checklist() {
      return [
        { label: 'Titre renseigné',         ok: this.form.title.trim().length > 3,         hint: 'Ajoute un titre percutant',          step: 1 },
        { label: 'Résumé présent',           ok: this.form.excerpt.trim().length > 10,      hint: 'Ajoute un résumé accrocheur',        step: 1 },
        { label: 'Contenu rédigé',           ok: this.form.content.trim().length > 50,      hint: 'Rédige le contenu principal',        step: 2 },
        { label: 'Contenu suffisant',        ok: this.wordCount >= 100,                     hint: `${this.wordCount}/100 mots minimum`, step: 2 },
        { label: 'Au moins un tag',          ok: this.form.tags.length > 0,                 hint: 'Ajoute au moins un tag',             step: 3 },
        { label: 'Temps de lecture défini',  ok: !!this.form.readTime.trim(),               hint: 'Ex: 5 min',                          step: 1 },
      ]
    },
    renderedContent() {
      let md = this.form.content
      if (!md) return '<p style="color:#aaa;font-style:italic">Commence à écrire...</p>'
      md = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        const language = lang || 'plaintext'
        const label    = lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : 'Code'
        let highlighted
        try { highlighted = hljs.highlight(code.trimEnd(), { language }).value }
        catch { highlighted = code.trimEnd().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
        const encoded = btoa(unescape(encodeURIComponent(code.trimEnd())))
        return `<div class="code-block"><div class="code-hd"><span class="code-lang-txt">&lt;/&gt; ${label}</span><button class="code-copy" onclick="copyCode(this)" data-code="${encoded}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button></div><pre><code class="hljs language-${language}">${highlighted}</code></pre></div>`
      })
      let h2n = 0
      md = md.replace(/^## (.+)$/gm, (_, t) => { h2n++; return `<h2 class="p-h2"><span class="p-h2n">${h2n}</span>${t}</h2>` })
      md = md.replace(/^### (.+)$/gm, '<h3 class="p-h3">$1</h3>')
      md = md.replace(/^# (.+)$/gm,   '<h1 class="p-h1">$1</h1>')
      md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      md = md.replace(/\*(.+?)\*/g,     '<em>$1</em>')
      md = md.replace(/`([^`]+)`/g,     '<code class="p-ic">$1</code>')
      md = md.replace(/^> (.+)$/gm,     '<blockquote class="p-bq">$1</blockquote>')
      md = md.replace(/^- (.+)$/gm,     '<li>$1</li>')
      md = md.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, s => `<ul class="p-ul">${s}</ul>`)
      md = md.replace(/\n\n(?!<)/g, '</p><p class="p-p">')
      return '<p class="p-p">' + md + '</p>'
    },
  },

  async mounted() {
    this.fetchTags()
    if (this.isEdit) this.fetchArticle()
    window.copyCode = (btn) => {
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

  beforeUnmount() { delete window.copyCode },

  methods: {
    async fetchTags() {
      this.tagsLoading = true
      try {
        const { data } = await API.get('/admin/tags')
        this.allTags = Array.isArray(data) ? data : (data.data || [])
      } catch(e) { console.error(e) }
      finally { this.tagsLoading = false }
    },

    async fetchArticle() {
      try {
        const { data } = await API.get(`/admin/articles/${this.$route.params.id}`)
        this.form = {
          title:      data.title       || '',
          excerpt:    data.excerpt     || '',
          content:    data.content     || '',
          image:      data.image       || null,  // ← charger l'image existante
          tags:       data.tags ? data.tags.map(t => t.id) : [],
          coverColor: data.cover_color || '#dbeafe',
          readTime:   data.read_time   || '5 min',
          status:     data.status      || 'draft',
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

    isTagSelected(id) { return this.form.tags.includes(id) },
    toggleTag(tag)    { this.isTagSelected(tag.id) ? this.removeTag(tag.id) : this.form.tags.push(tag.id) },
    removeTag(id)     { this.form.tags = this.form.tags.filter(x => x !== id) },

    wrap(before, after) {
      const el = this.$refs.editorRef; if (!el) return
      const s = el.selectionStart, e = el.selectionEnd
      const sel = this.form.content.substring(s, e)
      this.form.content = this.form.content.substring(0, s) + before + sel + after + this.form.content.substring(e)
      this.$nextTick(() => { el.selectionStart = s + before.length; el.selectionEnd = s + before.length + sel.length; el.focus() })
    },
    insertLine(prefix) {
      const el = this.$refs.editorRef
      const s  = el ? el.selectionStart : this.form.content.length
      this.form.content = this.form.content.substring(0, s) + '\n' + prefix + this.form.content.substring(s)
      this.$nextTick(() => el && el.focus())
    },
    insertCode(lang) {
      const el = this.$refs.editorRef
      const s  = el ? el.selectionStart : this.form.content.length
      this.form.content = this.form.content.substring(0, s) + `\n\`\`\`${lang}\n\n\`\`\`\n` + this.form.content.substring(s)
      this.$nextTick(() => { if(el){ const c = s + lang.length + 5; el.selectionStart = c; el.selectionEnd = c; el.focus() } })
    },

    async saveAs() {
      if (!this.form.title.trim()) { this.showToast('Le titre est obligatoire', true); return }
      this.saving = true
      try {
        const payload = {
          title:       this.form.title,
          excerpt:     this.form.excerpt,
          content:     this.form.content,
          image:       this.form.image || null,  // ← envoi base64 ou null
          tags:        this.form.tags,
          cover_color: this.form.coverColor,
          read_time:   this.form.readTime,
          status:      this.form.status,
        }
        const url    = this.isEdit ? `/admin/articles/${this.$route.params.id}` : '/admin/articles'
        const method = this.isEdit ? 'put' : 'post'
        await API[method](url, payload)
        this.showToast(this.isEdit ? '✓ Article mis à jour' : '✓ Article sauvegardé')
        setTimeout(() => this.$router.push('/dashboard/articles'), 1200)
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
.ae-shell { display:flex; flex-direction:column; min-height:100vh; }

/* ══ Topbar ══ */
.ae-topbar { display:flex; align-items:center; gap:14px; padding:13px 0 18px; border-bottom:1px solid var(--border); flex-wrap:wrap; }
.ae-back { display:flex; align-items:center; gap:5px; font-size:13px; font-weight:500; color:var(--text3); text-decoration:none; padding:6px 10px; border-radius:7px; transition:all .15s; }
.ae-back:hover { color:var(--text); background:var(--surface2); }
.ae-topbar-mid { flex:1; min-width:0; }
.ae-title      { font-size:15px; font-weight:700; color:var(--text); }
.ae-draft-name { font-size:12px; color:var(--text4); margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ae-topbar-right { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.ae-status-row { display:flex; gap:5px; }
.ae-status-btn { padding:6px 12px; border-radius:7px; border:1.5px solid var(--border); background:var(--surface); font-size:12.5px; font-weight:600; color:var(--text3); cursor:pointer; transition:all .15s; }
.ae-status-btn.on { background:var(--text); color:var(--surface); border-color:var(--text); }
.ae-save-btn { display:flex; align-items:center; gap:6px; padding:8px 18px; border-radius:8px; background:var(--accent,#4f46e5); color:var(--accent-fg,#fff); font-size:13px; font-weight:700; cursor:pointer; border:none; transition:all .15s; }
.ae-save-btn:hover:not(:disabled) { opacity:.88; transform:translateY(-1px); }
.ae-save-btn:disabled { opacity:.35; cursor:not-allowed; }

/* ══ Stepper ══ */
.ae-stepper { display:flex; align-items:center; padding:24px 0 22px; border-bottom:1px solid var(--border2); margin-bottom:32px; max-width:720px; }
.ae-step { display:flex; align-items:center; gap:9px; cursor:pointer; }
.ae-step--off { opacity:.4; cursor:default; }
.ae-step-dot { width:32px; height:32px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; border:2px solid var(--border); background:var(--surface); color:var(--text3); transition:all .2s; }
.ae-step--on   .ae-step-dot { background:var(--text); color:var(--surface); border-color:var(--text); }
.ae-step--done .ae-step-dot { background:#16a34a; color:#fff; border-color:#16a34a; }
.ae-step-txt { display:flex; flex-direction:column; }
.ae-step-lbl { font-size:12.5px; font-weight:600; color:var(--text3); white-space:nowrap; }
.ae-step--on   .ae-step-lbl { color:var(--text); font-weight:700; }
.ae-step--done .ae-step-lbl { color:#16a34a; }
.ae-step-sub { font-size:10.5px; color:var(--text5); white-space:nowrap; }
.ae-step-line { flex:1; height:2px; background:var(--border2); margin:0 12px; min-width:16px; transition:background .3s; }
.ae-step-line.done { background:#16a34a; }

/* ══ Pane ══ */
.ae-pane { animation:paneIn .25s ease; }
@keyframes paneIn { from { opacity:0; transform:translateY(7px) } to { opacity:1; transform:translateY(0) } }
.ae-ph { display:flex; align-items:center; gap:16px; margin-bottom:28px; }
.ae-pnum { width:48px; height:48px; border-radius:12px; background:var(--text); color:var(--surface); display:flex; align-items:center; justify-content:center; font-size:17px; font-weight:800; font-family:monospace; flex-shrink:0; }
.ae-ptitle { font-size:20px; font-weight:800; color:var(--text); margin-bottom:3px; }
.ae-psub   { font-size:13.5px; color:var(--text3); }

/* ══ Grid ══ */
.ae-grid    { display:grid; grid-template-columns:1fr 260px; gap:24px; align-items:start; }
.ae-col-main { display:flex; flex-direction:column; gap:18px; }
.ae-col-side { display:flex; flex-direction:column; gap:12px; }

/* ══ Fields ══ */
.ae-field { display:flex; flex-direction:column; gap:6px; }
.ae-lbl   { font-size:11.5px; font-weight:700; color:var(--text3); text-transform:uppercase; letter-spacing:.5px; font-family:monospace; }
.ae-req   { color:#ef4444; }
.ae-input { padding:10px 13px; border:1.5px solid var(--border); border-radius:9px; background:var(--surface); color:var(--text); font-size:14px; font-family:inherit; width:100%; transition:all .18s; resize:vertical; }
.ae-input:focus { outline:none; border-color:var(--text); box-shadow:0 0 0 3px rgba(0,0,0,.05); }
.ae-title-ta   { font-size:18px; font-weight:700; line-height:1.4; min-height:64px; }
.ae-excerpt-ta { min-height:80px; line-height:1.6; color:var(--text2); }
.ae-hint       { font-size:12px; color:var(--text5); }
.ae-hint-row   { display:flex; justify-content:space-between; font-size:12px; color:var(--text5); }
.ae-warn       { color:#ef4444 !important; }

/* ══ Side box ══ */
.ae-side-box { background:var(--surface); border:1.5px solid var(--border); border-radius:12px; padding:16px; }
.ae-side-ttl { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:var(--text4); margin-bottom:12px; font-family:monospace; }

/* ══ IMAGE UPLOAD ══ */
.ae-img-zone { width:100%; height:110px; border:2px dashed var(--border); border-radius:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; overflow:hidden; transition:border-color .2s; background:var(--surface2); }
.ae-img-zone:hover { border-color:var(--text3); }
.ae-img-zone.filled { border-style:solid; padding:0; }
.ae-img-preview { width:100%; height:100%; object-fit:cover; }
.ae-img-ph { display:flex; flex-direction:column; align-items:center; gap:6px; color:var(--text4); font-size:12px; text-align:center; padding:12px; }
.ae-img-rm { margin-top:6px; font-size:12px; color:var(--text4); background:none; border:none; cursor:pointer; }
.ae-img-rm:hover { color:#ef4444; }

/* ══ Color ══ */
.ae-clr-preview { height:58px; border-radius:9px; display:flex; align-items:center; justify-content:center; margin-bottom:10px; transition:background .2s; }
.ae-clr-row { display:flex; flex-wrap:wrap; gap:6px; }
.ae-clr { width:22px; height:22px; border-radius:50%; cursor:pointer; border:2px solid transparent; transition:all .12s; }
.ae-clr.on { border-color:var(--text); transform:scale(1.2); }

/* ══ Editor ══ */
.ae-pane--editor .ae-ph { margin-bottom:16px; }
.ae-split-toggle { display:flex; align-items:center; gap:7px; cursor:pointer; margin-left:auto; font-size:12.5px; font-weight:600; color:var(--text3); transition:color .15s; }
.ae-split-toggle:hover { color:var(--text); }
.ae-split-knob { width:36px; height:20px; border-radius:10px; background:var(--border); position:relative; transition:background .2s; flex-shrink:0; }
.ae-split-knob::after { content:''; position:absolute; width:14px; height:14px; border-radius:50%; background:#fff; top:3px; left:3px; transition:left .2s; }
.ae-split-knob.on { background:var(--text); }
.ae-split-knob.on::after { left:19px; }
.ae-editor-wrap { display:grid; grid-template-columns:1fr; border:1.5px solid var(--border); border-radius:12px; overflow:hidden; min-height:480px; }
.ae-editor-wrap.split { grid-template-columns:1fr 1fr; }
.ae-editor-side { display:flex; flex-direction:column; border-right:1px solid var(--border2); }
.ae-editor-wrap:not(.split) .ae-editor-side { border-right:none; }
.ae-toolbar { display:flex; align-items:center; gap:2px; padding:8px 12px; background:var(--surface2); border-bottom:1px solid var(--border2); flex-wrap:wrap; }
.ae-tb { padding:0 7px; height:26px; border:none; background:none; color:var(--text3); border-radius:4px; cursor:pointer; font-size:11.5px; font-weight:700; font-family:monospace; transition:all .1s; }
.ae-tb:hover { background:var(--surface); color:var(--text); }
.ae-tsep { width:1px; height:16px; background:var(--border); margin:0 3px; }
.ae-tright { margin-left:auto; }
.ae-wordcount { font-size:11px; color:var(--text5); font-family:monospace; }
.ae-textarea { flex:1; border:none; outline:none; resize:none; padding:18px 20px; font-size:13.5px; font-family:monospace; color:var(--text); background:var(--surface); line-height:1.9; }
.ae-textarea::placeholder { color:var(--text5); }
.ae-preview-side { display:flex; flex-direction:column; background:var(--surface); overflow-y:auto; }
.ae-preview-header { display:flex; align-items:center; justify-content:space-between; padding:10px 18px; border-bottom:1px solid var(--border2); background:var(--surface2); flex-shrink:0; }
.ae-preview-badge { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:var(--accent,#4f46e5); font-family:monospace; }
.ae-preview-readtime { font-size:11.5px; color:var(--text4); }
.ae-preview-content { padding:20px 22px; flex:1; font-size:14.5px; line-height:1.8; color:var(--text2); overflow-y:auto; }

/* ══ Tags ══ */
.ae-tags-search-wrap { display:flex; align-items:center; gap:8px; padding:9px 12px; border:1.5px solid var(--border); border-radius:9px; background:var(--surface); color:var(--text4); margin-bottom:16px; }
.ae-tags-search { flex:1; border:none; outline:none; font-size:13.5px; color:var(--text); background:transparent; }
.ae-sel-tags { margin-bottom:18px; }
.ae-sel-tags-lbl { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--text4); margin-bottom:8px; font-family:monospace; }
.ae-sel-tags-list { display:flex; flex-wrap:wrap; gap:6px; }
.ae-sel-tag { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:20px; background:var(--text); color:var(--surface); font-size:12px; font-weight:600; cursor:pointer; transition:opacity .15s; }
.ae-sel-tag:hover { opacity:.8; }
.ae-avail-tags-lbl { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--text4); margin-bottom:10px; font-family:monospace; }
.ae-avail-tags { display:flex; flex-wrap:wrap; gap:6px; }
.ae-avail-tag { display:inline-flex; align-items:center; gap:4px; padding:6px 12px; border-radius:20px; background:var(--surface2); color:var(--text3); border:1.5px solid var(--border); font-size:12.5px; font-weight:500; cursor:pointer; transition:all .12s; }
.ae-avail-tag:hover { border-color:var(--text3); color:var(--text); }
.ae-avail-tag.on { background:var(--text); color:var(--surface); border-color:var(--text); }
.ae-no-tags { font-size:12px; color:var(--text5); }
.ae-tags-skel { display:flex; flex-wrap:wrap; gap:6px; }
.ae-tag-skel  { height:33px; width:74px; border-radius:20px; background:var(--surface2); animation:pulse .9s ease-in-out infinite alternate; }
@keyframes pulse { from { opacity:.4 } to { opacity:1 } }
.ae-tip-list { margin:0; padding-left:16px; display:flex; flex-direction:column; gap:5px; }
.ae-tip-list li { font-size:12.5px; color:var(--text3); line-height:1.5; }
.ae-tags-count-chip { margin-top:12px; padding:7px 12px; border-radius:8px; background:var(--surface2); font-size:12.5px; font-weight:600; color:var(--text2); text-align:center; }

/* ══ Article Preview ══ */
.ae-article-preview { border:1.5px solid var(--border); border-radius:16px; overflow:hidden; margin-bottom:28px; box-shadow:0 4px 24px rgba(0,0,0,.06); }
.ap-hero { padding:44px 48px 36px; }
.ap-hero-inner { max-width:680px; }
.ap-tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:18px; }
.ap-tag  { display:inline-block; padding:4px 12px; border-radius:20px; background:rgba(0,0,0,.08); font-size:11.5px; font-weight:600; color:var(--text2); font-family:monospace; }
.ap-title  { font-size:clamp(24px,3.5vw,38px); font-weight:800; color:var(--text); letter-spacing:-1px; line-height:1.15; margin-bottom:16px; }
.ap-excerpt { font-size:16.5px; color:var(--text2); line-height:1.7; margin-bottom:22px; }
.ap-meta { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; padding-top:18px; border-top:1px solid rgba(0,0,0,.1); }
.ap-author { display:flex; align-items:center; gap:11px; }
.ap-avatar { width:40px; height:40px; border-radius:50%; background:var(--accent,#4f46e5); color:var(--accent-fg,#fff); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; flex-shrink:0; }
.ap-author-name { font-size:14px; font-weight:600; color:var(--text); }
.ap-author-role { font-size:12px; color:var(--text4); margin-top:1px; }
.ap-stats { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--text3); }
.ap-sep   { opacity:.4; }
.ap-status-chip { padding:3px 10px; border-radius:20px; font-size:11.5px; font-weight:600; }
.chip-green { background:#dcfce7; color:#15803d; }
.chip-gray  { background:var(--surface2); color:var(--text3); }

/* Cover banner — image ou couleur ── */
.ap-cover-banner { height:220px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.ap-cover-img    { width:100%; height:100%; object-fit:cover; }
.ap-cover-icon   { font-size:72px; }

.ap-body { padding:40px 48px 48px; background:var(--surface); border-top:1px solid var(--border2); }
.ap-empty { display:flex; flex-direction:column; align-items:center; gap:12px; padding:48px 20px; color:var(--text4); text-align:center; }
.ap-empty svg { opacity:.3; }
.ap-empty p { font-size:14px; }
.ap-write-btn { padding:8px 18px; border-radius:8px; background:var(--text); color:var(--surface); border:none; font-size:13px; font-weight:600; cursor:pointer; }
.ap-write-btn:hover { opacity:.85; }

/* ══ Prose ══ */
:deep(.p-p)    { margin:14px 0; line-height:1.9; color:var(--text2); font-size:16px; }
:deep(.p-h1)   { font-size:28px; font-weight:800; margin:36px 0 14px; color:var(--text); letter-spacing:-.5px; }
:deep(.p-h2)   { display:flex; align-items:center; gap:12px; font-size:21px; font-weight:700; margin:36px 0 14px; color:var(--text); }
:deep(.p-h2n)  { display:inline-flex; align-items:center; justify-content:center; min-width:28px; height:28px; padding:0 7px; background:#18181b; color:#fff; font-size:12px; font-weight:700; border-radius:7px; font-family:monospace; flex-shrink:0; }
:deep(.p-h3)   { font-size:17px; font-weight:600; margin:26px 0 10px; color:var(--text); }
:deep(.p-ul)   { padding-left:6px; margin:14px 0; list-style:none; }
:deep(.p-ul li) { position:relative; padding-left:22px; margin:8px 0; line-height:1.8; color:var(--text2); font-size:16px; }
:deep(.p-ul li::before) { content:'•'; position:absolute; left:0; color:#18181b; font-weight:900; font-size:18px; line-height:1.6; }
:deep(.p-bq)  { border-left:4px solid #18181b; padding:12px 20px; margin:22px 0; background:var(--surface2); border-radius:0 10px 10px 0; color:var(--text3); font-style:italic; font-size:15.5px; line-height:1.8; }
:deep(.p-ic)  { background:var(--surface2); padding:2px 7px; border-radius:5px; font-family:monospace; font-size:13.5px; color:#e06c75; border:1px solid var(--border); }
:deep(.code-block) { margin:22px 0; border-radius:12px; overflow:hidden; border:1px solid var(--border); }
:deep(.code-hd)    { display:flex; align-items:center; justify-content:space-between; padding:10px 16px; background:var(--surface); border-bottom:1px solid var(--border); }
:deep(.code-lang-txt) { font-size:12px; font-weight:500; color:var(--text3); font-family:monospace; }
:deep(.code-copy)  { width:26px; height:26px; display:flex; align-items:center; justify-content:center; border-radius:6px; border:1px solid var(--border); background:transparent; color:var(--text3); cursor:pointer; transition:all .15s; }
:deep(.code-copy:hover)  { background:var(--surface2); color:var(--text); }
:deep(.code-copy.copied) { background:#1a7f37; color:#fff; border-color:#1a7f37; }
:deep(.code-block pre)  { margin:0; padding:20px; overflow-x:auto; background:#0d1117; }
:deep(.code-block code) { font-size:13.5px; line-height:1.8; font-family:monospace; }

/* ══ Checklist ══ */
.ae-checklist { background:var(--surface); border:1.5px solid var(--border); border-radius:12px; padding:20px; margin-bottom:28px; }
.ae-cl-ttl  { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:var(--text4); margin-bottom:14px; font-family:monospace; }
.ae-cl-items { display:flex; flex-direction:column; gap:7px; }
.ae-cl-item { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:8px; background:var(--surface2); }
.ae-cl-item.ok { background:transparent; }
.ae-cl-dot  { width:22px; height:22px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
.ae-cl-ok   { background:#dcfce7; color:#16a34a; }
.ae-cl-warn { background:#fef9c3; color:#854d0e; }
.ae-cl-lbl  { font-size:13px; font-weight:500; color:var(--text2); flex:1; }
.ae-cl-hint { font-size:11.5px; color:var(--text4); }
.ae-cl-fix  { font-size:12px; font-weight:600; color:var(--text); background:none; border:none; cursor:pointer; padding:3px 8px; border-radius:5px; white-space:nowrap; }
.ae-cl-fix:hover { background:var(--surface2); }

/* ══ Nav ══ */
.ae-nav { display:flex; align-items:center; justify-content:space-between; margin-top:32px; padding-top:20px; border-top:1px solid var(--border2); }
.ae-btn-back { display:flex; align-items:center; gap:6px; padding:9px 16px; border-radius:8px; border:1.5px solid var(--border); background:var(--surface); font-size:13px; font-weight:600; color:var(--text3); cursor:pointer; transition:all .15s; }
.ae-btn-back:hover { border-color:var(--text3); color:var(--text); }
.ae-btn-next { display:flex; align-items:center; gap:6px; padding:10px 20px; border-radius:8px; background:var(--text); color:var(--surface); font-size:13.5px; font-weight:700; cursor:pointer; border:none; transition:all .15s; }
.ae-btn-next:hover:not(:disabled) { opacity:.85; transform:translateY(-1px); box-shadow:0 4px 14px rgba(0,0,0,.15); }
.ae-btn-next:disabled { opacity:.3; cursor:not-allowed; }
.ae-draft-save { display:flex; align-items:center; gap:6px; padding:9px 16px; border-radius:8px; border:1.5px solid var(--border); background:var(--surface); font-size:13px; font-weight:600; color:var(--text2); cursor:pointer; transition:all .15s; }
.ae-draft-save:hover { border-color:var(--text3); }
.ae-draft-save:disabled { opacity:.4; cursor:not-allowed; }
.ae-publish-btn { display:flex; align-items:center; gap:6px; padding:10px 22px; border-radius:8px; background:var(--accent,#4f46e5); color:var(--accent-fg,#fff); font-size:14px; font-weight:700; cursor:pointer; border:none; transition:all .15s; }
.ae-publish-btn:hover:not(:disabled) { opacity:.88; transform:translateY(-1px); }
.ae-publish-btn:disabled { opacity:.35; cursor:not-allowed; }

/* ══ Spinner / Toast / Slide ══ */
.ae-spinner { width:13px; height:13px; border-radius:50%; border:2px solid rgba(255,255,255,.25); border-top-color:#fff; animation:spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg) } }
.ae-toast { position:fixed; bottom:24px; right:24px; background:#18181b; color:#fff; padding:12px 22px; border-radius:10px; font-size:13.5px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.25); z-index:500; }
.ae-toast.err { background:#ef4444; }
.tst-enter-active { transition:all .3s cubic-bezier(.34,1.56,.64,1); }
.tst-leave-active { transition:all .2s ease; }
.tst-enter-from, .tst-leave-to { opacity:0; transform:translateY(16px) scale(.9); }
.sl-enter-active { transition:all .28s cubic-bezier(.25,.46,.45,.94); }
.sl-leave-active { transition:all .2s ease; }
.sl-enter-from   { opacity:0; transform:translateX(22px); }
.sl-leave-to     { opacity:0; transform:translateX(-22px); }

/* ══ Responsive ══ */
@media (max-width:900px) {
  .ae-grid { grid-template-columns:1fr; }
  .ae-col-side { order:-1; }
  .ae-editor-wrap.split { grid-template-columns:1fr; }
  .ae-preview-side { display:none; }
  .ap-hero { padding:28px 24px; }
  .ap-body { padding:28px 24px; }
}
@media (max-width:600px) {
  .ae-step-lbl, .ae-step-sub { display:none; }
  .ae-step-line { min-width:10px; margin:0 6px; }
  .ae-ptitle { font-size:17px; }
  .ae-status-row { display:none; }
}
</style>