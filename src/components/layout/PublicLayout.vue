<template>
  <div class="shell" :class="{ 'menu-open': mobileOpen }">

    <!-- ══════════════════════ HEADER ══════════════════════ -->
    <header class="nav">
      <div class="container nav-inner">

        <RouterLink to="/" class="nav-logo">
          <div class="logo-mark">LBS</div>
          <span class="logo-text">MARKET</span>
        </RouterLink>

        <nav class="nav-links">
          <RouterLink to="/cv-builder" active-class="active">Créer mon cv</RouterLink>
          <RouterLink to="/formations" active-class="active">Formations</RouterLink>
          <RouterLink to="/product" active-class="active">Marketplace</RouterLink>
          <RouterLink to="/articles" active-class="active">Articles</RouterLink>
        </nav>

        <div class="nav-right">
          <button class="btn btn-icon btn-ghost" @click="theme.toggle()">
            <span v-html="theme.isDark ? ICONS.sun : ICONS.moon" />
          </button>

          <template v-if="auth.isLoggedIn">
            <template v-if="isDashboard">
              <div class="umenu" v-click-outside="() => uopen = false">
                <button class="utrigger" @click="uopen = !uopen">
                  <div class="uavatar">{{ auth.user?.initials || 'KS' }}</div>
                  <div class="uinfo">
                    <span class="uname">{{ auth.user?.name || 'Mon compte' }}</span>
                    <span class="urole">{{ auth.user?.role || 'Admin' }}</span>
                  </div>
                  <svg class="chevron" :class="{ open: uopen }" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <Transition name="drop">
                  <div v-if="uopen" class="udropdown">
                    <div class="ud-head">
                      <div class="ud-name">{{ auth.user?.name || 'Mon compte' }}</div>
                      <div class="ud-email">{{ auth.user?.email || '' }}</div>
                    </div>
                    <div class="ud-body">

                      <RouterLink to="/dashboard/parametres" class="ud-item" @click="uopen = false">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="2">
                          <circle cx="12" cy="12" r="3" />
                          <path
                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l-.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        Paramètres
                      </RouterLink>
                    </div>
                    <div class="ud-foot">
                      <button class="ud-item logout" @click="doLogout">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </template>
            <template v-else>
              <RouterLink to="/dashboard" class="btn btn-secondary btn-sm">Dashboard</RouterLink>
            </template>
          </template>

          <template v-else>
            <RouterLink to="/login" class="btn btn-ghost btn-sm">Connexion</RouterLink>
            <RouterLink to="/register" class="btn btn-primary btn-sm">Rejoindre</RouterLink>
          </template>

          <button v-if="!isDashboard" class="burger" @click="mobileOpen = !mobileOpen">
            <span v-html="mobileOpen ? ICONS.x : ICONS.menu" />
          </button>
        </div>
      </div>

      <!-- Menu mobile public -->
      <div v-if="!isDashboard" class="mobile-menu" :class="{ open: mobileOpen }">
        <nav class="mobile-links">
          <RouterLink to="/cv-builder" @click="mobileOpen = false">Créer mon cv</RouterLink>
          <RouterLink to="/formations" @click="mobileOpen = false">Formations</RouterLink>
          <RouterLink to="/product" @click="mobileOpen = false">Marketplace</RouterLink>
          <RouterLink to="/articles" @click="mobileOpen = false">Articles</RouterLink>
          <div class="mobile-auth">
            <template v-if="auth.isLoggedIn">
              <RouterLink to="/dashboard" class="btn btn-secondary">Dashboard</RouterLink>
            </template>
            <template v-else>
              <RouterLink to="/login" class="btn btn-secondary">Connexion</RouterLink>
              <RouterLink to="/register" class="btn btn-primary">Rejoindre</RouterLink>
            </template>
          </div>
        </nav>
      </div>
    </header>

    <!-- ══════════════════════ DASHBOARD LAYOUT ══════════════════════ -->
    <template v-if="isDashboard">
      <div class="dash-layout">

        <!-- SIDEBAR -->
        <aside class="sidebar">
          <div class="sb-logo">
            <RouterLink to="/" class="sb-logo-link">
              <div class="logo-mark sm">LBS</div>
              <div>
                <div class="sb-logo-text">MARKET</div>
                <div class="sb-logo-sub">LBS</div>
              </div>
            </RouterLink>
          </div>

          <nav class="sb-nav">
            <span class="sb-section">Principal</span>
            <RouterLink to="/dashboard" class="sb-item" :class="{ active: route.name === 'dash-home' }">
              <span v-html="ICONS.dashboard" />Vue d'ensemble
            </RouterLink>
            <RouterLink to="/dashboard/enrollments" class="sb-item" active-class="active">
              <span v-html="ICONS.formation" />Mes Cours
            </RouterLink>
            <RouterLink to="/dashboard/parametres" class="sb-item" active-class="active">
              <span v-html="ICONS.settings" />Paramètres
            </RouterLink>

            <template v-if="isAdmin">
              <RouterLink to="/dashboard/articles" class="sb-item" active-class="active"><span
                  v-html="ICONS.article" />Articles</RouterLink>
              <RouterLink to="/dashboard/ventes" class="sb-item" active-class="active"><span v-html="ICONS.ventes" />Mes
                ventes</RouterLink>
              <RouterLink to="/dashboard/ressources" class="sb-item" active-class="active"><span
                  v-html="ICONS.book" />Produits</RouterLink>
              <RouterLink to="/dashboard/formations" class="sb-item" active-class="active"><span
                  v-html="ICONS.formation" />Formations</RouterLink>

              <span class="sb-section" style="margin-top:8px">Administration</span>
              <RouterLink to="/dashboard/membres" class="sb-item" active-class="active"><span
                  v-html="ICONS.users" />Membres</RouterLink>
              <RouterLink to="/dashboard/tags" class="sb-item" active-class="active"><span v-html="ICONS.tags" />Tags
              </RouterLink>
              <RouterLink to="/dashboard/countries" class="sb-item" active-class="active"><span
                  v-html="ICONS.pays" />Gestion des pays</RouterLink>
              <RouterLink to="/dashboard/payment-methods" class="sb-item" active-class="active"><span
                  v-html="ICONS.payment" />Modes de paiement</RouterLink>
            </template>
          </nav>

          <div class="sb-user">
            <div class="avatar avatar-md" style="background:var(--accent);color:var(--accent-fg)">{{ auth.user?.initials
              || 'KS'
              }}</div>
            <div class="sb-user-info">
              <div class="sb-uname">{{ auth.user?.name || 'Digi' }}</div>
              <div class="sb-urole">{{ auth.user?.role || 'Admin' }}</div>
            </div>
            <button class="sb-logout" @click="doLogout" title="Déconnexion" v-html="ICONS.logout" />
          </div>
        </aside>

        <!-- CONTENU DASHBOARD -->
        <main class="dash-main">
          <RouterView v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </main>

      </div>

      <!-- Bottom nav mobile dashboard -->
      <nav class="bottom-nav">
        <div class="bn-scroll">
          <RouterLink to="/dashboard" class="bn-item" :class="{ active: route.name === 'dash-home' }"><span
              v-html="ICONS.dashboard" /><span>Accueil</span></RouterLink>
          <RouterLink to="/dashboard/enrollments" class="bn-item" active-class="active"><span
              v-html="ICONS.formation" /><span>Mes Cours</span></RouterLink>
          <RouterLink to="/dashboard/parametres" class="bn-item" active-class="active"><span
              v-html="ICONS.settings" /><span>Paramètres</span></RouterLink>
          <template v-if="isAdmin">
            <RouterLink to="/dashboard/articles" class="bn-item" active-class="active"><span
                v-html="ICONS.article" /><span>Articles</span></RouterLink>
            <RouterLink to="/dashboard/ventes" class="bn-item" active-class="active"><span
                v-html="ICONS.ventes" /><span>Ventes</span></RouterLink>
            <RouterLink to="/dashboard/ressources" class="bn-item" active-class="active"><span
                v-html="ICONS.book" /><span>Produits</span></RouterLink>
            <RouterLink to="/dashboard/formations" class="bn-item" active-class="active"><span
                v-html="ICONS.formation" /><span>Formations</span></RouterLink>
            <RouterLink to="/dashboard/membres" class="bn-item" active-class="active"><span
                v-html="ICONS.users" /><span>Membres</span></RouterLink>
            <RouterLink to="/dashboard/tags" class="bn-item" active-class="active"><span
                v-html="ICONS.tags" /><span>Tags</span></RouterLink>
            <RouterLink to="/dashboard/countries" class="bn-item" active-class="active"><span
                v-html="ICONS.pays" /><span>Pays</span></RouterLink>
            <RouterLink to="/dashboard/payment-methods" class="bn-item" active-class="active"><span
                v-html="ICONS.payment" /><span>Paiements</span></RouterLink>
          </template>
        </div>
      </nav>
    </template>

    <!-- ══════════════════════ PUBLIC LAYOUT ══════════════════════ -->
    <template v-else>
      <main class="pub-main">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>

      <footer class="pub-footer">
        <div class="container">
          <div class="footer-row footer-top">
            <div class="footer-left">
              <div class="footer-logo">
                <div class="logo-mark">LBS</div>
                <span class="logo-text">MARKET</span>
              </div>
              <span class="footer-sep">—</span>
              <span class="footer-tagline">
                CV, compétences et opportunités — tout pour faire évoluer votre carrière.
              </span>
            </div>
            <RouterLink to="/privacy" class="footer-link">Politique de confidentialité →</RouterLink>
              <RouterLink to="/communaute" class="footer-link">Communauté →</RouterLink>
          </div>
          <div class="footer-row footer-bottom">
            <span>© 2026 LBS MARKET</span>
            <span>Développé par <strong>KGS Informatique</strong> 🇨🇮</span>
          </div>
        </div>
      </footer>
    </template>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import { ICONS } from '@/composables/icons'

