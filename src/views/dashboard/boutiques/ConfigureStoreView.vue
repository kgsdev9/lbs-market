<template>
  <div class="boutique-editor">

    <!-- ══ BANNER INFO ══ -->
    <div class="info-banner">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      Vous pouvez configurer votre boutique quand vous voulez — les modifications sont sauvegardées immédiatement.
    </div>

    <!-- ══ TOP BAR ══ -->
    <div class="topbar">
      <div class="topbar-left">
        <div class="topbar-title">{{ boutique ? 'Ma boutique' : 'Créer ma boutique' }}</div>
        <div class="topbar-sub" v-if="boutique?.name">
          {{ boutique.name }}
          <span class="status-chip" :class="boutique.status">{{ statusLabel(boutique.status) }}</span>
        </div>
      </div>
      <div class="topbar-actions">
        <button class="btn-ghost-action" @click="showPreview = !showPreview">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          {{ showPreview ? 'Masquer l\'aperçu' : 'Voir l\'aperçu' }}
        </button>
        <button class="btn-publish" @click="doSave" :disabled="saving || !form.name?.trim()">
          <span v-if="saving" class="spinner"/>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          {{ boutique ? 'Sauvegarder' : 'Créer la boutique' }}
        </button>
      </div>
    </div>

    <!-- ══ LOADING ══ -->
    <div v-if="loading" class="loading-wrap">
      <div v-for="n in 3" :key="n" class="skel-block"/>
    </div>

    <div v-else class="editor-body">

      <!-- ══ PRÉVISUALISATION ══ -->
      <Transition name="slide-down">
        <div v-if="showPreview" class="preview-section">
          <div class="preview-label">
            <span class="preview-dot"/>
            Aperçu de ta boutique — tel que les visiteurs la verront
          </div>

          <!-- Carte boutique publique -->
          <div class="boutique-preview-card">

            <!-- Bannière -->
            <div class="bpc-banner" :style="bannerPreview || form.banner ? {} : { background: form.cover_color }">
              <img v-if="bannerPreview || form.banner" :src="bannerPreview || form.banner" class="bpc-banner-img"/>
              <div v-else class="bpc-banner-gradient" :style="{ background: `linear-gradient(135deg, ${form.cover_color} 0%, var(--surface) 120%)` }"/>
            </div>

            <!-- Infos boutique -->
            <div class="bpc-body">
              <div class="bpc-logo-row">
                <div class="bpc-logo" :style="{ background: form.cover_color }">
                  <img v-if="logoPreview || form.logo" :src="logoPreview || form.logo" class="bpc-logo-img"/>
                  <span v-else class="bpc-logo-letter">{{ form.name ? form.name[0].toUpperCase() : '?' }}</span>
                </div>
                <div class="bpc-name-wrap">
                  <div class="bpc-name">{{ form.name || 'Nom de la boutique' }}</div>
                  <div class="bpc-url">ahodik.com/boutique/{{ form.slug || '...' }}</div>
                </div>
                <div v-if="boutique?.is_verified" class="bpc-verified">✓ Vérifié</div>
              </div>

              <p class="bpc-desc">{{ form.description || 'Aucune description renseignée.' }}</p>

              <!-- Tag -->
              <div v-if="currentTag" class="bpc-tag">{{ currentTag.name }}</div>

              <!-- Liens sociaux actifs -->
              <div class="bpc-socials">
                <template v-for="s in socialPlatforms" :key="s.key">
                  <a v-if="form.social_links[s.key]" href="#" class="bpc-social-link" @click.prevent>
                    {{ s.icon }}
                  </a>
                </template>
                <a v-if="form.website" href="#" class="bpc-social-link" @click.prevent>🌐</a>
              </div>

              <!-- Stats fictives -->
              <div class="bpc-stats">
                <span>📦 0 produits</span>
                <span class="bpc-sep">·</span>
                <span>⭐ — avis</span>
                <span class="bpc-sep">·</span>
                <span>🛒 0 ventes</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ══ FORM ══ -->
      <div class="dual-col">

        <!-- ─── Colonne principale ─── -->
        <div class="col-main">

          <!-- Infos de base -->
          <div class="section-box">
            <div class="section-ttl">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Informations générales
            </div>

            <div class="fld">
              <label class="fld-lbl">Nom de la boutique <span class="req">*</span></label>
              <input v-model="form.name" class="fld-inp fld-inp--lg" placeholder="Ex: KGS Digital Store" @input="onNameInput"/>
              <span class="fld-hint">Ce nom apparaîtra sur ta page boutique publique</span>
            </div>

            <div class="fld">
              <label class="fld-lbl">
                Slug (URL)
                <span class="fld-hint-inline">— généré automatiquement depuis le nom</span>
              </label>
              <div class="slug-wrap">
                <span class="slug-prefix">ahodik.com/boutique/</span>
                <input v-model="form.slug" class="fld-inp slug-inp" placeholder="mon-shop" @input="slugManualEdit = true"/>
              </div>
            </div>

            <div class="fld">
              <label class="fld-lbl">Description</label>
              <textarea v-model="form.description" class="fld-inp fld-textarea" rows="3" placeholder="Décris ta boutique en quelques mots…"/>
              <div class="fld-hint-row">
                <span>Visible sur ta page boutique</span>
                <span :class="{ 'c-red': (form.description?.length || 0) > 480 }">{{ form.description?.length || 0 }}/500</span>
              </div>
            </div>

            <div class="dual-fld">
              <div class="fld">
                <label class="fld-lbl">Email de contact</label>
                <input v-model="form.email" class="fld-inp" type="email" placeholder="contact@maboutique.com"/>
              </div>
              <div class="fld">
                <label class="fld-lbl">Téléphone</label>
                <input v-model="form.phone" class="fld-inp" placeholder="+225 07 00 00 00"/>
              </div>
            </div>

            <div class="fld">
              <label class="fld-lbl">Site web</label>
              <input v-model="form.website" class="fld-inp" placeholder="https://monsite.com"/>
            </div>
          </div>

          <!-- Liens sociaux -->
          <div class="section-box">
            <div class="section-ttl">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Liens sociaux
            </div>
            <div class="social-grid">
              <div v-for="s in socialPlatforms" :key="s.key" class="fld">
                <label class="fld-lbl"><span class="social-ico">{{ s.icon }}</span> {{ s.label }}</label>
                <input v-model="form.social_links[s.key]" class="fld-inp" :placeholder="s.placeholder"/>
              </div>
            </div>
          </div>

        </div>

        <!-- ─── Colonne latérale ─── -->
        <div class="col-side">

          <!-- Logo -->
          <div class="side-box">
            <div class="side-box-ttl">Logo de la boutique</div>
            <div class="logo-upload-zone" @click="logoRef.click()">
              <img v-if="logoPreview || form.logo" :src="logoPreview || form.logo" class="logo-preview"/>
              <div v-else class="logo-placeholder">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>Clique pour uploader</span>
                <span style="font-size:10.5px;color:var(--text5)">PNG, JPG, SVG — max 2 Mo</span>
              </div>
            </div>
            <input ref="logoRef" type="file" accept="image/*" style="display:none" @change="onLogoChange"/>
            <button v-if="logoPreview || form.logo" class="rm-btn" @click="logoPreview = null; form.logo = null; logoFile = null">✕ Supprimer</button>
          </div>

          <!-- Bannière -->
          <div class="side-box">
            <div class="side-box-ttl">Image de bannière</div>
            <div class="banner-upload-zone" @click="bannerRef.click()">
              <img v-if="bannerPreview || form.banner" :src="bannerPreview || form.banner" class="banner-preview"/>
              <div v-else class="banner-placeholder">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>Bannière 1200×300px</span>
              </div>
            </div>
            <input ref="bannerRef" type="file" accept="image/*" style="display:none" @change="onBannerChange"/>
            <button v-if="bannerPreview || form.banner" class="rm-btn" @click="bannerPreview = null; form.banner = null; bannerFile = null">✕ Supprimer</button>
          </div>

          <!-- Couleur de fond -->
          <div class="side-box">
            <div class="side-box-ttl">Couleur de fond</div>
            <div class="clr-preview" :style="{ background: form.cover_color }">
              <span style="font-size:28px">{{ form.name ? form.name[0].toUpperCase() : '🏪' }}</span>
            </div>
            <div class="clr-row">
              <div v-for="c in coverColors" :key="c" class="clr-dot" :style="{ background: c }" :class="{ 'clr-dot--on': form.cover_color === c }" @click="form.cover_color = c"/>
            </div>
          </div>

          <!-- Catégorie -->
          <div class="side-box">
            <div class="side-box-ttl">Catégorie</div>
            <div v-if="tagsLoading" class="tag-skel-row">
              <span v-for="n in 5" :key="n" class="tag-skel"/>
            </div>
            <div v-else class="tag-cloud">
              <span
                v-for="tag in allTags" :key="tag.id"
                class="cloud-tag"
                :class="{ 'cloud-tag--on': form.tag_id === tag.id }"
                @click="form.tag_id = form.tag_id === tag.id ? null : tag.id"
              >
                {{ form.tag_id === tag.id ? '✓' : '+' }} {{ tag.name }}
              </span>
              <span v-if="allTags.length === 0" style="font-size:12px;color:var(--text5)">Aucun tag disponible</span>
            </div>
          </div>

        </div>
      </div>

      <!-- ── Bouton bas ── -->
      <div class="step-foot">
        <div/>
        <button class="btn-publish btn-publish--lg" @click="doSave" :disabled="saving || !form.name?.trim()">
          <span v-if="saving" class="spinner"/>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {{ boutique ? 'Sauvegarder les modifications' : 'Créer ma boutique' }}
        </button>
      </div>
    </div>

    <!-- ══ TOAST ══ -->
    <Transition name="tst">
      <div v-if="toast.show" class="toast" :class="{ 'toast--err': toast.error }">{{ toast.message }}</div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/services/api'

