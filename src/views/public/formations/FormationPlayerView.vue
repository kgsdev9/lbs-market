<template>
  <div class="fp-shell">

    <!-- ── LOADING ── -->
    <div v-if="loading" class="fp-loader">
      <div class="fp-spin" />
      <p>Chargement de la formation…</p>
    </div>

    <!-- ── 404 ── -->
    <div v-else-if="!formation" class="fp-notfound">
      <div style="font-size:52px">🎓</div>
      <h2>Formation introuvable</h2>
      <RouterLink to="/formations" class="btn btn-primary btn-sm">Retour</RouterLink>
    </div>

    <!-- ── CONTENU ── -->
    <template v-else>

      <!-- TOPBAR -->
      <div class="fp-topbar">
        <RouterLink :to="`/formations/view/${formation.slug}`" class="fp-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Retour
        </RouterLink>
        <div class="fp-topbar-center">
          <div class="fp-formation-title">{{ formation.title }}</div>
        </div>
        <div class="fp-topbar-progress">
          <div class="fp-tp-bar">
            <div class="fp-tp-fill" :style="{ width: globalProgress + '%' }" />
          </div>
          <span class="fp-tp-pct">{{ globalProgress }}%</span>
        </div>
      </div>

      <!-- BODY : sidebar + lecteur -->
      <div class="fp-body">

        <!-- ════ SIDEBAR GAUCHE ════ -->
        <aside class="fp-sidebar" :class="{ 'sidebar-open': sidebarOpen }">
          <div class="fp-sidebar-head">
            <div class="fp-sidebar-title">Contenu</div>
            <button class="fp-sidebar-close" @click="sidebarOpen = false">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div class="fp-modules">
            <div v-for="(mod, mi) in formation.modules" :key="mod.id" class="fp-module">
              <button class="fp-mod-head" :class="{ open: openMods.includes(mod.id) }" @click="toggleMod(mod.id)">
                <div class="fp-mod-left">
                  <span class="fp-mod-num">{{ mi + 1 }}</span>
                  <div>
                    <div class="fp-mod-title">{{ mod.title }}</div>
                    <div class="fp-mod-meta">
                      {{ doneInModule(mod) }}/{{ mod.lessons?.length || 0 }} leçon{{ mod.lessons?.length !== 1 ? 's' : '' }}
                    </div>
                  </div>
                </div>
                <svg class="fp-chevron" :class="{ rot: openMods.includes(mod.id) }" width="13" height="13"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <div v-if="openMods.includes(mod.id)" class="fp-lessons-list">
                <button v-for="(lesson, li) in (mod.lessons || [])" :key="lesson.id" class="fp-lesson-item" :class="{
                  'is-active': currentLesson?.id === lesson.id,
                  'is-done':   doneLessons.includes(lesson.id),
                }" @click="selectLesson(lesson, mod)">
                  <div class="fp-li-icon">
                    <svg v-if="doneLessons.includes(lesson.id)" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span v-else class="fp-li-type-icon">{{ typeIcon(lesson.type) }}</span>
                  </div>
                  <div class="fp-li-info">
                    <span class="fp-li-num">{{ mi + 1 }}.{{ li + 1 }}</span>
                    <span class="fp-li-title">{{ lesson.title }}</span>
                  </div>
                  <div class="fp-li-right">
                    <span v-if="lesson.is_free" class="fp-li-free">Gratuit</span>
                    <span v-if="lesson.duration" class="fp-li-dur">{{ lesson.duration }}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- Overlay mobile -->
        <div v-if="sidebarOpen" class="fp-overlay" @click="sidebarOpen = false" />

        <!-- ════ ZONE LECTEUR ════ -->
        <div class="fp-player">

          <!-- Pas de leçon sélectionnée -->
          <div v-if="!currentLesson" class="fp-welcome">
            <div class="fp-welcome-cover" :style="formation.image ? {} : { background: formation.cover_color || '#4f46e5' }">
              <img v-if="formation.image" :src="formation.image" :alt="formation.title" class="fp-welcome-img" />
              <span v-else style="font-size:60px">🎓</span>
            </div>
            <div class="fp-welcome-body">
              <h2 class="fp-welcome-title">{{ formation.title }}</h2>
              <p class="fp-welcome-sub">{{ formation.subtitle }}</p>
              <div class="fp-welcome-stats">
                <span>📚 {{ formation.modules?.length || 0 }} modules</span>
                <span class="fp-dot">·</span>
                <span>🎬 {{ totalLessons }} leçons</span>
                <span class="fp-dot">·</span>
                <span>⏱ {{ formation.duration || '—' }}</span>
              </div>
              <button v-if="firstLesson" class="btn btn-primary" @click="selectLesson(firstLesson, formation.modules[0])">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Commencer la formation
              </button>
            </div>
          </div>

          <!-- Leçon en cours -->
          <template v-else>

            <!-- Breadcrumb -->
            <div class="fp-lesson-bc">
              <button class="fp-menu-btn" @click="sidebarOpen = true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <span class="fp-bc-mod">{{ currentMod?.title }}</span>
              <span class="fp-bc-sep">›</span>
              <span class="fp-bc-lesson">{{ currentLesson.title }}</span>
            </div>

            <!-- Vidéo -->
            <div v-if="currentLesson.type === 'video' || (currentLesson.type === 'mixed' && currentLesson.video_url)" class="fp-video-wrap">
              <div v-if="currentLesson.video_url" class="fp-video-container">
                <iframe :src="embedUrl(currentLesson.video_url)" class="fp-video-iframe" frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen />
              </div>
              <div v-else class="fp-video-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
                </svg>
                <p>Vidéo non disponible</p>
              </div>
            </div>

            <!-- PDF -->
            <div v-if="currentLesson.type === 'pdf'" class="fp-pdf-wrap">
              <div class="fp-pdf-icon">📄</div>
              <div class="fp-pdf-title">{{ currentLesson.title }}</div>
              <p class="fp-pdf-sub">Document PDF disponible ci-dessous</p>
            </div>

            <!-- Quiz -->
            <div v-if="currentLesson.type === 'quiz'" class="fp-quiz-wrap">
              <div class="fp-quiz-icon">📝</div>
              <div class="fp-quiz-title">Quiz — {{ currentLesson.title }}</div>
              <p class="fp-quiz-sub">Testez vos connaissances sur ce module</p>
            </div>

            <!-- Contenu Markdown -->
            <div v-if="currentLesson.content" class="fp-content-section">
              <div class="fp-content-header">
                <h2 class="fp-content-title">{{ currentLesson.title }}</h2>
                <span class="fp-content-type-badge">{{ typeLabel(currentLesson.type) }}</span>
              </div>
              <div class="fp-md-content" v-html="renderMd(currentLesson.content)" />
            </div>

            <!-- Actions -->
            <div class="fp-lesson-actions">
              <div class="fp-nav-btns">
                <button class="fp-nav-btn" :disabled="!prevLesson" @click="goTo(prevLesson)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Précédent
                </button>
                <button class="fp-nav-btn fp-nav-btn--next" :disabled="!nextLesson" @click="goTo(nextLesson)">
                  Suivant
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              <div class="fp-done-block">
                <button v-if="!doneLessons.includes(currentLesson.id)" class="fp-done-btn" :disabled="markingDone" @click="markDone">
                  <span v-if="markingDone" class="fp-mini-spin" />
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Marquer comme terminé
                </button>
                <div v-else class="fp-done-check">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Leçon terminée
                </div>
              </div>
            </div>

          </template>
        </div>

      </div>
    </template>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
