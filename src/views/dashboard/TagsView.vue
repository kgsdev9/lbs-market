<template>
  <div>
    <!-- ── Header ── -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:16px">
      <div>
        <div style="font-family:var(--font-alt);font-size:20px;font-weight:700;color:var(--text)">Tags</div>
        <div style="font-size:13px;color:var(--text3);margin-top:3px">
          {{ tags.length }} tag{{ tags.length !== 1 ? 's' : '' }}
        </div>
      </div>
      <button class="btn btn-primary" @click="openModal()">
        <span v-html="ICONS.plus"/> Nouveau tag
      </button>
    </div>

    <!-- ── Filtres ── -->
    <div class="card" style="overflow:hidden">
      <div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;gap:8px;flex-wrap:wrap;background:var(--surface2);align-items:center">
        <input
          v-model="search"
          class="form-input"
          style="max-width:220px;padding:7px 12px"
          placeholder="Rechercher un tag…"
        />
        <select v-model="filterType" class="form-input" style="max-width:180px;padding:7px 12px">
          <option value="">Tous les types</option>
          <option v-for="e in enums" :key="e.value" :value="e.value">{{ e.label }}</option>
        </select>
        <span style="font-size:12px;color:var(--text4);margin-left:auto">
          {{ filteredTags.length }} résultat{{ filteredTags.length !== 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Loading skeleton -->
      <table v-if="loading" style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:1px solid var(--border)">
            <th class="th">Tag</th>
            <th class="th">Slug</th>
            <th class="th">Type</th>
            <th class="th">Créé le</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in 6" :key="n" style="border-bottom:1px solid var(--border2)">
            <td style="padding:11px 16px"><div class="skel" style="width:120px;height:24px;border-radius:20px"/></td>
            <td style="padding:11px 16px"><div class="skel" style="width:100px;height:13px;border-radius:4px"/></td>
            <td style="padding:11px 16px"><div class="skel" style="width:80px;height:22px;border-radius:6px"/></td>
            <td style="padding:11px 16px"><div class="skel" style="width:80px;height:13px;border-radius:4px"/></td>
            <td style="padding:11px 16px"><div style="display:flex;gap:4px"><div class="skel" style="width:28px;height:28px;border-radius:6px"/><div class="skel" style="width:28px;height:28px;border-radius:6px"/></div></td>
          </tr>
        </tbody>
      </table>

      <!-- Error -->
      <div v-else-if="error" style="text-align:center;padding:40px">
        <div style="font-size:28px;margin-bottom:8px">⚠️</div>
        <div style="font-size:14px;color:var(--text3);margin-bottom:16px">{{ error }}</div>
        <button class="btn btn-secondary btn-sm" @click="fetchTags">Réessayer</button>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredTags.length === 0" style="text-align:center;padding:48px">
        <div style="font-size:32px;margin-bottom:10px">🏷️</div>
        <div style="font-size:15px;font-weight:600;color:var(--text);margin-bottom:6px">
          {{ search || filterType ? 'Aucun résultat' : 'Aucun tag' }}
        </div>
        <div style="font-size:13px;color:var(--text3);margin-bottom:20px">
          {{ search || filterType ? 'Essaie un autre filtre.' : 'Commence par créer ton premier tag.' }}
        </div>
        <button v-if="!search && !filterType" class="btn btn-primary btn-sm" @click="openModal()">+ Nouveau tag</button>
      </div>

      <!-- Table -->
      <table v-else style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:1px solid var(--border);background:var(--surface2)">
            <th class="th">Tag</th>
            <th class="th">Slug</th>
            <th class="th">Type</th>
            <th class="th">Créé le</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tag in filteredTags" :key="tag.id"
            style="border-bottom:1px solid var(--border2);transition:background .08s"
            @mouseover="e => e.currentTarget.style.background = 'var(--surface2)'"
            @mouseleave="e => e.currentTarget.style.background = ''"
          >
            <!-- Tag name -->
            <td style="padding:11px 16px">
              <span class="tag-pill">{{ tag.name }}</span>
            </td>

            <!-- Slug -->
            <td style="padding:11px 16px;font-size:12px;color:var(--text4);font-family:var(--font-mono)">
              {{ tag.slug }}
            </td>

            <!-- Type -->
            <td style="padding:11px 16px">
              <span class="type-badge" :class="'type-' + tag.typetag">
                {{ enumLabel(tag.typetag) }}
              </span>
            </td>

            <!-- Date -->
            <td style="padding:11px 16px;font-size:13px;color:var(--text3)">
              {{ formatDate(tag.created_at) }}
            </td>

            <!-- Actions -->
            <td style="padding:11px 16px">
              <div style="display:flex;gap:4px">
                <button class="btn btn-icon btn-ghost btn-sm" v-html="ICONS.edit" @click="openModal(tag)"/>
                <button class="btn btn-icon btn-ghost btn-sm" v-html="ICONS.trash" style="color:var(--text4)" @click="confirmDelete(tag)"/>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ══════════════════════════════
         MODAL Créer / Modifier
    ══════════════════════════════ -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
          <div style="font-size:15px;font-weight:700;color:var(--text)">
            {{ isEdit ? 'Modifier le tag' : 'Nouveau tag' }}
          </div>
          <button class="btn btn-icon btn-ghost btn-sm" @click="closeModal">✕</button>
        </div>

        <!-- Nom -->
        <div class="form-group">
          <label class="form-label">Nom <span class="req">*</span></label>
          <input
            v-model="form.name"
            class="form-input"
            placeholder="Ex: Laravel, React, Design…"
            @input="autoSlug"
          />
        </div>

        <!-- Slug -->
        <div class="form-group">
          <label class="form-label">
            Slug
            <span style="font-size:10px;color:var(--text5);font-weight:400;margin-left:4px">auto-généré</span>
          </label>
          <input v-model="form.slug" class="form-input" placeholder="ex: mon-tag"/>
        </div>

        <!-- Type (select avec les enums) -->
        <div class="form-group">
          <label class="form-label">Type <span class="req">*</span></label>
          <select v-model="form.typetag" class="form-input">
            <option value="" disabled>-- Choisir un type --</option>
            <option v-for="e in enums" :key="e.value" :value="e.value">
              {{ e.label }}
            </option>
          </select>
        </div>

        <!-- Erreur -->
        <div v-if="formError" style="font-size:12.5px;color:#ef4444;margin-bottom:12px;padding:8px 12px;background:#fef2f2;border-radius:6px;border:1px solid #fecaca">
          {{ formError }}
        </div>

        <!-- Aperçu -->
        <div v-if="form.name" style="margin-bottom:16px;padding:10px 14px;background:var(--surface2);border-radius:8px;border:1px solid var(--border)">
          <div style="font-size:11px;color:var(--text4);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Aperçu</div>
          <span class="tag-pill">{{ form.name }}</span>
          <span v-if="form.typetag" class="type-badge" :class="'type-' + form.typetag" style="margin-left:6px">
            {{ enumLabel(form.typetag) }}
          </span>
        </div>

        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:20px">
          <button class="btn btn-ghost btn-sm" @click="closeModal">Annuler</button>
          <button class="btn btn-primary btn-sm" :disabled="saving" @click="saveTag">
            {{ saving ? 'Enregistrement…' : (isEdit ? '💾 Mettre à jour' : '+ Créer') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal suppression -->
    <div v-if="toDelete" class="modal-overlay" @click.self="toDelete = null">
      <div class="modal-box" style="max-width:360px">
        <div style="font-size:24px;margin-bottom:10px;text-align:center">🗑️</div>
        <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px;text-align:center">Supprimer le tag ?</div>
        <div style="font-size:13px;color:var(--text3);margin-bottom:20px;text-align:center">
          <span class="tag-pill">{{ toDelete.name }}</span> sera supprimé définitivement.
        </div>
        <div style="display:flex;gap:8px;justify-content:center">
          <button class="btn btn-ghost btn-sm" @click="toDelete = null">Annuler</button>
          <button class="btn btn-danger btn-sm" :disabled="deleting" @click="deleteTag">
            {{ deleting ? 'Suppression…' : 'Supprimer' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import API from '@/services/api'
import { ICONS } from '@/composables/icons'

// ── État ──────────────────────────────────────────────────────────
const tags      = ref([])
const enums     = ref([])   // [{ value: 'dev', label: 'Développement' }, ...]
const loading   = ref(true)
const error     = ref(null)
const search    = ref('')
const filterType = ref('')
const showModal = ref(false)
const saving    = ref(false)
const formError = ref(null)
const toDelete  = ref(null)
const deleting  = ref(false)
const editId    = ref(null)

const form = ref(emptyForm())

function emptyForm() {
  return { name: '', slug: '', typetag: '' }
}

// ── Computed ──────────────────────────────────────────────────────
const isEdit = computed(() => !!editId.value)

const filteredTags = computed(() => {
  let list = tags.value
  if (filterType.value) list = list.filter(t => t.typetag === filterType.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(t => t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q))
  }
  return list
})

// ── Fetch ─────────────────────────────────────────────────────────
async function fetchTags() {
  loading.value = true
  error.value   = null
  try {
    const { data } = await API.get('/admin/tags')
    tags.value = Array.isArray(data) ? data : (data.data ?? [])
  } catch (e) {
    error.value = 'Impossible de charger les tags.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function fetchEnums() {
  try {
    const { data } = await API.get('/admin/tags/enums')
    enums.value = data
  } catch (e) {
    console.error('fetchEnums:', e)
  }
}

onMounted(() => Promise.all([fetchTags(), fetchEnums()]))

// ── Modal ─────────────────────────────────────────────────────────
function openModal(tag = null) {
  formError.value = null
  if (tag) {
    editId.value = tag.id
    form.value   = { name: tag.name, slug: tag.slug, typetag: tag.typetag }
  } else {
    editId.value = null
    form.value   = emptyForm()
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editId.value    = null
  form.value      = emptyForm()
  formError.value = null
}

// Auto-génère le slug depuis le nom
function autoSlug() {
  form.value.slug = form.value.name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Save ──────────────────────────────────────────────────────────
async function saveTag() {
  formError.value = null

  if (!form.value.name.trim()) { formError.value = 'Le nom est obligatoire.'; return }
  if (!form.value.typetag)     { formError.value = 'Le type est obligatoire.'; return }

  saving.value = true
  try {
    const payload = {
      name:    form.value.name.trim(),
      slug:    form.value.slug.trim() || undefined,
      typetag: form.value.typetag,
    }

    if (isEdit.value) {
      const { data } = await API.put(`/admin/tags/${editId.value}`, payload)
      const idx = tags.value.findIndex(t => t.id === editId.value)
      if (idx !== -1) tags.value[idx] = data
    } else {
      const { data } = await API.post('/admin/tags', payload)
      tags.value.unshift(data)
    }
    closeModal()
  } catch (e) {
    console.error(e)
    if (e.response?.status === 422) {
      formError.value = Object.values(e.response.data.errors).flat().join(' — ')
    } else {
      formError.value = 'Une erreur est survenue.'
    }
  } finally {
    saving.value = false
  }
}

// ── Delete ────────────────────────────────────────────────────────
function confirmDelete(tag) { toDelete.value = tag }

async function deleteTag() {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await API.delete(`/admin/tags/${toDelete.value.id}`)
    tags.value   = tags.value.filter(t => t.id !== toDelete.value.id)
    toDelete.value = null
  } catch (e) {
    console.error(e)
    alert('Erreur lors de la suppression.')
  } finally {
    deleting.value = false
  }
}

// ── Helpers ───────────────────────────────────────────────────────
function enumLabel(value) {
  return enums.value.find(e => e.value === value)?.label ?? value
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.th {
  padding: 9px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: .5px;
}

/* Skeleton */
.skel { background: var(--surface2); animation: pulse .9s ease-in-out infinite alternate; }
@keyframes pulse { from { opacity: .5 } to { opacity: 1 } }

/* Tag pill */
.tag-pill {
  display: inline-flex; align-items: center;
  padding: 3px 10px; border-radius: 20px;
  font-size: 12px; font-weight: 600;
  font-family: var(--font-mono);
  background: var(--surface2);
  color: var(--text2);
  border: 1px solid var(--border);
  white-space: nowrap;
}

/* Type badge */
.type-badge {
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: 6px;
  font-size: 11px; font-weight: 600;
  white-space: nowrap;
  background: var(--surface2);
  color: var(--text3);
  border: 1px solid var(--border);
}
/* Couleurs par type */
.type-dev        { background: #dbeafe; color: #1d4ed8; border-color: #bfdbfe; }
.type-projet     { background: #fef9c3; color: #a16207; border-color: #fde68a; }
.type-formation  { background: #dcfce7; color: #166534; border-color: #bbf7d0; }
.type-topic      { background: #f3e8ff; color: #7c3aed; border-color: #e9d5ff; }
.type-astuces    { background: #ffedd5; color: #c2410c; border-color: #fed7aa; }
.type-article    { background: #e0f2fe; color: #0369a1; border-color: #bae6fd; }
.type-specialite { background: #fce7f3; color: #be185d; border-color: #fbcfe8; }
.type-product    { background: #d1fae5; color: #065f46; border-color: #a7f3d0; }
.type-ressource  { background: #ede9fe; color: #5b21b6; border-color: #ddd6fe; }
.type-service    { background: #fee2e2; color: #b91c1c; border-color: #fecaca; }
.type-reseau     { background: #cffafe; color: #0e7490; border-color: #a5f3fc; }
.type-boutique   { background: #fdf4ff; color: #86198f; border-color: #f0abfc; }
.type-all,
.type-autre      { background: var(--surface2); color: var(--text3); border-color: var(--border); }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
}
.modal-box {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 24px 28px;
  width: 100%; max-width: 460px;
  box-shadow: 0 20px 60px rgba(0,0,0,.2);
  max-height: 90vh; overflow-y: auto;
}

/* Form */
.form-group { margin-bottom: 14px; }
.form-label { display: block; font-size: 12px; font-weight: 600; color: var(--text3); margin-bottom: 6px; }
.req { color: #ef4444; }
</style>