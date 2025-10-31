import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

export const useAuthStore = defineStore('auth', () => {
  const { user, session, signOut } = useAuth()
  return { user, session, signOut }
})