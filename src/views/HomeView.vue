<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// ... rest of imports
import { 
  Code, 
  Film, 
  Megaphone, 
  Heart, 
  GraduationCap, 
  Video, 
  MessageSquare, 
  Calendar, 
  Award, 
  TrendingUp, 
  ShieldCheck,
  Users,
  BookOpen,
  ArrowRight
} from 'lucide-vue-next'
import { hubService } from '../services/api'

const router = useRouter()

const typedText = ref('')
const fullWords = ['Take Hub', 'Developer Zone', 'Creative Suite']
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
    typingSpeed.value = 2000 // Pause at end
  } else if (isDeleting.value && typedText.value === '') {
    isDeleting.value = false
    currentWordIndex.value = (currentWordIndex.value + 1) % fullWords.length
    typingSpeed.value = 500
  }

  setTimeout(typeEffect, typingSpeed.value)
}

const stats = ref({
  users: 0,
  courses: 0,
  rooms: 5
})

const rooms = ref([
  {
    title: 'Developers Room',
    desc: 'Code reviews, pair programming, tech talks, and hackathons. Build with the best.',
    members: '0 members',
    icon: Code,
    color: '#e0f2f1'
  },
  {
    title: 'Multimedia Studio',
    desc: 'Video production, graphic design, animation workshops, and creative collaboration.',
    members: '0 members',
    icon: Film,
    color: '#fce4ec'
  },
  {
    title: 'Digital Marketing',
    desc: 'SEO strategies, social media management, content marketing, and growth hacking.',
    members: '0 members',
    icon: Megaphone,
    color: '#fff9c4'
  },
  {
    title: 'Soft Skills Lab',
    desc: 'Communication, leadership, teamwork, and personal development workshops.',
    members: '0 members',
    icon: Heart,
    color: '#f3e5f5'
  },
  {
    title: 'Short Courses',
    desc: 'Quick, focused learning tracks designed for rapid skill advancement and certification.',
    members: '0 members',
    icon: GraduationCap,
    color: '#e3f2fd'
  }
])

onMounted(async () => {
  typeEffect()
  try {
    const res = await hubService.getStats()
    stats.value.users = res.data.users
    stats.value.courses = res.data.courses
    
    // Update room member strings (simulated split)
    rooms.value[0].members = `${Math.floor(res.data.users * 0.35)}+ members`
    rooms.value[1].members = `${Math.floor(res.data.users * 0.25)}+ members`
    rooms.value[2].members = `${Math.floor(res.data.users * 0.20)}+ members`
    rooms.value[3].members = `${Math.floor(res.data.users * 0.15)}+ members`
    rooms.value[4].members = `${Math.floor(res.data.users * 0.10)}+ members`
  } catch (err) {
    console.error('Failed to load home stats:', err)
  }
})

