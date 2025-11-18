<template>
  <div
    class="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <div
      class="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6"
    >
      <div class="flex justify-between items-start mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Targets</h3>
          <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Progress toward monthly goals
          </p>
        </div>
        
        <!-- Filter Section -->
        <div class="flex gap-3">
          <!-- Month Filter -->
          <div class="relative">
            <select
              v-model="selectedMonth"
              @change="fetchTargetData"
              class="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none cursor-pointer text-sm"
            >
              <option v-for="month in months" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select>
            <div class="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>

          <!-- Year Filter -->
          <div class="relative">
            <select
              v-model="selectedYear"
              @change="fetchTargetData"
              class="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none cursor-pointer text-sm"
            >
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
            <div class="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Dual Radial Charts -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Target Peserta -->
        <div class="text-center">
          <div class="relative max-h-[195px] mb-4">
            <div class="radial-bar-chart">
              <VueApexCharts 
                type="radialBar" 
                height="200" 
                :options="participantChartOptions" 
                :series="participantSeries" 
              />
            </div>
          </div>
          <h4 class="font-semibold text-gray-800 dark:text-white/90 mb-2">Participant Target</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {{ participantProgress.current }}/100 participants
          </p>
          <div class="flex justify-center gap-4 text-xs">
            <div class="text-center">
              <div class="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
              <span class="text-gray-600 dark:text-gray-400">
                Male: {{ participantProgress.male }}/50
              </span>
            </div>
            <div class="text-center">
              <div class="w-3 h-3 bg-pink-500 rounded-full mx-auto mb-1"></div>
              <span class="text-gray-600 dark:text-gray-400">
                Female: {{ participantProgress.female }}/50
              </span>
            </div>
          </div>
        </div>

        <!-- Target Donasi -->
        <div class="text-center">
          <div class="relative max-h-[195px] mb-4">
            <div class="radial-bar-chart">
              <VueApexCharts 
                type="radialBar" 
                height="200" 
                :options="donationChartOptions" 
                :series="donationSeries" 
              />
            </div>
          </div>
          <h4 class="font-semibold text-gray-800 dark:text-white/90 mb-2">Donation Target</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Rp {{ formatCurrency(donationProgress.current) }}/6,000,000
          </p>
          <div class="mt-3">
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="donationProgress.percentage >= 100 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : donationProgress.percentage >= 50
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              "
            >
              {{ donationProgress.percentage }}% achieved
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
      <div class="text-center">
        <p class="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
          Total Participants
        </p>
        <p class="text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
          {{ participantProgress.current }}
        </p>
      </div>

      <div class="w-px bg-gray-200 h-7 dark:bg-gray-700"></div>

      <div class="text-center">
        <p class="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
          Male/Female
        </p>
        <p class="text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
          {{ participantProgress.male }}/{{ participantProgress.female }}
        </p>
      </div>

      <div class="w-px bg-gray-200 h-7 dark:bg-gray-700"></div>

      <div class="text-center">
        <p class="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
          Total Donation
        </p>
        <p class="text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
          Rp {{ formatCurrency(donationProgress.current) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import VueApexCharts from 'vue3-apexcharts'

const loading = ref(false)

// Filter options
const currentDate = new Date()
const selectedMonth = ref(currentDate.getMonth() + 1)
const selectedYear = ref(currentDate.getFullYear())

const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
]

const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i)

// Data state
const participantData = ref({
  total: 0,
  male: 0,
  female: 0
})

const donationData = ref(0)

// Computed progress
const participantProgress = computed(() => {
  const total = participantData.value.total
  const male = participantData.value.male
  const female = participantData.value.female
  const percentage = Math.min(Math.round((total / 100) * 100), 100)
  
  return {
    current: total,
    male,
    female,
    percentage
  }
})

const donationProgress = computed(() => {
  const current = donationData.value
  const percentage = Math.min(Math.round((current / 6000000) * 100), 100)
  
  return {
    current,
    percentage
  }
})

// Chart series
const participantSeries = computed(() => [participantProgress.value.percentage])
const donationSeries = computed(() => [donationProgress.value.percentage])

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID').format(amount)
}

// Fetch target data
const fetchTargetData = async () => {
  try {
    loading.value = true
    
    const startDate = new Date(selectedYear.value, selectedMonth.value - 1, 1)
    const endDate = new Date(selectedYear.value, selectedMonth.value, 0)

    // Fetch participant data
    const { data: participantDataResponse, error: participantError } = await supabase
      .from('tickets')
      .select('gender')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    if (participantError) throw participantError

    // Calculate participant stats
    const totalParticipants = participantDataResponse?.length || 0
    const maleCount = participantDataResponse?.filter(t => t.gender?.toLowerCase() === 'laki-laki').length || 0
    const femaleCount = participantDataResponse?.filter(t => t.gender?.toLowerCase() === 'perempuan').length || 0

    participantData.value = {
      total: totalParticipants,
      male: maleCount,
      female: femaleCount
    }

    // Fetch donation data
    const { data: donationDataResponse, error: donationError } = await supabase
      .from('tickets')
      .select('donation_amount')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .not('donation_amount', 'is', null)

    if (donationError) throw donationError

    const totalDonation = donationDataResponse?.reduce((sum, ticket) => sum + (ticket.donation_amount || 0), 0) || 0
    donationData.value = totalDonation

  } catch (error) {
    console.error('Error fetching target data:', error)
  } finally {
    loading.value = false
  }
}

// Chart options
const participantChartOptions = {
  colors: ['#465FFF'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    sparkline: {
      enabled: true,
    },
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      hollow: {
        size: '70%',
      },
      track: {
        background: '#E4E7EC',
        strokeWidth: '100%',
        margin: 5,
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          fontSize: '24px',
          fontWeight: '600',
          offsetY: 40,
          color: '#1D2939',
          formatter: function (val) {
            return val.toFixed(0) + '%'
          },
        },
      },
    },
  },
  fill: {
    type: 'solid',
    colors: ['#465FFF'],
  },
  stroke: {
    lineCap: 'round',
  },
  labels: ['Participants'],
}

const donationChartOptions = {
  colors: ['#10B981'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    sparkline: {
      enabled: true,
    },
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      hollow: {
        size: '70%',
      },
      track: {
        background: '#E4E7EC',
        strokeWidth: '100%',
        margin: 5,
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          fontSize: '24px',
          fontWeight: '600',
          offsetY: 40,
          color: '#1D2939',
          formatter: function (val) {
            return val.toFixed(0) + '%'
          },
        },
      },
    },
  },
  fill: {
    type: 'solid',
    colors: ['#10B981'],
  },
  stroke: {
    lineCap: 'round',
  },
  labels: ['Donation'],
}

onMounted(() => {
  fetchTargetData()
})

// Expose refresh function
defineExpose({
  refreshData: fetchTargetData
})
</script>

<style scoped>
.radial-bar-chart {
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
}
</style>