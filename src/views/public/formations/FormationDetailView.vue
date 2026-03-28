<template>
  <div>

    <!-- ── LOADING ── -->
    <div v-if="loading" class="state-center">
      <div class="skeleton-hero"></div>
    </div>

    <!-- ── ERREUR ── -->
    <div v-else-if="error" class="state-center">
      <p style="color:var(--red)">{{ error }}</p>
      <button class="btn btn-primary btn-sm" @click="fetchFormation">Réessayer</button>
    </div>

    <!-- ── CONTENU ── -->
    <div v-else-if="f">

      <!-- Hero -->
      <div class="fd-hero"
        :style="{ background: `linear-gradient(135deg, ${f.cover_color || f.coverColor || '#4f46e5'} 0%, var(--surface) 100%)` }">
        <div class="container">
          <div class="fd-hero-inner">

            <!-- Colonne gauche -->
            <div class="fd-left">

              <!-- Fil d'Ariane -->
              <div class="pg-bc" style="margin-bottom:16px">
                <RouterLink to="/formations" class="bc-lnk">Formations</RouterLink>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span style="color:var(--text3)">{{ firstTagName }}</span>
              </div>

              <!-- Badges -->
              <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
                <span class="badge" :class="(f.is_free || f.isFree) ? 'badge-green' : 'badge-blue'">
                  {{ levelLabel(f.level) }}
                </span>
                <span v-if="f.badge" class="badge badge-orange">{{ badgeLabel(f.badge) }}</span>
              </div>

              <h1 class="fd-title">{{ f.title }}</h1>
              <p class="fd-subtitle">{{ f.subtitle }}</p>

              <!-- Tags -->
              <div v-if="f.tags && f.tags.length" class="fd-tags">
                <span v-for="tag in f.tags" :key="tag.id" class="tag-badge">{{ tag.name }}</span>
              </div>

              <!-- Stats -->
              <div class="fd-stats">
                <div class="fd-stat">
                  <div class="fd-stat-val">{{ f.students_count || f.students || 0 }}</div>
                  <div class="fd-stat-lbl">Étudiants</div>
                </div>
                <div class="fd-stat">
                  <div class="fd-stat-val">{{ f.rating || '—' }}/5</div>
                  <div class="fd-stat-lbl">Note</div>
                </div>
                <div class="fd-stat">
                  <div class="fd-stat-val">{{ totalLessons }}</div>
                  <div class="fd-stat-lbl">Leçons</div>
                </div>
                <div class="fd-stat">
                  <div class="fd-stat-val">{{ f.duration }}</div>
                  <div class="fd-stat-lbl">Durée</div>
                </div>
              </div>

              <!-- Instructeur -->
              <div class="fd-instructor">
                <div class="avatar avatar-lg"
                  style="background:var(--accent);color:var(--accent-fg);font-family:var(--font-mono)">
                  {{ instructorInitials }}
                </div>
                <div>
                  <div style="font-weight:700;font-size:15px;color:var(--text)">{{ instructorName }}</div>
                  <div style="font-size:13px;color:var(--text3)">{{ instructorBio }}</div>
                </div>
              </div>
            </div>

            <!-- Carte d'inscription -->
            <div class="fd-enroll card">

              <!-- Cover : image S3 si dispo, sinon couleur + emoji -->
              <div class="fe-cover" :style="f.image ? {} : { background: f.cover_color || f.coverColor || '#4f46e5' }">
                <img v-if="f.image" :src="f.image" :alt="f.title" class="fe-cover-img" />
                <div v-else style="font-size:72px">{{ firstTagEmoji }}</div>
              </div>

              <div class="fe-body">
                <div class="fe-price" :class="{ free: f.is_free || f.isFree }">
                  {{ (f.is_free || f.isFree) ? 'Gratuit' : f.price }}
                </div>
                <button class="btn btn-primary btn-lg" style="width:100%;justify-content:center;margin-bottom:10px"
                  @click="handleEnrollment(f)">
                  {{
                    f.is_enrolled
                      ? 'Continuer la formation'
                      : (f.is_free || f.isFree)
                        ? 'Commencer gratuitement'
                        : `S'inscrire — ${f.price}`
                  }}
                </button>
                <button class="btn btn-outline" style="width:100%;justify-content:center">
                  Aperçu gratuit
                </button>
                <div class="fe-includes">
                  <div class="fe-include-title">Cette formation inclut :</div>
                  <div v-for="inc in includes" :key="inc" class="fe-inc">
                    <span v-html="ICONS.check" style="color:var(--green)" />
                    {{ inc }}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- ── ONGLETS ── -->
      <div class="section">
        <div class="container">
          <div class="tabs">
            <button v-for="t in tabs" :key="t" class="tab" :class="{ active: activeTab === t }"
              @click="activeTab = t">{{ t }}</button>
          </div>

          <!-- PROGRAMME -->
          <div v-if="activeTab === 'Programme'">
            <h2 style="font-size:20px;font-weight:700;margin-bottom:20px">Programme de la formation</h2>
            <div v-if="!f.modules || f.modules.length === 0" class="state-center" style="padding:40px 0">
              <p style="color:var(--text3)">Aucun module disponible pour le moment.</p>
            </div>
            <div v-else class="modules-list">
              <div v-for="(mod, idx) in f.modules" :key="mod.id || idx" class="module-item card">
                <div class="module-header" @click="openModule = openModule === idx ? null : idx">
                  <div class="module-num">{{ String(idx + 1).padStart(2, '0') }}</div>
                  <div style="flex:1">
                    <div class="module-title">{{ mod.title }}</div>
                    <div class="module-meta">
                      {{ mod.lessons_count || (mod.lessons && mod.lessons.length) || 0 }} leçons
                      <template v-if="mod.duration"> · {{ mod.duration }}</template>
                    </div>
                  </div>
                  <span v-html="ICONS.chevdown"
                    :style="{ transform: openModule === idx ? 'rotate(180deg)' : '', transition: 'transform .2s' }" />
                </div>
                <div v-if="openModule === idx" class="module-lessons">
                  <template v-if="mod.lessons && mod.lessons.length">
                    <div v-for="lesson in mod.lessons" :key="lesson.id" class="lesson-row">
                      <span v-html="ICONS.play" style="color:var(--text4);width:14px;height:14px" />
                      <span>{{ lesson.title }}</span>
                      <span v-if="lesson.duration" style="margin-left:auto;font-size:12px;color:var(--text4)">{{
                        lesson.duration }}</span>
                    </div>
                  </template>
                  <template v-else>
                    <div v-for="j in (mod.lessons_count || 0)" :key="j" class="lesson-row">
                      <span v-html="ICONS.play" style="color:var(--text4);width:14px;height:14px" />
                      <span>Leçon {{ j }} — {{ mod.title }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- À PROPOS -->
          <div v-if="activeTab === 'À propos'" class="prose">
            <div v-if="f.description" v-html="renderedDescription"></div>
            <div v-else-if="f.about_content || f.about" v-html="f.about_content || f.about"></div>
            <div v-else v-html="aboutFallback"></div>
          </div>

          <!-- AVIS -->
          <div v-if="activeTab === 'Avis'">
            <div class="reviews-summary">
              <div class="rs-score">{{ f.rating || '—' }}</div>
              <div>
                <div class="stars" style="margin-bottom:4px">
                  <span v-for="i in 5" :key="i" v-html="ICONS.star"
                    :style="{ color: i <= Math.round(f.rating) ? '#f59e0b' : 'var(--text5)' }" />
                </div>
                <div style="font-size:13px;color:var(--text3)">{{ f.reviews_count || f.reviews || 0 }} avis</div>
              </div>
            </div>
            <div v-if="loadingReviews" class="state-center" style="padding:32px 0">
              <div class="skeleton-loading"></div>
            </div>
            <div v-else class="review-list">
              <div v-for="r in displayedReviews" :key="r.id || r.name" class="review-card card card-p">
                <div class="review-header">
                  <div class="avatar avatar-md" style="background:var(--surface2);color:var(--text2)">
                    {{ r.initials || (r.user && r.user.name ? r.user.name.charAt(0) : '?') }}
                  </div>
                  <div>
                    <div style="font-weight:600;font-size:14px">{{ r.name || (r.user && r.user.name) || 'Anonyme' }}
                    </div>
                    <div class="stars" style="margin-top:2px">
                      <span v-for="i in 5" :key="i" v-html="ICONS.star" style="width:12px;height:12px"
                        :style="{ color: i <= (r.stars || r.rating) ? '#f59e0b' : 'var(--text5)' }" />
                    </div>
                  </div>
                  <span style="margin-left:auto;font-size:12px;color:var(--text4)">{{ r.date || r.created_at_human || ''
                  }}</span>
                </div>
                <p style="font-size:13.5px;color:var(--text2);line-height:1.7;margin-top:10px">{{ r.text || r.body ||
                  r.content }}
                </p>
              </div>
              <div v-if="displayedReviews.length === 0"
                style="color:var(--text3);font-size:14px;text-align:center;padding:32px 0">Aucun avis pour le moment.
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
import API from '@/services/api'
import { ICONS } from '@/composables/icons'

export default {
  name: 'FormationDetailPage',
  components: { RouterLink },

  data() {
    return {
      f: null,
      apiReviews: [],
      activeTab: 'Programme',
      openModule: 0,
      tabs: ['Programme', 'À propos', 'Avis'],
      loading: true,
      loadingReviews: false,
      error: null,
      ICONS,

      includes: [
        'Accès à vie',
        'Projets réels téléchargeables',
        'Certificat de complétion',
        'Forum de support dédié',
        'Mises à jour gratuites',
        'Accès communauté Discord',
      ],

      aboutFallback: `
        <h2>À propos de cette formation</h2>
        <p>Cette formation a été conçue pour vous donner des compétences immédiatement applicables
        dans votre travail quotidien. Chaque module est construit autour d'un projet réel.</p>
        <h2>Ce que vous allez apprendre</h2>
        <ul>
          <li>Maîtriser les concepts fondamentaux et avancés</li>
          <li>Construire 3 projets complets de A à Z</li>
          <li>Appliquer les meilleures pratiques de l'industrie</li>
          <li>Déployer vos applications en production</li>
        </ul>
        <h2>Prérequis</h2>
        <p>Connaissance de base en programmation recommandée. Tous les outils nécessaires sont
        expliqués en début de formation.</p>
      `,

      fallbackReviews: [
        { initials: 'JD', name: 'Jean-Baptiste D.', stars: 5, date: 'Mars 2026', text: "Excellente formation, très pratique et bien structurée. J'ai pu trouver un emploi 2 mois après avoir terminé !" },
        { initials: 'AF', name: 'Aïcha Fofana', stars: 5, date: 'Fév 2026', text: 'Le formateur explique très bien, les exemples sont concrets et adaptés à la réalité africaine.' },
        { initials: 'PM', name: 'Paul Mbarga', stars: 4, date: 'Jan 2026', text: "Très bonne formation. J'aurais aimé plus d'exercices pratiques mais le contenu est de qualité." },
      ],
    }
  },

  computed: {
    slug() { return this.$route.params.slug },

    firstTagName() {
      if (this.f?.tags && this.f.tags.length > 0) return this.f.tags[0].name
      return 'Formation'
    },

    firstTagEmoji() {
      const map = { 'Web': '🌐', 'Data': '📊', 'DevOps': '⚙️', 'Mobile': '📱', 'Python': '🐍', 'JavaScript': '⚡', 'React': '⚛️', 'Node.js': '🟢', 'Vue.js': '💚', 'Laravel': '🔴' }
      return map[this.firstTagName] || '💻'
    },

    totalLessons() {
      if (!this.f) return 0
      if (!this.f.modules || this.f.modules.length === 0) return this.f.lessons_count || this.f.lessons || 0
      return this.f.modules.reduce((sum, m) => sum + (m.lessons_count || (m.lessons && m.lessons.length) || 0), 0)
    },

    instructorName() { return this.f?.instructor?.name || this.f?.instructor_name || '—' },
    instructorInitials() {
      if (this.f?.instructor?.initials) return this.f.instructor.initials
      const name = this.f?.instructor?.name || this.f?.instructor_name
      if (!name) return '?'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
    instructorBio() { return this.f?.instructor?.bio || this.f?.instructor_bio || '' },

    displayedReviews() { return this.apiReviews.length ? this.apiReviews : this.fallbackReviews },

    renderedDescription() {
      if (!this.f?.description) return ''
      let html = this.f.description
        .replace(/### (.*)/g, '<h3>$1</h3>')
        .replace(/## (.*)/g, '<h2>$1</h2>')
        .replace(/# (.*)/g, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/__([^_]*?)__/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/_([^_]*?)_/g, '<em>$1</em>')
        .replace(/\n- /g, '<li>')
        .replace(/^- /g, '<li>')
        .replace(/(<li>.*?)(?=\n|$)/g, '$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
      return `<p>${html}</p>`
    },
  },

  watch: {
    slug(newSlug) {
      if (newSlug) { this.f = null; this.apiReviews = []; this.fetchFormation() }
    },
    activeTab(tab) {
      if (tab === 'Avis' && this.apiReviews.length === 0) this.fetchReviews()
    },
  },

  methods: {
    levelLabel(l) {
      return { debutant: 'Débutant', intermediaire: 'Intermédiaire', professionnel: 'Professionnel' }[l?.toLowerCase()] || l
    },
    badgeLabel(b) {
      return { bestseller: 'Bestseller', popular: 'Populaire', new: 'Nouveau', featured: 'À la une' }[b?.toLowerCase()] || b
    },

    async fetchFormation() {
      this.loading = true; this.error = null
      try {
        const { data } = await API.get(`/v1/formations/${this.slug}`)
        this.f = data
      } catch (e) {
        this.error = e.response?.status === 404
          ? 'Formation introuvable.'
          : 'Impossible de charger la formation. Vérifiez votre connexion.'
      } finally {
        this.loading = false
      }
    },

    async handleEnrollment(f) {

      // 🚀 Redirection vers la préinscription avec le slug
      this.$router.push({
        name: 'preinscription',
        params: { slug: f.slug }
      });

      return;

      // --- le reste si tu réactives plus tard ---
      try {
        await API.post('/inscription', {
          formation_id: f.id
        });

        const res = await API.get(`/v1/formations/${f.slug}`);
        this.formation = res.data;

        f.is_enrolled = true;

      } catch (error) {
        console.error('Erreur inscription:', error);
      }
    },

    async fetchReviews() {
      this.loadingReviews = true
      try {
        const { data } = await API.get(`/v1/formations/${this.slug}/reviews`)
        this.apiReviews = Array.isArray(data) ? data : (data.data || [])
      } catch (e) {
        console.warn('fetchReviews (optionnel):', e.message)
      } finally {
        this.loadingReviews = false
      }
    },
  },

  created() { this.fetchFormation() },
}
</script>

<style scoped>
.state-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 80px 24px;
  text-align: center;
  color: var(--text3);
  font-size: 14px;
}

.skeleton-hero {
  width: 100%;
  height: 400px;
  background: linear-gradient(90deg, var(--surface2) 0%, var(--surface) 50%, var(--surface2) 100%);
  background-size: 200% 100%;
  animation: skeleton-loading 2s infinite;
  border-radius: 12px;
}

.skeleton-loading {
  width: 32px;
  height: 32px;
  background: linear-gradient(90deg, var(--surface2) 0%, var(--surface) 50%, var(--surface2) 100%);
  background-size: 200% 100%;
  animation: skeleton-loading 2s infinite;
  border-radius: 6px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0
  }

  100% {
    background-position: -200% 0
  }
}

.fd-hero {
  padding: 60px 0;
  border-bottom: 1px solid var(--border);
}

.fd-hero-inner {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 48px;
  align-items: start;
}

.fd-title {
  font-family: var(--font-alt);
  font-size: clamp(26px, 3.5vw, 38px);
  font-weight: 800;
  color: var(--text);
  letter-spacing: -.8px;
  line-height: 1.15;
  margin-bottom: 12px;
}

.fd-subtitle {
  font-size: 16px;
  color: var(--text3);
  margin-bottom: 12px;
  font-weight: 500;
}

.fd-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.tag-badge {
  display: inline-block;
  padding: 6px 12px;
  background: var(--surface2);
  color: var(--text2);
  border: 1px solid var(--border2);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.fd-stats {
  display: flex;
  gap: 28px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.fd-stat-val {
  font-size: 20px;
  font-weight: 800;
  font-family: var(--font-alt);
  color: var(--text);
}

.fd-stat-lbl {
  font-size: 12px;
  color: var(--text4);
}

.fd-instructor {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* Carte d'inscription */
.fd-enroll {
  overflow: hidden;
  position: sticky;
  top: 80px;
}

/* Cover — image ou couleur+emoji */
.fe-cover {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.fe-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.fe-body {
  padding: 20px;
}

.fe-price {
  font-size: 28px;
  font-weight: 800;
  font-family: var(--font-alt);
  color: var(--text);
  margin-bottom: 16px;
}

.fe-price.free {
  color: var(--green);
}

.fe-includes {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border2);
}

.fe-include-title {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: .5px;
  margin-bottom: 10px;
}

.fe-inc {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text2);
  margin-bottom: 7px;
}

.modules-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.module-item {
  overflow: hidden;
}

.module-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  cursor: pointer;
  transition: background .1s;
}

.module-header:hover {
  background: var(--surface2);
}

.module-num {
  width: 32px;
  height: 32px;
  background: var(--surface2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: var(--text3);
  font-family: var(--font-mono);
  flex-shrink: 0;
}

.module-title {
  font-size: 14.5px;
  font-weight: 600;
  color: var(--text);
}

.module-meta {
  font-size: 12px;
  color: var(--text4);
  margin-top: 2px;
}

.module-lessons {
  padding: 0 18px 14px;
  border-top: 1px solid var(--border2);
}

.lesson-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px solid var(--border2);
  font-size: 13px;
  color: var(--text2);
}

.lesson-row:last-child {
  border-bottom: none;
}

.reviews-summary {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.rs-score {
  font-size: 52px;
  font-weight: 800;
  font-family: var(--font-alt);
  color: var(--text);
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width:900px) {
  .fd-hero-inner {
    grid-template-columns: 1fr;
  }

  .fd-enroll {
    position: static;
  }
}
</style>