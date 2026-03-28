<template>
    <div class="pi-page">
        <div class="pi-bg-shape pi-bg-1" />
        <div class="pi-bg-shape pi-bg-2" />

        <!-- Loader -->
        <div v-if="loadingFormation" class="pi-loader">
            <div class="pi-loader-inner">
                <div class="pi-spin-ring" />
                <p>Chargement de la formation…</p>
            </div>
        </div>

        <!-- 404 -->
        <div v-else-if="!formation" class="pi-notfound">
            <div class="pi-notfound-icon">🎓</div>
            <h2>Formation introuvable</h2>
            <p>Cette formation n'existe pas ou n'est plus disponible.</p>
        </div>

        <!-- Contenu -->
        <div v-else class="pi-wrapper">

            <!-- ════ GAUCHE — Formulaire ════ -->
            <div class="pi-left">
                <div class="pi-form-box">

                    <!-- Succès -->
                    <div v-if="success" class="pi-success">
                        <div class="pi-success-ring">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h2 class="pi-success-title">Préinscription enregistrée !</h2>
                        <p class="pi-success-sub">Merci <strong>{{ form.nom_complet }}</strong> ! Nous vous contacterons
                            dès l'ouverture de la formation.</p>
                        <div class="pi-success-info">
                            <div class="pi-success-row">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="m22 7-10 6L2 7" />
                                </svg>
                                {{ form.email }}
                            </div>
                            <div class="pi-success-row">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path
                                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.37h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 17z" />
                                </svg>
                                {{ form.telephone }}
                            </div>
                        </div>
                    </div>

                    <!-- Formulaire -->
                    <form v-else @submit.prevent="submit">
                        <div class="pi-form-header">
                            <h1 class="pi-form-tag">Préinscription gratuite</h1>
                            <!-- Titre formation visible partout -->
                            <div class="pi-form-title">{{ formation?.title }}</div>
                            <p class="pi-form-sub">Remplissez le formulaire ci-dessous. Nous vous contacterons dès
                                l'ouverture.</p>
                        </div>

                        <div class="pi-fields">
                            <div class="pi-field">
                                <label class="pi-label">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    Nom complet
                                </label>
                                <input v-model="form.nom_complet" type="text" class="pi-input"
                                    placeholder="Ex : Kouassi Jean-Marie" required />
                            </div>
                            <div class="pi-field">
                                <label class="pi-label">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="m22 7-10 6L2 7" />
                                    </svg>
                                    Adresse email
                                </label>
                                <input v-model="form.email" type="email" class="pi-input"
                                    placeholder="votre@email.com" required />
                            </div>
                            <div class="pi-field">
                                <label class="pi-label">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path
                                            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.62 4.43A2 2 0 0 1 3.6 2.37h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 17z" />
                                    </svg>
                                    Téléphone
                                </label>
                                <input v-model="form.telephone" type="tel" class="pi-input"
                                    placeholder="+225 07 00 00 00 00" required />
                            </div>
                        </div>

                        <div v-if="error" class="pi-error">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {{ error }}
                        </div>

                        <button type="submit" class="pi-btn" :disabled="loading">
                            <span v-if="loading" class="pi-btn-spin" />
                            <template v-else>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Je me préinscris
                            </template>
                        </button>

                        <p class="pi-privacy">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Vos données sont confidentielles et ne seront jamais partagées.
                        </p>
                    </form>
                </div>

                <p class="pi-footer-note">© {{ new Date().getFullYear() }} LBS Market · <a href="/">Retour à
                        l'accueil</a></p>
            </div>

            <!-- ════ DROITE — Infos formation ════ -->
            <div class="pi-right">

                <!-- Cover -->
                <div class="pi-cover-wrap">
                    <div class="pi-cover"
                        :style="formation.image ? {} : { background: formation.cover_color || '#4f46e5' }">
                        <img v-if="formation.image" :src="formation.image" :alt="formation.title"
                            class="pi-cover-img" />
                        <div v-else class="pi-cover-emoji">🎓</div>
                    </div>
                    <div class="pi-cover-badges">
                        <span class="pi-cover-badge" :class="levelCls(formation.level)">{{ levelLabel(formation.level) }}</span>
                        <span v-if="formation.badge" class="pi-cover-badge pi-badge-highlight">{{ badgeLabel(formation.badge) }}</span>
                    </div>
                </div>

                <!-- Info box -->
                <div class="pi-info-box">

                    <!-- Header : tags + titre + subtitle -->
                    <div class="pi-info-header">
                        <div class="pi-tag-row">
                            <span v-for="tag in (formation.tags || []).slice(0, 3)" :key="tag.id" class="pi-tag">{{ tag.name }}</span>
                        </div>
                        <h2 class="pi-formation-title">{{ formation.title }}</h2>
                        <p class="pi-formation-sub">{{ formation.subtitle }}</p>
                    </div>

                    <!-- Durée + Niveau -->
                    <div class="pi-duration-row">
                        <div class="pi-duration-item">
                            <div class="pi-duration-icon">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <div>
                                <div class="pi-duration-val">{{ formation.duration || '—' }}</div>
                                <div class="pi-duration-lbl">Durée totale</div>
                            </div>
                        </div>
                        <div class="pi-duration-item">
                            <div class="pi-duration-icon">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                </svg>
                            </div>
                            <div>
                                <div class="pi-duration-val">{{ levelLabel(formation.level) }}</div>
                                <div class="pi-duration-lbl">Niveau</div>
                            </div>
                        </div>
                    </div>

                    <!-- Prix juste après durée/niveau -->
                    <div class="pi-price-box">
                        <div class="pi-price-label">Tarif de la formation</div>
                        <div class="pi-price-val" :class="{ free: formation.is_free }">
                            {{ formation.is_free ? 'Gratuit' : formatPrice(formation.price) }}
                        </div>
                        <div class="pi-price-hint">Préinscrivez-vous maintenant pour être notifié à l'ouverture</div>
                    </div>

                    <!-- Tabs : Description + Formateur uniquement -->
                    <div class="pi-tabs">
                        <button class="pi-tab" :class="{ active: activeTab === 'description' }" @click="activeTab = 'description'">Description</button>
                        <button class="pi-tab" :class="{ active: activeTab === 'formateur' }" @click="activeTab = 'formateur'">Formateur</button>
                    </div>

                    <!-- Tab : Description -->
                    <div v-if="activeTab === 'description'" class="pi-tab-content">
                        <div v-if="formation.description" class="pi-description" v-html="parsedDescription" />
                        <p v-else class="pi-tab-empty">Aucune description disponible pour cette formation.</p>
                    </div>

                    <!-- Tab : Formateur -->
                    <div v-else-if="activeTab === 'formateur'" class="pi-tab-content">
                        <div class="pi-instructor">
                            <div class="pi-instructor-avatar">{{ instructorInitials() }}</div>
                            <div class="pi-instructor-info">
                                <div class="pi-instructor-name">{{ instructorName() }}</div>
                                <div class="pi-instructor-role">Formateur · LBS Market</div>
                                <p v-if="formation.author?.bio || formation.instructor?.bio" class="pi-instructor-bio">
                                    {{ formation.author?.bio || formation.instructor?.bio }}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>

