<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { transformGenericJSON, transformPocketBaseSchema } from '~/utils/schemaTransformer'

definePageMeta({
  layout: false,
  ssr: false,
})

type VisualMode = 'schema' | 'generic'

type TypeLegendItem = {
  name: string
  colorClass: string
}

const data = ref<unknown[]>([])
const genericData = ref<{ nodes: unknown[]; relations: unknown[] }>({ nodes: [], relations: [] })
const visualMode = ref<VisualMode>('schema')
const error = ref<string | null>(null)
const isLoading = ref(false)
const showTypesPopup = ref(false)
const windowWidth = ref(1024)

const typesList: TypeLegendItem[] = [
  { name: 'string', colorClass: 'bg-orange' },
  { name: 'number', colorClass: 'bg-yellow' },
  { name: 'boolean', colorClass: 'bg-red' },
  { name: 'date', colorClass: 'bg-green' },
  { name: 'object', colorClass: 'bg-blue' },
  { name: 'relation', colorClass: 'bg-purple' },
]

const tickCount = computed((): number => {
  return windowWidth.value < 640 ? 20 : 40
})

const isMobileError = computed((): boolean => windowWidth.value < 640)

const handleResize = (): void => {
  windowWidth.value = window.innerWidth
  if (windowWidth.value >= 640) {
    showTypesPopup.value = false
  }
}

