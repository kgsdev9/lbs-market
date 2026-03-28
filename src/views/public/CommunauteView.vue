<template>
  <div class="communaute">

    <!-- ══════════════════════════════
         HERO
    ══════════════════════════════ -->
    <section class="hero">
      <div class="container">

        <div class="hero-pill">
          <span class="pill-dot" />
          Qui sommes-nous ?
        </div>

        <h1 class="hero-title">
          Une plateforme pensée<br>
          <span class="hero-em">pour les talents africains.</span>
        </h1>

        <p class="hero-desc">
          Que vous soyez débutant ou professionnel, LBS Market vous donne les outils pour créer un CV solide,
          apprendre des compétences utiles et saisir des opportunités.
        </p>

      </div>
    </section>

    <!-- ══════════════════════════════
         MISSION
    ══════════════════════════════ -->
    <section class="mission">
      <div class="container">
        <div class="mission-grid">

          <div class="mission-block">
            <div class="block-num">01</div>
            <h3 class="block-title">Notre mission</h3>
            <p class="block-desc">
              Que vous soyez débutant ou expérimenté, notre mission est simple :
              vous donner les outils pour construire votre profil, développer vos compétences
              et saisir de meilleures opportunités.
            </p>
          </div>

          <div class="mission-block">
            <div class="block-num">02</div>
            <h3 class="block-title">Notre approche</h3>
            <p class="block-desc">
              Des formations, des ressources et un générateur de CV conçus pour vous aider à créer votre profil,
              développer vos compétences et saisir de meilleures opportunités.
            </p>
          </div>

          <div class="mission-block">
            <div class="block-num">03</div>
            <h3 class="block-title">Notre Partenaire</h3>
            <p class="block-desc">
              Avec Carrière Pro Plus, spécialiste du recrutement, et KGS Informatique, agence de développement, profitez
              de ressources et d’outils pour créer votre CV et booster vos compétences.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- ══════════════════════════════
         STATS
    ══════════════════════════════ -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-val">+2 000</span>
            <span class="stat-lbl">Membres actifs</span>
          </div>
          <div class="stat-item">
            <span class="stat-val">10+</span>
            <span class="stat-lbl">Formations disponibles</span>
          </div>
          <div class="stat-item">
            <span class="stat-val">10+</span>
            <span class="stat-lbl">Ressources & templates</span>
          </div>
          <div class="stat-item">
            <span class="stat-val">1 min</span>
            <span class="stat-lbl">Pour générer un CV pro</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════
         CTA
    ══════════════════════════════ -->
    <section class="cta">
      <div class="container">
        <div class="cta-inner">
          <div class="cta-badge">Rejoindre LBS</div>
          <h2 class="cta-title">
            Prêt à progresser<br>
            <span class="cta-em">avec les bons outils ?</span>
          </h2>
          <p class="cta-desc">
            Crée ton compte gratuitement et accède à tout — CV, formations, ressources digitales.
          </p>
          <RouterLink to="/register" class="cta-btn">
            Commencer gratuitement
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </RouterLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.communaute {
  background: #fff;
  color: #0a0a0a;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40px;
}

/* ══ HERO ══ */
.hero {
  padding: 100px 0 80px;
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
  font-size: clamp(38px, 5.5vw, 68px);
  font-weight: 800;
  letter-spacing: -3px;
  line-height: 1.05;
  color: #0a0a0a;
  margin-bottom: 24px;
  font-family: var(--font-alt, sans-serif);
  max-width: 700px;
}

.hero-em {
  color: #bbb;
}

.hero-desc {
  font-size: 17px;
  color: #777;
  line-height: 1.8;
  max-width: 520px;
}

/* ══ MISSION ══ */
.mission {
  padding: 96px 0;
  background: #fff;
}

.mission-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  overflow: hidden;
}

.mission-block {
  padding: 44px 36px;
  border-right: 1px solid #e5e5e5;
}

.mission-block:last-child {
  border-right: none;
}

.block-num {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #d0d0d0;
  font-family: var(--font-mono, monospace);
  margin-bottom: 28px;
}

.block-title {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -.5px;
  color: #0a0a0a;
  margin-bottom: 14px;
  font-family: var(--font-alt, sans-serif);
}

.block-desc {
  font-size: 14px;
  color: #777;
  line-height: 1.85;
}

/* ══ STATS ══ */
.stats-section {
  padding: 72px 0;
  background: #f5f5f5;
  border-top: 1px solid #ebebeb;
  border-bottom: 1px solid #ebebeb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: #e5e5e5;
  border-radius: 16px;
  overflow: hidden;
}

.stat-item {
  background: #f5f5f5;
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-val {
  font-size: 36px;
  font-weight: 800;
  color: #0a0a0a;
  letter-spacing: -1.5px;
  font-family: var(--font-alt, sans-serif);
}

.stat-lbl {
  font-size: 13px;
  color: #999;
}

/* ══ CTA ══ */
.cta {
  padding: 96px 0;
  background: #fff;
}

.cta-inner {
  background: #0a0a0a;
  border-radius: 20px;
  padding: 72px 60px;
  position: relative;
  overflow: hidden;
  max-width: 680px;
}

.cta-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 90% 10%, rgba(255, 255, 255, .05) 0%, transparent 55%);
  pointer-events: none;
}

.cta-badge {
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 99px;
  background: rgba(255, 255, 255, .08);
  border: 1px solid rgba(255, 255, 255, .12);
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, .4);
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: var(--font-mono, monospace);
  margin-bottom: 28px;
}

.cta-title {
  font-size: clamp(28px, 3.5vw, 44px);
  font-weight: 800;
  color: #fff;
  letter-spacing: -2px;
  line-height: 1.1;
  margin-bottom: 16px;
  font-family: var(--font-alt, sans-serif);
}

.cta-em {
  color: rgba(255, 255, 255, .3);
}

.cta-desc {
  font-size: 15px;
  color: rgba(255, 255, 255, .45);
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

/* ══ RESPONSIVE ══ */
@media (max-width: 900px) {
  .mission-grid {
    grid-template-columns: 1fr;
  }

  .mission-block {
    border-right: none;
    border-bottom: 1px solid #e5e5e5;
  }

  .mission-block:last-child {
    border-bottom: none;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cta-inner {
    padding: 48px 36px;
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
    font-size: 34px;
    letter-spacing: -2px;
  }

  .mission,
  .cta {
    padding: 64px 0;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cta-inner {
    padding: 36px 24px;
  }
}
</style>