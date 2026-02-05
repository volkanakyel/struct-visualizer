<template>
  <div>
    <button
      @click="isOpen = true"
      class="btn-dither flex items-center gap-1.5 sm:gap-2"
    >
      <svg class="w-3 sm:w-3.5 h-3 sm:h-3.5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span class="relative z-10 text-xs sm:text-sm">Import JSON</span>
    </button>

    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" @close="isOpen = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 modal-overlay" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95 translate-y-4 sm:translate-y-4"
              enter-to="opacity-100 scale-100 translate-y-0"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100 translate-y-0"
              leave-to="opacity-0 scale-95 translate-y-4"
            >
              <DialogPanel class="w-full sm:max-w-lg transform overflow-hidden bg-surface border-t sm:border border-borderDark shadow-modal transition-all rounded-t-xl sm:rounded-none">
                <!-- Modal Header -->
                <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-border flex items-center justify-between">
                  <div class="flex items-center gap-2 sm:gap-4">
                    <span class="section-number text-[9px] sm:text-[10px]">//002</span>
                    <DialogTitle as="h3" class="text-base sm:text-lg font-semibold text-primary">
                      Import JSON
                    </DialogTitle>
                  </div>
                  <button
                    @click="isOpen = false"
                    class="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center text-muted hover:text-primary hover:bg-secondary transition-colors"
                  >
                    <svg class="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Modal Body -->
                <div class="p-4 sm:p-6">
                  <p class="text-xs sm:text-sm text-textMuted mb-3 sm:mb-4">
                    Paste any JSON structure below. The visualizer will parse and display it as an interactive diagram.
                  </p>

                  <div class="relative border border-border bg-surface">
                    <!-- Top bar with JSON label and valid/invalid indicator -->
                    <div class="flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 border-b border-border bg-secondary/30">
                      <span class="text-[9px] sm:text-[10px] font-mono text-muted uppercase tracking-wider">
                        JSON
                      </span>
                      <div
                        v-if="jsonInput"
                        class="flex items-center gap-1 sm:gap-1.5"
                      >
                        <span
                          :class="[
                            'w-1.5 h-1.5 rounded-full',
                            isValidJson ? 'bg-green' : 'bg-red'
                          ]"
                        ></span>
                        <span
                          :class="[
                            'text-[9px] sm:text-[10px] font-mono uppercase tracking-wider',
                            isValidJson ? 'text-green' : 'text-red'
                          ]"
                        >
                          {{ isValidJson ? 'Valid' : 'Invalid' }}
                        </span>
                      </div>
                    </div>
                    <textarea
                      ref="textareaRef"
                      v-model="jsonInput"
                      @paste="handlePaste"
                      @keydown.tab.prevent="handleTab"
                      class="w-full h-48 sm:h-56 px-2.5 sm:px-3 py-2.5 sm:py-3 resize-none no-scrollbar font-mono text-xs sm:text-sm leading-relaxed bg-transparent text-text focus:outline-none placeholder:text-muted"
                      :placeholder="placeholderText"
                      spellcheck="false"
                    ></textarea>
                    <!-- Corner decorations -->
                    <div class="absolute bottom-2 right-2 flex gap-1">
                      <span class="w-1 h-1 bg-border"></span>
                      <span class="w-1 h-1 bg-border"></span>
                      <span class="w-1 h-1 bg-border"></span>
                    </div>
                  </div>

                  <!-- Format button -->
                  <div class="mt-2.5 sm:mt-3 flex items-center justify-between">
                    <button
                      @click="formatInput"
                      :disabled="!jsonInput"
                      class="text-[10px] sm:text-xs font-mono text-muted hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 sm:gap-1.5"
                    >
                      <svg class="w-2.5 sm:w-3 h-2.5 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                      Format
                    </button>
                    <button
                      @click="clearInput"
                      :disabled="!jsonInput"
                      class="text-[10px] sm:text-xs font-mono text-muted hover:text-red disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <!-- Modal Footer -->
                <div class="px-4 sm:px-6 py-3 sm:py-4 border-t border-border bg-secondary/30 flex items-center justify-between gap-2">
                  <button
                    @click="loadSampleSchema"
                    class="btn-secondary text-[10px] sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2"
                  >
                    Sample
                  </button>
                  <div class="flex items-center gap-2 sm:gap-3">
                    <button
                      @click="isOpen = false"
                      class="hidden sm:block px-4 py-2 text-sm text-textMuted hover:text-primary transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      @click="handleSubmit"
                      :disabled="jsonInput && !isValidJson"
                      class="btn-dither flex items-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg class="w-3 sm:w-3.5 h-3 sm:h-3.5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span class="relative z-10 text-xs sm:text-sm">Visualize</span>
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { computed, ref, watch } from 'vue'
import { formatJSON } from '../utils/jsonFormatter'
import { placeholderSchema } from '../utils/placeholderSchema'
import { sampleSchema } from '../utils/sampleSchema'

