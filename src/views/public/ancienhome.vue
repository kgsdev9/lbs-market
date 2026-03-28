<template>
  <div class="home">

    <!-- ══════════════════════════════
         HERO
    ══════════════════════════════ -->
     <section class="hero">
      <div class="hero-bg-grid"/>
      <div class="container">
        <div class="hero-inner">

          <div class="hero-left">
            <div class="hero-pill">
              <span class="pill-dot"/>
              La marketplace ivoiro-africaine des produits digitaux 🚀
            </div>

            <h1 class="hero-title">
              Vends ton savoir.<br>
              <span class="hero-em">Achète du contenu.</span>
            </h1>

            <p class="hero-desc">
              Achetez des formations et produits digitaux créés par des pros,
              ou publiez les vôtres et encaissez à chaque vente — tout en un seul endroit.
            </p>

            <div class="hero-actions">
              <RouterLink to="/register" class="btn btn-primary btn-xl">
                Commencer à vendre
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </RouterLink>
              <RouterLink to="/formations" class="btn btn-outline btn-lg">
                Explorer la boutique
              </RouterLink>
            </div>

            <div class="hero-trust">
              <div class="trust-avatars">
                <div v-for="m in trustMembers" :key="m.i" class="trust-av" :style="{ background: m.c }">{{ m.i }}</div>
              </div>
              <div class="trust-text">
                <strong>+2 000 vendeurs & acheteurs</strong> actifs sur la marketplace
              </div>
            </div>
          </div>

          <div class="hero-right">
            <div class="pillars-grid">
              <RouterLink v-for="p in pillars" :key="p.label" :to="p.to" class="pillar-card" :style="{ '--pc': p.color }">
                <div class="pillar-icon">{{ p.icon }}</div>
                <div class="pillar-label">{{ p.label }}</div>
                <div class="pillar-count">{{ p.count }}</div>
                <svg class="pillar-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </RouterLink>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ══════════════════════════════
         STATS
    ══════════════════════════════ -->
    <section class="stats-band">
      <div class="container">
        <div class="stats-row">
          <div v-for="s in stats" :key="s.val" class="stat-item">
            <div class="stat-val">{{ s.val }}</div>
            <div class="stat-lbl">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════
         DOMAINES couverts
    ══════════════════════════════ -->
    <section class="section">
      <div class="container">
        <div style="text-align:center;max-width:620px;margin:0 auto 48px">
          <div class="section-tag" style="justify-content:center">🎯 Nos catégories</div>
          <h2 class="section-title">Des produits digitaux<br>pour chaque métier</h2>
          <p class="section-sub" style="margin:0 auto">
            Trouvez ou vendez des formations et produits digitaux dans votre domaine. Si vous travaillez sur ordinateur, lbs a ce qu'il vous faut.
          </p>
        </div>

        <div class="domains-grid">
          <RouterLink v-for="d in domains" :key="d.label" to="/product" class="domain-card" :style="{ '--dc': d.color }">
            <div class="domain-icon">{{ d.icon }}</div>
            <div class="domain-label">{{ d.label }}</div>
            <div class="domain-examples">{{ d.examples }}</div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════
         SECTION FORMATIONS (explicatif)
    ══════════════════════════════ -->
    <section class="section" style="background:var(--surface)">
      <div class="container">
        <div class="feature-block">
          <div class="feature-text">
            <div class="section-tag"><span v-html="ICONS.formation"/> Formations en ligne</div>
            <h2 class="feature-title">Achetez une formation.<br>Ou vendez la vôtre.</h2>
            <p class="feature-desc">
              Parcourez des centaines de formations créées par des professionnels du terrain, ou
              <strong>publiez les vôtres et encaissez directement sur LBS.</strong>
              Chaque formation est structurée en modules progressifs avec des exercices pratiques.
            </p>
            <ul class="feature-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Achetez une fois, accédez à vie — contenu téléchargeable inclus
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Tous niveaux — du débutant absolu au professionnel confirmé
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Devenez formateur : créez, publiez et encaissez vos ventes facilement
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Certificat de complétion délivré à chaque fin de parcours
              </li>
            </ul>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <RouterLink to="/formations" class="btn btn-primary">Acheter une formation →</RouterLink>
              <RouterLink to="/register" class="btn btn-secondary">Vendre ma formation</RouterLink>
            </div>
          </div>

          <div class="feature-visual">
            <!-- Card formation 1 -->
            <div class="fv-card">
              <div class="fvc-header" style="background:#fef9c3">
                <span style="font-size:36px">💼</span>
              </div>
              <div class="fvc-body">
                <div class="fvc-level lvl-begin">Débutant</div>
                <div class="fvc-title">Maîtriser les bases du Marketing Digital</div>
                <div class="fvc-meta">
                  <span>👥 980 acheteurs</span>
                  <span>⏱ 18h de contenu</span>
                </div>
                <div class="fvc-price free">Gratuit</div>
              </div>
            </div>
            <!-- Card formation 2 -->
            <div class="fv-card fv-card-sm">
              <div class="fvc-header" style="background:#dbeafe">
                <span style="font-size:28px">📊</span>
                <span class="fvc-badge badge badge-orange">Bestseller</span>
              </div>
              <div class="fvc-body">
                <div class="fvc-level lvl-mid">Intermédiaire</div>
                <div class="fvc-title" style="font-size:13px">Bien débuter avec Sage X3</div>
                <div class="fvc-price">20 000 FCFA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════
         SECTION PRODUITS DIGITAUX (explicatif)
    ══════════════════════════════ -->
    <section class="section">
      <div class="container">
        <div class="feature-block feature-block-reverse">
          <div class="feature-visual">
            <div class="res-grid">
              <div v-for="r in prodExamples" :key="r.title" class="res-card card card-p">
                <div class="res-icon" :style="{ background: r.color }">{{ r.icon }}</div>
                <div style="flex:1;min-width:0">
                  <div class="res-title">{{ r.title }}</div>
                  <div class="res-type">{{ r.type }}</div>
                </div>
                <div class="res-price" :class="{ free: r.isFree }">
                  {{ r.isFree ? '🆓' : r.price }}
                </div>
              </div>
            </div>
          </div>

          <div class="feature-text">
            <div class="section-tag">📦 Produits digitaux</div>
            <h2 class="feature-title">Des fichiers prêts à l'emploi.<br>Téléchargez. Utilisez. Revendez.</h2>
            <p class="feature-desc">
              Templates comptables, modèles de documents, fichiers Excel, guides PDF,
              outils bureautiques, composants UI — achetez des produits digitaux prêts à l'emploi
              ou <strong>publiez vos propres fichiers et générez des revenus passifs sur Aho.</strong>
            </p>
            <ul class="feature-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Paiement sécurisé, téléchargement immédiat après achat
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Guides PDF, ebooks techniques, plans comptables, tableaux de bord
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Templates UI, outils dev, composants réutilisables
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Publiez vos fichiers une fois, encaissez à chaque vente automatiquement
              </li>
            </ul>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <RouterLink to="/product" class="btn btn-primary">Acheter des produits digitaux →</RouterLink>
              <RouterLink to="/register" class="btn btn-secondary">Vendre mes fichiers</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════
         POURQUOI VENDRE SUR LBS
    ══════════════════════════════ -->
    <section class="section" style="background:var(--surface)">
      <div class="container">
        <div style="text-align:center;max-width:580px;margin:0 auto 48px">
          <div class="section-tag" style="justify-content:center">💡 Pourquoi LBS ?</div>
          <h2 class="section-title">La marketplace pensée<br>pour les créateurs africains</h2>
        </div>
        <div class="why-grid">
          <div v-for="w in whyItems" :key="w.title" class="why-card">
            <div class="why-icon">{{ w.icon }}</div>
            <div class="why-title">{{ w.title }}</div>
            <div class="why-desc">{{ w.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════
         CTA FINAL (noir)
    ══════════════════════════════ -->
    <section class="section">
      <div class="container">
        <div class="cta-block">
          <div class="cta-left">
            <div class="cta-tag">🚀 Prêt à rejoindre la marketplace ?</div>
            <h2 class="cta-title">Achetez. Vendez.<br>Développez-vous sur LBS.</h2>
            <p class="cta-desc">
              Créez un compte gratuit pour accéder à des centaines de formations et produits digitaux,
              ou commencez à vendre vos propres produits digitaux dès aujourd'hui à +2 000 acheteurs dans 40+ pays.
            </p>
            <div class="cta-actions">
              <RouterLink to="/register" class="btn btn-primary btn-xl">
                Créer mon compte gratuit →
              </RouterLink>
              <RouterLink to="/formations" class="btn btn-ghost btn-lg cta-ghost">
                Explorer la boutique
              </RouterLink>
            </div>
          </div>
          <div class="cta-right">
            <div v-for="item in ctaFeatures" :key="item.label" class="cta-feature">
              <div class="cta-feature-icon">{{ item.icon }}</div>
              <div>
                <div class="cta-feature-label">{{ item.label }}</div>
                <div class="cta-feature-desc">{{ item.desc }}</div>
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
import { ICONS } from '@/composables/icons'

const trustMembers = [
  { i:'KS', c:'#4f46e5' }, { i:'MN', c:'#db2777' },
  { i:'AF', c:'#d97706' }, { i:'JB', c:'#0891b2' },
  { i:'CM', c:'#059669' },
]

const pillars = [
  { label:'Formations',        icon:'🎓', count:'Acheter & vendre',    to:'/formations', color:'#4f46e5' },
  { label:'Produits digitaux', icon:'📦', count:'Templates & fichiers', to:'/product', color:'#059669' },
]

const stats = [
  { val:'2 000+', label:'Acheteurs & vendeurs actifs'  },
  { val:'150+',   label:'Formations en vente'          },
  { val:'500+',   label:'Produits digitaux disponibles'},
]

const domains = [
  { icon:'💻', label:'Développement',    examples:'Web, mobile, Python, Laravel, Vue.js...', color:'#4f46e5' },
  { icon:'📊', label:'Comptabilité',     examples:'Sage X3, OHADA, fiscalité, paie...',       color:'#0891b2' },
  { icon:'🖥',  label:'Bureautique',     examples:'Excel, Word, PowerPoint, Access...',        color:'#059669' },
  { icon:'📡', label:'Réseaux & Sys.',   examples:'Cisco, Linux, Windows Server, sécurité...', color:'#7c3aed' },
  { icon:'🎨', label:'Design',           examples:'Figma, Photoshop, Illustrator, UI/UX...',   color:'#db2777' },
  { icon:'📣', label:'Marketing Digital',examples:'SEO, publicité Meta, email, contenu...',    color:'#d97706' },
  { icon:'🏢', label:'Gestion & ERP',    examples:'Sage, SAP, gestion de projet, RH...',       color:'#dc2626' },
]

const prodExamples = [
  { title:'Modèle Plan Comptable OHADA',          type:'Fichier Excel',   icon:'📊', color:'#dbeafe', isFree:false, price:'5 000 F'  },
  { title:'Guide Sage X3 — Prise en main',        type:'PDF 60 pages',    icon:'📄', color:'#dcfce7', isFree:true,  price:''         },
  { title:'Dashboard RH — Suivi du personnel',    type:'Fichier Excel',   icon:'🗂', color:'#fef9c3', isFree:false, price:'8 000 F'  },
  { title:'Template CV Professionnel Africain',   type:'Word / Canva',    icon:'📝', color:'#ede9fe', isFree:true,  price:''         },
]

const whyItems = [
  { icon:'⚡', title:'Publiez en quelques minutes',      desc:'Créez votre fiche produit, fixez votre prix et mettez en vente immédiatement. Aucune compétence technique requise.' },
  { icon:'💳', title:'Paiement local simplifié',         desc:'Vos acheteurs paient par Mobile Money, carte bancaire ou virement. Vous encaissez directement sur votre compte.' },
  { icon:'📥', title:'Livraison automatique',            desc:'Dès la confirmation du paiement, l\'acheteur reçoit son fichier instantanément. Zéro intervention de votre part.' },
  { icon:'📈', title:'Suivez vos ventes en temps réel',  desc:'Tableau de bord vendeur complet : revenus, téléchargements, produits les plus vendus — tout sous les yeux.' },
  { icon:'🔒', title:'Vos fichiers sont protégés',       desc:'Vos produits sont stockés de façon sécurisée. Seuls les acheteurs ayant payé peuvent y accéder.' },
  { icon:'🆓', title:'Gratuit pour commencer',           desc:'Aucun abonnement requis pour publier. Nous prélevons une commission uniquement sur vos ventes réalisées.' },
]

const ctaFeatures = [
  { icon:'🛒', label:'Marketplace de produits digitaux',   desc:'Formations, templates, PDF, Excel, outils — achetez ou vendez en quelques clics'  },
  { icon:'💰', label:'Encaissez à chaque vente',           desc:'Publiez une fois votre produit et recevez des paiements automatiquement'           },
  { icon:'📦', label:'Téléchargement immédiat',            desc:'L\'acheteur reçoit son fichier dès la confirmation du paiement'                    },
  { icon:'🆓', label:'Des produits gratuits aussi',        desc:'Des formations et produits digitaux 100% gratuits disponibles sans abonnement'    },
]
</script>

<style scoped>
/* ══ HERO ══ */
.hero { padding: 80px 0 60px; position: relative; overflow: hidden; }
.hero-bg-grid { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(var(--border2) 1px, transparent 1px), linear-gradient(90deg, var(--border2) 1px, transparent 1px); background-size: 48px 48px; mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, black 30%, transparent 100%); opacity: .45; }
.hero-inner { display: grid; grid-template-columns: 1fr 400px; gap: 64px; align-items: center; }
.hero-pill { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 99px; background: var(--surface); border: 1px solid var(--border); font-size: 12.5px; font-weight: 600; color: var(--text3); font-family: var(--font-mono); margin-bottom: 24px; }
.pill-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; flex-shrink: 0; animation: blink 2s ease-in-out infinite; }
@keyframes blink { 0%,100% { opacity:1; } 50% { opacity:.3; } }
.hero-title { font-family: var(--font-alt); font-size: clamp(30px, 4.5vw, 50px); font-weight: 800; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 20px; color: var(--text); }
.hero-em { background: linear-gradient(135deg, var(--accent) 0%, #a855f7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-desc { font-size: 16px; color: var(--text3); line-height: 1.75; margin-bottom: 32px; max-width: 500px; }
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 36px; }
.hero-trust { display: flex; align-items: center; gap: 12px; }
.trust-avatars { display: flex; }
.trust-av { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--surface); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #fff; margin-left: -8px; }
.trust-av:first-child { margin-left: 0; }
.trust-text { font-size: 13px; color: var(--text3); }
.trust-text strong { color: var(--text); }
.pillars-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.pillar-card { display: flex; flex-direction: column; gap: 4px; padding: 20px; border-radius: 14px; border: 1.5px solid var(--border); background: var(--surface); text-decoration: none; transition: all .2s; position: relative; overflow: hidden; }
.pillar-card::before { content: ''; position: absolute; inset: 0; background: var(--pc); opacity: 0; transition: opacity .2s; }
.pillar-card:hover { border-color: var(--pc); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.1); }
.pillar-card:hover::before { opacity: .05; }
.pillar-icon  { font-size: 28px; margin-bottom: 6px; }
.pillar-label { font-size: 14px; font-weight: 700; color: var(--text); }
.pillar-count { font-size: 11.5px; color: var(--text4); font-family: var(--font-mono); }
.pillar-arrow { position: absolute; top: 16px; right: 16px; color: var(--text5); transition: all .2s; }
.pillar-card:hover .pillar-arrow { color: var(--pc); transform: translate(2px,-2px); }