// ── État ──
const boutique      = ref(null)
const loading       = ref(true)
const saving        = ref(false)
const showPreview   = ref(false)
const allTags       = ref([])
const tagsLoading   = ref(false)
const toast         = ref({ show: false, message: '', error: false })
const slugManualEdit = ref(false)

// ── Fichiers ──
const logoRef       = ref(null)
const bannerRef     = ref(null)
const logoFile      = ref(null)
const bannerFile    = ref(null)
const logoPreview   = ref(null)
const bannerPreview = ref(null)

// ── Formulaire ──
const form = reactive({
  name:         '',
  slug:         '',
  description:  '',
  email:        '',
  phone:        '',
  website:      '',
  cover_color:  '#dbeafe',
  tag_id:       null,
  logo:         null,
  banner:       null,
  social_links: {
    whatsapp: '', instagram: '', facebook: '',
    twitter: '', linkedin: '', youtube: '', tiktok: '', telegram: '',
  },
})

const coverColors = ['#dbeafe','#dcfce7','#fef9c3','#ede9fe','#ffedd5','#fee2e2','#e0f2fe','#fce7f3','#f0fdf4','#f1f5f9']

const socialPlatforms = [
  { key: 'whatsapp',  icon: '💬', label: 'WhatsApp',  placeholder: '+225 07 00 00 00'            },
  { key: 'instagram', icon: '📸', label: 'Instagram', placeholder: 'https://instagram.com/...'   },
  { key: 'facebook',  icon: '📘', label: 'Facebook',  placeholder: 'https://facebook.com/...'    },
  { key: 'twitter',   icon: '🐦', label: 'Twitter',   placeholder: 'https://twitter.com/...'     },
  { key: 'linkedin',  icon: '💼', label: 'LinkedIn',  placeholder: 'https://linkedin.com/in/...' },
  { key: 'youtube',   icon: '▶️', label: 'YouTube',   placeholder: 'https://youtube.com/@...'    },
  { key: 'tiktok',    icon: '🎵', label: 'TikTok',    placeholder: 'https://tiktok.com/@...'     },
  { key: 'telegram',  icon: '✈️', label: 'Telegram',  placeholder: 'https://t.me/...'            },
]

