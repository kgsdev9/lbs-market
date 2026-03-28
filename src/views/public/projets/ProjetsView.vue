<template>
  <div class="section">
    <div class="container">

      <!-- ── Header ── -->
      <div class="section-header">
        <div class="section-tag"><span v-html="ICONS.project"/> Projets</div>
        <div class="proj-header-row">
          <div>
            <div class="section-title">Open Source<br>made in Afrique</div>
            <p class="section-sub">Des projets concrets développés par et pour la communauté Aho.</p>
          </div>
          <div class="search-wrapper">
            <input v-model="searchQuery" type="text" class="search-input" placeholder="Rechercher un projet..."/>
            <span v-html="ICONS.search" class="search-icon"/>
          </div>
        </div>
      </div>

      <!-- ── Barre actions ── -->
      <div class="results-bar">
        <div class="results-count" v-if="!loading">
          <strong>{{ filtered.length }}</strong> projet{{ filtered.length !== 1 ? 's' : '' }}
          <span v-if="hasActiveFilters" class="hint-active">· filtres actifs</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button v-if="hasActiveFilters" class="btn-clear" @click="resetFilters">✕ Effacer</button>
          <button class="btn-filters" @click="offcanvasOpen = true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="7" y1="12" x2="21" y2="12"/><line x1="11" y1="18" x2="21" y2="18"/>
            </svg>
            Filtres
            <span v-if="filterCount > 0" class="filter-dot">{{ filterCount }}</span>
          </button>
        </div>
      </div>

      <!-- ── LOADING ── -->
      <div v-if="loading" class="content-wrapper">
        <aside class="sidebar">
          <div v-for="i in 2" :key="i" style="margin-bottom:28px">
            <div class="skel" style="height:11px;width:50%;margin-bottom:12px"/>
            <div v-for="j in 5" :key="j" class="skel" style="height:34px;margin-bottom:6px;border-radius:6px"/>
          </div>
        </aside>
        <div class="projects-content">
          <div class="grid-3">
            <div v-for="n in 6" :key="n" class="card pc-skeleton">
              <div class="skel" style="height:60px"/>
              <div style="padding:12px 16px 16px;display:flex;flex-direction:column;gap:10px">
                <div class="skel" style="height:15px;width:60%"/>
                <div class="skel" style="height:12px;width:95%"/>
                <div class="skel" style="height:12px;width:75%"/>
                <div style="display:flex;gap:6px;margin-top:4px">
                  <div v-for="k in 3" :key="k" class="skel" style="height:22px;width:54px;border-radius:99px"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── ERREUR ── -->
      <div v-else-if="error" class="state-box">
        <p style="color:var(--red)">{{ error }}</p>
        <button class="btn btn-primary btn-sm" @click="fetchProjects">Réessayer</button>
      </div>

      <!-- ── CONTENU ── -->
      <div v-else class="content-wrapper">

        <!-- Sidebar desktop -->
        <aside class="sidebar">
          <div class="sidebar-inner">

            <div class="filter-block">
              <div class="filter-title">Tags</div>
              <div class="filter-list">
                <label v-for="tag in allTags" :key="tag.id" class="filter-item" :class="{ checked: selectedTags.includes(tag.id) }">
                  <input type="checkbox" :checked="selectedTags.includes(tag.id)" @change="toggleTag(tag.id)"/>
                  <span class="fi-label">{{ tag.name }}</span>
                  <span class="fi-count">{{ getTagCount(tag.id) }}</span>
                </label>
              </div>
            </div>

            <div class="filter-block">
              <div class="filter-title">Statut</div>
              <div class="filter-list">
                <label v-for="s in statuses" :key="s.value" class="filter-item" :class="{ checked: selectedStatuses.includes(s.value) }">
                  <input type="checkbox" :checked="selectedStatuses.includes(s.value)" @change="toggleStatus(s.value)"/>
                  <span class="fi-label">{{ s.label }}</span>
                  <span class="fi-count">{{ getStatusCount(s.value) }}</span>
                </label>
              </div>
            </div>

            <div class="filter-block">
              <div class="filter-title">Niveaux</div>
              <div class="filter-list">
                <label v-for="l in levels" :key="l.value" class="filter-item" :class="{ checked: selectedLevels.includes(l.value) }">
                  <input type="checkbox" :checked="selectedLevels.includes(l.value)" @change="toggleLevel(l.value)"/>
                  <span class="fi-label">{{ l.label }}</span>
                  <span class="fi-count">{{ getLevelCount(l.value) }}</span>
                </label>
              </div>
            </div>

            <button v-if="hasActiveFilters" class="btn-reset" @click="resetFilters">Réinitialiser</button>
          </div>
        </aside>

        <!-- Grille -->
        <div class="projects-content">
          <div v-if="filtered.length === 0" class="state-box">
            <div style="font-size:38px;margin-bottom:10px">🔍</div>
            <p style="font-weight:600;margin-bottom:4px">Aucun projet trouvé</p>
            <p style="font-size:13px;color:var(--text4);margin-bottom:14px">Modifiez vos critères de recherche</p>
            <button class="btn btn-primary btn-sm" @click="resetFilters">Réinitialiser</button>
          </div>

          <div v-else class="grid-3">
            <div
              v-for="p in filtered" :key="p.id"
              class="pc card card-hover"
              @click="$router.push(`/projets/${p.slug || p.id}`)"
            >
              <div class="pc-top">
                <div class="pc-ico" :style="{ background: p.cover_color || p.coverColor || '#f1f5f9' }">
                  <span v-html="ICONS.project"/>
                </div>
                <div class="pc-actions">
                  <a v-if="p.github_link || p.github" :href="p.github_link || p.github" target="_blank" class="btn btn-icon btn-ghost btn-sm" @click.stop v-html="ICONS.github"/>
                  <a v-if="p.demo_link || p.demo" :href="p.demo_link || p.demo" target="_blank" class="btn btn-icon btn-ghost btn-sm" @click.stop v-html="ICONS.external"/>
                </div>
              </div>

              <div class="pc-body">
                <div class="pc-title-row">
                  <h3 class="pc-title">{{ p.title }}</h3>
                  <span class="badge" :class="statusBadge(p.status)">{{ statusLabel(p.status) }}</span>
                </div>
                <p class="pc-desc">{{ p.short_description || p.excerpt || p.description }}</p>
                <div class="pc-tags">
                  <span v-for="tag in (p.tags || [])" :key="tag.id || tag" class="tag" style="font-family:var(--font-mono);font-size:11px">
                    {{ tag.name || tag }}
                  </span>
                </div>
                <div class="pc-footer">
                  <div v-if="p.user" class="avatar avatar-sm" style="background:var(--surface2);color:var(--text2)" :title="p.user.name">
                    {{ initials(p.user.name) }}
                  </div>
                  <span class="level-badge" :class="'level-' + p.level">{{ levelLabel(p.level) }}</span>
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="oc-body">
            <div class="filter-block">
              <div class="filter-title">Tags</div>
              <div class="filter-list">
                <label v-for="tag in allTags" :key="tag.id" class="filter-item" :class="{ checked: selectedTags.includes(tag.id) }">
                  <input type="checkbox" :checked="selectedTags.includes(tag.id)" @change="toggleTag(tag.id)"/>
                  <span class="fi-label">{{ tag.name }}</span>
                  <span class="fi-count">{{ getTagCount(tag.id) }}</span>
                </label>
              </div>
            </div>

            <div class="filter-block" style="margin-top:20px">
              <div class="filter-title">Statut</div>
              <div class="filter-list">
                <label v-for="s in statuses" :key="s.value" class="filter-item" :class="{ checked: selectedStatuses.includes(s.value) }">
                  <input type="checkbox" :checked="selectedStatuses.includes(s.value)" @change="toggleStatus(s.value)"/>
                  <span class="fi-label">{{ s.label }}</span>
                  <span class="fi-count">{{ getStatusCount(s.value) }}</span>
                </label>
              </div>
            </div>

            <div class="filter-block" style="margin-top:20px">
              <div class="filter-title">Niveaux</div>
              <div class="filter-list">
                <label v-for="l in levels" :key="l.value" class="filter-item" :class="{ checked: selectedLevels.includes(l.value) }">
                  <input type="checkbox" :checked="selectedLevels.includes(l.value)" @change="toggleLevel(l.value)"/>
                  <span class="fi-label">{{ l.label }}</span>
                  <span class="fi-count">{{ getLevelCount(l.value) }}</span>
                </label>
              </div>
            </div>

            <button v-if="hasActiveFilters" class="btn-reset" style="margin-top:20px" @click="resetFilters">Réinitialiser</button>
          </div>

          <div class="oc-foot">
            <button class="btn btn-primary" style="width:100%;justify-content:center;padding:13px" @click="offcanvasOpen = false">
              Voir {{ filtered.length }} projet{{ filtered.length !== 1 ? 's' : '' }}
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
  name: 'ProjectsPublicView',

  data() {
    return {
      projects:        [],
      allTags:         [],
      selectedTags:    [],
      selectedStatuses:[],
      selectedLevels:  [],
      searchQuery:     '',
      loading:         true,
      error:           null,
      offcanvasOpen:   false,
      ICONS,

      statuses: [
        { value: 'production', label: 'En production' },
        { value: 'dev',        label: 'En développement' },
        { value: 'testing',    label: 'En test' },
      ],

      levels: [
        { value: 'debutant',      label: 'Débutant'      },
        { value: 'intermediaire', label: 'Intermédiaire' },
        { value: 'professionnel', label: 'Professionnel' },
      ],
    }
  },

  computed: {
    hasActiveFilters() {
      return this.selectedTags.length > 0 || this.selectedStatuses.length > 0 ||
             this.selectedLevels.length > 0 || this.searchQuery.trim() !== ''
    },
    filterCount() {
      return this.selectedTags.length + this.selectedStatuses.length + this.selectedLevels.length
    },
    filtered() {
      let list = this.projects
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase()
        list = list.filter(p =>
          p.title.toLowerCase().includes(q) ||
          (p.short_description && p.short_description.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
        )
      }
      if (this.selectedTags.length > 0)
        list = list.filter(p => p.tags && p.tags.some(t => this.selectedTags.includes(t.id)))
      if (this.selectedStatuses.length > 0)
        list = list.filter(p => this.selectedStatuses.includes(p.status))
      if (this.selectedLevels.length > 0)
        list = list.filter(p => this.selectedLevels.includes(p.level))
      return list
    },
  },

  methods: {
    async fetchProjects() {
      this.loading = true; this.error = null
      try {
        const { data } = await API.get('/v1/projects')
        this.projects = Array.isArray(data) ? data : (data.data || [])
      } catch (e) {
        this.error = 'Impossible de charger les projets.'
      } finally {
        this.loading = false
      }
    },

    async fetchTags() {
      try {
        const { data } = await API.get('/v1/tags')
        this.allTags = Array.isArray(data) ? data : (data.data || [])
      } catch (e) { console.error(e) }
    },

    toggleTag(id)    { this._toggle(this.selectedTags, id) },
    toggleStatus(v)  { this._toggle(this.selectedStatuses, v) },
    toggleLevel(v)   { this._toggle(this.selectedLevels, v) },
    _toggle(arr, val) {
      const i = arr.indexOf(val); i > -1 ? arr.splice(i, 1) : arr.push(val)
    },

    resetFilters() {
      this.selectedTags = []; this.selectedStatuses = []
      this.selectedLevels = []; this.searchQuery = ''; this.offcanvasOpen = false
    },

    getTagCount(id)    { return this.projects.filter(p => p.tags && p.tags.some(t => t.id === id)).length },
    getStatusCount(v)  { return this.projects.filter(p => p.status === v).length },
    getLevelCount(v)   { return this.projects.filter(p => p.level === v).length },

    statusLabel(s) { return ({ production:'En production', dev:'En dev', testing:'En test' })[s] || s },
    statusBadge(s) { return s === 'production' ? 'badge-green' : 'badge-orange' },
    levelLabel(l)  { return ({ debutant:'Débutant', intermediaire:'Intermédiaire', professionnel:'Pro' })[l] || l },
    initials(name) {
      if (!name) return '?'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
  },

  created() {
    Promise.all([this.fetchTags(), this.fetchProjects()])
  },
}
</script>