/* ══ STATS ══ */
.stats-band { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.stats-row  { display: flex; }
.stat-item  { flex: 1; padding: 24px 32px; text-align: center; border-right: 1px solid var(--border); }
.stat-item:last-child { border-right: none; }
.stat-val   { font-size: 26px; font-weight: 800; font-family: var(--font-alt); color: var(--text); letter-spacing: -1px; margin-bottom: 3px; }
.stat-lbl   { font-size: 12.5px; color: var(--text4); }

/* ══ DOMAINES ══ */
.domains-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.domain-card {
  padding: 20px 18px; border-radius: 12px; border: 1.5px solid var(--border);
  background: var(--surface); cursor: pointer; transition: all .18s;
  position: relative; overflow: hidden; text-decoration: none; display: block;
}
.domain-card::before { content: ''; position: absolute; inset: 0; background: var(--dc); opacity: 0; transition: opacity .18s; }
.domain-card:hover { border-color: var(--dc); transform: translateY(-2px); }
.domain-card:hover::before { opacity: .06; }
.domain-icon     { font-size: 26px; margin-bottom: 10px; }
.domain-label    { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 5px; }
.domain-examples { font-size: 11.5px; color: var(--text4); line-height: 1.5; }

/* ══ FEATURE BLOCKS ══ */
.feature-block { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
.feature-block-reverse { direction: rtl; }
.feature-block-reverse > * { direction: ltr; }
.feature-text .section-tag { margin-bottom: 14px; }
.feature-title { font-family: var(--font-alt); font-size: clamp(24px, 3vw, 34px); font-weight: 800; letter-spacing: -.8px; line-height: 1.2; color: var(--text); margin-bottom: 16px; }
.feature-desc  { font-size: 15px; color: var(--text3); line-height: 1.8; margin-bottom: 20px; }
.feature-list  { list-style: none; padding: 0; margin: 0 0 28px; display: flex; flex-direction: column; gap: 10px; }
.feature-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--text2); line-height: 1.5; }
.feature-list svg { flex-shrink: 0; margin-top: 2px; }