// ── Computed ──
const currentTag = computed(() => allTags.value.find(t => t.id === form.tag_id) ?? null)

function statusLabel(s) {
  return { pending: '⏳ En attente', active: '✅ Active', suspended: '🚫 Suspendue' }[s] ?? s
}

// ── Slug auto depuis le nom ──
function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // supprimer accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function onNameInput() {
  // Ne pas écraser si l'utilisateur a modifié le slug manuellement
  if (!slugManualEdit.value) {
    form.slug = slugify(form.name)
  }
}

// ── Upload handlers ──
function onLogoChange(e) {
  const f = e.target.files[0]; if (!f) return
  logoFile.value    = f
  logoPreview.value = URL.createObjectURL(f)
}
function onBannerChange(e) {
  const f = e.target.files[0]; if (!f) return
  bannerFile.value    = f
  bannerPreview.value = URL.createObjectURL(f)
}

// ── Remplir le formulaire ──
function fillForm(data) {
  form.name        = data.name        || ''
  form.slug        = data.slug        || ''
  form.description = data.description || ''
  form.email       = data.email       || ''
  form.phone       = data.phone       || ''
  form.website     = data.website     || ''
  form.cover_color = data.cover_color || '#dbeafe'
  form.tag_id      = data.tag_id      ?? null
  form.logo        = data.logo        || null
  form.banner      = data.banner      || null
  const sl = data.social_links || {}
  Object.keys(form.social_links).forEach(k => { form.social_links[k] = sl[k] || '' })
  // Si la boutique a déjà un slug → on considère qu'il a été édité manuellement
  if (data.slug) slugManualEdit.value = true
}

