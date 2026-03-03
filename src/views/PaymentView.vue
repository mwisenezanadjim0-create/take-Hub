<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  CreditCard, 
  Smartphone, 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  Lock,
  Wifi,
  MoreHorizontal
} from 'lucide-vue-next'

import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const paymentMethod = ref('card') // 'card' or 'momo'
const step = ref(1) 
const loading = ref(false)

// Input Fields
const momoNumber = ref('')
const cardNumber = ref('')
const cardName = ref('')
const cardExpiry = ref('')
const cardCvc = ref('')
const isCardFlipped = ref(false)

// Computed for Card Brand
const cardBrand = computed(() => {
  if (cardNumber.value.startsWith('4')) return 'VISA'
  if (cardNumber.value.startsWith('5')) return 'MASTERCARD'
  return 'GENERIC'
})

const handlePayment = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    step.value = 3
  }, 2500)
}

const formatCardNumber = (e) => {
  let val = e.target.value.replace(/\D/g, '')
  let formatted = val.match(/.{1,4}/g)?.join(' ') || val
  cardNumber.value = formatted.substring(0, 19)
}

const finishProcess = () => {
  const redirectTo = route.query.redirect || '/'
  router.push(redirectTo)
}
</script>

<template>
  <div class="payment-view container">
    <div class="payment-card glass-panel reveal">
      <!-- Step 1 & 2: Payment Selection and Input -->
      <div v-if="step < 3" class="payment-flow">
        <div class="payment-header">
           <div class="header-top">
             <ShieldCheck :size="40" class="accent-text" />
             <div class="secure-badge">SSL SECURE</div>
           </div>
           <h2>Checkout <span class="accent-text">Take Hub</span></h2>
           <p class="text-dim">Choose your payment method to activate your access.</p>
        </div>

        <div class="method-tabs">
           <div 
             class="tab" 
             :class="{ active: paymentMethod === 'card' }"
             @click="paymentMethod = 'card'"
           >
             <CreditCard :size="20" />
             <span>Credit / Debit Card</span>
           </div>
           <div 
             class="tab" 
             :class="{ active: paymentMethod === 'momo' }"
             @click="paymentMethod = 'momo'"
           >
             <Smartphone :size="20" />
             <span>Mobile Money</span>
           </div>
        </div>

        <!-- Dynamic Card Visualization -->
        <div v-if="paymentMethod === 'card'" class="card-visualizer-container">
           <div class="interactive-card" :class="{ 'is-flipped': isCardFlipped }">
              <div class="card-front">
                 <div class="card-top">
                    <Wifi class="wifi-icon" />
                    <span class="brand-type">{{ cardBrand }}</span>
                 </div>
                 <div class="chip-box"></div>
                 <div class="card-number-display">
                    {{ cardNumber || '•••• •••• •••• ••••' }}
                 </div>
                 <div class="card-details-row">
                    <div class="detail-group">
                       <label>CARD HOLDER</label>
                       <div class="val">{{ cardName.toUpperCase() || 'MUGABO SAID' }}</div>
                    </div>
                    <div class="detail-group">
                       <label>EXPIRES</label>
                       <div class="val">{{ cardExpiry || 'MM/YY' }}</div>
                    </div>
                 </div>
              </div>
              <div class="card-back">
                 <div class="magnetic-strip"></div>
                 <div class="cvv-area">
                    <div class="cvv-label">CVC</div>
                    <div class="cvv-box">{{ cardCvc || '•••' }}</div>
                 </div>
              </div>
           </div>
           
           <!-- Logo Row -->
           <div class="brand-logos">
              <span class="logo-v">VISA</span>
              <span class="logo-m">mastercard</span>
           </div>
        </div>

        <!-- MoMo Brand Display -->
        <div v-else class="momo-brands-container">
           <div class="momo-brand mtn">
              <div class="brand-circle">MTN</div>
              <span>MoMo</span>
           </div>
           <div class="momo-brand airtel">
              <div class="brand-circle">airtel</div>
              <span>Airtel Money</span>
           </div>
        </div>

        <form @submit.prevent="handlePayment" class="payment-form">
          <!-- Card Details Input -->
          <div v-if="paymentMethod === 'card'" class="form-inputs reveal">
             <div class="form-group">
                <label>Cardholder Name</label>
                <input v-model="cardName" type="text" placeholder="MUGABO Said" required />
             </div>
             <div class="form-group">
                <label>Card Number</label>
                <input :value="cardNumber" @input="formatCardNumber" type="text" placeholder="4xxx xxxx xxxx xxxx" required />
             </div>
             <div class="form-row">
                <div class="form-group">
                   <label>Expiry Date</label>
                   <input v-model="cardExpiry" type="text" placeholder="MM/YY" maxlength="5" required />
                </div>
                <div class="form-group">
                   <label>Security Code (CVC)</label>
                   <input 
                     v-model="cardCvc" 
                     type="password" 
                     placeholder="•••" 
                     maxlength="3" 
                     required 
                     @focus="isCardFlipped = true"
                     @blur="isCardFlipped = false"
                   />
                </div>
             </div>
          </div>

          <!-- MoMo Details Input -->
          <div v-else class="form-inputs reveal">
             <div class="form-group">
                <label>Phone Number (MTN / Airtel Rwanda)</label>
                <div class="phone-input-group">
                   <div class="country-code">+250</div>
                   <input v-model="momoNumber" type="text" placeholder="780 000 000" required />
                </div>
             </div>
             <div class="momo-instruction">
                <div class="pulse-ring"></div>
                <p>Ensure your phone is nearby. A secure payment prompt will appear on your screen after you click the button below.</p>
             </div>
          </div>

          <button type="submit" class="btn-premium payment-btn" :disabled="loading">
             <span v-if="!loading">Confirm & Pay <ArrowRight :size="18" /></span>
             <span v-else class="flex-center gap-2">
                <div class="spinner-small"></div> Verifying Transaction...
             </span>
          </button>
        </form>

        <div class="security-footer">
           <Lock :size="12" /> Fully Encrypted via Trinam Stack Secure Gateway
        </div>
      </div>

      <!-- Step 3: Success Upgrade -->
      <div v-else class="payment-success-v2 reveal">
         <div class="confetti-container"></div>
         <div class="check-animation">
            <CheckCircle :size="100" class="success-icon-pulse" />
         </div>
         <h2>Welcome to the <span class="accent-text">Elite Hub</span></h2>
         <p class="text-dim">Your payment of <strong>10,000 FRW</strong> has been confirmed. You now have full access to all Take Hub premium chambers.</p>
         
         <div class="receipt-mini glass-panel">
            <div class="r-row"><span>Transaction ID</span> <span>#TH-{{ Math.floor(Math.random() * 99999) }}</span></div>
            <div class="r-row"><span>Access Granted</span> <span>Lifetime Premium</span></div>
         </div>

         <button @click="finishProcess" class="btn-premium start-btn">
            Access My Dashboard <ArrowRight :size="18" />
         </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  padding: 4rem 2rem;
}