onMounted(() => {
  windowWidth.value = window.innerWidth
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const visualData = computed(() => {
  if (visualMode.value === 'generic') {
    return genericData.value
  }
  return data.value
})

const statusText = computed((): string => {
  if (visualMode.value === 'generic') {
    const nodeCount = genericData.value.nodes.length
    return nodeCount > 0 ? `${nodeCount} nodes` : 'No data'
  }
  return data.value.length > 0 ? `${data.value.length} tables` : 'No schema'
})

const getSpinnerLineStyle = (index: number): Record<string, string> => {
  const angle = (index - 1) * (360 / 20)
  const delay = (index - 1) * 0.05
  return {
    transform: `rotate(${angle}deg)`,
    animationDelay: `${delay}s`,
  }
}

function isPocketBaseSchema(json: unknown): boolean {
  if (!Array.isArray(json)) return false
  if (json.length === 0) return false
  const first: unknown = json[0]
  if (!first || typeof first !== 'object' || first === null) return false
  const o = first as Record<string, unknown>
  return 'name' in o && 'schema' in o && Array.isArray(o.schema)
}

const handleJsonSubmit = async (jsonInput: string): Promise<void> => {
  isLoading.value = true
  error.value = null

  await new Promise<void>((resolve) => {
    setTimeout(resolve, 800)
  })

  try {
    const parsedData: unknown = JSON.parse(jsonInput)

    if (isPocketBaseSchema(parsedData)) {
      const transformedData = transformPocketBaseSchema(parsedData)
      data.value = transformedData
      genericData.value = { nodes: [], relations: [] }
      visualMode.value = 'schema'
    } else {
      const result = transformGenericJSON(parsedData as Record<string, unknown> | unknown[])
      genericData.value = result
      data.value = []
      visualMode.value = 'generic'
    }

    error.value = null
  } catch {
    error.value = 'Invalid JSON input'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="relative flex h-screen w-screen flex-col bg-background">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="isLoading" class="fixed inset-0 z-[100] flex items-center justify-center">
        <div class="absolute inset-0 bg-background/60 backdrop-blur-md" />

        <div class="relative flex flex-col items-center gap-6 sm:gap-8">
          <div class="radial-spinner-large text-primary">
            <div class="spinner-center" />
            <div
              v-for="i in 20"
              :key="i"
              class="spinner-line-large"
              :style="getSpinnerLineStyle(i)"
            />
          </div>
          <div class="flex flex-col items-center gap-1.5 sm:gap-2">
            <span class="text-sm font-medium text-primary sm:text-base">Processing JSON</span>
            <span class="font-mono text-xs text-muted sm:text-sm">Generating visualization...</span>
          </div>
        </div>
      </div>
    </Transition>

    <header class="relative bg-surface">
      <div class="header-dither absolute inset-0" />

      <div
        class="relative z-10 flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-3 sm:px-6 sm:py-4 lg:px-8"
      >
        <div class="flex items-center gap-2 sm:gap-3">
          <NuxtLink
            to="/"
            class="mr-1 hidden rounded border border-border px-2 py-1 font-mono text-[9px] text-muted transition-colors hover:border-borderDark hover:text-primary sm:inline"
            aria-label="Back to landing"
          >
            ←
          </NuxtLink>
          <img src="/logo.svg" alt="Struct Visualizer logo" class="h-5 w-5 object-contain" />
          <span
            class="hidden font-mono text-[10px] tracking-wider text-muted sm:inline sm:text-[11px]"
            >//001</span
          >
          <h1 class="text-base font-semibold tracking-tight text-primary sm:text-lg">Visualizer</h1>
        </div>

        <div class="hidden justify-center md:flex">
          <p class="font-mono text-xs tracking-wide text-muted">JSON → Visual</p>
        </div>

        <div class="flex items-center justify-end gap-2 sm:gap-4">
          <div
            v-if="error"
            class="hidden items-center gap-2 border border-red/20 bg-red/5 px-2 py-1 sm:flex sm:px-3 sm:py-1.5"
          >
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-red" />
            <p class="text-[10px] font-medium text-red sm:text-xs">{{ error }}</p>
          </div>
          <JsonInputSheet @json-submit="handleJsonSubmit" />
        </div>
      </div>

      <div class="relative h-2 bg-gradient-to-b from-surface to-background sm:h-3">
        <div class="absolute inset-x-0 bottom-0 h-px bg-border" />
        <div class="absolute bottom-0 left-4 flex items-end gap-[2px] sm:left-8">
          <span
            v-for="i in tickCount"
            :key="'left-' + i"
            :class="[
              'w-px bg-primary/40',
              i % 10 === 1 ? 'h-2 sm:h-2.5' : i % 5 === 1 ? 'h-1 sm:h-1.5' : 'h-0.5 sm:h-1',
            ]"
          />
        </div>
        <div class="absolute bottom-0 left-1/2 h-px w-10 -translate-x-1/2 bg-primary sm:w-16" />
        <div class="absolute bottom-0 right-4 flex items-end gap-[2px] sm:right-8">
          <span
            v-for="i in tickCount"
            :key="'right-' + i"
            :class="[
              'w-px bg-primary/40',
              i % 10 === 0 ? 'h-2 sm:h-2.5' : i % 5 === 0 ? 'h-1 sm:h-1.5' : 'h-0.5 sm:h-1',
            ]"
          />
        </div>
      </div>
    </header>

    <main class="relative flex-grow grid-pattern">
      <DatabaseVisualizer :data="visualData" :mode="visualMode" />

      <div class="absolute bottom-3 left-3 flex flex-col gap-1.5 sm:bottom-4 sm:left-4 sm:gap-2">
        <div class="relative sm:hidden">
          <button
            type="button"
            class="flex items-center gap-2 border border-border bg-surface/95 px-2.5 py-1.5 backdrop-blur transition-colors active:bg-secondary"
            :aria-expanded="showTypesPopup"
            aria-controls="types-popup"
            @click="showTypesPopup = !showTypesPopup"
          >
            <div class="flex items-center gap-1">
              <span class="h-1.5 w-1.5 rounded-full bg-orange" />
              <span class="h-1.5 w-1.5 rounded-full bg-blue" />
              <span class="h-1.5 w-1.5 rounded-full bg-purple" />
            </div>
            <span class="font-mono text-[10px] tracking-wide text-muted">//TYPES</span>
            <svg
              class="h-3 w-3 text-muted transition-transform duration-200"
              :class="{ 'rotate-180': showTypesPopup }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </button>

          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            leave-active-class="transition-all duration-150 ease-in"
            enter-from-class="translate-y-2 scale-95 opacity-0"
            leave-to-class="translate-y-2 scale-95 opacity-0"
          >
            <div
              v-if="showTypesPopup"
              id="types-popup"
              class="absolute bottom-full left-0 mb-2 origin-bottom-left rounded-sm border border-border bg-surface/98 p-3 shadow-card backdrop-blur-lg"
            >
              <div class="grid grid-cols-2 gap-x-5 gap-y-2">
                <div v-for="typeItem in typesList" :key="typeItem.name" class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full" :class="typeItem.colorClass" />
                  <span class="font-mono text-[11px] text-muted">{{ typeItem.name }}</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="hidden border border-border bg-surface/90 px-3 py-2 backdrop-blur sm:block">
          <div class="mb-2 flex items-center gap-2">
            <span class="section-number">//TYPES</span>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1">
            <div
              v-for="typeItem in typesList"
              :key="'desktop-' + typeItem.name"
              class="flex items-center gap-2"
            >
              <span class="h-2 w-2 rounded-full" :class="typeItem.colorClass" />
              <span class="font-mono text-[10px] text-muted">{{ typeItem.name }}</span>
            </div>
          </div>
        </div>

        <div
          class="flex items-center gap-2 border border-border bg-surface/90 px-2.5 py-1.5 font-mono text-[10px] text-muted backdrop-blur sm:gap-3 sm:px-3 sm:py-2 sm:text-xs"
        >
          <span class="section-number text-[9px] sm:text-[10px]">//STATUS</span>
          <span class="h-2.5 w-px bg-border sm:h-3" />
          <span class="max-w-[120px] truncate sm:max-w-none">{{ statusText }}</span>
        </div>
      </div>

      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="-translate-y-2 opacity-0"
        leave-to-class="-translate-y-2 opacity-0"
      >
        <div
          v-if="error && isMobileError"
          class="absolute left-3 right-3 top-3 flex items-center gap-2 border border-red/20 bg-red/10 px-3 py-2 sm:hidden"
        >
          <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-red" />
          <p class="flex-1 text-[11px] font-medium text-red">{{ error }}</p>
          <button
            type="button"
            class="text-red/60 hover:text-red"
            aria-label="Dismiss error"
            @click="error = null"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </Transition>
    </main>
  </div>
</template>

<style scoped>
.radial-spinner-large {
  position: relative;
  width: 80px;
  height: 80px;
}

.spinner-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-left: -10px;
  margin-top: -10px;
  border: 2px solid currentColor;
  border-radius: 50%;
  opacity: 0.3;
}

.spinner-line-large {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 3px;
  height: 18px;
  margin-left: -1.5px;
  margin-top: -35px;
  background-color: currentColor;
  border-radius: 2px;
  transform-origin: center 35px;
  animation: spinner-fade 1s infinite ease-in-out;
  opacity: 0;
}

@keyframes spinner-fade {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 1;
  }
}

.header-dither {
  background-image:
    radial-gradient(circle at 1px 1px, rgb(163 163 163) 0.5px, transparent 0.5px),
    radial-gradient(circle at 2px 2px, rgb(163 163 163) 0.3px, transparent 0.3px);
  background-size: 4px 4px, 6px 6px;
  opacity: 0.15;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%);
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.2) 60%,
    transparent 100%
  );
  pointer-events: none;
}
</style>
