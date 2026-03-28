<template>
  <div class="section">
    <div class="container">

      <!-- ── Header ── -->
      <div class="section-header">
        <div class="section-tag">
          <span v-html="ICONS.formation" /> Formations
        </div>
        <div class="section-title-row">
          <div>
            <div class="section-title">Formations pratiques<br>pour tous les profils</div>
            <p class="section-sub">Des formations conçues par des praticiens, pour des praticiens. </p>
          </div>
          <div class="search-wrapper">
            <input v-model="searchQuery" type="text" class="search-input" placeholder="Chercher une formation..." />
            <span v-html="ICONS.search" class="search-icon" />
          </div>
        </div>
      </div>

      <!-- ── Barre actions ── -->
      <div class="results-bar">
        <div class="results-count" v-if="!loading">
          <strong>{{ filtered.length }}</strong> formation{{ filtered.length !== 1 ? 's' : '' }}
          <span v-if="hasActiveFilters" class="active-filters-hint">· filtres actifs</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button v-if="hasActiveFilters" class="btn-clear" @click="resetFilters">✕ Effacer</button>
          <button class="btn-filters" @click="offcanvasOpen = true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="7" y1="12" x2="21" y2="12" />
              <line x1="11" y1="18" x2="21" y2="18" />
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
            <div class="skel" style="height:12px;width:55%;margin-bottom:14px" />
            <div v-for="j in 5" :key="j" class="skel" style="height:34px;margin-bottom:6px;border-radius:6px" />
          </div>
        </aside>
        <div class="formations-content">
          <div class="grid-formations">
            <div v-for="i in 6" :key="i" class="fc-skel">
              <div class="skel" style="height:150px" />
              <div style="padding:18px;display:flex;flex-direction:column;gap:10px">
                <div class="skel" style="height:20px;width:65%" />
                <div class="skel" style="height:14px;width:90%" />
                <div class="skel" style="height:14px;width:70%" />
                <div class="skel" style="height:12px;width:50%;margin-top:4px" />
                <div class="skel" style="height:38px;margin-top:8px;border-radius:8px" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── ERREUR ── -->
      <div v-else-if="error" class="state-box">
        <p style="color:var(--red)">{{ error }}</p>
        <button class="btn btn-primary btn-sm" @click="fetchFormations">Réessayer</button>
      </div>

      <!-- ── CONTENU ── -->
      <div v-else class="content-wrapper">

        <!-- Sidebar desktop -->
        <aside class="sidebar">
          <div class="sidebar-inner">
            <div class="filter-block">
              <div class="filter-title">Tags</div>
              <div class="filter-list">
                <label v-for="tag in allTags" :key="tag.id" class="filter-item"
                  :class="{ checked: selectedTags.includes(tag.id) }">
                  <input type="checkbox" :checked="selectedTags.includes(tag.id)" @change="toggleTag(tag.id)" />
                  <span class="fi-label">{{ tag.name }}</span>
                  <span class="fi-count">{{ getTagCount(tag.id) }}</span>
                </label>
              </div>
            </div>

            <div class="filter-block">
              <div class="filter-title">Niveaux</div>
              <div class="filter-list">
                <label v-for="level in allLevels" :key="level.value" class="filter-item"
                  :class="{ checked: selectedLevels.includes(level.value) }">
                  <input type="checkbox" :checked="selectedLevels.includes(level.value)"
                    @change="toggleLevel(level.value)" />
                  <span class="fi-label">{{ level.label }}</span>
                  <span class="fi-count">{{ getLevelCount(level.value) }}</span>
                </label>
              </div>
            </div>

            <button v-if="hasActiveFilters" class="btn-reset" @click="resetFilters">Réinitialiser les filtres</button>
          </div>
        </aside>

        <!-- Grille formations -->
        <div class="formations-content">
          <div v-if="filtered.length === 0" class="state-box">
            <div style="font-size:40px;margin-bottom:10px">🔍</div>
            <p style="font-weight:600;margin-bottom:4px">Aucune formation trouvée</p>
            <p style="font-size:13px;color:var(--text4);margin-bottom:14px">Essayez de modifier vos critères</p>
            <button class="btn btn-primary btn-sm" @click="resetFilters">Réinitialiser</button>
          </div>

          <div v-else class="grid-formations">
            <div v-for="f in filtered" :key="f.id" class="fc card card-hover"
              @click="$router.push(`/formations/${f.slug}`)">

              <!-- ── Cover : image S3 si dispo, sinon couleur + emoji ── -->
              <div class="fc-cover" :style="f.image ? {} : { background: f.cover_color || '#4f46e5' }">
                <img v-if="f.image" :src="f.image" :alt="f.title" class="fc-cover-img" />
                <div v-else class="fc-emoji">{{ tagEmoji(f.tags) }}</div>
                <span v-if="f.badge" class="fc-badge badge" :class="badgeCls(f.badge)">{{ badgeLabel(f.badge) }}</span>
              </div>

              <div class="fc-body">
                <div class="fc-meta">
                  <span class="level-tag" :class="levelCls(f.level)">{{ levelLabel(f.level) }}</span>
                  <span v-for="tag in (f.tags || []).slice(0, 2)" :key="tag.id" class="tag-sm">{{ tag.name }}</span>
                </div>
                <h3 class="fc-title">{{ f.title }}</h3>
                <p class="fc-sub">{{ f.subtitle }}</p>
                <div class="fc-instructor">
                  <div class="avatar avatar-sm" style="background:var(--accent);color:var(--accent-fg);font-weight:700">
                    {{ instructorInitials(f) }}
                  </div>
                  <span>{{ instructorName(f) }}</span>
                </div>
                <div class="fc-stats">
                  <div class="stars">
                    <span v-for="i in 5" :key="i" v-html="ICONS.star"
                      :style="{ color: i <= Math.round(f.rating) ? '#f59e0b' : 'var(--text5)', width: '13px', height: '13px' }" />
                    <span class="rating-val">{{ f.rating }}</span>
                    <span class="rating-count">({{ f.reviews_count || 0 }})</span>
                  </div>
                  <div class="fc-info">
                    <span><span v-html="ICONS.users" />{{ f.students_count || 0 }}</span>
                    <span class="sep">·</span>
                    <span><span v-html="ICONS.clock" />{{ f.duration }}</span>
                    <span class="sep">·</span>
                    <span><span v-html="ICONS.play" />{{ totalLessons(f) }} leçons</span>
                  </div>
                </div>
                <div class="fc-footer">
                  <div class="fc-price" :class="{ free: f.is_free }">
                    {{ f.is_free ? 'Gratuit' : f.price }}
                  </div>
                  <RouterLink :to="`/formations/${f.slug}`" class="btn btn-primary btn-sm" @click.stop>
                    {{ f.is_free ? 'Accéder' : 'Voir plus' }}
                  </RouterLink>
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div class="oc-body">
            <div class="filter-block">
              <div class="filter-title">Tags</div>
              <div class="filter-list">
                <label v-for="tag in allTags" :key="tag.id" class="filter-item"
                  :class="{ checked: selectedTags.includes(tag.id) }">
                  <input type="checkbox" :checked="selectedTags.includes(tag.id)" @change="toggleTag(tag.id)" />
                  <span class="fi-label">{{ tag.name }}</span>
                  <span class="fi-count">{{ getTagCount(tag.id) }}</span>
                </label>
              </div>
            </div>
            <div class="filter-block" style="margin-top:24px">
              <div class="filter-title">Niveaux</div>
              <div class="filter-list">
                <label v-for="level in allLevels" :key="level.value" class="filter-item"
                  :class="{ checked: selectedLevels.includes(level.value) }">
                  <input type="checkbox" :checked="selectedLevels.includes(level.value)"
                    @change="toggleLevel(level.value)" />
                  <span class="fi-label">{{ level.label }}</span>
                  <span class="fi-count">{{ getLevelCount(level.value) }}</span>
                </label>
              </div>
            </div>
            <button v-if="hasActiveFilters" class="btn-reset" style="margin-top:24px"
              @click="resetFilters">Réinitialiser les filtres</button>
          </div>
          <div class="oc-foot">
            <button class="btn btn-primary" style="width:100%;justify-content:center;padding:13px"
              @click="offcanvasOpen = false">
              Voir {{ filtered.length }} résultat{{ filtered.length !== 1 ? 's' : '' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
import API from '@/services/api'
import { ICONS } from '@/composables/icons'

export default {
  name: 'FormationsPage',
  components: { RouterLink },

  data() {
    return {
      formations: [],
      allTags: [],
      selectedTags: [],
      selectedLevels: [],
      searchQuery: '',
      typetag: 1,
      loading: true,
      error: null,
      offcanvasOpen: false,
      ICONS,
      allLevels: [
        { value: 'debutant',      label: 'Débutant' },
        { value: 'intermediaire', label: 'Intermédiaire' },
        { value: 'professionnel', label: 'Professionnel' },
      ],
    }
  },

  computed: {
    hasActiveFilters() {
      return this.selectedTags.length > 0 || this.selectedLevels.length > 0 || this.searchQuery.trim() !== ''
    },
    filterCount() {
      return this.selectedTags.length + this.selectedLevels.length
    },
    filtered() {
      let list = this.formations
      const q = this.searchQuery.trim().toLowerCase()

      if (q) {
        list = list.filter(f => {
          // titre
          if (f.title && f.title.toLowerCase().includes(q)) return true
          // sous-titre
          if (f.subtitle && f.subtitle.toLowerCase().includes(q)) return true
          // description
          if (f.description && f.description.toLowerCase().includes(q)) return true
          // noms des tags liés à la formation
          if (f.tags && f.tags.some(t => t.name.toLowerCase().includes(q))) return true
          // aussi dans allTags (fallback si f.tags contient des IDs)
          if (f.tags && f.tags.some(tagId => {
            const tag = this.allTags.find(t => t.id === tagId)
            return tag && tag.name.toLowerCase().includes(q)
          })) return true
          // niveau (ex: "débutant", "intermédiaire")
          if (f.level && f.level.toLowerCase().includes(q)) return true
          const levelLabel = this.allLevels.find(l => l.value === f.level)?.label ?? ''
          if (levelLabel.toLowerCase().includes(q)) return true
          // nom instructeur / auteur
          const instructor = f.author?.name || f.instructor?.name || f.instructor_name || ''
          if (instructor.toLowerCase().includes(q)) return true
          return false
        })
      }

      if (this.selectedTags.length > 0)
        list = list.filter(f => f.tags && f.tags.some(t => this.selectedTags.includes(t.id)))
      if (this.selectedLevels.length > 0)
        list = list.filter(f => this.selectedLevels.includes(f.level))

      return list
    },
  },

  methods: {
    async fetchFormations() {
      this.loading = true; this.error = null
      try {
        const { data } = await API.get('/v1/formations')
        this.formations = Array.isArray(data) ? data : (data.data || [])
      } catch (e) {
        this.error = 'Impossible de charger les formations.'
      } finally {
        this.loading = false
      }
    },

    async fetchTags() {
      try {
        const { data } = await API.get(`/v1/tags/${this.typetag}`)
        this.allTags = Array.isArray(data) ? data : (data.data || [])
      } catch (e) { console.error(e) }
    },

    toggleTag(id)   { const i = this.selectedTags.indexOf(id);    i > -1 ? this.selectedTags.splice(i, 1)    : this.selectedTags.push(id) },
    toggleLevel(l)  { const i = this.selectedLevels.indexOf(l);   i > -1 ? this.selectedLevels.splice(i, 1)  : this.selectedLevels.push(l) },
    resetFilters()  { this.selectedTags = []; this.selectedLevels = []; this.searchQuery = ''; this.offcanvasOpen = false },

    getTagCount(id)  { return this.formations.filter(f => f.tags && f.tags.some(t => t.id === id)).length },
    getLevelCount(l) { return this.formations.filter(f => f.level === l).length },

    totalLessons(f) {
      if (!f.modules?.length) return 0
      return f.modules.reduce((s, m) => s + (m.lessons_count || m.lessons?.length || 0), 0)
    },

    tagEmoji(tags) {
      const map = { 'Web': '🌐', 'Data': '📊', 'DevOps': '⚙️', 'Mobile': '📱', 'Python': '🐍', 'JavaScript': '⚡', 'Vue.js': '💚', 'Laravel': '🔴' }
      return map[tags?.[0]?.name] || '💻'
    },

    badgeLabel(b) {
      return { bestseller: 'Bestseller', popular: 'Populaire', new: 'Nouveau', featured: 'À la une' }[b?.toLowerCase()] || b
    },
    badgeCls(b)  { return ({ bestseller: 'badge-orange', popular: 'badge-green', new: 'badge-blue', featured: 'badge-blue' })[b?.toLowerCase()] || 'badge-neutral' },
    levelCls(l)  { return ({ debutant: 'lvl-begin', intermediaire: 'lvl-mid', professionnel: 'lvl-pro' })[l?.toLowerCase()] || '' },
    levelLabel(l){ return ({ debutant: 'Débutant', intermediaire: 'Intermédiaire', professionnel: 'Professionnel' })[l?.toLowerCase()] || l },

    instructorName(f)     { return f.author?.name || f.instructor?.name || f.instructor_name || '—' },
    instructorInitials(f) {
      const n = f.author?.name || f.instructor?.name || f.instructor_name
      if (!n) return '?'
      return n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2)
    },
  },

  created() {
    Promise.all([this.fetchTags(), this.fetchFormations()])
  },
}
</script>

<style scoped>
/* ══ Layout ══ */
.content-wrapper {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 36px;
  margin-top: 24px;
}

.formations-content {
  min-width: 0;
}

/* ══ Barre actions ══ */
.results-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 4px;
  flex-wrap: wrap;
  gap: 8px;
}