const features = [
  {
    title: 'Live Meetings',
    desc: 'Schedule and join live sessions with experts across departments.',
    icon: Video
  },
  {
    title: 'Real-time Chat',
    desc: 'Instant messaging within rooms for quick collaboration.',
    icon: MessageSquare
  },
  {
    title: 'Event Scheduling',
    desc: 'Plan workshops, webinars, and meetups with ease.',
    icon: Calendar
  },
  {
    title: 'Certifications',
    desc: 'Earn certificates upon completing courses and tracks.',
    icon: Award
  },
  {
    title: 'Skill Tracking',
    desc: 'Monitor your growth across multiple domains.',
    icon: TrendingUp
  },
  {
    title: 'Mentorship',
    desc: 'Connect with industry mentors for guided advancement.',
    icon: ShieldCheck
  }
]
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section" :style="{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/hero-bg.jpg')` }">
      <div class="container hero-container text-center">
        <div class="hero-content reveal mx-auto">
          <div class="hero-badge mx-auto">
            <span class="sparkle">✨</span> Where Teams Converge & Create
          </div>
          <h1>The <span class="accent-text">{{ typedText }}<span class="cursor">|</span></span></h1>
          <p class="hero-subtitle mx-auto">
            A collaborative space for developers, multimedia creators, digital marketers, and learners. Meet, grow, and build together.
          </p>
          <div class="hero-btns flex-center gap-6">
            <button class="btn-primary-large" @click="router.push({ path: '/login', query: { redirect: '/meetings' } })">
              Explore Rooms <ArrowRight :size="18" />
            </button>
            <button class="btn-white-outline" @click="router.push('/about')">
              Learn More
            </button>
          </div>

          <div class="hero-stats flex-center gap-12 mt-12">
            <div class="stat-item">
              <div class="stat-icon-box"><Users :size="20" /></div>
              <div>
                <div class="stat-val">{{ stats.users }}+</div>
                <div class="stat-lab">Active Members</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon-box"><BookOpen :size="20" /></div>
              <div>
                <div class="stat-val">{{ stats.courses }}+</div>
                <div class="stat-lab">Courses</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon-box"><TrendingUp :size="20" /></div>
              <div>
                <div class="stat-val">{{ stats.rooms }}</div>
                <div class="stat-lab">Rooms</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Partners Section -->
    <section class="partners-section">
      <div class="container flex-center gap-20 reveal">
        <span class="partner-label">TRUSTED BY TEAMS AT:</span>
        <div class="partners-logos text-dim">
          <span class="partner-logo">KIREGA </span>
          <span class="partner-logo">TECHFLOW</span>
          <span class="partner-logo">MEDIAWAVE</span>
          <span class="partner-logo">STRATOS</span>
        </div>
      </div>
    </section>

    <!-- Rooms Section -->
    <section class="rooms-section container">
      <div class="section-header text-center">
        <span class="section-tag">EXPLORE</span>
        <h2>Our Rooms</h2>
        <p class="section-desc">Join specialized spaces designed for collaboration, learning, and growth.</p>
      </div>

      <div class="rooms-grid">
        <div v-for="room in rooms" :key="room.title" class="room-card" :style="{ backgroundColor: room.color }">
          <div class="room-icon"><component :is="room.icon" :size="24" /></div>
          <h3>{{ room.title }}</h3>
          <p>{{ room.desc }}</p>
          <span class="room-members">{{ room.members }}</span>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section bg-secondary">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-tag accent">PLATFORM</span>
          <h2>Everything You Need</h2>
          <p class="section-desc">Tools and features built for modern teams and learners.</p>
        </div>

        <div class="features-grid">
          <div v-for="feature in features" :key="feature.title" class="feature-item">
            <div class="feature-icon"><component :is="feature.icon" :size="24" /></div>
            <div class="feature-info">
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section container">
      <div class="section-header text-center reveal">
        <span class="section-tag">SUCCESS STORIES</span>
        <h2>What Our Hub Says</h2>
        <p class="section-desc">Join thousands of professionals who have accelerated their careers through Take Hub.</p>
      </div>

      <div class="testimonials-grid">
        <div class="testimonial-card glass-panel reveal" style="animation-delay: 0.1s">
          <div class="quote-icon">“</div>
          <p>The Developer Room completely changed how I collaborate. Pair programming with seniors here accelerated my React skills in just weeks.</p>
          <div class="testi-user">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" />
            <div>
              <span class="name">Arnaud Ishimwe</span>
              <span class="role">Fullstack Dev</span>
            </div>
          </div>
        </div>

        <div class="testimonial-card glass-panel reveal" style="animation-delay: 0.2s">
          <div class="quote-icon">“</div>
          <p>The Multimedia Studio is exactly what Kigali needed. Access to hardware sync and high-speed collaboration is a game changer for filmmakers.</p>
          <div class="testi-user">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" />
            <div>
              <span class="name">Marie Uwase</span>
              <span class="role">Visual Artist</span>
            </div>
          </div>
        </div>

        <div class="testimonial-card glass-panel reveal" style="animation-delay: 0.3s">
          <div class="quote-icon">“</div>
          <p>Strategy sessions in the Business Hub helped us scale our startup marketing. The AI-driven analytics tools provided are world-class.</p>
          <div class="testi-user">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" />
            <div>
              <span class="name">David Mugisha</span>
              <span class="role">Tech Founder</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section container">
      <div class="cta-box">
        <h2>Ready to Level Up?</h2>
        <p>Join Take Hub today and start collaborating with talented professionals and learners.</p>
        <button class="btn-cta" @click="router.push({ path: '/login', query: { redirect: '/academy' } })">
          Get Started Free <ArrowRight :size="18" />
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 90vh;
  min-height: 700px;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-attachment: scroll;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: white !important;
  text-align: center;
}

