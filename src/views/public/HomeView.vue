<template>
  <main class="home">

    <!-- ══════════════════════════════
         HERO — EMPLOYMENT & CV FOCUS
    ══════════════════════════════ -->
    <section class="hero-coming">
      <div class="container hero-inner">

        <!-- Left side — Content -->
        <div class="hero-left">
          <div class="section-tag">100+ entreprises partenaires</div>

          <h1 class="hero-title">
            Décrochez l'emploi<br>
            qu'il vous faut.
          </h1>

          <p class="hero-desc">
            Un CV professionnel en quelques minutes. Des offres d'emploi exclusives avec nos partenaires. 
            Tout ce qu'il faut pour trouver votre prochain défi.
          </p>

          <!-- CTA Button -->
          <RouterLink to="/cv-builder" class="btn-primary-hero">
            Je débute mon CV
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </RouterLink>

          <!-- Social proof -->
          <div class="proof">
            <div class="proof-icon">✓</div>
            <p class="proof-text"><strong>100+ offres d'emploi</strong> disponibles maintenant dans la région</p>
          </div>
        </div>

        <!-- Right side — Woman in circle + floating status cards -->
        <div class="hero-right">
          <div class="illustration">
            <!-- Circular woman image -->
          <div class="hero-circle">
             <img src="@/assets/images/banner.png" alt="Carrière Pro Plus" />
            </div>


            <!-- Floating status cards -->
            <div class="status-card status-1">
              <div class="status-icon">📧</div>
              <div class="status-label">Candidature</div>
            </div>

            <div class="status-card status-2">
              <div class="status-icon">🤝</div>
              <div class="status-label">Entretien</div>
            </div>

            <div class="status-card status-3">
              <div class="status-icon">✓</div>
              <div class="status-label">Recruté</div>
            </div>

            <!-- Background overlay -->
            <div class="ill-bg" />
          </div>
        </div>

      </div>
    </section>



    <!-- ══════════════════════════════
         SERVICES SECTION — 4 PILLARS FOR PROFESSIONALS
    ══════════════════════════════ -->
    <section class="services-section">
      <div class="container">
        <div class="services-header">
          <h2>Tout ce qu'il faut pour réussir</h2>
          <p class="services-tagline">Le succès avec Carrière Pro Plus</p>
        </div>

        <div class="services-grid">
          <RouterLink to="/emploi" class="service-card">
            <div class="service-num">01</div>
            <div class="service-icon">💼</div>
            <h3>Offres d'emploi</h3>
            <p>Accédez à des postes exclusifs en CDI, CDD, stages et missions. 100+ entreprises partenaires vous attendent.</p>
            <span class="service-link">Voir les offres →</span>
          </RouterLink>

          <RouterLink to="/cv-builder" class="service-card">
            <div class="service-num">02</div>
            <div class="service-icon">📝</div>
            <h3>CV Pro optimisé</h3>
            <p>Générez un CV professionnel en quelques minutes. Optimisé ATS et prêt à impressionner les recruteurs.</p>
            <span class="service-link">Créer mon CV →</span>
          </RouterLink>

          <RouterLink to="/formations" class="service-card">
            <div class="service-num">03</div>
            <div class="service-icon">🎓</div>
            <h3>Formations pratiques</h3>
            <p>Montez en compétences avec nos formations en leadership, tech, finance et management. Animées par des experts.</p>
            <span class="service-link">Voir les formations →</span>
          </RouterLink>

          <RouterLink to="/product" class="service-card">
            <div class="service-num">04</div>
            <div class="service-icon">📦</div>
            <h3>Ressources professionnelles</h3>
            <p>Templates, guides, fichiers prêts à l'emploi. Tous les outils pour progresser rapidement dans votre carrière.</p>
            <span class="service-link">Accéder aux ressources →</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════
         TRUST & BRANDING SECTION
    ══════════════════════════════ -->
    <section class="trust-section">
      <div class="container">
        <h2>Carrière Pro Plus en chiffres</h2>
        <p class="trust-intro">Partenaires locaux et startups tech en Côte d'Ivoire</p>

        <div class="trust-grid">
          <div class="trust-stat">
            <div class="trust-n">100+</div>
            <div class="trust-l">Entreprises partenaires</div>
            <p>KGS Informatique SARL, MOYO CI, TechHub CI, Digital Studios, Startups Abidjan, Consulting Local, IT Solutions...</p>
          </div>
          <div class="trust-stat">
            <div class="trust-n">+2 000</div>
            <div class="trust-l">Candidats accompagnés</div>
            <p>Développeurs, designers, managers et professionnels placés en CDI/CDD/missions</p>
          </div>
          <div class="trust-stat">
            <div class="trust-n">96%</div>
            <div class="trust-l">Taux de satisfaction</div>
            <p>Nos candidats recommandent Carrière Pro Plus à leurs pairs</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════
         TESTIMONIALS CAROUSEL
    ══════════════════════════════ -->
    <section class="testimonials-section">
      <div class="container">
        <h2>Témoignages de nos candidats</h2>
        
        <div class="carousel-wrap">
          <div class="carousel-track" ref="track">
            <div v-for="(r, i) in reviewsLoop" :key="i" class="testimonial-card">
              <div class="testimonial-stars">★★★★★</div>
              <p class="testimonial-text">"{{ r.text }}"</p>
              <div class="testimonial-author">
                <div class="testimonial-av" :style="{ background: r.color }">{{ r.initials }}</div>
                <div>
                  <div class="testimonial-name">{{ r.name }}</div>
                  <div class="testimonial-role">{{ r.role }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════
         STATS BAND
    ══════════════════════════════ -->
    <section class="stats-band">
      <div class="container stats-inner">
        <div class="stat-item">
          <span class="stat-n">+100</span>
          <span class="stat-l">Entreprises partenaires</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-n">+2 000</span>
          <span class="stat-l">Candidats accompagnés</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-n">50+</span>
          <span class="stat-l">Formations</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-n">96%</span>
          <span class="stat-l">Satisfaction</span>
        </div>
      </div>
    </section>

  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const email = ref('')
const subscribeMessage = ref('')
const subscribeStatus = ref('')

// Removed email subscription - using CTA button instead

const reviews = [
  // Tech/Startup success stories
  { name: 'Adjoua Kouassi', initials: 'AK', color: '#1A56DB', role: 'Développeuse Full-Stack · KGS Informatique',
    text: 'KGS m\'a contactée directement via CPP. Un CDI en informatique au bout de 2 semaines. Parfait !' },
  { name: 'Moussa Sanogo', initials: 'MS', color: '#0A7C52', role: 'Product Manager · MOYO CI',
    text: 'MOYO a besoin de talents. CPP m\'a aidé à préparer mon entretien et j\'ai eu le poste !' },
  { name: 'Bintou Traoré', initials: 'BT', color: '#C07000', role: 'Data Analyst · Startup Abidjan',
    text: 'Plateforme sérieuse avec des offres tech vraies. Mon rêve de data scientist réalisé en 1 mois.' },
  { name: 'Konan Brice', initials: 'KB', color: '#7C3AED', role: 'DevOps Engineer · TechHub CI',
    text: 'CPP connait les vrais besoins du marché tech ivoirien. Les offres correspondent vraiment.' },
  { name: 'Aya N\'Guessan', initials: 'AN', color: '#C8291A', role: 'Designer UX · Digital Agency',
    text: 'Accompagnement de qualité pour préparer mon portefeuille. Maintenant je bosse en télétravail.' },
  { name: 'Ibrahim Koné', initials: 'IK', color: '#0891b2', role: 'Business Analyst · Consulting Local',
    text: 'CPP m\'a aidé à valoriser mes 5 ans d\'expérience. Nouvel emploi plus senior, meilleur salaire.' },
  { name: 'Clarisse Beugré', initials: 'CB', color: '#ec4899', role: 'Marketing Manager · E-Commerce CI',
    text: 'Les offres d\'emploi sont réelles et pas de scam. Très différent d\'autres plateformes.' },
  { name: 'Yao Kouamé', initials: 'YK', color: '#059669', role: 'Backend Developer · KGS Informatique',
    text: 'KGS recrute régulièrement via CPP. Excellente équipe, très bon environnement de travail.' },
  { name: 'Mariam Touré', initials: 'MT', color: '#f59e0b', role: 'HR Manager · Startup Tech',
    text: 'Je recommande CPP à tous les candidats. Les offres sont sérieuses et bien rémunérées.' },
  { name: 'Patrick Assi', initials: 'PA', color: '#8b5cf6', role: 'Frontend Developer · Digital Studio',
    text: 'CV optimisé + formations = résultats. J\'ai eu 3 offres en 1 mois, choisi la meilleure.' },
  
  // More local success stories
  { name: 'Fatou Diallo', initials: 'FD', color: '#dc2626', role: 'Project Manager · MOYO CI',
    text: 'MOYO se développe vite. CPP nous aide à trouver les bons talents. Partenariat gagnant.' },
  { name: 'Serge Konaté', initials: 'SK', color: '#6366f1', role: 'QA Engineer · TechStart Abidjan',
    text: 'Formations + CV optimisé = combo gagnant. Maintenant senior QA dans une bonne boîte.' },
  { name: 'Estelle Kouadio', initials: 'EK', color: '#db2777', role: 'Content Manager · Digital Agency',
    text: 'Plateforme locale qui comprend le marché CI. Pas de bullshit, du sérieux.' },
  { name: 'Daouda Bamba', initials: 'DB', color: '#0891b2', role: 'Systems Admin · IT Solutions',
    text: 'CPP m\'a permis de rester en Côte d\'Ivoire avec un bon salaire. Vraiment utile.' },
  { name: 'Nadège Ahouré', initials: 'NA', color: '#10b981', role: 'Business Developer · Startup',
    text: 'Les offres d\'emploi sont pas du vent. Vraies boîtes, vrais postes, vrais salaires.' },
  { name: 'Victor Mensah', initials: 'VM', color: '#f97316', role: 'CTO · KGS Informatique',
    text: 'Nous recrutons via CPP. Qualité des candidats excellente. À recommander.' },
  { name: 'Pauline Mensah', initials: 'PM', color: '#ec4899', role: 'Product Designer · Digital Studio',
    text: 'Design thinking + bonne plateforme = succès. Je bosse sur des projets sympas maintenant.' },
  { name: 'Jean-Marie Gogo', initials: 'JG', color: '#3b82f6', role: 'Sales Manager · Tech Company',
    text: 'CPP connait bien le marché ivoirien. Les offres sont ciblées et sérieuses.' },
  { name: 'Aissatou Traore', initials: 'AT', color: '#f59e0b', role: 'Formateur Tech · Bootcamp Local',
    text: 'Je conseille CPP à mes étudiants. Excellente plateforme pour débuter sa carrière tech.' },
  { name: 'Kouassi Alphonse', initials: 'KA', color: '#06b6d4', role: 'CTO · MOYO CI',
    text: 'MOYO recrute via CPP. Effectivement des candidats motivés et compétents. Très satisfait.' },
]

const reviewsLoop = computed(() => [...reviews, ...reviews])

function dummy() {
  // No longer needed
}

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
:root {
  --navy: #1c2b4a;
  --gold: #d4a634;
  --navy-light: #243558;
  --navy-bg: #edf0f5;
}

.home {
  background: #fff;
  color: var(--navy);
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40px;
}

/* ══ HERO COMING SOON ══ */
.hero-coming {
  padding: 100px 0 80px;
  background: linear-gradient(135deg, var(--navy-bg) 0%, #fff 100%);
  border-bottom: 1px solid #e5e5e5;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.section-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--navy);
  background: rgba(212, 166, 52, .1);
  padding: 4px 12px;
  border-radius: 99px;
  margin-bottom: 24px;
}

.hero-title {
  font-size: clamp(40px, 5vw, 62px);
  font-weight: 800;
  letter-spacing: -2.5px;
  line-height: 1.08;
  color: var(--navy);
  margin-bottom: 20px;
}

.hero-desc {
  font-size: 17px;
  color: #666;
  line-height: 1.75;
  max-width: 500px;
  margin-bottom: 40px;
}

.newsletter-form {
  margin-bottom: 36px;
}

.btn-primary-hero {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #243558;
  color: #fff;
  border: none;
  padding: 14px 28px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all .2s;
  text-decoration: none;
  margin-bottom: 36px;
}

.btn-primary-hero:hover {
  background: #1c2b4a;
  transform: translateY(-2px);
}

.form-group {
  display: flex;
  gap: 8px;
}

.form-input {
  flex: 1;
  padding: 13px 18px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
  background: #fff;
  transition: all .2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--navy);
  box-shadow: 0 0 0 3px rgba(28, 43, 74, .08);
}

.form-input::placeholder {
  color: #bbb;
}

.btn-notify {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--navy);
  color: #fff;
  border: none;
  padding: 13px 28px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all .2s;
  white-space: nowrap;
}

