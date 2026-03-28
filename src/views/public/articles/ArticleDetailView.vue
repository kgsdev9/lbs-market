<template>
  <div class="section">

    <!-- ══ LOADING ══ -->
    <div class="container" v-if="loading">
      <div class="article-layout">
        <div class="article-col">
          <div class="skel skel-bc" style="margin-bottom:28px"/>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px">
            <div v-for="n in 3" :key="n" class="skel skel-tag"/>
          </div>
          <div class="skel skel-h1"/>
          <div class="skel skel-h1" style="width:70%;margin-top:10px"/>
          <div class="skel skel-excerpt" style="margin-top:16px"/>
          <div class="skel skel-excerpt" style="width:80%;margin-top:8px"/>
          <div class="skel skel-cover" style="margin:28px 0 40px"/>
          <div v-for="n in 8" :key="n" class="skel skel-line" :style="{ width: (60 + n * 5) + '%', marginTop: '12px' }"/>
        </div>
        <aside class="aside-col">
          <div class="skel" style="height:180px;border-radius:12px;margin-bottom:16px"/>
          <div class="skel" style="height:260px;border-radius:12px;margin-bottom:16px"/>
          <div class="skel" style="height:160px;border-radius:12px"/>
        </aside>
      </div>
    </div>

    <!-- ══ ERREUR ══ -->
    <div class="container" v-else-if="error" style="text-align:center;padding:80px 0">
      <div style="font-size:48px;margin-bottom:16px">😕</div>
      <h2 style="font-size:22px;font-weight:700;margin-bottom:8px">Article introuvable</h2>
      <p style="color:var(--text3);margin-bottom:24px">Cet article n'existe pas ou a été supprimé.</p>
      <RouterLink to="/articles" class="btn btn-primary">← Retour aux articles</RouterLink>
    </div>

    <!-- ══ CONTENU ══ -->
    <div class="container" v-else-if="article">

      <!-- Barre mobile -->
      <div class="mobile-bar">
        <div class="pg-bc" style="flex:1;min-width:0">
          <RouterLink to="/articles" class="bc-lnk">Articles</RouterLink>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="bc-current">{{ article.tags && article.tags.length ? article.tags[0].name : '—' }}</span>
        </div>
        <button class="btn-aside-mobile" @click="asideOpen = true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          En savoir plus
        </button>
      </div>

      <div class="article-layout">

        <!-- ── Colonne article ── -->
        <div class="article-col">

          <!-- Breadcrumb desktop -->
          <div class="pg-bc desktop-bc" style="margin-bottom:28px">
            <RouterLink to="/articles" class="bc-lnk">Articles</RouterLink>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span style="color:var(--text3)">{{ article.tags && article.tags.length ? article.tags[0].name : '—' }}</span>
          </div>

          <div class="ad-header">
            <div class="ad-tags">
              <span v-for="t in article.tags" :key="t.id" class="tag">{{ t.name }}</span>
            </div>
            <h1 class="ad-title">{{ article.title }}</h1>
            <p class="ad-excerpt">{{ article.excerpt }}</p>
            <div class="ad-meta">
              <div class="ad-author">
                <div class="avatar avatar-md" style="background:var(--surface2);color:var(--text2)">
                  {{ initials(article.author ? article.author.name : '?') }}
                </div>
                <div>
                  <div style="font-weight:600;font-size:14px;color:var(--text)">{{ article.author ? article.author.name : 'Auteur inconnu' }}</div>
                  <div style="font-size:12px;color:var(--text4)">{{ article.author ? article.author.email : '' }}</div>
                </div>
              </div>
              <div class="meta-row">
                <span v-html="ICONS.clock"/> {{ article.read_time || '5 min' }}
                <div class="meta-dot"/>
                {{ formatDate(article.created_at) }}
              </div>
            </div>
          </div>

          <!-- ── Cover : image S3 si dispo, sinon couleur + emoji ── -->
          <div
            class="ad-cover"
            :style="article.image ? {} : { background: article.cover_color || '#dbeafe' }"
          >
            <img v-if="article.image" :src="article.image" :alt="article.title" class="ad-cover-img"/>
            <div v-else style="font-size:80px">✍️</div>
          </div>

          <div class="article-prose" v-html="renderedContent"/>

          <div class="ad-footer-cta card card-p" style="margin-top:48px">
            <div class="afc-inner">
              <div>
                <h3 style="font-size:17px;font-weight:700;margin-bottom:6px">Cet article vous a plu ?</h3>
                <p style="font-size:13.5px;color:var(--text3)">Rejoignez la communauté et accédez à plus de 150 articles techniques.</p>
              </div>
              <RouterLink to="/register" class="btn btn-primary">Rejoindre Aho →</RouterLink>
            </div>
          </div>
        </div>

        <!-- ── Aside desktop ── -->
        <aside class="aside-col">
          <AsideContent
            :recent-articles="recentArticles"
            :popular-tags="popularTags"
            :loading-recent="loadingRecent"
            :loading-tags="loadingTags"
            :ICONS="ICONS"
            @navigate="$router.push($event)"
          />
        </aside>
      </div>
    </div>

    <!-- ══ OFFCANVAS ASIDE MOBILE ══ -->
    <Transition name="oc">
      <div v-if="asideOpen" class="oc-overlay" @click.self="asideOpen = false">
        <div class="oc-panel">
          <div class="oc-head">
            <span class="oc-title">Plus d'infos</span>
            <button class="oc-close" @click="asideOpen = false">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="oc-body">
            <AsideContent
              :recent-articles="recentArticles"
              :popular-tags="popularTags"
              :loading-recent="loadingRecent"
              :loading-tags="loadingTags"
              :ICONS="ICONS"
              @navigate="$router.push($event); asideOpen = false"
            />
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script>
import API from '@/services/api'
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { ICONS } from '@/composables/icons'

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