const theme = useThemeStore()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const mobileOpen = ref(false)
const uopen = ref(false)

const isDashboard = computed(() => route.path.startsWith('/dashboard'))
const isAdmin = computed(() => auth.user?.role === 'admin')

function doLogout() { auth.logout(); router.push('/login') }

const vClickOutside = {
  mounted(el, binding) {
    el._out = (e) => { if (!el.contains(e.target)) binding.value(e) }
    document.addEventListener('click', el._out)
  },
  unmounted(el) { document.removeEventListener('click', el._out) },
}
</script>

<style scoped>
/* ═══════════════════════════════════════
   SHELL — colonne pleine hauteur
═══════════════════════════════════════ */
.shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ═══════════════════════════════════════
   HEADER
═══════════════════════════════════════ */
.nav {
  flex-shrink: 0;
  height: var(--nav-h);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  z-index: 200;
}

.nav-inner {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  text-decoration: none;
}

.logo-mark {
  width: 34px;
  height: 34px;
  background: var(--text);
  color: var(--bg);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  font-family: var(--font-mono);
  flex-shrink: 0;
}

.logo-mark.sm {
  width: 30px;
  height: 30px;
  font-size: 10px;
  border-radius: 7px;
}

.logo-text {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  font-family: var(--font-alt);
}

