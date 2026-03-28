<template>
  <div>

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:16px">
      <div>
        <div style="font-family:var(--font-alt);font-size:20px;font-weight:700;color:var(--text)">Projets</div>
        <div style="font-size:13px;color:var(--text3)">
          <template v-if="loading">Chargement…</template>
          <template v-else>{{ projects.length }} projet{{ projects.length > 1 ? 's' : '' }}</template>
        </div>
      </div>
      <RouterLink to="/dashboard/projets/new" class="btn btn-primary">
        <span v-html="ICONS.plus"/> Nouveau projet
      </RouterLink>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="grid-3">
      <div v-for="n in 3" :key="n" class="card">
        <div style="padding:16px;border-bottom:1px solid var(--border2);display:flex;align-items:center;gap:10px">
          <div class="skel" style="width:40px;height:40px;border-radius:var(--radius-sm);flex-shrink:0"/>
          <div style="flex:1;display:flex;flex-direction:column;gap:8px">
            <div class="skel" style="height:14px;width:65%"/>
            <div class="skel" style="height:18px;width:80px;border-radius:99px"/>
          </div>
        </div>
        <div style="padding:14px;display:flex;flex-direction:column;gap:10px">
          <div class="skel" style="height:12px;width:100%"/>
          <div class="skel" style="height:12px;width:75%"/>
          <div class="skel" style="height:30px;width:100%;border-radius:var(--radius-sm)"/>
        </div>
      </div>
    </div>

    <!-- ERREUR -->
    <div v-else-if="error" class="dash-state">
      <p style="color:var(--red)">{{ error }}</p>
      <button class="btn btn-primary btn-sm" @click="fetchProjects">Réessayer</button>
    </div>

    <!-- VIDE -->
    <div v-else-if="projects.length === 0" class="dash-state">
      <span v-html="ICONS.project" style="width:40px;height:40px;opacity:.25"/>
      <p style="color:var(--text3)">Aucun projet pour le moment.</p>
      <RouterLink to="/dashboard/projets/new" class="btn btn-primary btn-sm">
        <span v-html="ICONS.plus"/> Créer mon premier projet
      </RouterLink>
    </div>

    <!-- GRILLE -->
    <div v-else class="grid-3">
      <div v-for="p in projects" :key="p.id" class="card">

        <div style="padding:16px;border-bottom:1px solid var(--border2);display:flex;align-items:center;gap:10px">
          <div
            style="width:40px;height:40px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;color:var(--text2);flex-shrink:0"
            :style="{ background: p.cover_color || '#f1f5f9' }"
            v-html="ICONS.project"
          />
          <div style="flex:1;min-width:0">
            <div style="font-size:14px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ p.title }}</div>
            <span class="badge" :class="statusBadge(p.status)" style="font-size:10.5px">{{ statusLabel(p.status) }}</span>
          </div>
        </div>

        <div style="padding:14px">
          <div style="font-size:13px;color:var(--text3);margin-bottom:10px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.5">
            {{ p.excerpt || p.description }}
          </div>

          <div v-if="p.tags && p.tags.length" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">
            <span v-for="tag in p.tags.slice(0, 3)" :key="tag.id" class="tag" style="font-family:var(--font-mono);font-size:10.5px">{{ tag.name }}</span>
            <span v-if="p.tags.length > 3" style="font-size:10.5px;color:var(--text4)">+{{ p.tags.length - 3 }}</span>
          </div>

          <div style="margin-bottom:12px">
            <span class="level-badge" :class="'level-' + p.level">{{ levelLabel(p.level) }}</span>
          </div>

          <div style="display:flex;gap:6px">
            <a v-if="p.github_link" :href="p.github_link" target="_blank" class="btn btn-secondary btn-sm" style="flex:1;justify-content:center">
              <span v-html="ICONS.github"/> GitHub
            </a>
            <RouterLink :to="`/dashboard/projets/${p.id}/edit`" class="btn btn-icon btn-ghost btn-sm" v-html="ICONS.edit"/>
            <button
              class="btn btn-icon btn-ghost btn-sm"
              style="color:var(--red)"
              :disabled="deletingId === p.id"
              @click="confirmDelete(p)"
              v-html="deletingId === p.id ? ICONS.loader : ICONS.trash"
            />
          </div>
        </div>

      </div>
    </div>

    <!-- MODAL SUPPRESSION -->
    <div v-if="toDelete" class="modal-overlay" @click.self="toDelete = null">
      <div class="modal-box">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:8px">Supprimer le projet ?</h3>
        <p style="font-size:13.5px;color:var(--text3);margin-bottom:20px;line-height:1.6">
          Tu es sur le point de supprimer <strong>{{ toDelete.title }}</strong>.<br>Cette action est irréversible.
        </p>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button class="btn btn-ghost btn-sm" @click="toDelete = null">Annuler</button>
          <button class="btn btn-sm" style="background:var(--red);color:#fff" :disabled="deletingId === toDelete.id" @click="deleteProject(toDelete.id)">
            {{ deletingId === toDelete.id ? 'Suppression…' : 'Supprimer définitivement' }}
          </button>
        </div>
      </div>
    </div>

    <!-- TOAST -->
    <div class="toast" :class="{ show: toast.show, error: toast.type === 'error' }">{{ toast.message }}</div>

  </div>
