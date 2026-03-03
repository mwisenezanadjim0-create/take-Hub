<script setup>
import { ref, onMounted } from 'vue'
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Briefcase, 
  PlusCircle, 
  LayoutDashboard,
  CheckCircle,
  XCircle,
  GraduationCap,
  Image as ImageIcon,
  BookOpen,
  DollarSign,
  Clock,
  Edit,
  Sun,
  Moon,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  Zap,
  Eye,
  MousePointer2
} from 'lucide-vue-next'
import { staffService, academyService, hubService } from '../services/api'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const activeTab = ref(authStore.isAdmin ? 'staff' : 'my-hub')
const staff = ref([])
const courses = ref([])
const loading = ref(true)
const showModal = ref(false)
const notification = ref(null)
const isEditMode = ref(false)
const editingId = ref(null)
const isDarkMode = ref(false)
const showSecretActions = ref(false)

const analyticsStats = ref({
  totalViews: 0,
  activeNow: 0,
  topPage: '/academy',
  conversions: 0
})

const dashboardCounts = ref({
  staff: 0,
  courses: 0,
  enrollments: 0
})

const fetchData = async () => {
  loading.value = true
  try {
    const [staffRes, coursesRes, statsRes] = await Promise.all([
      staffService.getAllStaff(),
      academyService.getCourses(),
      hubService.getStats()
    ])
    staff.value = staffRes.data
    courses.value = coursesRes.data
    
    // Real Stats from Backend
    analyticsStats.value.activeNow = statsRes.data.activeNow;
    analyticsStats.value.totalViews = statsRes.data.users * 12 + 450; // Dynamic multiplier for demo
    
    // Derived dashboard metrics
    dashboardCounts.value.staff = statsRes.data.staff;
    dashboardCounts.value.courses = statsRes.data.courses;
    dashboardCounts.value.enrollments = courses.value.reduce((acc, c) => acc + (c.enrolledStudents || 0), 0);
    
    // Sync with analytics stats
    analyticsStats.value.conversions = dashboardCounts.value.enrollments;
  } catch (error) {
    showNotification('error', 'Failed to fetch dashboard data')
  } finally {
    loading.value = false
  }
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark-mode')
}

const handleAddStaff = async () => {
  try {
    await staffService.addStaff(newStaff.value)
    showNotification('success', 'Staff member added successfully!')
    closeModal()
    fetchData()
  } catch (error) {
    showNotification('error', 'Failed to add staff member')
  }
}

const handleAddCourse = async () => {
  try {
    if (isEditMode.value) {
      await academyService.updateCourse(editingId.value, newCourse.value)
      showNotification('success', 'Course updated successfully!')
    } else {
      await academyService.createCourse(newCourse.value)
      showNotification('success', 'Course created successfully!')
    }
    closeModal()
    fetchData()
  } catch (error) {
    showNotification('error', `Failed to ${isEditMode.value ? 'update' : 'create'} course`)
  }
}

const handleEditCourse = (course) => {
  isEditMode.value = true
  editingId.value = course._id
  newCourse.value = { ...course }
  showModal.value = true
}

const handleDeleteCourse = async (id) => {
  if (!confirm('Are you sure?')) return
  try {
    await academyService.deleteCourse(id)
    showNotification('success', 'Course deleted')
    fetchData()
  } catch (error) {
    showNotification('error', 'Failed to delete course')
  }
}

const handleDeleteStaff = async (id) => {
  if (!confirm('Are you sure?')) return
  try {
    await staffService.deleteStaff(id)
    showNotification('success', 'Staff member removed')
    fetchData()
  } catch (error) {
    showNotification('error', 'Failed to remove staff member')
  }
}

const showNotification = (type, message) => {
  notification.value = { type, message }
  setTimeout(() => notification.value = null, 3000)
}

const closeModal = () => {
  showModal.value = false
  isEditMode.value = false
  editingId.value = null
  resetForms()
}

const resetForms = () => {
  newStaff.value = { name: '', role: '', department: 'academic', email: '', bio: '', avatar: '' }
  newCourse.value = { title: '', description: '', category: 'development', level: 'beginner', instructor: '', price: 0, duration: '4 weeks', thumbnail: '' }
}

onMounted(fetchData)

const newStaff = ref({ name: '', role: '', department: 'academic', email: '', bio: '', avatar: '' })
const newCourse = ref({ title: '', description: '', category: 'development', level: 'beginner', instructor: '', price: 0, duration: '4 weeks', thumbnail: '' })
</script>

