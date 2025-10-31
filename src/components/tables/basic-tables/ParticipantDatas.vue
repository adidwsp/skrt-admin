<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="px-5 py-3 text-left w-1/11">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">No.</p>
            </th>
            <th class="px-5 py-3 text-left w-3/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Full Name</p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Email</p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Role</p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Actions</p>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Looping data profiles disini -->
          <tr 
            v-for="(profile, index) in profiles" 
            :key="profile.id"
            class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <td class="px-5 py-3 text-theme-sm dark:text-white">
              {{ index + 1 }}
            </td>
            <td class="px-5 py-3 sm:px-6">
              <p class="text-theme-sm font-medium text-gray-900 dark:text-white">
                {{ profile.full_name || '-' }}
              </p>
            </td>
            <td class="px-5 py-3 sm:px-6">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                {{ profile.email }}
              </p>
            </td>
            <td class="px-5 py-3 sm:px-6">
              <span 
                class="inline-flex px-2.5 py-0.5 rounded-full text-theme-xs font-medium capitalize"
                :class="roleClasses(profile.role)"
              >
                {{ profile.role || 'user' }}
              </span>
            </td>
            <td class="px-5 py-3 sm:px-6">
              <div class="flex items-center space-x-3">
                <!-- Edit Button -->
                <button
                  @click="editProfile(profile)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                  :disabled="loading"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>

                <!-- Delete Button -->
                <button
                  @click="confirmDelete(profile)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                  :disabled="loading"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/40"
    >
      <div class="bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-lg w-full max-w-md shadow-xl">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Edit Profile
          </h3>

          <form @submit.prevent="updateProfile">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  v-model="editForm.full_name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  v-model="editForm.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  v-model="editForm.role"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="showEditModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                :disabled="loading"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                :disabled="loading"
              >
                {{ loading ? 'Updating...' : 'Update' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>


    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Confirm Delete
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete the profile of <strong>{{ deleteProfileData?.full_name || 'this user' }}</strong>? This action cannot be undone.
          </p>
          
          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              :disabled="loading"
            >
              Cancel
            </button>
            <button
              @click="deleteProfile"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              :disabled="loading"
            >
              {{ loading ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { supabase } from '../../../utils/supabase'

const open = ref(false)

interface Event {
  title: string
  desciption: string
  price: number
}

interface Profile {
  id: string
  full_name: string
  email: string
  role: string
}

const events = ref<Event[]>([])
const profiles = ref<Profile[]>([])
const loading = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const editForm = reactive({
  id: '',
  full_name: '',
  email: '',
  role: 'user'
})

const deleteProfileData = ref<Profile | null>(null)

// Fungsi untuk menentukan kelas role
const roleClasses = (role: string) => {
  const baseClasses = 'capitalize'
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'moderator':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

// Edit Profile
const editProfile = (profile: Profile) => {
  editForm.id = profile.id
  editForm.full_name = profile.full_name || ''
  editForm.email = profile.email
  editForm.role = profile.role || 'user'
  showEditModal.value = true
}

// Update Profile
const updateProfile = async () => {
  if (!editForm.id) return

  loading.value = true
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editForm.full_name,
        email: editForm.email,
        role: editForm.role,
        updated_at: new Date().toISOString()
      })
      .eq('id', editForm.id)

    if (error) throw error

    // Update local data
    const index = profiles.value.findIndex(p => p.id === editForm.id)
    if (index !== -1) {
      profiles.value[index] = { ...profiles.value[index], ...editForm }
    }

    showEditModal.value = false
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('Error updating profile. Please try again.')
  } finally {
    loading.value = false
  }
}

// Confirm Delete
const confirmDelete = (profile: Profile) => {
  deleteProfileData.value = profile
  showDeleteModal.value = true
}

// Delete Profile
const deleteProfile = async () => {
  if (!deleteProfileData.value) return

  loading.value = true
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', deleteProfileData.value.id)

    if (error) throw error

    // Remove from local data
    profiles.value = profiles.value.filter(p => p.id !== deleteProfileData.value?.id)

    showDeleteModal.value = false
    deleteProfileData.value = null
  } catch (error) {
    console.error('Error deleting profile:', error)
    alert('Error deleting profile. Please try again.')
  } finally {
    loading.value = false
  }
}

// Get Profiles
async function getProfiles() {
  const { data } = await supabase.from('profiles').select()
  profiles.value = data ?? []
}

function seeCurrentUser() {
  const user = supabase.auth.getUser().then(({ data: { user } }) => {
    console.log('Current user:', user)
  })
}

onMounted(() => {
  seeCurrentUser()
  getProfiles()
})
</script>

<style scoped>
/* Custom scrollbar styling jika diperlukan */
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Smooth transitions for modals */
.fixed {
  transition: opacity 0.3s ease;
}
</style>