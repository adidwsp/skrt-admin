<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
    <!-- Header -->
    <div class="top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div>
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Donation Management</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">Manage all event donations</p>
          </div>
        </div>

        <!-- Stats Summary -->
        <div class="mt-4 sm:mt-0 flex flex-wrap gap-4">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Total: Rp {{ formatCurrency(totalDonations) }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Participants: {{ participantDonationsCount }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Sponsors: {{ nonParticipantDonationsCount }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <!-- Filter Button -->
        <div class="relative">
          <button @click="showFilterDropdown = !showFilterDropdown"
            class="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors duration-200">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span class="text-sm text-gray-700 dark:text-gray-300">Filter</span>
          </button>

          <!-- Filter Dropdown -->
          <div v-if="showFilterDropdown"
            class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            <div class="p-4 space-y-4">
              <!-- Donation Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                <select v-model="filters.donation_type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="all">All Types</option>
                  <option value="participant">Participants</option>
                  <option value="non_participant">Sponsors</option>
                </select>
              </div>

              <!-- Bank Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bank</label>
                <select v-model="filters.bank"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="all">All Banks</option>
                  <option value="BCA">BCA</option>
                  <option value="BNI">BNI</option>
                  <option value="BRI">BRI</option>
                  <option value="Mandiri">Mandiri</option>
                </select>
              </div>

              <div class="flex space-x-2 pt-2">
                <button @click="applyFilters"
                  class="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                  Apply
                </button>
                <button @click="resetFilters"
                  class="flex-1 px-3 py-2 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Donation Button -->
        <button @click="showAddModal = true"
          class="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-sm">Add Donation</span>
        </button>

        <!-- Export Button -->
        <button @click="exportToExcel" :disabled="loading || allDonations.length === 0"
          class="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-sm">Export</span>
        </button>

        <!-- Search -->
        <div class="relative w-full sm:w-64">
          <input v-model="searchQuery" type="text" placeholder="Search donations..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full">
          <div class="absolute left-3 top-2.5">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Refresh -->
        <button @click="refreshData"
          class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          :disabled="loading">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Donor
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Contact
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Amount
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Bank
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Type
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="donation in filteredDonations" :key="donation.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ getDonorName(donation) }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    <span :class="getTypeBadgeClass(donation)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ getDonationType(donation) }}
                    </span>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">{{ getDonorEmail(donation) || '-' }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ getDonorPhone(donation) || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-semibold text-green-600 dark:text-green-400">
                Rp {{ formatCurrency(donation.donation_amount) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ donation.donation_bank }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getTypeBadgeClass(donation)"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                {{ getDonationType(donation) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ getDonationDate(donation) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="editDonation(donation)"
                class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                Edit
              </button>
              <button @click="deleteDonation(donation)"
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="filteredDonations.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No donations</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new donation.
        </p>
        <div class="mt-6">
          <button @click="showAddModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Donation
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add/Edit Modal -->
  <div v-if="showAddModal || showEditModal"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ showEditModal ? 'Edit Donation' : 'Add New Donation' }}
        </h3>

        <form @submit.prevent="showEditModal ? updateDonation() : createDonation()" class="space-y-4">
          <!-- Donation Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Donation Type
            </label>
            <select v-model="donationForm.donation_type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required>
              <option value="non_participant">Sponsor/Non-Participant</option>
              <option value="participant">Participant</option>
            </select>
          </div>

          <!-- Donor Information -->
          <div v-if="donationForm.donation_type === 'non_participant'">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Donor Name *
              </label>
              <input v-model="donationForm.donor_name" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input v-model="donationForm.donor_email" type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input v-model="donationForm.donor_phone" type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Donor Type
              </label>
              <select v-model="donationForm.donor_type"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="individual">Individual</option>
                <option value="company">Company</option>
                <option value="organization">Organization</option>
              </select>
            </div>

            <div v-if="donationForm.donor_type === 'company'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name
              </label>
              <input v-model="donationForm.company_name" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
          </div>

          <!-- Participant Selection -->
          <div v-if="donationForm.donation_type === 'participant'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Participant
            </label>
            <select v-model="donationForm.ticket_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required>
              <option value="">Select a participant</option>
              <option v-for="ticket in tickets" :key="ticket.id" :value="ticket.id">
                {{ ticket.name }} - {{ ticket.ticket_number }}
              </option>
            </select>
          </div>

          <!-- Donation Details -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount *
              </label>
              <input v-model="donationForm.donation_amount" type="number" min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bank *
              </label>
              <select v-model="donationForm.donation_bank"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required>
                <option value="">Select Bank</option>
                <option value="BCA">BCA</option>
                <option value="BNI">BNI</option>
                <option value="BRI">BRI</option>
                <option value="Mandiri">Mandiri</option>
              </select>
            </div>
          </div>

          <!-- Donation Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Donation Date
            </label>
            <input v-model="donationForm.donation_date" type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea v-model="donationForm.notes" rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300">
              Cancel
            </button>
            <button type="submit" :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50">
              {{ loading ? 'Saving...' : (showEditModal ? 'Update' : 'Save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
// Sesuaikan path supabase dengan struktur project Anda
import { supabase } from '../../../utils/supabase'
import * as XLSX from 'xlsx'

// Interfaces yang diperbaiki
interface ParticipantDonation {
  id: string
  name: string
  email: string
  phone: string
  ticket_number: string
  donation_amount: number
  donation_bank: string
  created_at: string
  // Untuk participant, kita hanya punya created_at, tidak ada donation_date
}

interface NonParticipantDonation {
  id: string
  donor_name: string
  donor_email?: string
  donor_phone?: string
  donor_type: string
  company_name?: string
  donation_amount: number
  donation_bank: string
  donation_date: string // Hanya non-participant yang punya donation_date
  notes?: string
  created_at: string
}

// Union type dengan discriminant property
type Donation =
  | (ParticipantDonation & { donation_type: 'participant' })
  | (NonParticipantDonation & { donation_type: 'non_participant' })

interface Ticket {
  id: string
  name: string
  email: string
  phone: string
  ticket_number: string
}

// Reactive data
const loading = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const showFilterDropdown = ref(false)
const searchQuery = ref('')

const participantDonations = ref<ParticipantDonation[]>([])
const nonParticipantDonations = ref<NonParticipantDonation[]>([])
const tickets = ref<Ticket[]>([])

const filters = reactive({
  donation_type: 'all',
  bank: 'all'
})

const donationForm = reactive({
  id: '',
  donation_type: 'non_participant' as 'participant' | 'non_participant',
  ticket_id: '',
  donor_name: '',
  donor_email: '',
  donor_phone: '',
  donor_type: 'individual',
  company_name: '',
  donation_amount: 0,
  donation_bank: '',
  donation_date: '',
  notes: ''
})

// Computed properties
const allDonations = computed((): Donation[] => {
  const participantDons = participantDonations.value.map(d => ({
    ...d,
    donation_type: 'participant' as const
  }))

  const nonParticipantDons = nonParticipantDonations.value.map(d => ({
    ...d,
    donation_type: 'non_participant' as const
  }))

  return [...participantDons, ...nonParticipantDons]
})

const filteredDonations = computed((): Donation[] => {
  let filtered = allDonations.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(donation =>
      getDonorName(donation).toLowerCase().includes(query) ||
      getDonorEmail(donation)?.toLowerCase().includes(query) ||
      getDonorPhone(donation)?.toLowerCase().includes(query) ||
      donation.donation_bank.toLowerCase().includes(query)
    )
  }

  // Type filter
  if (filters.donation_type !== 'all') {
    filtered = filtered.filter(donation => donation.donation_type === filters.donation_type)
  }

  // Bank filter
  if (filters.bank !== 'all') {
    filtered = filtered.filter(donation => donation.donation_bank === filters.bank)
  }

  return filtered
})

const totalDonations = computed(() => {
  return allDonations.value.reduce((sum, donation) => sum + donation.donation_amount, 0)
})

const participantDonationsCount = computed(() => {
  return allDonations.value.filter(d => d.donation_type === 'participant').length
})

const nonParticipantDonationsCount = computed(() => {
  return allDonations.value.filter(d => d.donation_type === 'non_participant').length
})

// Helper methods dengan type guards yang aman
const getDonorName = (donation: Donation): string => {
  if (donation.donation_type === 'participant') {
    return donation.name
  } else {
    return donation.donor_name
  }
}

const getDonorEmail = (donation: Donation): string => {
  if (donation.donation_type === 'participant') {
    return donation.email
  } else {
    return donation.donor_email || ''
  }
}

const getDonorPhone = (donation: Donation): string => {
  if (donation.donation_type === 'participant') {
    return donation.phone
  } else {
    return donation.donor_phone || ''
  }
}

const getDonationType = (donation: Donation): string => {
  return donation.donation_type === 'participant' ? 'Participant' : 'Sponsor'
}

// Method baru untuk mendapatkan tanggal donasi dengan aman
const getDonationDate = (donation: Donation): string => {
  if (donation.donation_type === 'participant') {
    // Participant hanya punya created_at
    return formatDate(donation.created_at)
  } else {
    // Non-participant punya donation_date, fallback ke created_at
    return formatDate(donation.donation_date || donation.created_at)
  }
}

const getTypeBadgeClass = (donation: Donation): string => {
  return donation.donation_type === 'participant'
    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID').format(amount)
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('id-ID')
  } catch {
    return '-'
  }
}

// Data methods
async function fetchParticipantDonations() {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('id, name, email, phone, ticket_number, donation_amount, donation_bank, created_at')
      .gt('donation_amount', 0)
      .order('created_at', { ascending: false })

    if (error) throw error
    participantDonations.value = data || []
  } catch (error) {
    console.error('Error fetching participant donations:', error)
  }
}

