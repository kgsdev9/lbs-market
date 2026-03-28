<template>
  <div>
    <!-- Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:16px">
      <div>
        <div style="font-family:var(--font-alt);font-size:20px;font-weight:700;color:var(--text)">Ressources</div>
        <div style="font-size:13px;color:var(--text3);margin-top:3px">
          {{ filteredResources.length }} ressource{{ filteredResources.length !== 1 ? 's' : '' }}
        </div>
      </div>
      <RouterLink to="/dashboard/ressources/new" class="btn btn-primary">
        <span v-html="ICONS.plus"/> Nouvelle ressource
      </RouterLink>
    </div>

    <!-- Tabs + Filtre type -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;gap:12px;flex-wrap:wrap">
      <div class="tabs">
        <button v-for="t in tabs" :key="t.value" class="tab" :class="{ active: tab === t.value }" @click="tab = t.value">
          {{ t.label }}
          <span class="tab-count">{{ t.count }}</span>
        </button>
      </div>
      <select v-model="typeFilter" class="form-input form-select" style="width:auto;font-size:12.5px;padding:6px 10px">
        <option value="">Tous les types</option>
        <option v-for="t in resourceTypes" :key="t.value" :value="t.value">{{ t.icon }} {{ t.label }}</option>
      </select>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="card" style="overflow:hidden">
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:1px solid var(--border);background:var(--surface2)">
            <th style="padding:10px 16px;text-align:left;font-size:11.5px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Ressource</th>
            <th style="padding:10px 16px;text-align:left;font-size:11.5px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Type</th>
            <th style="padding:10px 16px;text-align:left;font-size:11.5px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Tags</th>
            <th style="padding:10px 16px;text-align:left;font-size:11.5px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Prix</th>
            <th style="padding:10px 16px;text-align:left;font-size:11.5px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Statut</th>
            <th style="padding:10px 16px;text-align:left;font-size:11.5px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in 5" :key="n" style="border-bottom:1px solid var(--border2)">
            <td style="padding:12px 16px">
              <div style="display:flex;align-items:center;gap:10px">
                <div class="skel" style="width:36px;height:36px;border-radius:6px;flex-shrink:0"/>
                <div>
                  <div class="skel" style="width:160px;height:13px;border-radius:4px;margin-bottom:6px"/>
                  <div class="skel" style="width:90px;height:11px;border-radius:4px"/>
                </div>
              </div>
            </td>
            <td style="padding:12px 16px"><div class="skel" style="width:80px;height:22px;border-radius:6px"/></td>
            <td style="padding:12px 16px"><div style="display:flex;gap:4px"><div class="skel" style="width:52px;height:22px;border-radius:20px"/><div class="skel" style="width:42px;height:22px;border-radius:20px"/></div></td>
            <td style="padding:12px 16px"><div class="skel" style="width:70px;height:13px;border-radius:4px"/></td>
            <td style="padding:12px 16px"><div class="skel" style="width:70px;height:22px;border-radius:20px"/></td>
            <td style="padding:12px 16px"><div class="skel" style="width:80px;height:13px;border-radius:4px"/></td>
            <td style="padding:12px 16px"><div style="display:flex;gap:4px"><div class="skel" style="width:28px;height:28px;border-radius:6px"/><div class="skel" style="width:28px;height:28px;border-radius:6px"/></div></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="card card-p" style="text-align:center;padding:40px">
      <div style="font-size:28px;margin-bottom:8px">⚠️</div>
      <div style="font-size:14px;color:var(--text3);margin-bottom:16px">{{ error }}</div>
      <button class="btn btn-secondary btn-sm" @click="fetchResources">Réessayer</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredResources.length === 0" class="card card-p" style="text-align:center;padding:48px">
      <div style="font-size:32px;margin-bottom:10px">📦</div>
      <div style="font-size:15px;font-weight:600;color:var(--text);margin-bottom:6px">Aucune ressource</div>
      <div style="font-size:13px;color:var(--text3);margin-bottom:20px">
        {{ tab === 'all' && !typeFilter ? 'Commence par créer ta première ressource.' : 'Essaie un autre filtre.' }}
      </div>
      <RouterLink v-if="tab === 'all' && !typeFilter" to="/dashboard/ressources/new" class="btn btn-primary btn-sm">
        + Nouvelle ressource
      </RouterLink>
    </div>

    <!-- Tableau -->
    <div v-else class="card" style="overflow:hidden">
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:1px solid var(--border);background:var(--surface2)">
            <th style="padding:10px 16px;text-align:left;font-size:11.5px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Ressource</th>
            <th style="padding:10px 16px;text-align:left;font-size:11.5px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Type</th>
            <th style="padding:10px 16px;text-align:left;font-size:11.5px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Tags</th>
            <th style="padding:10px 16px;text-align:left;font-size:11.5px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Prix</th>
            <th style="padding:10px 16px;text-align:left;font-size:11.5px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Statut</th>
            <th style="padding:10px 16px;text-align:left;font-size:11.5px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="r in filteredResources" :key="r.id"
            style="border-bottom:1px solid var(--border2);transition:background .08s"
            @mouseover="e => e.currentTarget.style.background = 'var(--hover)'"
            @mouseleave="e => e.currentTarget.style.background = ''"
          >
            <!-- Ressource -->
            <td style="padding:12px 16px">
              <div style="display:flex;align-items:center;gap:10px">
                <!--  URL B2 directe — plus de /storage/ -->
                <div
                  style="width:36px;height:36px;border-radius:6px;flex-shrink:0;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:17px"
                  :style="{ background: r.preview_image ? 'transparent' : (r.cover_color || '#f0fdf4') }"
                >
                  <img
                    v-if="r.preview_image"
                    :src="r.preview_image"
                    style="width:100%;height:100%;object-fit:cover"
                    @error="e => e.target.style.display='none'"
                  />
                  <span v-else>{{ typeEmoji(r.type) }}</span>
                </div>
                <div>
                  <div style="font-size:13.5px;font-weight:500;color:var(--text)">{{ r.title }}</div>
                  <div style="font-size:11.5px;color:var(--text4);margin-top:2px">
                    ⬇ {{ r.downloads ?? 0 }} téléchargements
                  </div>
                </div>
              </div>
            </td>

            <!-- Type -->
            <td style="padding:12px 16px">
              <span class="type-badge">{{ typeEmoji(r.type) }} {{ typeLabel(r.type) }}</span>
            </td>

            <!-- Tags -->
            <td style="padding:12px 16px">
              <div style="display:flex;flex-wrap:wrap;gap:4px">
                <template v-if="r.tags && r.tags.length">
                  <span v-for="tag in r.tags.slice(0, 3)" :key="tag.id" class="tag">{{ tag.name }}</span>
                  <span v-if="r.tags.length > 3" class="tag tag-more">+{{ r.tags.length - 3 }}</span>
                </template>
                <span v-else style="font-size:12px;color:var(--text5)">—</span>
              </div>
            </td>

            <!-- Prix -->
            <td style="padding:12px 16px;font-size:13px;font-weight:600">
              <span v-if="r.price == 0 || r.is_free" style="color:#16a34a">🆓 Gratuit</span>
              <span v-else style="color:var(--text2)">{{ Number(r.price).toLocaleString() }} FCFA</span>
            </td>

            <!-- ✅ Statut — 'publish' et 'pending' -->
            <td style="padding:12px 16px">
              <span class="badge" :class="r.status === 'publish' ? 'badge-green' : 'badge-orange'" style="font-size:11px">
                {{ r.status === 'publish' ? 'Publié' : 'En attente' }}
              </span>
            </td>

            <!-- Date -->
            <td style="padding:12px 16px;font-size:13px;color:var(--text3)">
              {{ formatDate(r.created_at) }}
            </td>

            <!-- Actions -->
            <td style="padding:12px 16px">
              <div style="display:flex;gap:4px">
                <RouterLink :to="`/dashboard/ressources/${r.id}/edit`" class="btn btn-icon btn-ghost btn-sm" v-html="ICONS.edit"/>
                <button class="btn btn-icon btn-ghost btn-sm" v-html="ICONS.trash" style="color:var(--text4)" @click="confirmDelete(r)"/>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal suppression -->
    <div v-if="toDelete" class="modal-overlay" @click.self="toDelete = null">
      <div class="modal-box">
        <div style="font-size:24px;margin-bottom:10px">🗑️</div>
        <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px">Supprimer la ressource ?</div>
        <div style="font-size:13px;color:var(--text3);margin-bottom:20px">« {{ toDelete.title }} » sera supprimée définitivement.</div>
        <div style="display:flex;gap:8px;justify-content:center">
          <button class="btn btn-ghost btn-sm" @click="toDelete = null">Annuler</button>
          <button class="btn btn-danger btn-sm" :disabled="deleting" @click="deleteResource">
            {{ deleting ? 'Suppression...' : 'Supprimer' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import API from '@/services/api'
import { ICONS } from '@/composables/icons'

const resources  = ref([])
const loading    = ref(true)
const error      = ref(null)
const tab        = ref('all')
const typeFilter = ref('')
const toDelete   = ref(null)
const deleting   = ref(false)

const resourceTypes = [
  { value: 'template',  label: 'Template',  icon: '🎨' },
  { value: 'plugin',    label: 'Plugin',    icon: '🔌' },
  { value: 'ebook',     label: 'Ebook',     icon: '📖' },
  { value: 'snippet',   label: 'Snippet',   icon: '✂️'  },
  { value: 'component', label: 'Composant', icon: '🧩' },
  { value: 'tool',      label: 'Outil',     icon: '🛠️' },
]

async function fetchResources() {
  loading.value = true
  error.value   = null
  try {
    const { data } = await API.get('/admin/resources')
    resources.value = Array.isArray(data) ? data : (data.data ?? [])
  } catch (e) {
    error.value = 'Impossible de charger les ressources.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchResources)

// ✅ 'publish' et non 'published'
const tabs = computed(() => [
  { value: 'all',     label: 'Tout',       count: resources.value.length },
  { value: 'publish', label: 'Publié',     count: resources.value.filter(r => r.status === 'publish').length },
  { value: 'pending', label: 'En attente', count: resources.value.filter(r => r.status === 'pending').length },
])

const filteredResources = computed(() => {
  let list = resources.value
  if (tab.value !== 'all') list = list.filter(r => r.status === tab.value)
  if (typeFilter.value)    list = list.filter(r => r.type   === typeFilter.value)
  return list
})

function typeLabel(type) { return resourceTypes.find(t => t.value === type)?.label ?? type }
function typeEmoji(type) { return resourceTypes.find(t => t.value === type)?.icon  ?? '📦' }

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function confirmDelete(resource) { toDelete.value = resource }

async function deleteResource() {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await API.delete(`/admin/resources/${toDelete.value.id}`)
    resources.value = resources.value.filter(r => r.id !== toDelete.value.id)
    toDelete.value = null
  } catch (e) {
    console.error(e)
    alert('Erreur lors de la suppression.')
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.skel { background: var(--surface2); animation: pulse .9s ease-in-out infinite alternate; }
@keyframes pulse { from { opacity: .5 } to { opacity: 1 } }
.tab-count {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 18px; padding: 0 5px;
  background: var(--surface2); border-radius: 20px;
  font-size: 10px; font-weight: 700; color: var(--text4);
  margin-left: 5px; font-family: var(--font-mono);
}
.tab.active .tab-count { background: var(--accent); color: var(--accent-fg); }
.type-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 8px; border-radius: 6px;
  font-size: 11.5px; font-weight: 600; font-family: var(--font-mono);
  background: var(--surface2); color: var(--text3); border: 1px solid var(--border);
}
.tag {
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: 20px;
  font-size: 11px; font-weight: 500; font-family: var(--font-mono);
  background: var(--surface2); color: var(--text3);
  border: 1px solid var(--border); white-space: nowrap;
}
.tag-more { background: transparent; color: var(--text4); border-color: transparent; }
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center; z-index: 100;
}
.modal-box {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 28px 32px;
  text-align: center; min-width: 320px;
  box-shadow: 0 20px 60px rgba(0,0,0,.2);
}
</style>