<template>
  <router-link to="/" class="lg:hidden">
    <img class="dark:hidden" height="50px" width="100px" src="/images/logo/logo.svg" alt="Logo" />
    <img class="hidden dark:block" height="50px" width="100px" src="/images/logo/logo-dark.svg" alt="Logo" />
  </router-link>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
