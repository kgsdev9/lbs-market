<template>
  <div class="return-wrap">

    <!-- Chargement (court instant au montage) -->
    <div v-if="loading" class="return-card">
      <div class="spinner-lg"/>
      <div class="return-title">Vérification du paiement…</div>
      <div class="return-sub">Merci de patienter quelques secondes.</div>
    </div>

    <!-- ✅ Succès — responsecode = "0" -->
    <div v-else-if="isPaid" class="return-card">
      <div class="status-icon">✅</div>
      <div class="return-title">Paiement confirmé !</div>
      <div class="return-sub">Votre commande a été enregistrée avec succès.</div>
      <div class="order-recap">
        <div class="recap-row">
          <span>Référence</span>
          <span class="mono">{{ reference }}</span>
        </div>
        <div class="recap-row">
          <span>Statut</span>
          <span class="badge badge-success">Payé</span>
        </div>
      </div>
      <div class="return-actions">
        <RouterLink to="/dashboard" class="btn btn-primary">Mon espace</RouterLink>
        <RouterLink to="/" class="btn btn-ghost">Retour à l'accueil</RouterLink>
      </div>
    </div>

    <!-- ❌ Échec — responsecode = "-1" -->
    <div v-else-if="isFailed" class="return-card">
      <div class="status-icon">❌</div>
      <div class="return-title">Paiement échoué</div>
      <div class="return-sub">La transaction a été annulée ou refusée.</div>
      <div class="order-recap">
        <div class="recap-row">
          <span>Référence</span>
          <span class="mono">{{ reference }}</span>
        </div>
        <div class="recap-row">
          <span>Statut</span>
          <span class="badge badge-failed">Annulé</span>
        </div>
      </div>
      <div class="return-actions">
        <RouterLink to="/" class="btn btn-primary">Réessayer</RouterLink>
        <RouterLink to="/" class="btn btn-ghost">Retour à l'accueil</RouterLink>
      </div>
    </div>

    <!-- ⚠️ Référence manquante -->
    <div v-else class="return-card">
      <div class="status-icon">⚠️</div>
      <div class="return-title">Paramètres manquants</div>
      <div class="return-sub">Impossible de déterminer le statut du paiement.</div>
      <RouterLink to="/" class="btn btn-ghost">Retour à l'accueil</RouterLink>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
const loading = ref(true)

// Lit directement les paramètres passés par Laravel dans l'URL
const reference    = ref(route.query.reference    ?? null)
const responsecode = ref(route.query.responsecode ?? null)

// responsecode "0"  → payé
// responsecode "-1" → échoué / annulé
const isPaid   = computed(() => responsecode.value === '0')
const isFailed = computed(() => responsecode.value === '-1' || responsecode.value !== null && !isPaid.value)

onMounted(() => {
  // Simule un court instant de chargement pour l'UX
  setTimeout(() => { loading.value = false }, 600)
})
</script>

<style scoped>
.return-wrap {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.return-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 40px 36px;
  text-align: center;
  max-width: 440px;
  width: 100%;
  box-shadow: 0 8px 40px rgba(0,0,0,.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.status-icon  { font-size: 40px; }
.return-title { font-size: 18px; font-weight: 700; color: var(--text); }
.return-sub   { font-size: 13.5px; color: var(--text3); }

.order-recap {
  width: 100%;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}
.recap-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}
.recap-row span:first-child { color: var(--text3); }
.mono { font-family: var(--font-mono); font-size: 12px; color: var(--text2); font-weight: 600; }

.badge {
  display: inline-flex; align-items: center;
  padding: 2px 10px; border-radius: 20px;
  font-size: 11.5px; font-weight: 700;
}
.badge-success { background: #dcfce7; color: #16a34a; }
.badge-failed  { background: #fee2e2; color: #dc2626; }

.return-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 8px;
}

.spinner-lg {
  width: 40px; height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>