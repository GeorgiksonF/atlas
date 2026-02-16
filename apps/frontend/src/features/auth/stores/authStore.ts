import type { User } from '@atlas/types';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('token'));
    const user = ref<User | null>(null);

    const isAuthenticated = computed(() => !!token.value);

    const setToken = (newToken: string) => {
        localStorage.setItem('token', newToken);
        token.value = newToken;
    }

    const setUser = (newUser: User) => {
        user.value = newUser;
    }

    const logout = () => {
        localStorage.removeItem('token');
        user.value = null;
        token.value = null;
    }

    return {
        token,
        user,
        isAuthenticated,
        setToken,
        setUser,
        logout,
    }
});