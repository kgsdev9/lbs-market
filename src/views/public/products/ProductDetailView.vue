<template>
  <div>

    <!-- ══ LOADING ══ -->
    <div v-if="loading" class="section">
      <div class="container">
        <div class="rd-grid">
          <div>
            <div class="skel" style="height:20px;width:160px;margin-bottom:18px" />
            <div class="skel" style="height:36px;width:75%;margin-bottom:12px" />
            <div class="skel" style="height:16px;width:90%;margin-bottom:8px" />
            <div class="skel" style="height:16px;width:70%;margin-bottom:24px" />
            <div class="skel" style="height:14px;width:200px" />
          </div>
          <div class="skel" style="height:460px;border-radius:16px" />
        </div>
      </div>
    </div>

    <!-- ══ ERREUR ══ -->
    <div v-else-if="error" class="section">
      <div class="container" style="text-align:center;padding:80px 0">
        <div style="font-size:48px;margin-bottom:16px">😕</div>
        <h2 style="font-size:22px;font-weight:700;margin-bottom:8px">Ressource introuvable</h2>
        <p style="color:var(--text3);margin-bottom:24px">Cette ressource n'existe pas ou a été supprimée.</p>
        <RouterLink to="/product" class="btn btn-primary">← Retour aux Produits</RouterLink>
      </div>
    </div>

    <!-- ══ CONTENU ══ -->
    <div v-else-if="r">

      <!-- ══ BLOC PRINCIPAL : hero gauche + card droite ══ -->
      <div class="rd-hero-section" :style="{ background: heroBg }">
        <div class="container">
          <div class="rd-grid">

            <!-- ── Gauche : infos ── -->
            <div class="rd-left">
              <div class="rd-bc">
                <RouterLink to="/product" class="rd-bc-lnk">Produit</RouterLink>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span>{{ typeLabel(r.type) }}</span>
              </div>

              <div class="rd-badges">
                <span class="rd-badge" :style="typeBadgeStyle(r.type)">{{ typeEmoji(r.type) }} {{ typeLabel(r.type)
                  }}</span>
                <span v-if="r.badge" class="rd-badge rd-badge--accent">{{ r.badge }}</span>
                <span v-if="r.status === 'publish'" class="rd-badge rd-badge--green">✅ Publié</span>
              </div>

              <h1 class="rd-title">{{ r.title }}</h1>
              <p class="rd-sub">{{ r.short_description }}</p>

              <div class="rd-stats">
                <span class="rd-stat">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {{ r.views || 0 }} vues
                </span>
                <span class="rd-sep">·</span>
                <span class="rd-stat">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {{ r.downloads || 0 }} téléchargements
                </span>
                <template v-if="r.file_size">
                  <span class="rd-sep">·</span>
                  <span class="rd-stat">{{ fileSize }}</span>
                </template>
              </div>
            </div>

            <!-- ── Droite : card achat ── -->
            <div class="rd-right">
              <div class="buy-card">

                <div class="buy-img-wrap" :style="{ background: r.cover_color || coverFallback }">
                  <img v-if="r.preview_image" :src="r.preview_image" class="buy-img"
                    @error="e => e.target.style.display = 'none'" />
                  <span v-else class="buy-img-emoji">{{ typeEmoji(r.type) }}</span>
                </div>

                <div class="buy-body">
                  <div class="buy-price">
                    <span v-if="isFree" class="price-free">Gratuit</span>
                    <span v-else class="price-paid">{{ Number(r.price).toLocaleString() }} FCFA</span>
                  </div>

                  <!-- ═══ BOUTON PRINCIPAL ═══ -->
                  <button class="buy-cta" @click="handleAction" :disabled="processing">
                    <svg v-if="isFree" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2.5">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                    </svg>
                    {{ processing ? 'Chargement...' : (isFree ? 'Télécharger gratuitement' : 'Acheter maintenant') }}
                  </button>

                  <a v-if="r.demo_link" :href="r.demo_link" target="_blank" class="buy-demo">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Voir la démo
                  </a>

                  <div class="buy-includes">
                    <div class="bi-ttl">Ce que tu obtiens</div>
                    <div class="bi-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Accès immédiat au téléchargement
                    </div>
                    <div class="bi-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Fichier {{ fileExtension }} téléchargeable
                      <span v-if="r.file_size" class="bi-size">({{ fileSize }})</span>
                    </div>
                    <div class="bi-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Mises à jour incluses
                    </div>
                  </div>

                  <a v-if="r.github_link" :href="r.github_link" target="_blank" class="buy-github">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    Voir le code source
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- ══ DESCRIPTION EN BAS ══ -->
      <div class="section">
        <div class="container">
          <div class="rd-tabs">
            <button v-for="tab in tabs" :key="tab" class="rd-tab" :class="{ active: activeTab === tab }"
              @click="activeTab = tab">{{ tab }}</button>
          </div>

          <div v-if="activeTab === 'Description'" class="rd-prose">
            <div v-if="r.description" v-html="renderedDescription" />
            <div v-else class="rd-empty">Aucune description disponible.</div>
          </div>

          <div v-if="activeTab === 'Créateur'">
            <div v-if="r.author" class="creator-card card card-p">
              <div style="display:flex;align-items:center;gap:14px">
                <div class="creator-avatar">{{ initials(r.author.name) }}</div>
                <div>
                  <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:3px">{{ r.author.name }}
                  </div>
                  <div style="font-size:13px;color:var(--text4)">Créateur de contenu · Aho</div>
                </div>
              </div>
            </div>
            <div v-else class="rd-empty">Informations créateur non disponibles.</div>
          </div>
        </div>
      </div>

    </div>

    <!-- ══════════════════════════════════════════════════════
         MODAL PAIEMENT
    ══════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="showPayModal" class="modal-backdrop" @click.self="closePayModal">
        <div class="pay-modal">

          <!-- Header -->
          <div class="pay-modal-header">
            <div>
              <div class="pay-modal-label">Finaliser l'achat</div>
              <div class="pay-modal-title">{{ r?.title }}</div>
            </div>
            <button class="pay-modal-close" @click="closePayModal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Résumé commande -->
          <div class="pay-summary">
            <div class="pay-summary-img" :style="{ background: r?.cover_color || coverFallback }">
              <img v-if="r?.preview_image" :src="r.preview_image" @error="e => e.target.style.display = 'none'" />
              <span v-else>{{ typeEmoji(r?.type) }}</span>
            </div>
            <div class="pay-summary-info">
              <div class="pay-summary-type">{{ typeLabel(r?.type) }}</div>
              <div class="pay-summary-name">{{ r?.title }}</div>
            </div>
            <div class="pay-summary-price">{{ Number(r?.price).toLocaleString() }} <small>FCFA</small></div>
          </div>

          <!-- ── Nom complet + Email côte à côte ── -->
          <div class="pay-row">
            <div class="pay-field">
              <label class="pay-label">Nom complet <span class="req">*</span></label>
              <div class="pay-input-wrap">
                <svg class="pay-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input v-model="payFullname" type="text" class="pay-input"
                  :class="{ 'pay-input--error': payFullnameError }" placeholder="Ex : Kofi Yao"
                  @input="payFullnameError = ''" />
              </div>
              <span v-if="payFullnameError" class="pay-field-error">{{ payFullnameError }}</span>
            </div>

            <div class="pay-field">
              <label class="pay-label">Adresse email <span class="req">*</span></label>
              <div class="pay-input-wrap">
                <svg class="pay-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input v-model="payEmail" type="email" class="pay-input" :class="{ 'pay-input--error': payEmailError }"
                  placeholder="Ex : kofi@exemple.com" @input="payEmailError = ''" />
              </div>
              <span v-if="payEmailError" class="pay-field-error">{{ payEmailError }}</span>
            </div>
          </div>

          <!-- ── Téléphone pleine largeur ── -->
          <div class="pay-field">
            <label class="pay-label">Numéro de téléphone <span class="req">*</span></label>
            <div class="pay-input-wrap">
              <svg class="pay-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2">
                <path
                  d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.0 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14z" />
              </svg>
              <input v-model="payPhone" type="tel" class="pay-input" :class="{ 'pay-input--error': payPhoneError }"
                placeholder="Ex : 07 01 23 45 67" @input="payPhoneError = ''" />
            </div>
            <span v-if="payPhoneError" class="pay-field-error">{{ payPhoneError }}</span>
          </div>

          <!-- ── Modes de règlement (GET /api/v1/modereglements) ── -->
          <div class="pay-field">
            <label class="pay-label">Mode de paiement <span class="req">*</span></label>

            <!-- Skeleton chargement -->
            <div v-if="loadingModes" class="pay-channels">
              <div v-for="i in 4" :key="i" class="skel" style="height:50px;border-radius:10px;" />
            </div>

            <!-- Modes depuis l'API -->
            <div v-else-if="modereglements.length" class="pay-channels">
              <label v-for="mode in modereglements" :key="mode.id" class="pay-channel"
                :class="{ active: payChannel === mode.id }">
                <input type="radio" v-model="payChannel" :value="mode.id" hidden />
                <img v-if="mode.logo" :src="mode.logo" class="pay-channel-logo"
                  @error="e => e.target.style.display = 'none'" />
                <span v-else class="pay-channel-icon">💳</span>
                <span class="pay-channel-name">{{ mode.name }}</span>
                <span v-if="payChannel === mode.id" class="pay-channel-check">✓</span>
              </label>
            </div>

            <!-- Fallback statique si API échoue -->
            <div v-else class="pay-channels">
              <label v-for="ch in channelsFallback" :key="ch.value" class="pay-channel"
                :class="{ active: payChannel === ch.value }">
                <input type="radio" v-model="payChannel" :value="ch.value" hidden />
                <span class="pay-channel-icon">{{ ch.icon }}</span>
                <span class="pay-channel-name">{{ ch.label }}</span>
                <span v-if="payChannel === ch.value" class="pay-channel-check">✓</span>
              </label>
            </div>
          </div>

          <!-- Erreur globale -->
          <div v-if="payError" class="pay-error">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {{ payError }}
          </div>

          <!-- Bouton confirmer -->
          <button class="pay-confirm" @click="confirmPayment" :disabled="processing">
            <template v-if="processing">
              <span class="pay-spinner"></span>
              Redirection en cours…
            </template>
            <template v-else>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Payer {{ Number(r?.price).toLocaleString() }} FCFA
            </template>
          </button>

          <p class="pay-secure">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Paiement sécurisé via PaiementPro
          </p>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script>
