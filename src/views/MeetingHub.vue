<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Code, 
  Film, 
  Users, 
  Video, 
  Search, 
  Calendar, 
  ChevronRight,
  ArrowRight,
  Clock,
  Play,
  Monitor,
  Cpu,
  Lock
} from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleJoin = (path) => {
  if (authStore.isPremium) {
    router.push(path)
  } else if (authStore.isAuthenticated) {
    router.push({ path: '/payment', query: { redirect: path } })
  } else {
    router.push({ path: '/login', query: { redirect: path } })
  }
}
const typedText = ref('')
const fullWords = ['Meeting Hubs', 'Collab Spaces', 'Sync Rooms']
const currentWordIndex = ref(0)
const isDeleting = ref(false)
const typingSpeed = ref(150)

const typeEffect = () => {
  const currentFullText = fullWords[currentWordIndex.value]
  
  if (isDeleting.value) {
    typedText.value = currentFullText.substring(0, typedText.value.length - 1)
    typingSpeed.value = 75
  } else {
    typedText.value = currentFullText.substring(0, typedText.value.length + 1)
    typingSpeed.value = 150
  }

  if (!isDeleting.value && typedText.value === currentFullText) {
    isDeleting.value = true
    typingSpeed.value = 2000 
  } else if (isDeleting.value && typedText.value === '') {
    isDeleting.value = false
    currentWordIndex.value = (currentWordIndex.value + 1) % fullWords.length
    typingSpeed.value = 500
  }

  setTimeout(typeEffect, typingSpeed.value)
}

onMounted(() => {
  typeEffect()
})

const liveSessions = ref([])
</script>

