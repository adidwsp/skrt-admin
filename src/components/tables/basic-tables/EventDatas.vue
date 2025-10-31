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
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Event Name</p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Description</p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Price</p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Date</p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Capacity</p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Action</p>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Looping data event disini -->
          <tr 
            v-for="(event, index) in events" 
            :key="event.id"
            class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <td class="px-5 py-3 text-theme-sm dark:text-white">
              {{ index + 1 }}
            </td>
            <td class="px-5 py-3 sm:px-6">
              <p class="text-theme-sm font-medium text-gray-900 dark:text-white">
                {{ event.title || '-' }}
              </p>
            </td>
            <td class="px-5 py-3 sm:px-6">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                {{ event.description || '-' }}
              </p>
            </td>
            <td class="px-5 py-3 sm:px-6">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                {{ event.price || '-' }}
              </p>
            </td>
            <td class="px-5 py-3 sm:px-6">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                {{ event.date ? new Date(event.date).toLocaleDateString() : '-' }}
              </p>
            </td>
            <td class="px-5 py-3 sm:px-6">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                {{ event.capacity || '-' }}
              </p>
            </td>
          
            <td class="px-5 py-3 sm:px-6">
              <div class="flex items-center space-x-3">
                <!-- Edit Button -->
                <button
                  @click="editEvents(event)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                  :disabled="loading"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>

                <!-- Delete Button -->
                <button
                  @click="confirmDelete(event)"
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
            Edit Event
          </h3>

          <form @submit.prevent="updateEvents">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  v-model="editForm.title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <input
                  v-model="editForm.description"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price
                </label>
                <input
                  v-model="editForm.price"
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
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
            Are you sure you want to delete the event of <strong>{{ deleteEventData?.title || 'this user' }}</strong>? This action cannot be undone.
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
              @click="deleteEvent"
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


function seeCurrentUser() {
  const user = supabase.auth.getUser().then(({ data: { user } }) => {
    console.log('Current user:', user)
  })
}

const open = ref(false)

interface Events {
  title: string
  description: string
  price: number
  date: Date
  capacity: number
  id: string
  updated_at: Date
}

const events = ref<Events[]>([])
const loading = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const editForm = reactive({
  id: '',
  title: '',
  description: '',
  price: 0,
  date: new Date(),
  capacity: 0
})

const deleteEventData = ref<Events | null>(null)

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

// Edit Events
const editEvents = (event: Events) => {
  editForm.id = event.id || ''
  editForm.title = event.title || ''
  editForm.description = event.description || ''
  editForm.price = event.price || 0
  editForm.date = event.date || new Date()
  editForm.capacity = event.capacity || 0
  showEditModal.value = true
}

// Update Events
const updateEvents = async () => {
  if (!editForm.id) return

  loading.value = true
  try {
    const { error } = await supabase
      .from('events')
      .update({
        title: editForm.title,
        description: editForm.description,
        price: editForm.price,
        date: editForm.date,
        capacity: editForm.capacity,
        updated_at: new Date().toISOString()
      })
      .eq('id', editForm.id)

    if (error) throw error

    // Update local data
    const index = events.value.findIndex(p => p.id === editForm.id)
    if (index !== -1) {
      events.value[index] = { ...events.value[index], ...editForm }
    }

    showEditModal.value = false
  } catch (error) {
    console.error('Error updating event:', error)
    alert('Error updating event. Please try again.')
  } finally {
    loading.value = false
  }
}

// Confirm Delete
const confirmDelete = (event: Events) => {
  deleteEventData.value = event
  showDeleteModal.value = true
}

// Delete Events
const deleteEvent = async () => {
  if (!deleteEventData.value) return

  loading.value = true
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', deleteEventData.value.id)

    if (error) throw error

    // Remove from local data
    events.value = events.value.filter(p => p.id !== deleteEventData.value?.id)

    showDeleteModal.value = false
    deleteEventData.value = null
  } catch (error) {
    console.error('Error deleting event:', error)
    alert('Error deleting event. Please try again.')
  } finally {
    loading.value = false
  }
}

// Get Events
async function getEvents() {
  const { data } = await supabase.from('events').select()
  events.value = data ?? []
}

onMounted(() => {
  getEvents()
  seeCurrentUser()
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