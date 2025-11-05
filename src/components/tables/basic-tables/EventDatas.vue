<template>
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <!-- Toolbar: Search / Filters / Controls -->
    <div class="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div class="flex items-end gap-3 w-full md:w-2/3">
        <!-- <input
          v-model="searchQuery"
          type="search"
          placeholder="Search by title or description..."
          class="w-full md:w-1/2 px-3 py-2 border rounded-md focus:outline-none"
        />

        <div class="flex items-center gap-2">
          <label class="text-sm">From</label>
          <input v-model="filters.dateFrom" type="date" class="px-2 py-1 border rounded-md" />
          <label class="text-sm">To</label>
          <input v-model="filters.dateTo" type="date" class="px-2 py-1 border rounded-md" />
        </div> -->

        <button
          @click="showAddModal = true"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700"
        >
          Add Event
        </button>
      </div>

      <!-- <div class="flex items-center gap-3 w-full md:w-1/3 justify-between">
        <div class="flex items-center gap-2">
          <input v-model.number="filters.priceMin" type="number" min="0" placeholder="Min price" class="w-28 px-2 py-1 border rounded-md" />
          <input v-model.number="filters.priceMax" type="number" min="0" placeholder="Max price" class="w-28 px-2 py-1 border rounded-md" />
          <input v-model.number="filters.capacityMin" type="number" min="0" placeholder="Min cap" class="w-20 px-2 py-1 border rounded-md" />
        </div>

        <div class="flex items-center gap-2">
          <select v-model="sortBy" class="px-2 py-1 border rounded-md">
            <option value="date_desc">Date ↓</option>
            <option value="date_asc">Date ↑</option>
            <option value="price_desc">Price ↓</option>
            <option value="price_asc">Price ↑</option>
            <option value="title_asc">Title A→Z</option>
            <option value="title_desc">Title Z→A</option>
          </select>

          <select v-model.number="perPage" class="px-2 py-1 border rounded-md">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>

          <button @click="resetFilters" class="px-3 py-1 border rounded-md text-sm">Reset</button>
        </div>
      </div> -->
    </div>

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
          <!-- Use pagedEvents (already filtered + paginated) -->
          <tr 
            v-for="(event, index) in pagedEvents" 
            :key="event.id"
            class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <td class="px-5 py-3 text-theme-sm dark:text-white">
              {{ (currentPage - 1) * perPage + index + 1 }}
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
                {{ event.price ?? '-' }}
              </p>
            </td>
            <td class="px-5 py-3 sm:px-6">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                {{ event.date ? new Date(event.date).toLocaleDateString() : '-' }}
              </p>
            </td>
            <td class="px-5 py-3 sm:px-6">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                {{ event.capacity ?? '-' }}
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

          <tr v-if="pagedEvents.length === 0">
            <td colspan="7" class="px-5 py-6 text-center text-gray-500">No events found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paging Controls -->
    <div class="p-4 flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-600">Showing <strong>{{ startItem }}</strong> - <strong>{{ endItem }}</strong> of <strong>{{ filteredEvents.length }}</strong></p>
      </div>

      <div class="flex items-center gap-2">
        <button @click="prevPage" :disabled="currentPage === 1" class="px-2 py-1 border rounded-md">Prev</button>
        <input v-model.number="currentPage" type="number" min="1" :max="totalPages" class="w-16 px-2 py-1 border rounded-md text-center" />
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-2 py-1 border rounded-md">Next</button>
        <p class="text-sm text-gray-600">Page {{ currentPage }} / {{ totalPages }}</p>
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/40">
      <div class="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-lg w-full max-w-md shadow-xl max-h-[80vh] overflow-auto">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Event</h3>

          <form @submit.prevent="addEvent">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input v-model="addForm.title" type="text" required class="w-full px-3 py-2 border rounded-md" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input v-model="addForm.description" type="text" class="w-full px-3 py-2 border rounded-md" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                  <input v-model.number="addForm.price" type="number" min="0" class="w-full px-3 py-2 border rounded-md" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity</label>
                  <input v-model.number="addForm.capacity" type="number" min="0" class="w-full px-3 py-2 border rounded-md" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input v-model="addForm.date" type="date" class="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="closeAddModal" class="px-4 py-2 text-sm border rounded-md" :disabled="loading">Cancel</button>
              <button type="submit" class="px-4 py-2 text-sm text-white bg-green-600 rounded-md" :disabled="loading">{{ loading ? 'Adding...' : 'Add Event' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Edit Modal (same modal fixes) -->
    <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/40">
      <div class="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-lg w-full max-w-md shadow-xl max-h-[80vh] overflow-auto">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Event</h3>

          <form @submit.prevent="updateEvents">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input v-model="editForm.title" type="text" required class="w-full px-3 py-2 border rounded-md" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input v-model="editForm.description" type="text" required class="w-full px-3 py-2 border rounded-md" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                  <input v-model.number="editForm.price" type="number" min="0" class="w-full px-3 py-2 border rounded-md" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity</label>
                  <input v-model.number="editForm.capacity" type="number" min="0" class="w-full px-3 py-2 border rounded-md" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input v-model="editForm.date" type="date" class="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="closeEditModal" class="px-4 py-2 text-sm border rounded-md" :disabled="loading">Cancel</button>
              <button type="submit" class="px-4 py-2 text-sm text-white bg-blue-600 rounded-md" :disabled="loading">{{ loading ? 'Updating...' : 'Update' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Confirm Delete</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Are you sure you want to delete the event of <strong>{{ deleteEventData?.title || 'this event' }}</strong>? This action cannot be undone.</p>
          
          <div class="flex justify-end space-x-3">
            <button @click="closeDeleteModal" class="px-4 py-2 text-sm border rounded-md" :disabled="loading">Cancel</button>
            <button @click="deleteEvent" class="px-4 py-2 text-sm text-white bg-red-600 rounded-md" :disabled="loading">{{ loading ? 'Deleting...' : 'Delete' }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed, watch } from 'vue'
import { supabase } from '../../../utils/supabase'

function seeCurrentUser() {
  supabase.auth.getUser().then(({ data: { user } }) => {
    console.log('Current user:', user)
  }).catch(e => console.warn(e))
}

interface Events {
  title: string
  description?: string
  price?: number
  date?: string | Date | null
  capacity?: number
  id: string
  updated_at?: Date
  created_at?: string
}

const events = ref<Events[]>([])
const loading = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showAddModal = ref(false)

const editForm = reactive({
  id: '',
  title: '',
  description: '',
  price: 0,
  date: new Date().toISOString().slice(0,10),
  capacity: 0
})

const addForm = reactive({
  title: '',
  description: '',
  price: 0,
  date: new Date().toISOString().slice(0,10),
  capacity: 0
})

const deleteEventData = ref<Events | null>(null)

// Search / Filters / Paging / Sorting
const searchQuery = ref('')
const filters = reactive({
  dateFrom: '',
  dateTo: '',
  priceMin: null as number | null,
  priceMax: null as number | null,
  capacityMin: null as number | null
})

const sortBy = ref('date_desc')
const perPage = ref<number>(10)
const currentPage = ref<number>(1)

// computed: filteredEvents -> sorted -> paged
const filteredEvents = computed(() => {
  const q = (searchQuery.value || '').toLowerCase().trim()

  let list = events.value.slice()

  // search
  if (q) {
    list = list.filter(e => {
      const title = (e.title || '').toString().toLowerCase()
      const desc = (e.description || '').toString().toLowerCase()
      return title.includes(q) || desc.includes(q)
    })
  }

  // // date filter (convert to Date for comparison)
  // if (filters.dateFrom) {
  //   const from = new Date(filters.dateFrom)
  //   list = list.filter(e => {
  //     if (!e.date) return false
  //     const d = new Date(e.date)
  //     return d >= from
  //   })
  // }
  // if (filters.dateTo) {
  //   const to = new Date(filters.dateTo)
  //   // include full day: set to end of day
  //   to.setHours(23,59,59,999)
  //   list = list.filter(e => {
  //     if (!e.date) return false
  //     const d = new Date(e.date)
  //     return d <= to
  //   })
  // }

  // // price filter
  // if (typeof filters.priceMin === 'number' && !isNaN(filters.priceMin)) {
  //   list = list.filter(e => (e.price ?? 0) >= (filters.priceMin ?? 0))
  // }
  // if (typeof filters.priceMax === 'number' && !isNaN(filters.priceMax)) {
  //   list = list.filter(e => (e.price ?? 0) <= (filters.priceMax ?? Infinity))
  // }

  // // capacity
  // if (typeof filters.capacityMin === 'number' && !isNaN(filters.capacityMin)) {
  //   list = list.filter(e => (e.capacity ?? 0) >= (filters.capacityMin ?? 0))
  // }

  // // sorting
  // list.sort((a, b) => {
  //   switch (sortBy.value) {
  //     case 'date_asc':
  //       return (new Date(a.date || 0).getTime()) - (new Date(b.date || 0).getTime())
  //     case 'date_desc':
  //       return (new Date(b.date || 0).getTime()) - (new Date(a.date || 0).getTime())
  //     case 'price_asc':
  //       return (Number(a.price ?? 0) - Number(b.price ?? 0))
  //     case 'price_desc':
  //       return (Number(b.price ?? 0) - Number(a.price ?? 0))
  //     case 'title_asc':
  //       return (a.title || '').localeCompare(b.title || '')
  //     case 'title_desc':
  //       return (b.title || '').localeCompare(a.title || '')
  //     default:
  //       return 0
  //   }
  // })

  return list
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredEvents.value.length / perPage.value))
})

const pagedEvents = computed(() => {
  // ensure currentPage within range
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  if (currentPage.value < 1) currentPage.value = 1
  const start = (currentPage.value - 1) * perPage.value
  return filteredEvents.value.slice(start, start + perPage.value)
})

const startItem = computed(() => {
  if (filteredEvents.value.length === 0) return 0
  return (currentPage.value - 1) * perPage.value + 1
})
const endItem = computed(() => {
  return Math.min(filteredEvents.value.length, currentPage.value * perPage.value)
})

// watch perPage or filters to reset to page 1
watch([perPage, searchQuery, () => filters.dateFrom, () => filters.dateTo, () => filters.priceMin, () => filters.priceMax, () => filters.capacityMin, sortBy], () => {
  currentPage.value = 1
})

// prevent background scroll when any modal open
const anyModalOpen = computed(() => showAddModal.value || showEditModal.value || showDeleteModal.value)

// watch for body overflow toggling
watch(anyModalOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Edit Events
const editEvents = (event: Events) => {
  editForm.id = event.id || ''
  editForm.title = event.title || ''
  editForm.description = event.description || ''
  editForm.price = event.price ?? 0
  editForm.date = event.date ? new Date(event.date).toISOString().slice(0,10) : new Date().toISOString().slice(0,10)
  editForm.capacity = event.capacity ?? 0
  showEditModal.value = true
}

// Close helpers for modals (to keep body overflow consistent)
const closeAddModal = () => {
  resetAddForm()
  showAddModal.value = false
}
const closeEditModal = () => {
  showEditModal.value = false
}
const closeDeleteModal = () => {
  showDeleteModal.value = false
}
const closeAllModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
}

// Update Events
const updateEvents = async () => {
  if (!editForm.id) return

  loading.value = true
  try {
    const payload: any = {
      title: editForm.title,
      description: editForm.description,
      price: Number(editForm.price || 0),
      date: editForm.date ? new Date(editForm.date).toISOString() : null,
      capacity: Number(editForm.capacity || 0),
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('events')
      .update(payload)
      .eq('id', editForm.id)

    if (error) throw error

    // Update local data
    const index = events.value.findIndex(p => p.id === editForm.id)
    if (index !== -1) {
      events.value[index] = { ...events.value[index], ...payload }
    }

    closeEditModal()
  } catch (error) {
    console.error('Error updating event:', error)
    alert('Error updating event. Please try again.')
  } finally {
    loading.value = false
  }
}

// Add Event
const addEvent = async () => {
  if (!addForm.title) {
    alert('Title is required')
    return
  }

  loading.value = true
  try {
    const payload = {
      title: addForm.title,
      description: addForm.description,
      price: Number(addForm.price || 0),
      date: addForm.date ? new Date(addForm.date).toISOString() : null,
      capacity: Number(addForm.capacity || 0),
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('events')
      .insert([payload])
      .select()
      .single()

    if (error) throw error

    // push new event to local state (add at front)
    events.value.unshift(data as Events)

    // reset form + close modal
    resetAddForm()
    showAddModal.value = false
  } catch (error) {
    console.error('Error adding event:', error)
    alert('Error adding event. Please try again.')
  } finally {
    loading.value = false
  }
}

const resetAddForm = () => {
  addForm.title = ''
  addForm.description = ''
  addForm.price = 0
  addForm.date = new Date().toISOString().slice(0,10)
  addForm.capacity = 0
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
  try {
    const { data } = await supabase.from('events').select()
    events.value = (data ?? []) as Events[]
  } catch (e) {
    console.error(e)
    events.value = []
  }
}

// paging helpers
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
watch(currentPage, (v) => {
  if (v < 1) currentPage.value = 1
  if (v > totalPages.value) currentPage.value = totalPages.value
})

// reset filters
const resetFilters = () => {
  searchQuery.value = ''
  filters.dateFrom = ''
  filters.dateTo = ''
  filters.priceMin = null
  filters.priceMax = null
  filters.capacityMin = null
  sortBy.value = 'date_desc'
  perPage.value = 10
  currentPage.value = 1
}

onMounted(() => {
  getEvents()
  seeCurrentUser()

  // close modals on ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals()
  })
})
</script>

<style scoped>
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

.fixed {
  transition: opacity 0.2s ease;
}

.max-h-\[80vh\] {
  max-height: 80vh;
}
</style>
