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
        <div class="relative flex flex-col items-center gap-6 sm:gap-8">
          <!-- Large radial spinner -->
          <div class="radial-spinner-large">
            <div class="spinner-center"></div>
            <div v-for="i in 20" :key="i" class="spinner-line-large" :style="getSpinnerLineStyle(i)"></div>
          </div>
          <div class="flex flex-col items-center gap-1.5 sm:gap-2">
            <span class="text-sm sm:text-base font-medium text-primary">Processing JSON</span>
            <span class="text-xs sm:text-sm font-mono text-muted">Generating visualization...</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Header with dither effect -->
    <header class="relative bg-surface">
      <!-- Dither pattern overlay -->
      <div class="absolute inset-0 header-dither"></div>
      
      <!-- Content -->
      <div class="relative z-10 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between sm:grid sm:grid-cols-3">
        <!-- Left: Title -->
        <div class="flex items-center gap-2 sm:gap-3">
          <span class="hidden sm:inline font-mono text-[10px] sm:text-[11px] text-muted tracking-wider">//001</span>
          <h1 class="text-base sm:text-lg font-semibold tracking-tight text-primary">
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
        <div class="flex items-center justify-end gap-2 sm:gap-4">
          <div v-if="error" class="hidden sm:flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-red/5 border border-red/20">
            <span class="w-1.5 h-1.5 rounded-full bg-red animate-pulse"></span>
            <p class="text-[10px] sm:text-xs text-red font-medium">{{ error }}</p>
          </div>
          <JsonInputSheet @json-submit="handleJsonSubmit" />
        </div>
      </div>

      <!-- Bottom decorative ruler -->
      <div class="relative h-2 sm:h-3 bg-gradient-to-b from-surface to-background">
        <!-- Tick marks -->
        <div class="absolute inset-x-0 bottom-0 h-px bg-border"></div>
        <!-- Left tick marks - fewer on mobile -->
        <div class="absolute bottom-0 left-4 sm:left-8 flex items-end gap-[2px]">
          <span v-for="i in tickCount" :key="'left-' + i" 
            :class="[
              'w-px bg-primary/40',
              i % 10 === 1 ? 'h-2 sm:h-2.5' : i % 5 === 1 ? 'h-1 sm:h-1.5' : 'h-0.5 sm:h-1'
            ]"
          ></span>
        </div>
        <!-- Center accent line -->
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 sm:w-16 h-px bg-primary"></div>
        <!-- Right tick marks -->
        <div class="absolute bottom-0 right-4 sm:right-8 flex items-end gap-[2px]">
          <span v-for="i in tickCount" :key="'right-' + i" 
            :class="[
              'w-px bg-primary/40',
              i % 10 === 0 ? 'h-2 sm:h-2.5' : i % 5 === 0 ? 'h-1 sm:h-1.5' : 'h-0.5 sm:h-1'
            ]"
          ></span>
        </div>
      </div>
    </header>

    <!-- Main content area -->
    <main class="flex-grow relative grid-pattern">
      <DatabaseVisualizer :data="visualData" :mode="visualMode" />

      <!-- Bottom left info panel -->
      <div class="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex flex-col gap-1.5 sm:gap-2">
        
        <!-- Mobile: Types toggle button -->
        <div class="sm:hidden relative">
          <button 
            @click="showTypesPopup = !showTypesPopup"
            class="flex items-center gap-2 px-2.5 py-1.5 bg-surface/95 backdrop-blur border border-border active:bg-secondary transition-colors"
          >
            <div class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-orange"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-blue"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-purple"></span>
            </div>
            <span class="text-[10px] font-mono text-muted tracking-wide">//TYPES</span>
            <svg 
              class="w-3 h-3 text-muted transition-transform duration-200"
              :class="{ 'rotate-180': showTypesPopup }"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </button>

          <!-- Types Popup for mobile -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            leave-active-class="transition-all duration-150 ease-in"
            enter-from-class="opacity-0 translate-y-2 scale-95"
            leave-to-class="opacity-0 translate-y-2 scale-95"
          >
            <div 
              v-if="showTypesPopup"
              class="absolute bottom-full left-0 mb-2 p-3 bg-surface/98 backdrop-blur-lg border border-border shadow-card rounded-sm origin-bottom-left"
            >
              <div class="grid grid-cols-2 gap-x-5 gap-y-2">
                <div v-for="typeItem in typesList" :key="typeItem.name" class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full" :class="typeItem.colorClass"></span>
                  <span class="text-[11px] font-mono text-muted">{{ typeItem.name }}</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Desktop: Full color legend -->
        <div class="hidden sm:block px-3 py-2 bg-surface/90 backdrop-blur border border-border">
          <div class="flex items-center gap-2 mb-2">
            <span class="section-number">//TYPES</span>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1">
            <div v-for="typeItem in typesList" :key="'desktop-' + typeItem.name" class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full" :class="typeItem.colorClass"></span>
              <span class="text-[10px] font-mono text-muted">{{ typeItem.name }}</span>
            </div>
          </div>
        </div>

        <!-- Status indicator -->
        <div class="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-surface/90 backdrop-blur border border-border text-[10px] sm:text-xs font-mono text-muted">
          <span class="section-number text-[9px] sm:text-[10px]">//STATUS</span>
          <span class="h-2.5 sm:h-3 w-px bg-border"></span>
          <span class="truncate max-w-[120px] sm:max-w-none">{{ statusText }}</span>
        </div>
      </div>

      <!-- Mobile error toast -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 -translate-y-2"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div 
          v-if="error && isMobileError" 
          class="sm:hidden absolute top-3 left-3 right-3 flex items-center gap-2 px-3 py-2 bg-red/10 border border-red/20"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-red animate-pulse"></span>
          <p class="text-[11px] text-red font-medium flex-1">{{ error }}</p>
          <button @click="error = null" class="text-red/60 hover:text-red">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </Transition>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import DatabaseVisualizer from './components/DatabaseVisualizer.vue'
