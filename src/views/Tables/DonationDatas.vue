<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <DonationDatas />
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import ParticipantDatas from "@/components/tables/basic-tables/ParticipantDatas.vue";
import DonationDatas from "@/components/tables/basic-tables/DonationDatas.vue";
const currentPageTitle = ref("Data Peserta");
</script>