<style scoped>
/* ══ Layout ══ */
.content-wrapper { display: grid; grid-template-columns: 230px 1fr; gap: 36px; margin-top: 20px; }
.projects-content { min-width: 0; }

/* ══ Header ══ */
.proj-header-row { display: grid; grid-template-columns: 1fr 300px; gap: 32px; align-items: flex-start; }
.section-title { font-size: clamp(24px, 4vw, 38px); font-weight: 800; color: var(--text); margin-bottom: 10px; letter-spacing: -.8px; line-height: 1.2; }
.section-sub   { font-size: 14.5px; color: var(--text3); line-height: 1.65; margin: 0; }
.search-wrapper { position: relative; display: flex; align-items: center; }
.search-input { width: 100%; padding: 11px 16px 11px 40px; background: var(--surface2); border: 1px solid var(--border2); border-radius: 8px; font-size: 14px; color: var(--text); font-family: inherit; transition: all .18s; }
.search-input::placeholder { color: var(--text5); }
.search-input:focus { outline: none; background: var(--surface); border-color: var(--accent); box-shadow: 0 0 0 3px rgba(79,70,229,.1); }
.search-icon { position: absolute; left: 12px; color: var(--text4); pointer-events: none; display: flex; }

/* ══ Barre résultats ══ */
.results-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 0 4px; flex-wrap: wrap; gap: 8px; }
.results-count { font-size: 13.5px; color: var(--text3); }
.results-count strong { color: var(--text); }
.hint-active { color: var(--accent); font-weight: 500; }
.btn-clear { font-size: 12px; color: var(--text4); background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: all .12s; }
.btn-clear:hover { background: var(--surface2); color: var(--text); }

