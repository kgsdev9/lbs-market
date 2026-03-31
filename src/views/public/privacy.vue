<template>
  <div class="privacy">

    <!-- ══════════════════════════════
         HERO
    ══════════════════════════════ -->
    <section class="hero">
      <div class="container">

        <div class="hero-pill">
          <span class="pill-dot" />
          Politique de confidentialité
        </div>

        <h1 class="hero-title">
          Vos données.<br>
          <span class="hero-em">Votre contrôle.</span>
        </h1>

        <p class="hero-desc">
          Chez LBS Market, la protection de vos données personnelles est une priorité.
          Cette page explique quelles informations nous collectons, pourquoi et comment nous les utilisons.
        </p>

      </div>
    </section>

    <!-- ══════════════════════════════
         INTRO
    ══════════════════════════════ -->
    <section class="section">
      <div class="container narrow">
        <p class="text">
          LBS Market est une plateforme dédiée à la création de CV, à l’apprentissage via des formations
          et à l’accès à des ressources digitales. Dans ce cadre, certaines données personnelles peuvent être collectées
          afin d’améliorer votre expérience et vous fournir des services adaptés.
        </p>
      </div>
    </section>

    <!-- ══════════════════════════════
         DONNÉES COLLECTÉES
    ══════════════════════════════ -->
    <section class="section alt">
      <div class="container">
        <h2 class="section-title">Données que nous collectons</h2>

        <div class="grid">
          <div class="card">
            <h3>Informations personnelles</h3>
            <p>
              Nom, prénom, email, numéro de téléphone, informations professionnelles
              (expériences, compétences, formations) que vous renseignez dans votre CV.
            </p>
          </div>

          <div class="card">
            <h3>Données d’utilisation</h3>
            <p>
              Pages visitées, fonctionnalités utilisées, temps passé sur la plateforme
              afin d’améliorer nos services.
            </p>
          </div>

          <div class="card">
            <h3>Données techniques</h3>
            <p>
              Adresse IP, type d’appareil, navigateur, pour assurer la sécurité
              et le bon fonctionnement de la plateforme.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════
         UTILISATION
    ══════════════════════════════ -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Comment nous utilisons vos données</h2>

        <ul class="list">
          <li>Créer et gérer votre compte utilisateur</li>
          <li>Générer vos CV automatiquement</li>
          <li>Vous proposer des formations et ressources adaptées</li>
          <li>Améliorer l’expérience utilisateur</li>
          <li>Assurer la sécurité de la plateforme</li>
        </ul>
      </div>
    </section>

    <!-- ══════════════════════════════
         PARTAGE
    ══════════════════════════════ -->
    <section class="section alt">
      <div class="container">
        <h2 class="section-title">Partage des données</h2>

        <p class="text">
          Vos données ne sont jamais vendues. Elles peuvent être partagées uniquement avec :
        </p>

        <ul class="list">
          <li>Nos partenaires techniques (hébergement, services cloud)</li>
          <li>Nos partenaires professionnels (ex : recrutement) uniquement avec votre accord</li>
        </ul>
      </div>
    </section>

    <!-- ══════════════════════════════
         SÉCURITÉ
    ══════════════════════════════ -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Sécurité des données</h2>

        <p class="text">
          Nous mettons en place des mesures techniques et organisationnelles pour protéger vos données
          contre tout accès non autorisé, perte ou divulgation.
        </p>
      </div>
    </section>

    <!-- ══════════════════════════════
         DROITS
    ══════════════════════════════ -->
    <section class="section alt">
      <div class="container">
        <h2 class="section-title">Vos droits</h2>

        <ul class="list">
          <li>Accéder à vos données</li>
          <li>Modifier ou corriger vos informations</li>
          <li>Supprimer votre compte</li>
          <li>Demander la portabilité de vos données</li>
        </ul>

        <p class="text">
          Pour toute demande, contactez-nous à : <strong>contact@lbsmarket.com</strong>
        </p>
      </div>
    </section>

    <!-- ══════════════════════════════
         CTA
    ══════════════════════════════ -->
    <section class="cta">
      <div class="container">
        <div class="cta-inner">
          <div class="cta-badge">Confiance & transparence</div>

          <h2 class="cta-title">
            Votre confiance<br>
            <span class="cta-em">est essentielle.</span>
          </h2>

          <p class="cta-desc">
            Nous nous engageons à protéger vos données et à rester transparents sur leur utilisation.
          </p>

          <RouterLink to="/register" class="cta-btn">
            Commencer gratuitement
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
.privacy {
  background: #fff;
  color: #0a0a0a;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40px;
}

.container.narrow {
  max-width: 700px;
}

/* HERO */
.hero {
  padding: 100px 0 80px;
  border-bottom: 1px solid #ebebeb;
}

.hero-pill {
  display: inline-flex;
  gap: 8px;
  padding: 5px 14px;
  border-radius: 99px;
  background: #f3f3f3;
  border: 1px solid #e5e5e5;
  font-size: 12px;
  margin-bottom: 30px;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
}

.hero-title {
  font-size: 52px;
  font-weight: 800;
  margin-bottom: 20px;
}

.hero-em {
  color: #bbb;
}

.hero-desc {
  color: #777;
  max-width: 520px;
}

/* SECTION */
.section {
  padding: 80px 0;
}

.section.alt {
  background: #f5f5f5;
}

.section-title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 30px;
}

.text {
  color: #666;
  line-height: 1.8;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
}

/* LIST */
.list {
  padding-left: 20px;
  color: #666;
  line-height: 1.8;
}

/* CTA */
.cta {
  padding: 80px 0;
}

.cta-inner {
  background: #0a0a0a;
  color: #fff;
  padding: 50px;
  border-radius: 16px;
}

.cta-btn {
  display: inline-block;
  margin-top: 20px;
  background: #fff;
  color: #000;
  padding: 12px 20px;
  border-radius: 8px;
}
</style>