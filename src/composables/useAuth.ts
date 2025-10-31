import { ref, onUnmounted } from 'vue'
import { supabase } from '../utils/supabase'
import type { Session, User } from '@supabase/supabase-js'

const user = ref<User | null>(null)
const session = ref<Session | null>(null)

supabase.auth.getSession().then(({ data }) => {
  session.value = data.session ?? null
  user.value = data.session?.user ?? null
})

const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
  session.value = newSession ?? null
  user.value = newSession?.user ?? null
})

onUnmounted(() => {
  subscription?.unsubscribe()
})

export function useAuth() {
  async function signUp(email: string, password: string) {
    return supabase.auth.signUp({ email, password })
  }
  async function signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password })
  }
  async function signOut() {
    return supabase.auth.signOut()
  }
  return { user, session, signUp, signIn, signOut }
}
