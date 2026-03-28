<template>
  <div class="section">
    <div class="container">
      <!-- ── Header ── -->
      <div class="section-header">
        <div class="section-tag">🛒 Produiis digitaux</div>
        <div class="res-header-row">
          <div>
            <div class="section-title">Produits</div>
            <p class="section-sub">Dashboards, templates, PDFs techniques et outils prêts à l'emploi pour booster tes
              projets.</p>
          </div>
          <div class="search-wrapper">
            <input v-model="searchQuery" type="text" class="search-input" placeholder="Rechercher une ressource..." />
            <span class="search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <!-- ── Barre actions ── -->
      <div class="results-bar">
        <div class="results-count" v-if="!loading">
          <strong>{{ filtered.length }}</strong> ressource{{ filtered.length !== 1 ? 's' : '' }}
          <span v-if="hasActiveFilters" class="hint-active">· filtres actifs</span>
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
          <div v-for="i in 3" :key="i" style="margin-bottom:28px">
            <div class="skel" style="height:11px;width:50%;margin-bottom:12px" />
            <div v-for="j in 4" :key="j" class="skel" style="height:34px;margin-bottom:6px;border-radius:6px" />
          </div>
        </aside>
        <div class="resources-content">
          <div class="grid-3">
            <div v-for="n in 6" :key="n" class="card skel-card">
              <div class="skel" style="height:110px;border-radius:0" />
              <div style="padding:16px;display:flex;flex-direction:column;gap:10px">
                <div class="skel" style="height:16px;width:85%" />
                <div class="skel" style="height:12px;width:100%" />
                <div class="skel" style="height:12px;width:75%" />
                <div style="display:flex;gap:5px;margin-top:4px">
                  <div v-for="k in 3" :key="k" class="skel" style="height:22px;width:54px;border-radius:99px" />
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px">
                  <div class="skel" style="height:20px;width:80px" />
                  <div class="skel" style="height:30px;width:90px;border-radius:6px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── ERREUR ── -->
      <div v-else-if="error" class="state-box">
        <p style="color:var(--red)">{{ error }}</p>
        <button class="btn btn-primary btn-sm" @click="fetchResources">Réessayer</button>
      </div>

      <!-- ── CONTENU ── -->
      <div v-else class="content-wrapper">

        <!-- Sidebar desktop -->
        <aside class="sidebar">
          <div class="sidebar-inner">

            <!-- Type de ressource -->
            <div class="filter-block">
              <div class="filter-title">Type</div>
              <div class="filter-list">
                <label v-for="t in resourceTypes" :key="t.value" class="filter-item"
                  :class="{ checked: selectedTypes.includes(t.value) }">
                  <input type="checkbox" :checked="selectedTypes.includes(t.value)" @change="toggleType(t.value)" />
                  <span class="fi-label">{{ t.icon }} {{ t.label }}</span>
                  <span class="fi-count">{{ getTypeCount(t.value) }}</span>
                </label>
              </div>
            </div>

            <!-- Tags -->
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

            <!-- Prix -->
            <div class="filter-block">
              <div class="filter-title">Prix</div>
              <div class="filter-list">
                <label class="filter-item" :class="{ checked: priceFilter === 'free' }">
                  <input type="radio" name="price" value="free" v-model="priceFilter" />
                  <span class="fi-label">🆓 Gratuit seulement</span>
                  <span class="fi-count">{{ getFreeCount() }}</span>
                </label>
                <label class="filter-item" :class="{ checked: priceFilter === 'paid' }">
                  <input type="radio" name="price" value="paid" v-model="priceFilter" />
                  <span class="fi-label">💰 Payant seulement</span>
                  <span class="fi-count">{{ getPaidCount() }}</span>
                </label>
                <label class="filter-item" :class="{ checked: priceFilter === '' }">
                  <input type="radio" name="price" value="" v-model="priceFilter" />
                  <span class="fi-label">Tout</span>
                </label>
              </div>
            </div>

            <button v-if="hasActiveFilters" class="btn-reset" @click="resetFilters">Réinitialiser</button>
          </div>
        </aside>

        <!-- Grille -->
        <div class="resources-content">
          <div v-if="filtered.length === 0" class="state-box">
            <div style="font-size:38px;margin-bottom:10px">🔍</div>
            <p style="font-weight:600;margin-bottom:4px">Aucune ressource trouvée</p>
            <p style="font-size:13px;color:var(--text4);margin-bottom:14px">Modifiez vos critères de recherche</p>
            <button class="btn btn-primary btn-sm" @click="resetFilters">Réinitialiser</button>
          </div>

          <div v-else class="grid-3">
            <div v-for="r in filtered" :key="r.id" class="resource-card card card-hover"
              @click="$router.push(`/product/${r.slug}`)">
              <!-- Cover -->
              <div class="rc-cover" :style="coverStyle(r)">
                <img v-if="r.preview_image" :src="r.preview_image" class="rc-preview-img"
                  @error="e => e.target.style.display = 'none'" />
                <span v-else class="rc-emoji">{{ typeEmoji(r.type) }}</span>
                <span class="rc-badge badge" :class="typeBadgeCls(r.type)">{{ typeLabel(r.type) }}</span>
              </div>

              <!-- Body -->
              <div class="rc-body">
                <h3 class="rc-title">{{ r.title }}</h3>
                <p class="rc-desc">{{ r.short_description }}</p>

                <!-- Tags -->
                <div v-if="r.tags && r.tags.length" class="rc-tags">
                  <span v-for="t in r.tags.slice(0, 3)" :key="t.id" class="tag" style="font-size:11px">{{ t.name
                  }}</span>
                  <span v-if="r.tags.length > 3" class="tag tag-more">+{{ r.tags.length - 3 }}</span>
                </div>

                <!-- Stats -->
                <div class="rc-stats">
                  <span class="rc-stat">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {{ r.views || 0 }} vues
                  </span>
                  <span class="rc-stat">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    {{ r.downloads || 0 }} téléchargements
                  </span>
                </div>

                <!-- Footer prix + action -->
                <div class="rc-footer">
                  <div class="rc-price">
                    <span v-if="r.price == 0 || r.is_free" class="price-free">🆓 Gratuit</span>
                    <span v-else class="price-paid">{{ Number(r.price).toLocaleString() }} FCFA</span>
                  </div>
                  <RouterLink :to="`/product/${r.slug}`" class="btn btn-primary btn-sm" @click.stop>
                    {{ r.price == 0 || r.is_free ? '⬇ Télécharger' : '🛒 Acheter' }}
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div class="oc-body">
            <div class="filter-block">
              <div class="filter-title">Type</div>
              <div class="filter-list">
                <label v-for="t in resourceTypes" :key="t.value" class="filter-item"
                  :class="{ checked: selectedTypes.includes(t.value) }">
                  <input type="checkbox" :checked="selectedTypes.includes(t.value)" @change="toggleType(t.value)" />
                  <span class="fi-label">{{ t.icon }} {{ t.label }}</span>
                  <span class="fi-count">{{ getTypeCount(t.value) }}</span>
                </label>
              </div>
            </div>

            <div class="filter-block" style="margin-top:20px">
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

            <div class="filter-block" style="margin-top:20px">
              <div class="filter-title">Prix</div>
              <div class="filter-list">
                <label class="filter-item" :class="{ checked: priceFilter === 'free' }">
                  <input type="radio" name="price-oc" value="free" v-model="priceFilter" />
                  <span class="fi-label">🆓 Gratuit seulement</span>
                </label>
                <label class="filter-item" :class="{ checked: priceFilter === 'paid' }">
                  <input type="radio" name="price-oc" value="paid" v-model="priceFilter" />
                  <span class="fi-label">💰 Payant seulement</span>
                </label>
                <label class="filter-item" :class="{ checked: priceFilter === '' }">
                  <input type="radio" name="price-oc" value="" v-model="priceFilter" />
                  <span class="fi-label">Tout</span>
                </label>
              </div>
            </div>

            <button v-if="hasActiveFilters" class="btn-reset" style="margin-top:20px"
              @click="resetFilters">Réinitialiser</button>
          </div>

          <div class="oc-foot">
            <button class="btn btn-primary" style="width:100%;justify-content:center;padding:13px"
              @click="offcanvasOpen = false">
              Voir {{ filtered.length }} ressource{{ filtered.length !== 1 ? 's' : '' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script>
import API from '@/services/api'


export default {
  name: 'ResourcesPublicView',

  data() {
    return {
      resources: [],
      allTags: [],
      selectedTypes: [],
      selectedTags: [],
      priceFilter: '',
      searchQuery: '',
      typetag :2, // pour charger les tags liés aux produits
      loading: true,
      error: null,
      offcanvasOpen: false,

      resourceTypes: [
        { value: 'template', label: 'Template', icon: '🎨' },
        { value: 'plugin', label: 'Plugin', icon: '🔌' },
        { value: 'ebook', label: 'eBook', icon: '📘' },
        { value: 'snippet', label: 'Snippet', icon: '💡' },
        { value: 'component', label: 'Composant', icon: '🧩' },
        { value: 'tool', label: 'Outil', icon: '🛠️' },
      ],
    }
  },

  computed: {
    hasActiveFilters() {
      return this.selectedTypes.length > 0 || this.selectedTags.length > 0 ||
        this.priceFilter !== '' || this.searchQuery.trim() !== ''
    },
    filterCount() {
      return this.selectedTypes.length + this.selectedTags.length + (this.priceFilter ? 1 : 0)
    },
   filtered() {
  let list = this.resources

  if (this.searchQuery.trim()) {
    const q = this.searchQuery.toLowerCase()
    list = list.filter(r => {
      // titre
      if (r.title && r.title.toLowerCase().includes(q)) return true
      // description courte
      if (r.short_description && r.short_description.toLowerCase().includes(q)) return true
      // type brut (ex: "template", "ebook"...)
      if (r.type && r.type.toLowerCase().includes(q)) return true
      // label lisible du type (ex: "Template", "eBook", "Composant"...)
      const typeLabel = this.resourceTypes.find(t => t.value === r.type)?.label ?? ''
      if (typeLabel.toLowerCase().includes(q)) return true
      // noms des tags liés à la ressource
      if (r.tags && r.tags.some(t => t.name.toLowerCase().includes(q))) return true
      return false
    })
  }

  if (this.selectedTypes.length > 0)
    list = list.filter(r => this.selectedTypes.includes(r.type))
  if (this.selectedTags.length > 0)
    list = list.filter(r => r.tags && r.tags.some(t => this.selectedTags.includes(t.id)))
  if (this.priceFilter === 'free')
    list = list.filter(r => r.price == 0 || r.is_free)
  if (this.priceFilter === 'paid')
    list = list.filter(r => r.price > 0 && !r.is_free)

  return list
},
  },

  methods: {
    async fetchResources() {
      this.loading = true; this.error = null
      try {
        const { data } = await API.get('/v1/resources')
        this.resources = Array.isArray(data) ? data : (data.data || [])
      } catch (e) {
        this.error = 'Impossible de charger les ressources.'
      } finally {
        this.loading = false
      }
    },

    async fetchTags() {
      try {
        const { data } = await API.get(`/v1/tags/${this.typetag}`) 
        this.allTags = Array.isArray(data) ? data : (data.data || [])
      } catch (e) {
        console.error(e)
      }
    },

    toggleType(v) { const i = this.selectedTypes.indexOf(v); i > -1 ? this.selectedTypes.splice(i, 1) : this.selectedTypes.push(v) },
    toggleTag(id) { const i = this.selectedTags.indexOf(id); i > -1 ? this.selectedTags.splice(i, 1) : this.selectedTags.push(id) },

    resetFilters() {
      this.selectedTypes = []; this.selectedTags = []
      this.priceFilter = ''; this.searchQuery = ''; this.offcanvasOpen = false
    },

    getTypeCount(v) { return this.resources.filter(r => r.type === v).length },
    getTagCount(id) { return this.resources.filter(r => r.tags && r.tags.some(t => t.id === id)).length },
    getFreeCount() { return this.resources.filter(r => r.price == 0 || r.is_free).length },
    getPaidCount() { return this.resources.filter(r => r.price > 0 && !r.is_free).length },

    typeLabel(type) { return this.resourceTypes.find(t => t.value === type)?.label ?? type },
    typeEmoji(type) { return this.resourceTypes.find(t => t.value === type)?.icon ?? '📦' },

    typeBadgeCls(type) {
      const map = { template: 'badge-purple', plugin: 'badge-blue', ebook: 'badge-green', snippet: 'badge-orange', component: 'badge-blue', tool: 'badge-orange' }
      return map[type] || 'badge-neutral'
    },

    coverStyle(r) {
      if (r.preview_image) return { background: '#111' }
      if (r.cover_color) return { background: r.cover_color }
      const colors = { template: '#ede9fe', plugin: '#dbeafe', ebook: '#dcfce7', snippet: '#fef9c3', component: '#dbeafe', tool: '#ffedd5' }
      return { background: colors[r.type] || '#f1f5f9' }
    },


  },

  created() {
    Promise.all([this.fetchTags(), this.fetchResources()])
  },
}
</script>

<style scoped>
/* ══ Layout ══ */
.content-wrapper {
  display: grid;
  grid-template-columns: 230px 1fr;
  gap: 36px;
  margin-top: 20px;
}

.resources-content {
  min-width: 0;
}

/* ══ Header ══ */
.res-header-row {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
  align-items: flex-start;
}

.section-title {
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 800;
  color: var(--text);
  margin-bottom: 10px;
  letter-spacing: -.8px;
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

/* ══ Barre résultats ══ */
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

.hint-active {
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
  margin-bottom: 24px;
}

.filter-title {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .8px;
  color: var(--text4);
  margin-bottom: 8px;
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
  padding: 7px 10px;
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

.filter-item input {
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
}

.btn-reset:hover {
  background: var(--surface2);
  color: var(--text);
}

/* ══ Cards ══ */
.resource-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.rc-cover {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
}

.rc-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rc-emoji {
  font-size: 42px;
}

.rc-badge {
  position: absolute;
  top: 10px;
  left: 12px;
  font-size: 10.5px;
  font-family: var(--font-mono);
  font-weight: 600;
}

.rc-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.rc-title {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 6px;
  line-height: 1.4;
}

.rc-desc {
  font-size: 12.5px;
  color: var(--text3);
  line-height: 1.6;
  margin-bottom: 10px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 10px;
}

.tag-more {
  background: transparent;
  color: var(--text5);
  border-color: transparent;
  font-size: 11px;
}

.rc-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.rc-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: var(--text5);
}

.rc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--border2);
}

.price-free {
  font-size: 14px;
  font-weight: 700;
  color: #16a34a;
}

.price-paid {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
}

.badge-purple {
  background: #ede9fe;
  color: #7c3aed;
}

.badge-blue {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge-green {
  background: #dcfce7;
  color: #15803d;
}

.badge-orange {
  background: #ffedd5;
  color: #c2410c;
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

.skel-card {
  overflow: hidden;
  pointer-events: none;
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
  max-width: 400px;
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
    grid-template-columns: 200px 1fr;
    gap: 24px;
  }

  .res-header-row {
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
}

@media (max-width: 540px) {
  .section-title {
    font-size: 24px;
  }

  .oc-panel {
    border-radius: 16px 16px 0 0;
  }
}
</style>