<template>
  <div>
    <!-- Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:16px">
      <div>
        <div style="font-family:var(--font-alt);font-size:20px;font-weight:700;color:var(--text)">Pays</div>
        <div style="font-size:13px;color:var(--text3);margin-top:3px">
          {{ countries.length }} pays configuré{{ countries.length !== 1 ? 's' : '' }}
        </div>
      </div>
      <button class="btn btn-primary" @click="openModal()">+ Nouveau pays</button>
    </div>

    <!-- Table card -->
    <div class="card" style="overflow:hidden">

      <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:var(--surface2)">
        <input
          v-model="search"
          class="form-input"
          style="max-width:280px;padding:7px 12px"
          placeholder="Rechercher un pays..."
        />
      </div>

      <!-- Skeleton -->
      <table v-if="loading" style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:1px solid var(--border)">
            <th class="th">Pays</th>
            <th class="th">Code</th>
            <th class="th">Drapeau</th>
            <th class="th">Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in 4" :key="n" style="border-bottom:1px solid var(--border2)">
            <td style="padding:11px 16px">
              <div style="display:flex;align-items:center;gap:9px">
                <div class="skel" style="width:28px;height:28px;border-radius:6px"/>
                <div class="skel" style="width:130px;height:13px;border-radius:4px"/>
              </div>
            </td>
            <td style="padding:11px 16px"><div class="skel" style="width:36px;height:22px;border-radius:6px"/></td>
            <td style="padding:11px 16px"><div class="skel" style="width:60px;height:22px;border-radius:6px"/></td>
            <td style="padding:11px 16px"><div class="skel" style="width:50px;height:22px;border-radius:20px"/></td>
            <td style="padding:11px 16px"><div class="skel" style="width:28px;height:28px;border-radius:6px"/></td>
          </tr>
        </tbody>
      </table>

      <!-- Error -->
      <div v-else-if="error" style="text-align:center;padding:40px">
        <div style="font-size:28px;margin-bottom:8px">⚠️</div>
        <div style="font-size:14px;color:var(--text3);margin-bottom:16px">{{ error }}</div>
        <button class="btn btn-secondary btn-sm" @click="fetchCountries">Réessayer</button>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredCountries.length === 0" style="text-align:center;padding:48px">
        <div style="font-size:32px;margin-bottom:10px">🌍</div>
        <div style="font-size:15px;font-weight:600;color:var(--text);margin-bottom:6px">Aucun pays trouvé</div>
        <div style="font-size:13px;color:var(--text3)">
          {{ search ? 'Essaie un autre terme.' : 'Commence par ajouter un pays.' }}
        </div>
      </div>

      <!-- Table -->
      <table v-else style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:1px solid var(--border)">
            <th class="th">Pays</th>
            <th class="th">Code</th>
            <th class="th">Drapeau</th>
            <th class="th">Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="c in filteredCountries" :key="c.id"
            style="border-bottom:1px solid var(--border2);transition:background .08s"
            @mouseover="e => e.currentTarget.style.background = 'var(--surface2)'"
            @mouseleave="e => e.currentTarget.style.background = ''"
          >
            <!-- Pays -->
            <td style="padding:11px 16px">
              <div style="display:flex;align-items:center;gap:10px">
                <span style="font-size:22px;line-height:1">{{ c.flag_emoji || '🌍' }}</span>
                <div style="font-size:13px;font-weight:600;color:var(--text)">{{ c.name }}</div>
              </div>
            </td>

            <!-- Code -->
            <td style="padding:11px 16px">
              <span class="code-badge">{{ c.code }}</span>
            </td>

            <!-- Drapeau image S3 -->
            <td style="padding:11px 16px">
              <img
                v-if="c.flag_url"
                :src="c.flag_url"
                :alt="c.name"
                style="height:22px;border-radius:3px;border:1px solid var(--border);object-fit:cover"
              />
              <span v-else style="font-size:12px;color:var(--text5)">—</span>
            </td>

            <!-- Statut cliquable -->
            <td style="padding:11px 16px">
              <button
                class="badge"
                :class="c.is_active ? 'badge-green' : 'badge-gray'"
                style="cursor:pointer;border:none;font-size:11px"
                @click="toggleActive(c)"
              >
                {{ c.is_active ? 'Actif' : 'Inactif' }}
              </button>
            </td>

            <!-- Actions -->
            <td style="padding:11px 16px">
              <div style="display:flex;gap:4px">
                <button class="btn btn-icon btn-ghost btn-sm" v-html="ICONS.edit" @click="openModal(c)"/>
                <button class="btn btn-icon btn-ghost btn-sm" v-html="ICONS.trash" style="color:var(--text4)" @click="confirmDelete(c)"/>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ══ MODAL Créer / Modifier ══ -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
          <div style="font-size:15px;font-weight:700;color:var(--text)">
            {{ isEdit ? 'Modifier le pays' : 'Nouveau pays' }}
          </div>
          <button class="btn btn-icon btn-ghost btn-sm" @click="closeModal">✕</button>
        </div>

        <!-- Code + Emoji -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label class="form-label">Code ISO <span class="req">*</span></label>
            <input
              v-model="form.code"
              class="form-input"
              placeholder="CI"
              maxlength="2"
              @input="form.code = form.code.toUpperCase()"
            />
            <div style="font-size:11px;color:var(--text5);margin-top:4px">2 lettres — ex : CI, SN, FR</div>
          </div>

          <div class="form-group">
            <label class="form-label">Emoji drapeau</label>
            <div style="display:flex;gap:8px;align-items:center">
              <input v-model="form.flag_emoji" class="form-input" placeholder="🇨🇮" style="font-size:20px"/>
              <span style="font-size:28px;line-height:1">{{ form.flag_emoji || '🌍' }}</span>
            </div>
          </div>
        </div>

        <!-- Nom -->
        <div class="form-group">
          <label class="form-label">Nom du pays <span class="req">*</span></label>
          <input v-model="form.name" class="form-input" placeholder="Côte d'Ivoire"/>
        </div>

        <!-- Image drapeau S3 -->
        <div class="form-group">
          <label class="form-label">
            Image drapeau
            <span style="font-size:10px;color:var(--text5);font-weight:400;margin-left:4px">(stockée sur S3)</span>
          </label>
          <input
            ref="flagFileRef"
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            style="display:none"
            @change="onFlagFileChange"
          />
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <button type="button" class="btn btn-secondary btn-sm" @click="flagFileRef.click()">
              📁 Choisir un fichier
            </button>
            <span style="font-size:12px;color:var(--text4)">
              {{ flagFile ? flagFile.name : (form.flag_url ? 'Image existante' : 'Aucun fichier') }}
            </span>
            <img
              v-if="flagPreview || form.flag_url"
              :src="flagPreview || form.flag_url"
              style="height:24px;border-radius:3px;border:1px solid var(--border)"
            />
          </div>
        </div>

        <!-- Actif -->
        <div class="form-group">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;font-weight:500;color:var(--text2)">
            <input type="checkbox" v-model="form.is_active" style="cursor:pointer"/>
            Pays actif (visible sur la plateforme)
          </label>
        </div>

        <div v-if="formError" style="font-size:12.5px;color:#ef4444;margin-bottom:12px;padding:8px 12px;background:#fef2f2;border-radius:6px;border:1px solid #fecaca">
          {{ formError }}
        </div>

        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:20px">
          <button class="btn btn-ghost btn-sm" @click="closeModal">Annuler</button>
          <button class="btn btn-primary btn-sm" :disabled="saving" @click="saveCountry">
            {{ saving ? 'Enregistrement...' : (isEdit ? '💾 Mettre à jour' : '+ Créer') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══ MODAL Suppression ══ -->
    <div v-if="toDelete" class="modal-overlay" @click.self="toDelete = null">
      <div class="modal-box" style="max-width:360px">
        <div style="font-size:24px;margin-bottom:10px;text-align:center">🗑️</div>
        <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px;text-align:center">Supprimer ce pays ?</div>
        <div style="font-size:13px;color:var(--text3);margin-bottom:20px;text-align:center">
          « {{ toDelete.flag_emoji }} {{ toDelete.name }} » sera supprimé définitivement.
        </div>
        <div style="display:flex;gap:8px;justify-content:center">
          <button class="btn btn-ghost btn-sm" @click="toDelete = null">Annuler</button>
          <button class="btn btn-danger btn-sm" :disabled="deleting" @click="deleteCountry">
            {{ deleting ? 'Suppression...' : 'Supprimer' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { ICONS } from '@/composables/icons'

// ── État ──
const countries  = ref([])
const loading    = ref(true)
const error      = ref(null)
const search     = ref('')
const showModal  = ref(false)
const saving     = ref(false)
const formError  = ref(null)
const toDelete   = ref(null)
const deleting   = ref(false)
const editId     = ref(null)

// ── Fichier image ──
const flagFileRef = ref(null)
const flagFile    = ref(null)
const flagPreview = ref(null)

function onFlagFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  flagFile.value    = file
  flagPreview.value = URL.createObjectURL(file)
}

// ── Form ──
const form = ref(emptyForm())

function emptyForm() {
  return { code: '', name: '', flag_emoji: '', flag_url: '', is_active: true }
}

// ── Computed ──
const isEdit = computed(() => !!editId.value)

const filteredCountries = computed(() => {
  if (!search.value.trim()) return countries.value
  const q = search.value.toLowerCase()
  return countries.value.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.code.toLowerCase().includes(q)
  )
})

// ── Fetch ──
async function fetchCountries() {
  loading.value = true
  error.value   = null
  try {
    const { data } = await api.get('/admin/countries')
    countries.value = Array.isArray(data) ? data : (data.data ?? [])
  } catch {
    error.value = 'Impossible de charger les pays.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchCountries)

// ── Modal ──
function openModal(country = null) {
  formError.value   = null
  flagFile.value    = null
  flagPreview.value = null
  if (country) {
    editId.value = country.id
    form.value = {
      code:       country.code       || '',
      name:       country.name       || '',
      flag_emoji: country.flag_emoji || '',
      flag_url:   country.flag_url   || '',
      is_active:  !!country.is_active,
    }
  } else {
    editId.value = null
    form.value   = emptyForm()
  }
  showModal.value = true
}

function closeModal() {
  showModal.value   = false
  editId.value      = null
  form.value        = emptyForm()
  formError.value   = null
  flagFile.value    = null
  flagPreview.value = null
}

// ── Save via FormData (S3) ──
async function saveCountry() {
  formError.value = null
  if (!form.value.code.trim() || form.value.code.length !== 2) {
    formError.value = 'Le code ISO doit faire exactement 2 lettres (ex: CI).'; return
  }
  if (!form.value.name.trim()) {
    formError.value = 'Le nom du pays est obligatoire.'; return
  }

  saving.value = true
  try {
    const fd = new FormData()
    fd.append('code',       form.value.code)
    fd.append('name',       form.value.name)
    fd.append('flag_emoji', form.value.flag_emoji || '')
    fd.append('is_active',  form.value.is_active ? 1 : 0)
    if (flagFile.value) fd.append('flag_image', flagFile.value)

    const url    = isEdit.value ? `/admin/countries/${editId.value}` : '/admin/countries'
    const { data } = await api.post(url, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (isEdit.value) {
      const idx = countries.value.findIndex(c => c.id === editId.value)
      if (idx !== -1) countries.value[idx] = data
    } else {
      countries.value.unshift(data)
    }

    closeModal()
  } catch (e) {
    if (e.response?.status === 422) {
      formError.value = Object.values(e.response.data.errors).flat().join(' — ')
    } else {
      formError.value = 'Une erreur est survenue.'
    }
  } finally {
    saving.value = false
  }
}

// ── Toggle actif ──
async function toggleActive(country) {
  try {
    const { data } = await api.patch(`/admin/countries/${country.id}`, {
      is_active: country.is_active ? 0 : 1,
    })
    const idx = countries.value.findIndex(c => c.id === country.id)
    if (idx !== -1) countries.value[idx] = data
  } catch (e) { console.error(e) }
}

// ── Suppression ──
function confirmDelete(country) { toDelete.value = country }

async function deleteCountry() {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await api.delete(`/admin/countries/${toDelete.value.id}`)
    countries.value = countries.value.filter(c => c.id !== toDelete.value.id)
    toDelete.value  = null
  } catch { alert('Erreur lors de la suppression.') }
  finally { deleting.value = false }
}
</script>

<style scoped>
.th { padding:9px 16px;text-align:left;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px }
.code-badge { display:inline-block;padding:2px 8px;border-radius:6px;font-family:var(--font-mono);font-size:12px;font-weight:700;background:var(--surface2);color:var(--text);border:1px solid var(--border);letter-spacing:.5px }
.badge-gray { background:var(--surface2);color:var(--text4) }
.skel { background:var(--surface2);animation:pulse .9s ease-in-out infinite alternate }
@keyframes pulse { from{opacity:.5} to{opacity:1} }
.modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:100 }
.modal-box { background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:24px 28px;width:100%;max-width:480px;box-shadow:0 20px 60px rgba(0,0,0,.2);max-height:90vh;overflow-y:auto }
.form-group { margin-bottom:14px }
.form-label { display:block;font-size:12px;font-weight:600;color:var(--text3);margin-bottom:6px }
.req { color:#ef4444 }
</style>