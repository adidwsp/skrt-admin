<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
  >
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Participant Analytics</h3>

      <!-- Filter Bulan -->
      <div class="flex gap-3">
        <div class="relative">
          <select
            v-model="selectedMonth"
            @change="fetchPieChartData"
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

        <div class="relative">
          <select
            v-model="selectedYear"
            @change="fetchPieChartData"
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

    <!-- Three Pie Charts -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Gender Distribution -->
      <div class="text-center">
        <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-4">Gender Distribution</h4>
        <div class="pie-chart-container">
          <VueApexCharts 
            type="pie" 
            height="150" 
            :options="genderChartOptions" 
            :series="genderSeries" 
          />
        </div>
        <div class="mt-3 space-y-2">
          <div v-for="item in genderData" :key="item.name" class="flex items-center justify-between text-sm">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: getGenderColor(item.name) }"></div>
              <span class="text-gray-600 dark:text-gray-400">{{ item.name }}</span>
            </div>
            <span class="font-medium text-gray-800 dark:text-white/90">{{ item.value }} ({{ item.percentage }}%)</span>
          </div>
        </div>
      </div>

      <!-- Student Status -->
      <div class="text-center">
        <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-4">Student Status</h4>
        <div class="pie-chart-container">
          <VueApexCharts 
            type="pie" 
            height="150" 
            :options="studentChartOptions" 
            :series="studentSeries" 
          />
        </div>
        <div class="mt-3 space-y-2">
          <div v-for="item in studentData" :key="item.name" class="flex items-center justify-between text-sm">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: getStudentColor(item.name) }"></div>
              <span class="text-gray-600 dark:text-gray-400">{{ item.name }}</span>
            </div>
            <span class="font-medium text-gray-800 dark:text-white/90">{{ item.value }} ({{ item.percentage }}%)</span>
          </div>
        </div>
      </div>

      <!-- Participant vs Children -->
      <div class="text-center">
        <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-4">Participants vs Children</h4>
        <div class="pie-chart-container">
          <VueApexCharts 
            type="pie" 
            height="150" 
            :options="participantChartOptions" 
            :series="participantSeries" 
          />
        </div>
        <div class="mt-3 space-y-2">
          <div v-for="item in participantData" :key="item.name" class="flex items-center justify-between text-sm">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: getParticipantColor(item.name) }"></div>
              <span class="text-gray-600 dark:text-gray-400">{{ item.name }}</span>
            </div>
            <span class="font-medium text-gray-800 dark:text-white/90">{{ item.value }} ({{ item.percentage }}%)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Stats
    <div class="mt-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="text-center">
        <p class="text-2xl font-bold text-gray-800 dark:text-white/90">{{ totalParticipants }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">Total Participants</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-gray-800 dark:text-white/90">{{ totalStudents }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">Students</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-gray-800 dark:text-white/90">{{ totalChildren }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">Children</p>
      </div> -->
    <!-- </div> -->
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
const chartData = ref({
  gender: {
    male: 0,
    female: 0,
    unspecified: 0
  },
  student: {
    student: 0,
    nonStudent: 0
  },
  participants: {
    adults: 0,
    children: 0
  }
})

// Fetch data for pie charts
const fetchPieChartData = async () => {
  try {
    loading.value = true
    
    const startDate = new Date(selectedYear.value, selectedMonth.value - 1, 1)
    const endDate = new Date(selectedYear.value, selectedMonth.value, 0)

    // Fetch all tickets for the selected month
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    if (error) throw error

    // Process data for charts
    processChartData(data || [])
    
  } catch (error) {
    console.error('Error fetching pie chart data:', error)
  } finally {
    loading.value = false
  }
}

// Process data for all charts
const processChartData = (tickets) => {
  // Reset data
  chartData.value = {
    gender: { male: 0, female: 0, unspecified: 0 },
    student: { student: 0, nonStudent: 0 },
    participants: { adults: 0, children: 0 }
  }

  tickets.forEach(ticket => {
    // Gender distribution
    if (ticket.gender?.toLowerCase() === 'laki-laki') {
      chartData.value.gender.male++
    } else if (ticket.gender?.toLowerCase() === 'perempuan') {
      chartData.value.gender.female++
    } else {
      chartData.value.gender.unspecified++
    }

    // Student status
    if (ticket.is_student) {
      chartData.value.student.student++
    } else {
      chartData.value.student.nonStudent++
    }

    // Participants vs Children
    // Each ticket represents one adult participant
    chartData.value.participants.adults++
    
    // Count children if with_child is true
    if (ticket.with_child && ticket.num_of_children) {
      chartData.value.participants.children += ticket.num_of_children
    }
  })
}

// Computed data for charts with percentages
const genderData = computed(() => {
  const total = chartData.value.gender.male + chartData.value.gender.female + chartData.value.gender.unspecified
  return [
    {
      name: 'Male',
      value: chartData.value.gender.male,
      percentage: total > 0 ? Math.round((chartData.value.gender.male / total) * 100) : 0
    },
    {
      name: 'Female',
      value: chartData.value.gender.female,
      percentage: total > 0 ? Math.round((chartData.value.gender.female / total) * 100) : 0
    },
    {
      name: 'Unspecified',
      value: chartData.value.gender.unspecified,
      percentage: total > 0 ? Math.round((chartData.value.gender.unspecified / total) * 100) : 0
    }
  ]
})

const studentData = computed(() => {
  const total = chartData.value.student.student + chartData.value.student.nonStudent
  return [
    {
      name: 'Student',
      value: chartData.value.student.student,
      percentage: total > 0 ? Math.round((chartData.value.student.student / total) * 100) : 0
    },
    {
      name: 'Non-Student',
      value: chartData.value.student.nonStudent,
      percentage: total > 0 ? Math.round((chartData.value.student.nonStudent / total) * 100) : 0
    }
  ]
})

const participantData = computed(() => {
  const total = chartData.value.participants.adults + chartData.value.participants.children
  return [
    {
      name: 'Participants',
      value: chartData.value.participants.adults,
      percentage: total > 0 ? Math.round((chartData.value.participants.adults / total) * 100) : 0
    },
    {
      name: 'Children',
      value: chartData.value.participants.children,
      percentage: total > 0 ? Math.round((chartData.value.participants.children / total) * 100) : 0
    }
  ]
})

// Chart series
const genderSeries = computed(() => genderData.value.map(item => item.value))
const studentSeries = computed(() => studentData.value.map(item => item.value))
const participantSeries = computed(() => participantData.value.map(item => item.value))

// Summary stats
const totalParticipants = computed(() => chartData.value.participants.adults)
const totalStudents = computed(() => chartData.value.student.student)
const totalChildren = computed(() => chartData.value.participants.children)

// Color functions
const getGenderColor = (name) => {
  const colors = {
    'Male': '#3B82F6',
    'Female': '#EC4899',
    'Unspecified': '#6B7280'
  }
  return colors[name] || '#6B7280'
}

const getStudentColor = (name) => {
  const colors = {
    'Student': '#10B981',
    'Non-Student': '#F59E0B'
  }
  return colors[name] || '#6B7280'
}

const getParticipantColor = (name) => {
  const colors = {
    'Participants': '#8B5CF6',
    'Children': '#F97316'
  }
  return colors[name] || '#6B7280'
}

// Chart options
const baseChartOptions = {
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'pie',
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: true,
    formatter: function (val, { seriesIndex, w }) {
      return w.config.series[seriesIndex]
    },
    style: {
      fontSize: '18px',
      fontWeight: 'bold',
      colors: ['#FFFFFF']
    },
    dropShadow: {
      enabled: false,
      top: 1,
      left: 1,
      blur: 1,
      opacity: 0.45
    }
  },
  tooltip: {
    y: {
      formatter: function (value, { seriesIndex, w }) {
        const total = w.config.series.reduce((a, b) => a + b, 0)
        const percentage = total > 0 ? Math.round((value / total) * 100) : 0
        return `${value} (${percentage}%)`
      }
    }
  },
  stroke: {
    width: 2,
    colors: ['#ffffff']
  },
  plotOptions: {
    pie: {
      donut: {
        size: '60%'
      },
      expandOnClick: false
    }
  }
}

const genderChartOptions = computed(() => ({
  ...baseChartOptions,
  colors: genderData.value.map(item => getGenderColor(item.name)),
  labels: genderData.value.map(item => item.name)
}))

const studentChartOptions = computed(() => ({
  ...baseChartOptions,
  colors: studentData.value.map(item => getStudentColor(item.name)),
  labels: studentData.value.map(item => item.name)
}))

const participantChartOptions = computed(() => ({
  ...baseChartOptions,
  colors: participantData.value.map(item => getParticipantColor(item.name)),
  labels: participantData.value.map(item => item.name)
}))

onMounted(() => {
  fetchPieChartData()
})

// Expose refresh function
defineExpose({
  refreshData: fetchPieChartData
})
</script>

<style scoped>
.pie-chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>