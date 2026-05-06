<script setup lang="ts">
defineProps<{
  reducedMotion: boolean
}>()

const easeOut = [0.23, 1, 0.32, 1] as const

function blockTransition(reduced: boolean, delay: number): Record<string, unknown> {
  if (reduced) {
    return { duration: 0 }
  }
  return { duration: 0.5, delay, ease: easeOut }
}
</script>

<template>
  <section class="border-b border-border/60 bg-background py-16 sm:py-20">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <Motion
        as="div"
        class="mx-auto max-w-2xl text-center"
        :initial="reducedMotion ? false : { opacity: 0, y: 16 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="blockTransition(reducedMotion, 0)"
        :viewport="{ once: true, margin: '-12%' }"
      >
        <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Why it exists</p>
        <h2 class="mt-2 text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
          Structure you can walk through—not scroll through.
        </h2>
        <p class="mt-4 text-sm leading-relaxed text-textMuted sm:text-base">
          Tables, nested objects, and relations become nodes and edges. The same mental model as
          your ERD tools, tuned for quick schema checks and JSON exploration.
        </p>
      </Motion>

      <div class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        <Motion
          as="article"
          class="clean-card group flex flex-col rounded-sm border border-border p-5 sm:p-6"
          :initial="reducedMotion ? false : { opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="blockTransition(reducedMotion, 0)"
          :viewport="{ once: true, amount: 0.3 }"
          :while-hover="reducedMotion ? undefined : { y: -2 }"
        >
          <span class="section-number text-[9px]">//01</span>
          <h3 class="mt-3 text-base font-semibold text-primary">PocketBase aware</h3>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-textMuted">
            Drop a collection export: fields, types, and relation arrows are inferred and laid out
            in a ring so nothing hides off-screen.
          </p>
          <div
            class="mt-4 flex items-center gap-2 font-mono text-[10px] text-muted group-hover:text-primary"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-purple" />
            relation edges · animated
          </div>
        </Motion>

        <Motion
          as="article"
          class="clean-card group flex flex-col rounded-sm border border-border bg-secondary/20 p-5 sm:p-6"
          :initial="reducedMotion ? false : { opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="blockTransition(reducedMotion, 0.08)"
          :viewport="{ once: true, amount: 0.3 }"
          :while-hover="reducedMotion ? undefined : { y: -2 }"
        >
          <span class="section-number text-[9px]">//02</span>
          <h3 class="mt-3 text-base font-semibold text-primary">Generic JSON</h3>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-textMuted">
            Arbitrary trees map to a hierarchical layout. Parent keys, nested objects, and arrays
            collapse into readable blocks without losing context.
          </p>
          <div
            class="mt-4 flex items-center gap-2 font-mono text-[10px] text-muted group-hover:text-primary"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-blue" />
            nested · hierarchical
          </div>
        </Motion>

        <Motion
          as="article"
          class="clean-card group flex flex-col rounded-sm border border-border p-5 sm:p-6 sm:col-span-2 lg:col-span-1"
          :initial="reducedMotion ? false : { opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="blockTransition(reducedMotion, 0.16)"
          :viewport="{ once: true, amount: 0.3 }"
          :while-hover="reducedMotion ? undefined : { y: -2 }"
        >
          <span class="section-number text-[9px]">//03</span>
          <h3 class="mt-3 text-base font-semibold text-primary">Editor-grade chrome</h3>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-textMuted">
            Dithered headers, mono rhythm, and a grid field echo tooling you already trust—so the
            canvas feels like part of your workflow, not a toy.
          </p>
          <div
            class="mt-4 flex items-center gap-2 font-mono text-[10px] text-muted group-hover:text-primary"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-primary" />
            import sheet · minimap
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>