// ── Aside partagé desktop + offcanvas ──
const AsideContent = defineComponent({
  name: 'AsideContent',
  props: {
    recentArticles: Array,
    popularTags:    Array,
    loadingRecent:  Boolean,
    loadingTags:    Boolean,
    ICONS:          Object,
  },
  emits: ['navigate'],
  template: `
    <div class="aside-inner">

      <div class="aside-card card card-p" style="margin-bottom:16px">
        <div class="aside-support">
          <div class="aside-support-icon">☕</div>
          <div class="aside-support-title">Soutenir Aho</div>
          <p class="aside-support-desc">Aho est une communauté gratuite. Si le contenu t'aide dans ta carrière, soutiens-nous.</p>
          <a href="https://buymeacoffee.com" target="_blank" class="btn btn-primary" style="width:100%;justify-content:center;margin-bottom:8px">☕ Offrir un café</a>
          <a href="https://patreon.com" target="_blank" class="btn btn-secondary" style="width:100%;justify-content:center">❤️ Devenir membre</a>
        </div>
      </div>

      <div class="aside-card card card-p" style="margin-bottom:16px">
        <div class="aside-section-title">Articles récents</div>
        <div v-if="loadingRecent" class="aside-articles">
          <div v-for="n in 4" :key="n" style="display:flex;align-items:center;gap:10px;padding:6px">
            <div class="skel" style="width:44px;height:44px;border-radius:8px;flex-shrink:0"/>
            <div style="flex:1">
              <div class="skel" style="width:100%;height:12px;border-radius:4px;margin-bottom:6px"/>
              <div class="skel" style="width:60%;height:10px;border-radius:4px"/>
            </div>
          </div>
        </div>
        <div v-else class="aside-articles">
          <div v-for="a in recentArticles" :key="a.id" class="aside-article" @click="$emit('navigate', '/articles/' + a.slug)">
            <!-- Miniature : image S3 si dispo, sinon couleur ── -->
            <div
              class="aside-article-cover"
              :style="a.image ? {} : { background: a.cover_color || '#dbeafe' }"
            >
              <img v-if="a.image" :src="a.image" :alt="a.title" style="width:100%;height:100%;object-fit:cover;border-radius:8px;display:block"/>
            </div>
            <div class="aside-article-info">
              <div class="aside-article-title">{{ a.title }}</div>
              <div class="aside-article-meta">{{ a.tags && a.tags.length ? a.tags[0].name : '—' }} · {{ a.read_time || '5 min' }}</div>
            </div>
          </div>
          <div v-if="recentArticles.length === 0" style="font-size:13px;color:var(--text5);text-align:center;padding:12px 0">Aucun article récent</div>
        </div>
        <a @click.prevent="$emit('navigate', '/articles')" href="/articles" class="aside-see-all">Voir tous les articles →</a>
      </div>

      <div class="aside-card card card-p" style="margin-bottom:16px">
        <div class="aside-section-title">Tags populaires</div>
        <div v-if="loadingTags" style="display:flex;flex-wrap:wrap;gap:6px">
          <div v-for="n in 8" :key="n" class="skel" style="width:68px;height:26px;border-radius:20px"/>
        </div>
        <div v-else class="aside-tags">
          <span v-for="tag in popularTags" :key="tag.id" class="tag" style="cursor:pointer" @click="$emit('navigate', '/articles?tag=' + tag.id)">{{ tag.name }}</span>
        </div>
      </div>

      <div class="aside-card card card-p aside-community">
        <div style="font-size:28px;margin-bottom:10px">🚀</div>
        <div class="aside-section-title" style="margin-bottom:6px">Rejoins la communauté</div>
        <p style="font-size:13px;color:var(--text3);line-height:1.6;margin-bottom:14px">+2 000 développeurs francophones qui apprennent et partagent ensemble.</p>
        <a @click.prevent="$emit('navigate', '/register')" href="/register" class="btn btn-primary" style="width:100%;justify-content:center">Rejoindre gratuitement</a>
      </div>

    </div>
  `,
})