.results-count {
  font-size: 13.5px;
  color: var(--text3);
}

.results-count strong {
  color: var(--text);
}

.active-filters-hint {
  color: var(--accent);
  font-weight: 500;
}

.btn-clear {
  font-size: 12px;
  color: var(--text4);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all .12s;
}

.btn-clear:hover {
  background: var(--surface2);
  color: var(--text);
}

.btn-filters {
  display: none;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
  transition: all .15s;
}

.btn-filters:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.filter-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: var(--accent);
  color: var(--accent-fg);
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
}

/* ══ Sidebar ══ */
.sidebar {
  position: sticky;
  top: 88px;
  max-height: calc(100vh - 108px);
  overflow-y: auto;
  padding-right: 4px;
}

.sidebar::-webkit-scrollbar {
  width: 3px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: var(--border2);
  border-radius: 2px;
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
}

.filter-block {
  margin-bottom: 28px;
}

.filter-title {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .8px;
  color: var(--text4);
  margin-bottom: 10px;
  font-family: var(--font-mono);
}

.filter-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text3);
  padding: 8px 10px;
  border-radius: 7px;
  transition: all .12s;
  border: 1px solid transparent;
  user-select: none;
}

.filter-item:hover {
  background: var(--surface2);
  color: var(--text);
}