.btn-notify:hover {
  background: var(--navy-light);
  transform: translateY(-2px);
}

.form-message {
  font-size: 13px;
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  text-align: center;
}

.form-message.success {
  color: #059669;
  background: rgba(5, 150, 105, .1);
}

.form-message.error {
  color: #dc2626;
  background: rgba(220, 38, 38, .1);
}

.proof {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(212, 166, 52, .08);
  border-radius: 10px;
  width: fit-content;
}

.proof-icon {
  font-size: 20px;
}

.proof-text {
  font-size: 13px;
  color: #666;
}

.proof-text strong {
  color: var(--navy);
  font-weight: 700;
}

/* ══ ILLUSTRATION ══ */
.hero-right {
  position: relative;
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.illustration {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Circular woman image */
.hero-circle {
  position: absolute;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  background: #fff;
  border: 4px solid var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  box-shadow: 0 30px 80px rgba(28, 43, 74, .2);
}

.hero-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Background overlay */
.ill-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(212, 166, 52, .06) 0%, rgba(28, 43, 74, .02) 100%);
  border-radius: 20px;
  z-index: 0;
}

/* Floating status cards */
.status-card {
  position: absolute;
  background: #fff;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .1);
  z-index: 3;
  transition: all .3s ease-out;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, .15);
  border-color: var(--gold);
}

