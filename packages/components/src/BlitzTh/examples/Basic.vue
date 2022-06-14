<script lang="ts" setup>
import BlitzTh from '../BlitzTh.vue'
</script>

<template>
  <BlitzTh :column="{ id: 'name' }" :sortState="[]" :lang="{}" />
  <BlitzTh :column="{ id: 'id', label: 'ID' }" :sortState="[]" :lang="{}" />
</template>