.filter-item.checked {
  background: var(--surface2);
  color: var(--text);
  border-color: var(--border);
}

.filter-item input[type="checkbox"] {
  cursor: pointer;
  width: 15px;
  height: 15px;
  accent-color: var(--accent);
  flex-shrink: 0;
}

.fi-label {
  flex: 1;
  font-weight: 500;
}

.fi-count {
  font-size: 11px;
  color: var(--text5);
  font-family: var(--font-mono);
  font-weight: 600;
}

.btn-reset {
  width: 100%;
  padding: 9px;
  border-radius: 7px;
  border: 1px solid var(--border2);
  background: transparent;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text3);
  cursor: pointer;
  transition: all .15s;
  text-align: center;
}

.btn-reset:hover {
  background: var(--surface2);
  color: var(--text);
  border-color: var(--border);
}

/* ══ Grille ══ */
.grid-formations {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}


@media (max-width: 1200px) {
  .grid-formations {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* mobile */
@media (max-width: 540px) {
  .grid-formations {
    grid-template-columns: 1fr;
  }
}

/* ══ Card ══ */
.fc {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  transition: transform .22s, box-shadow .22s;
}

.fc:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, .1);
}

/* Cover — image ou couleur+emoji */
.fc-cover {
  height: 160px;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fc-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .3s ease;
}