<template>
  <div class="dashboard-layout">
    <div v-if="notification" class="notification" :class="notification.type">
       <CheckCircle v-if="notification.type === 'success'" :size="20" />
       <XCircle v-else :size="20" />
       {{ notification.message }}
    </div>

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-box">TH</div>
        <span>Hub Master</span>
      </div>

      <nav class="nav-menu">
        <button v-if="authStore.isAdmin" @click="activeTab = 'staff'" class="nav-btn" :class="{ active: activeTab === 'staff' }">
          <Users :size="20" /> <span>Staff Management</span>
        </button>
        <button v-if="authStore.isAdmin" @click="activeTab = 'courses'" class="nav-btn" :class="{ active: activeTab === 'courses' }">
          <BookOpen :size="20" /> <span>Academy Content</span>
        </button>
        <button v-if="!authStore.isAdmin" @click="activeTab = 'my-hub'" class="nav-btn" :class="{ active: activeTab === 'my-hub' }">
          <LayoutDashboard :size="20" /> <span>My Hub Overview</span>
        </button>
        <button @click="activeTab = 'media'" class="nav-btn" :class="{ active: activeTab === 'media' }">
          <ImageIcon :size="20" /> <span>Media Library</span>
        </button>
        <button v-if="authStore.isAdmin" @click="activeTab = 'analytics'" class="nav-btn" :class="{ active: activeTab === 'analytics' }">
          <TrendingUp :size="20" /> <span>Analytics Hub</span>
        </button>
      </nav>

      <!-- Secret Button (Admin Only) -->
      <div v-if="authStore.isAdmin" class="secret-zone py-6">
         <button @click="showSecretActions = !showSecretActions" class="btn-secret" :class="{ triggered: showSecretActions }">
            <ShieldAlert :size="18" />
            <span v-if="showSecretActions">System Override Active</span>
            <span v-else>Secret Module</span>
         </button>
         
         <div v-if="showSecretActions" class="secret-controls reveal mt-4">
            <button class="secret-act"><Zap :size="14" /> Clear Cache</button>
            <button class="secret-act"><Zap :size="14" /> Ghost Mode</button>
         </div>
      </div>

      <div class="sidebar-footer">
        <button @click="toggleTheme" class="theme-switch">
          <Sun v-if="isDarkMode" :size="18" />
          <Moon v-else :size="18" />
          <span>{{ isDarkMode ? 'Light' : 'Dark' }} Mode</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="top-bar">
        <div class="search-field">
          <Search :size="18" />
          <input type="text" placeholder="Quick search..." />
        </div>
        <div class="user-profile">
          <div class="profile-info">
            <span class="user-name">{{ authStore.user?.name || 'MUGABO Said' }}</span>
            <span class="user-role">{{ authStore.isAdmin ? 'Founder & CEO' : 'Hub Member' }}</span>
          </div>
          <img :src="authStore.isAdmin ? '/mugabo-said.jpg' : (authStore.user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e')" class="avatar-small" />
        </div>
      </header>

      <div class="view-container">
        <!-- LEARNER VIEW: My Hub -->
        <section v-if="!authStore.isAdmin && activeTab === 'my-hub'" class="learner-dashboard reveal">
           <div class="view-header">
              <h1>Welcome to Motherboard <span class="accent-text">{{ authStore.user?.name }}</span></h1>
              <p>Your premium access to all Take Hub chambers is active.</p>
           </div>

           <div class="stats-bar">
              <div class="stat-card">
                 <span class="val">{{ analyticsStats.activeNow }}</span>
                 <span class="lab">Staff Online Now</span>
              </div>
              <div class="stat-card">
                 <span class="val">3</span>
                 <span class="lab">Active Rooms</span>
              </div>
              <div class="stat-card highlight">
                 <span class="val">Elite</span>
                 <span class="lab">Hub Status</span>
              </div>
           </div>

           <div class="learner-grid">
              <!-- Enrolled Courses -->
              <div class="l-card glass-panel">
                 <div class="lc-header">
                    <BookOpen :size="20" />
                    <h3>My Courses</h3>
                 </div>
                 <div class="lc-body">
                    <div v-if="courses.length > 0" class="mini-course-row">
                       <div class="mc-item" @click="$router.push('/academy')">
                          <img :src="courses[0].thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'" />
                          <div class="mc-info">
                             <span class="title">{{ courses[0].title }}</span>
                             <span class="progress">Continue Learning <ArrowRight :size="12" /></span>
                          </div>
                       </div>
                    </div>
                    <p v-else class="text-dim text-sm">No courses unlocked yet. Visit the Academy.</p>
                 </div>
              </div>

              <!-- Online Mentors -->
              <div class="l-card glass-panel">
                 <div class="lc-header">
                    <Users :size="20" />
                    <h3>Online Mentors</h3>
                 </div>
                 <div class="lc-body online-list">
                    <div v-for="member in staff.slice(0, 3)" :key="member._id" class="ment-item">
                       <div class="ment-avatar">
                          <img :src="member.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'" />
                          <div class="status-online"></div>
                       </div>
                       <div class="ment-txt">
                          <span class="name">{{ member.name }}</span>
                          <span class="dept">{{ member.department }} Team</span>
                       </div>
                       <button class="btn-chat-mini"><Send :size="14" /></button>
                    </div>
                 </div>
              </div>

              <!-- Available Chambers -->
              <div class="l-card glass-panel full-width">
                 <div class="lc-header">
                    <LayoutDashboard :size="20" />
                    <h3>Active Hub Chambers</h3>
                 </div>
                 <div class="chambers-quick-grid">
                    <div class="cham-card tech" @click="$router.push('/meetings')">
                       <h4>Developer Chamber</h4>
                       <span class="status">LIVE • 4 Users</span>
                    </div>
                    <div class="cham-card creative" @click="$router.push('/meetings')">
                       <h4>Multimedia Studio</h4>
                       <span class="status">LIVE • 2 Users</span>
                    </div>
                    <div class="cham-card business" @click="$router.push('/meetings')">
                       <h4>Strategy Room</h4>
                       <span class="status">OFFLINE</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        <!-- ADMIN ONLY VIEWS -->
        <!-- Staff Management -->
        <section v-if="authStore.isAdmin && activeTab === 'staff'" class="data-view reveal">
          <div class="view-header">
            <div class="header-text">
              <h1>Staff Directory</h1>
              <p>Manage access levels and profiles for your hub team.</p>
            </div>
            <button @click="showModal = true" class="btn-primary">
              <PlusCircle :size="18" /> Add Member
            </button>
          </div>

          <div class="stats-bar">
            <div class="stat-card">
              <span class="val">{{ staff.length }}</span>
              <span class="lab">Total Team</span>
            </div>
            <div class="stat-card">
              <span class="val">{{ staff.filter(s => s.department === 'academic').length }}</span>
              <span class="lab">Academic</span>
            </div>
            <div class="stat-card">
              <span class="val">{{ staff.filter(s => s.department === 'marketing').length }}</span>
              <span class="lab">Marketing</span>
            </div>
          </div>

          <div class="data-table-wrapper card-shadow">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Department</th>
                  <th>Joined Date</th>
                  <th>Status</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="member in staff" :key="member._id">
                  <td>
                    <div class="member-cell">
                      <img :src="member.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'" />
                      <div>
                        <span class="name">{{ member.name }}</span>
                        <span class="role">{{ member.role }}</span>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge" :class="member.department">{{ member.department }}</span></td>
                  <td>{{ new Date(member.joinedAt).toLocaleDateString() }}</td>
                  <td><span class="status-dot"></span> Active</td>
                  <td class="text-right">
                    <button @click="handleDeleteStaff(member._id)" class="btn-icon danger"><Trash2 :size="16" /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Courses Management -->
        <section v-if="activeTab === 'courses'" class="data-view reveal">
          <div class="view-header">
            <div class="header-text">
              <h1>Course Catalog</h1>
              <p>Review and update your academy's learning content.</p>
            </div>
            <button @click="showModal = true" class="btn-primary">
              <PlusCircle :size="18" /> Create Course
            </button>
          </div>

          <div class="courses-grid-admin">
            <div v-for="course in courses" :key="course._id" class="course-admin-card card-shadow">
              <div class="course-thumb" :style="{ backgroundImage: `url(${course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'})` }">
                <span class="badge course-badge" :class="course.category">{{ course.category }}</span>
              </div>
              <div class="course-details">
                <h3>{{ course.title }}</h3>
                <p class="instructor">Instructor: {{ course.instructor }}</p>
                <div class="course-meta-admin">
                  <span class="price">{{ course.price.toLocaleString() }} FRW</span>
                  <div class="btns">
                    <button @click="handleEditCourse(course)" class="btn-icon"><Edit :size="16" /></button>
                    <button @click="handleDeleteCourse(course._id)" class="btn-icon danger"><Trash2 :size="16" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Media Placeholder -->
        <section v-if="activeTab === 'media'" class="data-view reveal text-center py-20">
          <ImageIcon :size="64" class="text-dim mb-4" />
          <h2>Media Assets</h2>
          <p class="text-dim">Project files and presentation images management coming soon.</p>
        </section>

        <!-- Analytics Overview -->
        <section v-if="activeTab === 'analytics'" class="data-view reveal">
           <div class="view-header">
              <div class="header-text">
                 <h1>Website Analytics</h1>
                 <p>Real-time traffic and user engagement insights.</p>
              </div>
              <div class="date-range">Last 30 Days</div>
           </div>

           <div class="stats-bar analytics-stats">
              <div class="stat-card">
                 <div class="s-icon"><Eye :size="24" /></div>
                 <span class="val">{{ analyticsStats.totalViews.toLocaleString() }}</span>
                 <span class="lab">Total Page Views</span>
              </div>
              <div class="stat-card highlight">
                 <div class="s-icon"><Users :size="24" /></div>
                 <span class="val pulse">{{ analyticsStats.activeNow }}</span>
                 <span class="lab">Users Online Now</span>
              </div>
            <div class="stat-card">
               <div class="s-icon"><MousePointer2 :size="24" /></div>
               <span class="val">{{ dashboardCounts.enrollments }}</span>
               <span class="lab">Course Enrollments</span>
            </div>
         </div>

         <div class="analytics-charts mt-10">
            <div class="chart-box card-shadow">
               <h3>Distribution by Department</h3>
               <div class="dummy-chart">
                  <div class="bar" :style="{height: (staff.filter(s => s.department === 'academic').length * 20) + '%'}" title="Academic"></div>
                  <div class="bar" :style="{height: (staff.filter(s => s.department === 'marketing').length * 20) + '%'}" title="Marketing"></div>
                  <div class="bar" :style="{height: (staff.filter(s => s.department === 'multimedia').length * 20) + '%'}" title="Multimedia"></div>
                  <div class="bar" :style="{height: (courses.filter(c => c.category === 'development').length * 10) + '%'}" title="Dev Courses"></div>
                  <div class="bar" :style="{height: (courses.filter(c => c.category === 'business').length * 10) + '%'}" title="Biz Courses"></div>
               </div>
               <div class="chart-labels">
                  <span>Acad Staff</span><span>Mark Staff</span><span>Multi Staff</span><span>Dev Courses</span><span>Biz Courses</span>
               </div>
            </div>
              
              <div class="chart-box card-shadow">
                 <h3>Most Popular Rooms</h3>
                 <div class="popular-list">
                    <div class="pop-item">
                       <span>Developer Room</span>
                       <div class="progress-bg"><div class="progress-bar" style="width: 85%"></div></div>
                       <span>85%</span>
                    </div>
                    <div class="pop-item">
                       <span>Academy Hub</span>
                       <div class="progress-bg"><div class="progress-bar" style="width: 62%"></div></div>
                       <span>62%</span>
                    </div>
                    <div class="pop-item">
                       <span>Multimedia Room</span>
                       <div class="progress-bg"><div class="progress-bar" style="width: 45%"></div></div>
                       <span>45%</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>

    <!-- Action Modal -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-box reveal">
        <div class="modal-header">
          <h2>{{ isEditMode ? 'Edit Entry' : 'Add New Entry' }}</h2>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        
        <form v-if="activeTab === 'staff'" @submit.prevent="handleAddStaff" class="modern-form">
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <input v-model="newStaff.name" required />
            </div>
            <div class="form-group">
              <label>Role</label>
              <input v-model="newStaff.role" required />
            </div>
            <div class="form-group">
              <label>Department</label>
              <select v-model="newStaff.department">
                <option value="academic">Academic</option>
                <option value="multimedia">Multimedia</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="newStaff.email" type="email" />
            </div>
          </div>
          <button type="submit" class="btn-primary w-full mt-6">Confirm and Save</button>
        </form>

        <form v-else-if="activeTab === 'courses'" @submit.prevent="handleAddCourse" class="modern-form">
          <div class="form-grid">
            <div class="form-group">
              <label>Course Title</label>
              <input v-model="newCourse.title" required />
            </div>
            <div class="form-group">
              <label>Instructor</label>
              <input v-model="newCourse.instructor" required />
            </div>
            <div class="form-group">
              <label>Price (FRW)</label>
              <input v-model="newCourse.price" type="number" required />
            </div>
            <div class="form-group">
              <label>Category</label>
              <select v-model="newCourse.category">
                <option value="development">Development</option>
                <option value="business">Business</option>
                <option value="multimedia">Multimedia</option>
              </select>
            </div>
          </div>
          <button type="submit" class="btn-primary w-full mt-6">Publish Content</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-secondary);
}