/* Bouton filtres — caché desktop, visible mobile */
.btn-filters { display: none; align-items: center; gap: 6px; padding: 8px 16px; border: 1.5px solid var(--border); border-radius: 8px; background: var(--surface); font-size: 13px; font-weight: 600; color: var(--text); cursor: pointer; transition: all .15s; }
.btn-filters:hover { border-color: var(--accent); color: var(--accent); }
.filter-dot { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; background: var(--accent); color: var(--accent-fg); border-radius: 50%; font-size: 10px; font-weight: 700; }

/* ══ Sidebar ══ */
.sidebar { position: sticky; top: 88px; max-height: calc(100vh - 108px); overflow-y: auto; padding-right: 4px; }
.sidebar::-webkit-scrollbar { width: 3px; }
.sidebar::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
.sidebar-inner { display: flex; flex-direction: column; }

/* ══ Filtres ══ */
.filter-block { margin-bottom: 24px; }
.filter-title { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: var(--text4); margin-bottom: 8px; font-family: var(--font-mono); }
.filter-list { display: flex; flex-direction: column; gap: 2px; }
.filter-item { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 13px; color: var(--text3); padding: 7px 10px; border-radius: 7px; transition: all .12s; border: 1px solid transparent; user-select: none; }
.filter-item:hover  { background: var(--surface2); color: var(--text); }
.filter-item.checked { background: var(--surface2); color: var(--text); border-color: var(--border); }
.filter-item input[type="checkbox"] { cursor: pointer; width: 15px; height: 15px; accent-color: var(--accent); flex-shrink: 0; }
.fi-label { flex: 1; font-weight: 500; }
.fi-count { font-size: 11px; color: var(--text5); font-family: var(--font-mono); font-weight: 600; }
.btn-reset { width: 100%; padding: 9px; border-radius: 7px; border: 1px solid var(--border2); background: transparent; font-size: 12.5px; font-weight: 600; color: var(--text3); cursor: pointer; transition: all .15s; }
.btn-reset:hover { background: var(--surface2); color: var(--text); }

