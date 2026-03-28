<template>
  <div class="formations-page">

    <!-- Header -->
    <div class="page-header">
      <div>
        <div class="page-title">Formations</div>
        <div class="page-subtitle">
          <template v-if="loading">Chargement…</template>
          <template v-else>{{ formations.length }} formation{{ formations.length !== 1 ? 's' : '' }} disponible{{
            formations.length !== 1 ? 's' : '' }}</template>
        </div>
      </div>
      <RouterLink to="/dashboard/formations/new" class="btn btn-primary">
        <span v-html="ICONS.plus" /> Nouvelle formation
      </RouterLink>
    </div>

    <!-- Erreur -->
    <div v-if="error" class="alert-error">
      ⚠️ {{ error }}
      <button class="btn btn-ghost btn-sm" @click="fetchFormations">Réessayer</button>
    </div>

    <!-- Skeleton loading -->
    <div v-if="loading" class="grid-2">
      <div v-for="n in 4" :key="n" class="card skeleton-card">
        <div class="card-inner">
          <div class="sk-cover" />
          <div class="sk-body">
            <div class="sk-line sk-title" />
            <div class="sk-line sk-meta" />
            <div class="sk-line sk-price" />
            <div class="sk-line sk-actions" />
          </div>
        </div>
      </div>
    </div>

    <!-- Liste réelle -->
    <div v-else-if="formations.length" class="grid-2">
      <div v-for="f in formations" :key="f.id" class="card formation-card">
        <div class="card-inner">

          <!-- Cover -->
          <div class="card-cover" :style="f.image ? {} : { background: f.cover_color || '#dbeafe' }">
            <img v-if="f.image" :src="f.image" :alt="f.title" class="cover-img" />
            <span v-else class="cover-emoji">{{ catEmoji(f.category?.name) }}</span>
            <span v-if="f.badge" class="cover-badge">{{ badgeLabel(f.badge) }}</span>
          </div>

          <div class="card-body">

            <!-- Top : titre + niveau -->
            <div class="card-top">
              <div class="formation-title">{{ f.title }}</div>
              <span class="level-chip" :class="levelClass(f.level)">{{ levelLabel(f.level) }}</span>
            </div>

            <div class="formation-subtitle">{{ f.subtitle }}</div>

            <!-- Meta -->
            <div class="meta-row">
              <span class="meta-item">
                <span v-html="ICONS.users" />
                {{ f.students_count ?? 0 }} élèves
              </span>
              <span class="meta-dot" />
              <span class="meta-item">🕐 {{ f.duration || '—' }}</span>
              <span class="meta-dot" />
              <span class="meta-item">
                <span class="status-dot" :class="f.status === 'published' ? 'dot-green' : 'dot-orange'" />
                {{ f.status === 'published' ? 'Publié' : 'Brouillon' }}
              </span>
            </div>

            <!-- Prix -->
            <div class="price-row">
              <span class="price-tag" :class="{ 'price-free': f.is_free }">
                {{ f.is_free ? 'Gratuit' : formatPrice(f.price) }}
              </span>
            </div>

            <!-- Actions séparées du footer -->
            <div class="card-actions">

              <!-- Ligne 1 : icônes rapides -->
              <div class="actions-row">
                <RouterLink :to="`/dashboard/formations/${f.id}/edit`" class="btn btn-icon btn-ghost btn-sm"
                  title="Modifier" v-html="ICONS.edit" />
                <button class="btn btn-icon btn-ghost btn-sm delete-btn" title="Supprimer" v-html="ICONS.trash"
                  @click="confirmDelete(f)" />
              </div>

              <!-- Ligne 2 : boutons texte -->
              <div class="actions-btns">
                <button class="btn btn-outline btn-sm" @click="copyPreinscriptionLink(f)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  Lien préinscription
                </button>
                <span v-if="linkCopied === f.id" class="copy-success">✓ Copié !</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <div class="empty-icon">📚</div>
      <div class="empty-title">Aucune formation</div>
      <div class="empty-sub">Créez votre première formation pour commencer.</div>
      <RouterLink to="/dashboard/formations/new" class="btn btn-primary btn-sm">
        <span v-html="ICONS.plus" /> Créer une formation
      </RouterLink>
    </div>

    <!-- Modal suppression -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="modal-backdrop" @click.self="deleteTarget = null">
        <div class="modal">
          <div class="modal-icon">🗑️</div>
          <div class="modal-title">Supprimer la formation ?</div>
          <div class="modal-desc">
            <strong>« {{ deleteTarget.title }} »</strong> sera supprimée définitivement.
          </div>
          <div class="modal-actions">
            <button class="btn btn-ghost btn-sm" @click="deleteTarget = null">Annuler</button>
            <button class="btn btn-danger btn-sm" :disabled="deleting" @click="deleteFormation">
              {{ deleting ? 'Suppression…' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
import API from '@/services/api'
import { ICONS } from '@/composables/icons'

export default {
  name: 'FormationsAdminPage',
  components: { RouterLink },

  data() {
    return {
      ICONS,
      formations: [],
      loading: false,
      error: null,
      deleteTarget: null,
      deleting: false,
      linkCopied: null,
    }
  },

  methods: {
    async fetchFormations() {
      this.loading = true
      this.error = null
      try {
        const { data } = await API.get('/admin/formations')
        this.formations = Array.isArray(data) ? data : (data.data || [])
      } catch (e) {
        this.error = e.response?.data?.message || 'Impossible de charger les formations.'
      } finally {
        this.loading = false
      }
    },

    confirmDelete(f) {
      this.deleteTarget = f
    },

    async deleteFormation() {
      if (!this.deleteTarget) return
      this.deleting = true
      try {
        await API.delete(`/admin/formations/${this.deleteTarget.id}`)
        this.formations = this.formations.filter(f => f.id !== this.deleteTarget.id)
        this.deleteTarget = null
      } catch (e) {
        alert(e.response?.data?.message || 'Erreur lors de la suppression.')
      } finally {
        this.deleting = false
      }
    },

    copyPreinscriptionLink(f) {
      const route = this.$router.resolve({ name: 'preinscription', params: { slug: f.slug } })
      const url = `${window.location.origin}${route.href}`
      navigator.clipboard.writeText(url).then(() => {
        this.linkCopied = f.id
        setTimeout(() => this.linkCopied = null, 2500)
      })
    },

    catEmoji(cat) {
      return { Web: '🌐', Data: '📊', DevOps: '⚙️', Mobile: '📱' }[cat] || '💻'
    },

    levelLabel(level) {
      return { debutant: 'Débutant', intermediaire: 'Intermédiaire', professionnel: 'Professionnel' }[level] || level
    },

    levelClass(level) {
      return { debutant: 'level-green', intermediaire: 'level-blue', professionnel: 'level-red' }[level] || 'level-gray'
    },

    badgeLabel(badge) {
      return { bestseller: 'Bestseller', popular: 'Populaire', new: 'Nouveau', featured: 'À la une' }[badge] || badge
    },

    formatPrice(price) {
      if (!price && price !== 0) return '—'
      return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
    },
  },

  mounted() {
    this.fetchFormations()
  },
}
</script>

<style scoped>
.formations-page {
  padding-bottom: 40px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-family: var(--font-alt);
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
}

.page-subtitle {
  font-size: 13px;
  color: var(--text3);
  margin-top: 2px;
}

.alert-error {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  font-size: 13px;
  margin-bottom: 20px;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;
}

/* ── Card ── */
.formation-card {
  padding: 0;
  overflow: hidden;
}

.card-inner {
  display: flex;
  align-items: stretch;
}

/* ── Cover ── */
.card-cover {
  width: 110px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  min-height: 180px;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cover-emoji {
  font-size: 32px;
  line-height: 1;
}

.cover-badge {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  font-weight: 700;
  background: rgba(0, 0, 0, .45);
  color: #fff;
  padding: 2px 7px;
  border-radius: 10px;
  white-space: nowrap;
  backdrop-filter: blur(4px);
}

/* ── Body ── */
.card-body {
  padding: 14px 14px 12px;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.formation-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.35;
}

.formation-subtitle {
  font-size: 12px;
  color: var(--text4);
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.level-chip {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  flex-shrink: 0;
  white-space: nowrap;
}

.level-green {
  background: #dcfce7;
  color: #15803d;
}

.level-blue {
  background: #dbeafe;
  color: #1d4ed8;
}

.level-red {
  background: #fee2e2;
  color: #b91c1c;
}

.level-gray {
  background: var(--surface2);
  color: var(--text4);
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: var(--text4);
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--border);
  flex-shrink: 0;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-green {
  background: #22c55e;
}

.dot-orange {
  background: #f59e0b;
}

.price-row {
  display: flex;
  align-items: center;
}

.price-tag {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
}

.price-free {
  color: #15803d;
}

/* ── Actions ── */
.card-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--border2);
  margin-top: auto;
}

.actions-row {
  display: flex;
  gap: 4px;
  align-items: center;
}

.actions-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.delete-btn {
  color: var(--text4) !important;
}

.delete-btn:hover {
  color: #dc2626 !important;
}

.copy-success {
  font-size: 12px;
  font-weight: 600;
  color: #16a34a;
}

/* ── Skeleton ── */
.skeleton-card {
  padding: 0;
  overflow: hidden;
}

.sk-cover {
  width: 110px;
  min-height: 180px;
  background: var(--surface2);
  animation: pulse .9s ease-in-out infinite alternate;
  flex-shrink: 0;
}

.sk-body {
  padding: 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sk-line {
  border-radius: 6px;
  background: var(--surface2);
  animation: pulse .9s ease-in-out infinite alternate;
}

.sk-title {
  height: 14px;
  width: 70%;
}

.sk-meta {
  height: 11px;
  width: 50%;
  animation-delay: .1s;
}

.sk-price {
  height: 13px;
  width: 30%;
  animation-delay: .2s;
}

.sk-actions {
  height: 30px;
  width: 90%;
  animation-delay: .3s;
  border-radius: 6px;
  margin-top: 4px;
}

@keyframes pulse {
  from {
    opacity: .45;
  }

  to {
    opacity: 1;
  }
}

/* ── Empty ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 60px 20px;
  text-align: center;
  border: 2px dashed var(--border);
  border-radius: 12px;
}

.empty-icon {
  font-size: 40px;
}

.empty-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
}

.empty-sub {
  font-size: 13px;
  color: var(--text4);
  margin-bottom: 4px;
}

/* ── Modal ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 28px 24px;
  max-width: 360px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, .2);
}

.modal-icon {
  font-size: 36px;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
}

.modal-desc {
  font-size: 13px;
  color: var(--text3);
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.btn-danger {
  background: #dc2626;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background .15s;
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
}

.btn-danger:disabled {
  opacity: .6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>