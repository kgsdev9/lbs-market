<template>
  <div class="mob-root">

    <!-- ── TOPBAR ── -->
    <div class="mob-topbar">
      <div class="mob-topbar-left">
        <div class="mob-logo">📄</div>
        <div>
          <div class="mob-title">Mon CV </div>
          <div class="mob-sub" v-if="cv.firstName">{{ cv.firstName }} {{ cv.lastName }}</div>
          <div class="mob-sub" v-else>Chargement...</div>
        </div>
      </div>
      <div class="mob-topbar-right">
        <select v-model="selectedTpl" class="mob-tpl-select" @change="onTplChange">
          <option v-for="t in templates" :key="t.id" :value="t.id">{{ t.name }}</option>
        </select>
        <button class="mob-btn-pdf" @click="downloadPDF" :disabled="exporting || loading">
          <span v-if="exporting" class="spin"></span>
          <span v-else>📥</span>
          {{ exporting ? 'Export...' : 'PDF' }}
        </button>
      </div>
    </div>

    <!-- ── LOADER ── -->
    <div v-if="loading" class="mob-loader">
      <div class="mob-spinner"></div>
      <p>Chargement du CV...</p>
    </div>

    <!-- ── ERREUR ── -->
    <div v-else-if="error" class="mob-error">
      <div style="font-size:40px">⚠️</div>
      <p>{{ error }}</p>
    </div>

    <!-- ── APERÇU CV ── -->
    <div v-else class="mob-preview-wrap">
      <div class="mob-colors">
        <button v-for="c in colorPresets" :key="c" class="mob-color-dot"
          :style="{ background: c, outline: accentColor === c ? `3px solid ${c}` : 'none', outlineOffset: '2px' }"
          @click="accentColor = c" />
      </div>
      <div class="mob-stage" ref="previewStage">
        <div class="mob-scale-wrap" :style="{ transform: `scale(${zoom})`, transformOrigin: 'top center' }">
          <template-cv :cv="cvForTemplate" :selected-tpl="selectedTpl" :accent-color="accentColor" />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import API from '@/services/api'
import TemplateCv from './Templatecv.vue'