<script>
import API from '@/services/api'
import { marked } from 'marked'

export default {
    name: 'PreinscriptionView',

    data() {
        return {
            formation: null,
            loadingFormation: true,
            loading: false,
            success: false,
            error: null,
            activeTab: 'description',
            form: {
                nom_complet: '',
                email: '',
                telephone: '',
            },
        }
    },

    computed: {
        parsedDescription() {
            if (!this.formation?.description) return ''
            return marked(this.formation.description)
        },
    },

    async created() {
        try {
            const { data } = await API.get(`/v1/formations/${this.$route.params.slug}`)
            this.formation = data
        } catch (e) {
            console.error(e)
        } finally {
            this.loadingFormation = false
        }
    },

    methods: {
        async submit() {
            this.loading = true
            this.error = null
            try {
                await API.post('/v1/preinscriptions', {
                    ...this.form,
                    ressource_id: this.formation.id,
                    seller_id: this.formation.user_id,
                    type_resource: 1, // 1 = formation
                })
                this.success = true
            } catch (e) {
                this.error = e.response?.data?.message || 'Une erreur est survenue, réessayez.'
            } finally {
                this.loading = false
            }
        },

        levelLabel(l) {
            return { debutant: 'Débutant', intermediaire: 'Intermédiaire', professionnel: 'Professionnel' }[l?.toLowerCase()] || l || '—'
        },

        levelCls(l) {
            return { debutant: 'lvl-green', intermediaire: 'lvl-blue', professionnel: 'lvl-purple' }[l?.toLowerCase()] || ''
        },

        badgeLabel(b) {
            return { bestseller: 'Bestseller', popular: 'Populaire', new: 'Nouveau', featured: 'À la une' }[b?.toLowerCase()] || b
        },

        instructorName() {
            const f = this.formation
            return f?.author?.name || f?.instructor?.name || f?.instructor_name || '—'
        },

        instructorInitials() {
            const n = this.instructorName()
            if (!n || n === '—') return '?'
            return n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2)
        },

        formatPrice(price) {
            if (!price && price !== 0) return '—'
            return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
        },
    },
}
</script>

