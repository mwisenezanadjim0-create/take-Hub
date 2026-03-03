<script setup>
import { ref, onMounted } from 'vue'
import { Rocket, Target, Users, Heart, Globe, Award, ShieldCheck, Mail, Lock } from 'lucide-vue-next'
import { staffService } from '../services/api'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const staff = ref([])
const staffCount = ref(0)
const deptCount = ref(0)
const loadingStaff = ref(true)

const typedText = ref('')
const fullWords = ['Our Mission', 'Our Vision', 'Our Community']
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
    const res = await staffService.getAllStaff()
    staff.value = res.data
    staffCount.value = res.data.length
    const depts = new Set(res.data.map(s => s.department))
    deptCount.value = depts.size || 5
  } catch (err) {
    console.error(err)
  } finally {
    loadingStaff.value = false
  }
})

const values = [
  { title: 'Inclusivity', desc: 'Bringing together diverse talents from all over Rwanda.', icon: Users },
  { title: 'Excellence', desc: 'High standards in everything we build and teach.', icon: Award },
  { title: 'Innovation', desc: 'Constant growth through technology and creativity.', icon: Rocket }
]
</script>

<template>
  <div class="about-view">
    <!-- Hero Section -->
    <header class="about-hero" :style="{ backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 0.8)), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000')` }">
      <div class="container text-center reveal">
        <span class="about-tag">SINCE 2024</span>
        <h1 class="text-white">We Build <span class="accent-text">{{ typedText }}<span class="cursor">|</span></span></h1>
        <p class="hero-desc mx-auto text-white-dim">Take Hub is Kigali's premier digital sanctuary where cross-functional teams converge to create world-class solutions.</p>
      </div>
    </header>

    <!-- Mission & Vision -->
    <section class="mission-section container">
      <div class="mission-grid">
        <div class="mission-card glass-panel reveal">
          <div class="icon-box-large"><Target :size="40" /></div>
          <h2>Our <span class="accent-text">Mission</span></h2>
          <p>To provide a high-frequency environment where Rwandan developers, marketers, and creators can connect, share resources, and build the future of our digital economy.</p>
        </div>
        <div class="mission-card glass-panel reveal" style="animation-delay: 0.1s">
          <div class="icon-box-large"><Globe :size="40" /></div>
          <h2>Our <span class="accent-text">Vision</span></h2>
          <p>To become the leading digital 'Hub' in East Africa, producing top-tier talent and innovative projects that scale globally while staying rooted in our local culture.</p>
        </div>
      </div>
    </section>

    <!-- Core Values -->
    <section class="values-section container">
      <div class="section-header text-center reveal">
        <span class="section-tag">GUIDING PRINCIPLES</span>
        <h2>What Drives <span class="accent-text">Us</span></h2>
      </div>

      <div class="values-grid">
        <div v-for="val in values" :key="val.title" class="val-card glass-card reveal">
          <div class="val-icon"><component :is="val.icon" :size="32" /></div>
          <h3>{{ val.title }}</h3>
          <p class="text-dim">{{ val.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Story Section -->
    <section class="story-section container">
       <div class="story-box glass-panel reveal">
          <div class="story-content">
             <span class="section-tag">OUR ORIGIN</span>
             <h2>Founded on <span class="accent-text">Collaboration</span></h2>
             <p>Take Hub started as a small group of developers meeting in a coffee shop in Kigali. We realized that while talent was everywhere, unified 'Hubs' with professional tools and mentorship were missing. Today, we are a growing network of {{ staffCount }}+ team members across {{ deptCount }} specialized departments.</p>
             <div class="story-stats">
                 <div class="s-item">
                    <span class="s-val">{{ staffCount }}+</span>
                    <span class="s-lab">Team Members</span>
                 </div>
                 <div class="s-item">
                    <span class="s-val">150+</span>
                    <span class="s-lab">Projects</span>
                 </div>
                 <div class="s-item">
                    <span class="s-val">{{ deptCount }}</span>
                    <span class="s-lab">Departments</span>
                 </div>
             </div>
          </div>
          <div class="story-image">
             <!-- Placeholder for a nice office photo or illustration -->
             <div class="image-placeholder">
                <Users :size="100" class="placeholder-icon" />
             </div>
          </div>
       </div>
    </section>

    <!-- Founder Section -->
    <section class="founder-section container">
       <div class="founder-card glass-panel reveal">
          <div class="founder-image">
             <img src="/mugabo-said.jpg" alt="MUGABO Said" class="hd-portrait" />
             <div class="founder-badge">FOUNDER & CEO</div>
          </div>
          <div class="founder-content">
             <span class="section-tag">LEADERSHIP</span>
             <h2>Message from <span class="accent-text">MUGABO Said</span></h2>
             <p class="founder-quote">"Take Hub was built on the belief that Rwandan talent deserves a world-class environment to grow. We aren't just a coworking space; we are a community of innovators shaping the future of Kigali's digital landscape."</p>
             <div class="founder-socials">
                <a href="#" class="f-social">LinkedIn</a>
                <a href="#" class="f-social">Twitter</a>
             </div>
          </div>
       </div>
    </section>

    <!-- Hub Community Section (LOCKED) -->
    <section class="community-section container reveal">
      <div class="section-header text-center">
        <span class="section-tag">THE CREW</span>
        <h2>Hub <span class="accent-text">Community</span></h2>
        <p class="text-dim">Connect directly with our department heads and senior mentors.</p>
      </div>

      <div class="community-grid-wrapper" :class="{ 'locked': !authStore.isPremium }">
        <div v-if="loadingStaff" class="text-center py-10">
          <div class="spinner-small mx-auto mb-4"></div>
          <p>Gathering the hub crew...</p>
        </div>
        
        <div v-else class="community-grid">
          <div v-for="member in staff" :key="member._id" class="member-profile-card glass-panel">
            <div class="m-avatar-box">
               <img :src="member.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'" />
               <div class="m-status-online"></div>
            </div>
            <div class="m-info">
               <h3>{{ member.name }}</h3>
               <span class="m-role">{{ member.role }}</span>
               <div class="m-dept-tag" :class="member.department">{{ member.department }}</div>
            </div>
            <button class="btn-direct-chat" :disabled="!authStore.isPremium">
               <Mail :size="16" /> Direct Message
            </button>
          </div>
        </div>

        <!-- Locked Overlay -->
        <div v-if="!authStore.isPremium" class="community-overlay reveal">
           <div class="overlay-content">
              <Lock :size="48" class="text-white mb-4" />
              <h3>Premium Access Required</h3>
              <p>Direct contact with our online staff and mentors is reserved for paid hub members.</p>
              <button class="btn-premium mt-6" @click="$router.push({ path: '/login', query: { redirect: '/payment' } })">
                 Unlock Hub Access
              </button>
           </div>
        </div>
      </div>
    </section>

    <!-- Contact & Footer Promo -->
    <section class="about-cta container text-center reveal">
       <h2>Ready to be part of the <span class="accent-text">Hub?</span></h2>
       <p class="text-dim">Visit us at our physical location in Kigali or join us online.</p>
       <div class="about-btns mt-10">
          <button class="btn-premium" @click="$router.push('/meetings')">Join a Room</button>
          <button class="btn-outline-white"><Mail :size="18" /> Contact Support</button>
       </div>
    </section>
  </div>
</template>

<style scoped>
.about-view { padding-bottom: 8rem; }

/* Hero Section */
.about-hero {
  background-size: cover !important;
  background-position: center !important;
  padding: 8rem 0;
  border-bottom: 1px solid var(--glass-border);
  position: relative;
}

.text-white { color: white !important; }
.text-white-dim { color: rgba(255,255,255,0.7) !important; }

.about-tag { font-size: 0.8rem; font-weight: 800; letter-spacing: 0.2em; color: var(--primary); margin-bottom: 1.5rem; display: block; }
.about-hero h1 { font-size: 5rem; margin-bottom: 1.5rem; color: var(--text-primary); }
.hero-desc { font-size: 1.25rem; color: var(--text-secondary); max-width: 650px; line-height: 1.6; }

.cursor { display: inline-block; margin-left: 2px; animation: blink 0.8s infinite; color: var(--primary); }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

/* Mission & Vision */
.mission-section { padding-top: 4rem; margin-bottom: 8rem; }
.mission-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
.mission-card { padding: 4rem; border-radius: 40px; display: flex; flex-direction: column; gap: 2rem; }
.icon-box-large { width: 80px; height: 80px; background: rgba(30, 167, 153, 0.1); color: var(--primary); border-radius: 20px; display: flex; align-items: center; justify-content: center; }
.mission-card h2 { font-size: 2.25rem; }
.mission-card p { font-size: 1.1rem; line-height: 1.7; color: var(--text-secondary); }

/* Core Values */
.values-section { margin-bottom: 8rem; }
.values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
.val-card { padding: 3rem; text-align: center; border-radius: 30px; }
.val-icon { color: var(--primary); margin-bottom: 1.5rem; }
.val-card h3 { font-size: 1.5rem; margin-bottom: 0.75rem; }

/* Story Section */
.story-section { margin-bottom: 8rem; }
.story-box { padding: 5rem; display: grid; grid-template-columns: 1.2fr 1fr; gap: 4rem; align-items: center; border-radius: 40px; overflow: hidden; }
.story-content h2 { font-size: 3rem; margin: 1.5rem 0; }
.story-content p { font-size: 1.1rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 3rem; }

.story-stats { display: flex; gap: 3rem; }
.s-item { display: flex; flex-direction: column; }
.s-val { font-size: 1.5rem; font-weight: 900; }
.s-lab { font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; }

.image-placeholder { width: 100%; height: 350px; background: var(--bg-secondary); border-radius: 30px; display: flex; align-items: center; justify-content: center; color: var(--text-dim); border: 2px dashed var(--glass-border); }

/* Founder Section */
.founder-section { margin-bottom: 8rem; }
.founder-card { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 4rem; padding: 4rem; border-radius: 40px; align-items: center; }
.founder-image { position: relative; border-radius: 30px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); line-height: 0; }
.hd-portrait { width: 100%; border-radius: 30px; transition: transform 0.5s ease; }
.founder-card:hover .hd-portrait { transform: scale(1.05); }
.founder-badge { position: absolute; bottom: 1.5rem; left: 1.5rem; background: var(--primary); color: white; padding: 0.5rem 1rem; border-radius: 10px; font-weight: 800; font-size: 0.75rem; letter-spacing: 1px; }

.founder-content h2 { font-size: 2.5rem; margin: 1rem 0 2rem; }
.founder-quote { font-size: 1.25rem; font-style: italic; line-height: 1.8; color: var(--text-secondary); margin-bottom: 3rem; position: relative; }
.founder-quote::before { content: '“'; position: absolute; top: -2rem; left: -1.5rem; font-size: 5rem; color: var(--primary); opacity: 0.2; }

.founder-socials { display: flex; gap: 1.5rem; }
.f-social { color: var(--text-dim); font-weight: 700; font-size: 0.9rem; text-decoration: none; transition: color 0.3s ease; }
.f-social:hover { color: var(--primary); }

.about-btns { display: flex; gap: 1.5rem; justify-content: center; }

/* Community Section Styling */
.community-section { padding: 8rem 0; }
.community-grid-wrapper { position: relative; min-height: 400px; }

.community-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
  transition: filter 0.5s ease;
}

