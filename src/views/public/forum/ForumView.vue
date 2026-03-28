<template>
  <div class="section">
    <div class="container">
      <div class="forum-header">
        <div>
          <div class="section-tag"><span v-html="ICONS.forum"/> Forum</div>
          <div class="section-title">Questions & Réponses</div>
          <p class="section-sub">Partagez vos problèmes, trouvez des solutions avec la communauté.</p>
        </div>
        <RouterLink to="/register" class="btn btn-primary"><span v-html="ICONS.plus"/> Poser une question</RouterLink>
      </div>

      <div class="forum-layout">
        <div class="forum-main">
          <!-- Tabs -->
          <div class="tabs">
            <button v-for="t in tabs" :key="t" class="tab" :class="{active:activeTab===t}" @click="activeTab=t">{{ t }}</button>
          </div>

          <!-- Search -->
          <div class="forum-search">
            <span v-html="ICONS.search"/>
            <input v-model="search" placeholder="Rechercher une question..."/>
          </div>

          <!-- Posts -->
          <div class="forum-posts">
            <div v-for="post in filtered" :key="post.id" class="forum-post card">
              <div class="fp-votes">
                <div class="fp-vote-btn">▲</div>
                <div class="fp-vote-count">{{ Math.floor(Math.random()*20)+1 }}</div>
                <div class="fp-vote-btn">▼</div>
              </div>
              <div class="fp-body">
                <div class="fp-meta">
                  <span class="tag" style="font-family:var(--font-mono);font-size:11px">{{ post.category }}</span>
                  <span v-if="post.solved" class="badge badge-green" style="font-size:11px">✓ Résolu</span>
                </div>
                <h3 class="fp-title" @click="router.push('/forum')">{{ post.title }}</h3>
                <div class="fp-footer">
                  <div class="fp-author">
                    <div class="avatar avatar-sm" style="background:var(--surface2);color:var(--text2)">{{ post.author.initials }}</div>
                    <span>{{ post.author.name }}</span>
                    <span class="meta-dot"/>
                    <span>{{ post.date }}</span>
                  </div>
                  <div class="fp-stats">
                    <span><span v-html="ICONS.forum"/> {{ post.replies }} réponses</span>
                    <span class="meta-dot"/>
                    <span><span v-html="ICONS.eye"/> {{ post.views }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="forum-sidebar">
          <div class="card card-p" style="margin-bottom:16px">
            <h3 style="font-size:14px;font-weight:700;margin-bottom:14px">Catégories</h3>
            <div class="fc-list">
              <div v-for="c in categories" :key="c.name" class="fc-item" @click="activeCat===c.name ? activeCat='' : activeCat=c.name">
                <span class="tag" :class="{active:activeCat===c.name}" style="font-size:12px">{{ c.name }}</span>
                <span class="fc-count">{{ c.count }}</span>
              </div>
            </div>
          </div>
          <div class="card card-p">
            <h3 style="font-size:14px;font-weight:700;margin-bottom:14px">Rejoindre & contribuer</h3>
            <p style="font-size:13px;color:var(--text3);margin-bottom:14px;line-height:1.6">Créez un compte pour poser des questions, répondre et aider la communauté !</p>
            <RouterLink to="/register" class="btn btn-primary" style="width:100%;justify-content:center">Créer un compte</RouterLink>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ICONS } from '@/composables/icons'
import { FORUM_POSTS } from '@/composables/data'
const router = useRouter()
const activeTab = ref('Récentes')
const activeCat = ref('')
const search = ref('')
const tabs = ['Récentes', 'Non résolues', 'Populaires']
const categories = [
  { name:'DevOps', count:24 }, { name:'Backend', count:38 }, { name:'Frontend', count:31 },
  { name:'Mobile', count:18 }, { name:'API', count:22 }, { name:'Discussion', count:45 }, { name:'Carrière', count:29 },
]
const filtered = computed(() => {
  let list = FORUM_POSTS
  if (activeTab.value === 'Non résolues') list = list.filter(p => !p.solved)
  if (activeCat.value) list = list.filter(p => p.category === activeCat.value)
  if (search.value) list = list.filter(p => p.title.toLowerCase().includes(search.value.toLowerCase()))
  return list
})
</script>
<style scoped>
.forum-header { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:32px; flex-wrap:wrap; gap:16px; }
.forum-layout { display:grid; grid-template-columns:1fr 280px; gap:24px; align-items:start; }
.forum-search { display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); padding:9px 12px; margin-bottom:16px; color:var(--text3); }
.forum-search input { border:none; background:none; outline:none; font-size:13.5px; color:var(--text); font-family:var(--font-sans); flex:1; }
.forum-search input::placeholder { color:var(--text4); }
.forum-posts { display:flex; flex-direction:column; gap:10px; }
.forum-post { display:flex; gap:0; overflow:hidden; transition:box-shadow .15s; }
.forum-post:hover { box-shadow:var(--shadow-md); }
.fp-votes { display:flex; flex-direction:column; align-items:center; gap:4px; padding:16px 12px; background:var(--surface2); flex-shrink:0; border-right:1px solid var(--border2); min-width:52px; }
.fp-vote-btn { font-size:14px; color:var(--text4); cursor:pointer; padding:2px 4px; border-radius:3px; }
.fp-vote-btn:hover { color:var(--text); background:var(--surface); }
.fp-vote-count { font-size:14px; font-weight:700; color:var(--text2); }
.fp-body  { padding:16px; flex:1; }
.fp-meta  { display:flex; gap:8px; margin-bottom:8px; }
.fp-title { font-size:15px; font-weight:600; color:var(--text); cursor:pointer; line-height:1.4; margin-bottom:12px; }
.fp-title:hover { color:var(--blue); }
.fp-footer { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; }
.fp-author { display:flex; align-items:center; gap:7px; font-size:12.5px; color:var(--text3); }
.fp-stats  { display:flex; align-items:center; gap:8px; font-size:12.5px; color:var(--text4); }
.fp-stats span { display:flex; align-items:center; gap:4px; }
.fc-list  { display:flex; flex-direction:column; gap:6px; }
.fc-item  { display:flex; align-items:center; justify-content:space-between; cursor:pointer; }
.fc-count { font-size:12px; color:var(--text4); font-family:var(--font-mono); }
@media(max-width:900px) { .forum-layout { grid-template-columns:1fr; } .forum-sidebar { order:-1; } }
</style>