export default {
  name: 'CvMobileView',
  components: { TemplateCv },

  data() {
    return {
      loading: true,
      error: null,
      exporting: false,
      selectedTpl: 'classic',
      accentColor: '#2563eb',
      zoom: 0.45,
      cv: {
        firstName: '', lastName: '', dateNaissance: '', title: '',
        email: '', phone: '', city: '', country: '', website: '',
        summary: '', photo: '', photoUrl: '',
        experiences: [], education: [], skills: [], languages: [],
        projects: [], centresInteret: [], aptitudes: [],
      },
      templates: [
         { id:'classic',   name:'Classique',    defaultAccent:'#2563eb' },
        { id:'minimal',   name:'Minimaliste',  defaultAccent:'#111827' },
        { id:'modern',    name:'Moderne',      defaultAccent:'#7c3aed' },
        { id: 'executive', name: 'Executive', defaultAccent: '#c5982a' },
        { id:'corporate', name:'Corporate',    defaultAccent:'#0f766e' },
        { id:'elegant',   name:'Élégant',      defaultAccent:'#b45309' },
        { id:'dark',      name:'Dark',         defaultAccent:'#6366f1' },
        { id:'timeline',  name:'Timeline',     defaultAccent:'#0891b2' },
        { id:'swiss',     name:'Swiss',        defaultAccent:'#e11d48' },
        { id:'creative',  name:'Créatif',      defaultAccent:'#7c3aed' },
        { id:'tech',      name:'Tech',         defaultAccent:'#22c55e' },
        { id:'academic',  name:'Académique',   defaultAccent:'#1d4ed8' },
        { id:'luxury',    name:'Luxe',         defaultAccent:'#92400e' },
        { id:'gradient',  name:'Gradient',     defaultAccent:'#4f46e5' },
        { id:'compact',   name:'Compact Pro',  defaultAccent:'#0e7490' },
        { id: 'vladimir', name: 'Vladimir', defaultAccent: '#e8950a' },
        { id: 'neondark', name: 'Neon Dark', defaultAccent: '#22d3ee' },
     
      ],
      colorPresets: [
        '#2563eb', '#4f46e5', '#7c3aed', '#db2777',
        '#dc2626', '#e11d48', '#ea580c', '#b45309',
        '#16a34a', '#059669', '#0f766e', '#0891b2',
        '#22c55e', '#475569', '#111827',
      ],
    }
  },

  computed: {
    cvForTemplate() {
      return {
        ...this.cv,
        experiences: this.cv.experiences.map(e => ({
          ...e,
          bullets: e.bullets || [],
          description: e.descMode === 'text' ? (e.description || '') : '',
        })),
      }
    },
  },

  async created() {
    const hash = window.location.hash
    const search = hash.includes('?') ? hash.split('?')[1] : window.location.search
    const params = new URLSearchParams(search)
    const mobileToken = params.get('mobile_token')
    if (mobileToken) {
      localStorage.setItem('lbs_token', mobileToken)
    }
    await this.loadProfile()
    this.$nextTick(() => this.fitZoom())
  },

  mounted() {
    window.addEventListener('resize', this.fitZoom)
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.fitZoom)
  },

  methods: {
    fitZoom() {
      const stage = this.$refs.previewStage
      if (!stage) return
      const w = stage.clientWidth || window.innerWidth
      this.zoom = Math.min((w - 16) / 794, 1)
    },

    onTplChange() {
      const t = this.templates.find(t => t.id === this.selectedTpl)
      if (t) this.accentColor = t.defaultAccent
    },

    async loadProfile() {
      this.loading = true
      this.error = null
      try {
        const { data } = await API.get('/cv-profiles/mine')
        this.selectedTpl = data.template || 'classic'
        this.accentColor = data.accentColor || '#2563eb'
        this.cv = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          dateNaissance: data.dateNaissance || '',
          title: data.title || '',
          email: data.email || '',
          phone: data.phone || '',
          city: data.city || '',
          country: data.country || '',
          website: data.website || '',
          summary: data.summary || '',
          photo: data.photo || '',
          photoUrl: data.photo || '',
          experiences: (data.experiences || []).map(e => ({
            position: e.position || '', company: e.company || '',
            startDate: e.startDate || '', endDate: e.endDate || '',
            description: e.description || '',
            descMode: 'bullets',
            bullets: e.description
              ? e.description.split('\n').filter(l => l.trim()).map(l => l.replace(/^[-•*]\s*/, ''))
              : [''],
          })),
          education: (data.education || []).map(e => ({ degree: e.degree || '', school: e.school || '', year: e.year || '', anneeDebut: e.anneeDebut || '', anneeFin: e.anneeFin || '' })),
          skills: (data.skills || []).map(s => ({ name: s.name || '', level: s.level || 3 })),
          languages: (data.languages || []).map(l => ({ name: l.name || '', level: l.level || 'Courant' })),
          projects: (data.projects || []).map(p => ({ name: p.name || '', tech: p.tech || '', description: p.description || '', url: p.url || '' })),
          centresInteret: (data.centresInteret || []).map(c => ({ name: c.name || '' })),
          aptitudes: (data.aptitudes || []).map(a => ({ name: a.name || '', level: a.level || 3 })),
        }
      } catch (e) {
        this.error = 'Impossible de charger le CV. Vérifie ta connexion.'
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    // ── Export PDF ────────────────────────────────────────────────────────────
   async downloadPDF() {
  this.exporting = true
  const prevZoom = this.zoom
  try {
    // ── Charger html2canvas ──
    if (!window.html2canvas) {
      await new Promise((ok, ko) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
        s.onload = ok; s.onerror = ko
        document.head.appendChild(s)
      })
    }
    // ── Charger jsPDF ──
    if (!window.jspdf) {
      await new Promise((ok, ko) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        s.onload = ok; s.onerror = ko
        document.head.appendChild(s)
      })
    }
    // ── Photo → base64 ──
    let photoBackup = null
    if (this.cv.photo && this.cv.photo.startsWith('http')) {
      photoBackup = this.cv.photo
      try {
        this.cv.photo = await this.toBase64(this.cv.photo)
        await this.$nextTick()
      } catch (e) { console.warn('Photo base64 failed:', e) }
    }
    // ── Zoom = 1 ──
    this.zoom = 1
    await this.$nextTick()
    await new Promise(r => setTimeout(r, 600))

    // ── Forcer largeur A4 ──
    const el = document.getElementById('cv-render')
    const orig = {
      width: el.style.width,
      minHeight: el.style.minHeight,
      maxHeight: el.style.maxHeight,
      fontSize: el.style.fontSize,
      position: el.style.position,
      overflow: el.style.overflow,
    }
    el.style.width     = '794px'
    el.style.minHeight = '1123px'
    el.style.maxHeight = 'none'
    el.style.fontSize  = '13px'
    el.style.position  = 'relative'
    el.style.overflow  = 'visible'
    await new Promise(r => setTimeout(r, 300))

    // ── Hauteur réelle sans padding parasite ──
    const realHeight = Math.max(el.offsetHeight, el.scrollHeight)

    // ── Capturer ──
    const canvas = await window.html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: realHeight,
      windowWidth: 794,
      windowHeight: realHeight,
      scrollX: 0,
      scrollY: -window.scrollY,
      logging: false,
      imageTimeout: 15000,
      removeContainer: true,
      onclone: (doc) => {
        const cel = doc.getElementById('cv-render')
        if (cel) {
          cel.style.webkitFontSmoothing = 'antialiased'
          cel.style.textRendering       = 'optimizeLegibility'
          cel.style.transform           = 'none'
          cel.style.willChange          = 'auto'
          cel.style.filter              = 'none'
          cel.style.overflow            = 'visible'
          cel.style.maxHeight           = 'none'
        }
      }
    })

    // ── Générer PDF ──
    const { jsPDF } = window.jspdf
    const pdf    = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
    const pageW  = pdf.internal.pageSize.getWidth()   // 210mm
    const pageH  = pdf.internal.pageSize.getHeight()  // 297mm
    const pxToMm = pageW / 794
    const totalHeightMm = realHeight * pxToMm

    // Tolérance 5mm pour éviter une page vide pour quelques pixels de trop
    const pages = totalHeightMm > (pageH + 5) ? Math.ceil(totalHeightMm / pageH) : 1

    for (let i = 0; i < pages; i++) {
      if (i > 0) pdf.addPage()
      const ratio       = canvas.width / 794
      const sliceY      = Math.round((i * pageH / pxToMm) * ratio)
      const sliceHeight = Math.round((pageH / pxToMm) * ratio)

      const pageCanvas      = document.createElement('canvas')
      pageCanvas.width      = canvas.width
      pageCanvas.height     = sliceHeight

      const ctx = pageCanvas.getContext('2d')
      ctx.drawImage(
        canvas,
        0, sliceY,
        canvas.width, sliceHeight,
        0, 0,
        pageCanvas.width, pageCanvas.height
      )
      pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, pageW, pageH, undefined, 'FAST')
    }

    // ── Envoi ──
    const filename = `CV_${this.cv.firstName || 'CV'}_${this.cv.lastName || ''}.pdf`

    let rnWebView = window.ReactNativeWebView
    if (!rnWebView) {
      await new Promise(resolve => {
        let tries = 0
        const interval = setInterval(() => {
          tries++
          if (window.ReactNativeWebView) {
            rnWebView = window.ReactNativeWebView
            clearInterval(interval)
            resolve(null)
          } else if (tries > 30) {
            clearInterval(interval)
            resolve(null)
          }
        }, 100)
      })
    }

    if (rnWebView) {
      const pdfBase64 = pdf.output('datauristring')
      rnWebView.postMessage(JSON.stringify({
        type:     'PDF_READY',
        base64:   pdfBase64,
        filename: filename,
      }))
    } else {
      pdf.save(filename)
    }

    // ── Restaurer ──
    el.style.width     = orig.width
    el.style.minHeight = orig.minHeight
    el.style.maxHeight = orig.maxHeight
    el.style.fontSize  = orig.fontSize
    el.style.position  = orig.position
    el.style.overflow  = orig.overflow
    if (photoBackup) {
      this.cv.photo    = photoBackup
      this.cv.photoUrl = photoBackup
    }
  } catch (e) {
    console.error('PDF error:', e)
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type:    'PDF_ERROR',
        message: String(e),
      }))
    } else {
      alert('Erreur lors de la génération du PDF. Réessaie.')
    }
  } finally {
    this.zoom      = prevZoom
    this.exporting = false
  }
},

    toBase64(url) {
      return new Promise((resolve, reject) => {
        API.get('/proxy-image', { params: { url }, responseType: 'arraybuffer' })
          .then(r => {
            const b = new Uint8Array(r.data)
            let s = ''
            b.forEach(x => s += String.fromCharCode(x))
            resolve(`data:${r.headers['content-type'] || 'image/jpeg'};base64,${window.btoa(s)}`)
          })
          .catch(() => {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {
              const c = document.createElement('canvas')
              c.width = img.naturalWidth || 300
              c.height = img.naturalHeight || 300
              c.getContext('2d').drawImage(img, 0, 0)
              resolve(c.toDataURL('image/jpeg', 0.92))
            }
            img.onerror = reject
            img.src = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now()
          })
      })
    },
  },
}
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.mob-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f4f5f7;
  font-family: 'DM Sans', 'Segoe UI', Arial, sans-serif;
}

