<template>
  <div class="home">

    <!-- ══════════════════════════════
         HERO
    ══════════════════════════════ -->
    <section class="hero">
      <div class="container">

        <div class="hero-pill">
          <span class="pill-dot" />
          Créez un CV pro, développez vos compétences, avancez plus vite
        </div>

        <h1 class="hero-title">
          Crée ton CV.<br>
          Apprends.<br>
          <span class="hero-em">Progresse vite.</span>
        </h1>

        <p class="hero-desc">
          LBS réunit tout ce qu'il te faut pour évoluer professionnellement —
          un générateur de CV, des formations pratiques et des ressources digitales prêtes à l'emploi.
        </p>

        <div class="hero-actions">
          <RouterLink to="/register" class="btn-primary">
            Commencer gratuitement
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </RouterLink>
          <RouterLink to="/formations" class="btn-ghost">
            Voir les formations
          </RouterLink>
        </div>

        <div class="hero-trust">
          <div class="trust-avatars">
            <div v-for="m in trustMembers" :key="m.i" class="trust-av" :style="{ background: m.c }">{{ m.i }}</div>
          </div>
          <span class="trust-text"><strong>+2 000 membres</strong> actifs sur LBS</span>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════
         3 PILIERS
    ══════════════════════════════ -->
    <section class="pillars">
      <div class="container">
        <div class="pillars-grid">

          <RouterLink to="/cv-builder" class="pillar">
            <div class="pillar-num">01</div>
            <div class="pillar-icon">📝</div>
            <h3 class="pillar-title">Crée ton CV</h3>
            <p class="pillar-desc">
              Notre générateur produit un CV professionnel optimisé — prêt en quelques minutes, sans effort.
            </p>
            <span class="pillar-link">
              Générer mon CV
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </RouterLink>

          <RouterLink to="/formations" class="pillar">
            <div class="pillar-num">02</div>
            <div class="pillar-icon">🎓</div>
            <h3 class="pillar-title">Apprends</h3>
            <p class="pillar-desc">
              Des formations pratiques en dev, comptabilité, bureautique, design et marketing — créées par des pros du
              terrain.
            </p>
            <span class="pillar-link">
              Voir les formations
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </RouterLink>

          <RouterLink to="/product" class="pillar">
            <div class="pillar-num">03</div>
            <div class="pillar-icon">📦</div>
            <h3 class="pillar-title">Accède aux ressources</h3>
            <p class="pillar-desc">
              Templates, fichiers Excel, guides PDF, outils bureautiques — des ressources digitales prêtes à l'emploi
              pour aller plus vite.
            </p>
            <span class="pillar-link">
              Voir les ressources
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </RouterLink>

        </div>
      </div>
    </section>

    <!-- ══════════════════════════════
         AVIS — carousel auto-scroll
    ══════════════════════════════ -->
    <section class="reviews">
      <div class="reviews-header container">
        <p class="eyebrow">Ce qu'ils disent</p>
        <h2 class="section-title">Ils évoluent déjà sur LBS</h2>
      </div>

      <div class="carousel-wrap">
        <div class="carousel-track" ref="track">
          <div v-for="(r, i) in reviewsLoop" :key="i" class="review">
            <div class="review-stars">★★★★★</div>
            <p class="review-text">"{{ r.text }}"</p>
            <div class="review-author">
              <div class="review-av" :style="{ background: r.color }">{{ r.initials }}</div>
              <div>
                <div class="review-name">{{ r.name }}</div>
                <div class="review-role">{{ r.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════
         CTA — BILAN
    ══════════════════════════════ -->
    <section class="cta">
      <div class="container">
        <div class="cta-inner">

          <div class="cta-badge">Notre engagement</div>

          <div class="cta-content">
            <div class="cta-left">
              <h2 class="cta-title">
                Nous vous aidons à<br>
                <span class="cta-em">progresser vite.</span>
              </h2>
              <p class="cta-desc">
                Ressources, formations, outils — tout est pensé pour vous faire avancer concrètement,
                là où vous en êtes, avec ce dont vous avez besoin.
              </p>
              <RouterLink to="/bilan" class="cta-btn">
                Faire mon bilan
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </RouterLink>
            </div>

            <div class="cta-stats">
              <div class="cta-stat">
                <span class="stat-value">+2 000</span>
                <span class="stat-label">Membres actifs</span>
              </div>
              <div class="cta-stat">
                <span class="stat-value">50+</span>
                <span class="stat-label">Formations disponibles</span>
              </div>
              <div class="cta-stat">
                <span class="stat-value">100+</span>
                <span class="stat-label">Ressources & templates</span>
              </div>
              <div class="cta-stat">
                <span class="stat-value">1 min</span>
                <span class="stat-label">Pour générer un CV</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const trustMembers = [
  { i: 'KS', c: '#6366f1' }, { i: 'MN', c: '#ec4899' },
  { i: 'AF', c: '#f59e0b' }, { i: 'JB', c: '#06b6d4' },
  { i: 'CM', c: '#10b981' },
]

const reviews = [
  { name: 'Kouamé Serge', initials: 'KS', color: '#6366f1', role: 'Dev web — Abidjan', text: 'Mon CV était prêt en moins d\'une minute. Bluffant. J\'ai eu un entretien dès la semaine suivante.' },
  { name: 'Adjoua Bénédicte', initials: 'AB', color: '#ec4899', role: 'Assistante RH — Abidjan', text: 'Le générateur de CV est vraiment simple. J\'ai téléchargé le mien en 1 minute chrono, propre et pro.' },
  { name: 'Yao Koffi', initials: 'YK', color: '#0891b2', role: 'Comptable — Abidjan', text: 'La formation OHADA est super bien structurée. Enfin du contenu fait pour nous, les comptables ivoiriens.' },
  { name: 'Aya Traoré', initials: 'AT', color: '#10b981', role: 'Étudiante — Abidjan', text: 'J\'avais peur que ce soit compliqué, mais en 1 minute j\'avais un CV que mes amis m\'ont envié.' },
  { name: 'Konan Brice', initials: 'KB', color: '#f59e0b', role: 'Ingénieur réseau — Abidjan', text: 'Les ressources disponibles sont d\'un niveau pro. Le guide Cisco m\'a économisé beaucoup de temps.' },
  { name: 'N\'Guessan Prisca', initials: 'NP', color: '#8b5cf6', role: 'Juriste — Abidjan', text: 'CV généré en 1 minute, sobre et bien présenté. Exactement ce que je cherchais avant un entretien.' },
  { name: 'Amara Diallo', initials: 'AD', color: '#dc2626', role: 'Dev mobile — Dakar', text: 'Plateforme claire, contenu utile. La formation Vue.js est vraiment bien faite pour les débutants.' },
  { name: 'Fatou Ndiaye', initials: 'FN', color: '#ec4899', role: 'Comptable — Dakar', text: 'Le template plan comptable OHADA m\'a sauvé. Téléchargé, ouvert, utilisé — en 2 minutes.' },
  { name: 'Moussa Sow', initials: 'MS', color: '#6366f1', role: 'Chargé RH — Dakar', text: 'Mon CV était vieux et mal présenté. LBS m\'a permis d\'en avoir un nouveau en à peine 1 minute.' },
  { name: 'Aïssatou Baldé', initials: 'AB', color: '#059669', role: 'Marketing digital — Dakar', text: 'La formation SEO est pratique et directe. Pas de blabla, juste du concret applicable immédiatement.' },
  { name: 'Ibrahima Niang', initials: 'IN', color: '#0891b2', role: 'Développeur — Dakar', text: 'J\'ai trouvé sur LBS des ressources que je cherchais depuis longtemps. Tout est bien organisé.' },
  { name: 'Mariama Diallo', initials: 'MD', color: '#f59e0b', role: 'Étudiante en gestion — Dakar', text: 'Le CV généré en 1 minute était plus beau que celui que j\'avais mis des heures à faire sur Word.' },
  { name: 'Ousmane Mbaye', initials: 'OM', color: '#7c3aed', role: 'Administrateur sys — Dakar', text: 'Les ressources réseaux sont top. Du contenu solide, adapté au marché africain. Bravo à l\'équipe.' },
  { name: 'Rokhaya Fall', initials: 'RF', color: '#db2777', role: 'Assistante comptable — Dakar', text: 'Formation Sage X3 claire et bien expliquée. J\'ai enfin compris des points qui me bloquaient depuis des mois.' },
  { name: 'Binta Camara', initials: 'BC', color: '#10b981', role: 'Office manager — Dakar', text: 'Le template tableau de bord RH est exactement ce qu\'il me fallait. Prêt à l\'emploi, efficace.' },
  { name: 'Jean-Marc Yao', initials: 'JY', color: '#6366f1', role: 'Gestionnaire de projet — Abidjan', text: 'LBS centralise tout. CV, formations, ressources. Plus besoin de chercher ailleurs.' },
  { name: 'Clarisse Kouassi', initials: 'CK', color: '#ec4899', role: 'Designer — Abidjan', text: 'Mon CV généré en 1 minute était propre, structuré. J\'ai juste changé deux lignes et c\'était parfait.' },
  { name: 'Thierno Barry', initials: 'TB', color: '#0891b2', role: 'Étudiant en IT — Dakar', text: 'Des formations en français, accessibles et bien expliquées. Rare pour un contenu tech de cette qualité.' },
  { name: 'Inès Aka', initials: 'IA', color: '#d97706', role: 'Chargée de comm — Abidjan', text: 'La formation marketing digital est très complète. J\'ai appris plus en 2h qu\'en 3 semaines de recherche.' },
  { name: 'Cheikh Diouf', initials: 'CD', color: '#059669', role: 'Dev full-stack — Dakar', text: 'Le générateur de CV fait vraiment du bon travail. Résultat pro en moins d\'une minute, sans effort.' },
  { name: 'Patricia Gnagne', initials: 'PG', color: '#8b5cf6', role: 'Comptable — Abidjan', text: 'J\'utilise les templates Excel chaque semaine. Ils me font gagner un temps fou sur mes reportings.' },
  { name: 'Lamine Touré', initials: 'LT', color: '#dc2626', role: 'Formateur — Dakar', text: 'Les ressources pédagogiques sont solides. On voit que c\'est fait par des gens qui connaissent le terrain.' },
  { name: 'Sandrine Assomou', initials: 'SA', color: '#6366f1', role: 'Juriste d\'entreprise — Abidjan', text: 'CV en 1 minute avec un rendu vraiment professionnel. Je recommande à tous mes collègues.' },
  { name: 'Modou Sarr', initials: 'MS', color: '#ec4899', role: 'Analyste financier — Dakar', text: 'Le guide fiscalité sénégalaise est une vraie pépite. Clair, à jour, et directement applicable.' },
  { name: 'Estelle Brou', initials: 'EB', color: '#0891b2', role: 'RH — Abidjan', text: 'Interface simple, CV généré rapidement. Pas besoin de tutoriel, tout est intuitif.' },
  { name: 'Pape Diop', initials: 'PD', color: '#10b981', role: 'Technicien réseau — Dakar', text: 'Les ressources Cisco et Linux sont vraiment bien faites. Niveau pro, explications claires.' },
  { name: 'Nadège Kouakou', initials: 'NK', color: '#f59e0b', role: 'Assistante de direction — Abidjan', text: 'En 1 minute j\'avais un CV que j\'aurais mis des heures à faire. LBS m\'a vraiment rendu service.' },
  { name: 'Assane Gaye', initials: 'AG', color: '#7c3aed', role: 'Développeur Python — Dakar', text: 'La formation Python est structurée, progressive. Exactement ce qu\'il faut pour bien démarrer.' },
  { name: 'Carine Yapi', initials: 'CY', color: '#db2777', role: 'Étudiante — Abidjan', text: 'Génial. Mon CV en 1 minute, beau et professionnel. J\'ai montré ça à toute ma promo.' },
  { name: 'Boubacar Diallo', initials: 'BD', color: '#059669', role: 'Comptable — Conakry', text: 'Contenu de qualité, adapté à la réalité africaine. Pas du contenu copié-collé de l\'Occident.' },
  { name: 'Adjoua Sika', initials: 'AS', color: '#6366f1', role: 'Office manager — Abidjan', text: 'Les modèles Word et Excel sont propres et directement utilisables. Gain de temps énorme.' },
  { name: 'Mamadou Lamine Ba', initials: 'MB', color: '#0891b2', role: 'Dev web — Dakar', text: 'LBS c\'est la référence pour les pros africains. Formations sérieuses, ressources pratiques.' },
  { name: 'Virginie Koné', initials: 'VK', color: '#ec4899', role: 'Chargée de formation — Abidjan', text: 'Interface claire, contenu de qualité. Le CV généré en 1 min était vraiment à la hauteur.' },
  { name: 'Serigne Mbaye', initials: 'SM', color: '#d97706', role: 'Entrepreneur — Dakar', text: 'Les ressources de gestion sont très utiles pour mon activité. Du pratique, pas du théorique.' },
  { name: 'Élise Assoumou', initials: 'EA', color: '#10b981', role: 'Responsable admin — Abidjan', text: 'Formation Excel très bien détaillée. Mes collègues me demandent maintenant de leur enseigner.' },
  { name: 'Ibou Faye', initials: 'IF', color: '#8b5cf6', role: 'Ingénieur — Dakar', text: 'Bonne qualité de contenu, interface propre. On sent que c\'est fait avec sérieux.' },
  { name: 'Christiane Ble', initials: 'CB', color: '#dc2626', role: 'Secrétaire — Abidjan', text: 'Mon CV en 1 minute était tellement beau que j\'ai failli ne pas le reconnaître. Merci LBS !' },
  { name: 'Alioune Diagne', initials: 'AD', color: '#6366f1', role: 'IT manager — Dakar', text: 'Les ressources techniques sont solides. Je les partage systématiquement à mon équipe.' },
  { name: 'Madeleine Kouamé', initials: 'MK', color: '#059669', role: 'Assistante — Abidjan', text: 'Plateforme sérieuse, contenu utile. Le CV généré en 1 min est de qualité professionnelle.' },
  { name: 'Daouda Ndiaye', initials: 'DN', color: '#0891b2', role: 'Analyste — Dakar', text: 'Tout ce qu\'il faut pour progresser en un seul endroit. LBS répond à un vrai besoin africain.' },
]

const reviewsLoop = computed(() => [...reviews, ...reviews])

const track = ref(null)
let animFrame = null
let pos = 0

function animate() {
  if (!track.value) return
  pos += 0.4
  const half = track.value.scrollWidth / 2
  if (pos >= half) pos = 0
  track.value.style.transform = `translateX(-${pos}px)`
  animFrame = requestAnimationFrame(animate)
}

onMounted(() => { animFrame = requestAnimationFrame(animate) })
onUnmounted(() => { if (animFrame) cancelAnimationFrame(animFrame) })
</script>

<style scoped>
.home {
  background: #fff;
  color: #0a0a0a;
}

/* ══ CONTAINER ══ */
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40px;
}

/* ══ HERO ══ */
.hero {
  padding: 110px 0 90px;
  background: #fff;
  border-bottom: 1px solid #ebebeb;
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  border-radius: 99px;
  background: #f3f3f3;
  border: 1px solid #e5e5e5;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  letter-spacing: .3px;
  margin-bottom: 40px;
  font-family: var(--font-mono, monospace);
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {

  0%,
  100% {
    opacity: 1
  }

  50% {
    opacity: .3
  }
}

.hero-title {
  font-size: clamp(46px, 6.5vw, 82px);
  font-weight: 800;
  letter-spacing: -3.5px;
  line-height: 1.0;
  color: #0a0a0a;
  margin-bottom: 28px;
  font-family: var(--font-alt, sans-serif);
}

.hero-em {
  color: #bbb;
}

.hero-desc {
  font-size: 17px;
  color: #777;
  line-height: 1.8;
  max-width: 520px;
  margin-bottom: 44px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 52px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #0a0a0a;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 13px 22px;
  border-radius: 10px;
  text-decoration: none;
  transition: all .15s;
}

.btn-primary:hover {
  background: #222;
  transform: translateY(-1px);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #666;
  font-size: 14px;
  font-weight: 600;
  padding: 13px 22px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  text-decoration: none;
  transition: all .15s;
}

.btn-ghost:hover {
  color: #0a0a0a;
  border-color: #aaa;
}

.hero-trust {
  display: flex;
  align-items: center;
  gap: 10px;
}

.trust-avatars {
  display: flex;
}

.trust-av {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  margin-left: -7px;
}

.trust-av:first-child {
  margin-left: 0;
}

.trust-text {
  font-size: 13px;
  color: #aaa;
}

.trust-text strong {
  color: #444;
}

/* ══ PILLARS ══ */
.pillars {
  padding: 96px 0;
  background: #fff;
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  overflow: hidden;
}

.pillar {
  padding: 44px 36px;
  background: #fff;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e5e5e5;
  transition: background .15s;
}

.pillar:last-child {
  border-right: none;
}

.pillar:hover {
  background: #fafafa;
}

.pillar-num {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #d0d0d0;
  font-family: var(--font-mono, monospace);
  margin-bottom: 28px;
}

.pillar-icon {
  font-size: 30px;
  margin-bottom: 20px;
}

.pillar-title {
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -.5px;
  color: #0a0a0a;
  margin-bottom: 12px;
  font-family: var(--font-alt, sans-serif);
}

.pillar-desc {
  font-size: 14px;
  color: #777;
  line-height: 1.8;
  flex: 1;
  margin-bottom: 28px;
}

.pillar-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #0a0a0a;
  transition: gap .15s;
}

.pillar:hover .pillar-link {
  gap: 9px;
}

/* ══ REVIEWS CAROUSEL ══ */
.reviews {
  padding: 96px 0;
  background: #f5f5f5;
  overflow: hidden;
}

.reviews-header {
  margin-bottom: 52px;
}

.eyebrow {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #aaa;
  margin-bottom: 10px;
  font-family: var(--font-mono, monospace);
}

.section-title {
  font-size: clamp(28px, 3.5vw, 44px);
  font-weight: 800;
  color: #0a0a0a;
  letter-spacing: -1.5px;
  font-family: var(--font-alt, sans-serif);
}

.carousel-wrap {
  overflow: hidden;
  width: 100%;
  mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
}

.carousel-track {
  display: flex;
  gap: 16px;
  width: max-content;
  will-change: transform;
}

.review {
  background: #fff;
  border-radius: 14px;
  padding: 24px 22px;
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid #ebebeb;
}

.review-stars {
  color: #f59e0b;
  font-size: 12px;
  letter-spacing: 2px;
}

.review-text {
  font-size: 13.5px;
  color: #555;
  line-height: 1.75;
  flex: 1;
}

.review-author {
  display: flex;
  align-items: center;
  gap: 10px;
}

.review-av {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.review-name {
  font-size: 13px;
  font-weight: 700;
  color: #0a0a0a;
}

.review-role {
  font-size: 11px;
  color: #aaa;
}

/* ══ CTA BILAN ══ */
.cta {
  padding: 96px 0;
  background: #fff;
  border-top: 1px solid #ebebeb;
}

.cta-inner {
  background: #0a0a0a;
  border-radius: 20px;
  padding: 56px 60px;
  position: relative;
  overflow: hidden;
}

/* Grain décoratif */
.cta-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 80% 20%, rgba(255, 255, 255, .04) 0%, transparent 60%),
    radial-gradient(circle at 10% 80%, rgba(255, 255, 255, .03) 0%, transparent 50%);
  pointer-events: none;
}