.nav-links {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 2px;
}

.nav-links a {
  padding: 6px 13px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text3);
  border-radius: var(--radius-sm);
  transition: all .12s;
  white-space: nowrap;
  text-decoration: none;
}

.nav-links a:hover {
  color: var(--text);
  background: var(--surface2);
}

.nav-links a.active {
  color: var(--text);
  font-weight: 600;
}

.nav-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.burger {
  display: none;
  background: none;
  border: none;
  color: var(--text2);
  cursor: pointer;
  padding: 4px;
  align-items: center;
  justify-content: center;
}

/* Menu mobile */
.mobile-menu {
  overflow: hidden;
  max-height: 0;
  transition: max-height .28s ease;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.mobile-menu.open {
  max-height: 600px;
}

.mobile-links {
  display: flex;
  flex-direction: column;
  padding: 16px 24px 20px;
  gap: 2px;
}

.mobile-links a {
  padding: 10px 12px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text2);
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: all .12s;
}

.mobile-links a:hover {
  background: var(--surface2);
  color: var(--text);
}

.mobile-auth {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

/* User menu dropdown */
.umenu {
  position: relative;
}

.utrigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px 5px 5px;
  border-radius: 99px;
  border: 1px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  transition: all .15s;
}

.utrigger:hover {
  background: var(--surface2);
  border-color: var(--border2);
}

.uavatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--accent-fg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  font-family: var(--font-mono);
  flex-shrink: 0;
}

.uinfo {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.uname {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.2;
}

.urole {
  font-size: 10.5px;
  color: var(--text4);
  line-height: 1.2;
  text-transform: capitalize;
}

.chevron {
  color: var(--text4);
  transition: transform .2s;
  flex-shrink: 0;
}

.chevron.open {
  transform: rotate(180deg);
}

.udropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 210px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .1);
  overflow: hidden;
  z-index: 300;
}

.ud-head {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
}

.ud-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 2px;
}

.ud-email {
  font-size: 11.5px;
  color: var(--text4);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ud-body {
  padding: 6px;
}

.ud-foot {
  padding: 6px;
  border-top: 1px solid var(--border);
}

.ud-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text2);
  text-decoration: none;
  transition: all .1s;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}

.ud-item:hover {
  background: var(--surface2);
  color: var(--text);
}

.ud-item.logout {
  color: var(--text3);
}

.ud-item.logout:hover {
  background: rgba(220, 38, 38, .08);
  color: #ef4444;
}

.ud-item svg {
  opacity: .6;
  flex-shrink: 0;
}

.ud-item:hover svg {
  opacity: 1;
}

/* ═══════════════════════════════════════
   DASHBOARD LAYOUT — sidebar + contenu
═══════════════════════════════════════ */
.dash-layout {
  display: flex;
  flex-direction: row;
  height: calc(100vh - var(--nav-h));
  overflow: hidden;
}

/* SIDEBAR */
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: none;
}

.sidebar::-webkit-scrollbar {
  display: none;
}