.community-grid-wrapper.locked .community-grid {
  filter: blur(15px);
  pointer-events: none;
  user-select: none;
}

.member-profile-card {
  padding: 2.5rem;
  text-align: center;
  border-radius: 30px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.m-avatar-box {
  position: relative;
  width: 100px;
  height: 100px;
}

.m-avatar-box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--bg-secondary);
}

.m-status-online {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 16px;
  height: 16px;
  background: #10b981;
  border: 3px solid white;
  border-radius: 50%;
}

.m-role { font-size: 0.85rem; color: var(--text-dim); font-weight: 600; }
.m-dept-tag {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  text-transform: uppercase;
  margin-top: 0.5rem;
}

.btn-direct-chat {
  width: 100%;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-direct-chat:hover:not(:disabled) {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.community-overlay {
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

.spinner-small {
  width: 30px;
  height: 30px;
  border: 3px solid var(--bg-secondary);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 968px) {
  .about-hero h1 { font-size: 3rem; }
  .mission-grid { grid-template-columns: 1fr; }
  .values-grid { grid-template-columns: 1fr; }
  .story-box { grid-template-columns: 1fr; padding: 3rem; text-align: center; }
  .story-stats { justify-content: center; }
  .founder-card { grid-template-columns: 1fr; text-align: center; padding: 3rem; }
  .founder-socials { justify-content: center; }
}
</style>