<style scoped>
.pi-page {
    min-height: 100vh;
    background: var(--surface, #f8f9fb);
    position: relative;
    overflow: hidden;
}

.pi-bg-shape { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; }
.pi-bg-1 { width: 600px; height: 600px; background: rgba(79, 70, 229, .06); top: -200px; right: -150px; }
.pi-bg-2 { width: 400px; height: 400px; background: rgba(245, 158, 11, .05); bottom: -100px; left: -100px; }

/* Loader */
.pi-loader { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 10; }
.pi-loader-inner { display: flex; flex-direction: column; align-items: center; gap: 14px; font-size: 14px; color: var(--text3, #888); }
.pi-spin-ring { width: 36px; height: 36px; border: 3px solid var(--border, #e5e7eb); border-top-color: #4f46e5; border-radius: 50%; animation: spin .7s linear infinite; }

/* 404 */
.pi-notfound { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; text-align: center; padding: 40px; }
.pi-notfound-icon { font-size: 52px; }
.pi-notfound h2 { font-size: 22px; font-weight: 700; color: var(--text, #111); }
.pi-notfound p { font-size: 14px; color: var(--text3, #888); }

/* Layout */
.pi-wrapper { position: relative; z-index: 1; display: grid; grid-template-columns: 460px 1fr; min-height: 100vh; }

/* ── Gauche ── */
.pi-left { background: var(--surface, #fff); border-right: 1px solid var(--border, #e5e7eb); display: flex; flex-direction: column; padding: 36px 40px; overflow-y: auto; }
.pi-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 36px; }
.pi-brand-logo { width: 38px; height: 38px; border-radius: 10px; background: #111827; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 900; color: #fff; }
.pi-brand-name { font-size: 16px; font-weight: 700; color: var(--text, #111); }
.pi-form-box { flex: 1; }
.pi-form-header { margin-bottom: 28px; }
.pi-form-tag { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: #4f46e5; background: rgba(79, 70, 229, .08); padding: 4px 10px; border-radius: 20px; margin-bottom: 12px; }
.pi-form-title { font-size: 22px; font-weight: 800; color: var(--text, #111); line-height: 1.3; margin-bottom: 8px; }
.pi-form-sub { font-size: 14px; color: var(--text3, #888); line-height: 1.6; }
.pi-fields { display: flex; flex-direction: column; gap: 18px; margin-bottom: 20px; }
.pi-field { display: flex; flex-direction: column; gap: 6px; }
.pi-label { display: flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 600; color: var(--text2, #444); }
.pi-input { width: 100%; padding: 12px 14px; border: 1.5px solid var(--border, #e5e7eb); border-radius: 10px; font-size: 14px; color: var(--text, #111); background: var(--surface, #fff); font-family: inherit; transition: border-color .15s, box-shadow .15s; outline: none; }
.pi-input::placeholder { color: var(--text5, #bbb); }
.pi-input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, .1); }
.pi-error { display: flex; align-items: center; gap: 7px; font-size: 13px; color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; padding: 10px 12px; border-radius: 8px; margin-bottom: 16px; }
.pi-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; background: #4f46e5; color: #fff; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; transition: background .15s, transform .1s; margin-bottom: 14px; }
.pi-btn:hover:not(:disabled) { background: #4338ca; }
.pi-btn:active:not(:disabled) { transform: scale(.98); }
.pi-btn:disabled { opacity: .6; cursor: not-allowed; }
.pi-btn-spin { width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, .4); border-top-color: #fff; border-radius: 50%; animation: spin .6s linear infinite; }
.pi-privacy { display: flex; align-items: center; gap: 5px; font-size: 11.5px; color: var(--text5, #aaa); justify-content: center; }
.pi-footer-note { margin-top: 32px; font-size: 12px; color: var(--text5, #aaa); text-align: center; }
.pi-footer-note a { color: #4f46e5; text-decoration: none; }
.pi-footer-note a:hover { text-decoration: underline; }

/* Succès */
.pi-success { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; padding: 40px 20px; }
.pi-success-ring { width: 72px; height: 72px; border-radius: 50%; background: #f0fdf4; border: 2px solid #86efac; display: flex; align-items: center; justify-content: center; color: #16a34a; }
.pi-success-title { font-size: 22px; font-weight: 800; color: var(--text, #111); }
.pi-success-sub { font-size: 14px; color: var(--text3, #888); line-height: 1.6; max-width: 320px; }
.pi-success-info { display: flex; flex-direction: column; gap: 8px; background: var(--surface2, #f8f9fb); border: 1px solid var(--border, #e5e7eb); border-radius: 10px; padding: 14px 20px; width: 100%; }
.pi-success-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text3, #888); }

/* ── Droite ── */
.pi-right { background: var(--surface2, #f4f5f8); overflow-y: auto; padding: 36px 40px; display: flex; flex-direction: column; gap: 20px; }

/* Cover */
.pi-cover-wrap { position: relative; border-radius: 16px; overflow: hidden; }
.pi-cover { height: 240px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.pi-cover-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pi-cover-emoji { font-size: 70px; }
.pi-cover-badges { position: absolute; top: 14px; left: 14px; display: flex; gap: 6px; flex-wrap: wrap; }
.pi-cover-badge { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; backdrop-filter: blur(8px); }
.lvl-green  { background: rgba(22, 163, 74, .15);  color: #15803d; border: 1px solid rgba(22, 163, 74, .3); }
.lvl-blue   { background: rgba(37, 99, 235, .15);  color: #1d4ed8; border: 1px solid rgba(37, 99, 235, .3); }
.lvl-purple { background: rgba(147, 51, 234, .15); color: #7e22ce; border: 1px solid rgba(147, 51, 234, .3); }
.pi-badge-highlight { background: rgba(245, 158, 11, .85); color: #78350f; border: none; }

/* Info box */
.pi-info-box { background: var(--surface, #fff); border: 1px solid var(--border, #e5e7eb); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 18px; }
.pi-info-header { display: flex; flex-direction: column; gap: 8px; }
.pi-tag-row { display: flex; gap: 6px; flex-wrap: wrap; }
.pi-tag { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 20px; background: var(--surface2, #f4f5f8); color: var(--text3, #888); border: 1px solid var(--border, #e5e7eb); }
.pi-formation-title { font-size: 20px; font-weight: 800; color: var(--text, #111); line-height: 1.3; }
.pi-formation-sub { font-size: 13.5px; color: var(--text3, #888); line-height: 1.6; }

/* Durée row */
.pi-duration-row { display: flex; gap: 12px; }
.pi-duration-item { flex: 1; display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 10px; background: var(--surface2, #f8f9fb); border: 1px solid var(--border, #e5e7eb); }
.pi-duration-icon { width: 34px; height: 34px; border-radius: 8px; background: var(--surface, #fff); display: flex; align-items: center; justify-content: center; color: #4f46e5; flex-shrink: 0; }
.pi-duration-val { font-size: 14px; font-weight: 800; color: var(--text, #111); }
.pi-duration-lbl { font-size: 11px; color: var(--text4, #aaa); font-weight: 500; }

/* Prix */
.pi-price-box { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 12px; padding: 18px 20px; color: #fff; }
.pi-price-label { font-size: 11px; font-weight: 600; opacity: .75; margin-bottom: 4px; text-transform: uppercase; letter-spacing: .6px; }
.pi-price-val { font-size: 26px; font-weight: 900; margin-bottom: 6px; }
.pi-price-val.free { color: #86efac; }
.pi-price-hint { font-size: 12px; opacity: .7; line-height: 1.5; }

/* Tabs */
.pi-tabs { display: flex; gap: 2px; border-bottom: 2px solid var(--border, #e5e7eb); }
.pi-tab { padding: 9px 16px; font-size: 13px; font-weight: 600; color: var(--text4, #aaa); background: none; border: none; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all .15s; border-radius: 6px 6px 0 0; }
.pi-tab:hover { color: var(--text, #111); background: var(--surface2, #f4f5f8); }
.pi-tab.active { color: #4f46e5; border-bottom-color: #4f46e5; }

/* Tab content */
.pi-tab-content { min-height: 80px; }
.pi-tab-empty { font-size: 13px; color: var(--text4, #aaa); font-style: italic; padding: 12px 0; }

/* Description markdown */
.pi-description { font-size: 13.5px; color: var(--text2, #444); line-height: 1.75; }
.pi-description :deep(h1) { font-size: 18px; font-weight: 800; color: var(--text, #111); margin: 16px 0 8px; }
.pi-description :deep(h2) { font-size: 16px; font-weight: 700; color: var(--text, #111); margin: 14px 0 7px; }
.pi-description :deep(h3) { font-size: 14.5px; font-weight: 700; color: var(--text, #111); margin: 12px 0 6px; }
.pi-description :deep(p)  { margin-bottom: 10px; }
.pi-description :deep(ul),
.pi-description :deep(ol) { padding-left: 20px; margin-bottom: 10px; }
.pi-description :deep(li) { margin-bottom: 5px; }
.pi-description :deep(strong) { font-weight: 700; color: var(--text, #111); }
.pi-description :deep(em) { font-style: italic; }
.pi-description :deep(code) { font-family: var(--font-mono); font-size: 12px; background: var(--surface2, #f4f5f8); padding: 2px 6px; border-radius: 4px; color: #4f46e5; }
.pi-description :deep(pre) { background: var(--surface2, #f4f5f8); border: 1px solid var(--border, #e5e7eb); border-radius: 8px; padding: 14px; overflow-x: auto; margin-bottom: 12px; }
.pi-description :deep(pre code) { background: none; padding: 0; color: var(--text, #111); }
.pi-description :deep(blockquote) { border-left: 3px solid #4f46e5; padding-left: 14px; color: var(--text3, #888); font-style: italic; margin: 10px 0; }
.pi-description :deep(hr) { border: none; border-top: 1px solid var(--border, #e5e7eb); margin: 14px 0; }
.pi-description :deep(a) { color: #4f46e5; text-decoration: underline; }

/* Formateur */
.pi-instructor { display: flex; align-items: flex-start; gap: 14px; }
.pi-instructor-avatar { width: 48px; height: 48px; border-radius: 50%; background: #4f46e5; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; flex-shrink: 0; }
.pi-instructor-info { display: flex; flex-direction: column; gap: 3px; }
.pi-instructor-name { font-size: 15px; font-weight: 700; color: var(--text, #111); }
.pi-instructor-role { font-size: 12px; color: var(--text4, #aaa); }
.pi-instructor-bio { font-size: 13px; color: var(--text3, #888); line-height: 1.6; margin-top: 6px; }

@keyframes spin { to { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 960px) {
    .pi-wrapper { grid-template-columns: 1fr; }
    .pi-left { border-right: none; border-bottom: 1px solid var(--border, #e5e7eb); padding: 28px 24px; }
    .pi-right { padding: 28px 24px; }
    .pi-cover { height: 200px; }
}

@media (max-width: 540px) {
    .pi-left { padding: 20px 16px; }
    .pi-right { padding: 20px 16px; }
    .pi-form-title { font-size: 18px; }
    .pi-duration-row { flex-direction: column; }
}
</style>