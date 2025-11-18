<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-7">
        <participant-metrics />
        <participant-classification />
      </div>
      <div class="col-span-12 space-y-6xl: xl:col-span-5">
        <monthly-target />
      </div>
      <div class="col-span-12">
        <daily-registration />
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue'
import ParticipantMetrics from '../components/ecommerce/ParticipantMetrics.vue'
import MonthlyTarget from '../components/ecommerce/MonthlyTarget.vue'
import DailyRegistration from '../components/ecommerce/DailyRegistration.vue'
import CustomerDemographic from '../components/ecommerce/CustomerDemographic.vue'
import StatisticsChart from '../components/ecommerce/StatisticsChart.vue'
import RecentOrders from '../components/ecommerce/RecentOrders.vue'
import ParticipantClassification from '@/components/ecommerce/ParticipantClassification.vue'
export default {
  components: {
    AdminLayout,
    ParticipantMetrics,
    MonthlyTarget,
    DailyRegistration,
    ParticipantClassification
  },
  name: 'Event Dashboard',
}
</script>
