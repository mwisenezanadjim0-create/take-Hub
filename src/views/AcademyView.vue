<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  BookOpen, 
  Award, 
  GraduationCap, 
  ChevronRight, 
  Play, 
  Star, 
  Users,
  CheckCircle,
  Clock,
  Briefcase,
  Zap,
  Lock
} from 'lucide-vue-next'
import { academyService } from '../services/api'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const courses = ref([])
const loading = ref(true)
const authStore = useAuthStore()

const handleEnroll = (path) => {
  if (authStore.isPremium) {
    router.push(path)
  } else if (authStore.isAuthenticated) {
    router.push({ path: '/payment', query: { redirect: path } })
  } else {
    router.push({ path: '/login', query: { redirect: path } })
  }
}

const typedText = ref('')
const fullWords = ['Academy Hub', 'Skill Center', 'Career Lab']
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

onMounted(async () => {
  typeEffect()
  try {
    const response = await academyService.getCourses()
    courses.value = response.data
  } catch (error) {
    console.error('Failed to fetch courses:', error)
  } finally {
    loading.value = false
  }
})

const highlights = [
  { title: 'Expert Led', desc: 'Real-world industry veterans.', icon: Users },
  { title: 'Job Ready', desc: 'Curriculum focused on hiring.', icon: Briefcase },
  { title: 'Interactive', desc: 'Hands-on projects & labs.', icon: Zap }
]
</script>

<template>
  <div class="academy-view">
    <!-- Hero Section -->
    <header class="academy-hero" :style="{ backgroundImage: `linear-gradient(rgba(26, 31, 44, 0.8), rgba(26, 31, 44, 0.8)), url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2000')` }">
      <div class="container text-center reveal">
        <span class="academy-tag">KNOWLEDGE FOR ALL</span>
        <h1 class="text-white">Take <span class="accent-text">{{ typedText }}<span class="cursor">|</span></span></h1>
        <p class="hero-desc mx-auto text-white-dim">Elevate your potential with our specialized short courses for soft skills, tech mastery, and modern leadership.</p>
        <div class="hero-stats-mini flex-center gap-10 mt-10">
          <div class="mini-stat"><BookOpen :size="16" /> {{ courses.length }}+ Courses</div>
          <div class="mini-stat"><Users :size="16" /> 12k+ Students</div>
          <div class="mini-stat"><Award :size="16" /> Verified Certificates</div>
        </div>
      </div>
    </header>

    <!-- Highlights Bar -->
    <section class="highlights-bar container">
      <div class="highlights-grid">
        <div v-for="item in highlights" :key="item.title" class="highlight-item glass-panel reveal">
          <div class="h-icon"><component :is="item.icon" :size="24" /></div>
          <div class="h-info">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Program -->
    <div class="academy-featured container">
       <div class="featured-banner glass-panel reveal">
          <div class="banner-content">
             <div class="banner-badge">NEXT SPRINT: MARCH 15</div>
             <h2>Soft Skills for <span class="accent-text">High Performance</span></h2>
             <p class="text-dim">Master the art of high-stakes communication, emotional intelligence, and team dynamics designed for rapid career advancement.</p>
             <div class="banner-features">
                <div class="b-feat"><CheckCircle :size="16" /> 4 Week Intensive</div>
                <div class="b-feat"><CheckCircle :size="16" /> Group Workshops</div>
                <div class="b-feat"><CheckCircle :size="16" /> Digital Portfolio</div>
             </div>
              <button class="btn-premium" @click="handleEnroll('/academy/featured')">View Curriculum</button>
          </div>
          <div class="banner-visual">
             <div class="visual-circle">
                <GraduationCap :size="120" class="floating-icon" />
             </div>
          </div>
       </div>
    </div>

    <!-- Course Catalog -->
    <section class="course-section container">
      <div class="section-header reveal">
        <span class="section-tag">CATALOG</span>
        <div class="flex-bw">
          <h2>Browse <span class="accent-text">All Courses</span></h2>
          <div class="filter-pills">
            <span class="pill active">All</span>
            <span class="pill">Technology</span>
            <span class="pill">Marketing</span>
            <span class="pill">Leadership</span>
          </div>
        </div>
      </div>

      <div class="course-grid-wrapper" :class="{ 'locked': !authStore.isPremium }">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Fetching Academy Content...</p>
        </div>

        <!-- Course Grid or Empty State -->
        <template v-else>
          <div v-if="courses.length > 0" class="course-grid">
             <div v-for="(course, index) in courses" :key="course._id" 
                  class="course-card glass-card reveal" 
                  :style="`animation-delay: ${index * 0.1}s`">
                <div class="course-thumb" :style="course.thumbnail ? `background-image: url(${course.thumbnail}); background-size: cover;` : ''">
                   <div class="course-overlay"><Play :size="40" class="icon-white" /></div>
                   <div class="course-duration"><Clock :size="14" /> {{ course.duration }}</div>
                </div>
                <div class="course-info">
                   <div class="flex-bw mb-2">
                     <span class="course-cat">{{ course.category.toUpperCase() }}</span>
                     <div class="rating"><Star :size="12" fill="#FBBF24" color="#FBBF24" /> 4.9</div>
                   </div>
                   <h3>{{ course.title }}</h3>
                   <p class="text-dim text-xs limit-text">{{ course.description }}</p>
                   <div class="course-bottom">
                     <div class="price-box">
                       <span class="p-lab">Price</span>
                       <span class="p-val">{{ course.price.toLocaleString() }} FRW</span>
                     </div>
                      <button class="btn-enroll" @click="handleEnroll(`/academy/${course._id}`)">Join Now</button>
                   </div>
                </div>
             </div>
          </div>

          <!-- Empty State (only for premium users when no courses) -->
          <div v-else-if="authStore.isPremium" class="empty-state text-center py-20">
            <BookOpen :size="48" class="text-dim mb-4" />
            <p>New curriculum arriving soon. Check back shortly!</p>
          </div>
        </template>

        <!-- Locked Overlay (Absolute positioned over the wrapper) -->
        <div v-if="!authStore.isPremium" class="academy-overlay reveal">
           <div class="overlay-content">
              <Lock :size="48" class="text-white mb-4" />
              <h3>Academy Access Locked</h3>
              <p>Full curriculum access and enrollment are reserved for Premium Hub members.</p>
              <button class="btn-premium mt-6" @click="router.push({ path: '/login', query: { redirect: '/payment' } })">
                 Get Academy Access
              </button>
           </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.academy-view {
  padding-bottom: 8rem;
}

