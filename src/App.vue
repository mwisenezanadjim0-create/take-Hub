<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Layout, Rocket, Users, BookOpen, Layers, LogOut, Sun, Moon, Send, Mail, MapPin, Phone, MessageSquare } from 'lucide-vue-next'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isDarkMode = ref(false)
const showJoinModal = ref(false)

const goToAcademy = () => {
  showJoinModal.value = false
  router.push('/academy')
}

const goToLogin = () => {
  showJoinModal.value = false
  router.push('/login')
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark-mode')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  isDarkMode.value = document.body.classList.contains('dark-mode')
})
</script>

<template>
  <div class="app-layout">
    <!-- Premium Frosted Navigation -->
    <header class="main-header sticky-nav">
      <div class="container nav-content">
        <div class="logo-wrapper" @click="router.push('/')">
          <div class="logo-icon">TH</div>
          <span class="logo-text">Take Hub</span>
        </div>
        
        <nav class="nav-links">
          <router-link to="/meetings" class="nav-link">Rooms</router-link>
          <router-link to="/academy" class="nav-link">Academy</router-link>
          <router-link to="/business" class="nav-link">Business</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
          <router-link v-if="authStore.isPremium" to="/dashboard" class="nav-link accent-highlight">My Hub</router-link>
        </nav>

        <div class="nav-actions">
           <button @click="toggleTheme" class="theme-btn" :title="isDarkMode ? 'Light Mode' : 'Dark Mode'">
              <Sun v-if="isDarkMode" :size="20" />
              <Moon v-else :size="20" />
           </button>
           <button v-if="!authStore.isAuthenticated" @click="showJoinModal = true" class="btn-primary">
             Join Now
           </button>
           <button v-else @click="handleLogout" class="btn-logout">
              <LogOut :size="18" /> <span>Sign Out</span>
           </button>
        </div>
      </div>
    </header>

    <main class="page-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Join Modal -->
    <div v-if="showJoinModal" class="modal-overlay" @click.self="showJoinModal = false">
      <div class="join-modal reveal">
        <div class="modal-header">
           <div class="header-icon"><Rocket :size="32" /></div>
           <h2>Join our Community</h2>
           <button class="close-btn" @click="showJoinModal = false">&times;</button>
        </div>
        <div class="modal-body">
           <p class="intro">Become part of Kigali's leading hub for innovators, creators and learners.</p>
           
           <div class="featured-courses">
              <h4>🔥 Recommended Courses</h4>
              <div class="course-list">
                 <div class="course-mini" @click="goToAcademy">
                    <div class="c-dot"></div>
                    <div>
                       <span class="c-title">Fullstack Web Development</span>
                       <span class="c-meta">High Demand • 12 Weeks</span>
                    </div>
                 </div>
                 <div class="course-mini" @click="goToAcademy">
                    <div class="c-dot"></div>
                    <div>
                       <span class="c-title">Soft Skills & Leadership</span>
                       <span class="c-meta">Hot • 4 Weeks</span>
                    </div>
                 </div>
              </div>
           </div>

           <div class="contact-section">
              <h4>📞 Let's Stay in Touch</h4>
              <p>Contact us directly to discuss your career path or room membership.</p>
              <div class="contact-links">
                 <a href="https://wa.me/250780548283" class="contact-link whatsapp">
                    <MessageSquare :size="18" /> WhatsApp Support
                 </a>
                 <a href="mailto:saidabi@gmail.com" class="contact-link email">
                    <Mail :size="18" /> Email Admissions
                 </a>
              </div>
           </div>

           <button class="btn-auth-redirect" @click="router.push({ path: '/login', query: { redirect: '/dashboard' } }); showJoinModal = false">
              Professional Login / Sign Up
           </button>
        </div>
      </div>
    </div>

    <!-- Professional Multi-column Footer -->
    <footer class="main-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <div class="logo-wrapper mb-6">
            <div class="logo-icon">TH</div>
            <span class="logo-text">Take Hub</span>
          </div>
          <p class="text-dim mb-8">Kigali's premier digital sanctuary where cross-functional teams build the future. Join the elite community of Rwandan professionals.</p>
          <div class="contact-mini">
            <div class="c-item"><MapPin :size="16" /> KN 254 St, Kigali</div>
            <div class="c-item"><Phone :size="16" /> +250 780 548 283</div>
            <div class="c-item"><Mail :size="16" /> saidabi@gmail.com</div>
          </div>
        </div>
        
        <div class="footer-links">
          <h4>Departments</h4>
          <router-link to="/meetings">Developer Room</router-link>
          <router-link to="/meetings">Multimedia Hub</router-link>
          <router-link to="/business">Marketing Lab</router-link>
          <router-link to="/academy">Professional Academy</router-link>
          <router-link to="/business">Strategy Room</router-link>
        </div>

        <div class="footer-links">
          <h4>Platform</h4>
          <router-link to="/about">Our Story</router-link>
          <router-link to="/academy">Course Catalog</router-link>
          <router-link to="/dashboard" class="admin-link">Professional Dashboard</router-link>
          <router-link to="#">Help Center</router-link>
          <router-link to="#">Privacy Policy</router-link>
          <router-link to="#">Terms of Service</router-link>
        </div>

        <div class="footer-newsletter">
          <h4>Stay Updated</h4>
          <p class="text-xs text-dim mb-4">Get the latest workshop schedules and hub news directly in your inbox.</p>
          <div class="newsletter-input">
            <input type="email" placeholder="email@example.com" />
            <button class="btn-send"><Send :size="16" /></button>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="container flex-bw">
          <p class="text-dim">&copy; 2026 Take Hub. Developed by TRINAM stack.co. All rights reserved.</p>
          <div class="footer-socials">
             <a href="#">TW</a><a href="#">LI</a><a href="#">IG</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-layout { min-height: 100vh; display: flex; flex-direction: column; }