export default {
  name: 'ArticleDetailView',
  components: { RouterLink, AsideContent },

  data() {
    return {
      ICONS,
      article:        null,
      loading:        true,
      error:          false,
      recentArticles: [],
      loadingRecent:  true,
      popularTags:    [],
      loadingTags:    true,
      asideOpen:      false,
    }
  },

  async mounted() {
    await this.fetchArticle()
    Promise.all([this.fetchRecentArticles(), this.fetchTags()])
    window.copyCode = (btn) => {
      const code = decodeURIComponent(escape(atob(btn.dataset.code)))
      navigator.clipboard.writeText(code).then(() => {
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
        btn.classList.add('copied')
        setTimeout(() => {
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`
          btn.classList.remove('copied')
        }, 2000)
      })
    }
  },

  beforeUnmount() { delete window.copyCode },

  computed: {
    renderedContent() {
      if (!this.article?.content) return ''
      let md = this.article.content
      md = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        const language = lang || 'plaintext'
        const label    = lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : 'Code'
        let highlighted
        try { highlighted = hljs.highlight(code.trimEnd(), { language }).value }
        catch { highlighted = code.trimEnd().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
        const encoded = btoa(unescape(encodeURIComponent(code.trimEnd())))
        return `<div class="code-block"><div class="code-header"><span class="code-lang-icon">&lt;/&gt;</span><span class="code-lang">${label}</span><button class="copy-btn" onclick="copyCode(this)" data-code="${encoded}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button></div><pre><code class="hljs language-${language}">${highlighted}</code></pre></div>`
      })
      let h2count = 0
      md = md.replace(/^## (.+)$/gm, (_, title) => { h2count++; return `<h2 class="md-h2"><span class="md-h2-num">${h2count}</span>${title}</h2>` })
      md = md.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
      md = md.replace(/^# (.+)$/gm,   '<h1 class="md-h1">$1</h1>')
      md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      md = md.replace(/\*(.+?)\*/g,     '<em>$1</em>')
      md = md.replace(/`([^`]+)`/g,     '<code class="inline-code">$1</code>')
      md = md.replace(/^> (.+)$/gm,     '<blockquote class="md-quote">$1</blockquote>')
      md = md.replace(/^- (.+)$/gm,     '<li>$1</li>')
      md = md.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, s => `<ul class="md-ul">${s}</ul>`)
      md = md.replace(/\n\n(?!<)/g,     '</p><p class="md-p">')
      return '<p class="md-p">' + md + '</p>'
    },
  },

  methods: {
    async fetchArticle() {
      try {
        const { data } = await API.get(`/v1/articles/${this.$route.params.slug}`)
        this.article = data
      } catch { this.error = true }
      finally  { this.loading = false }
    },
    async fetchRecentArticles() {
      this.loadingRecent = true
      try {
        const { data } = await API.get('/v1/articles')
        const list = Array.isArray(data) ? data : (data.data ?? [])
        this.recentArticles = list.filter(a => a.slug !== this.$route.params.slug).slice(0, 5)
      } catch {}
      finally { this.loadingRecent = false }
    },
    async fetchTags() {
      this.loadingTags = true
      try {
        const { data } = await API.get('/v1/tags')
        this.popularTags = Array.isArray(data) ? data.slice(0, 12) : []
      } catch {}
      finally { this.loadingTags = false }
    },
    initials(name) {
      if (!name) return '?'
      return name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2)
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    },
  },
}
</script>

<style src="highlight.js/styles/github-dark.css"/>

<style scoped>
/* ══ Layout ══ */
.article-layout { display:grid;grid-template-columns:1fr 300px;gap:40px;align-items:start;padding:40px 0 0; }
.article-col { min-width:0; }
.aside-col { position:sticky;top:24px; }

/* ══ Barre mobile ══ */
.mobile-bar { display:none;align-items:center;justify-content:space-between;gap:12px;padding:14px 0 10px;border-bottom:1px solid var(--border2);margin-bottom:0; }
.bc-current { color:var(--text4);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.btn-aside-mobile { display:flex;align-items:center;gap:6px;flex-shrink:0;padding:7px 14px;border:1.5px solid var(--border);border-radius:8px;background:var(--surface);font-size:12.5px;font-weight:600;color:var(--text3);cursor:pointer;transition:all .15s;white-space:nowrap; }
.btn-aside-mobile:hover { border-color:var(--accent);color:var(--accent); }

/* ══ Article ══ */
.ad-header  { margin-bottom:28px; }
.ad-tags    { display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px; }
.ad-title   { font-family:var(--font-alt);font-size:clamp(26px,3.5vw,38px);font-weight:800;color:var(--text);letter-spacing:-1px;line-height:1.15;margin-bottom:16px; }
.ad-excerpt { font-size:17px;color:var(--text3);line-height:1.7;margin-bottom:22px; }
.ad-meta    { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding-bottom:22px;border-bottom:1px solid var(--border); }
.ad-author  { display:flex;align-items:center;gap:10px; }
.afc-inner  { display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap; }

/* Cover — image ou couleur+emoji ── */
.ad-cover {
  height: 280px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  overflow: hidden;
  position: relative;
}
.ad-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ══ Aside ══ */
:deep(.aside-inner) { display:flex;flex-direction:column; }
:deep(.aside-card)  { border-radius:12px; }
:deep(.aside-section-title) { font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text4);margin-bottom:14px;font-family:var(--font-mono); }
:deep(.aside-support)       { text-align:center; }
:deep(.aside-support-icon)  { font-size:32px;margin-bottom:8px; }
:deep(.aside-support-title) { font-size:15px;font-weight:700;color:var(--text);margin-bottom:8px; }
:deep(.aside-support-desc)  { font-size:13px;color:var(--text3);line-height:1.6;margin-bottom:16px; }
:deep(.aside-articles)      { display:flex;flex-direction:column;gap:12px;margin-bottom:14px; }
:deep(.aside-article)       { display:flex;align-items:center;gap:10px;cursor:pointer;padding:6px;border-radius:8px;transition:background .15s; }
:deep(.aside-article:hover) { background:var(--surface2); }
:deep(.aside-article-cover) { width:44px;height:44px;border-radius:8px;flex-shrink:0;overflow:hidden; }
:deep(.aside-article-info)  { min-width:0; }
:deep(.aside-article-title) { font-size:13px;font-weight:600;color:var(--text);line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
:deep(.aside-article-meta)  { font-size:11.5px;color:var(--text4);margin-top:2px; }
:deep(.aside-see-all) { font-size:12.5px;color:var(--accent);font-weight:500;text-decoration:none;display:block;text-align:center;padding:6px;border-radius:6px;transition:background .15s; }
:deep(.aside-see-all:hover) { background:var(--surface2); }
:deep(.aside-tags)      { display:flex;flex-wrap:wrap;gap:6px; }
:deep(.aside-community) { text-align:center; }

/* ══ Skeleton ══ */
.skel { border-radius:6px;background:linear-gradient(90deg,var(--surface2) 25%,var(--border) 50%,var(--surface2) 75%);background-size:600px 100%;animation:shimmer 1.4s infinite linear;display:block; }
:deep(.skel) { border-radius:6px;background:linear-gradient(90deg,var(--surface2) 25%,var(--border) 50%,var(--surface2) 75%);background-size:600px 100%;animation:shimmer 1.4s infinite linear;display:block; }
@keyframes shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
.skel-bc      { width:180px;height:16px; }
.skel-tag     { width:72px;height:26px;border-radius:20px; }
.skel-h1      { width:90%;height:36px; }
.skel-excerpt { width:100%;height:18px; }
.skel-line    { height:14px; }
.skel-cover   { width:100%;height:280px;border-radius:var(--radius); }

/* ══ Prose ══ */
:deep(.md-p)  { margin:14px 0;line-height:1.9;color:var(--text2);font-size:16px; }
:deep(.md-h1) { font-size:28px;font-weight:800;margin:36px 0 14px;color:var(--text);letter-spacing:-.5px; }
:deep(.md-h2) { display:flex;align-items:center;gap:12px;font-size:21px;font-weight:700;margin:40px 0 16px;color:var(--text);letter-spacing:-.3px; }
:deep(.md-h2-num) { display:inline-flex;align-items:center;justify-content:center;min-width:30px;height:30px;padding:0 8px;background:#18181b;color:#fff;font-size:13px;font-weight:700;border-radius:7px;font-family:var(--font-mono);flex-shrink:0;letter-spacing:0; }
:deep(.md-h3) { font-size:17px;font-weight:600;margin:28px 0 10px;color:var(--text); }
:deep(.md-ul) { padding-left:6px;margin:14px 0;list-style:none; }
:deep(.md-ul li) { position:relative;padding-left:22px;margin:8px 0;line-height:1.8;color:var(--text2);font-size:16px; }
:deep(.md-ul li::before) { content:'•';position:absolute;left:0;top:0;color:#18181b;font-weight:900;font-size:18px;line-height:1.6; }
:deep(.md-quote) { border-left:4px solid #18181b;padding:12px 20px;margin:24px 0;background:var(--surface2);border-radius:0 10px 10px 0;color:var(--text3);font-style:italic;font-size:15.5px;line-height:1.8; }
:deep(.inline-code) { background:var(--surface2);padding:2px 8px;border-radius:5px;font-family:var(--font-mono);font-size:13.5px;color:#e06c75;border:1px solid var(--border); }
:deep(.code-block)  { margin:24px 0;border-radius:12px;overflow:hidden;border:1px solid var(--border); }
:deep(.code-header) { display:flex;align-items:center;gap:8px;padding:10px 16px;background:var(--surface);border-bottom:1px solid var(--border); }
:deep(.code-lang-icon) { font-size:11px;color:var(--text4);font-family:var(--font-mono); }
:deep(.code-lang)   { flex:1;font-size:13px;font-weight:500;color:var(--text2);font-family:var(--font-mono); }
:deep(.copy-btn)    { width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:6px;border:1px solid var(--border);background:transparent;color:var(--text3);cursor:pointer;transition:all .15s;flex-shrink:0; }
:deep(.copy-btn:hover)  { background:var(--surface2);color:var(--text); }
:deep(.copy-btn.copied) { background:#1a7f37;color:#fff;border-color:#1a7f37; }
:deep(.code-block pre)  { margin:0;padding:20px;overflow-x:auto;background:#0d1117; }
:deep(.code-block code) { font-size:14px;line-height:1.8;font-family:var(--font-mono); }

/* ══ Offcanvas ══ */
.oc-overlay { position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:300;display:flex;align-items:flex-end; }
.oc-panel { width:100%;max-height:88vh;background:var(--surface);border-radius:20px 20px 0 0;display:flex;flex-direction:column;box-shadow:0 -12px 48px rgba(0,0,0,.25); }
.oc-head { display:flex;align-items:center;justify-content:space-between;padding:18px 20px 14px;border-bottom:1px solid var(--border);flex-shrink:0; }
.oc-title { font-size:15px;font-weight:700;color:var(--text); }
.oc-close { width:30px;height:30px;border:none;background:var(--surface2);border-radius:50%;cursor:pointer;color:var(--text3);display:flex;align-items:center;justify-content:center;transition:all .15s; }
.oc-close:hover { background:var(--border);color:var(--text); }
.oc-body { flex:1;overflow-y:auto;padding:20px; }
.oc-enter-active, .oc-leave-active { transition:opacity .22s; }
.oc-enter-active .oc-panel, .oc-leave-active .oc-panel { transition:transform .28s cubic-bezier(.4,0,.2,1); }
.oc-enter-from, .oc-leave-to { opacity:0; }
.oc-enter-from .oc-panel, .oc-leave-to .oc-panel { transform:translateY(100%); }

/* ══ Responsive ══ */
@media (max-width:900px) {
  .aside-col    { display:none; }
  .mobile-bar   { display:flex; }
  .desktop-bc   { display:none; }
  .article-layout { grid-template-columns:1fr;padding-top:20px; }
}
@media (max-width:540px) {
  .ad-title   { font-size:24px; }
  .ad-excerpt { font-size:15px; }
  .ad-cover   { height:200px; }
  .oc-panel   { border-radius:16px 16px 0 0; }
}
</style>