<template>
  <div class="h-screen w-screen flex flex-col bg-background text-text">
    <div class="p-4 flex justify-between items-center bg-secondary">
      <h1 class="text-2xl font-bold">Pocketbase Visualizer</h1>
      <div class="flex items-center space-x-4">
        <JsonInputSheet @json-submit="handleJsonSubmit" />
        <p
          v-if="error"
          class="error-message text-orange"
          >{{ error }}</p
        >
      </div>
    </div>
    <div class="flex-grow">
      <DatabaseVisualizer :data="data" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DatabaseVisualizer from './components/DatabaseVisualizer.vue'
import JsonInputSheet from './components/JsonInputSheet.vue'
import { transformPocketBaseSchema } from './utils/schemaTransformer'

const data = ref([])
const error = ref(null)

const handleJsonSubmit = (jsonInput) => {
  try {
    const parsedData = JSON.parse(jsonInput)
    const transformedData = transformPocketBaseSchema(parsedData)
    data.value = transformedData
    error.value = null
  } catch (err) {
    error.value = 'Invalid JSON input. Please check your JSON and try again.'
  }
}
</script>

<style>
@import './assets/tailwind.css';
</style>