.mob-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #111827;
  gap: 10px;
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
}

.mob-topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mob-topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.mob-logo {
  font-size: 22px;
}

.mob-title {
  font-size: 14px;
  font-weight: 800;
  color: #fff;
}

.mob-sub {
  font-size: 10px;
  color: #9ca3af;
  margin-top: 1px;
}

.mob-tpl-select {
  padding: 6px 8px;
  border-radius: 8px;
  border: 1.5px solid #374151;
  background: #1f2937;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  max-width: 110px;
}

.mob-btn-pdf {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
  border: none;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
}

.mob-btn-pdf:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mob-btn-pdf:active {
  opacity: 0.85;
}

.mob-loader {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #6b7280;
  font-size: 14px;
}

.mob-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.mob-error {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #ef4444;
  font-size: 13px;
  padding: 24px;
  text-align: center;
}

.mob-preview-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mob-colors {
  display: flex;
  gap: 8px;
  padding: 8px 14px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;
  flex-shrink: 0;
}

.mob-color-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform .15s;
}

.mob-color-dot:hover {
  transform: scale(1.2);
}

.mob-stage {
  flex: 1;
  overflow: auto;
  padding: 12px 8px 24px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #e8eaed;
}

.mob-scale-wrap {
  display: inline-block;
  transform-origin: top center;
}

.spin {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, .4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .6s linear infinite;
}
</style>