/* Sidebar Styling */
.sidebar {
  width: 280px;
  background: var(--bg-primary);
  border-right: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  padding: 2rem;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  font-weight: 800;
  font-size: 1.25rem;
}

.logo-box {
  background: var(--primary);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--text-dim);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.nav-btn:hover, .nav-btn.active {
  background: var(--primary-glow);
  color: var(--primary);
}

.sidebar-footer {
  padding-top: 2rem;
  border-top: 1px solid var(--glass-border);
}

.theme-switch {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--glass-border);
  background: transparent;
  color: var(--text-dim);
  cursor: pointer;
}

/* Main Content Area */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-bar {
  height: 70px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--glass-border);
  padding: 0 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-secondary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  width: 300px;
}

.search-field input {
  background: transparent;
  border: none;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-info {
  text-align: right;
  display: flex;
  flex-direction: column;
}

.user-name { font-weight: 700; font-size: 0.9rem; }
.user-role { font-size: 0.75rem; color: var(--text-dim); }

.avatar-small {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.view-container {
  padding: 3rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.view-header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
.view-header p { color: var(--text-dim); }

.stats-bar {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: var(--bg-primary);
  padding: 1.5rem 2.5rem;
  border-radius: 15px;
  box-shadow: var(--card-shadow);
  text-align: center;
  flex: 1;
}

.stat-card .val { display: block; font-size: 2rem; font-weight: 800; color: var(--primary); }
.stat-card .lab { font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; }

/* Table Styling */
.data-table-wrapper {
  background: var(--bg-primary);
  border-radius: 20px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 1.25rem 2rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-dim);
  border-bottom: 1px solid var(--glass-border);
}

.data-table td {
  padding: 1.25rem 2rem;
  border-bottom: 1px solid var(--glass-border);
}

.member-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.member-cell img { width: 40px; height: 40px; border-radius: 8px; }
.member-cell .name { display: block; font-weight: 700; }
.member-cell .role { font-size: 0.75rem; color: var(--text-dim); }

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}

.academic { background: #e0f2f1; color: #00796b; }
.marketing { background: #fff8e1; color: #f57f17; }
.multimedia { background: #f3e5f5; color: #7b1fa2; }
.development { background: #e3f2fd; color: #1976d2; }

/* Courses Grid Admin */
.courses-grid-admin {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.course-admin-card {
  background: var(--bg-primary);
  border-radius: 20px;
  overflow: hidden;
}

.course-thumb {
  height: 160px;
  background-size: cover;
  background-position: center;
  position: relative;
  padding: 1rem;
}

.course-details { padding: 1.5rem; }
.course-details h3 { margin-bottom: 0.5rem; font-size: 1.1rem; }
.instructor { font-size: 0.85rem; color: var(--text-dim); margin-bottom: 1.5rem; }

.course-meta-admin {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price { font-weight: 800; color: var(--primary); }

.btns { display: flex; gap: 0.5rem; }

.btn-icon {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--glass-border);
  background: transparent;
  color: var(--text-dim);
  cursor: pointer;
}

.btn-icon:hover { background: var(--bg-secondary); color: var(--text-primary); }
.btn-icon.danger:hover { color: #f43f5e; background: #fff1f2; }

/* Modal Box */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  background: var(--bg-primary);
  padding: 3rem;
  border-radius: 30px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.2);
}

.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { font-size: 0.8rem; font-weight: 600; color: var(--text-dim); }
.form-group input, .form-group select {
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--glass-border);
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.w-full { width: 100%; }
.mt-6 { margin-top: 2rem; }

.card-shadow { box-shadow: var(--card-shadow); }

.notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  color: white;
  z-index: 3000;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.notification.success { background: #10b981; }
.notification.error { background: #f43f5e; }

/* Learner Dashboard Specifics */
.learner-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  margin-top: 3rem;
}

.l-card { padding: 2.5rem; border-radius: 25px; }
.full-width { grid-column: span 2; }
.lc-header { display: flex; align-items: center; gap: 1rem; color: var(--primary); margin-bottom: 2rem; }
.lc-header h3 { font-size: 1.1rem; color: var(--text-primary); }

.mc-item { display: flex; gap: 1.5rem; align-items: center; cursor: pointer; }
.mc-item img { width: 80px; height: 60px; border-radius: 12px; object-fit: cover; }
.mc-info .title { display: block; font-weight: 700; margin-bottom: 0.25rem; }
.mc-info .progress { font-size: 0.75rem; color: var(--primary); font-weight: 800; display: flex; align-items: center; gap: 0.4rem; }

.online-list { display: flex; flex-direction: column; gap: 1.5rem; }
.ment-item { display: flex; align-items: center; gap: 1rem; }
.ment-avatar { position: relative; width: 44px; height: 44px; }
.ment-avatar img { width: 100%; height: 100%; border-radius: 50%; }
.status-online { position: absolute; bottom: 2px; right: 2px; width: 10px; height: 10px; background: #10b981; border: 2px solid white; border-radius: 50%; }
.ment-txt { flex: 1; }
.ment-txt .name { display: block; font-weight: 700; font-size: 0.9rem; }
.ment-txt .dept { font-size: 0.75rem; color: var(--text-dim); }
.btn-chat-mini { background: var(--bg-secondary); border: none; padding: 0.5rem; border-radius: 8px; color: var(--text-dim); cursor: pointer; }
.btn-chat-mini:hover { color: var(--primary); background: var(--primary-glow); }

.chambers-quick-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.cham-card { padding: 2.5rem; border-radius: 20px; cursor: pointer; transition: all 0.3s ease; }
.cham-card h4 { margin-bottom: 0.75rem; font-size: 1.1rem; }
.cham-card .status { font-size: 0.7rem; font-weight: 800; letter-spacing: 1px; }

.cham-card.tech { background: linear-gradient(135deg, #0c4a4a 0%, #1ea799 100%); color: white; }
.cham-card.creative { background: linear-gradient(135deg, #7b1fa2 0%, #f3e5f5 100%); color: #7b1fa2; }
.cham-card.business { background: #f8fafc; border: 1px solid var(--glass-border); color: #475569; }

.cham-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }

/* Secret Zone */
.btn-secret {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px dashed var(--glass-border);
  background: transparent;
  color: var(--text-dim);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secret:hover {
  background: rgba(244, 63, 94, 0.05);
  border-color: rgba(244, 63, 94, 0.3);
  color: #f43f5e;
}

.btn-secret.triggered {
  background: #1a1f2c;
  color: #fbbf24;
  border-style: solid;
  border-color: #fbbf24;
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.2);
}

.secret-act {
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: var(--text-dim);
  font-size: 0.75rem;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border-radius: 6px;
}

.secret-act:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

/* Analytics Hub Styles */
.analytics-stats .stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.s-icon {
  margin-bottom: 1rem;
  color: var(--primary);
  opacity: 0.5;
}

.stat-card.highlight {
  border: 2px solid var(--primary);
  background: var(--primary-glow);
}

.pulse {
  animation: soft-pulse 2s infinite;
}

@keyframes soft-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); color: var(--accent); }
  100% { transform: scale(1); }
}

.analytics-charts {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
}

.chart-box {
  background: var(--bg-primary);
  padding: 2rem;
  border-radius: 20px;
}

.chart-box h3 {
  font-size: 1rem;
  margin-bottom: 2rem;
  color: var(--text-dim);
}

.dummy-chart {
  height: 200px;
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--glass-border);
}

.bar {
  flex: 1;
  background: var(--primary);
  border-radius: 4px 4px 0 0;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.bar:hover { opacity: 1; }

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  font-size: 0.7rem;
  color: var(--text-dim);
}

.popular-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pop-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.progress-bg {
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--primary);
  border-radius: 4px;
}

@media (max-width: 968px) {
  .sidebar { display: none; }
  .top-bar { padding: 0 1.5rem; }
  .analytics-charts { grid-template-columns: 1fr; }
}
</style>