.fc:hover .fc-cover-img {
  transform: scale(1.04);
}

.fc-emoji {
  font-size: 50px;
}

.fc-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 10.5px;
  padding: 4px 9px;
  border-radius: 5px;
}

.fc-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.fc-meta {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.level-tag {
  font-size: 10.5px;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 600;
  white-space: nowrap;
  background: var(--surface2);
  color: var(--text3);
  border: 1px solid var(--border2);
}

.lvl-begin {
  background: rgba(34, 197, 94, .1);
  color: #16a34a;
  border-color: rgba(34, 197, 94, .25);
}

.lvl-mid {
  background: rgba(59, 130, 246, .1);
  color: #2563eb;
  border-color: rgba(59, 130, 246, .25);
}

.lvl-pro {
  background: rgba(168, 85, 247, .1);
  color: #9333ea;
  border-color: rgba(168, 85, 247, .25);
}

.tag-sm {
  font-size: 10.5px;
  padding: 3px 7px;
  background: var(--surface2);
  color: var(--text4);
  border-radius: 4px;
  white-space: nowrap;
  border: 1px solid var(--border2);
}

.fc-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 5px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fc-sub {
  font-size: 12.5px;
  color: var(--text3);
  margin-bottom: 10px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fc-instructor {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: var(--text3);
  margin-bottom: 10px;
  padding: 8px 0;
  border-top: 1px solid var(--border2);
  border-bottom: 1px solid var(--border2);
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.avatar-sm {
  width: 26px;
  height: 26px;
  font-size: 10px;
  flex-shrink: 0;
}

.fc-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
  flex: 1;
}

.stars {
  display: flex;
  align-items: center;
  gap: 3px;
}

.rating-val {
  font-size: 12px;
  color: var(--text3);
  margin-left: 5px;
  font-weight: 600;
}

.rating-count {
  font-size: 11px;
  color: var(--text5);
}

.fc-info {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: var(--text4);
  flex-wrap: wrap;
}

.fc-info span {
  display: flex;
  align-items: center;
  gap: 3px;
}

.sep {
  opacity: .35;
}

.fc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--border2);
  margin-top: auto;
}