/* ══ Cards ══ */
.pc { cursor: pointer; }
.pc-top { display: flex; align-items: center; justify-content: space-between; padding: 16px 16px 8px; }
.pc-ico { width: 44px; height: 44px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; color: var(--text2); }
.pc-actions { display: flex; gap: 4px; }
.pc-body { padding: 0 16px 16px; }
.pc-title-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px; flex-wrap: wrap; }
.pc-title { font-size: 15px; font-weight: 700; color: var(--text); }
.pc-desc { font-size: 13px; color: var(--text3); line-height: 1.6; margin: 8px 0 12px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.pc-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 14px; }
.pc-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--border2); }
.avatar { display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.avatar-sm { width: 28px; height: 28px; font-size: 11px; flex-shrink: 0; }
.level-badge { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 99px; font-family: var(--font-mono); }
.level-debutant      { background: #dcfce7; color: #166534; }
.level-intermediaire { background: #fef9c3; color: #854d0e; }
.level-professionnel { background: #ede9fe; color: #5b21b6; }

/* ══ Skeleton ══ */
.skel { background: linear-gradient(90deg, var(--surface2) 0%, var(--surface) 50%, var(--surface2) 100%); background-size: 200% 100%; animation: sk 1.5s infinite; border-radius: 5px; }
@keyframes sk { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.pc-skeleton { overflow: hidden; pointer-events: none; }

/* ══ États ══ */
.state-box { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 60px 24px; text-align: center; color: var(--text3); }

/* ══ Offcanvas ══ */
.oc-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 300; display: flex; align-items: flex-end; }
.oc-panel { width: 100%; max-width: 400px; max-height: 90vh; background: var(--surface); border-radius: 20px 20px 0 0; display: flex; flex-direction: column; box-shadow: 0 -12px 48px rgba(0,0,0,.25); }
.oc-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px 14px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.oc-title { font-size: 15px; font-weight: 700; color: var(--text); }
.oc-close { width: 30px; height: 30px; border: none; background: var(--surface2); border-radius: 50%; cursor: pointer; color: var(--text3); display: flex; align-items: center; justify-content: center; transition: all .15s; }
.oc-close:hover { background: var(--border); color: var(--text); }
.oc-body { flex: 1; overflow-y: auto; padding: 20px; }
.oc-foot { padding: 14px 20px 20px; border-top: 1px solid var(--border); flex-shrink: 0; }

.oc-enter-active, .oc-leave-active { transition: opacity .22s; }
.oc-enter-active .oc-panel, .oc-leave-active .oc-panel { transition: transform .28s cubic-bezier(.4,0,.2,1); }
.oc-enter-from, .oc-leave-to { opacity: 0; }
.oc-enter-from .oc-panel, .oc-leave-to .oc-panel { transform: translateY(100%); }

/* ══ Responsive ══ */
@media (max-width: 1024px) {
  .content-wrapper { grid-template-columns: 200px 1fr; gap: 24px; }
  .proj-header-row { grid-template-columns: 1fr; gap: 16px; }
}

@media (max-width: 860px) {
  .sidebar { display: none; }
  .btn-filters { display: flex; }
  .content-wrapper { grid-template-columns: 1fr; gap: 0; }
}

@media (max-width: 540px) {
  .section-title { font-size: 24px; }
  .oc-panel { border-radius: 16px 16px 0 0; }
}
</style>