.payment-card {
  width: 100%;
  max-width: 650px;
  padding: 4rem;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
}

.payment-header { text-align: center; margin-bottom: 3.5rem; }
.header-top { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 1rem; }
.secure-badge { font-size: 0.6rem; background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 800; border: 1px solid rgba(16, 185, 129, 0.2); }
.payment-header h2 { font-size: 3rem; margin-bottom: 0.5rem; }

/* Method Tabs */
.method-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--bg-secondary);
  padding: 0.4rem;
  border-radius: 20px;
  margin-bottom: 3.5rem;
  border: 1px solid var(--glass-border);
}

.tab {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 800;
  color: var(--text-dim);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.tab.active {
  background: white;
  color: var(--text-primary);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  transform: scale(1.02);
}

/* 3D Card Visualizer */
.card-visualizer-container {
  perspective: 1000px;
  margin-bottom: 4rem;
}

.interactive-card {
  width: 100%;
  height: 250px;
  position: relative;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
  cursor: pointer;
}

.interactive-card.is-flipped { transform: rotateY(180deg); }

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 25px;
  padding: 2.5rem;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 0 30px 60px rgba(0,0,0,0.2);
}

.card-front {
  background: linear-gradient(135deg, #1ea799 0%, #0c4a4a 100%);
  border: 1px solid rgba(255,255,255,0.1);
}

.card-back {
  background: linear-gradient(135deg, #0c4a4a 0%, #1ea799 100%);
  transform: rotateY(180deg);
  padding: 0;
  display: flex;
  flex-direction: column;
}

.card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.wifi-icon { opacity: 0.6; transform: rotate(90deg); }
.brand-type { font-weight: 900; letter-spacing: 2px; font-size: 1.2rem; }

.chip-box {
  width: 50px;
  height: 40px;
  background: linear-gradient(135deg, #ffcc33 0%, #ffd700 100%);
  border-radius: 8px;
  position: relative;
  margin-bottom: 1.5rem;
}

.card-number-display {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.6rem;
  letter-spacing: 4px;
  font-weight: 700;
  margin-bottom: auto;
}

.card-details-row { display: flex; gap: 3rem; }
.detail-group label { font-size: 0.6rem; opacity: 0.6; margin-bottom: 0.25rem; font-weight: 800; }
.detail-group .val { font-size: 0.9rem; font-weight: 700; }

.magnetic-strip { width: 100%; height: 50px; background: #000; margin-top: 2rem; }
.cvv-area { padding: 2.5rem; text-align: right; }
.cvv-label { font-size: 0.7rem; font-weight: 800; margin-bottom: 0.5rem; }
.cvv-box { background: white; color: black; padding: 0.75rem; border-radius: 4px; font-weight: 900; letter-spacing: 2px; }

/* Brand Logos */
.brand-logos { display: flex; justify-content: center; gap: 3rem; margin-top: 2rem; opacity: 0.4; }
.logo-v { font-weight: 900; font-style: italic; font-size: 1.5rem; color: #1a1f71; }
.logo-m { font-weight: 900; font-size: 1.2rem; color: #eb001b; }

/* MoMo Brands */
.momo-brands-container { display: flex; gap: 2rem; justify-content: center; margin-bottom: 3.5rem; }
.momo-brand { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
.brand-circle { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.9rem; color: white; text-transform: uppercase; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
.mtn .brand-circle { background: #ffcc00; color: #000; }
.airtel .brand-circle { background: #ff0000; }
.momo-brand span { font-size: 0.8rem; font-weight: 800; }

/* Form Elements */
.payment-form { margin-top: 2rem; }
.form-group { margin-bottom: 1.75rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.75rem; }

input {
  width: 100%;
  padding: 1.25rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  color: white;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

input:focus { border-color: var(--primary); outline: none; background: rgba(255,255,255,0.06); }

.phone-input-group { display: flex; align-items: center; }
.country-code { padding: 1.25rem; background: var(--bg-secondary); border: 1px solid var(--glass-border); border-right: none; border-radius: 16px 0 0 16px; font-weight: 800; font-size: 1.1rem; }
.phone-input-group input { border-radius: 0 16px 16px 0; }

.momo-instruction { display: flex; gap: 1.5rem; align-items: center; background: rgba(30,167,153,0.05); padding: 1.5rem; border-radius: 20px; border: 1px solid rgba(30,167,153,0.1); }
.pulse-ring { width: 12px; height: 12px; background: var(--primary); border-radius: 50%; position: relative; }
.pulse-ring::after { content: ''; position: absolute; inset: -10px; border: 2px solid var(--primary); border-radius: 50%; animation: pulse 2s infinite; }
@keyframes pulse { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
.momo-instruction p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }

.payment-btn { width: 100%; padding: 1.5rem; margin-top: 3rem; font-size: 1.1rem; }

/* Success State */
.payment-success-v2 { text-align: center; }
.check-animation { margin-bottom: 2.5rem; }
.success-icon-pulse { color: #10b981; filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.4)); animation: success-pulse 2s infinite ease-in-out; }
@keyframes success-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }

.receipt-mini { padding: 2rem; margin: 3rem 0; text-align: left; display: flex; flex-direction: column; gap: 1rem; }
.r-row { display: flex; justify-content: space-between; font-size: 0.9rem; }
.r-row span:last-child { font-weight: 800; color: var(--text-primary); }

@media (max-width: 768px) {
  .payment-card { padding: 2rem; }
  .interactive-card { height: 200px; padding: 1.5rem; }
  .card-number-display { font-size: 1.1rem; }
  .payment-header h2 { font-size: 2rem; }
}
</style>

<style scoped>
.payment-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
}

.payment-card {
  width: 100%;
  max-width: 550px;
  padding: 4rem;
  border-radius: 40px;
}

.payment-header {
  text-align: center;
  margin-bottom: 3rem;
}

.payment-header h2 { font-size: 2.5rem; margin-bottom: 0.5rem; }

.method-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.method-btn {
  padding: 2rem;
  border-radius: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 700;
  color: var(--text-dim);
}

.method-btn.active {
  background: white;
  border-color: var(--primary);
  color: var(--primary);
  box-shadow: 0 10px 30px rgba(30,167,153,0.1);
}

.payment-form {
  margin-bottom: 2rem;
}

.form-group { margin-bottom: 1.5rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

label { display: block; font-size: 0.9rem; margin-bottom: 0.75rem; color: var(--text-dim); font-weight: 600; }

input {
  width: 100%;
  padding: 1.25rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  color: white;
  font-size: 1rem;
}

input:focus { outline: none; border-color: var(--primary); }

.momo-note {
  font-size: 0.85rem;
  color: var(--text-dim);
  background: rgba(30,167,153,0.05);
  padding: 1rem;
  border-radius: 10px;
  border-left: 3px solid var(--primary);
}

.payment-btn { width: 100%; margin-top: 2rem; padding: 1.25rem; }

.security-footer {
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.success-icon { margin-bottom: 2rem; }
.payment-success h2 { font-size: 3rem; margin-bottom: 1rem; }

.spinner-small {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 600px) {
  .payment-card { padding: 2rem; }
  .method-selector { grid-template-columns: 1fr; }
}
</style>