.sb-logo {
  padding: 16px 14px 12px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.sb-logo-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.sb-logo-text {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.2;
}

.sb-logo-sub {
  font-size: 10px;
  color: var(--text4);
}

.sb-nav {
  padding: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.sb-section {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .6px;
  text-transform: uppercase;
  color: var(--text5);
  padding: 12px 8px 4px;
}

.sb-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text3);
  text-decoration: none;
  transition: background .1s, color .1s;
}

.sb-item:hover {
  background: var(--surface2);
  color: var(--text);
}

.sb-item.active {
  background: var(--surface2);
  color: var(--text);
  font-weight: 600;
}

.sb-item span:first-child {
  display: flex;
  flex-shrink: 0;
  opacity: .55;
}

.sb-item.active span:first-child,
.sb-item:hover span:first-child {
  opacity: 1;
}

.sb-user {
  border-top: 1px solid var(--border);
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
}

.sb-user-info {
  flex: 1;
  min-width: 0;
}

.sb-uname {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sb-urole {
  font-size: 11px;
  color: var(--text4);
  text-transform: capitalize;
}

.sb-logout {
  background: none;
  border: none;
  color: var(--text4);
  cursor: pointer;
  padding: 4px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  transition: background .1s, color .1s;
}

.sb-logout:hover {
  background: var(--surface2);
  color: var(--red, #dc2626);
}

/* CONTENU DASHBOARD */
.dash-main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: 28px 32px 60px;
  scrollbar-width: thin;
}

/* ═══════════════════════════════════════
   PUBLIC LAYOUT
═══════════════════════════════════════ */
.pub-main {
  flex: 1;
}

/* ═══════════════════════════════════════
   FOOTER
═══════════════════════════════════════ */
.pub-footer {
  background: var(--text);
  color: rgba(255, 255, 255, .5);
  padding: 20px 0;
}

.footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.footer-top {
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, .08);
  margin-bottom: 14px;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.footer-logo .logo-mark {
  background: rgba(255, 255, 255, .12);
  color: #fff;
  width: 28px;
  height: 28px;
  font-size: 10px;
}

.footer-logo .logo-text {
  color: #fff;
  font-size: 13px;
}

.footer-sep {
  color: rgba(255, 255, 255, .2);
  flex-shrink: 0;
}

.footer-tagline {
  font-size: 13px;
  color: rgba(255, 255, 255, .4);
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.footer-link {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, .65);
  white-space: nowrap;
  transition: color .12s;
  flex-shrink: 0;
}

.footer-link:hover {
  color: #fff;
}

.footer-bottom {
  font-size: 12.5px;
}

/* ═══════════════════════════════════════
   TRANSITIONS
═══════════════════════════════════════ */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .15s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drop-enter-active,
.drop-leave-active {
  transition: opacity .15s, transform .15s;
}

.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ═══════════════════════════════════════
   BOTTOM NAV — mobile dashboard
═══════════════════════════════════════ */
.bottom-nav {
  display: none;
}

/* ═══════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════ */
@media (max-width: 960px) {
  .nav-links {
    display: none;
  }
}

@media (max-width: 768px) {
  .shell {
    height: auto;
    overflow: visible;
  }

  .burger {
    display: flex;
  }

  /* Sidebar cachée sur mobile */
  .sidebar {
    display: none;
  }

  /* Layout dashboard en colonne */
  .dash-layout {
    flex-direction: column;
    overflow: visible;
  }

  .dash-main {
    padding: 16px 16px 80px;
    overflow: visible;
  }

  /* Cacher les infos texte user trigger */
  .uinfo,
  .chevron {
    display: none;
  }

  .utrigger {
    padding: 4px;
    border-radius: 50%;
  }

  /* Bottom nav */
  .bottom-nav {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 200;
    background: var(--surface);
    border-top: 1px solid var(--border);
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  .bn-scroll {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    /* indicateur discret qu'on peut scroller */
    padding: 0 4px;
  }

  .bn-scroll::-webkit-scrollbar {
    display: none;
  }

  .bn-item {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: 10px 14px;
    color: var(--text4);
    font-size: 10px;
    font-weight: 500;
    text-decoration: none;
    transition: color .12s;
    white-space: nowrap;
  }

  .bn-item span:first-child {
    display: flex;
  }

  .bn-item span:first-child svg {
    width: 20px;
    height: 20px;
    opacity: .5;
  }

  .bn-item.active {
    color: var(--text);
  }

  .bn-item.active span:first-child svg {
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .footer-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .footer-left {
    flex-wrap: wrap;
    gap: 8px;
  }

  .footer-tagline {
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
  }

  .footer-sep {
    display: none;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .nav-right .btn:not(.btn-icon):not(.burger) {
    display: none;
  }
}
</style>
