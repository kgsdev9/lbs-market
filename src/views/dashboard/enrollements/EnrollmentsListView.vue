<template>
  <div class="enrollments-page">

    <!-- Header -->
    <div class="page-header">
      <div>
        <div class="page-title">Mes formations</div>
        <div class="page-subtitle">
          <template v-if="loading">Chargement…</template>
          <template v-else>{{ enrollments.length }} formation{{ enrollments.length !== 1 ? 's' : '' }} souscrite{{ enrollments.length !== 1 ? 's' : '' }}</template>
        </div>
      </div>
      <!-- Filtres statut -->
      <div class="status-tabs">
        <button
          v-for="tab in statusTabs" :key="tab.value"
          class="status-tab"
          :class="{ active: activeStatus === tab.value }"
          @click="activeStatus = tab.value"
        >
          {{ tab.label }}
          <span class="status-count">{{ getStatusCount(tab.value) }}</span>
        </button>
      </div>
    </div>

    <!-- Erreur -->
    <div v-if="error" class="alert-error">
      ⚠️ {{ error }}
      <button class="btn btn-ghost btn-sm" @click="fetchEnrollments">Réessayer</button>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="enrollments-grid">
      <div v-for="n in 4" :key="n" class="enroll-card card">
        <div class="card-inner">
          <div class="sk-cover"/>
          <div class="sk-body">
            <div class="skel" style="height:14px;width:70%;margin-bottom:10px"/>
            <div class="skel" style="height:11px;width:50%;margin-bottom:8px"/>
            <div class="skel" style="height:8px;width:100%;border-radius:99px;margin-bottom:16px"/>
            <div class="skel" style="height:32px;width:120px;border-radius:8px"/>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste -->
    <div v-else-if="filtered.length" class="enrollments-grid">
      <div v-for="e in filtered" :key="e.id" class="enroll-card card">
        <div class="card-inner">

          <!-- Cover -->
          <div
            class="enroll-cover"
            :style="e.formation?.image ? {} : { background: e.formation?.cover_color || '#4f46e5' }"
          >
            <img
              v-if="e.formation?.image"
              :src="e.formation.image"
              :alt="e.formation.title"
              class="cover-img"
            />
            <span v-else class="cover-emoji">🎓</span>
            <!-- Badge statut -->
            <span class="enroll-status-badge" :class="statusCls(e.status)">
              {{ statusLabel(e.status) }}
            </span>
          </div>

          <!-- Body -->
          <div class="enroll-body">
            <div class="enroll-top">
              <div class="enroll-title">{{ e.formation?.title || '—' }}</div>
              <span class="level-chip" :class="levelCls(e.formation?.level)">
                {{ levelLabel(e.formation?.level) }}
              </span>
            </div>

            <div class="enroll-sub">{{ e.formation?.subtitle }}</div>

            <!-- Progression -->
            <div class="progress-block">
              <div class="progress-header">
                <span class="progress-label">Progression</span>
                <span class="progress-pct" :class="{ done: e.progress_percentage >= 100 }">
                  {{ e.progress_percentage || 0 }}%
                </span>
              </div>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :class="{ 'fill-done': e.progress_percentage >= 100 }"
                  :style="{ width: (e.progress_percentage || 0) + '%' }"
                />
              </div>
            </div>

            <!-- Meta -->
            <div class="enroll-meta">
              <span class="meta-item">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ e.formation?.duration || '—' }}
              </span>
              <span class="meta-dot"/>
              <span class="meta-item">
                Inscrit le {{ formatDate(e.enrolled_at) }}
              </span>
              <template v-if="e.last_accessed_at">
                <span class="meta-dot"/>
                <span class="meta-item">
                  Vu le {{ formatDate(e.last_accessed_at) }}
                </span>
              </template>
            </div>

            <!-- Footer -->
            <div class="enroll-footer">
              <div class="enroll-price">
                <span v-if="e.amount_paid == 0" class="price-free">Gratuit</span>
                <span v-else class="price-paid">{{ formatPrice(e.amount_paid) }}</span>
              </div>
              <div class="enroll-actions">
                <RouterLink
                  :to="`/formations/player/${e.formation?.slug}`"
                  class="btn btn-primary btn-sm">
                  {{ e.progress_percentage >= 100 ? 'Revoir' : e.progress_percentage > 0 ? 'Continuer' : 'Commencer' }}
                </RouterLink>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="empty-state">
      <div class="empty-icon">📚</div>
      <div class="empty-title">
        {{ activeStatus === 'all' ? 'Aucune formation souscrite' : 'Aucune formation ' + statusLabel(activeStatus).toLowerCase() }}
      </div>
      <div class="empty-sub">
        {{ activeStatus === 'all' ? 'Explorez notre catalogue et inscrivez-vous à une formation.' : 'Changez de filtre pour voir vos autres formations.' }}
      </div>
      <RouterLink v-if="activeStatus === 'all'" to="/formations" class="btn btn-primary btn-sm">
        Voir les formations
      </RouterLink>
      <button v-else class="btn btn-ghost btn-sm" @click="activeStatus = 'all'">
        Voir toutes mes formations
      </button>
    </div>

  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
