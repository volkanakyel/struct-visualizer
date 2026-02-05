<template>
  <div class="h-full w-full">
    <VueFlow
      v-model="elements"
      :default-viewport="{ x: 0, y: 0, zoom: 1 }"
      :min-zoom="0.2"
      :max-zoom="1.5"
      :node-types="nodeTypes"
      :default-edge-options="defaultEdgeOptions"
      fit-view-on-init
      class="h-full w-full"
    >
      <Background
        :pattern-color="'#e5e5e5'"
        :gap="isMobile ? 16 : 24"
        :size="1"
      />
      <!-- Controls - smaller on mobile -->
      <Controls 
        class="!border-border !bg-surface !shadow-card controls-responsive" 
        :show-zoom="!isMobile"
        :show-fit-view="true"
        :show-interactive="!isMobile"
      />
      <!-- MiniMap - hidden on mobile -->
      <MiniMap
        v-if="!isMobile"
        class="!border-border !bg-surface !shadow-card"
        :width="150"
        :height="150"
        :node-color="() => '#f5f5f5'"
        :node-stroke-color="() => '#0a0a0a'"
        :mask-color="'rgba(250, 250, 250, 0.8)'"
      />
    </VueFlow>
  </div>
</template>

<script setup>
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { useVueFlow, VueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { MiniMap } from '@vue-flow/minimap'
import { computed, markRaw, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { placeholderSchema } from '../utils/placeholderSchema'
import GenericNode from './GenericNode.vue'
import TableNode from './TableNode.vue'

const props = defineProps({
  data: {
    type: [Array, Object],
    default: () => []
  },
  mode: {
    type: String,
    default: 'schema' // 'schema' or 'generic'
  }
})

// Mobile detection
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const isMobile = computed(() => windowWidth.value < 640)

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

const nodeTypes = {
  table: markRaw(TableNode),
  generic: markRaw(GenericNode)
}

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: { stroke: '#a3a3a3', strokeWidth: 1.5 },
  labelStyle: { fill: '#525252', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
  labelBgStyle: { fill: '#fafafa', fillOpacity: 0.9 },
  labelBgPadding: [6, 4],
  labelBgBorderRadius: 2
}

const elements = ref([])
const { fitView } = useVueFlow()

/**
 * Create elements for schema mode (PocketBase)
 */
const createSchemaElements = data => {
  const nodes = []
  const edges = []

  if (data.length === 0) {
    // Create placeholder nodes for empty state
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

/**
 * Create elements for generic JSON mode
 */
const createGenericElements = (data) => {
  const nodes = []
  const edges = []
  const processedRelations = new Set()

  if (!data || !data.nodes || data.nodes.length === 0) {
    // Return empty state placeholder
    return createSchemaElements([])
  }

  // Build parent-child relationships
  const nodeMap = new Map()
  const childrenMap = new Map() // parentId -> [childIds]

  data.nodes.forEach(node => {
    nodeMap.set(node.id, node)
    if (node.parentId) {
      if (!childrenMap.has(node.parentId)) {
        childrenMap.set(node.parentId, [])
      }
      childrenMap.get(node.parentId).push(node.id)
    }
  })

  // Find root nodes (nodes without parents)
  const rootNodes = data.nodes.filter(n => !n.parentId)

  // Calculate positions using hierarchical layout
  const NODE_HEIGHT_BASE = 100
  const H_SPACING = 350
  const V_SPACING = 250

  // Calculate node height based on columns
  const getNodeHeight = (node) => {
    return NODE_HEIGHT_BASE + (node.columns?.length || 0) * 28
  }

  // Position nodes hierarchically
  const positionedNodes = new Map()

  const positionNode = (nodeId, x, y, level = 0) => {
    const node = nodeMap.get(nodeId)
    if (!node || positionedNodes.has(nodeId)) return y

    positionedNodes.set(nodeId, { x, y })

    const children = childrenMap.get(nodeId) || []
    let childY = y

    children.forEach((childId, index) => {
      const childX = x + H_SPACING
      childY = positionNode(childId, childX, childY, level + 1)
      if (index < children.length - 1) {
        childY += V_SPACING
      }
    })

    // Return the max Y used
    return Math.max(y + getNodeHeight(node), childY)
  }

  // Position all root nodes
  let currentY = 0
  rootNodes.forEach((rootNode) => {
    currentY = positionNode(rootNode.id, 0, currentY)
    currentY += V_SPACING
  })

  // Create Vue Flow nodes
  positionedNodes.forEach((pos, nodeId) => {
    const node = nodeMap.get(nodeId)
    nodes.push({
      id: nodeId,
      type: 'generic',
      position: { x: pos.x, y: pos.y },
      data: {
        name: node.name,
        columns: node.columns || [],
        parentId: node.parentId,
        relationKey: node.relationKey
      }
    })
  })

  // Create edges from relations
  data.relations.forEach(rel => {
    const edgeId = `${rel.sourceId}-${rel.key}-${rel.targetId}`
    if (!processedRelations.has(edgeId)) {
      processedRelations.add(edgeId)

      // Find the source column that references this relation
      const sourceNode = nodeMap.get(rel.sourceId)
      const relationColumn = sourceNode?.columns?.find(c =>
        c.type === 'relation' && c.relatedCollection === rel.key
      )

      edges.push({
        id: edgeId,
        source: rel.sourceId,
        target: rel.targetId,
        sourceHandle: relationColumn ? `${relationColumn.name}-right` : `${rel.key}-right`,
        targetHandle: `${rel.targetId}-left`,
        type: 'smoothstep',
        animated: true,
        label: rel.key
      })
    }
  })

  return [...nodes, ...edges]
}

const createElements = (data, mode) => {
  if (mode === 'generic') {
    return createGenericElements(data)
  }
  return createSchemaElements(Array.isArray(data) ? data : [])
}

watch(
  [() => props.data, () => props.mode],
  ([newData, newMode]) => {
    elements.value = createElements(newData, newMode)
    nextTick(() => {
      fitView({ padding: 0.2 })
    })
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  fitView({ padding: 0.2 })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