.fc-price {
  font-size: 16px;
  font-weight: 800;
  color: var(--text);
  font-family: var(--font-alt);
}

.fc-price.free {
  color: #16a34a;
}

/* ══ Skeleton ══ */
.skel {
  background: linear-gradient(90deg, var(--surface2) 0%, var(--surface) 50%, var(--surface2) 100%);
  background-size: 200% 100%;
  animation: sk 1.5s infinite;
  border-radius: 5px;
}

@keyframes sk {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

.fc-skel {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border2);
  background: var(--surface);
}

/* ══ États ══ */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 60px 24px;
  text-align: center;
  color: var(--text3);
}

/* ══ Header ══ */
.section-title-row {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
  align-items: flex-start;
}

.section-title {
  font-size: clamp(24px, 4vw, 38px);
  font-weight: 800;
  color: var(--text);
  margin-bottom: 10px;
  letter-spacing: -.8px;
  line-height: 1.2;
}

.section-sub {
  font-size: 14.5px;
  color: var(--text3);
  line-height: 1.65;
  margin: 0;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 11px 16px 11px 40px;
  background: var(--surface2);
  border: 1px solid var(--border2);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text);
  font-family: inherit;
  transition: all .18s;
}

.search-input::placeholder {
  color: var(--text5);
}

.search-input:focus {
  outline: none;
  background: var(--surface);
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, .1);
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--text4);
  pointer-events: none;
  display: flex;
}

/* ══ Offcanvas ══ */
.oc-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .55);
  z-index: 300;
  display: flex;
  align-items: flex-end;
}

.oc-panel {
  width: 100%;
  max-width: 380px;
  max-height: 90vh;
  background: var(--surface);
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -12px 48px rgba(0, 0, 0, .25);
}

.oc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 14px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.oc-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
}

.oc-close {
  width: 30px;
  height: 30px;
  border: none;
  background: var(--surface2);
  border-radius: 50%;
  cursor: pointer;
  color: var(--text3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .15s;
}

.oc-close:hover {
  background: var(--border);
  color: var(--text);
}

.oc-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.oc-foot {
  padding: 14px 20px 20px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.oc-enter-active,
.oc-leave-active {
  transition: opacity .22s;
}

.oc-enter-active .oc-panel,
.oc-leave-active .oc-panel {
  transition: transform .28s cubic-bezier(.4, 0, .2, 1);
}

.oc-enter-from,
.oc-leave-to {
  opacity: 0;
}

.oc-enter-from .oc-panel,
.oc-leave-to .oc-panel {
  transform: translateY(100%);
}

/* ══ Responsive ══ */
@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 210px 1fr;
    gap: 28px;
  }

  .section-title-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 860px) {
  .sidebar {
    display: none;
  }

  .btn-filters {
    display: flex;
  }

  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .grid-formations {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }
}

@media (max-width: 540px) {
  .grid-formations {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 24px;
  }

  .oc-panel {
    border-radius: 16px 16px 0 0;
  }
}
</style>