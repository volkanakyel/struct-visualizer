<template>
  <div>
    <button
      @click="isOpen = true"
      class="json-editor-button bg-primary text-text hover:bg-primary/90 px-4 py-2 rounded"
    >
      Open JSON Editor
    </button>
    <TransitionRoot
      appear
      :show="isOpen"
      as="template"
    >
      <Dialog
        as="div"
        @close="isOpen = false"
        class="relative z-10"
      >
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="json-editor-sheet w-full max-w-md transform overflow-hidden rounded-2xl bg-background p-6 text-left align-middle shadow-xl transition-all"
              >
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-text"
                >
                  Edit JSON Schema
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-accent">
                    Paste or edit your pocketbase JSON schema here. Click 'Visualize Schema' when
                    you're ready to see the database structure.
                  </p>
                </div>

                <div class="mt-4 flex-1 flex flex-col min-h-0">
                  <div class="flex-1 overflow-hidden">
                    <textarea
                      v-model="jsonInput"
                      class="json-editor-textarea w-full h-64 p-2 text-sm font-mono resize-none bg-secondary text-text border-primary overflow-auto no-scrollbar placeholder-primary"
                      :placeholder="placeholderText"
                    ></textarea>
                  </div>
                  <div class="mt-4 flex justify-between">
                    <button
                      @click="loadSampleSchema"
                      class="sample-schema-button bg-primary text-text hover:bg-primary/90 px-4 py-2 rounded"
                    >
                      Load Sample Schema
                    </button>
                    <button
                      @click="handleSubmit"
                      class="visualize-button bg-blue text-text hover:bg-blue/90 px-4 py-2 rounded"
                    >
                      Visualize Schema
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
import { ref, watch } from 'vue'
import { formatJSON } from '../utils/jsonFormatter'
import { placeholderSchema } from '../utils/placeholderSchema'
import { sampleSchema } from '../utils/sampleSchema'

const emit = defineEmits(['json-submit'])

const isOpen = ref(false)
const jsonInput = ref('')

const placeholderText = formatJSON(JSON.stringify(placeholderSchema))

watch(isOpen, newValue => {
  if (newValue) {
    jsonInput.value = ''
  }
})

const handleSubmit = () => {
  emit('json-submit', jsonInput.value || formatJSON(JSON.stringify(placeholderSchema)))
  isOpen.value = false
}

const loadSampleSchema = () => {
  jsonInput.value = formatJSON(JSON.stringify(sampleSchema))
}
</script>
