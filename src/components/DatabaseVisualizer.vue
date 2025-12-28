<template>
  <div class="h-full w-full">
    <VueFlow
      v-model="elements"
      :default-viewport="{ x: 0, y: 0, zoom: 1 }"
      :min-zoom="0.5"
      :max-zoom="1.5"
      :node-types="nodeTypes"
      :default-edge-options="defaultEdgeOptions"
      fit-view-on-init
      class="h-full w-full"
    >
      <Background
        :pattern-color="'#1f2937'"
        :gap="16"
      />
      <Controls />
      <MiniMap />
      <Panel position="bottom-left">
        <a
          href="https://www.bloblems.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-text text-xl no-underline hover:underline"
        >
          <span
            class="text-base font-['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']"
          >
            Ḃ
          </span>
        </a>
      </Panel>
    </VueFlow>
  </div>
</template>

<script setup>
import { Panel, useVueFlow, VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { nextTick, onMounted, ref, watch } from 'vue'
import { placeholderSchema } from '../utils/placeholderSchema'
import TableNode from './TableNode.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const nodeTypes = {
  table: TableNode
}

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: { stroke: '#808080', strokeWidth: 2 }
}

const elements = ref([])
const { fitView } = useVueFlow()

const createElements = data => {
  const nodes = []
  const edges = []

  if (data.length === 0) {
    // Create fake nodes for empty state
    nodes.push(
      { id: 'plan', type: 'table', position: { x: -200, y: 0 }, data: placeholderSchema[0] },
      { id: 'your', type: 'table', position: { x: 200, y: 200 }, data: placeholderSchema[1] },
      { id: 'pocketbase', type: 'table', position: { x: 600, y: 0 }, data: placeholderSchema[2] }
    )
    edges.push(
      {
        id: 'plan-to-your',
        source: 'plan',
        target: 'your',
        sourceHandle: 'your_id-right',
        targetHandle: 'your-left',
        type: 'smoothstep',
        animated: true,
        label: 'your_id'
      },
      {
        id: 'your-to-pocketbase',
        source: 'your',
        target: 'pocketbase',
        sourceHandle: 'pocketbase_id-right',
        targetHandle: 'pocketbase-left',
        type: 'smoothstep',
        animated: true,
        label: 'pocketbase_id'
      }
    )
  } else {
    const totalNodes = data.length
    const radius = Math.max(300, totalNodes * 100)
    const angleStep = (2 * Math.PI) / totalNodes

    data.forEach((table, index) => {
      const angle = index * angleStep
      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle)

      nodes.push({
        id: table.name,
        type: 'table',
        position: { x, y },
        data: table
      })

      table.columns.forEach(column => {
        if (column.type === 'relation' && column.relatedCollection) {
          edges.push({
            id: `${table.name}-${column.name}-${column.relatedCollection}`,
            source: table.name,
            target: column.relatedCollection,
            sourceHandle: `${column.name}-right`,
            targetHandle: `${column.relatedCollection}-left`,
            type: 'smoothstep',
            animated: true,
            label: column.name
          })
        }
      })
    })
  }

  return [...nodes, ...edges]
}

watch(
  () => props.data,
  newData => {
    elements.value = createElements(newData)
    nextTick(() => {
      fitView({ padding: 0.2 })
    })
  },
  { immediate: true }
)

onMounted(() => {
  fitView({ padding: 0.2 })
})
</script>