.status-icon {
  font-size: 20px;
  min-width: 24px;
  text-align: center;
}

.status-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--navy);
  white-space: nowrap;
}

/* Card positions */
.status-1 {
  top: 30px;
  left: 20px;
  animation: float1 3s ease-in-out infinite;
}

.status-2 {
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  animation: float2 3.5s ease-in-out infinite;
}

.status-3 {
  bottom: 40px;
  right: 50px;
  animation: float3 4s ease-in-out infinite;
}

/* Floating animations */
@keyframes float1 {
  0%, 100% { transform: translateY(0) }
  50% { transform: translateY(-15px) }
}

@keyframes float2 {
  0%, 100% { transform: translateY(-50%) }
  50% { transform: translateY(calc(-50% - 15px)) }
}

@keyframes float3 {
  0%, 100% { transform: translateY(0) }
  50% { transform: translateY(-15px) }
}

/* ══ SERVICES ══ */
.services-section {
  padding: 80px 0;
  background: #fff;
}

.services-header {
  text-align: center;
  margin-bottom: 60px;
}

.services-header h2 {
  font-size: 36px;
  font-weight: 800;
  color: var(--navy);
  margin-bottom: 8px;
}

.services-tagline {
  font-size: 16px;
  color: #666;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.service-card {
  padding: 32px 24px;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  text-align: center;
  transition: all .2s;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  border-color: var(--gold);
  box-shadow: 0 8px 24px rgba(212, 166, 52, .15);
  transform: translateY(-4px);
}