.hero-content {
  max-width: 800px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.hero-content h1 {
  font-size: 5rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  color: white !important;
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

.accent-text {
  color: #fbbf24 !important; /* Goldish yellow */
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  max-width: 650px;
}

.flex-center { display: flex; justify-content: center; align-items: center; }
.gap-6 { gap: 1.5rem; }
.gap-12 { gap: 3rem; }
.mt-12 { margin-top: 3rem; }
.mx-auto { margin-left: auto; margin-right: auto; }

.btn-primary-large {
  background: #1ea799;
  color: white;
  border: none;
  padding: 1.25rem 2.5rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary-large:hover {
  background: #19988a;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(30, 167, 153, 0.4);
}

.btn-white-outline {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 1.25rem 2.5rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-white-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

/* Partners Section */
.partners-section {
  padding: 3rem 0;
  border-bottom: 1px solid var(--glass-border);
  background: var(--bg-primary);
}

.partner-label {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  margin-right: 3rem;
}

.partners-logos {
  display: flex;
  gap: 5rem;
  align-items: center;
}

.partner-logo {
  font-size: 1.1rem;
  font-weight: 900;
  letter-spacing: 1px;
  filter: grayscale(1);
  opacity: 0.4;
  transition: all 0.3s ease;
}

.partner-logo:hover {
  filter: grayscale(0);
  opacity: 1;
  color: var(--primary);
}

.gap-20 { gap: 5rem; }

/* Section Common */
.section-header {
  margin-bottom: 5rem;
}

.section-tag {
  display: block;
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  color: var(--primary);
  margin-bottom: 1rem;
}

.section-tag.accent {
  color: var(--accent);
}

.section-header h2 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.section-desc {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.text-center { text-align: center; }

/* Rooms Section */
.rooms-section {
  padding: 8rem 2rem;
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.room-card {
  padding: 3rem 2rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.room-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.05);
}

.room-icon {
  margin-bottom: 2rem;
  color: #1a1f2c;
}

.room-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1a1f2c;
}

.room-card p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #475569;
  margin-bottom: 2rem;
  flex-grow: 1;
}

.room-members {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
}

/* Features Section */
.features-section {
  padding: 8rem 0;
  background-color: #f8fafc;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rem 2rem;
}

.feature-item {
  display: flex;
  gap: 1.5rem;
}

.feature-icon {
  background: #e0f2f1;
  color: var(--primary);
  width: 56px;
  height: 56px;
  min-width: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-info h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.feature-info p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Testimonials */
.testimonials-section {
  padding: 8rem 2rem;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
}

.testimonial-card {
  padding: 3.5rem 3rem;
  border-radius: 35px;
  position: relative;
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.05);
}

.quote-icon {
  position: absolute;
  top: 1rem;
  right: 2rem;
  font-size: 5rem;
  font-family: serif;
  color: var(--primary);
  opacity: 0.2;
}

.testimonial-card p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  font-style: italic;
}

.testi-user {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.testi-user img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid var(--primary-glow);
}

.testi-user div {
  display: flex;
  flex-direction: column;
}

.testi-user .name {
  font-weight: 800;
  font-size: 1rem;
  color: var(--text-primary);
}

.testi-user .role {
  font-size: 0.8rem;
  color: var(--text-dim);
}

/* CTA Section */
.cta-section {
  padding: 8rem 2rem;
}

.cta-box {
  background: linear-gradient(135deg, #1ea799 0%, #38b2ac 100%);
  padding: 6rem 4rem;
  border-radius: 40px;
  text-align: center;
  color: white;
}

.cta-box h2 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
}

.cta-box p {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.btn-cta {
  background: #f43f5e;
  color: white;
  border: none;
  padding: 1.25rem 3rem;
  border-radius: 15px;
  font-weight: 700;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cta:hover {
  background: #e11d48;
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(244, 63, 94, 0.4);
}

@media (max-width: 1100px) {
  .hero-content h1 { font-size: 3.5rem; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .hero-content h1 { font-size: 2.5rem; }
  .hero-btns { flex-direction: column; }
  .features-grid { grid-template-columns: 1fr; }
  .hero-stats { flex-direction: column; gap: 1.5rem; }
  .cta-box { padding: 4rem 2rem; }
  .cta-box h2 { font-size: 2.5rem; }
}
</style>
