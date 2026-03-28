<template>
  <div>

    <!-- ── Header ── -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:16px">
      <div>
        <div style="font-family:var(--font-alt);font-size:20px;font-weight:700;color:var(--text)">Mes ventes</div>
        <div style="font-size:13px;color:var(--text3);margin-top:3px">
          {{ stats?.total_orders ?? 0 }} commande{{ stats?.total_orders !== 1 ? 's' : '' }} au total
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <select v-model="filterStatus" class="form-input" style="padding:7px 12px;max-width:150px" @change="fetchOrders">
          <option value="">Tous les statuts</option>
          <option value="paid">Payé</option>
          <option value="pending">En attente</option>
          <option value="cancelled">Annulé</option>
        </select>
        <select v-model="filterPeriod" class="form-input" style="padding:7px 12px;max-width:150px" @change="fetchOrders">
          <option value="">Toute période</option>
          <option value="7d">7 derniers jours</option>
          <option value="30d">30 derniers jours</option>
          <option value="90d">90 derniers jours</option>
        </select>
      </div>
    </div>

    <!-- ── Stats cards ── -->
    <div class="stats-grid" style="margin-bottom:24px">
      <div class="stat-card">
        <div class="stat-label">Revenus nets</div>
        <div class="stat-value stat-green">
          <template v-if="statsLoading"><div class="skel" style="width:100px;height:24px;border-radius:4px"/></template>
          <template v-else>{{ formatAmount(stats?.total_revenue) }} <span style="font-size:13px;font-weight:500">XOF</span></template>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Ventes payées</div>
        <div class="stat-value">
          <template v-if="statsLoading"><div class="skel" style="width:40px;height:24px;border-radius:4px"/></template>
          <template v-else>{{ stats?.paid_count ?? 0 }}</template>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">En attente</div>
        <div class="stat-value stat-orange">
          <template v-if="statsLoading"><div class="skel" style="width:40px;height:24px;border-radius:4px"/></template>
          <template v-else>{{ stats?.pending_count ?? 0 }}</template>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Commissions</div>
        <div class="stat-value stat-muted">
          <template v-if="statsLoading"><div class="skel" style="width:80px;height:24px;border-radius:4px"/></template>
          <template v-else>{{ formatAmount(stats?.total_commission) }} <span style="font-size:13px">XOF</span></template>
        </div>
      </div>
    </div>

    <!-- ── Table ── -->
    <div class="card" style="overflow:hidden">

      <!-- Loading skeleton -->
      <table v-if="loading" style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:1px solid var(--border);background:var(--surface2)">
            <th class="th">Ressource</th>
            <th class="th">Acheteur</th>
            <th class="th">Montant</th>
            <th class="th">Net</th>
            <th class="th">Statut</th>
            <th class="th">Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in 6" :key="n" style="border-bottom:1px solid var(--border2)">
            <td style="padding:12px 16px">
              <div style="display:flex;align-items:center;gap:10px">
                <div class="skel" style="width:38px;height:38px;border-radius:6px;flex-shrink:0"/>
                <div class="skel" style="width:140px;height:13px;border-radius:4px"/>
              </div>
            </td>
            <td style="padding:12px 16px"><div class="skel" style="width:110px;height:13px;border-radius:4px"/></td>
            <td style="padding:12px 16px"><div class="skel" style="width:80px;height:13px;border-radius:4px"/></td>
            <td style="padding:12px 16px"><div class="skel" style="width:70px;height:13px;border-radius:4px"/></td>
            <td style="padding:12px 16px"><div class="skel" style="width:60px;height:22px;border-radius:20px"/></td>
            <td style="padding:12px 16px"><div class="skel" style="width:90px;height:13px;border-radius:4px"/></td>
            <td style="padding:12px 16px"><div class="skel" style="width:28px;height:28px;border-radius:6px"/></td>
          </tr>
        </tbody>
      </table>

      <!-- Error -->
      <div v-else-if="error" style="text-align:center;padding:40px">
        <div style="font-size:28px;margin-bottom:8px">⚠️</div>
        <div style="font-size:14px;color:var(--text3);margin-bottom:16px">{{ error }}</div>
        <button class="btn btn-secondary btn-sm" @click="fetchOrders">Réessayer</button>
      </div>

      <!-- Empty -->
      <div v-else-if="orders.length === 0" style="text-align:center;padding:56px">
        <div style="font-size:36px;margin-bottom:12px">🛒</div>
        <div style="font-size:15px;font-weight:600;color:var(--text);margin-bottom:6px">Aucune vente</div>
        <div style="font-size:13px;color:var(--text3)">
          {{ filterStatus || filterPeriod ? 'Essaie un autre filtre.' : 'Tes ventes apparaîtront ici.' }}
        </div>
      </div>

      <!-- Table -->
      <table v-else style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:1px solid var(--border);background:var(--surface2)">
            <th class="th">Ressource</th>
            <th class="th">Acheteur</th>
            <th class="th">Montant</th>
            <th class="th">Net</th>
            <th class="th">Statut</th>
            <th class="th">Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="o in orders" :key="o.id"
            style="border-bottom:1px solid var(--border2);transition:background .08s"
            @mouseover="e => e.currentTarget.style.background='var(--surface2)'"
            @mouseleave="e => e.currentTarget.style.background=''"
          >
            <!-- Ressource -->
            <td style="padding:12px 16px">
              <div style="display:flex;align-items:center;gap:10px">
                <div style="width:38px;height:38px;border-radius:6px;flex-shrink:0;overflow:hidden;background:var(--surface2)">
                  <img v-if="o.resource?.image" :src="o.resource.image" style="width:100%;height:100%;object-fit:cover"/>
                  <div v-else style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:16px">📦</div>
                </div>
                <div style="min-width:0">
                  <div style="font-size:13px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px">
                    {{ o.resource?.title ?? '—' }}
                  </div>
                  <div style="font-size:11px;color:var(--text5);font-family:var(--font-mono)">
                    {{ o.transaction_id }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Acheteur -->
            <td style="padding:12px 16px">
              <div style="display:flex;align-items:center;gap:7px">
                <div class="avatar-xs">{{ initials(o.buyer?.name) }}</div>
                <div>
                  <div style="font-size:12.5px;font-weight:500;color:var(--text2)">{{ o.buyer?.name ?? '—' }}</div>
                  <div style="font-size:11px;color:var(--text5)">{{ o.buyer?.email ?? '' }}</div>
                </div>
              </div>
            </td>

            <!-- Montant -->
            <td style="padding:12px 16px;font-size:13px;color:var(--text2);font-weight:500;white-space:nowrap">
              {{ formatAmount(o.total) }} {{ o.currency }}
            </td>

            <!-- Net -->
            <td style="padding:12px 16px;font-size:13px;font-weight:700;white-space:nowrap" :style="{ color: o.status === 'paid' ? 'var(--success, #16a34a)' : 'var(--text4)' }">
              {{ formatAmount(o.net) }} {{ o.currency }}
            </td>

            <!-- Statut -->
            <td style="padding:12px 16px">
              <span class="status-badge" :class="'status-' + o.status">
                {{ statusLabel(o.status) }}
              </span>
            </td>

            <!-- Date -->
            <td style="padding:12px 16px;font-size:12.5px;color:var(--text3);white-space:nowrap">
              {{ formatDate(o.created_at) }}
            </td>

            <!-- Action -->
            <td style="padding:12px 16px">
              <button class="btn btn-ghost btn-sm btn-icon" title="Voir le détail" @click="openDetail(o)" v-html="ICONS.eye"/>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination && pagination.last_page > 1" style="padding:12px 16px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--border);background:var(--surface2)">
        <span style="font-size:12px;color:var(--text4)">
          Page {{ pagination.current_page }} / {{ pagination.last_page }}
        </span>
        <div style="display:flex;gap:4px">
          <button class="btn btn-ghost btn-sm" :disabled="pagination.current_page === 1" @click="goPage(pagination.current_page - 1)">←</button>
          <button class="btn btn-ghost btn-sm" :disabled="pagination.current_page === pagination.last_page" @click="goPage(pagination.current_page + 1)">→</button>
        </div>
      </div>
    </div>

    <!-- ── Modal détail ── -->
    <div v-if="detail" class="modal-overlay" @click.self="detail = null">
      <div class="modal-box">

        <!-- Header modal -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
          <div style="font-size:15px;font-weight:700;color:var(--text)">Détail de la vente</div>
          <button class="btn btn-icon btn-ghost btn-sm" @click="detail = null">✕</button>
        </div>

        <div v-if="detailLoading" style="text-align:center;padding:24px">
          <div class="spinner"/>
        </div>

        <template v-else-if="detailData">
          <!-- Ressource -->
          <div class="detail-section">
            <div class="detail-section-title">Ressource</div>
            <div style="display:flex;align-items:center;gap:12px">
              <div style="width:48px;height:48px;border-radius:8px;overflow:hidden;background:var(--surface2);flex-shrink:0">
                <img v-if="detailData.resource?.image" :src="detailData.resource.image" style="width:100%;height:100%;object-fit:cover"/>
                <div v-else style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:20px">📦</div>
              </div>
              <div>
                <div style="font-size:14px;font-weight:600;color:var(--text)">{{ detailData.resource?.title }}</div>
                <div style="font-size:12px;color:var(--text4)">{{ detailData.resource?.description?.slice(0,80) }}…</div>
              </div>
            </div>
          </div>

          <!-- Acheteur -->
          <div class="detail-section">
            <div class="detail-section-title">Acheteur</div>
            <div class="detail-rows">
              <div class="detail-row"><span>Nom</span><span>{{ detailData.buyer?.name ?? '—' }}</span></div>
              <div class="detail-row"><span>Email</span><span>{{ detailData.buyer?.email ?? '—' }}</span></div>
              <div class="detail-row"><span>Téléphone</span><span>{{ detailData.buyer?.phone ?? '—' }}</span></div>
            </div>
          </div>

          <!-- Transaction -->
          <div class="detail-section">
            <div class="detail-section-title">Transaction</div>
            <div class="detail-rows">
              <div class="detail-row">
                <span>Référence</span>
                <span style="font-family:var(--font-mono);font-size:11px">{{ detailData.transaction_id }}</span>
              </div>
              <div class="detail-row"><span>Montant total</span><span style="font-weight:700">{{ formatAmount(detailData.total) }} {{ detailData.currency }}</span></div>
              <div class="detail-row"><span>Commission</span><span style="color:var(--text4)">- {{ formatAmount(detailData.commission) }} {{ detailData.currency }}</span></div>
              <div class="detail-row">
                <span>Net reçu</span>
                <span style="font-weight:700;color:var(--success,#16a34a)">{{ formatAmount(detailData.net) }} {{ detailData.currency }}</span>
              </div>
              <div class="detail-row"><span>Méthode</span><span>{{ detailData.modereglement?.name ?? detailData.payment_method }}</span></div>
              <div class="detail-row">
                <span>Statut</span>
                <span class="status-badge" :class="'status-' + detailData.status">{{ statusLabel(detailData.status) }}</span>
              </div>
              <div class="detail-row"><span>Payé le</span><span>{{ detailData.paid_at ? formatDate(detailData.paid_at) : '—' }}</span></div>
              <div class="detail-row"><span>Créé le</span><span>{{ formatDate(detailData.created_at) }}</span></div>
            </div>
          </div>
        </template>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import API from '@/services/api'