import JsonInputSheet from './components/JsonInputSheet.vue'
import { transformGenericJSON, transformPocketBaseSchema } from './utils/schemaTransformer'

const data = ref([])
const genericData = ref({ nodes: [], relations: [] })
const visualMode = ref('schema') // 'schema' or 'generic'
const error = ref(null)
const isLoading = ref(false)
const showTypesPopup = ref(false)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

// Types list for rendering
const typesList = [
  { name: 'string', colorClass: 'bg-orange' },
  { name: 'number', colorClass: 'bg-yellow' },
  { name: 'boolean', colorClass: 'bg-red' },
  { name: 'date', colorClass: 'bg-green' },
  { name: 'object', colorClass: 'bg-blue' },
  { name: 'relation', colorClass: 'bg-purple' }
]

// Responsive tick count
const tickCount = computed(() => {
  return windowWidth.value < 640 ? 20 : 40
})

// Check if mobile for error display
const isMobileError = computed(() => windowWidth.value < 640)

// Handle window resize
const handleResize = () => {
  windowWidth.value = window.innerWidth
  // Close popup when resizing to desktop
  if (windowWidth.value >= 640) {
    showTypesPopup.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

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
    return nodeCount > 0 ? `${nodeCount} nodes` : 'No data'
  }
  return data.value.length > 0 ? `${data.value.length} tables` : 'No schema'
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

/* Header dither effect - stipple pattern fading towards bottom */
.header-dither {
  background-image:
    /* Dense stipple layer */
    radial-gradient(circle at 1px 1px, var(--color-muted) 0.5px, transparent 0.5px),
    /* Medium stipple layer offset */
    radial-gradient(circle at 2px 2px, var(--color-muted) 0.3px, transparent 0.3px);
  background-size: 4px 4px, 6px 6px;
  opacity: 0.15;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
  pointer-events: none;
}
</style>