import API from '@/services/api'
import { RouterLink } from 'vue-router'

export default {
  name: 'ResourceDetailView',
  components: { RouterLink },

  data() {
    return {
      r: null, loading: true, error: false, processing: false,
      activeTab: 'Description',
      tabs: ['Description', 'Créateur'],

      // ── Paiement ──
      showPayModal: false,
      payFullname: '',
      payEmail: '',
      payPhone: '',
      payChannel: null,
      payFullnameError: '',
      payEmailError: '',
      payPhoneError: '',
      payError: '',
      modereglements: [],
      loadingModes: false,

      // Fallback statique si l'API échoue
      channelsFallback: [
        { value: 'WAVE', icon: '🌊', label: 'Wave' },
        { value: 'ORANGE_MONEY', icon: '🟠', label: 'Orange Money' },
        { value: 'MTN_MOMO', icon: '🟡', label: 'MTN MoMo' },
        { value: 'CARD', icon: '💳', label: 'Carte bancaire' },
      ],

      resourceTypes: [
        { value: 'template', label: 'Template', icon: '🎨', color: '#ede9fe', text: '#7c3aed' },
        { value: 'plugin', label: 'Plugin', icon: '🔌', color: '#dbeafe', text: '#1d4ed8' },
        { value: 'ebook', label: 'eBook', icon: '📘', color: '#dcfce7', text: '#15803d' },
        { value: 'snippet', label: 'Snippet', icon: '💡', color: '#fef9c3', text: '#854d0e' },
        { value: 'component', label: 'Composant', icon: '🧩', color: '#dbeafe', text: '#1d4ed8' },
        { value: 'tool', label: 'Outil', icon: '🛠️', color: '#ffedd5', text: '#c2410c' },
      ],
    }
  },

  computed: {
    slug() { return this.$route.params.slug },
    isFree() { return !this.r?.price || this.r.price == 0 || this.r.is_free },

    heroBg() {
      return this.r?.cover_color
        || this.resourceTypes.find(t => t.value === this.r?.type)?.color
        || '#dbeafe'
    },
    coverFallback() {
      return this.resourceTypes.find(t => t.value === this.r?.type)?.color || '#f1f5f9'
    },
    fileExtension() {
      if (this.r?.file_name) return this.r.file_name.split('.').pop().toUpperCase()
      if (this.r?.file_url) return this.r.file_url.split('.').pop().split('?')[0].toUpperCase()
      return 'ZIP'
    },
    fileSize() {
      if (!this.r?.file_size) return null
      const kb = parseFloat(this.r.file_size)
      if (kb < 1024) return kb.toFixed(0) + ' Ko'
      if (kb < 1048576) return (kb / 1024).toFixed(1) + ' Mo'
      return (kb / 1048576).toFixed(1) + ' Go'
    },
    renderedDescription() {
      if (!this.r?.description) return ''
      let md = this.r.description
      md = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        const escaped = code.trimEnd().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        return `<div class="rd-code-block"><div class="rd-code-lang">${lang || 'code'}</div><pre><code>${escaped}</code></pre></div>`
      })
      md = md.replace(/^## (.+)$/gm, '<h2 class="rd-h2">$1</h2>')
      md = md.replace(/^### (.+)$/gm, '<h3 class="rd-h3">$1</h3>')
      md = md.replace(/^# (.+)$/gm, '<h1 class="rd-h1">$1</h1>')
      md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      md = md.replace(/\*(.+?)\*/g, '<em>$1</em>')
      md = md.replace(/`([^`]+)`/g, '<code class="rd-ic">$1</code>')
      md = md.replace(/^> (.+)$/gm, '<blockquote class="rd-bq">$1</blockquote>')
      md = md.replace(/^- (.+)$/gm, '<li>$1</li>')
      md = md.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, s => `<ul class="rd-ul">${s}</ul>`)
      md = md.replace(/\n\n(?!<)/g, '</p><p class="rd-p">')
      return '<p class="rd-p">' + md + '</p>'
    },
  },

  watch: { slug(v) { if (v) this.fetchResource() } },

  methods: {
    async fetchResource() {
      this.loading = true; this.error = false; this.r = null
      try {
        const { data } = await API.get(`/v1/resources/${this.slug}`)
        this.r = data
      } catch (e) { this.error = true }
      finally { this.loading = false }
    },

    async fetchModereglements() {
      this.loadingModes = true
      try {
        const { data } = await API.get('/v1/modereglements')
        this.modereglements = data
        if (data.length > 0) this.payChannel = data[0].id
      } catch (e) {
        this.modereglements = []
        this.payChannel = this.channelsFallback[0].value
      } finally {
        this.loadingModes = false
      }
    },

    typeLabel(type) { return this.resourceTypes.find(t => t.value === type)?.label ?? type },
    typeEmoji(type) { return this.resourceTypes.find(t => t.value === type)?.icon ?? '📦' },
    typeBadgeStyle(type) {
      const t = this.resourceTypes.find(x => x.value === type)
      return t ? { background: t.color, color: t.text } : {}
    },
    initials(name) {
      if (!name) return '?'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },

    handleAction() {
      if (!this.r) return

      if (this.isFree) {
        const url = this.r.file_url || `/api/v1/resources/${this.r.slug}/download`
        window.open(url, '_blank')
        return
      }
      this.payFullname = ''
      this.payEmail = ''
      this.payPhone = ''
      this.payFullnameError = ''
      this.payEmailError = ''
      this.payPhoneError = ''
      this.payError = ''
      this.showPayModal = true
      this.fetchModereglements() 
    },

    closePayModal() {
      if (this.processing) return
      this.showPayModal = false
    },

    validateForm() {
      let valid = true
      this.payFullnameError = ''
      this.payEmailError = ''
      this.payPhoneError = ''

      if (!this.payFullname.trim()) {
        this.payFullnameError = 'Le nom complet est obligatoire.'
        valid = false
      }
      if (!this.payEmail.trim()) {
        this.payEmailError = "L'adresse email est obligatoire."
        valid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.payEmail)) {
        this.payEmailError = 'Adresse email invalide.'
        valid = false
      }
      const cleaned = this.payPhone.replace(/\s/g, '')
      if (!cleaned) {
        this.payPhoneError = 'Le numéro de téléphone est obligatoire.'
        valid = false
      } else if (!/^\d{8,15}$/.test(cleaned)) {
        this.payPhoneError = 'Numéro invalide (8 à 15 chiffres).'
        valid = false
      }

      return valid
    },

    async confirmPayment() {
      if (!this.validateForm()) return
      this.processing = true
      this.payError = ''
      try {
        const { data } = await API.post('/payment/initiate', {
          resource_id: this.r.id,
          customer_fullname: this.payFullname.trim(),
          customer_email: this.payEmail.trim(),
          customer_phone: this.payPhone.replace(/\s/g, ''),
          modereglement_id: this.payChannel,
        })
        if (data.success) {
          sessionStorage.setItem('payment_reference', data.reference)
          sessionStorage.setItem('payment_order_id', data.order_id)
          window.location.href = data.payment_url
        } else {
          this.payError = data.message || "Échec de l'initialisation du paiement."
          this.processing = false
        }
      } catch (err) {
        this.payError = err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
        this.processing = false
      }
    },
  },

  created() { this.fetchResource() },
}
</script>

<style scoped>
/* ══ Page ══ */
.rd-hero-section {
  padding: 40px 0 44px;
  border-bottom: 1px solid var(--border);
}

.rd-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 48px;
  align-items: start;
}

.rd-left {
  padding-top: 4px;
}

.rd-bc {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text4);
  margin-bottom: 16px;
}

.rd-bc-lnk {
  color: var(--text4);
  text-decoration: none;
}

.rd-bc-lnk:hover {
  color: var(--text);
}

.rd-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.rd-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-mono);
}

.rd-badge--accent {
  background: var(--accent);
  color: var(--accent-fg);
}

.rd-badge--green {
  background: #dcfce7;
  color: #15803d;
}

.rd-title {
  font-size: clamp(24px, 3.2vw, 40px);
  font-weight: 800;
  color: var(--text);
  letter-spacing: -.8px;
  line-height: 1.15;
  margin: 0 0 14px;
}

.rd-sub {
  font-size: 15.5px;
  color: var(--text3);
  line-height: 1.72;
  margin: 0 0 20px;
  max-width: 560px;
}

.rd-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.rd-stat {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--text4);
}

.rd-sep {
  color: var(--text5);
}

.buy-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, .07);
}

.buy-img-wrap {
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.buy-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.buy-img-emoji {
  font-size: 64px;
}

.buy-body {
  padding: 22px;
}

.buy-price {
  margin-bottom: 16px;
}

.price-free {
  font-size: 26px;
  font-weight: 800;
  color: #16a34a;
  font-family: monospace;
  letter-spacing: -.5px;
}

.price-paid {
  font-size: 26px;
  font-weight: 800;
  color: var(--text);
  font-family: monospace;
  letter-spacing: -.5px;
}

.buy-cta {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: var(--text);
  color: var(--surface);
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity .15s;
  margin-bottom: 10px;
}

.buy-cta:hover:not(:disabled) {
  opacity: .85;
}

.buy-cta:disabled {
  opacity: .4;
  cursor: not-allowed;
}

.buy-demo {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px;
  border-radius: 9px;
  border: 1.5px solid var(--border);
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: var(--text2);
  text-decoration: none;
  transition: all .15s;
  margin-bottom: 16px;
}

.buy-demo:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.buy-includes {
  border-top: 1px solid var(--border2);
  padding-top: 14px;
}

.bi-ttl {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .7px;
  color: var(--text4);
  margin-bottom: 10px;
  font-family: var(--font-mono);
}

.bi-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text2);
  margin-bottom: 8px;
}

.bi-size {
  font-size: 11.5px;
  color: var(--text4);
  margin-left: 3px;
}

.buy-github {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 14px;
  padding: 9px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text3);
  background: var(--surface2);
  border: 1px solid var(--border2);
  text-decoration: none;
  transition: all .15s;
}

.buy-github:hover {
  background: var(--surface);
  color: var(--text);
}

.rd-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  margin-bottom: 28px;
}

.rd-tab {
  padding: 10px 20px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text3);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all .15s;
  margin-bottom: -1px;
}

.rd-tab:hover {
  color: var(--text);
}

.rd-tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

:deep(.rd-p) {
  margin: 12px 0;
  line-height: 1.85;
  color: var(--text2);
  font-size: 15px;
}

:deep(.rd-h1) {
  font-size: 24px;
  font-weight: 800;
  margin: 32px 0 12px;
  color: var(--text);
}

:deep(.rd-h2) {
  font-size: 19px;
  font-weight: 700;
  margin: 28px 0 10px;
  color: var(--text);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border2);
}

:deep(.rd-h3) {
  font-size: 15.5px;
  font-weight: 600;
  margin: 22px 0 8px;
  color: var(--text);
}

:deep(.rd-ul) {
  padding-left: 0;
  margin: 12px 0;
  list-style: none;
}

:deep(.rd-ul li) {
  position: relative;
  padding-left: 18px;
  margin: 7px 0;
  line-height: 1.8;
  color: var(--text2);
  font-size: 15px;
}

:deep(.rd-ul li::before) {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-weight: 700;
  font-size: 12px;
  top: 3px;
}

:deep(.rd-bq) {
  border-left: 3px solid var(--accent);
  padding: 10px 16px;
  margin: 18px 0;
  background: var(--surface2);
  border-radius: 0 8px 8px 0;
  color: var(--text3);
  font-style: italic;
}

:deep(.rd-ic) {
  background: var(--surface2);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: #e06c75;
  border: 1px solid var(--border);
}

:deep(.rd-code-block) {
  margin: 18px 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
}

:deep(.rd-code-lang) {
  padding: 8px 14px;
  background: var(--surface);
  font-size: 11.5px;
  font-family: var(--font-mono);
  color: var(--text4);
  border-bottom: 1px solid var(--border);
}

:deep(.rd-code-block pre) {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  background: #0d1117;
}

:deep(.rd-code-block code) {
  font-size: 13px;
  line-height: 1.7;
  font-family: var(--font-mono);
  color: #e2e8f0;
}

.rd-empty {
  padding: 40px;
  text-align: center;
  color: var(--text4);
  font-size: 14px;
}

.creator-card {
  border-radius: 12px;
}

.creator-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--accent-fg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}

.skel {
  background: linear-gradient(90deg, var(--surface2) 0%, var(--surface) 50%, var(--surface2) 100%);
  background-size: 200% 100%;
  animation: sk 1.5s infinite;
  border-radius: 6px;
  display: block;
}

@keyframes sk {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* ══ MODAL PAIEMENT ══ */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
  animation: fadeIn .15s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0
  }

  to {
    opacity: 1
  }
}

.pay-modal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  width: 100%;
  max-width: 580px;
  padding: 28px 28px 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, .2);
  animation: slideUp .2s ease;
  max-height: 90vh;
  overflow-y: auto;
}

@keyframes slideUp {
  from {
    transform: translateY(16px);
    opacity: 0
  }

  to {
    transform: translateY(0);
    opacity: 1
  }
}

.pay-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.pay-modal-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .8px;
  color: var(--text4);
  font-family: var(--font-mono);
  margin-bottom: 4px;
}

.pay-modal-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.3;
  max-width: 440px;
}

.pay-modal-close {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 8px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text3);
  flex-shrink: 0;
  transition: all .15s;
}

.pay-modal-close:hover {
  background: var(--surface);
  color: var(--text);
}

.pay-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--surface2);
  border: 1px solid var(--border2);
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 20px;
}

.pay-summary-img {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  overflow: hidden;
}

.pay-summary-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pay-summary-info {
  flex: 1;
  min-width: 0;
}

.pay-summary-type {
  font-size: 11px;
  color: var(--text4);
  font-family: var(--font-mono);
  margin-bottom: 2px;
}

.pay-summary-name {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pay-summary-price {
  font-size: 16px;
  font-weight: 800;
  color: var(--text);
  white-space: nowrap;
  font-family: monospace;
}

.pay-summary-price small {
  font-size: 11px;
  font-weight: 500;
  color: var(--text4);
}

/* Grille 2 colonnes nom + email */
.pay-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* Champs */
.pay-field {
  margin-bottom: 16px;
}

.pay-label {
  display: block;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text2);
  margin-bottom: 7px;
}

.req {
  color: #ef4444;
}

.pay-input-wrap {
  position: relative;
}

.pay-input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text4);
  pointer-events: none;
}

.pay-input {
  width: 100%;
  padding: 11px 12px 11px 38px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text);
  background: var(--surface);
  transition: border-color .15s;
}

.pay-input:focus {
  outline: none;
  border-color: var(--accent);
}

.pay-input--error {
  border-color: #ef4444 !important;
}

.pay-field-error {
  font-size: 12px;
  color: #ef4444;
  margin-top: 5px;
  display: block;
}

/* Modes de règlement */
.pay-channels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.pay-channel {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  cursor: pointer;
  transition: all .15s;
  position: relative;
}

.pay-channel:hover {
  border-color: var(--accent);
}

.pay-channel.active {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 8%, transparent);
}

.pay-channel-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
  border-radius: 4px;
  flex-shrink: 0;
}

.pay-channel-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.pay-channel-name {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text2);
  flex: 1;
}

.pay-channel-check {
  font-size: 11px;
  color: var(--accent);
  font-weight: 700;
}

.pay-error {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fca5a5;
  color: #b91c1c;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  margin-bottom: 14px;
}

.pay-confirm {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: var(--text);
  color: var(--surface);
  border: none;
  border-radius: 11px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity .15s;
  margin-bottom: 12px;
}

.pay-confirm:hover:not(:disabled) {
  opacity: .85;
}

.pay-confirm:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.pay-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, .3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.pay-secure {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 11.5px;
  color: var(--text4);
  text-align: center;
}

/* Responsive */
@media (max-width: 960px) {
  .rd-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .rd-left {
    order: 1;
  }

  .rd-right {
    order: 2;
  }

  .buy-img-wrap {
    height: 240px;
  }
}

@media (max-width: 640px) {
  .rd-hero-section {
    padding: 28px 0 32px;
  }

  .rd-title {
    font-size: 22px;
  }

  .pay-row {
    grid-template-columns: 1fr;
  }

  /* empile sur mobile */
  .pay-channels {
    grid-template-columns: 1fr 1fr;
  }
}
</style>