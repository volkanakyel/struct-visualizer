<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  reducedMotion: boolean
}>()

const enter = computed(() =>
  props.reducedMotion
    ? ({ duration: 0 } as const)
    : ({ duration: 0.55, ease: [0.23, 1, 0.32, 1] as const } as const)
)

const easeOut = [0.23, 1, 0.32, 1] as const
</script>

<template>
  <div class="relative" aria-hidden="true">
    <svg
      class="absolute inset-0 h-full w-full text-border"
      viewBox="0 0 400 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Motion
        as="path"
        d="M 72 120 C 140 80, 200 100, 248 168"
        stroke="currentColor"
        stroke-width="1.25"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
        :initial="reducedMotion ? false : { pathLength: 0, opacity: 0 }"
        :animate="{ pathLength: 1, opacity: 1 }"
        :transition="
          reducedMotion
            ? { duration: 0 }
            : {
                pathLength: { duration: 1, ease: easeOut },
                opacity: { duration: 0.35 },
              }
        "
      />
      <Motion
        as="path"
        d="M 248 168 C 290 220, 310 260, 318 300"
        stroke="currentColor"
        stroke-width="1.25"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
        :initial="reducedMotion ? false : { pathLength: 0, opacity: 0 }"
        :animate="{ pathLength: 1, opacity: 1 }"
        :transition="
          reducedMotion
            ? { duration: 0 }
            : {
                pathLength: { duration: 0.85, delay: 0.15, ease: easeOut },
                opacity: { duration: 0.3, delay: 0.1 },
              }
        "
      />
      <Motion
        as="path"
        d="M 248 168 C 180 200, 120 240, 88 288"
        stroke="currentColor"
        stroke-width="1.1"
        stroke-dasharray="4 6"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
        class="text-muted/70"
        :initial="reducedMotion ? false : { pathLength: 0, opacity: 0 }"
        :animate="{ pathLength: 1, opacity: 1 }"
        :transition="
          reducedMotion
            ? { duration: 0 }
            : {
                pathLength: { duration: 0.9, delay: 0.22, ease: easeOut },
                opacity: { duration: 0.25, delay: 0.18 },
              }
        "
      />
    </svg>

    <div class="relative mx-auto h-[360px] max-w-[400px] sm:h-[400px]">
      <Motion
        as="div"
        class="absolute left-[2%] top-[8%] w-[46%] max-w-[200px]"
        :initial="reducedMotion ? false : { opacity: 0, scale: 0.96, y: 18 }"
        :while-in-view="{ opacity: 1, scale: 1, y: 0 }"
        :transition="enter"
        :viewport="{ once: true, amount: 0.35 }"
      >
        <Motion
          as="div"
          :animate="
            reducedMotion
              ? { y: 0 }
              : {
                  y: [0, -5, 0],
                  transition: {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }
          "
        >
          <div
            class="table-node-clean border-borderDark shadow-card ring-1 ring-black/[0.03] transition-shadow duration-300 hover:shadow-cardHover"
          >
            <div
              class="table-header-clean flex items-center justify-between border-borderDark bg-secondary"
            >
              <span class="font-mono text-[9px] text-muted">//001</span>
              <span class="text-sm font-semibold tracking-tight text-primary">users</span>
            </div>
            <div class="divide-y divide-border px-3 py-1.5 font-mono text-[11px] text-textMuted">
              <div class="flex justify-between py-1.5">
                <span class="text-primary">id</span>
                <span class="h-2 w-2 shrink-0 rounded-full bg-yellow" />
              </div>
              <div class="flex justify-between py-1.5">
                <span class="text-primary">email</span>
                <span class="h-2 w-2 shrink-0 rounded-full bg-orange" />
              </div>
            </div>
          </div>
        </Motion>
      </Motion>

      <Motion
        as="div"
        class="absolute left-[48%] top-[32%] w-[50%] max-w-[210px]"
        :initial="reducedMotion ? false : { opacity: 0, scale: 0.96, y: 22 }"
        :while-in-view="{ opacity: 1, scale: 1, y: 0 }"
        :transition="
          reducedMotion ? { duration: 0 } : { duration: 0.55, delay: 0.1, ease: easeOut }
        "
        :viewport="{ once: true, amount: 0.35 }"
      >
        <Motion
          as="div"
          :animate="
            reducedMotion
              ? { y: 0 }
              : {
                  y: [0, -4, 0],
                  transition: {
                    duration: 5.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.4,
                  },
                }
          "
        >
          <div
            class="table-node-clean border-borderDark shadow-card ring-1 ring-black/[0.03] transition-shadow duration-300 hover:shadow-cardHover"
          >
            <div class="table-header-clean flex items-center justify-between">
              <span class="font-mono text-[9px] text-muted">//002</span>
              <span class="text-sm font-semibold tracking-tight text-primary">posts</span>
            </div>
            <div class="divide-y divide-border px-3 py-1.5 font-mono text-[11px] text-textMuted">
              <div class="flex justify-between py-1.5">
                <span class="text-primary">author_id</span>
                <span class="h-2 w-2 shrink-0 rounded-full bg-purple" />
              </div>
              <div class="flex justify-between py-1.5">
                <span class="text-primary">title</span>
                <span class="h-2 w-2 shrink-0 rounded-full bg-orange" />
              </div>
            </div>
          </div>
        </Motion>
      </Motion>

      <Motion
        as="div"
        class="absolute bottom-[6%] left-[6%] w-[42%] max-w-[180px]"
        :initial="reducedMotion ? false : { opacity: 0, scale: 0.96, y: 20 }"
        :while-in-view="{ opacity: 1, scale: 1, y: 0 }"
        :transition="
          reducedMotion ? { duration: 0 } : { duration: 0.55, delay: 0.2, ease: easeOut }
        "
        :viewport="{ once: true, amount: 0.35 }"
      >
        <Motion
          as="div"
          :animate="
            reducedMotion
              ? { y: 0 }
              : {
                  y: [0, -3, 0],
                  transition: {
                    duration: 5.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.2,
                  },
                }
          "
        >
          <div
            class="table-node-clean border-borderDark shadow-card ring-1 ring-black/[0.03] transition-shadow duration-300 hover:shadow-cardHover"
          >
            <div class="table-header-clean flex items-center justify-between">
              <span class="font-mono text-[9px] text-muted">//003</span>
              <span class="text-sm font-semibold tracking-tight text-primary">tags</span>
            </div>
            <div class="divide-y divide-border px-3 py-1.5 font-mono text-[11px] text-textMuted">
              <div class="flex justify-between py-1.5">
                <span class="text-primary">slug</span>
                <span class="h-2 w-2 shrink-0 rounded-full bg-orange" />
              </div>
            </div>
          </div>
        </Motion>
      </Motion>

      <Motion
        as="div"
        class="pointer-events-none absolute bottom-4 right-2 hidden rounded-md border border-border bg-surface/95 px-2.5 py-1.5 font-mono text-[9px] text-muted shadow-card sm:block"
        :initial="reducedMotion ? false : { opacity: 0, x: 10 }"
        :while-in-view="{ opacity: 1, x: 0 }"
        :transition="
          reducedMotion ? { duration: 0 } : { duration: 0.45, delay: 0.45, ease: easeOut }
        "
        :viewport="{ once: true }"
      >
        fit view · smoothstep edges
      </Motion>
    </div>
  </div>
</template>
