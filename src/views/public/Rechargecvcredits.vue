<template>
  <div class="recharge-page">

    <!-- ══ HEADER ══ -->
    <div class="rch-header">
      <div class="container">
        <div class="rch-bc">
          <RouterLink to="/cv-builder" class="rch-bc-lnk">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Retour au générateur
          </RouterLink>
        </div>
        <div class="rch-hero">
          <div class="rch-hero-icon">🪙</div>
          <div>
            <h1 class="rch-hero-title">Recharger mes crédits CV</h1>
            <p class="rch-hero-sub">1 crédit = 1 export PDF · Paiement sécurisé via Mobile Money</p>
          </div>
          <div class="rch-balance-chip">
            <span class="rch-balance-label">Solde actuel</span>
            <span class="rch-balance-val">
              <span v-if="loadingBalance" class="skel" style="width:32px;height:20px;display:inline-block" />
              <strong v-else>{{ balance }}</strong> crédit{{ balance > 1 ? 's' : '' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="container rch-body">

      <!-- ══ PACKS ══ -->
      <div class="rch-section">
        <div class="rch-section-title">Choisissez un pack</div>

        <!-- Skeleton -->
        <div v-if="loadingPacks" class="packs-grid">
          <div v-for="i in 4" :key="i" class="skel" style="height:160px;border-radius:14px" />
        </div>

        <!-- Packs chargés -->
        <div v-else-if="packs.length" class="packs-grid">
          <div
            v-for="pack in packs"
            :key="pack.id"
            class="pack-card"
            :class="{ active: selectedPack?.id === pack.id, popular: pack.is_popular }"
            @click="selectedPack = pack"
          >
            <div v-if="pack.is_popular" class="pack-popular-badge">⭐ Populaire</div>
            <div class="pack-emoji">{{ pack.emoji }}</div>
            <div class="pack-name">{{ pack.name }}</div>
            <div class="pack-credits">
              <strong>{{ pack.credits }}</strong>
              <span>crédits</span>
            </div>
            <div class="pack-price">{{ pack.price_xof.toLocaleString() }} <small>FCFA</small></div>
            <div class="pack-detail">{{ pack.detail }}</div>
            <div class="pack-check" v-if="selectedPack?.id === pack.id">✓</div>
          </div>
        </div>

        <!-- Erreur -->
        <div v-else class="packs-empty">
          Impossible de charger les packs. <button @click="fetchPacks" class="btn-retry">Réessayer</button>
        </div>
      </div>

      <!-- ══ FORMULAIRE PAIEMENT ══ -->
      <div class="rch-section" v-if="selectedPack">
        <div class="rch-section-title">Informations de paiement</div>

        <div class="pay-form">

          <!-- Résumé pack sélectionné -->
          <div class="pay-recap">
            <div class="pay-recap-left">
              <span class="pay-recap-emoji">{{ selectedPack.emoji }}</span>
              <div>
                <div class="pay-recap-name">{{ selectedPack.name }}</div>
                <div class="pay-recap-credits">{{ selectedPack.credits }} crédits CV</div>
              </div>
            </div>
            <div class="pay-recap-price">{{ selectedPack.price_xof.toLocaleString() }} <small>FCFA</small></div>
          </div>

          <!-- Utilisateur connecté -->
          <div class="user-info-bar">
            <div class="user-info-avatar">{{ userInitials }}</div>
            <div class="user-info-text">
              <div class="user-info-name">{{ auth.user?.name }}</div>
              <div class="user-info-email">{{ auth.user?.email }}</div>
            </div>
            <span class="user-info-badge">✓ Connecté</span>
          </div>

          <!-- Téléphone -->
          <div class="pay-field">
            <label class="pay-label">Numéro Mobile Money <span class="req">*</span></label>
            <div class="pay-input-wrap">
              <svg class="pay-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.0 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14z"/>
              </svg>
              <input v-model="form.phone" type="tel" class="pay-input"
                :class="{ 'pay-input--error': errors.phone }"
                placeholder="Ex : 07 01 23 45 67" @input="errors.phone = ''" />
            </div>
            <span v-if="errors.phone" class="pay-field-error">{{ errors.phone }}</span>
          </div>

          <!-- Opérateur dynamique -->
          <div class="pay-field">
            <label class="pay-label">Mode de paiement <span class="req">*</span></label>

            <div v-if="loadingModes" class="pay-channels">
              <div v-for="i in 4" :key="i" class="skel" style="height:46px;border-radius:10px" />
            </div>

            <div v-else class="pay-channels">
              <label
                v-for="mode in modereglements"
                :key="mode.id"
                class="pay-channel"
                :class="{ active: form.operator === mode.id }"
              >
                <input type="radio" v-model="form.operator" :value="mode.id" hidden />
                <img v-if="mode.logo" :src="mode.logo" class="pay-channel-logo"
                  @error="e => e.target.style.display='none'" />
                <span v-else class="pay-channel-icon">💳</span>
                <span class="pay-channel-name">{{ mode.name }}</span>
                <span v-if="form.operator === mode.id" class="pay-channel-check">✓</span>
              </label>
            </div>

            <span v-if="errors.operator" class="pay-field-error">{{ errors.operator }}</span>
          </div>

          <!-- Erreur globale -->
          <div v-if="globalError" class="pay-error">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ globalError }}
          </div>

          <!-- Succès -->
          <div v-if="successMsg" class="pay-success">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ successMsg }}
          </div>

          <!-- Bouton payer -->
          <button class="pay-confirm" @click="submitPayment" :disabled="processing">
            <template v-if="processing">
              <span class="pay-spinner"></span>
              Redirection en cours…
            </template>
            <template v-else>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              Payer {{ selectedPack.price_xof.toLocaleString() }} FCFA → {{ selectedPack.credits }} crédits
            </template>
          </button>

          <p class="pay-secure">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Paiement sécurisé via PaiementPro
          </p>

        </div>
      </div>

      <!-- ══ POLLING statut paiement ══ -->
      <div v-if="pollingRef" class="polling-card">
        <div class="polling-anim">
          <span class="pay-spinner" style="width:22px;height:22px;border-width:3px;border-color:#4f46e5;border-top-color:transparent"></span>
        </div>
        <div>
          <div class="polling-title">Paiement en cours de vérification…</div>
          <div class="polling-sub">Effectuez le paiement sur votre téléphone puis attendez la confirmation.</div>
        </div>
        <button class="polling-cancel" @click="cancelPolling">Annuler</button>
      </div>

      <!-- ══ FAQ ══ -->
      <div class="rch-section rch-faq">
        <div class="rch-section-title">Questions fréquentes</div>
        <div class="faq-list">
          <div v-for="(f, i) in faqs" :key="i" class="faq-item" @click="faqOpen = faqOpen === i ? null : i">
            <div class="faq-q">
              <span>{{ f.q }}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                :style="{ transform: faqOpen === i ? 'rotate(180deg)' : '', transition: 'transform .2s' }">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            <div v-if="faqOpen === i" class="faq-a">{{ f.a }}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import API from '@/services/api'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'RechargeCvCredits',
  components: { RouterLink },

  setup() {
    const auth = useAuthStore()
    return { auth }
  },

  data() {
    return {
      balance: 0,
      loadingBalance: true,
      loadingPacks: true,
      selectedPack: null,
      processing: false,
      pollingRef: null,
      pollingInterval: null,
      globalError: '',
      successMsg: '',
      faqOpen: null,

      form: {
        phone: '',
        operator: null,
      },
      errors: {
        phone: '',
        operator: '',
      },

      // Chargés dynamiquement depuis /cv-credit-packs
      packs: [],

      // Chargés dynamiquement depuis /v1/modereglements
      modereglements: [],
      loadingModes: false,

      faqs: [
        {
          q: "Qu'est-ce qu'un crédit CV ?",
          a: "1 crédit = 1 export PDF de votre CV. Une fois vos crédits épuisés, vous devez en racheter pour continuer à télécharger.",
        },
        {
          q: 'Les crédits expirent-ils ?',
          a: "Non, vos crédits n'ont pas de date d'expiration. Ils restent sur votre compte jusqu'à utilisation.",
        },
        {
          q: 'Comment fonctionne le paiement ?',
          a: "Vous renseignez votre numéro Mobile Money, vous êtes redirigé vers PaiementPro pour confirmer. Les crédits sont ajoutés immédiatement après confirmation.",
        },
        {
          q: 'Que se passe-t-il si le paiement échoue ?',
          a: "Aucun crédit n'est débité si le paiement n'est pas confirmé. Vous pouvez réessayer à tout moment.",
        },
      ],
    }
  },

  async created() {
    await Promise.all([
      this.loadBalance(),
      this.fetchModereglements(),
      this.fetchPacks(),
    ])
  },

  beforeUnmount() {
    this.cancelPolling()
  },

  computed: {
    userInitials() {
      const name = this.auth.user?.name || ''
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
    },
  },

  methods: {

    // ── Packs depuis l'API ─────────────────────────────────────────────────
    async fetchPacks() {
      this.loadingPacks = true
      try {
        const { data } = await API.get('v1/cv-credit-packs')
        this.packs = data.data || []

        // Pré-sélectionner le pack populaire retourné par l'API
        this.selectedPack = data.popular_pack
          || this.packs.find(p => p.is_popular)
          || this.packs[0]
          || null
      } catch (_) {
        this.packs = []
      } finally {
        this.loadingPacks = false
      }
    },

    // ── Modes de règlement ─────────────────────────────────────────────────
    async fetchModereglements() {
      this.loadingModes = true
      try {
        const { data } = await API.get('/v1/modereglements')
        this.modereglements = data
        if (data.length > 0) this.form.operator = data[0].id
      } catch (e) {
        this.modereglements = []
      } finally {
        this.loadingModes = false
      }
    },

    // ── Solde crédits ──────────────────────────────────────────────────────
    async loadBalance() {
      this.loadingBalance = true
      try {
        const { data } = await API.get('/cv-credits/balance')
        this.balance = data.data.balance
      } catch (_) {
        this.balance = 0
      } finally {
        this.loadingBalance = false
      }
    },

    // ── Validation ────────────────────────────────────────────────────────
    validate() {
      let ok = true
      this.errors = { phone: '', operator: '' }

      const cleaned = this.form.phone.replace(/\s/g, '')
      if (!cleaned) {
        this.errors.phone = 'Le numéro est obligatoire.'
        ok = false
      } else if (!/^\d{8,15}$/.test(cleaned)) {
        this.errors.phone = 'Numéro invalide (8 à 15 chiffres).'
        ok = false
      }
      if (!this.form.operator) {
        this.errors.operator = 'Choisissez un opérateur.'
        ok = false
      }
      return ok
    },

    // ── Soumettre le paiement ─────────────────────────────────────────────
    async submitPayment() {
      if (!this.selectedPack) return
      if (!this.validate()) return

      this.processing  = true
      this.globalError = ''
      this.successMsg  = ''

      try {
        const { data } = await API.post('/payment/initiate', {
          resource_id:       3,
          data_arg:          3,
          pack_id:           this.selectedPack.id,
          credits:           this.selectedPack.credits,
          amount:            this.selectedPack.price_xof,
          customer_phone:    this.form.phone.replace(/\s/g, ''),
          modereglement_id:  this.form.operator,
          customer_fullname: this.auth.user?.name  || '',
          customer_email:    this.auth.user?.email || '',
          customer_id:       this.auth.user?.id    || null,
        })

        if (data.success) {
          if (data.payment_url || data.data?.payment_url) {
            const url = data.payment_url || data.data.payment_url
            const ref = data.reference   || data.data?.reference
            if (ref) sessionStorage.setItem('cv_payment_ref', ref)
            window.location.href = url
          } else if (data.reference || data.data?.reference) {
            this.pollingRef = data.reference || data.data.reference
            this.startPolling()
          } else {
            this.successMsg = data.message || 'Paiement initié avec succès.'
            this.processing = false
          }
        } else {
          this.globalError = data.message || 'Échec du paiement.'
          this.processing  = false
        }

      } catch (err) {
        this.globalError = err.response?.data?.message || 'Une erreur est survenue. Réessayez.'
        this.processing  = false
      }
    },

    // ── Polling statut ────────────────────────────────────────────────────
    startPolling() {
      this.processing = false
      let attempts    = 0
      const MAX       = 40

      this.pollingInterval = setInterval(async () => {
        attempts++
        try {
          const { data } = await API.get(`/cv-credits/check/${this.pollingRef}`)

          if (data.status === 'success') {
            this.cancelPolling()
            this.balance      = data.balance
            this.pollingRef   = null
            this.successMsg   = `✅ Paiement confirmé ! ${this.selectedPack.credits} crédits ajoutés. Nouveau solde : ${data.balance} crédit(s).`
            this.selectedPack = null

          } else if (data.status === 'failed') {
            this.cancelPolling()
            this.pollingRef  = null
            this.globalError = '❌ Paiement refusé ou annulé. Veuillez réessayer.'

          } else if (attempts >= MAX) {
            this.cancelPolling()
            this.pollingRef  = null
            this.globalError = 'Délai dépassé. Vérifiez votre solde ou réessayez.'
          }
        } catch (_) {}
      }, 3000)
    },

    cancelPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
        this.pollingInterval = null
      }
      this.pollingRef = null
      this.processing = false
    },
  },
}
</script>

