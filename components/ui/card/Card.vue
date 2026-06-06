<script setup lang="ts">
import { cn } from '@/lib/utils'
import { computed, useAttrs } from 'vue'

const attrs = useAttrs()
const classes = computed(() => cn('rounded-lg border bg-surface text-primary shadow-sm', attrs.class as string | undefined))
</script>

<template>
  <div v-bind="attrs" :class="classes">
    <slot />
  </div>
</template>
