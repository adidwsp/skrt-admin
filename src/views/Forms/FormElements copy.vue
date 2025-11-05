<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div class="space-y-6">
        <ComponentCard title="Default Inputs">
          <DefaultInputs />
        </ComponentCard>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import DefaultInputs from '@/components/forms/FormElements/DefaultInputs.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import SelectInput from '@/components/forms/FormElements/SelectInput.vue'
import InputState from '@/components/forms/FormElements/InputState.vue'
import TextArea from '@/components/forms/FormElements/TextArea.vue'
import InputGroup from '@/components/forms/FormElements/InputGroup.vue'
import Dropzone from '@/components/forms/FormElements/Dropzone.vue'
import FileInput from '@/components/forms/FormElements/FileInput.vue'
import CheckboxInput from '@/components/forms/FormElements/CheckboxInput.vue'

const currentPageTitle = ref('Form Elements')
</script>