const emit = defineEmits(['json-submit'])

const isOpen = ref(false)
const jsonInput = ref('')
const textareaRef = ref(null)

const placeholderText = `{
  "example": "Paste your JSON here",
  "nested": {
    "key": "value"
  },
  "array": [1, 2, 3]
}`

// Check if JSON is valid
const isValidJson = computed(() => {
  if (!jsonInput.value.trim()) return false
  try {
    JSON.parse(jsonInput.value)
    return true
  } catch {
    return false
  }
})

watch(isOpen, newValue => {
  if (newValue) {
    jsonInput.value = ''
  }
})

// Auto-format on paste
const handlePaste = (event) => {
  event.preventDefault()
  const pastedText = event.clipboardData.getData('text')

  try {
    const parsed = JSON.parse(pastedText)
    jsonInput.value = JSON.stringify(parsed, null, 2)
  } catch {
    // If not valid JSON, just paste as-is
    jsonInput.value = pastedText
  }
}

// Handle tab for indentation
const handleTab = () => {
  const textarea = textareaRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  const newValue = jsonInput.value.substring(0, start) + '  ' + jsonInput.value.substring(end)
  jsonInput.value = newValue

  // Set cursor position after the inserted spaces
  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd = start + 2
  }, 0)
}

// Format the current input
const formatInput = () => {
  try {
    const parsed = JSON.parse(jsonInput.value)
    jsonInput.value = JSON.stringify(parsed, null, 2)
  } catch {
    // Do nothing if invalid
  }
}

// Clear input
const clearInput = () => {
  jsonInput.value = ''
}

const handleSubmit = () => {
  if (jsonInput.value && !isValidJson.value) return

  // Close modal immediately and emit data for parent to handle loading
  const dataToSubmit = jsonInput.value || formatJSON(JSON.stringify(placeholderSchema))
  isOpen.value = false

  // Small delay to let modal close animation start, then emit
  setTimeout(() => {
    emit('json-submit', dataToSubmit)
  }, 100)
}

const loadSampleSchema = () => {
  jsonInput.value = formatJSON(JSON.stringify(sampleSchema))
}
</script>

<style scoped>
/* JSON label bar with dither effect */
.json-label-bar {
  position: relative;
  background-color: #f0f0f0;
  overflow: hidden;
}

.json-label-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    /* Dense stipple layer */
    radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.12) 1px, transparent 1px),
    /* Medium stipple layer */
    radial-gradient(circle at 3px 3px, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
    /* Sparse stipple layer */
    radial-gradient(circle at 5px 1px, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 3px 3px, 5px 5px, 7px 7px;
  pointer-events: none;
}

.json-label-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 30%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.4) 70%,
    transparent 100%
  );
  pointer-events: none;
}

.json-label-bar > * {
  position: relative;
  z-index: 1;
}
</style>
