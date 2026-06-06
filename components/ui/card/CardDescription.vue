<script setup lang="ts">
import { cn } from '@/lib/utils'
import { computed, useAttrs } from 'vue'

const attrs = useAttrs()
const classes = computed(() => cn('text-sm text-textMuted', attrs.class as string | undefined))
</script>

<template>
  <p v-bind="attrs" :class="classes">
    <slot />
  </p>
</template>