/* Sticky Frosted Nav */
.sticky-nav {
  position: sticky;
  top: 0;
  background: var(--glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--glass-border);
  z-index: 1000;
  height: 80px;
  display: flex;
  align-items: center;
}

.nav-content { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.logo-wrapper { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; }

.logo-icon {
  background: var(--primary);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
}

.logo-text { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); letter-spacing: -1px; }

.nav-links { display: flex; gap: 2.5rem; }
.nav-link { color: var(--text-secondary); font-weight: 700; font-size: 0.95rem; transition: color 0.3s ease; }
.nav-link:hover, .router-link-active { color: var(--primary); }

.nav-actions { display: flex; align-items: center; gap: 2rem; }
.theme-btn { background: transparent; border: none; cursor: pointer; color: var(--text-dim); padding: 0.5rem; transition: transform 0.3s ease; }
.theme-btn:hover { transform: rotate(15deg); color: var(--primary); }

.btn-primary { 
  background: var(--text-primary); 
  color: white; 
  border: none; 
  padding: 0.75rem 1.75rem; 
  border-radius: 12px; 
  font-weight: 700; 
  cursor: pointer; 
  transition: all 0.3s ease; 
}
.btn-primary:hover { background: var(--primary); transform: translateY(-2px); box-shadow: 0 10px 20px rgba(30,167,153,0.15); }

.btn-logout { background: transparent; border: 1px solid var(--glass-border); color: var(--text-secondary); padding: 0.6rem 1.2rem; border-radius: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }

.page-content { flex: 1; }

/* Footer Styling */
.main-footer { padding: 8rem 0 3rem; background: var(--bg-secondary); border-top: 1px solid var(--glass-border); }
.footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.5fr; gap: 4rem; margin-bottom: 6rem; }

.footer-brand p { line-height: 1.8; color: var(--text-secondary); }
.contact-mini { display: flex; flex-direction: column; gap: 1rem; }
.c-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; color: var(--text-dim); }

.footer-links h4, .footer-newsletter h4 { font-size: 1rem; font-weight: 800; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 1px; }
.footer-links { display: flex; flex-direction: column; gap: 1rem; }
.footer-links a { color: var(--text-dim); font-size: 0.9rem; font-weight: 600; transition: color 0.3s ease; }
.footer-links a:hover { color: var(--primary); }

.newsletter-input { display: flex; background: white; border-radius: 12px; border: 1px solid var(--glass-border); padding: 0.4rem; }
.newsletter-input input { border: none; background: transparent; padding: 0.6rem 1rem; flex: 1; font-size: 0.9rem; }
.newsletter-input input:focus { outline: none; }
.btn-send { background: var(--primary); color: white; border: none; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

.footer-bottom { padding-top: 3rem; border-top: 1px solid var(--glass-border); }
.flex-bw { display: flex; justify-content: space-between; align-items: center; }
.footer-socials { display: flex; gap: 1.5rem; }
.footer-socials a { font-size: 0.75rem; font-weight: 900; color: var(--text-dim); }

/* Transition Fade */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.join-modal {
  background: var(--bg-primary);
  width: 100%;
  max-width: 500px;
  border-radius: 30px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.3);
  overflow: hidden;
  border: 1px solid var(--glass-border);
}

.modal-header {
  background: var(--primary);
  color: white;
  padding: 3rem 2rem 2rem;
  text-align: center;
  position: relative;
}

.header-icon {
  margin-bottom: 1rem;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
}

.modal-body {
  padding: 2.5rem;
}

.intro {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  font-weight: 500;
}

h4 {
  font-size: 0.9rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1.25rem;
  color: var(--primary);
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.course-mini {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.course-mini:hover {
  transform: translateX(5px);
  background: var(--glass-border);
}

.c-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary);
}

.c-title {
  display: block;
  font-weight: 700;
  font-size: 0.95rem;
}

.c-meta {
  font-size: 0.75rem;
  color: var(--text-dim);
}

.contact-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
}

.whatsapp { background: #25D366; color: white; }
.email { background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--glass-border); }

.btn-auth-redirect {
  width: 100%;
  margin-top: 2.5rem;
  padding: 1rem;
  border-radius: 12px;
  border: none;
  background: var(--text-primary);
  color: white;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-auth-redirect:hover {
  background: var(--primary);
  box-shadow: 0 10px 20px rgba(30,167,153,0.2);
}

.admin-link {
  color: var(--primary) !important;
  font-weight: 800 !important;
  font-size: 0.9rem !important;
  letter-spacing: 0.5px;
}

.admin-link:hover {
  color: var(--text-primary) !important;
  transform: translateX(5px);
}

@media (max-width: 968px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .nav-links { display: none; }
  .footer-bottom .flex-bw { flex-direction: column; gap: 1.5rem; text-align: center; }
}
</style>
