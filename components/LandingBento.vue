<script setup lang="ts">
import Features8 from '@/components/ui/features-8'

defineProps<{
  reducedMotion: boolean
}>()
</script>

<template>
  <section class="border-b border-border/60 bg-background py-16 sm:py-20">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Why it exists</p>
        <h2 class="mt-2 text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
          Structure you can walk through—not scroll through.
        </h2>
        <p class="mt-4 text-sm leading-relaxed text-textMuted sm:text-base">
          Tables, nested objects, and relations become nodes and edges. The same mental model as
          your ERD tools, tuned for quick schema checks and JSON exploration.
        </p>
      </div>

      <Features8 class="mt-14" />
    </div>
  </section>
</template>
