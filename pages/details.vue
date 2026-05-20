<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const prefersReducedMotion = usePrefersReducedMotion()
const easeOut = [0.23, 1, 0.32, 1] as const

const steps = [
  {
    id: '01',
    title: 'Paste or import',
    body: 'Open the import sheet, drop PocketBase JSON or any nested structure. Validation hints appear before you commit.',
  },
  {
    id: '02',
    title: 'Choose your lens',
    body: 'Schema mode highlights collections and relation columns. Generic mode walks arbitrary trees with parent links preserved.',
  },
  {
    id: '03',
    title: 'Navigate calmly',
    body: 'Pan and zoom with Vue Flow, use the minimap on desktop, and lean on animated smoothstep edges to trace dependencies.',
  },
] as const
</script>

<template>
  <div class="pb-20">
    <section class="border-b border-border/60 bg-gradient-to-b from-background to-secondary/20 py-14 sm:py-18">
      <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Motion
          as="p"
          class="font-mono text-[10px] uppercase tracking-[0.2em] text-muted"
          :initial="prefersReducedMotion ? false : { opacity: 0, y: 10 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: easeOut }"
        >
          Details
        </Motion>
        <Motion
          as="h1"
          class="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl"
          :initial="prefersReducedMotion ? false : { opacity: 0, y: 14 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="
            prefersReducedMotion ? { duration: 0 } : { duration: 0.55, delay: 0.06, ease: easeOut }
          "
        >
          Built for clarity under pressure.
        </Motion>
        <Motion
          as="p"
          class="mt-5 text-sm leading-relaxed text-textMuted sm:text-base"
          :initial="prefersReducedMotion ? false : { opacity: 0, y: 12 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="
            prefersReducedMotion ? { duration: 0 } : { duration: 0.55, delay: 0.12, ease: easeOut }
          "
        >
          Struct Visualizer is a focused surface: one canvas, one import path, and typography that
          keeps dense JSON legible. No accounts, no cloud round-trip—just your data and a graph you
          can reason about.
        </Motion>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <h2 class="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Flow
      </h2>
      <ol class="mt-10 list-none space-y-6 p-0">
        <li v-for="(step, index) in steps" :key="step.id">
          <Motion
            as="article"
            class="clean-card flex gap-5 rounded-sm border border-border p-5 sm:gap-8 sm:p-6"
            :initial="prefersReducedMotion ? false : { opacity: 0, x: -16 }"
            :while-in-view="{ opacity: 1, x: 0 }"
            :transition="
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.5, delay: index * 0.07, ease: easeOut }
            "
            :viewport="{ once: true, amount: 0.35 }"
          >
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center border border-borderDark bg-secondary font-mono text-xs font-semibold text-primary"
            >
              {{ step.id }}
            </span>
            <div>
              <h3 class="text-base font-semibold text-primary">{{ step.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-textMuted">{{ step.body }}</p>
            </div>
          </Motion>
        </li>
      </ol>
    </section>

    <section class="border-y border-border/60 bg-secondary/15 py-14 sm:py-16">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-xl">
            <h2 class="text-xl font-semibold tracking-tight text-primary sm:text-2xl">
              Motion with restraint.
            </h2>
            <p class="mt-3 text-sm leading-relaxed text-textMuted sm:text-base">
              Landing motion uses Motion for Vue with eased entrances and light hover lifts. If you
              prefer reduced motion, animations collapse to instant state so content never waits on
              a timeline.
            </p>
          </div>
          <NuxtLink
            to="/"
            class="btn-secondary inline-flex w-fit items-center justify-center rounded-sm px-4 py-2 text-sm"
          >
            ← Back home
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
