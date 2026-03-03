<script setup>
import { ref, onMounted } from 'vue'
import { 
  Shield, 
  Layers, 
  Target, 
  BarChart, 
  TrendingUp, 
  Cpu, 
  Globe,
  Award,
  Users,
  Briefcase,
  Zap,
  ArrowUpRight,
  Lock
} from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const typedText = ref('')
const fullWords = ['Business Hub', 'Marketing Lab', 'Strategy Room']
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

const metrics = [
  { label: 'Network Reach', value: '100+', icon: Globe, color: 'var(--primary)' },
  { label: 'Ad Syncs', value: '0', icon: TrendingUp, color: 'var(--success)' },
  { label: 'Active Projects', value: '0', icon: Cpu, color: 'var(--accent)' }
]
</script>

<template>
  <div class="business-hub">
    <!-- Hero Section -->
    <header class="biz-hero" :style="{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000')` }">
      <div class="container text-center reveal">
        <span class="biz-tag">STRATEGIC GROWTH</span>
        <h1 class="text-white">Advanced <span class="accent-text">{{ typedText }}<span class="cursor">|</span></span></h1>
        <p class="hero-desc mx-auto text-white-dim">Providing high-performance analytics, digital marketing tools, and strategic management resources for modern enterprises.</p>
        <div class="hero-actions mt-10">
          <button class="btn-premium" @click="router.push(authStore.isPremium ? '/dashboard' : '/payment')">
            {{ authStore.isPremium ? 'Open My Console' : 'Activate Hub Membership' }}
          </button>
          <button class="btn-outline-white">Free Market Consultation</button>
        </div>
      </div>
    </header>

    <!-- Metrics Bar -->
    <section class="metrics-bar container">
      <div class="metrics-grid">
        <div v-for="item in metrics" :key="item.label" class="metric-card glass-panel reveal">
          <div class="m-icon" :style="{ color: item.color }"><component :is="item.icon" :size="20" /></div>
          <div class="m-info">
            <span class="m-val">{{ item.value }}</span>
            <span class="m-lab">{{ item.label }}</span>
          </div>
          <ArrowUpRight :size="16" class="m-arrow" />
        </div>
      </div>
    </section>

    <!-- Strategic Dashboard (LOCKED) -->
    <section class="strategic-dashboard container reveal">
       <div class="section-header">
         <span class="section-tag">REAL-TIME INSIGHTS</span>
         <h2>Network <span class="accent-text">Performance</span></h2>
       </div>

       <div class="dashboard-grid-wrapper" :class="{ 'locked': !authStore.isPremium }">
          <div class="dashboard-grid">
             <!-- Main Chart Card -->
             <div class="dash-card glass-panel col-2">
                <div class="card-header">
                   <div class="header-main">
                     <BarChart :size="24" class="accent-text" />
                     <div>
                       <h3>Traffic Scalability</h3>
                       <p class="text-xs text-dim">Active sessions across multiple regions.</p>
                     </div>
                   </div>
                   <div class="time-switches">
                      <span class="sw active">30D</span>
                      <span class="sw">90D</span>
                      <span class="sw">1Y</span>
                   </div>
                </div>
                
                <div class="visual-area">
                   <div class="mock-bars">
                      <div v-for="h in [40, 65, 50, 85, 70, 95, 80]" :key="h" class="bar-col">
                         <div class="bar-fill" :style="{ height: h + '%' }"></div>
                      </div>
                   </div>
                   <div class="chart-labels">
                      <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                   </div>
                </div>

                <div class="card-stats">
                   <div class="s-entry">
                      <span class="s-val text-success">+34.2%</span>
                      <span class="s-lab">Organic Search</span>
                   </div>
                   <div class="s-divider"></div>
                   <div class="s-entry">
                      <span class="s-val">0</span>
                      <span class="s-lab">Unique Visitors</span>
                   </div>
                   <div class="s-divider"></div>
                   <div class="s-entry">
                      <span class="s-val text-accent">14.8s</span>
                      <span class="s-lab">Avg Retention</span>
                   </div>
                </div>
             </div>

             <!-- Objectives Card -->
             <div class="dash-card glass-panel dark-gradient">
               <div class="card-header">
                  <h3><Target :size="20" /> Q1 Milestones</h3>
               </div>
               <div class="objectives-v2">
                  <div class="objective-row">
                     <div class="obj-meta">
                       <span>Market Dominance</span>
                       <span class="text-success">Done</span>
                     </div>
                     <div class="progress-track"><div class="progress-fill success h-full"></div></div>
                  </div>
                  <div class="objective-row">
                     <div class="obj-meta">
                       <span>Channel Expansion</span>
                       <span>75%</span>
                     </div>
                     <div class="progress-track"><div class="progress-fill accent w-75"></div></div>
                  </div>
                  <div class="objective-row">
                     <div class="obj-meta">
                       <span>Member Retention</span>
                       <span>60%</span>
                     </div>
                     <div class="progress-track"><div class="progress-fill primary w-60"></div></div>
                  </div>
               </div>
               <button class="btn-sidebar-cta">Generate Report</button>
             </div>
          </div>

          <!-- Locked Overlay -->
          <div v-if="!authStore.isPremium" class="biz-overlay reveal">
             <div class="overlay-content">
                <Lock :size="48" class="text-white mb-4" />
                <h3>Business Intelligence Locked</h3>
                <p>Advanced market simulations and real-time performance tracking are available to Hub Premium members.</p>
                <button class="btn-premium mt-6" @click="router.push({ path: '/login', query: { redirect: '/payment' } })">
                   Get Premium Access
                </button>
             </div>
          </div>
       </div>
    </section>

    <!-- Rooms Section -->
    <section class="advanced-rooms container">
      <div class="section-header text-center reveal">
        <span class="section-tag">ENVIRONMENTS</span>
        <h2>Premium <span class="accent-text">Strategic Chambers</span></h2>
      </div>

      <div class="hub-grid" :class="{ 'locked-mini': !authStore.isPremium }">
        <div class="hub-card glass-card reveal" style="padding: 4rem; border-radius: 40px;">
          <Shield :size="48" class="rose-text mb-6" />
          <h3>Strategic Management</h3>
          <p class="text-dim">Secured conference rooms for C-level executives, including encrypted communication and board tools.</p>
          <button class="btn-hub-link" @click="router.push(authStore.isPremium ? '/dashboard' : '/payment')">
             Enter Room <ArrowUpRight :size="16" />
          </button>
        </div>

        <div class="hub-card glass-card reveal" style="padding: 4rem; border-radius: 40px; animation-delay: 0.1s">
          <Cpu :size="48" class="cyan-text mb-6" />
          <h3>Digital Marketing Labs</h3>
          <p class="text-dim">Real-time simulator for campaign tracking, SEO profiling, and high-frequency content distribution across Kigali.</p>
          <button class="btn-hub-link" @click="router.push(authStore.isPremium ? '/dashboard' : '/payment')">
             Open Lab <ArrowUpRight :size="16" />
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.business-hub { padding-bottom: 8rem; }

