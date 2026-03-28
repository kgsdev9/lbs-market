<template>
  <div>

    <!-- ── LOADING ── -->
    <div v-if="loading" class="section">
      <div class="container">
        <div class="pd-hero">
          <div class="pdh-left">
            <div class="skel-line" style="width:200px;height:20px;margin-bottom:8px"></div>
            <div class="skel-line" style="width:60px;height:60px;border-radius:var(--radius);margin-bottom:16px"></div>
            <div class="skel-line" style="width:70%;height:36px;margin-bottom:12px"></div>
            <div class="skel-line" style="width:100%;height:14px;margin-bottom:6px"></div>
            <div class="skel-line" style="width:85%;height:14px;margin-bottom:6px"></div>
            <div class="skel-line" style="width:60%;height:14px;margin-bottom:20px"></div>
            <div style="display:flex;gap:8px">
              <div class="skel-line" style="width:64px;height:26px;border-radius:99px"></div>
              <div class="skel-line" style="width:64px;height:26px;border-radius:99px"></div>
              <div class="skel-line" style="width:64px;height:26px;border-radius:99px"></div>
            </div>
          </div>
          <div class="pdh-right">
            <div class="skel-line" style="width:100%;height:120px;border-radius:var(--radius)"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── ERREUR ── -->
    <div v-else-if="error" class="section">
      <div class="container">
        <div class="proj-state">
          <p style="color:var(--red)">{{ error }}</p>
          <button class="btn btn-primary btn-sm" @click="fetchProject">Réessayer</button>
          <RouterLink to="/projets" class="btn btn-ghost btn-sm">← Retour aux projets</RouterLink>
        </div>
      </div>
    </div>

    <!-- ── CONTENU ── -->
    <div class="section" v-else-if="p">
      <div class="container">

        <!-- Fil d'Ariane -->
        <div class="pg-bc">
          <RouterLink to="/projets" class="bc-lnk">Projets</RouterLink>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span>{{ p.title }}</span>
        </div>

        <div class="pd-hero">

          <!-- Colonne gauche -->
          <div class="pdh-left">
            <div class="pd-ico" :style="{ background: p.cover_color || p.coverColor || '#f1f5f9' }">
              <span v-html="ICONS.project" style="width:32px;height:32px"/>
            </div>

            <h1 class="pd-title">{{ p.title }}</h1>
            <p class="pd-desc">{{ p.excerpt || p.description }}</p>

            <div class="pd-tags">
              <span v-for="tag in (p.tags || [])" :key="tag.id" class="tag" style="font-family:var(--font-mono)">
                {{ tag.name }}
              </span>
            </div>

            <div class="pd-stats">
              <div class="pds">
                <span class="badge" :class="statusBadge(p.status)">{{ statusLabel(p.status) }}</span>
              </div>
              <div class="pds">
                <span class="level-badge" :class="'level-' + p.level">{{ levelLabel(p.level) }}</span>
              </div>
            </div>

            <div class="pd-actions">
              <a v-if="p.github_link" :href="p.github_link" target="_blank" class="btn btn-primary">
                <span v-html="ICONS.github"/> Voir sur GitHub
              </a>
              <a v-if="p.demo_link" :href="p.demo_link" target="_blank" class="btn btn-secondary">
                <span v-html="ICONS.external"/> Demo live
              </a>
            </div>
          </div>

          <!-- Colonne droite -->
          <div class="pdh-right">

            <div class="pd-team-card card card-p" v-if="p.user">
              <div class="pd-tc-title">Auteur</div>
              <div class="pd-team">
                <div class="avatar avatar-lg" style="background:var(--accent);color:var(--accent-fg);font-family:var(--font-mono)" :title="p.user.name">
                  {{ userInitials(p.user.name) }}
                </div>
                <div style="display:flex;flex-direction:column;gap:2px">
                  <span style="font-size:14px;font-weight:600;color:var(--text)">{{ p.user.name }}</span>
                  <span style="font-size:12px;color:var(--text4)">Développeur</span>
                </div>
              </div>
            </div>

            <div class="pd-contribute card card-p" style="margin-top:12px">
              <h3 style="font-size:15px;font-weight:700;margin-bottom:8px">Contribuer</h3>
              <p style="font-size:13px;color:var(--text3);margin-bottom:14px">
                Ce projet est open source. Pull requests et issues bienvenus !
              </p>
              <a v-if="p.github_link" :href="p.github_link" target="_blank" class="btn btn-outline" style="width:100%;justify-content:center">
                <span v-html="ICONS.github"/> Fork sur GitHub
              </a>
              <span v-else style="font-size:12px;color:var(--text5)">Lien GitHub non disponible</span>
            </div>

          </div>
        </div>

        <div v-if="p.description" class="prose" style="margin-top:48px" v-html="renderedDescription"/>

      </div>
    </div>

  </div>