import API from '@/services/api'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import php from 'highlight.js/lib/languages/php'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('php', php)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('html', xml)

export default {
  name: 'FormationPlayerView',
  components: { RouterLink },

  data() {
    return {
      formation:      null,
      doneLessons:    [],
      loading:        true,
      sidebarOpen:    false,
      openMods:       [],
      currentLesson:  null,
      currentMod:     null,
      markingDone:    false,
      allLessonsFlat: [],
    }
  },

  computed: {
    totalLessons() {
      if (!this.formation?.modules?.length) return 0
      return this.formation.modules.reduce((s, m) => s + (m.lessons?.length || 0), 0)
    },

    globalProgress() {
      if (!this.totalLessons) return 0
      return Math.round((this.doneLessons.length / this.totalLessons) * 100)
    },

    firstLesson() {
      return this.formation?.modules?.[0]?.lessons?.[0] || null
    },

    currentIndex() {
      if (!this.currentLesson) return -1
      return this.allLessonsFlat.findIndex(l => l.lesson.id === this.currentLesson.id)
    },

    prevLesson() {
      const i = this.currentIndex
      return i > 0 ? this.allLessonsFlat[i - 1] : null
    },

    nextLesson() {
      const i = this.currentIndex
      return i >= 0 && i < this.allLessonsFlat.length - 1 ? this.allLessonsFlat[i + 1] : null
    },
  },

  methods: {
    async fetchFormation() {
      this.loading = true
      try {
        const { data } = await API.get(`/v1/formations/${this.$route.params.slug}`)
        this.formation = data

        // Ouvrir tous les modules par défaut
        this.openMods = (data.modules || []).map(m => m.id)

        // Construire la liste plate des leçons
        this.allLessonsFlat = []
        for (const mod of (data.modules || [])) {
          for (const lesson of (mod.lessons || [])) {
            this.allLessonsFlat.push({ lesson, mod })
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    selectLesson(lesson, mod) {
      this.currentLesson = lesson
      this.currentMod    = mod
      this.sidebarOpen   = false
      this.saveLastLesson(lesson.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    async saveLastLesson(lessonId) {
      try {
        await API.patch(`/v1/formations/${this.formation.id}/last-lesson`, {
          lesson_id: lessonId,
        })
      } catch { /* silencieux */ }
    },

    async markDone() {
      if (!this.currentLesson || this.doneLessons.includes(this.currentLesson.id)) return
      this.markingDone = true
      try {
        await API.post(`/v1/lessons/${this.currentLesson.id}/complete`)
        this.doneLessons.push(this.currentLesson.id)
        if (this.nextLesson) {
          setTimeout(() => this.goTo(this.nextLesson), 600)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.markingDone = false
      }
    },

    goTo(item) {
      if (!item) return
      this.selectLesson(item.lesson, item.mod)
    },

    toggleMod(id) {
      const i = this.openMods.indexOf(id)
      if (i > -1) this.openMods.splice(i, 1)
      else this.openMods.push(id)
    },

    doneInModule(mod) {
      return (mod.lessons || []).filter(l => this.doneLessons.includes(l.id)).length
    },

    embedUrl(url) {
      if (!url) return ''
      const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)
      if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`
      const viMatch = url.match(/vimeo\.com\/(\d+)/)
      if (viMatch) return `https://player.vimeo.com/video/${viMatch[1]}`
      return url
    },

    typeIcon(type) {
      return { video: '▶', pdf: '📄', quiz: '📝', mixed: '🔀' }[type] || '▶'
    },

    typeLabel(type) {
      return { video: 'Vidéo', pdf: 'PDF', quiz: 'Quiz', mixed: 'Mixte' }[type] || 'Leçon'
    },

    renderMd(md) {
      if (!md) return ''
      md = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        const l = lang || 'plaintext'; let h
        try { h = hljs.highlight(code.trimEnd(), { language: l }).value }
        catch { h = code.trimEnd().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') }
        return `<pre style="margin:14px 0;border-radius:10px;overflow:hidden"><code class="hljs language-${l}" style="display:block;padding:16px;font-size:13px;line-height:1.7;background:#0d1117;font-family:monospace">${h}</code></pre>`
      })
      let n = 0
      md = md.replace(/^## (.+)$/gm, (_, t) => {
        n++
        return `<h2 style="font-size:18px;font-weight:700;margin:22px 0 12px;color:var(--text);display:flex;align-items:center;gap:8px"><span style="display:inline-flex;align-items:center;justify-content:center;min-width:26px;height:26px;padding:0 6px;background:#18181b;color:#fff;font-size:11px;font-weight:700;border-radius:5px;font-family:monospace">${n}</span>${t}</h2>`
      })
      md = md.replace(/^### (.+)$/gm, '<h3 style="font-size:15px;font-weight:700;margin:16px 0 8px;color:var(--text)">$1</h3>')
      md = md.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;color:var(--text)">$1</strong>')
      md = md.replace(/\*(.+?)\*/g, '<em>$1</em>')
      md = md.replace(/`([^`]+)`/g, '<code style="background:var(--surface2);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:13px;color:#e06c75">$1</code>')
      md = md.replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #4f46e5;padding:10px 16px;margin:14px 0;background:rgba(79,70,229,.06);border-radius:0 8px 8px 0;color:var(--text3);font-style:italic">$1</blockquote>')
      md = md.replace(/^- (.+)$/gm, '<li style="margin:6px 0;color:var(--text2);padding-left:4px">$1</li>')
      md = md.replace(/(<li[\s\S]*?<\/li>\n?)+/g, s => `<ul style="padding-left:18px;margin:12px 0;list-style:disc">${s}</ul>`)
      md = md.replace(/\n\n(?!<)/g, '</p><p style="margin:10px 0;color:var(--text2);line-height:1.85">')
      return '<p style="margin:10px 0;color:var(--text2);line-height:1.85">' + md + '</p>'
    },
  },

  mounted() {
    this.fetchFormation()
  },

  watch: {
    '$route.params.slug'() { this.fetchFormation() },
  },
}
</script>

<style src="highlight.js/styles/github-dark.css" />
<style scoped>
.fp-shell { display:flex;flex-direction:column;height:100vh;overflow:hidden;background:var(--surface,#f8f9fb); }
.fp-loader { display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;gap:14px;font-size:14px;color:var(--text3,#888); }
.fp-spin { width:36px;height:36px;border:3px solid var(--border,#e5e7eb);border-top-color:#4f46e5;border-radius:50%;animation:spin .7s linear infinite; }
.fp-notfound { display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;gap:12px;text-align:center; }
.fp-notfound h2 { font-size:20px;font-weight:700;color:var(--text); }
.fp-topbar { display:flex;align-items:center;gap:14px;padding:0 20px;height:54px;flex-shrink:0;background:var(--surface,#fff);border-bottom:1px solid var(--border,#e5e7eb); }
.fp-back { display:flex;align-items:center;gap:5px;font-size:13px;font-weight:600;color:var(--text3);text-decoration:none;padding:5px 10px;border-radius:7px;transition:all .15s;flex-shrink:0; }
.fp-back:hover { background:var(--surface2);color:var(--text); }
.fp-topbar-center { flex:1;min-width:0; }
.fp-formation-title { font-size:14px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.fp-topbar-progress { display:flex;align-items:center;gap:8px;flex-shrink:0; }
.fp-tp-bar { width:120px;height:6px;background:var(--border,#e5e7eb);border-radius:99px;overflow:hidden; }
.fp-tp-fill { height:100%;background:#4f46e5;border-radius:99px;transition:width .4s ease; }
.fp-tp-pct { font-size:12px;font-weight:700;color:var(--text3);min-width:32px; }
.fp-body { display:flex;flex:1;overflow:hidden;position:relative; }
.fp-sidebar { width:300px;flex-shrink:0;display:flex;flex-direction:column;background:var(--surface,#fff);border-right:1px solid var(--border,#e5e7eb);overflow-y:auto; }
.fp-sidebar::-webkit-scrollbar { width:3px; }
.fp-sidebar::-webkit-scrollbar-thumb { background:var(--border2);border-radius:2px; }
.fp-sidebar-head { display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--border2);flex-shrink:0; }
.fp-sidebar-title { font-size:13px;font-weight:700;color:var(--text); }
.fp-sidebar-close { display:none;border:none;background:none;cursor:pointer;color:var(--text3);padding:4px;border-radius:6px; }
.fp-sidebar-close:hover { background:var(--surface2); }
.fp-modules { display:flex;flex-direction:column; }
.fp-mod-head { width:100%;display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--surface2,#f8f9fb);border:none;border-bottom:1px solid var(--border2);cursor:pointer;text-align:left;transition:background .12s; }
.fp-mod-head:hover { background:var(--surface,#f0f2f5); }
.fp-mod-head.open { background:var(--surface,#fff); }
.fp-mod-left { display:flex;align-items:center;gap:10px; }
.fp-mod-num { width:24px;height:24px;border-radius:6px;background:#4f46e5;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0; }
.fp-mod-title { font-size:13px;font-weight:700;color:var(--text);line-height:1.3; }
.fp-mod-meta { font-size:11px;color:var(--text5);margin-top:1px; }
.fp-chevron { color:var(--text4);transition:transform .2s;flex-shrink:0; }
.fp-chevron.rot { transform:rotate(180deg); }
.fp-lessons-list { display:flex;flex-direction:column;border-bottom:1px solid var(--border2); }
.fp-lesson-item { display:flex;align-items:center;gap:10px;padding:10px 14px;border:none;background:none;cursor:pointer;text-align:left;transition:background .1s;border-bottom:1px solid var(--border2); }
.fp-lesson-item:last-child { border-bottom:none; }
.fp-lesson-item:hover { background:var(--surface2,#f8f9fb); }
.fp-lesson-item.is-active { background:rgba(79,70,229,.07); }
.fp-li-icon { width:26px;height:26px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--surface2,#f4f5f8);color:var(--text4);font-size:11px; }
.is-done .fp-li-icon { background:#f0fdf4;color:#16a34a; }
.is-active .fp-li-icon { background:rgba(79,70,229,.12);color:#4f46e5; }
.fp-li-type-icon { font-size:10px; }
.fp-li-info { display:flex;align-items:center;gap:6px;flex:1;min-width:0; }
.fp-li-num { font-size:10px;color:var(--text5);font-weight:600;flex-shrink:0;font-family:monospace; }
.fp-li-title { font-size:12.5px;color:var(--text2);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.is-active .fp-li-title { color:#4f46e5;font-weight:700; }
.is-done .fp-li-title { color:var(--text3); }
.fp-li-right { display:flex;align-items:center;gap:4px;flex-shrink:0; }
.fp-li-free { font-size:9px;font-weight:700;color:#16a34a;background:rgba(22,163,74,.1);padding:1px 5px;border-radius:10px; }
.fp-li-dur { font-size:10.5px;color:var(--text5); }
.fp-overlay { display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:49; }
.fp-player { flex:1;overflow-y:auto;display:flex;flex-direction:column; }
.fp-player::-webkit-scrollbar { width:4px; }
.fp-player::-webkit-scrollbar-thumb { background:var(--border2);border-radius:2px; }
.fp-welcome { display:flex;flex-direction:column;align-items:center;flex:1; }
.fp-welcome-cover { width:100%;max-height:280px;display:flex;align-items:center;justify-content:center;overflow:hidden; }
.fp-welcome-img { width:100%;height:280px;object-fit:cover; }
.fp-welcome-body { max-width:600px;padding:40px 24px;text-align:center; }
.fp-welcome-title { font-size:24px;font-weight:800;color:var(--text);margin-bottom:10px; }
.fp-welcome-sub { font-size:14.5px;color:var(--text3);line-height:1.6;margin-bottom:16px; }
.fp-welcome-stats { display:flex;align-items:center;justify-content:center;gap:8px;font-size:13px;color:var(--text4);margin-bottom:24px;flex-wrap:wrap; }
.fp-dot { opacity:.4; }
.fp-lesson-bc { display:flex;align-items:center;gap:8px;padding:10px 20px;border-bottom:1px solid var(--border2);flex-shrink:0;background:var(--surface,#fff);font-size:12.5px;color:var(--text4);flex-wrap:wrap; }
.fp-menu-btn { display:none;border:none;background:none;cursor:pointer;color:var(--text3);padding:4px;border-radius:6px;margin-right:4px; }
.fp-menu-btn:hover { background:var(--surface2); }
.fp-bc-mod { font-weight:600;color:var(--text3); }
.fp-bc-sep { opacity:.4; }
.fp-bc-lesson { color:var(--text);font-weight:600; }
.fp-video-wrap { background:#000; }
.fp-video-container { position:relative;padding-top:56.25%; }
.fp-video-iframe { position:absolute;inset:0;width:100%;height:100%; }
.fp-video-placeholder { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:60px;color:var(--text4);background:#111; }
.fp-video-placeholder p { font-size:14px; }
.fp-pdf-wrap,.fp-quiz-wrap { display:flex;flex-direction:column;align-items:center;gap:10px;padding:60px 24px;border-bottom:1px solid var(--border2); }
.fp-pdf-icon,.fp-quiz-icon { font-size:52px; }
.fp-pdf-title,.fp-quiz-title { font-size:18px;font-weight:700;color:var(--text); }
.fp-pdf-sub,.fp-quiz-sub { font-size:14px;color:var(--text3); }
.fp-content-section { padding:28px 32px;max-width:820px; }
.fp-content-header { display:flex;align-items:center;gap:12px;margin-bottom:20px; }
.fp-content-title { font-size:20px;font-weight:800;color:var(--text); }
.fp-content-type-badge { font-size:11px;font-weight:700;padding:3px 9px;border-radius:20px;background:rgba(79,70,229,.1);color:#4f46e5; }
.fp-md-content { font-size:15px;line-height:1.85;color:var(--text2); }
.fp-lesson-actions { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:20px 32px;border-top:1px solid var(--border2);background:var(--surface,#fff);margin-top:auto;flex-shrink:0; }
.fp-nav-btns { display:flex;gap:8px; }
.fp-nav-btn { display:flex;align-items:center;gap:6px;padding:9px 16px;border-radius:8px;border:1.5px solid var(--border);background:var(--surface);font-size:13px;font-weight:600;color:var(--text3);cursor:pointer;transition:all .15s; }
.fp-nav-btn:hover:not(:disabled) { border-color:var(--text3);color:var(--text); }
.fp-nav-btn:disabled { opacity:.35;cursor:not-allowed; }
.fp-nav-btn--next { background:var(--text);color:var(--surface);border-color:var(--text); }
.fp-nav-btn--next:hover:not(:disabled) { opacity:.85; }
.fp-done-block { display:flex;align-items:center; }
.fp-done-btn { display:flex;align-items:center;gap:7px;padding:9px 18px;border-radius:8px;background:#4f46e5;color:#fff;border:none;font-size:13px;font-weight:700;cursor:pointer;transition:all .15s; }
.fp-done-btn:hover:not(:disabled) { background:#4338ca; }
.fp-done-btn:disabled { opacity:.6;cursor:not-allowed; }
.fp-done-check { display:flex;align-items:center;gap:7px;padding:9px 16px;border-radius:8px;background:#f0fdf4;color:#16a34a;border:1px solid #86efac;font-size:13px;font-weight:700; }
.fp-mini-spin { width:13px;height:13px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

@media (max-width:768px) {
  .fp-sidebar { position:fixed;left:-100%;top:0;bottom:0;z-index:50;transition:left .3s ease;width:280px;box-shadow:4px 0 24px rgba(0,0,0,.15); }
  .fp-sidebar.sidebar-open { left:0; }
  .fp-sidebar-close { display:flex !important; }
  .fp-overlay { display:block; }
  .fp-menu-btn { display:flex !important; }
  .fp-topbar-progress { display:none; }
  .fp-content-section { padding:20px 16px; }
  .fp-lesson-actions { padding:16px; }
}
@media (max-width:540px) {
  .fp-lesson-actions { flex-direction:column;align-items:stretch; }
  .fp-nav-btns { justify-content:space-between; }
  .fp-done-btn,.fp-done-check { justify-content:center; }
}
</style>