// ── Fetch ──
async function fetchBoutique() {
  loading.value = true
  try {
    const { data } = await api.get('/admin/my/boutique')
    boutique.value = data
    fillForm(data)
  } catch (e) {
    if (e.response?.status !== 404) {
      showToast('Erreur lors du chargement de la boutique', true)
    }
  } finally {
    loading.value = false
  }
}

async function fetchTags() {
  tagsLoading.value = true
  try {
    const { data } = await api.get('/admin/tags')
    allTags.value = Array.isArray(data) ? data : (data.data ?? [])
  } catch {}
  finally { tagsLoading.value = false }
}

onMounted(async () => {
  await Promise.all([fetchBoutique(), fetchTags()])
})

// ── Save ──
async function doSave() {
  if (!form.name.trim()) { showToast('Le nom de la boutique est obligatoire', true); return }

  saving.value = true
  try {
    const fd = new FormData()
    fd.append('name',         form.name)
    fd.append('slug',         form.slug         || '')
    fd.append('description',  form.description  || '')
    fd.append('email',        form.email        || '')
    fd.append('phone',        form.phone        || '')
    fd.append('website',      form.website      || '')
    fd.append('cover_color',  form.cover_color)
    fd.append('tag_id',       form.tag_id       ?? '')
    fd.append('social_links', JSON.stringify(form.social_links))
    if (logoFile.value)   fd.append('logo',   logoFile.value)
    if (bannerFile.value) fd.append('banner', bannerFile.value)
    if (boutique.value)   fd.append('_method', 'POST')

    const { data } = await api.post('/admin/my/boutique', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    boutique.value  = data
    fillForm(data)
    logoFile.value    = null
    bannerFile.value  = null
    showPreview.value = true  // ouvrir l'aperçu après sauvegarde
    showToast(boutique.value ? '✓ Boutique mise à jour !' : '✓ Boutique créée avec succès !')

  } catch (e) {
    if (e.response?.status === 422) {
      showToast(Object.values(e.response.data.errors).flat().join(' · '), true)
    } else {
      showToast('Une erreur est survenue', true)
    }
  } finally {
    saving.value = false
  }
}

function showToast(message, error = false) {
  toast.value = { show: true, message, error }
  setTimeout(() => { toast.value.show = false }, 3500)
}
</script>

<style scoped>
.boutique-editor { padding-bottom: 60px; }

/* ── Banner info ── */
.info-banner { display:flex;align-items:center;gap:10px;padding:12px 18px;border-radius:10px;background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af;font-size:13.5px;font-weight:500;margin-bottom:24px; }
[data-theme="dark"] .info-banner { background:rgba(59,130,246,.1);border-color:rgba(59,130,246,.3);color:#93c5fd; }

/* ── Topbar ── */
.topbar { display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 0 20px;border-bottom:1px solid var(--border);margin-bottom:28px;flex-wrap:wrap; }
.topbar-left  { display:flex;flex-direction:column;gap:4px; }
.topbar-title { font-size:20px;font-weight:800;color:var(--text);font-family:var(--font-alt); }
.topbar-sub   { display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text3); }
.status-chip  { padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600; }
.status-chip.pending   { background:#fef9c3;color:#854d0e; }
.status-chip.active    { background:#dcfce7;color:#15803d; }
.status-chip.suspended { background:#fee2e2;color:#991b1b; }
.topbar-actions { display:flex;gap:8px;align-items:center; }

/* ── Boutons ── */
.btn-ghost-action { display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:1.5px solid var(--border);background:var(--surface);font-size:13px;font-weight:600;color:var(--text3);cursor:pointer;transition:all .15s; }
.btn-ghost-action:hover { border-color:var(--text3);color:var(--text); }
.btn-publish { display:flex;align-items:center;gap:6px;padding:9px 18px;border-radius:9px;background:var(--text);color:var(--surface);font-size:13px;font-weight:700;cursor:pointer;border:none;transition:all .15s; }
.btn-publish--lg { padding:11px 24px;font-size:14px; }
.btn-publish:hover:not(:disabled) { opacity:.85;transform:translateY(-1px); }
.btn-publish:disabled { opacity:.3;cursor:not-allowed; }

/* ── Loading ── */
.loading-wrap { display:flex;flex-direction:column;gap:16px; }
.skel-block { height:120px;border-radius:12px;background:var(--surface2);animation:pulse .9s ease-in-out infinite alternate; }
@keyframes pulse { from{opacity:.5} to{opacity:1} }

/* ══ PRÉVISUALISATION ══ */
.preview-section { margin-bottom:28px;border:1.5px solid var(--border);border-radius:16px;overflow:hidden; }

.preview-label {
  display:flex;align-items:center;gap:8px;padding:10px 18px;
  background:#f0fdf4;border-bottom:1px solid #bbf7d0;
  font-size:12px;font-weight:700;color:#15803d;font-family:monospace;
}
.preview-dot { width:7px;height:7px;border-radius:50%;background:#16a34a;animation:blink 1.5s ease-in-out infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

.boutique-preview-card { background:var(--surface); }

/* Bannière */
.bpc-banner { height:120px;position:relative;overflow:hidden; }
.bpc-banner-img { width:100%;height:100%;object-fit:cover; }
.bpc-banner-gradient { width:100%;height:100%; }

/* Body */
.bpc-body { padding:20px 24px; }
.bpc-logo-row { display:flex;align-items:flex-end;gap:14px;margin-top:-40px;margin-bottom:14px; }
.bpc-logo {
  width:72px;height:72px;border-radius:14px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  border:3px solid var(--surface);overflow:hidden;
  box-shadow:0 2px 12px rgba(0,0,0,.12);
}
.bpc-logo-img    { width:100%;height:100%;object-fit:cover; }
.bpc-logo-letter { font-size:28px;font-weight:800;color:var(--text); }
.bpc-name-wrap   { flex:1;padding-bottom:4px; }
.bpc-name        { font-size:18px;font-weight:800;color:var(--text);line-height:1.2; }
.bpc-url         { font-size:11.5px;color:var(--text4);font-family:monospace;margin-top:2px; }
.bpc-verified    { padding:3px 10px;border-radius:20px;background:#dcfce7;color:#15803d;font-size:11px;font-weight:700;flex-shrink:0; }

.bpc-desc { font-size:14px;color:var(--text3);line-height:1.6;margin-bottom:12px; }
.bpc-tag  { display:inline-block;padding:3px 10px;border-radius:20px;background:var(--surface2);border:1px solid var(--border);font-size:12px;font-weight:600;color:var(--text3);margin-bottom:12px; }

.bpc-socials { display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap; }
.bpc-social-link { width:32px;height:32px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:15px;text-decoration:none;transition:all .15s; }
.bpc-social-link:hover { border-color:var(--text3);background:var(--surface); }

.bpc-stats { display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text4); }
.bpc-sep   { opacity:.4; }

/* ── Transition aperçu ── */
.slide-down-enter-active { transition:all .3s ease; }
.slide-down-leave-active { transition:all .25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity:0;transform:translateY(-12px); }

/* ── Layout ── */
.dual-col { display:grid;grid-template-columns:1fr 280px;gap:24px;align-items:start; }
.col-main { display:flex;flex-direction:column;gap:20px; }
.col-side { display:flex;flex-direction:column;gap:14px; }
.dual-fld { display:grid;grid-template-columns:1fr 1fr;gap:12px; }

/* ── Sections ── */
.section-box { background:var(--surface);border:1.5px solid var(--border);border-radius:14px;padding:22px;display:flex;flex-direction:column;gap:16px; }
.section-ttl { display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text4);font-family:monospace;margin-bottom:4px; }

/* ── Fields ── */
.fld { display:flex;flex-direction:column;gap:6px; }
.fld-lbl { font-size:11.5px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;font-family:monospace;display:flex;align-items:center;gap:6px; }
.fld-hint-inline { font-size:10px;font-weight:400;color:var(--text5);text-transform:none;letter-spacing:0; }
.req { color:#ef4444; }
.fld-inp { padding:10px 13px;border:1.5px solid var(--border);border-radius:9px;background:var(--surface);color:var(--text);font-size:14px;font-family:inherit;width:100%;transition:all .18s; }
.fld-inp:focus { outline:none;border-color:var(--text);box-shadow:0 0 0 3px rgba(0,0,0,.05); }
.fld-inp--lg { font-size:16px;font-weight:700;padding:12px 14px; }
.fld-textarea { resize:vertical;min-height:80px; }
.fld-hint { font-size:12px;color:var(--text5); }
.fld-hint-row { display:flex;justify-content:space-between;font-size:12px;color:var(--text5); }
.c-red { color:#ef4444 !important; }

/* Slug */
.slug-wrap   { display:flex;align-items:center;border:1.5px solid var(--border);border-radius:9px;overflow:hidden;background:var(--surface); }
.slug-prefix { padding:10px 12px;font-size:12px;color:var(--text4);background:var(--surface2);white-space:nowrap;font-family:monospace;border-right:1px solid var(--border); }
.slug-inp    { border:none !important;border-radius:0 !important;box-shadow:none !important;flex:1; }

/* Social */
.social-grid { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
.social-ico  { font-size:14px; }

/* Side boxes */
.side-box     { background:var(--surface);border:1.5px solid var(--border);border-radius:12px;padding:16px; }
.side-box-ttl { font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text4);margin-bottom:12px;font-family:monospace; }

/* Logo upload */
.logo-upload-zone { width:100%;aspect-ratio:1;border:2px dashed var(--border);border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;overflow:hidden;transition:border-color .2s;background:var(--surface2); }
.logo-upload-zone:hover { border-color:var(--text3); }
.logo-preview   { width:100%;height:100%;object-fit:cover; }
.logo-placeholder { display:flex;flex-direction:column;align-items:center;gap:6px;color:var(--text4);font-size:12px;text-align:center;padding:16px; }

/* Banner upload */
.banner-upload-zone { width:100%;height:80px;border:2px dashed var(--border);border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;overflow:hidden;transition:border-color .2s;background:var(--surface2); }
.banner-upload-zone:hover { border-color:var(--text3); }
.banner-preview   { width:100%;height:100%;object-fit:cover; }
.banner-placeholder { display:flex;flex-direction:column;align-items:center;gap:4px;color:var(--text4);font-size:11px; }
.rm-btn { margin-top:6px;font-size:12px;color:var(--text4);background:none;border:none;cursor:pointer; }
.rm-btn:hover { color:#ef4444; }

/* Color */
.clr-preview { height:56px;border-radius:9px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;transition:background .2s; }
.clr-row { display:flex;flex-wrap:wrap;gap:6px; }
.clr-dot { width:22px;height:22px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all .12s; }
.clr-dot--on { border-color:var(--text);transform:scale(1.2); }

/* Tags */
.tag-cloud { display:flex;flex-wrap:wrap;gap:5px; }
.cloud-tag { display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;background:var(--surface2);color:var(--text3);border:1px solid var(--border);font-size:11px;font-weight:500;cursor:pointer;transition:all .12s; }
.cloud-tag:hover { border-color:var(--text3);color:var(--text); }
.cloud-tag--on { background:var(--text);color:var(--surface);border-color:var(--text); }
.tag-skel-row { display:flex;flex-wrap:wrap;gap:5px; }
.tag-skel { height:25px;width:60px;border-radius:20px;background:var(--surface2);animation:pulse .9s ease-in-out infinite alternate; }

/* Footer */
.step-foot { display:flex;align-items:center;justify-content:flex-end;margin-top:36px;padding-top:20px;border-top:1px solid var(--border2); }

/* Spinner */
.spinner { width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,.25);border-top-color:#fff;animation:spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg) } }

/* Toast */
.toast { position:fixed;bottom:24px;right:24px;background:#18181b;color:#fff;padding:12px 22px;border-radius:10px;font-size:13.5px;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,.25);z-index:500; }
.toast--err { background:#ef4444; }
.tst-enter-active { transition:all .3s cubic-bezier(.34,1.56,.64,1); }
.tst-leave-active { transition:all .2s ease; }
.tst-enter-from, .tst-leave-to { opacity:0;transform:translateY(16px) scale(.9); }

/* Responsive */
@media (max-width:900px) {
  .dual-col    { grid-template-columns:1fr; }
  .col-side    { order:-1; }
  .social-grid { grid-template-columns:1fr; }
  .dual-fld    { grid-template-columns:1fr; }
  .bpc-logo-row { flex-wrap:wrap; }
}
</style>