/* Hero Section */
.biz-hero {
  background-size: cover !important;
  background-position: center !important;
  padding: 8rem 0;
  border-bottom: 1px solid var(--glass-border);
  position: relative;
}

.text-white { color: white !important; }
.text-white-dim { color: rgba(255,255,255,0.7) !important; }

.biz-tag { font-size: 0.8rem; font-weight: 800; letter-spacing: 0.2em; color: var(--primary); margin-bottom: 1.5rem; display: block; }
.biz-hero h1 { font-size: 5rem; margin-bottom: 1.5rem; color: var(--text-primary); }
.hero-desc { font-size: 1.25rem; color: var(--text-secondary); max-width: 650px; line-height: 1.6; }

.hero-actions { display: flex; gap: 1.5rem; justify-content: center; }

.btn-outline-white {
  background: white;
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.cursor { display: inline-block; margin-left: 2px; animation: blink 0.8s infinite; color: var(--primary); }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

/* Metrics Bar */
.metrics-bar { padding-top: 4rem; margin-bottom: 8rem; }
.metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.metric-card { padding: 2.5rem; position: relative; display: flex; align-items: center; gap: 2rem; overflow: hidden; }
.m-icon { width: 44px; height: 44px; background: rgba(0,0,0,0.03); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.m-info { display: flex; flex-direction: column; }
.m-val { font-size: 1.5rem; font-weight: 900; }
.m-lab { font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; }
.m-arrow { position: absolute; top: 1.5rem; right: 1.5rem; opacity: 0.3; }

/* Dashboard */
.strategic-dashboard { margin-bottom: 8rem; }
.section-header { margin-bottom: 4rem; }
.section-tag { display: block; font-size: 0.75rem; font-weight: 800; color: var(--primary); margin-bottom: 1rem; }

.dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2.5rem; }
.dash-card { padding: 3rem; display: flex; flex-direction: column; }
.dark-gradient { background: linear-gradient(135deg, var(--bg-darker) 0%, #1e293b 100%); color: white; border: none; }

.card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3.5rem; }
.header-main { display: flex; gap: 1rem; align-items: center; }
.time-switches { display: flex; gap: 1rem; background: var(--bg-secondary); padding: 0.4rem; border-radius: 10px; }
.sw { padding: 0.4rem 0.8rem; font-size: 0.7rem; font-weight: 800; color: var(--text-dim); cursor: pointer; border-radius: 6px; }
.sw.active { background: white; color: var(--text-primary); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

.visual-area { flex: 1; margin-bottom: 3rem; }
.mock-bars { display: flex; align-items: flex-end; gap: 1.5rem; height: 180px; width: 100%; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; }
.bar-col { flex: 1; height: 100%; position: relative; }
.bar-fill { position: absolute; bottom: 0; left: 0; width: 100%; background: linear-gradient(to top, var(--primary), #3dbfb1); border-radius: 8px 8px 0 0; transition: height 0.6s ease; }
.chart-labels { display: flex; justify-content: space-between; padding-top: 1rem; font-size: 0.65rem; color: var(--text-dim); font-weight: 800; }

.card-stats { display: flex; align-items: center; gap: 3rem; padding-top: 2rem; border-top: 1px solid var(--glass-border); }
.s-entry { display: flex; flex-direction: column; }
.s-val { font-size: 1.25rem; font-weight: 900; }
.s-lab { font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase; }
.s-divider { height: 30px; width: 1px; background: var(--glass-border); }

.text-success { color: #10b981; }
.text-accent { color: var(--accent); }

/* Objectives v2 */
.objectives-v2 { display: flex; flex-direction: column; gap: 2rem; margin: 3rem 0; flex: 1; }
.objective-row { display: flex; flex-direction: column; gap: 0.75rem; }
.obj-meta { display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; color: rgba(255,255,255,0.7); }
.progress-track { height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; }
.progress-fill { height: 100%; border-radius: 3px; }
.progress-fill.success { background: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.4); }
.progress-fill.accent { background: var(--accent); box-shadow: 0 0 10px rgba(244, 63, 94, 0.4); }
.progress-fill.primary { background: var(--primary); box-shadow: 0 0 10px rgba(30, 167, 153, 0.4); }
.w-75 { width: 75%; }
.w-60 { width: 60%; }
.h-full { height: 100%; }

.btn-sidebar-cta { width: 100%; padding: 1.1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: white; font-weight: 800; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease; }
.btn-sidebar-cta:hover { background: white; color: var(--bg-darker); }

/* Hub Cards */
.hub-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
.btn-hub-link { background: transparent; border: none; font-weight: 800; color: var(--primary); display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin-top: 1rem; }

.rose-text { color: var(--accent); }
.cyan-text { color: var(--primary); }

/* Locked Business Logic */
.dashboard-grid-wrapper { position: relative; }
.dashboard-grid-wrapper.locked .dashboard-grid,
.hub-grid.locked-mini {
  filter: blur(15px);
  pointer-events: none;
  user-select: none;
}

.biz-overlay {
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
  .biz-hero h1 { font-size: 3rem; }
  .metrics-grid { grid-template-columns: 1fr; }
  .dashboard-grid { grid-template-columns: 1fr; }
  .hub-grid { grid-template-columns: 1fr; }
}
</style>