async function fetchNonParticipantDonations() {
  try {
    const { data, error } = await supabase
      .from('non_participant_donations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    nonParticipantDonations.value = data || []
  } catch (error) {
    console.error('Error fetching non-participant donations:', error)
  }
}

async function fetchTickets() {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('id, name, email, phone, ticket_number')
      .order('created_at', { ascending: false })

    if (error) throw error
    tickets.value = data || []
  } catch (error) {
    console.error('Error fetching tickets:', error)
  }
}

// Form methods
const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  resetForm()
}

const resetForm = () => {
  donationForm.id = ''
  donationForm.donation_type = 'non_participant'
  donationForm.ticket_id = ''
  donationForm.donor_name = ''
  donationForm.donor_email = ''
  donationForm.donor_phone = ''
  donationForm.donor_type = 'individual'
  donationForm.company_name = ''
  donationForm.donation_amount = 0
  donationForm.donation_bank = ''
  donationForm.donation_date = new Date().toISOString().slice(0, 16)
  donationForm.notes = ''
}

const editDonation = (donation: Donation) => {
  if (donation.donation_type === 'participant') {
    donationForm.id = donation.id
    donationForm.donation_type = 'participant'
    donationForm.ticket_id = donation.id
    donationForm.donation_amount = donation.donation_amount
    donationForm.donation_bank = donation.donation_bank
    // Untuk participant, kita tidak set donation_date karena tidak ada
  } else {
    donationForm.id = donation.id
    donationForm.donation_type = 'non_participant'
    donationForm.donor_name = donation.donor_name
    donationForm.donor_email = donation.donor_email || ''
    donationForm.donor_phone = donation.donor_phone || ''
    donationForm.donor_type = donation.donor_type
    donationForm.company_name = donation.company_name || ''
    donationForm.donation_amount = donation.donation_amount
    donationForm.donation_bank = donation.donation_bank
    donationForm.donation_date = donation.donation_date ? donation.donation_date.slice(0, 16) : ''
    donationForm.notes = donation.notes || ''
  }

  showEditModal.value = true
}