</template>

<script>
import API from '@/services/api'
import { RouterLink } from 'vue-router'
import { ICONS } from '@/composables/icons'

export default {
  name: 'ProjectDetailPage',
  components: { RouterLink },

  data() {
    return {
      p:       null,
      loading: true,
      error:   null,
      ICONS,
    }
  },

  computed: {
    slugOrId() {
      return this.$route.params.slug || this.$route.params.id
    },

    renderedDescription() {
      if (!this.p?.description) return ''
      let md = this.p.description
      md = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        const escaped = code.trimEnd().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        return `<pre><code class="language-${lang || ''}">${escaped}</code></pre>`
      })
      md = md.replace(/^### (.+)$/gm, '<h3>$1</h3>')
      md = md.replace(/^## (.+)$/gm,  '<h2>$1</h2>')
      md = md.replace(/^# (.+)$/gm,   '<h1>$1</h1>')
      md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      md = md.replace(/\*(.+?)\*/g,     '<em>$1</em>')
      md = md.replace(/`([^`]+)`/g,     '<code>$1</code>')
      md = md.replace(/^- (.+)$/gm, '<li>$1</li>')
      md = md.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, s => `<ul>${s}</ul>`)
      md = md.replace(/\n\n(?!<)/g, '</p><p>')
      return '<p>' + md + '</p>'
    },
  },

  watch: {
    slugOrId(val) { if (val) this.fetchProject() },
  },

  methods: {
    async fetchProject() {
      this.loading = true; this.error = null; this.p = null
      try {
        const { data } = await API.get(`/v1/projects/${this.slugOrId}`)
        this.p = data
      } catch (e) {
        this.error = e.response?.status === 404
          ? 'Projet introuvable.'
          : 'Impossible de charger le projet.'
      } finally {
        this.loading = false
      }
    },

    statusLabel(status) { return { production:'En production', dev:'En dev', testing:'En test' }[status] || status },
    statusBadge(status) { return status === 'production' ? 'badge-green' : 'badge-orange' },
    levelLabel(level)   { return { debutant:'Débutant', intermediaire:'Intermédiaire', professionnel:'Pro' }[level] || level },
    userInitials(name)  {
      if (!name) return '?'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
  },

  created() {
    this.fetchProject()
  },
}
</script>

<style scoped>
.pd-hero  { display:grid; grid-template-columns:1fr 280px; gap:40px; align-items:start; }
.pdh-left { display:flex; flex-direction:column; gap:16px; }
.pd-ico   { width:56px; height:56px; border-radius:var(--radius); display:flex; align-items:center; justify-content:center; color:var(--text2); }
.pd-title { font-family:var(--font-alt); font-size:clamp(24px,3vw,36px); font-weight:800; color:var(--text); letter-spacing:-.8px; }
.pd-desc  { font-size:15px; color:var(--text3); line-height:1.7; }
.pd-tags  { display:flex; flex-wrap:wrap; gap:6px; }
.pd-stats { display:flex; gap:12px; flex-wrap:wrap; align-items:center; }
.pds      { display:flex; align-items:center; gap:5px; font-size:13.5px; color:var(--text2); font-weight:600; }
.pd-actions  { display:flex; gap:10px; flex-wrap:wrap; }
.pd-tc-title { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--text4); margin-bottom:12px; }
.pd-team     { display:flex; align-items:center; gap:10px; }
.level-badge         { font-size:11px; font-weight:600; padding:3px 10px; border-radius:99px; font-family:var(--font-mono); }
.level-debutant      { background:#dcfce7; color:#166534; }
.level-intermediaire { background:#fef9c3; color:#854d0e; }
.level-professionnel { background:#ede9fe; color:#5b21b6; }
.proj-state { display:flex; flex-direction:column; align-items:center; gap:12px; padding:80px 24px; text-align:center; color:var(--text3); }
.skel-line {
  background: linear-gradient(90deg, var(--surface2) 25%, var(--surface) 50%, var(--surface2) 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; display: block;
}
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
@media(max-width:800px) { .pd-hero { grid-template-columns:1fr; } }
</style>