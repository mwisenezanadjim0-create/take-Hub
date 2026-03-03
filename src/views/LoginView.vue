<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Lock, Mail, ChevronRight, AlertCircle, ShieldCheck, User } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isLogin = ref(true)
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

const handleAuth = async () => {
  error.value = ''
  
  if (!isLogin.value && password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true
  
  let success = false
  if (isLogin.value) {
    success = await authStore.login({ email: email.value, password: password.value })
  } else {
    success = await authStore.register({ name: name.value, email: email.value, password: password.value })
  }
  
  if (success) {
    // If they came from a specific page (like a course), go to payment first
    const redirectTo = route.query.redirect || '/'
    if (redirectTo !== '/') {
      router.push({ path: '/payment', query: { redirect: redirectTo } })
    } else {
      router.push('/dashboard')
    }
  } else {
    error.value = authStore.error
  }
  loading.value = false
}
</script>

<template>
  <div class="login-view container">
    <div class="login-card glass-panel reveal">
      <div class="login-header">
        <div class="icon-circle">
          <ShieldCheck v-if="isLogin" :size="32" class="accent-text" />
          <User v-else :size="32" class="accent-text" />
        </div>
        <h1>{{ isLogin ? 'Member' : 'Create' }} <span class="accent-text">{{ isLogin ? 'Login' : 'Account' }}</span></h1>
        <p class="text-dim">{{ isLogin ? 'Welcome back to Take Hub' : 'Join Kigali\'s leading digital sanctuary' }}</p>
      </div>

      <form @submit.prevent="handleAuth" class="login-form">
        <div v-if="error" class="error-banner">
          <AlertCircle :size="18" />
          <span>{{ error }}</span>
        </div>

        <div v-if="!isLogin" class="form-group">
          <label>Full Name</label>
          <div class="input-wrapper">
            <User :size="18" class="input-icon" />
            <input 
              v-model="name" 
              type="text" 
              placeholder="MUGABO Said" 
              required 
            />
          </div>
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <div class="input-wrapper">
            <Mail :size="18" class="input-icon" />
            <input 
              v-model="email" 
              type="email" 
              placeholder="saidabi@gmail.com" 
              required 
            />
          </div>
        </div>

        <div class="form-group">
          <label>Password</label>
          <div class="input-wrapper">
            <Lock :size="18" class="input-icon" />
            <input 
              v-model="password" 
              type="password" 
              placeholder="••••••••" 
              required 
            />
          </div>
        </div>

        <div v-if="!isLogin" class="form-group">
          <label>Confirm Password</label>
          <div class="input-wrapper">
            <Lock :size="18" class="input-icon" />
            <input 
              v-model="confirmPassword" 
              type="password" 
              placeholder="••••••••" 
              required 
            />
          </div>
        </div>

        <button type="submit" class="btn-premium login-btn" :disabled="loading">
          <span v-if="!loading">{{ isLogin ? 'Login to Hub' : 'Register Now' }} <ChevronRight :size="18" /></span>
          <span v-else>Processing...</span>
        </button>
      </form>

      <div class="auth-toggle mt-8">
        <p v-if="isLogin" class="text-dim">New to Take Hub? <a href="#" @click.prevent="isLogin = false" class="accent-text font-bold">Sign Up</a></p>
        <p v-else class="text-dim">Already have an account? <a href="#" @click.prevent="isLogin = true" class="accent-text font-bold">Log In</a></p>
      </div>
      
      <div class="login-footer">
        <p class="text-dim">Authorized & Secured Access</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-card {
  width: 100%;
  max-width: 450px;
  padding: 4rem;
  border-radius: 40px;
  text-align: center;
}

.icon-circle {
  width: 80px;
  height: 80px;
  background: var(--primary-glow);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 2rem;
  border: 1px solid rgba(76, 201, 240, 0.1);
}

.login-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.login-form {
  margin-top: 3rem;
  text-align: left;
}

.error-banner {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.form-group {
  margin-bottom: 2rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  color: var(--text-dim);
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-dim);
}

input {
  width: 100%;
  padding: 1.25rem 1.25rem 1.25rem 3.5rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: var(--accent);
  background: rgba(255, 255, 255, 0.06);
}

.login-btn {
  width: 100%;
  padding: 1.25rem;
  justify-content: center;
  font-size: 1.1rem;
  margin-top: 1rem;
}

.login-footer {
  margin-top: 3rem;
  font-size: 0.85rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}
</style>
