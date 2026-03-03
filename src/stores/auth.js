import { defineStore } from 'pinia';
import { authService } from '../services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null
    }),

    getters: {
        isAdmin: (state) => state.user?.role === 'admin',
        isPremium: (state) => state.user?.hasPaid || state.user?.role === 'admin',
        isAuthenticated: (state) => !!state.token
    },

    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const response = await authService.login(credentials);
                this.user = response.data.user;
                this.token = response.data.token;

                localStorage.setItem('user', JSON.stringify(this.user));
                localStorage.setItem('token', this.token);
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Login failed';
                return false;
            } finally {
                this.loading = false;
            }
        },
        async register(userData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await authService.register(userData);
                this.user = response.data.user;
                this.token = response.data.token;

                localStorage.setItem('user', JSON.stringify(this.user));
                localStorage.setItem('token', this.token);
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Registration failed';
                return false;
            } finally {
                this.loading = false;
            }
        },

        completePayment() {
            if (this.user) {
                this.user.hasPaid = true;
                localStorage.setItem('user', JSON.stringify(this.user));
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }
});
