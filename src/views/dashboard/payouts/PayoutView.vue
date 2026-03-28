<template>
  <div>

    <!-- ── Header ── -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;flex-wrap:wrap;gap:12px">
      <div>
        <div style="font-family:var(--font-alt);font-size:20px;font-weight:700;color:var(--text)">
          Retransfert de fonds
        </div>
        <div style="font-size:13px;color:var(--text3);margin-top:3px">
          Envoi vers un ou plusieurs bénéficiaires via PaiementPro
        </div>
      </div>

      <!-- Solde -->
      <div class="balance-pill" @click="fetchBalance" :class="{ loading: balanceLoading }">
        <span class="balance-dot"/>
        <span v-if="balanceLoading" style="font-size:12px;color:var(--text3)">Chargement…</span>
        <span v-else-if="balance !== null" style="font-size:13px;font-weight:700;color:var(--text)">
          {{ balance.toLocaleString() }} XOF
        </span>
        <span v-else style="font-size:12px;color:var(--text3)">Afficher le solde</span>
      </div>
    </div>

    <!-- ── Tabs mode ── -->
    <div class="tabs" style="margin-bottom:24px">
      <button class="tab" :class="{ active: mode === 'single' }" @click="switchMode('single')">
        <span v-html="ICONS.user" style="width:14px;height:14px;display:inline-flex"/>
        Unique
      </button>
      <button class="tab" :class="{ active: mode === 'batch' }" @click="switchMode('batch')">
        <span v-html="ICONS.users" style="width:14px;height:14px;display:inline-flex"/>
        Par lot
        <span class="tab-count" v-if="mode === 'batch'">{{ payees.length }}</span>
      </button>
    </div>

    <!-- ══════════════════════════════════════
         MODE UNIQUE
    ══════════════════════════════════════ -->
    <form v-if="mode === 'single'" @submit.prevent="submitSingle" novalidate>
      <div class="form-grid">

        <!-- Bloc bénéficiaire -->
        <div class="card card-p form-section">
          <div class="section-title">Bénéficiaire</div>

          <div class="field">
            <label class="label">Numéro de téléphone <span class="req">*</span></label>
            <div class="input-prefix-wrap">
              <span class="input-prefix">📱</span>
              <input
                v-model="single.payee_no"
                class="input input-prefix"
                placeholder="+2250102030407"
                :class="{ 'input-error': err.payee_no }"
              />
            </div>
            <div v-if="err.payee_no" class="field-error">{{ err.payee_no }}</div>
          </div>

          <div class="field-row">
            <div class="field">
              <label class="label">Nom du client <span class="req">*</span></label>
              <input v-model="single.client_name" class="input" placeholder="Jean Konan" :class="{ 'input-error': err.client_name }"/>
              <div v-if="err.client_name" class="field-error">{{ err.client_name }}</div>
            </div>
            <div class="field">
              <label class="label">ID client <span class="req">*</span></label>
              <input v-model="single.client_id" class="input" placeholder="USR-001" :class="{ 'input-error': err.client_id }"/>
              <div v-if="err.client_id" class="field-error">{{ err.client_id }}</div>
            </div>
          </div>
        </div>

        <!-- Bloc transaction -->
        <div class="card card-p form-section">
          <div class="section-title">Transaction</div>

          <div class="field-row">
            <div class="field">
              <label class="label">Montant (XOF) <span class="req">*</span></label>
              <div class="input-prefix-wrap">
                <span class="input-prefix">₣</span>
                <input
                  v-model.number="single.amount"
                  type="number" min="1"
                  class="input input-prefix"
                  placeholder="5000"
                  :class="{ 'input-error': err.amount }"
                />
              </div>
              <div v-if="err.amount" class="field-error">{{ err.amount }}</div>
            </div>

            <div class="field">
              <label class="label">Canal <span class="req">*</span></label>
              <div class="channel-grid">
                <button
                  v-for="ch in channels" :key="ch.value" type="button"
                  class="channel-btn"
                  :class="{ active: single.channel === ch.value }"
                  @click="single.channel = ch.value"
                >
                  <span>{{ ch.icon }}</span>
                  <span style="font-size:11px">{{ ch.label }}</span>
                </button>
              </div>
              <div v-if="err.channel" class="field-error">{{ err.channel }}</div>
            </div>
          </div>

          <div class="field">
            <label class="label">Motif du paiement</label>
            <input v-model="single.payment_reason" class="input" placeholder="Remboursement commande #42"/>
          </div>

          <div class="field">
            <label class="label">Référence unique</label>
            <div class="input-suffix-wrap">
              <input v-model="single.reference_no" class="input input-suffix" placeholder="Auto-générée si vide"/>
              <button type="button" class="input-suffix-btn" @click="single.reference_no = 'REF-' + Date.now()" title="Générer">
                <span v-html="ICONS.refresh" style="width:13px;height:13px"/>
              </button>
            </div>
          </div>
        </div>

        <!-- Résumé + bouton -->
        <div class="card card-p form-section" style="background:var(--surface2)">
          <div class="section-title">Récapitulatif</div>
          <div class="recap-rows">
            <div class="recap-row">
              <span>Bénéficiaire</span>
              <span>{{ single.payee_no || '—' }}</span>
            </div>
            <div class="recap-row">
              <span>Canal</span>
              <span>{{ channels.find(c=>c.value===single.channel)?.label || '—' }}</span>
            </div>
            <div class="recap-row recap-total">
              <span>Montant</span>
              <span>{{ single.amount ? single.amount.toLocaleString() + ' XOF' : '—' }}</span>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%;margin-top:16px;justify-content:center" :disabled="submitting">
            <span v-if="submitting" class="spin"/>
            <span v-else v-html="ICONS.send" style="width:15px;height:15px"/>
            {{ submitting ? 'Envoi en cours…' : 'Envoyer le virement' }}
          </button>
        </div>

      </div>
    </form>

    <!-- ══════════════════════════════════════
         MODE BATCH
    ══════════════════════════════════════ -->
    <form v-else @submit.prevent="submitBatch" novalidate>

      <!-- Options globales batch -->
      <div class="card card-p form-section" style="margin-bottom:16px">
        <div class="section-title">Paramètres du lot</div>
        <div class="field-row">
          <div class="field">
            <label class="label">Canal <span class="req">*</span></label>
            <div class="channel-grid">
              <button
                v-for="ch in channels" :key="ch.value" type="button"
                class="channel-btn"
                :class="{ active: batch.channel === ch.value }"
                @click="batch.channel = ch.value"
              >
                <span>{{ ch.icon }}</span>
                <span style="font-size:11px">{{ ch.label }}</span>
              </button>
            </div>
            <div v-if="err.channel" class="field-error">{{ err.channel }}</div>
          </div>
          <div class="field">
            <label class="label">Référence du lot</label>
            <div class="input-suffix-wrap">
              <input v-model="batch.reference_no" class="input input-suffix" placeholder="BATCH-XXXX"/>
              <button type="button" class="input-suffix-btn" @click="batch.reference_no = 'BATCH-' + Date.now()">
                <span v-html="ICONS.refresh" style="width:13px;height:13px"/>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des bénéficiaires -->
      <div class="card" style="overflow:hidden;margin-bottom:16px">
        <div style="padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
          <div style="font-size:13px;font-weight:600;color:var(--text)">
            Bénéficiaires
            <span style="font-size:11px;color:var(--text4);font-family:var(--font-mono);margin-left:6px">{{ payees.length }}</span>
          </div>
          <div style="display:flex;gap:8px">
            <button type="button" class="btn btn-ghost btn-sm" @click="importCsv" title="Importer CSV">
              <span v-html="ICONS.upload" style="width:13px;height:13px"/> CSV
            </button>
            <button type="button" class="btn btn-secondary btn-sm" @click="addPayee">
              <span v-html="ICONS.plus" style="width:13px;height:13px"/> Ajouter
            </button>
          </div>
        </div>

        <!-- Table bénéficiaires -->
        <div v-if="payees.length === 0" style="padding:40px;text-align:center;color:var(--text4);font-size:13px">
          Aucun bénéficiaire. Cliquez sur <strong>Ajouter</strong> ou importez un CSV.
        </div>

        <table v-else style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:var(--surface2);border-bottom:1px solid var(--border)">
              <th class="th">#</th>
              <th class="th">Téléphone</th>
              <th class="th">Nom</th>
              <th class="th">ID client</th>
              <th class="th">Montant (XOF)</th>
              <th class="th">Motif</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(p, i) in payees" :key="i"
              style="border-bottom:1px solid var(--border2)"
              :class="{ 'row-error': payeeErrors[i] }"
            >
              <td style="padding:8px 12px;font-size:11px;color:var(--text4);font-family:var(--font-mono)">{{ i + 1 }}</td>
              <td style="padding:6px 8px">
                <input v-model="p.payee_no" class="input input-inline" placeholder="+225…" :class="{ 'input-error': payeeErrors[i]?.payee_no }"/>
              </td>
              <td style="padding:6px 8px">
                <input v-model="p.client_name" class="input input-inline" placeholder="Nom"/>
              </td>
              <td style="padding:6px 8px">
                <input v-model="p.client_id" class="input input-inline" placeholder="ID"/>
              </td>
              <td style="padding:6px 8px">
                <input v-model.number="p.amount" type="number" min="1" class="input input-inline" placeholder="0" :class="{ 'input-error': payeeErrors[i]?.amount }" style="width:90px"/>
              </td>
              <td style="padding:6px 8px">
                <input v-model="p.payment_reason" class="input input-inline" placeholder="Motif…"/>
              </td>
              <td style="padding:6px 10px">
                <button type="button" class="btn btn-icon btn-ghost btn-sm" style="color:var(--danger)" @click="removePayee(i)" v-html="ICONS.trash"/>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr style="background:var(--surface2);border-top:1px solid var(--border)">
              <td colspan="4" style="padding:10px 12px;font-size:12px;font-weight:600;color:var(--text3)">TOTAL</td>
              <td style="padding:10px 8px;font-size:13px;font-weight:700;color:var(--text)">{{ totalBatch.toLocaleString() }} XOF</td>
              <td colspan="2"/>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Input CSV caché -->
      <input ref="csvInput" type="file" accept=".csv" style="display:none" @change="parseCsv"/>

      <!-- Bouton soumettre batch -->
      <div style="display:flex;justify-content:flex-end">
        <button
          type="submit" class="btn btn-primary"
          :disabled="submitting || payees.length === 0"
          style="min-width:200px;justify-content:center"
        >
          <span v-if="submitting" class="spin"/>
          <span v-else v-html="ICONS.send" style="width:15px;height:15px"/>
          {{ submitting ? 'Envoi en cours…' : `Envoyer ${payees.length} virement${payees.length > 1 ? 's' : ''}` }}
        </button>
      </div>
    </form>

    <!-- ── Toast ── -->
    <transition name="toast">
      <div v-if="toast" class="toast" :class="'toast-' + toast.type">
        <span>{{ toast.type === 'success' ? '✅' : '❌' }}</span>
        <span>{{ toast.message }}</span>
      </div>
    </transition>

    <!-- ── Modal résultat ── -->
    <div v-if="result" class="modal-overlay" @click.self="result = null">
      <div class="modal-box">
        <div style="font-size:28px;margin-bottom:10px">{{ result.status === 'SUCCEEDED' || result.status === 'INITIATED' ? '✅' : '❌' }}</div>
        <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px">
          {{ result.status === 'SUCCEEDED' ? 'Virement réussi' : result.status === 'INITIATED' ? 'Lot soumis' : 'Échec' }}
        </div>
        <div style="font-size:13px;color:var(--text3);margin-bottom:16px">{{ result.description }}</div>
        <div v-if="result.tran_id || result.batchid" class="result-id">
          <span style="font-size:11px;color:var(--text4)">{{ result.tran_id ? 'Transaction ID' : 'Batch ID' }}</span>
          <span style="font-family:var(--font-mono);font-size:12px;color:var(--text2)">{{ result.tran_id || result.batchid }}</span>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:20px">
          <button class="btn btn-ghost btn-sm" @click="result = null">Fermer</button>
          <button v-if="result.sessionid || result.batchid" class="btn btn-secondary btn-sm" @click="checkStatus">
            Vérifier le statut
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import API from '@/services/api'