/* Formation visual */
.feature-visual { display: flex; flex-direction: column; gap: 12px; }
.fv-card { border-radius: 12px; overflow: hidden; border: 1px solid var(--border); background: var(--surface); }
.fv-card-sm { opacity: .85; transform: scale(.97); transform-origin: top right; }
.fvc-header { height: 100px; display: flex; align-items: center; justify-content: center; position: relative; }
.fvc-badge  { position: absolute; top: 10px; right: 10px; font-size: 10.5px; }
.fvc-body   { padding: 14px; }
.fvc-level  { font-size: 10.5px; font-weight: 600; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 6px; }
.lvl-begin  { background: rgba(34,197,94,.1); color: #16a34a; }
.lvl-mid    { background: rgba(59,130,246,.1); color: #2563eb; }
.fvc-title  { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 8px; line-height: 1.4; }
.fvc-meta   { display: flex; gap: 12px; font-size: 12px; color: var(--text4); margin-bottom: 8px; }
.fvc-price  { font-size: 15px; font-weight: 800; color: var(--text); font-family: var(--font-alt); }
.fvc-price.free { color: #16a34a; }

/* Resource visual */
.res-grid  { display: flex; flex-direction: column; gap: 8px; }
.res-card  { display: flex; align-items: center; gap: 12px; border-radius: 10px; padding: 12px 14px !important; }
.res-icon  { width: 38px; height: 38px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.res-title { font-size: 13px; font-weight: 600; color: var(--text); }
.res-type  { font-size: 11px; color: var(--text4); font-family: var(--font-mono); }
.res-price { font-size: 12.5px; font-weight: 700; color: var(--text); white-space: nowrap; }
.res-price.free { color: #16a34a; }

/* ══ WHY GRID ══ */
.why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.why-card { background: var(--bg); border: 1.5px solid var(--border); border-radius: 14px; padding: 28px 24px; transition: all .18s; }
.why-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.07); }
.why-icon  { font-size: 28px; margin-bottom: 14px; }
.why-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
.why-desc  { font-size: 13.5px; color: var(--text3); line-height: 1.7; }

/* ══ CTA FINAL ══ */
.cta-block { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; background: var(--text); border-radius: 20px; padding: 60px 52px; }
.cta-tag   { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: rgba(255,255,255,.45); font-family: var(--font-mono); margin-bottom: 16px; }
.cta-title { font-family: var(--font-alt); font-size: clamp(24px, 3vw, 34px); font-weight: 800; color: #fff; letter-spacing: -.8px; line-height: 1.15; margin-bottom: 16px; }
.cta-desc  { font-size: 15px; color: rgba(255,255,255,.5); line-height: 1.75; margin-bottom: 28px; }
.cta-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.cta-ghost { color: rgba(255,255,255,.6) !important; }
.cta-ghost:hover { color: #fff !important; }
.cta-feature { display: flex; align-items: flex-start; gap: 14px; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,.07); }
.cta-feature:last-child { border-bottom: none; }
.cta-feature-icon  { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
.cta-feature-label { font-size: 14px; font-weight: 700; color: rgba(255,255,255,.82); margin-bottom: 2px; }
.cta-feature-desc  { font-size: 12.5px; color: rgba(255,255,255,.38); line-height: 1.5; }

[data-theme="dark"] .cta-block  { background: var(--surface2); border: 1px solid var(--border); }
[data-theme="dark"] .cta-title  { color: var(--text); }
[data-theme="dark"] .cta-desc   { color: var(--text3); }
[data-theme="dark"] .cta-tag    { color: var(--text4); }
[data-theme="dark"] .cta-feature { border-color: var(--border2); }
[data-theme="dark"] .cta-feature-label { color: var(--text); }
[data-theme="dark"] .cta-feature-desc  { color: var(--text4); }
[data-theme="dark"] .cta-ghost  { color: var(--text3) !important; }

/* ══ Responsive ══ */
@media (max-width: 1100px) {
  .hero-inner    { grid-template-columns: 1fr 340px; gap: 40px; }
  .domains-grid  { grid-template-columns: repeat(4, 1fr); }
  .feature-block { gap: 48px; }
}
@media (max-width: 900px) {
  .hero-inner    { grid-template-columns: 1fr; }
  .domains-grid  { grid-template-columns: repeat(2, 1fr); }
  .feature-block, .feature-block-reverse { grid-template-columns: 1fr; direction: ltr; gap: 32px; }
  .why-grid      { grid-template-columns: 1fr 1fr; }
  .cta-block     { grid-template-columns: 1fr; gap: 32px; padding: 40px 28px; }
  .stats-row     { flex-wrap: wrap; }
  .stat-item     { flex: 1; min-width: 120px; border-right: none; border-bottom: 1px solid var(--border); padding: 18px 20px; }
  .stat-item:last-child { border-bottom: none; }
}
@media (max-width: 600px) {
  .pillars-grid  { grid-template-columns: 1fr 1fr; }
  .domains-grid  { grid-template-columns: 1fr 1fr; }
  .why-grid      { grid-template-columns: 1fr; }
  .hero-title    { font-size: 28px; }
  .cta-title     { font-size: 22px; }
}
</style>