<template>
  <div>
    <!-- Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;gap:16px;flex-wrap:wrap">
      <div>
        <div style="font-family:var(--font-alt);font-size:20px;font-weight:700;color:var(--text)">Articles</div>
        <div style="font-size:13px;color:var(--text3);margin-top:3px">
          {{ filteredArticles.length }} article{{ filteredArticles.length !== 1 ? 's' : '' }}
        </div>
      </div>
      <RouterLink to="/dashboard/articles/new" class="btn btn-primary">
        <span v-html="ICONS.plus"/> Nouvel article
      </RouterLink>
    </div>

    <!-- Tabs -->
    <div class="tabs" style="margin-bottom:16px">
      <button v-for="t in tabs" :key="t.value" class="tab" :class="{ active: tab === t.value }" @click="tab = t.value">
        {{ t.label }}
        <span class="tab-count">{{ t.count }}</span>
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="card" style="overflow:hidden">
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:1px solid var(--border);background:var(--surface2)">
            <th class="th">Article</th>
            <th class="th">Auteur</th>
            <th class="th">Tags</th>
            <th class="th">Vues</th>
            <th class="th">Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in 5" :key="n" style="border-bottom:1px solid var(--border2)">
            <td style="padding:12px 16px">
              <div style="display:flex;align-items:center;gap:10px">
                <div class="skel" style="width:44px;height:44px;border-radius:6px;flex-shrink:0"/>
                <div>
                  <div class="skel" style="width:180px;height:13px;border-radius:4px;margin-bottom:6px"/>
                  <div class="skel" style="width:80px;height:11px;border-radius:4px"/>
                </div>
              </div>
            </td>
            <td style="padding:12px 16px"><div style="display:flex;align-items:center;gap:7px"><div class="skel" style="width:24px;height:24px;border-radius:50%"/><div class="skel" style="width:80px;height:12px;border-radius:4px"/></div></td>
            <td style="padding:12px 16px"><div style="display:flex;gap:4px"><div class="skel" style="width:52px;height:22px;border-radius:20px"/><div class="skel" style="width:42px;height:22px;border-radius:20px"/></div></td>
            <td style="padding:12px 16px"><div class="skel" style="width:40px;height:13px;border-radius:4px"/></td>
            <td style="padding:12px 16px"><div class="skel" style="width:90px;height:13px;border-radius:4px"/></td>
            <td style="padding:12px 16px"><div style="display:flex;gap:4px"><div class="skel" style="width:28px;height:28px;border-radius:6px"/><div class="skel" style="width:28px;height:28px;border-radius:6px"/></div></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="card card-p" style="text-align:center;padding:40px">
      <div style="font-size:28px;margin-bottom:8px">⚠️</div>
      <div style="font-size:14px;color:var(--text3);margin-bottom:16px">{{ error }}</div>
      <button class="btn btn-secondary btn-sm" @click="fetchArticles">Réessayer</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredArticles.length === 0" class="card card-p" style="text-align:center;padding:48px">
      <div style="font-size:32px;margin-bottom:10px">📝</div>
      <div style="font-size:15px;font-weight:600;color:var(--text);margin-bottom:6px">
        {{ tab === 'all' ? 'Aucun article' : 'Aucun article dans cette catégorie' }}
      </div>
      <div style="font-size:13px;color:var(--text3);margin-bottom:20px">
        {{ tab === 'all' ? 'Commence par créer ton premier article.' : 'Essaie un autre filtre.' }}
      </div>
      <RouterLink v-if="tab === 'all'" to="/dashboard/articles/new" class="btn btn-primary btn-sm">+ Nouvel article</RouterLink>
    </div>

    <!-- Table -->
    <div v-else class="card" style="overflow:hidden">
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:1px solid var(--border);background:var(--surface2)">
            <th class="th">Article</th>
            <th class="th">Auteur</th>
            <th class="th">Tags</th>
            <th class="th">Vues</th>
            <th class="th">Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="a in filteredArticles" :key="a.id"
            style="border-bottom:1px solid var(--border2);transition:background .08s"
            @mouseover="e => e.currentTarget.style.background = 'var(--surface2)'"
            @mouseleave="e => e.currentTarget.style.background = ''"
          >
            <!-- Article -->
            <td style="padding:12px 16px">
              <div style="display:flex;align-items:center;gap:10px">
                <!-- Miniature : image S3 si dispo, sinon couleur de couverture -->
                <div
                  style="width:44px;height:44px;border-radius:6px;flex-shrink:0;overflow:hidden"
                  :style="{ background: a.cover_color || '#dbeafe' }"
                >
                  <img
                    v-if="a.image"
                    :src="a.image"
                    :alt="a.title"
                    style="width:100%;height:100%;object-fit:cover;display:block"
                  />
                </div>
                <div style="min-width:0">
                  <div style="font-size:13.5px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px">{{ a.title }}</div>
                  <div style="font-size:11.5px;color:var(--text4);margin-top:2px">
                    {{ a.read_time ? a.read_time + ' de lecture' : '—' }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Auteur -->
            <td style="padding:12px 16px">
              <div style="display:flex;align-items:center;gap:7px">
                <div class="avatar">{{ a.author?.name ? a.author.name.charAt(0).toUpperCase() : '?' }}</div>
                <span style="font-size:12.5px;color:var(--text2);font-weight:500">{{ a.author?.name ?? '—' }}</span>
              </div>
            </td>

            <!-- Tags -->
            <td style="padding:12px 16px">
              <div style="display:flex;flex-wrap:wrap;gap:4px">
                <template v-if="a.tags && a.tags.length">
                  <span v-for="tag in a.tags.slice(0, 3)" :key="tag.id" class="tag">{{ tag.name }}</span>
                  <span v-if="a.tags.length > 3" class="tag tag-more">+{{ a.tags.length - 3 }}</span>
                </template>
                <span v-else style="font-size:12px;color:var(--text5)">—</span>
              </div>
            </td>

            <!-- Vues -->
            <td style="padding:12px 16px;font-size:13px;color:var(--text2)">{{ (a.views ?? 0).toLocaleString() }}</td>

            <!-- Date -->
            <td style="padding:12px 16px;font-size:13px;color:var(--text3)">{{ formatDate(a.created_at) }}</td>

            <!-- Actions -->
            <td style="padding:12px 16px">
              <div style="display:flex;gap:4px">
                <RouterLink :to="`/dashboard/articles/${a.id}/edit`" class="btn btn-icon btn-ghost btn-sm" v-html="ICONS.edit"/>
                <button class="btn btn-icon btn-ghost btn-sm" v-html="ICONS.trash" style="color:var(--text4)" @click="confirmDelete(a)"/>
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
        <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px">Supprimer l'article ?</div>
        <div style="font-size:13px;color:var(--text3);margin-bottom:20px">« {{ toDelete.title }} » sera supprimé définitivement.</div>
        <div style="display:flex;gap:8px;justify-content:center">
          <button class="btn btn-ghost btn-sm" @click="toDelete = null">Annuler</button>
          <button class="btn btn-danger btn-sm" :disabled="deleting" @click="deleteArticle">
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

const articles = ref([])
const loading  = ref(true)
const error    = ref(null)
const tab      = ref('all')
const toDelete = ref(null)
const deleting = ref(false)

async function fetchArticles() {
  loading.value = true
  error.value   = null
  try {
    const { data } = await API.get('/admin/articles')
    articles.value = Array.isArray(data) ? data : (data.data ?? [])
  } catch (e) {
    error.value = 'Impossible de charger les articles.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchArticles)

const tabs = computed(() => [
  { value: 'all',       label: 'Tout',      count: articles.value.length },
  { value: 'published', label: 'Publié',    count: articles.value.filter(a => a.status === 'published').length },
  { value: 'draft',     label: 'Brouillon', count: articles.value.filter(a => a.status === 'draft').length },
])

const filteredArticles = computed(() => {
  if (tab.value === 'all') return articles.value
  return articles.value.filter(a => a.status === tab.value)
})

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function confirmDelete(article) { toDelete.value = article }

async function deleteArticle() {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await API.delete(`/admin/articles/${toDelete.value.id}`)
    articles.value = articles.value.filter(a => a.id !== toDelete.value.id)
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
.th { padding:10px 16px;text-align:left;font-size:11.5px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px; }
.skel { background:var(--surface2);animation:pulse .9s ease-in-out infinite alternate; }
@keyframes pulse { from{opacity:.5} to{opacity:1} }
.tab-count { display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;background:var(--surface2);border-radius:20px;font-size:10px;font-weight:700;color:var(--text4);margin-left:5px;font-family:var(--font-mono); }
.tab.active .tab-count { background:var(--accent);color:var(--accent-fg); }
.avatar { width:24px;height:24px;border-radius:50%;background:var(--accent);color:var(--accent-fg);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.tag { display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500;font-family:var(--font-mono);background:var(--surface2);color:var(--text3);border:1px solid var(--border);white-space:nowrap; }
.tag-more { background:transparent;color:var(--text4);border-color:transparent;font-size:11px; }
.modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:100; }
.modal-box { background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:28px 32px;text-align:center;min-width:320px;box-shadow:0 20px 60px rgba(0,0,0,.2); }
</style>