// ── Icônes inline (cohérent avec le projet existant) ──────────────────────────
const ICONS = {
  plus:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  user:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  users:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  send:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  trash:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,
  refresh: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
  upload:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>`,
}

// ── Canaux ────────────────────────────────────────────────────────────────────
const channels = [
  { value: 'WAVECI',  label: 'Wave',   icon: '🌊' },
  { value: 'MOMOCI',  label: 'MoMo',   icon: '📲' },
  { value: 'OMCIV',   label: 'Orange', icon: '🟠' },
  { value: 'FLOOZ',   label: 'Flooz',  icon: '💸' },
]

// ── State ─────────────────────────────────────────────────────────────────────
const mode       = ref('single')
const submitting = ref(false)
const result     = ref(null)
const toast      = ref(null)
const csvInput   = ref(null)

// Solde
const balance        = ref(null)
const balanceLoading = ref(false)

// Formulaire unique
const single = reactive({
  payee_no:       '',
  client_name:    '',
  client_id:      '',
  amount:         null,
  channel:        'WAVECI',
  payment_reason: '',
  reference_no:   '',
})

// Formulaire batch
const batch = reactive({ channel: 'WAVECI', reference_no: '' })
const payees = ref([])

// Erreurs
const err         = reactive({})
const payeeErrors = ref([])

// ── Computed ──────────────────────────────────────────────────────────────────
const totalBatch = computed(() => payees.value.reduce((s, p) => s + (Number(p.amount) || 0), 0))

// ── Méthodes ──────────────────────────────────────────────────────────────────
function switchMode(m) {
  mode.value = m
  clearErrors()
}

function clearErrors() {
  Object.keys(err).forEach(k => delete err[k])
  payeeErrors.value = []
}

// Solde
async function fetchBalance() {
  if (balanceLoading.value) return
  balanceLoading.value = true
  try {
    const { data } = await API.get('/payout/balance')
    balance.value = data?.balance ?? data?.amount ?? 0
  } catch {
    showToast('Impossible de récupérer le solde.', 'error')
  } finally {
    balanceLoading.value = false
  }
}

// ── Validation unique ─────────────────────────────────────────────────────────
function validateSingle() {
  clearErrors()
  let ok = true
  if (!single.payee_no || !/^\+\d{10,15}$/.test(single.payee_no)) {
    err.payee_no = 'Numéro invalide (ex: +2250102030407)'; ok = false
  }
  if (!single.client_name?.trim()) { err.client_name = 'Champ requis'; ok = false }
  if (!single.client_id?.trim())   { err.client_id   = 'Champ requis'; ok = false }
  if (!single.amount || single.amount < 1) { err.amount = 'Montant minimum : 1 XOF'; ok = false }
  if (!single.channel) { err.channel = 'Choisissez un canal'; ok = false }
  return ok
}

// ── Validation batch ──────────────────────────────────────────────────────────
function validateBatch() {
  clearErrors()
  let ok = true
  if (!batch.channel) { err.channel = 'Choisissez un canal'; ok = false }
  payeeErrors.value = payees.value.map(p => {
    const e = {}
    if (!p.payee_no || !/^\+\d{10,15}$/.test(p.payee_no)) e.payee_no = true
    if (!p.amount || p.amount < 1) e.amount = true
    return Object.keys(e).length ? e : null
  })
  if (payeeErrors.value.some(Boolean)) ok = false
  return ok
}

// ── Soumission unique ─────────────────────────────────────────────────────────
async function submitSingle() {
  if (!validateSingle()) return
  submitting.value = true
  try {
    const { data } = await API.post('/payout/transfer/single', {
      payee_no:       single.payee_no,
      amount:         single.amount,
      channel:        single.channel,
      client_name:    single.client_name,
      client_id:      single.client_id,
      payment_reason: single.payment_reason || undefined,
      reference_no:   single.reference_no   || undefined,
    })
    result.value = data
    if (data.status === 'SUCCEEDED') {
      showToast('Virement effectué avec succès !', 'success')
    } else {
      showToast(data.description || 'Échec du virement.', 'error')
    }
  } catch (e) {
    showToast('Erreur réseau. Réessayez.', 'error')
    console.error(e)
  } finally {
    submitting.value = false
  }
}

// ── Soumission batch ──────────────────────────────────────────────────────────
async function submitBatch() {
  if (!validateBatch()) return
  submitting.value = true
  try {
    const { data } = await API.post('/payout/transfer/batch', {
      channel:      batch.channel,
      reference_no: batch.reference_no || undefined,
      payees: payees.value.map(p => ({
        payee_no:       p.payee_no,
        amount:         p.amount,
        client_name:    p.client_name,
        client_id:      p.client_id,
        payment_reason: p.payment_reason || undefined,
      })),
    })
    result.value = data
    showToast(data.status === 'INITIATED' ? 'Lot soumis avec succès !' : data.description, data.status === 'INITIATED' ? 'success' : 'error')
  } catch (e) {
    showToast('Erreur réseau. Réessayez.', 'error')
    console.error(e)
  } finally {
    submitting.value = false
  }
}

// ── Vérifier statut depuis le modal ──────────────────────────────────────────
async function checkStatus() {
  if (!result.value) return
  try {
    let res
    if (result.value.sessionid) {
      res = await API.get(`/payout/transaction/${result.value.sessionid}/status`)
    } else {
      res = await API.get(`/payout/batch/${result.value.batchid}/status`)
    }
    result.value = { ...result.value, ...res.data }
  } catch {
    showToast('Impossible de vérifier le statut.', 'error')
  }
}

// ── Gestion des bénéficiaires ─────────────────────────────────────────────────
function addPayee() {
  payees.value.push({ payee_no: '', client_name: '', client_id: '', amount: null, payment_reason: '' })
}
function removePayee(i) { payees.value.splice(i, 1) }

// ── Import CSV ────────────────────────────────────────────────────────────────
// Format attendu : payee_no,client_name,client_id,amount,payment_reason
function importCsv() { csvInput.value?.click() }

function parseCsv(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ({ target }) => {
    const lines = target.result.trim().split('\n').slice(1) // skip header
    const imported = lines.map(line => {
      const [payee_no, client_name, client_id, amount, payment_reason] = line.split(',').map(s => s.trim())
      return { payee_no, client_name, client_id, amount: Number(amount) || 0, payment_reason: payment_reason || '' }
    }).filter(p => p.payee_no)
    payees.value.push(...imported)
    showToast(`${imported.length} bénéficiaire(s) importé(s).`, 'success')
  }
  reader.readAsText(file)
  e.target.value = ''
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  toast.value = { message, type }
  setTimeout(() => { toast.value = null }, 3800)
}
</script>

<style scoped>
/* Layout */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 16px;
}
.form-grid > *:last-child {
  grid-column: 1 / -1;
}
@media (max-width: 760px) {
  .form-grid { grid-template-columns: 1fr; }
  .form-grid > *:last-child { grid-column: 1; }
}

.form-section { display: flex; flex-direction: column; gap: 14px; }
.section-title { font-size: 11.5px; font-weight: 700; color: var(--text4); text-transform: uppercase; letter-spacing: .6px; margin-bottom: 2px; }

/* Fields */
.field { display: flex; flex-direction: column; gap: 5px; flex: 1; }
.field-row { display: flex; gap: 14px; }
@media (max-width: 500px) { .field-row { flex-direction: column; } }

.label { font-size: 12px; font-weight: 600; color: var(--text2); }
.req { color: var(--danger, #ef4444); }
.field-error { font-size: 11px; color: var(--danger, #ef4444); margin-top: 2px; }

/* Inputs */
.input {
  width: 100%;
  padding: 9px 11px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  font-size: 13px;
  font-family: inherit;
  transition: border-color .15s, box-shadow .15s;
  box-sizing: border-box;
}
.input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent); }
.input.input-error { border-color: var(--danger, #ef4444); }
.input.input-inline { padding: 6px 9px; font-size: 12.5px; border-radius: 6px; }

/* Prefix/suffix */
.input-prefix-wrap, .input-suffix-wrap { position: relative; display: flex; align-items: center; }
.input-prefix-wrap .input-prefix { position: absolute; left: 10px; font-size: 14px; pointer-events: none; }
.input-prefix-wrap .input { padding-left: 30px; }
.input-suffix-wrap .input { padding-right: 36px; }
.input-suffix-btn {
  position: absolute; right: 6px;
  background: none; border: none; cursor: pointer;
  color: var(--text4); display: flex; align-items: center;
  padding: 4px; border-radius: 4px;
  transition: color .12s, background .12s;
}
.input-suffix-btn:hover { color: var(--accent); background: var(--surface2); }

/* Canaux */
.channel-grid { display: flex; gap: 6px; flex-wrap: wrap; }
.channel-btn {
  display: flex; flex-direction: column; align-items: center;
  gap: 3px; padding: 7px 10px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  cursor: pointer;
  font-family: inherit;
  color: var(--text3);
  font-size: 12px;
  transition: border-color .12s, background .12s, color .12s;
  min-width: 56px;
}
.channel-btn:hover { border-color: var(--accent); color: var(--text); }
.channel-btn.active { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, transparent); color: var(--accent); font-weight: 600; }

/* Recap */
.recap-rows { display: flex; flex-direction: column; gap: 8px; }
.recap-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--text3); }
.recap-row span:last-child { font-weight: 500; color: var(--text2); }
.recap-total { padding-top: 10px; margin-top: 4px; border-top: 1px solid var(--border); }
.recap-total span { font-weight: 700 !important; color: var(--text) !important; font-size: 15px !important; }

/* Table utils */
.th { padding: 9px 12px; text-align: left; font-size: 11px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: .5px; white-space: nowrap; }
.row-error td { background: color-mix(in srgb, var(--danger, #ef4444) 5%, transparent); }

/* Solde pill */
.balance-pill {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px; border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  transition: border-color .12s, box-shadow .12s;
}
.balance-pill:hover { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 10%, transparent); }
.balance-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 3px color-mix(in srgb, #22c55e 20%, transparent);
  flex-shrink: 0;
}
.balance-pill.loading .balance-dot { background: var(--text4); box-shadow: none; animation: pulse .9s ease-in-out infinite alternate; }

/* Result modal */
.result-id {
  display: flex; flex-direction: column; gap: 3px;
  padding: 10px 14px; border-radius: 8px;
  background: var(--surface2);
  border: 1px solid var(--border);
  text-align: left;
}

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal-box { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 28px 32px; text-align: center; min-width: 320px; max-width: 90vw; box-shadow: 0 20px 60px rgba(0,0,0,.2); }

/* Toast */
.toast {
  position: fixed; bottom: 28px; right: 28px; z-index: 200;
  display: flex; align-items: center; gap: 10px;
  padding: 12px 18px; border-radius: 10px;
  font-size: 13px; font-weight: 500; color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: 0 8px 32px rgba(0,0,0,.18);
  max-width: 320px;
}
.toast-success { border-color: #22c55e; }
.toast-error   { border-color: var(--danger, #ef4444); }
.toast-enter-active, .toast-leave-active { transition: all .25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }

/* Spinner */
.spin {
  display: inline-block; width: 14px; height: 14px;
  border: 2px solid currentColor; border-right-color: transparent;
  border-radius: 50%; animation: spin .6s linear infinite; flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { from { opacity: .5; } to { opacity: 1; } }

/* Tab count (réutilise la classe du projet parent si dispo) */
.tab-count { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 5px; background: var(--surface2); border-radius: 20px; font-size: 10px; font-weight: 700; color: var(--text4); margin-left: 5px; font-family: var(--font-mono); }
.tab.active .tab-count { background: var(--accent); color: var(--accent-fg); }
</style>