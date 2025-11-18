<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Daily Registrations</h3>

      <!-- Filter Bulan -->
      <div class="flex gap-3">
        <div class="relative">
          <select
            v-model="selectedMonth"
            @change="fetchDailyData"
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
            @change="fetchDailyData"
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

    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartOne" class="-ml-5 min-w-[650px] xl:min-w-full pl-2">
        <VueApexCharts type="bar" height="180" :options="chartOptions" :series="series" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import VueApexCharts from 'vue3-apexcharts'

const loading = ref(false)
const dailyData = ref([])

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

// Format date untuk label
const formatDateLabel = (dateString) => {
  const date = new Date(dateString)
  return date.getDate().toString()
}

// Fetch data harian
const fetchDailyData = async () => {
  try {
    loading.value = true
    
    const startDate = new Date(selectedYear.value, selectedMonth.value - 1, 1)
    const endDate = new Date(selectedYear.value, selectedMonth.value, 0)

    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true })

    if (error) throw error

    // Group data by day
    const dailyStats = {}
    const daysInMonth = endDate.getDate()
    
    // Initialize all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${selectedYear.value}-${selectedMonth.value.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      dailyStats[dateKey] = 0
    }

    // Count registrations per day
    data?.forEach(ticket => {
      const ticketDate = new Date(ticket.created_at)
      const dateKey = `${ticketDate.getFullYear()}-${(ticketDate.getMonth() + 1).toString().padStart(2, '0')}-${ticketDate.getDate().toString().padStart(2, '0')}`
      
      if (dailyStats[dateKey] !== undefined) {
        dailyStats[dateKey]++
      }
    })

    // Convert to array for chart
    dailyData.value = Object.entries(dailyStats).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => new Date(a.date) - new Date(b.date))

  } catch (error) {
    console.error('Error fetching daily data:', error)
  } finally {
    loading.value = false
  }
}

// Chart series data
const series = computed(() => [
  {
    name: 'Registrations',
    data: dailyData.value.map(day => day.count)
  }
])

// Chart options
const chartOptions = computed(() => ({
  colors: ['#465fff'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '39%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 4,
    colors: ['transparent'],
  },
  xaxis: {
    categories: dailyData.value.map(day => formatDateLabel(day.date)),
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    title: {
      text: 'Days',
      style: {
        fontSize: '12px',
        fontWeight: 'normal',
        color: '#6B7280'
      }
    }
  },
  legend: {
    show: false,
  },
  yaxis: {
    title: {
      text: 'Registrations',
      style: {
        fontSize: '12px',
        fontWeight: 'normal',
        color: '#6B7280'
      }
    },
  },
  grid: {
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    x: {
      formatter: function (val, { dataPointIndex }) {
        const date = dailyData.value[dataPointIndex]?.date
        if (!date) return `Day ${val}`
        
        const fullDate = new Date(date)
        return fullDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      }
    },
    y: {
      formatter: function (val) {
        return `${val} registration${val !== 1 ? 's' : ''}`
      },
    },
  },
}))

onMounted(() => {
  fetchDailyData()
})

// Expose refresh function
defineExpose({
  refreshData: fetchDailyData
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
</style>