import API from '@/services/api'

export default {
  name: 'EnrollmentsListView',
  components: { RouterLink },

  data() {
    return {
      enrollments:  [],
      loading:      true,
      error:        null,
      activeStatus: 'all',

      statusTabs: [
        { value: 'all',       label: 'Toutes' },
        { value: 'active',    label: 'En cours' },
        { value: 'completed', label: 'Terminées' },
        { value: 'cancelled', label: 'Annulées' },
      ],
    }
  },

  computed: {
    filtered() {
      if (this.activeStatus === 'all') return this.enrollments
      return this.enrollments.filter(e => e.status === this.activeStatus)
    },
  },

  methods: {
    async fetchEnrollments() {
      this.loading = true
      this.error   = null
      try {
        const { data } = await API.get('/admin/enrollments/mine')
        this.enrollments = Array.isArray(data) ? data : (data.data || [])
      } catch (e) {
        this.error = e.response?.data?.message || 'Impossible de charger vos formations.'
      } finally {
        this.loading = false
      }
    },

    getStatusCount(status) {
      if (status === 'all') return this.enrollments.length
      return this.enrollments.filter(e => e.status === status).length
    },

    statusLabel(s) {
      return { active: 'En cours', completed: 'Terminée', cancelled: 'Annulée' }[s] || s
    },

    statusCls(s) {
      return { active: 'badge-active', completed: 'badge-done', cancelled: 'badge-cancelled' }[s] || ''
    },

    levelLabel(l) {
      return { debutant: 'Débutant', intermediaire: 'Intermédiaire', professionnel: 'Professionnel' }[l?.toLowerCase()] || l || '—'
    },

    levelCls(l) {
      return { debutant: 'lvl-green', intermediaire: 'lvl-blue', professionnel: 'lvl-purple' }[l?.toLowerCase()] || 'lvl-gray'
    },

    formatDate(d) {
      if (!d) return '—'
      return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    },

    formatPrice(p) {
      if (!p && p !== 0) return '—'
      return new Intl.NumberFormat('fr-FR').format(p) + ' FCFA'
    },
  },

  mounted() {
    this.fetchEnrollments()
  },
}
</script>

<style scoped>
.enrollments-page { padding-bottom: 40px; }

/* Header */
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
.page-title   { font-size: 20px; font-weight: 700; color: var(--text); }
.page-subtitle { font-size: 13px; color: var(--text3); margin-top: 2px; }

