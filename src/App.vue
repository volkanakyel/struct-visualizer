<template>
  <div class="h-screen w-screen flex flex-col bg-background relative">
    <!-- Full-screen Loading overlay -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="isLoading" class="fixed inset-0 z-[100] flex items-center justify-center">
        <!-- Blurred backdrop -->
        <div class="absolute inset-0 bg-background/60 backdrop-blur-md"></div>

        <!-- Loader content -->
        <div class="relative flex flex-col items-center gap-8">
          <!-- Large radial spinner -->
          <div class="radial-spinner-large">
            <div class="spinner-center"></div>
            <div v-for="i in 20" :key="i" class="spinner-line-large" :style="getSpinnerLineStyle(i)"></div>
          </div>
          <div class="flex flex-col items-center gap-2">
            <span class="text-base font-medium text-primary">Processing JSON</span>
            <span class="text-sm font-mono text-muted">Generating visualization...</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Header with dither effect -->
    <header class="relative dither-pattern scan-lines border-b border-primary bg-surface">
      <div class="relative z-10 px-8 py-4 grid grid-cols-3 items-center">
        <!-- Left: Title -->
        <div class="flex items-center gap-3">
          <span class="font-mono text-[11px] text-muted tracking-wider">//001</span>
          <h1 class="text-lg font-semibold tracking-tight text-primary">
            Visualizer
          </h1>
        </div>

        <!-- Center: Tagline -->
        <div class="hidden md:flex justify-center">
          <p class="text-xs text-muted font-mono tracking-wide">
            JSON → Visual
          </p>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center justify-end gap-4">
          <div v-if="error" class="flex items-center gap-2 px-3 py-1.5 bg-red/5 border border-red/20">
            <span class="w-1.5 h-1.5 rounded-full bg-red animate-pulse"></span>
            <p class="text-xs text-red font-medium">{{ error }}</p>
          </div>
          <JsonInputSheet @json-submit="handleJsonSubmit" />
        </div>
      </div>

      <!-- Decorative tick marks -->

    </header>

    <!-- Main content area -->
    <main class="flex-grow relative grid-pattern">
      <DatabaseVisualizer :data="visualData" :mode="visualMode" />

      <!-- Bottom left info panel -->
      <div class="absolute bottom-4 left-4 flex flex-col gap-2">
        <!-- Color legend -->
        <div class="px-3 py-2 bg-surface/90 backdrop-blur border border-border">
          <div class="flex items-center gap-2 mb-2">
            <span class="section-number">//TYPES</span>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange"></span>
              <span class="text-[10px] font-mono text-muted">string</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-yellow"></span>
              <span class="text-[10px] font-mono text-muted">number</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-red"></span>
              <span class="text-[10px] font-mono text-muted">boolean</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-green"></span>
              <span class="text-[10px] font-mono text-muted">date</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue"></span>
              <span class="text-[10px] font-mono text-muted">object</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-purple"></span>
              <span class="text-[10px] font-mono text-muted">relation</span>
            </div>
          </div>
        </div>

        <!-- Status indicator -->
        <div class="flex items-center gap-3 px-3 py-2 bg-surface/90 backdrop-blur border border-border text-xs font-mono text-muted">
          <span class="section-number">//STATUS</span>
          <span class="h-3 w-px bg-border"></span>
          <span>{{ statusText }}</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import DatabaseVisualizer from './components/DatabaseVisualizer.vue'
import JsonInputSheet from './components/JsonInputSheet.vue'
import { transformGenericJSON, transformPocketBaseSchema } from './utils/schemaTransformer'

const data = ref([])
const genericData = ref({ nodes: [], relations: [] })
const visualMode = ref('schema') // 'schema' or 'generic'
const error = ref(null)
const isLoading = ref(false)

// Computed to pass correct data based on mode
const visualData = computed(() => {
  if (visualMode.value === 'generic') {
    return genericData.value
  }
  return data.value
})

// Status text
const statusText = computed(() => {
  if (visualMode.value === 'generic') {
    const nodeCount = genericData.value.nodes.length
    return nodeCount > 0 ? `${nodeCount} nodes loaded` : 'No data loaded'
  }
  return data.value.length > 0 ? `${data.value.length} tables loaded` : 'No schema loaded'
})

// Spinner line styles
const getSpinnerLineStyle = (index) => {
  const angle = (index - 1) * (360 / 20)
  const delay = (index - 1) * 0.05
  return {
    transform: `rotate(${angle}deg)`,
    animationDelay: `${delay}s`
  }
}

/**
 * Detect if JSON is PocketBase schema format
 */
const isPocketBaseSchema = (json) => {
  if (!Array.isArray(json)) return false
  if (json.length === 0) return false

  // Check if first item has PocketBase collection structure
  const first = json[0]
  return first &&
    typeof first === 'object' &&
    'name' in first &&
    'schema' in first &&
    Array.isArray(first.schema)
}

const handleJsonSubmit = async (jsonInput) => {
  isLoading.value = true
  error.value = null

  // Delay to let modal close and show loader smoothly
  await new Promise(resolve => setTimeout(resolve, 800))

  try {
    const parsedData = JSON.parse(jsonInput)

    if (isPocketBaseSchema(parsedData)) {
      // Handle PocketBase schema
      const transformedData = transformPocketBaseSchema(parsedData)
      data.value = transformedData
      genericData.value = { nodes: [], relations: [] }
      visualMode.value = 'schema'
    } else {
      // Handle generic JSON
      const result = transformGenericJSON(parsedData)
      genericData.value = result
      data.value = []
      visualMode.value = 'generic'
    }

    error.value = null
  } catch (err) {
    console.error('Parse error:', err)
    error.value = 'Invalid JSON input'
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
@import './assets/tailwind.css';

/* Large radial spinner for loading overlay */
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
  0%, 100% {
    opacity: 0.1;
  }
  50% {
    opacity: 1;
  }
}
</style>