</template>

<script>
import API from '@/services/api'
import { RouterLink } from 'vue-router'
import { ICONS } from '@/composables/icons'

export default {
  name: 'DashboardProjectsView',
  components: { RouterLink },

  data() {
    return {
      projects: [], loading: true, error: null,
      deletingId: null, toDelete: null,
      toast: { show: false, message: '', type: 'success' },
      ICONS,
    }
  },

  methods: {
    async fetchProjects() {
      this.loading = true; this.error = null
      try {
        const { data } = await API.get('/admin/projects', { params: { mine: 1 } })
        this.projects = Array.isArray(data) ? data : (data.data || [])
      } catch (e) {
        this.error = 'Impossible de charger les projets.'
      } finally {
        this.loading = false
      }
    },

    confirmDelete(project) { this.toDelete = project },

    async deleteProject(id) {
      this.deletingId = id
      try {
        await API.delete(`/admin/projects/${id}`)
        this.projects   = this.projects.filter(p => p.id !== id)
        this.toDelete   = null
        this.showToast('Projet supprimé avec succès')
      } catch (e) {
        this.showToast('Erreur lors de la suppression', 'error')
      } finally {
        this.deletingId = null
      }
    },

    showToast(message, type = 'success') {
      this.toast = { show: true, message, type }
      setTimeout(() => { this.toast.show = false }, 3000)
    },

    statusLabel(status) { return { production:'En production', dev:'En dev', testing:'En test' }[status] || status },
    statusBadge(status) { return status === 'production' ? 'badge-green' : 'badge-orange' },
    levelLabel(level)   { return { debutant:'Débutant', intermediaire:'Intermédiaire', professionnel:'Pro' }[level] || level },
  },

  created() { this.fetchProjects() },
}
</script>

<style scoped>
.skel { background: linear-gradient(90deg, var(--surface2) 25%, var(--surface) 50%, var(--surface2) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; display: block; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.dash-state { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:60px 24px;text-align:center; }
.level-badge         { font-size:11px;font-weight:600;padding:2px 9px;border-radius:99px;font-family:var(--font-mono); }
.level-debutant      { background:#dcfce7;color:#166534; }
.level-intermediaire { background:#fef9c3;color:#854d0e; }
.level-professionnel { background:#ede9fe;color:#5b21b6; }
.modal-overlay { position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:24px; }
.modal-box { background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:24px;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,.2); }
.toast { position:fixed;bottom:24px;right:24px;background:#18181b;color:#fff;padding:10px 20px;border-radius:8px;font-size:13.5px;font-weight:600;transform:translateY(80px);opacity:0;transition:all .25s;pointer-events:none;z-index:400; }
.toast.show       { transform:translateY(0);opacity:1; }
.toast.show.error { background:var(--red); }
</style>