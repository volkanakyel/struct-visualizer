<script setup lang="ts">
import { cn } from '@/lib/utils'
import { computed, useAttrs } from 'vue'

const attrs = useAttrs()
const classes = computed(() => cn('text-2xl font-semibold leading-none tracking-tight', attrs.class as string | undefined))
</script>

<template>
  <h3 v-bind="attrs" :class="classes">
    <slot />
  </h3>
</template>