/* Status tabs */
.status-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.status-tab {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 8px;
  border: 1.5px solid var(--border);
  background: var(--surface); font-size: 13px; font-weight: 600;
  color: var(--text3); cursor: pointer; transition: all .15s;
}
.status-tab:hover { border-color: var(--accent); color: var(--accent); }
.status-tab.active { background: var(--accent); border-color: var(--accent); color: #fff; }
.status-tab.active .status-count { background: rgba(255,255,255,.25); color: #fff; }
.status-count { font-size: 11px; font-weight: 700; background: var(--surface2); color: var(--text4); padding: 1px 7px; border-radius: 20px; }

/* Alert */
.alert-error { display: flex; align-items: center; gap: 12px; justify-content: space-between; padding: 12px 16px; border-radius: 8px; background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; font-size: 13px; margin-bottom: 20px; }

/* Grid */
.enrollments-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 16px; }

/* Card */
.enroll-card { padding: 0; overflow: hidden; }
.card-inner  { display: flex; align-items: stretch; }

/* Cover */
.enroll-cover {
  width: 120px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden; min-height: 160px;
}
.cover-img   { width: 100%; height: 100%; object-fit: cover; display: block; }
.cover-emoji { font-size: 36px; }

/* Status badge sur cover */
.enroll-status-badge {
  position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%);
  font-size: 9px; font-weight: 700; white-space: nowrap;
  padding: 3px 8px; border-radius: 10px;
  backdrop-filter: blur(6px);
}
.badge-active    { background: rgba(34,197,94,.85);  color: #fff; }
.badge-done      { background: rgba(99,102,241,.85); color: #fff; }
.badge-cancelled { background: rgba(239,68,68,.85);  color: #fff; }

/* Body */
.enroll-body { padding: 14px 14px 12px; flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 7px; }
.enroll-top  { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.enroll-title { font-size: 14px; font-weight: 700; color: var(--text); line-height: 1.35; }
.enroll-sub   { font-size: 12px; color: var(--text4); line-height: 1.5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Level chip */
.level-chip   { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 20px; flex-shrink: 0; white-space: nowrap; }
.lvl-green  { background: #dcfce7; color: #15803d; }
.lvl-blue   { background: #dbeafe; color: #1d4ed8; }
.lvl-purple { background: #ede9fe; color: #7c3aed; }
.lvl-gray   { background: var(--surface2); color: var(--text4); }

/* Progression */
.progress-block { display: flex; flex-direction: column; gap: 5px; }
.progress-header { display: flex; justify-content: space-between; align-items: center; }
.progress-label  { font-size: 11px; color: var(--text4); font-weight: 500; }
.progress-pct    { font-size: 11px; font-weight: 700; color: var(--accent); }
.progress-pct.done { color: #16a34a; }
.progress-bar  { height: 6px; background: var(--surface2); border-radius: 99px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--accent); border-radius: 99px; transition: width .4s ease; }
.fill-done     { background: #22c55e; }

/* Meta */
.enroll-meta { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text5); flex-wrap: wrap; }
.meta-item   { display: flex; align-items: center; gap: 3px; }
.meta-dot    { width: 3px; height: 3px; border-radius: 50%; background: var(--border); flex-shrink: 0; }

/* Footer */
.enroll-footer  { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 10px; border-top: 1px solid var(--border2); }
.enroll-actions { display: flex; gap: 6px; }
.price-free { font-size: 13px; font-weight: 700; color: #16a34a; }
.price-paid { font-size: 13px; font-weight: 700; color: var(--text); }

/* Skeleton */
.sk-cover { width: 120px; min-height: 160px; background: var(--surface2); animation: pulse .9s ease-in-out infinite alternate; flex-shrink: 0; }
.sk-body  { padding: 14px; flex: 1; display: flex; flex-direction: column; }
.skel { background: linear-gradient(90deg, var(--surface2) 0%, var(--surface) 50%, var(--surface2) 100%); background-size: 200% 100%; animation: sk 1.4s infinite; border-radius: 5px; }
@keyframes sk { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
@keyframes pulse { from { opacity: .45; } to { opacity: 1; } }

/* Empty */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 60px 20px; text-align: center; border: 2px dashed var(--border); border-radius: 12px; }
.empty-icon  { font-size: 40px; }
.empty-title { font-size: 16px; font-weight: 700; color: var(--text); }
.empty-sub   { font-size: 13px; color: var(--text4); margin-bottom: 4px; max-width: 340px; }

/* Responsive */
@media (max-width: 640px) {
  .enrollments-grid { grid-template-columns: 1fr; }
  .page-header { flex-direction: column; }
  .status-tabs { width: 100%; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; }
}
</style>