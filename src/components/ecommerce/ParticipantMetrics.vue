<template>
  <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      <!-- Total Tickets -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xs border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tickets</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.totalTickets }}</p>
          </div>
        </div>
      </div>

      <!-- Scanned Tickets -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xs border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Scanned</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ stats.scannedTickets }}
            </p>
          </div>
        </div>
      </div>

      <!-- Pending Scan -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xs border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Scan</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ stats.pendingTickets }}
            </p>
          </div>
        </div>
      </div>

      <!-- Total Donation -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xs border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Donation</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              Rp {{ formatCurrency(stats.totalDonation) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase' 

interface Stats {
  totalTickets: number
  scannedTickets: number
  pendingTickets: number
  totalDonation: number
}

const stats = ref<Stats>({
  totalTickets: 0,
  scannedTickets: 0,
  pendingTickets: 0,
  totalDonation: 0
})

const loading = ref(false)

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID').format(amount)
}

// Fetch stats data
const fetchStats = async () => {
  try {
    loading.value = true
    
    // Get all tickets
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Calculate stats
    const totalTickets = tickets?.length || 0
    const scannedTickets = tickets?.filter(ticket => ticket.is_scanned).length || 0
    const pendingTickets = totalTickets - scannedTickets
    const totalDonation = tickets?.reduce((sum, ticket) => sum + (ticket.donation_amount || 0), 0) || 0

    stats.value = {
      totalTickets,
      scannedTickets,
      pendingTickets,
      totalDonation
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
  } finally {
    loading.value = false
  }
}

// Refresh stats (bisa dipanggil dari parent)
const refreshStats = () => {
  fetchStats()
}

// Expose refresh function untuk parent
defineExpose({
  refreshStats
})

// Fetch data on component mount
onMounted(() => {
  fetchStats()
})
</script>