<template>
  <div class="meeting-hub">
    <!-- Header -->
    <header class="hub-hero" :style="{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000')` }">
      <div class="container text-center reveal">
        <span class="hub-tag">PEAK SYNCHRONICITY</span>
        <h1 class="text-white">Specialized <span class="accent-text">{{ typedText }}<span class="cursor">|</span></span></h1>
        <p class="hero-desc mx-auto text-white-dim">High-performance environments designed for technical and creative collaboration. Join the room that fits your workflow.</p>
        
        <div class="search-container mx-auto mt-10 reveal" style="animation-delay: 0.1s">
          <div class="premium-search">
            <Search :size="18" class="s-icon" />
            <input type="text" placeholder="Search for rooms, teams, or schedules..." />
            <button class="btn-search">Search Hub</button>
          </div>
        </div>
      </div>
    </header>

    <!-- Rooms Explorer -->
    <section class="rooms-explorer container">
      <div class="section-header reveal">
        <span class="section-tag">CHAMBERS</span>
        <h2>Active <span class="accent-text">Rooms</span></h2>
      </div>

      <div class="rooms-grid-wrapper" :class="{ 'locked': !authStore.isPremium }">
        <div class="rooms-grid">
          <!-- Developer Chamber -->
          <div class="room-card-v2 glass-card reveal">
            <div class="room-header tech-bg">
              <Cpu :size="40" color="white" />
              <div class="active-badge"><span class="pulse"></span> 0 Active</div>
            </div>
            <div class="room-body">
              <span class="r-tag">DEVELOPER ZONE</span>
              <h3>Developer Chamber</h3>
              <p class="text-dim text-sm">High-speed paired programming and technical architecture rooms.</p>
              <div class="room-footer">
                <button class="btn-primary-small" @click="handleJoin('/rooms/dev')">Join Now</button>
                <button class="btn-ghost-small">Info</button>
              </div>
            </div>
          </div>

          <!-- Creative Suite -->
          <div class="room-card-v2 glass-card reveal" style="animation-delay: 0.1s">
            <div class="room-header creative-bg">
              <Monitor :size="40" color="white" />
              <div class="active-badge"><span class="pulse"></span> 0 Active</div>
            </div>
            <div class="room-body">
              <span class="r-tag">MULTIMEDIA</span>
              <h3>Creative Studio</h3>
              <p class="text-dim text-sm">Acoustic and hardware environments for multimedia collaboration.</p>
              <div class="room-footer">
                <button class="btn-primary-small" @click="handleJoin('/rooms/creative')">Join Now</button>
                <button class="btn-ghost-small">Info</button>
              </div>
            </div>
          </div>

          <!-- Strategy Room -->
          <div class="room-card-v2 glass-card reveal" style="animation-delay: 0.2s">
            <div class="room-header strategy-bg">
              <Users :size="40" color="white" />
              <div class="active-badge"><span class="pulse"></span> 0 Active</div>
            </div>
            <div class="room-body">
              <span class="r-tag">BUSINESS</span>
              <h3>Strategic Hub</h3>
              <p class="text-dim text-sm">Cross-functional meeting spaces for marketing and planning.</p>
              <div class="room-footer">
                <button class="btn-primary-small" @click="handleJoin('/rooms/strategy')">Join Now</button>
                <button class="btn-ghost-small">Info</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Locked Overlay -->
        <div v-if="!authStore.isPremium" class="hub-overlay reveal">
           <div class="overlay-content">
              <Lock :size="48" class="text-white mb-4" />
              <h3>Premium Hub Required</h3>
              <p>Real-time collaboration chambers and live sync rooms are available after membership activation.</p>
              <button class="btn-premium mt-6" @click="$router.push({ path: '/login', query: { redirect: '/payment' } })">
                 Unlock Rooms Access
              </button>
           </div>
        </div>
      </div>
    </section>

    <!-- Detailed Schedule -->
    <section class="schedule-section container reveal" style="animation-delay: 0.3s">
      <div class="session-hub glass-panel">
        <div class="session-header">
          <div class="h-main">
            <Calendar :size="24" class="accent-text" />
            <h2>Today's <span class="accent-text">Live Sessions</span></h2>
          </div>
          <button class="btn-full-view">Full Calendar <ArrowRight :size="16" /></button>
        </div>
        
        <div class="session-list">
          <div v-if="liveSessions.length > 0">
            <div v-for="session in liveSessions" :key="session.title" class="session-row" :class="{ 'is-live': session.live }">
              <div class="s-time">
                <span class="s-hour">{{ session.time }}</span>
                <span class="s-tag-mini">{{ session.tag }}</span>
              </div>
              <div class="s-info">
                <h4>{{ session.title }}</h4>
                <p>{{ session.team }} • {{ session.room }}</p>
              </div>
              <div class="s-status">
                <div v-if="session.live" class="live-indicator"><span class="pulse"></span> LIVE</div>
                <div v-else class="upcoming-indicator">UPCOMING</div>
              </div>
              <button class="btn-join-session" :class="{ 'disabled': !session.live }">
                {{ session.live ? 'Join Session' : 'Locked' }}
              </button>
            </div>
          </div>
          <div v-else class="empty-sessions text-center py-10">
             <Video :size="48" class="text-dim mb-4 mx-auto" />
             <p class="text-dim">No live sessions currently scheduled. Check back shortly!</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.meeting-hub { padding-bottom: 8rem; }

/* Hero Section */
.hub-hero {
  background-size: cover !important;
  background-position: center !important;
  padding: 8.5rem 0;
  border-bottom: 1px solid var(--glass-border);
  position: relative;
}

.text-white { color: white !important; }
.text-white-dim { color: rgba(255,255,255,0.7) !important; }

.hub-tag { font-size: 0.8rem; font-weight: 800; letter-spacing: 0.2em; color: var(--primary); margin-bottom: 1.5rem; display: block; }
.hub-hero h1 { font-size: 5rem; margin-bottom: 1.5rem; color: var(--text-primary); }
.hero-desc { font-size: 1.25rem; color: var(--text-secondary); max-width: 650px; line-height: 1.6; }

.cursor { display: inline-block; margin-left: 2px; animation: blink 0.8s infinite; color: var(--primary); }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

.search-container { max-width: 700px; }
.premium-search {
  background: white;
  padding: 0.6rem;
  border-radius: 60px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.06);
  border: 1px solid var(--glass-border);
}

.s-icon { margin-left: 1.5rem; color: var(--text-dim); }
.premium-search input { flex: 1; border: none; font-size: 1.1rem; padding: 0.5rem; color: var(--text-primary); }
.premium-search input:focus { outline: none; }

