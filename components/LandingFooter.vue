<script setup lang="ts">
defineProps<{
  reducedMotion: boolean
}>()

const easeOut = [0.23, 1, 0.32, 1] as const
</script>

<template>
  <footer class="border-t border-border bg-secondary/25 py-14 sm:py-16">
    <div class="mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <Motion
        as="div"
        :initial="reducedMotion ? false : { opacity: 0, y: 12 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="reducedMotion ? { duration: 0 } : { duration: 0.5, ease: easeOut }"
        :viewport="{ once: true }"
      >
        <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Struct Visualizer</p>
        <p class="mt-2 max-w-md text-sm leading-relaxed text-textMuted">
          Open source minded, detail obsessed. Built for builders who read schemas before they ship.
        </p>
      </Motion>
      <Motion
        as="div"
        class="flex flex-wrap gap-3"
        :initial="reducedMotion ? false : { opacity: 0, y: 12 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="reducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.08, ease: easeOut }"
        :viewport="{ once: true }"
      >
        <NuxtLink
          to="/visualizer"
          class="btn-dither rounded-sm px-5 py-2.5 text-xs font-medium uppercase tracking-wide"
        >
          Try the canvas
        </NuxtLink>
        <a
          href="https://motion.dev/docs/vue"
          class="inline-flex items-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-primary transition-colors duration-200 ease-out hover:border-borderDark"
          rel="noopener noreferrer"
          target="_blank"
        >
          Motion for Vue
        </a>
      </Motion>
    </div>
  </footer>
</template>
