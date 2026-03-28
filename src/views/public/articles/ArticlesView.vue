<template>
  <div class="section">
    <div class="container">

      <!-- ── Header ── -->
      <div class="section-header">
        <div class="section-tag"><span v-html="ICONS.article"/> Articles</div>
        <div class="art-header-row">
          <div>
            <div class="section-title">Articles </div>
            <p class="section-sub">Des articles approfondis écrits par les membres de la communauté LBS.</p>
          </div>
          <div class="search-wrapper">
            <input v-model="searchQuery" type="text" class="search-input" placeholder="Rechercher par titre, tag, type..."/>
            <span class="search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
          </div>
        </div>
      </div>

      <!-- ── Barre résultats ── -->
      <div class="results-bar">
        <div class="results-count" v-if="!loading">
          <strong>{{ filtered.length }}</strong> article{{ filtered.length !== 1 ? 's' : '' }}
          <span v-if="hasActiveFilters" class="hint-active">· filtres actifs</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button v-if="hasActiveFilters" class="btn-clear" @click="resetFilters">✕ Effacer</button>
          <button class="btn-filters" @click="offcanvasOpen = true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="7" y1="12" x2="21" y2="12"/><line x1="11" y1="18" x2="21" y2="18"/></svg>
            Filtres
            <span v-if="selectedTags.length > 0" class="filter-dot">{{ selectedTags.length }}</span>
          </button>
        </div>
      </div>

      <!-- ── LOADING ── -->
      <div v-if="loading" class="content-wrapper">
        <aside class="sidebar">
          <div class="skel" style="height:12px;width:45%;margin-bottom:12px"/>
          <div v-for="i in 8" :key="i" class="skel" style="height:34px;margin-bottom:6px;border-radius:6px"/>
        </aside>
        <div class="articles-content">
          <div class="grid-3">
            <div v-for="n in 6" :key="n" class="card skel-card">
              <div class="skel skel-cover"/>
              <div class="skel-body">
                <div class="skel skel-badge"/>
                <div class="skel skel-title"/>
                <div class="skel skel-title" style="width:70%"/>
                <div class="skel skel-line"/>
                <div class="skel skel-line" style="width:85%"/>
                <div class="skel skel-line" style="width:60%"/>
                <div class="skel-footer">
                  <div style="display:flex;align-items:center;gap:8px">
                    <div class="skel skel-avatar"/>
                    <div class="skel skel-line" style="width:80px;margin:0"/>
                  </div>
                  <div class="skel skel-line" style="width:50px;margin:0"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── CONTENU ── -->
      <div v-else class="content-wrapper">

        <!-- Sidebar desktop -->
        <aside class="sidebar">
          <div class="sidebar-inner">
            <div class="filter-block">
              <div class="filter-title">Tags</div>
              <div class="filter-list">
                <label class="filter-item" :class="{ checked: selectedTags.length === 0 }" @click="selectedTags = []">
                  <span class="fi-radio" :class="{ active: selectedTags.length === 0 }"/>
                  <span class="fi-label">Tous les articles</span>
                  <span class="fi-count">{{ articles.length }}</span>
                </label>
                <label v-for="tag in tags" :key="tag.id" class="filter-item"
                  :class="{ checked: selectedTags.includes(tag.id) }"
                  @click="toggleTag(tag.id)">
                  <input type="checkbox" :checked="selectedTags.includes(tag.id)" @change="toggleTag(tag.id)" style="display:none"/>
                  <span class="fi-check" :class="{ active: selectedTags.includes(tag.id) }">
                    <svg v-if="selectedTags.includes(tag.id)" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <span class="fi-label">{{ tag.name }}</span>
                  <span class="fi-count">{{ getTagCount(tag.id) }}</span>
                </label>
              </div>
            </div>
            <button v-if="selectedTags.length > 0" class="btn-reset" @click="resetFilters">Réinitialiser</button>
          </div>
        </aside>

        <!-- Grille articles -->
        <div class="articles-content">
          <div v-if="filtered.length === 0" class="state-box">
            <div style="font-size:40px;margin-bottom:10px">🔍</div>
            <p style="font-weight:600;margin-bottom:4px">Aucun article trouvé</p>
            <p style="font-size:13px;color:var(--text4);margin-bottom:14px">Essayez d'autres mots-clés ou filtres</p>
            <button class="btn btn-primary btn-sm" @click="resetFilters">Réinitialiser</button>
          </div>

          <div v-else class="grid-3">
            <div
              v-for="a in filtered" :key="a.id"
              class="article-card card card-hover"
              @click="$router.push(`/articles/${a.slug}`)"
            >
              <div class="ac-cover" :style="a.image ? {} : { background: a.cover_color || '#dbeafe' }">
                <img v-if="a.image" :src="a.image" :alt="a.title" class="ac-cover-img"/>
                <div class="ac-cover-tags">
                  <span
                    v-for="tag in (a.tags || []).slice(0, 2)" :key="tag.id"
                    class="badge badge-neutral"
                    style="font-family:var(--font-mono);font-size:11px"
                  >{{ tag.name }}</span>
                </div>
              </div>

              <div class="ac-body">
                <h3 class="ac-title">{{ a.title }}</h3>
                <p class="ac-excerpt">{{ a.excerpt }}</p>
                <div class="ac-footer">
                  <div class="ac-author">
                    <div class="avatar avatar-sm" style="background:var(--surface2);color:var(--text2)">
                      {{ initials(a.author ? a.author.name : '?') }}
                    </div>
                    <span style="font-size:12.5px;color:var(--text3)">
                      {{ a.author ? a.author.name : 'Auteur inconnu' }}
                    </span>
                  </div>
                  <div class="meta-row">
                    <span v-html="ICONS.clock"/> {{ a.read_time || '5 min' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- ══ OFFCANVAS MOBILE ══ -->
    <Transition name="oc">
      <div v-if="offcanvasOpen" class="oc-overlay" @click.self="offcanvasOpen = false">
        <div class="oc-panel">
          <div class="oc-head">
            <span class="oc-title">Filtres</span>
            <button class="oc-close" @click="offcanvasOpen = false">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="oc-body">
            <div class="filter-block">
              <div class="filter-title">Tags</div>
              <div class="filter-list">
                <label class="filter-item" :class="{ checked: selectedTags.length === 0 }" @click="selectedTags = []">
                  <span class="fi-radio" :class="{ active: selectedTags.length === 0 }"/>
                  <span class="fi-label">Tous les articles</span>
                  <span class="fi-count">{{ articles.length }}</span>
                </label>
                <label v-for="tag in tags" :key="tag.id" class="filter-item"
                  :class="{ checked: selectedTags.includes(tag.id) }"
                  @click="toggleTag(tag.id)">
                  <span class="fi-check" :class="{ active: selectedTags.includes(tag.id) }">
                    <svg v-if="selectedTags.includes(tag.id)" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <span class="fi-label">{{ tag.name }}</span>
                  <span class="fi-count">{{ getTagCount(tag.id) }}</span>
                </label>
              </div>
            </div>
            <button v-if="selectedTags.length > 0" class="btn-reset" style="margin-top:16px" @click="resetFilters">Réinitialiser</button>
          </div>
          <div class="oc-foot">
            <button class="btn btn-primary" style="width:100%;justify-content:center;padding:13px" @click="offcanvasOpen = false">
              Voir {{ filtered.length }} article{{ filtered.length !== 1 ? 's' : '' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script>
import API from '@/services/api'
import { ICONS } from '@/composables/icons'

export default {
  name: 'ArticlesView',

  data() {
    return {
      ICONS,
      selectedTags:  [],
      tags:          [],   // ← corrigé : était allTags mais template utilise tags
      typetag: 3,
      articles:      [],
      searchQuery:   '',
      loading:       true,
      offcanvasOpen: false,
    }
  },

  async mounted() {
    await Promise.all([this.fetchTags(), this.fetchArticles()])
    this.loading = false
  },

  computed: {
    hasActiveFilters() {
      return this.selectedTags.length > 0 || this.searchQuery.trim() !== ''
    },

   filtered() {
  let list = this.articles
  const q = this.searchQuery.trim().toLowerCase()

  if (q) {
    list = list.filter(a => {
      // titre
      if (a.title && a.title.toLowerCase().includes(q)) return true
      // extrait
      if (a.excerpt && a.excerpt.toLowerCase().includes(q)) return true
      // noms des tags liés à l'article
      if (a.tags && a.tags.some(t => t.name.toLowerCase().includes(q))) return true
      // fallback si a.tags contient des IDs
      if (a.tags && a.tags.some(tagId => {
        const tag = this.tags.find(t => t.id === tagId)
        return tag && tag.name.toLowerCase().includes(q)
      })) return true
      // type de l'article
      if (a.type && a.type.toLowerCase().includes(q)) return true
      // nom de l'auteur
      if (a.author?.name && a.author.name.toLowerCase().includes(q)) return true
      return false
    })
  }

  if (this.selectedTags.length > 0) {
    list = list.filter(a =>
      a.tags && a.tags.some(t => this.selectedTags.includes(t.id))
    )
  }

  return list
},
  },

  methods: {
    async fetchTags() {
      try {
        const { data } = await API.get(`/v1/tags/${this.typetag}`)
        // ← corrigé : stocké dans this.tags (pas this.allTags)
        this.tags = Array.isArray(data) ? data : (data.data || [])
      } catch (e) {
        console.error(e)
      }
    },

    async fetchArticles() {
      try {
        const { data } = await API.get('/v1/articles')
        this.articles = Array.isArray(data) ? data : (data.data ?? [])
      } catch (e) {
        console.error(e)
      }
    },

    toggleTag(id) {
      const i = this.selectedTags.indexOf(id)
      i > -1 ? this.selectedTags.splice(i, 1) : this.selectedTags.push(id)
    },

    resetFilters() {
      this.selectedTags = []
      this.searchQuery  = ''
      this.offcanvasOpen = false
    },

    getTagCount(id) {
      return this.articles.filter(a => a.tags && a.tags.some(t => t.id === id)).length
    },

    initials(name) {
      if (!name) return '?'
      return name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2)
    },
  },
}
</script>

<style scoped>
/* ══ Layout ══ */
.content-wrapper { display:grid;grid-template-columns:220px 1fr;gap:36px;margin-top:20px; }
.articles-content { min-width:0; }

/* ══ Header ══ */
.art-header-row { display:grid;grid-template-columns:1fr 300px;gap:32px;align-items:flex-start; }
.section-title { font-size:clamp(24px,4vw,36px);font-weight:800;color:var(--text);margin-bottom:10px;letter-spacing:-.8px; }
.section-sub   { font-size:14.5px;color:var(--text3);line-height:1.65;margin:0; }
.search-wrapper { position:relative;display:flex;align-items:center; }
.search-input { width:100%;padding:11px 16px 11px 40px;background:var(--surface2);border:1px solid var(--border2);border-radius:8px;font-size:14px;color:var(--text);font-family:inherit;transition:all .18s; }
.search-input::placeholder { color:var(--text5); }
.search-input:focus { outline:none;background:var(--surface);border-color:var(--accent);box-shadow:0 0 0 3px rgba(79,70,229,.1); }
.search-icon { position:absolute;left:12px;color:var(--text4);pointer-events:none;display:flex; }

/* ══ Barre résultats ══ */
.results-bar { display:flex;align-items:center;justify-content:space-between;padding:10px 0 4px;flex-wrap:wrap;gap:8px; }
.results-count { font-size:13.5px;color:var(--text3); }
.results-count strong { color:var(--text); }
.hint-active { color:var(--accent);font-weight:500; }
.btn-clear { font-size:12px;color:var(--text4);background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:4px;transition:all .12s; }
.btn-clear:hover { background:var(--surface2);color:var(--text); }
.btn-filters { display:none;align-items:center;gap:6px;padding:8px 16px;border:1.5px solid var(--border);border-radius:8px;background:var(--surface);font-size:13px;font-weight:600;color:var(--text);cursor:pointer;transition:all .15s; }
.btn-filters:hover { border-color:var(--accent);color:var(--accent); }
.filter-dot { display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;background:var(--accent);color:var(--accent-fg);border-radius:50%;font-size:10px;font-weight:700; }

/* ══ Sidebar ══ */
.sidebar { position:sticky;top:88px;max-height:calc(100vh - 108px);overflow-y:auto;padding-right:4px; }
.sidebar::-webkit-scrollbar { width:3px; }
.sidebar::-webkit-scrollbar-thumb { background:var(--border2);border-radius:2px; }
.sidebar-inner { display:flex;flex-direction:column; }
.filter-block { margin-bottom:20px; }
.filter-title { font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--text4);margin-bottom:8px;font-family:var(--font-mono); }
.filter-list { display:flex;flex-direction:column;gap:2px; }
.filter-item { display:flex;align-items:center;gap:9px;cursor:pointer;font-size:13px;color:var(--text3);padding:7px 10px;border-radius:7px;transition:all .12s;user-select:none; }
.filter-item:hover  { background:var(--surface2);color:var(--text); }
.filter-item.checked { background:var(--surface2);color:var(--text); }
.fi-radio { width:15px;height:15px;border-radius:50%;border:1.5px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .12s; }
.fi-radio.active { border-color:var(--accent);background:var(--accent);box-shadow:inset 0 0 0 3px var(--surface2); }
.fi-check { width:15px;height:15px;border-radius:4px;border:1.5px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .12s;background:transparent; }
.fi-check.active { border-color:var(--accent);background:var(--accent);color:var(--accent-fg); }
.fi-label { flex:1;font-weight:500; }
.fi-count { font-size:11px;color:var(--text5);font-family:var(--font-mono);font-weight:600; }
.btn-reset { width:100%;padding:8px;border-radius:7px;border:1px solid var(--border2);background:transparent;font-size:12.5px;font-weight:600;color:var(--text3);cursor:pointer;transition:all .15s;margin-top:4px; }
.btn-reset:hover { background:var(--surface2);color:var(--text); }

/* ══ Card article ══ */
.article-card { cursor:pointer; }
.ac-cover { height:130px;position:relative;overflow:hidden; }
.ac-cover-img { width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s ease; }
.article-card:hover .ac-cover-img { transform:scale(1.04); }
.ac-cover-tags { position:absolute;bottom:10px;left:12px;display:flex;gap:4px;flex-wrap:wrap; }
.ac-body  { padding:16px; }
.ac-title { font-size:14.5px;font-weight:700;color:var(--text);margin-bottom:8px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
.ac-excerpt { font-size:13px;color:var(--text3);line-height:1.6;margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden; }
.ac-footer { display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px; }
.ac-author { display:flex;align-items:center;gap:7px; }

/* ══ Skeleton ══ */
@keyframes shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
.skel { border-radius:6px;background:linear-gradient(90deg,var(--surface2) 25%,var(--border) 50%,var(--surface2) 75%);background-size:600px 100%;animation:shimmer 1.4s infinite linear; }
.skel-card   { overflow:hidden;pointer-events:none; }
.skel-cover  { height:130px;border-radius:0; }
.skel-body   { padding:16px;display:flex;flex-direction:column;gap:10px; }
.skel-badge  { width:60px;height:18px;border-radius:20px; }
.skel-title  { width:90%;height:16px; }
.skel-line   { width:100%;height:13px; }
.skel-avatar { width:28px;height:28px;border-radius:50%;flex-shrink:0; }
.skel-footer { display:flex;justify-content:space-between;align-items:center;margin-top:4px; }

/* ══ État vide ══ */
.state-box { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:60px 24px;text-align:center;color:var(--text3); }

/* ══ Offcanvas ══ */
.oc-overlay { position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:300;display:flex;align-items:flex-end; }
.oc-panel { width:100%;max-height:85vh;background:var(--surface);border-radius:20px 20px 0 0;display:flex;flex-direction:column;box-shadow:0 -12px 48px rgba(0,0,0,.25); }
.oc-head { display:flex;align-items:center;justify-content:space-between;padding:18px 20px 14px;border-bottom:1px solid var(--border);flex-shrink:0; }
.oc-title { font-size:15px;font-weight:700;color:var(--text); }
.oc-close { width:30px;height:30px;border:none;background:var(--surface2);border-radius:50%;cursor:pointer;color:var(--text3);display:flex;align-items:center;justify-content:center;transition:all .15s; }
.oc-close:hover { background:var(--border);color:var(--text); }
.oc-body { flex:1;overflow-y:auto;padding:20px; }
.oc-foot { padding:14px 20px 20px;border-top:1px solid var(--border);flex-shrink:0; }
.oc-enter-active, .oc-leave-active { transition:opacity .22s; }
.oc-enter-active .oc-panel, .oc-leave-active .oc-panel { transition:transform .28s cubic-bezier(.4,0,.2,1); }
.oc-enter-from, .oc-leave-to { opacity:0; }
.oc-enter-from .oc-panel, .oc-leave-to .oc-panel { transform:translateY(100%); }

/* ══ Responsive ══ */
@media (max-width:1024px) {
  .content-wrapper { grid-template-columns:190px 1fr;gap:24px; }
  .art-header-row  { grid-template-columns:1fr;gap:16px; }
}
@media (max-width:860px) {
  .sidebar { display:none; }
  .btn-filters { display:flex; }
  .content-wrapper { grid-template-columns:1fr;gap:0; }
}
@media (max-width:540px) {
  .section-title { font-size:24px; }
  .oc-panel { border-radius:16px 16px 0 0; }
}
</style>