.btn-search {
  background: var(--text-primary);
  color: white;
  padding: 0.8rem 1.8rem;
  border-radius: 50px;
  border: none;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-search:hover { background: var(--primary); transform: scale(1.02); }

/* Rooms Explorer */
.rooms-explorer { padding: 8rem 0; }
.section-header { margin-bottom: 4rem; }
.section-tag { display: block; font-size: 0.75rem; font-weight: 800; color: var(--primary); margin-bottom: 1rem; }

.rooms-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; }

.room-card-v2 { border-radius: 30px; overflow: hidden; }

.room-header { height: 160px; display: flex; align-items: center; justify-content: center; position: relative; }
.tech-bg { background: linear-gradient(135deg, #1ea799 0%, #000 100%); }
.creative-bg { background: linear-gradient(135deg, #f43f5e 0%, #000 100%); }
.strategy-bg { background: linear-gradient(135deg, #2d3e50 0%, #000 100%); }

.active-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(10px);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pulse { width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }

.room-body { padding: 2.5rem; }
.r-tag { font-size: 0.65rem; font-weight: 800; color: var(--primary); letter-spacing: 2px; }
.room-body h3 { font-size: 1.4rem; margin: 0.75rem 0; }
.room-footer { display: flex; gap: 1rem; margin-top: 2rem; }

.btn-primary-small { background: var(--text-primary); color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; }
.btn-primary-small:hover { background: var(--primary); }

.btn-ghost-small { background: transparent; border: 1px solid var(--glass-border); padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 700; cursor: pointer; }

/* Sessions Hub */
.session-hub { padding: 4rem; border-radius: 40px; }
.session-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4rem; }
.h-main { display: flex; gap: 1rem; align-items: center; }
.btn-full-view { background: transparent; border: none; color: var(--primary); font-weight: 800; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }

.session-list { display: flex; flex-direction: column; gap: 1.5rem; }
.session-row { display: flex; align-items: center; padding: 2rem; background: var(--bg-secondary); border-radius: 20px; transition: all 0.3s ease; border: 1px solid transparent; }
.session-row:hover { transform: scale(1.01); background: white; border-color: rgba(30,167,153,0.1); }
.session-row.is-live { background: white; border-color: rgba(30,167,153,0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.03); }

.s-time { min-width: 140px; }
.s-hour { display: block; font-size: 1.1rem; font-weight: 900; }
.s-tag-mini { font-size: 0.65rem; color: var(--text-dim); font-weight: 800; letter-spacing: 1px; }

.s-info { flex: 1; }
.s-info h4 { font-size: 1.2rem; margin-bottom: 0.25rem; }
.s-info p { font-size: 0.85rem; color: var(--text-dim); font-weight: 500; }

.s-status { margin: 0 4rem; }
.live-indicator { color: #f43f5e; font-size: 0.75rem; font-weight: 900; display: flex; align-items: center; gap: 0.5rem; }
.live-indicator .pulse { background: #f43f5e; }
.upcoming-indicator { font-size: 0.75rem; font-weight: 800; color: var(--text-dim); }

.btn-join-session { background: var(--text-primary); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.3s ease; }
.btn-join-session.disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
.btn-join-session:hover { background: var(--primary); }

/* Locked Hub Styling */
.rooms-grid-wrapper { position: relative; }
.rooms-grid-wrapper.locked .rooms-grid {
  filter: blur(15px);
  pointer-events: none;
  user-select: none;
}

.hub-overlay {
  position: absolute;
  inset: -2rem;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.overlay-content {
  background: var(--bg-primary);
  padding: 4rem;
  border-radius: 30px;
  text-align: center;
  max-width: 450px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.3);
  border: 1px solid var(--glass-border);
}

@media (max-width: 968px) {
  .hub-hero h1 { font-size: 3rem; }
  .session-row { flex-direction: column; text-align: center; gap: 1.5rem; }
  .s-status { margin: 0; }
  .session-hub { padding: 2rem; }
  /* New media queries for rooms grid */
  .rooms-grid { grid-template-columns: 1fr; }
}
</style>
```