.cta-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 99px;
  background: rgba(255, 255, 255, .08);
  border: 1px solid rgba(255, 255, 255, .12);
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, .45);
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: var(--font-mono, monospace);
  margin-bottom: 36px;
}

.cta-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 48px;
}

.cta-left {
  flex: 1;
  max-width: 460px;
}

.cta-title {
  font-size: clamp(30px, 3.5vw, 46px);
  font-weight: 800;
  color: #fff;
  letter-spacing: -2px;
  line-height: 1.1;
  margin-bottom: 18px;
  font-family: var(--font-alt, sans-serif);
}

.cta-em {
  color: rgba(255, 255, 255, .35);
}

.cta-desc {
  font-size: 15px;
  color: rgba(255, 255, 255, .5);
  line-height: 1.8;
  margin-bottom: 36px;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  color: #0a0a0a;
  font-size: 14px;
  font-weight: 700;
  padding: 13px 24px;
  border-radius: 10px;
  text-decoration: none;
  transition: all .15s;
}

.cta-btn:hover {
  background: #f0f0f0;
  transform: translateY(-1px);
}

.cta-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  flex-shrink: 0;
  width: 280px;
}

.cta-stat {
  background: rgba(255, 255, 255, .05);
  border: 1px solid rgba(255, 255, 255, .07);
  border-radius: 12px;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -1px;
  font-family: var(--font-alt, sans-serif);
}

.stat-label {
  font-size: 11.5px;
  color: rgba(255, 255, 255, .35);
  line-height: 1.4;
}

/* ══ RESPONSIVE ══ */
@media (max-width: 900px) {
  .pillars-grid {
    grid-template-columns: 1fr;
  }

  .pillar {
    border-right: none;
    border-bottom: 1px solid #e5e5e5;
  }

  .pillar:last-child {
    border-bottom: none;
  }

  .cta-inner {
    padding: 40px 32px;
  }

  .cta-content {
    flex-direction: column;
    gap: 36px;
  }

  .cta-stats {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .container {
    padding: 0 20px;
  }

  .hero {
    padding: 72px 0 60px;
  }

  .hero-title {
    font-size: 38px;
    letter-spacing: -2px;
  }

  .pillars,
  .reviews,
  .cta {
    padding: 64px 0;
  }

  .cta-inner {
    padding: 32px 24px;
  }

  .cta-stats {
    grid-template-columns: 1fr 1fr;
  }
}
</style>