<template>
  <main class="emploi-page">

    <!-- ══════════════════════════════
         HERO SECTION — COMING SOON
    ══════════════════════════════ -->
    <section class="hero-emploi">
      <div class="container">

        <div class="emploi-content">
          <div class="emploi-tag">Bientôt disponible</div>

          <h1 class="emploi-title">
            Postulez directement<br>
            aux offres d'emploi.
          </h1>

          <p class="emploi-desc">
            Notre plateforme d'offres d'emploi arrive très bientôt. 
            Accédez directement à des centaines de postes exclusifs auprès de 100+ entreprises partenaires. 
            CDI, CDD, stages et missions dans tous les secteurs.
          </p>

          <!-- CTA Newsletter -->
          <div class="newsletter-section">
            <div class="newsletter-form">
              <input 
                v-model="email"
                type="email"
                placeholder="Votre adresse email"
                class="newsletter-input"
              />
              <button @click="subscribe" class="newsletter-btn">
                M'avertir du lancement
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div v-if="subscribeMessage" class="form-message" :class="subscribeStatus">
              {{ subscribeMessage }}
            </div>
          </div>

          <!-- Social proof -->
          <div class="emploi-proof">
            <div class="proof-item">
              <span class="proof-n">100+</span>
              <span class="proof-l">Entreprises partenaires</span>
            </div>
            <div class="proof-divider" />
            <div class="proof-item">
              <span class="proof-n">500+</span>
              <span class="proof-l">Offres d'emploi</span>
            </div>
            <div class="proof-divider" />
            <div class="proof-item">
              <span class="proof-n">CDI • CDD • Stages</span>
              <span class="proof-l">Tous secteurs</span>
            </div>
          </div>
        </div>

        <!-- Illustration -->
        <div class="emploi-illustration">
          <div class="illustration-circle">
            <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Background circle -->
              <circle cx="150" cy="150" r="140" fill="#edf0f5" stroke="#d4a634" stroke-width="3" />
              
              <!-- Document/Job card -->
              <rect x="80" y="60" width="140" height="180" rx="8" fill="#fff" stroke="#1c2b4a" stroke-width="2" />
              
              <!-- Lines on document -->
              <line x1="95" y1="85" x2="205" y2="85" stroke="#1c2b4a" stroke-width="2" stroke-linecap="round" />
              <line x1="95" y1="105" x2="205" y2="105" stroke="#d4a634" stroke-width="2" stroke-linecap="round" />
              <line x1="95" y1="130" x2="180" y2="130" stroke="#ccc" stroke-width="1.5" />
              <line x1="95" y1="150" x2="200" y2="150" stroke="#ccc" stroke-width="1.5" />
              <line x1="95" y1="170" x2="195" y2="170" stroke="#ccc" stroke-width="1.5" />
              <line x1="95" y1="190" x2="180" y2="190" stroke="#ccc" stroke-width="1.5" />
              
              <!-- Button on document -->
              <rect x="95" y="215" width="110" height="20" rx="4" fill="#243558" />
              <text x="150" y="228" font-family="Arial" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">Postuler</text>
              
              <!-- Arrow floating around -->
              <g opacity="0.7">
                <circle cx="220" cy="80" r="20" fill="none" stroke="#d4a634" stroke-width="2" />
                <text x="220" y="88" font-family="Arial" font-size="20" text-anchor="middle">→</text>
              </g>
            </svg>
          </div>
        </div>

      </div>
    </section>

  </main>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const subscribeMessage = ref('')
const subscribeStatus = ref('')

function subscribe() {
  if (!email.value || !email.value.includes('@')) {
    subscribeMessage.value = 'Veuillez entrer une adresse email valide'
    subscribeStatus.value = 'error'
    return
  }
  
  subscribeMessage.value = '✓ Merci ! Nous vous contacterons bientôt.'
  subscribeStatus.value = 'success'
  email.value = ''
  
  setTimeout(() => {
    subscribeMessage.value = ''
  }, 4000)
}
</script>

<style scoped>
:root {
  --navy: #1c2b4a;
  --gold: #d4a634;
  --navy-light: #243558;
  --navy-bg: #edf0f5;
}

.emploi-page {
  background: #fff;
  color: var(--navy);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

/* ══ HERO ══ */
.hero-emploi {
  padding: 120px 0;
  background: linear-gradient(135deg, var(--navy-bg) 0%, #fff 100%);
  border-bottom: 1px solid #e5e5e5;
}

.hero-emploi .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.emploi-content {
  max-width: 550px;
}

.emploi-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--navy);
  background: rgba(212, 166, 52, .1);
  padding: 5px 14px;
  border-radius: 99px;
  margin-bottom: 28px;
}

.emploi-title {
  font-size: clamp(42px, 5vw, 64px);
  font-weight: 800;
  letter-spacing: -2.5px;
  line-height: 1.1;
  color: var(--navy);
  margin-bottom: 24px;
}

.emploi-desc {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 48px;
}

/* Newsletter */
.newsletter-section {
  margin-bottom: 48px;
}

.newsletter-form {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.newsletter-input {
  flex: 1;
  padding: 14px 18px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
  background: #fff;
  transition: all .2s;
}

.newsletter-input:focus {
  outline: none;
  border-color: var(--navy);
  box-shadow: 0 0 0 3px rgba(28, 43, 74, .08);
}

.newsletter-input::placeholder {
  color: #bbb;
}

.newsletter-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--navy-light);
  color: #fff;
  border: none;
  padding: 14px 28px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all .2s;
  white-space: nowrap;
}

.newsletter-btn:hover {
  background: var(--navy);
  transform: translateY(-2px);
}

.form-message {
  font-size: 13px;
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

/* Social proof */
.emploi-proof {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 28px 0;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}

.proof-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.proof-n {
  font-size: 16px;
  font-weight: 800;
  color: var(--gold);
}

.proof-l {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.proof-divider {
  width: 1px;
  height: 40px;
  background: #e5e5e5;
}

/* Illustration */
.emploi-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 420px;
}

.illustration-circle {
  width: 300px;
  height: 300px;
}

.illustration-circle svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 20px 60px rgba(28, 43, 74, .15));
}

/* ══ RESPONSIVE ══ */
@media (max-width: 1024px) {
  .hero-emploi .container {
    grid-template-columns: 1fr;
    gap: 60px;
  }

  .emploi-illustration {
    height: 350px;
  }

  .illustration-circle {
    width: 280px;
    height: 280px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 20px;
  }

  .hero-emploi {
    padding: 80px 0;
  }

  .emploi-title {
    font-size: 36px;
    letter-spacing: -1.5px;
  }

  .emploi-proof {
    flex-direction: column;
    gap: 20px;
  }

  .proof-divider {
    display: none;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .newsletter-btn {
    width: 100%;
    justify-content: center;
  }

  .emploi-illustration {
    height: 300px;
  }

  .illustration-circle {
    width: 240px;
    height: 240px;
  }
}
</style>