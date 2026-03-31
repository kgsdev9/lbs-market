import { createRouter, createWebHashHistory } from '@ionic/vue-router'
import { useAuthStore } from '@/stores/auth'
import PublicLayout from '@/components/layout/PublicLayout.vue'

const routes = [
  // ── Auth (sans layout) ──
  { path: '/login', name: 'login', component: () => import('@/views/auth/LoginView.vue'), meta: { title: 'Connexion' } },
  { path: '/register', name: 'register', component: () => import('@/views/auth/RegisterView.vue'), meta: { title: 'Inscription' } },
  { path: '/forgot-password', name: 'forgot-password', component: () => import('@/views/auth/ForgotPasswordView.vue'), meta: { title: 'Mot de passe oublié' } },

  // ── Tout sous PublicLayout (public + dashboard) ──
  {
    path: '/',
    component: PublicLayout,
    children: [
      // ── Pages publiques ──
      { path: '', name: 'home', component: () => import('@/views/public/HomeView.vue'), meta: { title: 'Accueil' } },
      { path: 'product', name: 'product-digital', component: () => import('@/views/public/products/ProductListView.vue'), meta: { title: 'Produits digitaux' } },
      { path: 'product/:slug', name: 'product-detail', component: () => import('@/views/public/products/ProductDetailView.vue'), meta: { title: 'Détail produit' } },

      { path: 'articles', name: 'articles', component: () => import('@/views/public/articles/ArticlesView.vue'), meta: { title: 'Articles' } },
      { path: 'articles/:slug', name: 'article-detail', component: () => import('@/views/public/articles/ArticleDetailView.vue'), meta: { title: 'Article' } },

      { path: 'formations', name: 'formations', component: () => import('@/views/public/formations/FormationsView.vue'), meta: { title: 'Formations' } },
      { path: 'formations/:slug', name: 'formation-detail', component: () => import('@/views/public/formations/FormationDetailView.vue'), meta: { title: 'Formation' } },
      { path: 'formations/player/:slug', name: 'formation-player', component: () => import('@/views/public/formations/FormationPlayerView.vue'), meta: { title: 'Formation' } },

      { path: 'preinscription/:slug', name: 'preinscription', component: () => import('@/views/public/formations/PreinscriptionView.vue'), meta: { title: 'Préinscription' } },

      { path: 'projets', name: 'projets', component: () => import('@/views/public/projets/ProjetsView.vue'), meta: { title: 'Projets' } },
      { path: 'projets/:slug', name: 'projet-detail', component: () => import('@/views/public/projets/ProjetDetailView.vue'), meta: { title: 'Projet' } },

      { path: 'forum', name: 'forum', component: () => import('@/views/public/forum/ForumView.vue'), meta: { title: 'Forum' } },
      { path: 'communaute', name: 'communaute', component: () => import('@/views/public/CommunauteView.vue'), meta: { title: 'Communauté' } },

      {
        path: 'cv-builder',
        name: 'cv-builder',
        component: () => import('@/views/public/Cvgeneratorview.vue'),
        meta: { requiresAuth: true, title: 'Générateur de CV' }
      },

      {
        path: '/cv-mobile',
        name: 'cv-mobile',
        component: () => import('@/views/public/Cvmobileview.vue') ,
        meta: { layout: 'blank' } 
      },


      // ── Dashboard (protégé) ──
      { path: 'dashboard', name: 'dash-home', component: () => import('@/views/dashboard/DashHomeView.vue'), meta: { requiresAuth: true, title: 'Dashboard' } },

      { path: 'dashboard/articles', name: 'dash-articles', component: () => import('@/views/dashboard/articles/ArticlesListView.vue'), meta: { requiresAuth: true, title: 'Gestion Articles' } },
      { path: 'dashboard/articles/new', name: 'dash-article-new', component: () => import('@/views/dashboard/articles/ArticleEditorView.vue'), meta: { requiresAuth: true, title: 'Nouvel Article' } },
      { path: 'dashboard/articles/:id/edit', name: 'dash-article-edit', component: () => import('@/views/dashboard/articles/ArticleEditorView.vue'), meta: { requiresAuth: true, title: 'Modifier Article' } },

      { path: 'dashboard/ressources', name: 'dash-blog', component: () => import('@/views/dashboard/ressources/RessourceListView.vue'), meta: { requiresAuth: true, title: 'Ressources' } },
      { path: 'dashboard/ressources/new', name: 'dash-blog-new', component: () => import('@/views/dashboard/ressources/RessourceEditorView.vue'), meta: { requiresAuth: true, title: 'Nouvelle Ressource' } },
      { path: 'dashboard/ressources/:id/edit', name: 'dash-ressource-edit', component: () => import('@/views/dashboard/ressources/RessourceEditorView.vue'), props: true, meta: { requiresAuth: true, title: 'Modifier Ressource' } },

      { path: 'dashboard/enrollments', name: 'dash-enrollments', component: () => import('@/views/dashboard/enrollements/EnrollmentsListView.vue'), meta: { requiresAuth: true, title: 'Mes Cours' } },

      { path: 'dashboard/formations', name: 'dash-formations', component: () => import('@/views/dashboard/formations/FormationsListView.vue'), meta: { requiresAuth: true, title: 'Formations' } },
      { path: 'dashboard/formations/new', name: 'dash-formation-new', component: () => import('@/views/dashboard/formations/FormationEditorView.vue'), meta: { requiresAuth: true, title: 'Nouvelle Formation' } },
      { path: 'dashboard/formations/:id/edit', name: 'dash-formation-edit', component: () => import('@/views/dashboard/formations/FormationEditorView.vue'), props: true, meta: { requiresAuth: true, title: 'Modifier Formation' } },

      { path: 'dashboard/projets', name: 'dash-projets', component: () => import('@/views/dashboard/projets/ProjetsListView.vue'), meta: { requiresAuth: true, title: 'Projets' } },
      { path: 'dashboard/projets/new', name: 'dash-projet-new', component: () => import('@/views/dashboard/projets/ProjetEditorView.vue'), meta: { requiresAuth: true, title: 'Nouveau Projet' } },
      { path: 'dashboard/projets/:id/edit', name: 'dash-projet-edit', component: () => import('@/views/dashboard/projets/ProjetEditorView.vue'), meta: { requiresAuth: true, title: 'Modifier Projet' } },

      { path: 'dashboard/membres', name: 'dash-membres', component: () => import('@/views/dashboard/MembresView.vue'), meta: { requiresAuth: true, title: 'Membres' } },
      { path: 'dashboard/countries', name: 'dash-countries', component: () => import('@/views/dashboard/CountryView.vue'), meta: { requiresAuth: true, title: 'Pays' } },
      { path: 'dashboard/payment-methods', name: 'dash-payment-methods', component: () => import('@/views/dashboard/PaymentMethodsView.vue'), meta: { requiresAuth: true, title: 'Méthodes de paiement' } },
      { path: 'dashboard/configure-store', name: 'dash-configure-store', component: () => import('@/views/dashboard/boutiques/ConfigureStoreView.vue'), meta: { requiresAuth: true, title: 'Configurer boutique' } },
      { path: 'dashboard/tags', name: 'dash-tags', component: () => import('@/views/dashboard/TagsView.vue'), meta: { requiresAuth: true, title: 'Tags' } },
      { path: 'dashboard/ventes', name: 'dash-ventes', component: () => import('@/views/dashboard/VentesView.vue'), meta: { requiresAuth: true, title: 'Ventes' } },
      { path: 'dashboard/payouts', name: 'dash-payout-methods', component: () => import('@/views/dashboard/payouts/PayoutView.vue'), meta: { requiresAuth: true, title: 'Paiements' } },
      { path: 'dashboard/parametres', name: 'dash-params', component: () => import('@/views/dashboard/ParametresView.vue'), meta: { requiresAuth: true, title: 'Paramètres' } },

      // ── Payment return ──
      { path: 'payment/return', name: 'payment-return', component: () => import('@/views/PaymentReturn.vue'), meta: { title: 'Retour paiement' } },
    ]
  },

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// ── Guard ──
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  if ((to.name === 'login' || to.name === 'register') && auth.isLoggedIn) {
    return next({ name: 'dash-home' })
  }

  next()
})

export default router