.service-num {
  font-size: 12px;
  font-weight: 700;
  color: #d0d0d0;
  letter-spacing: 1.5px;
  margin-bottom: 16px;
}

.service-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.service-card h3 {
  font-size: 17px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 8px;
}

.service-card p {
  font-size: 13.5px;
  color: #666;
  line-height: 1.6;
  flex: 1;
  margin-bottom: 16px;
}

.service-link {
  font-size: 13px;
  font-weight: 700;
  color: var(--navy);
  transition: gap .15s;
}

.service-card:hover .service-link {
  color: var(--gold);
}

/* ══ TRUST ══ */
.trust-section {
  padding: 80px 0;
  background: var(--navy-bg);
}

.trust-section h2 {
  font-size: 36px;
  font-weight: 800;
  text-align: center;
  color: var(--navy);
  margin-bottom: 8px;
}

.trust-intro {
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 48px;
}

.trust-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  text-align: center;
}

.trust-stat {
  padding: 32px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e5e5;
}

.trust-n {
  font-size: 44px;
  font-weight: 800;
  color: var(--gold);
  margin-bottom: 8px;
}

.trust-l {
  font-size: 16px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 8px;
}

.trust-stat p {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

/* ══ TESTIMONIALS ══ */
.testimonials-section {
  padding: 80px 0;
  background: #fff;
}

.testimonials-section h2 {
  font-size: 36px;
  font-weight: 800;
  text-align: center;
  color: var(--navy);
  margin-bottom: 48px;
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

.testimonial-card {
  background: var(--navy-bg);
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  padding: 24px 22px;
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.testimonial-stars {
  color: var(--gold);
  font-size: 12px;
  letter-spacing: 2px;
}

.testimonial-text {
  font-size: 13.5px;
  color: var(--navy);
  line-height: 1.75;
  flex: 1;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 10px;
}

.testimonial-av {
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

.testimonial-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--navy);
}

.testimonial-role {
  font-size: 11px;
  color: #999;
}

/* ══ STATS BAND ══ */
.stats-band {
  padding: 56px 0;
  background: #fff;
  border-top: 1px solid #e5e5e5;
}

.stats-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
  min-width: 130px;
}

.stat-n {
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -2px;
  color: var(--navy);
  line-height: 1;
}

.stat-l {
  font-size: 13px;
  color: #888;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: #e5e5e5;
}

/* ══ RESPONSIVE ══ */
@media (max-width: 1024px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .hero-right {
    height: 300px;
  }

  .features-grid,
  .services-grid,
  .trust-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 20px;
  }

  .hero-coming {
    padding: 60px 0 40px;
  }

  .hero-inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero-right {
    display: none;
  }

  .hero-title {
    font-size: 36px;
    letter-spacing: -1.5px;
  }

  .form-group {
    flex-direction: column;
  }

  .btn-notify {
    width: 100%;
    justify-content: center;
  }

  /* SERVICES MOBILE — Full width stacked */
  .services-section {
    padding: 60px 0;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .service-card {
    padding: 24px 20px;
    border-radius: 12px;
  }

  .service-num {
    font-size: 11px;
    margin-bottom: 12px;
  }

  .service-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .service-card h3 {
    font-size: 15px;
    margin-bottom: 6px;
  }

  .service-card p {
    font-size: 13px;
    margin-bottom: 12px;
  }

  .service-link {
    font-size: 12px;
  }

  /* TRUST MOBILE */
  .trust-section {
    padding: 60px 0;
  }

  .trust-grid {
    grid-template-columns: 1fr;
  }

  .trust-stat {
    padding: 24px;
  }

  /* TESTIMONIALS MOBILE */
  .testimonials-section {
    padding: 60px 0;
  }

  .testimonials-section h2 {
    font-size: 28px;
    margin-bottom: 36px;
  }

  .testimonial-card {
    width: 280px;
    padding: 20px 18px;
  }

  /* STATS MOBILE */
  .stats-inner {
    gap: 24px;
  }

  .stat-divider {
    display: none;
  }

  .stat-n {
    font-size: 32px;
  }

  .stat-l {
    font-size: 12px;
  }
}
</style>