<style scoped>
.recharge-page {
  min-height: 100vh;
  background: var(--bg, #f5f6f8);
  font-family: 'DM Sans', sans-serif;
}

/* ── Header ── */
.rch-header {
  background: #fff;
  border-bottom: 1px solid var(--border, #eaecef);
  padding: 16px 0 22px;
}

.container {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 20px;
}

.rch-bc { margin-bottom: 16px; }

.rch-bc-lnk {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text3, #6b7280);
  text-decoration: none;
  transition: color .15s;
}
.rch-bc-lnk:hover { color: #111; }

.rch-hero {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.rch-hero-icon { font-size: 36px; flex-shrink: 0; }

.rch-hero-title { font-size: 22px; font-weight: 800; color: #111; margin: 0 0 3px; }
.rch-hero-sub   { font-size: 13px; color: var(--text3, #6b7280); margin: 0; }

.rch-balance-chip {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  border-radius: 12px;
  padding: 10px 16px;
  flex-shrink: 0;
}

.rch-balance-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .6px;
  color: #16a34a;
  margin-bottom: 2px;
}

.rch-balance-val { font-size: 15px; color: #111; }
.rch-balance-val strong { font-size: 22px; font-weight: 800; color: #16a34a; }

/* ── Body ── */
.rch-body {
  padding-top: 28px;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.rch-section {
  background: #fff;
  border: 1px solid var(--border, #eaecef);
  border-radius: 16px;
  padding: 24px;
}

.rch-section-title {
  font-size: 14px;
  font-weight: 800;
  color: #111;
  margin-bottom: 18px;
}

/* ── Packs ── */
.packs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.packs-empty {
  text-align: center;
  padding: 32px;
  color: #9ca3af;
  font-size: 13.5px;
}

.btn-retry {
  margin-left: 8px;
  padding: 4px 12px;
  border-radius: 6px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  font-size: 12.5px;
  font-weight: 600;
  color: #4f46e5;
  cursor: pointer;
  font-family: inherit;
}

.pack-card {
  position: relative;
  border: 2px solid var(--border, #e5e7eb);
  border-radius: 14px;
  padding: 18px 14px 16px;
  cursor: pointer;
  transition: all .18s;
  text-align: center;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.pack-card:hover {
  border-color: #a5b4fc;
  background: #faf5ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(79,70,229,.1);
}

.pack-card.active {
  border-color: #4f46e5;
  background: #f5f3ff;
  box-shadow: 0 0 0 3px #4f46e511;
}

.pack-card.popular          { border-color: #f59e0b; background: #fffbeb; }
.pack-card.popular.active   { border-color: #f59e0b; background: #fef3c7; box-shadow: 0 0 0 3px #f59e0b22; }

.pack-popular-badge {
  position: absolute;
  top: -11px;
  left: 50%;
  transform: translateX(-50%);
  background: #f59e0b;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 10px;
  border-radius: 99px;
  white-space: nowrap;
}

.pack-emoji  { font-size: 28px; margin-bottom: 2px; }
.pack-name   { font-size: 12px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: .4px; }

.pack-credits { display: flex; align-items: baseline; gap: 4px; }
.pack-credits strong { font-size: 32px; font-weight: 900; color: #111; line-height: 1; }
.pack-credits span   { font-size: 12px; color: #888; font-weight: 600; }

.pack-price       { font-size: 16px; font-weight: 800; color: #4f46e5; }
.pack-price small { font-size: 11px; font-weight: 500; color: #888; }
.pack-detail      { font-size: 10.5px; color: #9ca3af; line-height: 1.4; }

.pack-check {
  position: absolute;
  top: 8px; right: 8px;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: #4f46e5;
  color: #fff;
  font-size: 10px; font-weight: 900;
  display: flex; align-items: center; justify-content: center;
}

.pack-card.popular .pack-check { background: #f59e0b; }
.pack-card.popular .pack-price { color: #d97706; }

/* ── Formulaire ── */
.pay-form { display: flex; flex-direction: column; gap: 0; }

.pay-recap {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 20px;
}

.pay-recap-left  { display: flex; align-items: center; gap: 10px; flex: 1; }
.pay-recap-emoji { font-size: 26px; }
.pay-recap-name  { font-size: 14px; font-weight: 700; color: #111; }
.pay-recap-credits { font-size: 12px; color: #6b7280; margin-top: 2px; }
.pay-recap-price { font-size: 18px; font-weight: 800; color: #111; font-family: monospace; }
.pay-recap-price small { font-size: 11px; font-weight: 500; color: #9ca3af; }

/* User info bar */
.user-info-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
}

.user-info-avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: #4f46e5;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700;
  flex-shrink: 0;
}

.user-info-text  { flex: 1; min-width: 0; }
.user-info-name  { font-size: 13.5px; font-weight: 700; color: #111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-info-email { font-size: 12px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.user-info-badge {
  font-size: 11px; font-weight: 700;
  color: #16a34a;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 99px;
  padding: 3px 10px;
  flex-shrink: 0;
}

.pay-field { margin-bottom: 16px; }

.pay-label { display: block; font-size: 12.5px; font-weight: 600; color: #374151; margin-bottom: 7px; }
.req { color: #ef4444; }

.pay-input-wrap { position: relative; }

.pay-input-icon {
  position: absolute;
  left: 12px; top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.pay-input {
  width: 100%;
  padding: 11px 12px 11px 38px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #111;
  background: #fff;
  transition: border-color .15s;
  box-sizing: border-box;
  font-family: inherit;
}

.pay-input:focus { outline: none; border-color: #4f46e5; }
.pay-input--error { border-color: #ef4444 !important; }

.pay-field-error { font-size: 12px; color: #ef4444; margin-top: 5px; display: block; }

/* Opérateurs */
.pay-channels { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }

.pay-channel {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  cursor: pointer;
  transition: all .15s;
  position: relative;
  background: #fff;
}

.pay-channel:hover       { border-color: #4f46e5; }
.pay-channel.active      { border-color: #4f46e5; background: #f5f3ff; }

.pay-channel-logo  { width: 28px; height: 28px; object-fit: contain; border-radius: 4px; flex-shrink: 0; }
.pay-channel-icon  { font-size: 18px; flex-shrink: 0; }
.pay-channel-name  { font-size: 12px; font-weight: 600; color: #374151; flex: 1; }
.pay-channel-check { font-size: 11px; color: #4f46e5; font-weight: 800; }

/* Erreur / succès */
.pay-error {
  display: flex; align-items: center; gap: 8px;
  background: #fef2f2; border: 1px solid #fca5a5;
  color: #b91c1c; border-radius: 8px;
  padding: 10px 14px; font-size: 13px; margin-bottom: 14px;
}

.pay-success {
  display: flex; align-items: center; gap: 8px;
  background: #f0fdf4; border: 1px solid #86efac;
  color: #15803d; border-radius: 8px;
  padding: 12px 14px; font-size: 13.5px; font-weight: 600; margin-bottom: 14px;
}

/* Bouton confirmer */
.pay-confirm {
  width: 100%;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px;
  background: #4f46e5; color: #fff;
  border: none; border-radius: 11px;
  font-size: 15px; font-weight: 700;
  cursor: pointer; transition: opacity .15s;
  margin-bottom: 12px; font-family: inherit;
}

.pay-confirm:hover:not(:disabled) { opacity: .88; }
.pay-confirm:disabled { opacity: .5; cursor: not-allowed; }

.pay-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .6s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

.pay-secure {
  display: flex; align-items: center; justify-content: center; gap: 5px;
  font-size: 11.5px; color: #9ca3af; margin: 0;
}

/* ── Polling ── */
.polling-card {
  background: #fff;
  border: 1.5px solid #c7d2fe;
  border-radius: 14px;
  padding: 20px 24px;
  display: flex; align-items: center; gap: 16px;
}

.polling-anim { flex-shrink: 0; }
.polling-title { font-size: 14.5px; font-weight: 700; color: #111; margin-bottom: 4px; }
.polling-sub   { font-size: 12.5px; color: #6b7280; }

.polling-cancel {
  margin-left: auto;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  font-size: 12.5px; font-weight: 600; color: #6b7280;
  cursor: pointer; flex-shrink: 0; font-family: inherit;
}
.polling-cancel:hover { border-color: #ef4444; color: #ef4444; }

/* ── FAQ ── */
.rch-faq { padding: 20px 24px; }
.faq-list { display: flex; flex-direction: column; gap: 0; }

.faq-item { border-bottom: 1px solid #f0f0f0; cursor: pointer; }
.faq-item:last-child { border-bottom: none; }

.faq-q {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 2px;
  font-size: 13.5px; font-weight: 600; color: #111;
  user-select: none;
}

.faq-a { padding: 0 2px 14px; font-size: 13px; color: #6b7280; line-height: 1.7; }

/* ── Skeleton ── */
.skel {
  background: linear-gradient(90deg, #f0f2f5 0%, #e8eaed 50%, #f0f2f5 100%);
  background-size: 200% 100%;
  animation: sk 1.5s infinite;
  border-radius: 4px;
  display: inline-block;
}

@keyframes sk {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Responsive ── */
@media (max-width: 760px) {
  .packs-grid    { grid-template-columns: repeat(2, 1fr); }
  .pay-channels  { grid-template-columns: repeat(2, 1fr); }
  .rch-hero      { flex-direction: column; align-items: flex-start; }
  .rch-balance-chip { margin-left: 0; }
  .polling-card  { flex-wrap: wrap; }
}

@media (max-width: 480px) {
  .packs-grid   { grid-template-columns: 1fr 1fr; }
  .pay-channels { grid-template-columns: 1fr 1fr; }
}
</style>