/* Hero Section */
.academy-hero {
  background-size: cover !important;
  background-position: center !important;
  padding: 8rem 0;
  border-bottom: 1px solid var(--glass-border);
  position: relative;
}

.text-white { color: white !important; }
.text-white-dim { color: rgba(255,255,255,0.7) !important; }

.academy-tag {
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  color: var(--primary);
  margin-bottom: 1.5rem;
  display: block;
}

.academy-hero h1 {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.hero-desc {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 650px;
  line-height: 1.6;
}

.mini-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-dim);
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.02);
}

.cursor {
  display: inline-block;
  margin-left: 2px;
  animation: blink 0.8s infinite;
  color: var(--primary);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Highlights Bar */
.highlights-bar {
  padding-top: 4rem;
  margin-bottom: 8rem;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.highlight-item {
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border-radius: 25px;
}

.h-icon {
  width: 50px;
  height: 50px;
  background: rgba(30, 167, 153, 0.1);
  color: var(--primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.h-info h3 { font-size: 1.1rem; margin-bottom: 0.25rem; }
.h-info p { font-size: 0.85rem; color: var(--text-dim); }

/* Featured Banner */
.academy-featured {
  margin-bottom: 8rem;
}

.featured-banner {
  padding: 5rem;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  align-items: center;
  border-radius: 40px;
  overflow: hidden;
}

.banner-badge {
  background: var(--accent);
  color: white;
  font-size: 0.7rem;
  font-weight: 900;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  display: inline-block;
  margin-bottom: 2rem;
}

.featured-banner h2 { font-size: 3rem; margin-bottom: 1.5rem; }
.featured-banner p { font-size: 1.1rem; margin-bottom: 2.5rem; }

.banner-features {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
}

.b-feat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
}

.visual-circle {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 30px 60px rgba(0,0,0,0.1);
}

.floating-icon {
  animation: float-y 4s infinite ease-in-out;
}

@keyframes float-y {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* Course Catalog */
.section-header { margin-bottom: 4rem; }
.flex-bw { display: flex; justify-content: space-between; align-items: center; width: 100%; }

.filter-pills { display: flex; gap: 1rem; }
.pill {
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-dim);
  background: var(--bg-secondary);
  cursor: pointer;
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;
}

.pill.active, .pill:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
}

.course-card {
  display: flex;
  flex-direction: column;
}

.course-thumb {
  height: 200px;
  position: relative;
  background: var(--secondary);
  border-radius: 20px 20px 0 0;
}

.course-duration {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.course-info { padding: 2rem; flex: 1; display: flex; flex-direction: column; }
.course-cat { font-size: 0.7rem; font-weight: 800; color: var(--primary); letter-spacing: 1px; }
.rating { font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; gap: 0.3rem; }

.course-info h3 { font-size: 1.25rem; margin-bottom: 0.75rem; }
.limit-text { display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.course-bottom {
  margin-top: auto;
  padding-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-box { display: flex; flex-direction: column; }
.p-lab { font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase; }
.p-val { font-size: 1.1rem; font-weight: 900; color: var(--text-primary); }

.btn-enroll {
  background: var(--text-primary);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-enroll:hover {
  background: var(--primary);
  transform: translateY(-2px);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--bg-secondary);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.loading-state, .empty-state { text-align: center; padding: 6rem 0; }

/* Academy Locked State */
.course-grid-wrapper { position: relative; min-height: 400px; }
.course-grid-wrapper.locked .course-grid {
  filter: blur(15px);
  pointer-events: none;
  user-select: none;
}

.academy-overlay {
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
  .highlights-grid { grid-template-columns: 1fr; }
  .featured-banner { grid-template-columns: 1fr; padding: 3rem; text-align: center; }
  .banner-features { flex-direction: column; align-items: center; gap: 1rem; }
  .flex-bw { flex-direction: column; gap: 2rem; }
  .academy-hero h1 { font-size: 3rem; }
  .course-grid { grid-template-columns: 1fr; }
  .strategic-grid { grid-template-columns: 1fr; }
  .banner-visual { display: none; }
}
</style>
