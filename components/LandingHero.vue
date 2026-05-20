<script setup lang="ts">
defineProps<{
  reducedMotion: boolean
}>()

const enterEase = [0.23, 1, 0.32, 1] as const

function lineTransition(reduced: boolean): Record<string, unknown> {
  if (reduced) {
    return { duration: 0 }
  }
  return { duration: 0.65, ease: enterEase }
}
</script>

<template>
  <section
    class="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background to-secondary/30"
  >
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.35]"
      aria-hidden="true"
    >
      <div
        class="absolute -left-1/4 top-0 h-[min(70vh,520px)] w-[min(90vw,720px)] rounded-full bg-gradient-to-br from-border/40 via-transparent to-transparent blur-3xl"
      />
      <div
        class="absolute -right-1/4 bottom-0 h-[min(50vh,400px)] w-[min(80vw,560px)] rounded-full bg-gradient-to-tl from-secondary via-transparent to-transparent blur-3xl"
      />
    </div>

    <div
      class="relative mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-16 sm:gap-16 sm:px-6 sm:pb-24 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16 lg:px-8"
    >
      <div class="flex max-w-xl flex-col gap-8">
        <Motion
          as="div"
          :initial="reducedMotion ? false : { opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="lineTransition(reducedMotion)"
        >
          <p
            class="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:text-[11px]"
          >
            JSON → structure
          </p>
          <h1
            class="text-balance text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-[2.65rem] lg:leading-[1.08]"
          >
            See your data as a graph before you ship it.
          </h1>
        </Motion>

        <Motion
          as="p"
          class="text-pretty text-sm leading-relaxed text-textMuted sm:text-base"
          :initial="reducedMotion ? false : { opacity: 0, y: 16 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.65, delay: 0.08, ease: enterEase }
          "
        >
          Paste a PocketBase export or any nested JSON. Pan, zoom, and trace relations
          the way your brain already does—only faster.
        </Motion>

        <Motion
          as="div"
          class="flex flex-wrap items-center gap-3"
          :initial="reducedMotion ? false : { opacity: 0, y: 14 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.65, delay: 0.14, ease: enterEase }
          "
        >
          <NuxtLink
            to="/visualizer"
            class="btn-dither inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-xs font-medium uppercase tracking-wide"
          >
            Launch visualizer
            <span aria-hidden="true" class="font-mono text-[10px] opacity-80">↗</span>
          </NuxtLink>
          <NuxtLink
            to="/details"
            class="inline-flex items-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-primary transition-colors duration-200 ease-out hover:border-borderDark hover:bg-secondary"
          >
            How it works
          </NuxtLink>
        </Motion>

        <Motion
          as="div"
          class="grid grid-cols-3 gap-3 border-t border-border/80 pt-8 sm:gap-6"
          :initial="reducedMotion ? false : { opacity: 0 }"
          :while-in-view="{ opacity: 1 }"
          :transition="lineTransition(reducedMotion)"
          :viewport="{ once: true, margin: '-10%' }"
        >
          <div>
            <p class="font-mono text-[9px] uppercase tracking-wider text-muted">Flow</p>
            <p class="mt-1 text-lg font-semibold tabular-nums text-primary sm:text-xl">Vue Flow</p>
          </div>
          <div>
            <p class="font-mono text-[9px] uppercase tracking-wider text-muted">Motion</p>
            <p class="mt-1 text-lg font-semibold tabular-nums text-primary sm:text-xl">Motion</p>
          </div>
          <div>
            <p class="font-mono text-[9px] uppercase tracking-wider text-muted">Modes</p>
            <p class="mt-1 text-lg font-semibold tabular-nums text-primary sm:text-xl">2</p>
          </div>
        </Motion>
      </div>

      <LandingGraphPreview class="relative min-h-[320px] lg:min-h-[420px]" :reduced-motion="reducedMotion" />
    </div>
  </section>
</template>