const createDonation = async () => {
  loading.value = true
  try {
    if (donationForm.donation_type === 'participant') {
      // Update participant's donation in tickets table
      const { error } = await supabase
        .from('tickets')
        .update({
          donation_amount: donationForm.donation_amount,
          donation_bank: donationForm.donation_bank,
          updated_at: new Date().toISOString()
        })
        .eq('id', donationForm.ticket_id)

      if (error) throw error
    } else {
      // Create non-participant donation
      const { error } = await supabase
        .from('non_participant_donations')
        .insert({
          donor_name: donationForm.donor_name,
          donor_email: donationForm.donor_email,
          donor_phone: donationForm.donor_phone,
          donor_type: donationForm.donor_type,
          company_name: donationForm.company_name,
          donation_amount: donationForm.donation_amount,
          donation_bank: donationForm.donation_bank,
          donation_date: donationForm.donation_date || new Date().toISOString(),
          notes: donationForm.notes
        })

      if (error) throw error
    }

    await refreshData()
    closeModal()
  } catch (error) {
    console.error('Error creating donation:', error)
    alert('Error creating donation')
  } finally {
    loading.value = false
  }
}

const updateDonation = async () => {
  if (!donationForm.id) return

  loading.value = true
  try {
    if (donationForm.donation_type === 'participant') {
      const { error } = await supabase
        .from('tickets')
        .update({
          donation_amount: donationForm.donation_amount,
          donation_bank: donationForm.donation_bank,
          updated_at: new Date().toISOString()
        })
        .eq('id', donationForm.id)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('non_participant_donations')
        .update({
          donor_name: donationForm.donor_name,
          donor_email: donationForm.donor_email,
          donor_phone: donationForm.donor_phone,
          donor_type: donationForm.donor_type,
          company_name: donationForm.company_name,
          donation_amount: donationForm.donation_amount,
          donation_bank: donationForm.donation_bank,
          donation_date: donationForm.donation_date,
          notes: donationForm.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', donationForm.id)

      if (error) throw error
    }

    await refreshData()
    closeModal()
  } catch (error) {
    console.error('Error updating donation:', error)
    alert('Error updating donation')
  } finally {
    loading.value = false
  }
}

const deleteDonation = async (donation: Donation) => {
  if (!confirm('Are you sure you want to delete this donation?')) return

  loading.value = true
  try {
    if (donation.donation_type === 'participant') {
      // Set donation amount to 0 for participants
      const { error } = await supabase
        .from('tickets')
        .update({
          donation_amount: 0,
          donation_bank: '',
          updated_at: new Date().toISOString()
        })
        .eq('id', donation.id)

      if (error) throw error
    } else {
      // Delete non-participant donation
      const { error } = await supabase
        .from('non_participant_donations')
        .delete()
        .eq('id', donation.id)

      if (error) throw error
    }

    await refreshData()
  } catch (error) {
    console.error('Error deleting donation:', error)
    alert('Error deleting donation')
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  loading.value = true
  try {
    await Promise.all([
      fetchParticipantDonations(),
      fetchNonParticipantDonations(),
      fetchTickets()
    ])
  } catch (error) {
    console.error('Error refreshing data:', error)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  showFilterDropdown.value = false
}

const resetFilters = () => {
  filters.donation_type = 'all'
  filters.bank = 'all'
}

const exportToExcel = () => {
  const excelData = allDonations.value.map((donation, index) => ({
    'No': index + 1,
    'Donor Name': getDonorName(donation),
    'Email': getDonorEmail(donation),
    'Phone': getDonorPhone(donation),
    'Amount': donation.donation_amount,
    'Bank': donation.donation_bank,
    'Type': getDonationType(donation),
    'Date': getDonationDate(donation) // Gunakan helper function yang sama
  }))

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(excelData)
  XLSX.utils.book_append_sheet(wb, ws, 'Donations')

  const fileName = `donations_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, fileName)
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script>