<script lang="ts" setup>
import BlitzTh from '../BlitzTh.vue'
</script>

<template>
  <BlitzTh
    :column="{ id: 'name', sortable: true }"
    :sortState="[{ id: 'name', direction: 'asc' }]"
    :lang="{}"
  />
</template>