import { ICONS } from '@/composables/icons'

// Ajoute l'icône eye si elle n'existe pas dans ton composable
ICONS.eye = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`

// ── État ──────────────────────────────────────────────────────────
const orders       = ref([])
const stats        = ref(null)
const pagination   = ref(null)
const loading      = ref(true)
const statsLoading = ref(true)
const error        = ref(null)
const filterStatus = ref('')
const filterPeriod = ref('')
const currentPage  = ref(1)

// Détail
const detail       = ref(null)
const detailData   = ref(null)
const detailLoading = ref(false)

// ── Fetch ─────────────────────────────────────────────────────────
async function fetchOrders(page = 1) {
  loading.value      = true
  statsLoading.value = true
  error.value        = null
  currentPage.value  = page

  try {
    const { data } = await API.get('/orders', {
      params: {
        status: filterStatus.value || undefined,
        period: filterPeriod.value || undefined,
        page,
      }
    })
    orders.value     = data.orders?.data ?? []
    stats.value      = data.stats
    pagination.value = data.orders ? {
      current_page: data.orders.current_page,
      last_page:    data.orders.last_page,
      total:        data.orders.total,
    } : null
  } catch (e) {
    error.value = 'Impossible de charger les ventes.'
    console.error(e)
  } finally {
    loading.value      = false
    statsLoading.value = false
  }
}

onMounted(() => fetchOrders())

function goPage(page) { fetchOrders(page) }

// ── Détail ────────────────────────────────────────────────────────
async function openDetail(order) {
  detail.value      = order
  detailData.value  = null
  detailLoading.value = true
  try {
    const { data } = await API.get(`/orders/${order.id}`)
    detailData.value = data
  } catch (e) {
    console.error(e)
  } finally {
    detailLoading.value = false
  }
}

// ── Helpers ───────────────────────────────────────────────────────
function statusLabel(s) {
  return { paid: 'Payé', pending: 'En attente', cancelled: 'Annulé' }[s] ?? s
}

function formatAmount(val) {
  return Number(val ?? 0).toLocaleString('fr-FR')
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function initials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}
</script>

<style scoped>
.th { padding: 9px 16px; text-align: left; font-size: 11px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: .5px; }

/* Stats */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
@media (max-width: 700px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 18px; }
.stat-label { font-size: 11.5px; color: var(--text4); font-weight: 600; text-transform: uppercase; letter-spacing: .4px; margin-bottom: 6px; }
.stat-value { font-size: 22px; font-weight: 800; color: var(--text); font-family: var(--font-alt); }
.stat-green  { color: #16a34a; }
.stat-orange { color: #d97706; }
.stat-muted  { color: var(--text3); font-size: 18px; }

/* Skeleton */
.skel { background: var(--surface2); animation: pulse .9s ease-in-out infinite alternate; }
@keyframes pulse { from { opacity: .5 } to { opacity: 1 } }

/* Avatar */
.avatar-xs { width: 26px; height: 26px; border-radius: 50%; background: var(--accent); color: var(--accent-fg); font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* Status badge */
.status-badge { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 20px; font-size: 11.5px; font-weight: 600; white-space: nowrap; }
.status-paid      { background: #dcfce7; color: #16a34a; }
.status-pending   { background: #fef9c3; color: #a16207; }
.status-cancelled { background: #fee2e2; color: #dc2626; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal-box { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 24px 28px; width: 100%; max-width: 500px; box-shadow: 0 20px 60px rgba(0,0,0,.2); max-height: 90vh; overflow-y: auto; }

/* Detail */
.detail-section { margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid var(--border2); }
.detail-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.detail-section-title { font-size: 11px; font-weight: 700; color: var(--text4); text-transform: uppercase; letter-spacing: .6px; margin-bottom: 10px; }
.detail-rows { display: flex; flex-direction: column; gap: 8px; }
.detail-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
.detail-row span:first-child { color: var(--text3); }
.detail-row span:last-child  { font-weight: 500; color: var(--text2); text-align: right; }

/* Spinner */
.spinner { width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin .7s linear infinite; margin: 0 auto; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>