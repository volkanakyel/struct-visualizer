<template>
  <div class="generic-node group">
    <!-- Header -->
    <div class="generic-header flex items-center justify-between">
      <div class="flex items-center gap-3 min-w-0">
        <span class="section-number opacity-60 shrink-0">//{{ String(nodeIndex).padStart(3, '0') }}</span>
        <span class="font-semibold text-primary tracking-tight truncate">{{ data.name }}</span>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <span
          v-if="data.relationKey"
          class="px-1.5 py-0.5 text-[9px] font-mono font-medium bg-purple/10 text-purple rounded"
        >
          {{ data.relationKey }}
        </span>
        <GripVertical class="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-move" />
      </div>
    </div>

    <!-- Properties -->
    <div class="divide-y divide-border max-h-[300px] overflow-y-auto no-scrollbar">
      <div
        v-for="(column, index) in data.columns"
        :key="index"
        class="generic-row flex items-center justify-between relative group/row"
      >
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <span
            :class="[
              'text-sm font-mono truncate',
              column.isNested ? 'text-muted pl-2' : 'text-primary'
            ]"
            :title="column.name"
          >
            {{ column.name }}
          </span>
          <span
            v-if="column.isPrimaryKey"
            class="px-1 py-0.5 text-[10px] font-mono font-medium bg-yellow/10 text-yellow rounded shrink-0"
          >
            KEY
          </span>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <!-- Value preview for primitives -->
          <span
            v-if="column.value && column.type !== 'relation'"
            class="text-xs font-mono text-muted truncate max-w-[100px]"
            :title="column.value"
          >
            {{ column.value }}
          </span>

          <!-- Type badge -->
          <span :class="['type-badge', getTypeBadgeClass(column.type)]">
            {{ getTypeLabel(column.type) }}
          </span>

          <!-- Relation indicator -->
          <template v-if="column.type === 'relation'">
            <span class="text-muted">→</span>
            <span class="text-xs font-mono text-purple">{{ column.relatedCollection }}</span>
          </template>
        </div>

        <!-- Source handle for relations -->
        <Handle
          v-if="column.type === 'relation'"
          type="source"
          :id="`${column.name}-right`"
          :position="Position.Right"
          class="!w-2 !h-2 !bg-purple !border-2 !border-surface !-right-1"
        />
      </div>
    </div>

    <!-- Target handle -->
    <Handle
      type="target"
      :id="`${data.name}-left`"
      :position="Position.Left"
      class="!w-2 !h-2 !bg-muted !border-2 !border-surface"
      :style="{ top: '50%', left: '-5px' }"
    />

    <!-- Footer with property count -->
    <div class="px-4 py-2 border-t border-border bg-secondary/50 flex items-center justify-between">
      <span class="text-[10px] font-mono text-muted uppercase tracking-wider">
        {{ data.columns?.length || 0 }} properties
      </span>
      <div class="flex gap-1">
        <span
          v-for="type in uniqueTypes"
          :key="type"
          :class="['w-1.5 h-1.5 rounded-full', getTypeDotColor(type)]"
          :title="type"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import { GripVertical } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

// Generate a consistent index based on node name
const nodeIndex = computed(() => {
  const name = props.data.name || 'node'
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash % 100) + 1
})

const uniqueTypes = computed(() => {
  if (!props.data.columns) return []
  return [...new Set(props.data.columns.map(c => c.type))]
})

const getTypeLabel = (type) => {
  const labels = {
    'string': 'str',
    'number': 'num',
    'boolean': 'bool',
    'object': 'obj',
    'array': 'arr',
    'null': 'null',
    'undefined': 'undef',
    'relation': 'rel'
  }
  // Handle array types like "number[]"
  if (type?.endsWith('[]')) {
    const baseType = type.slice(0, -2)
    return (labels[baseType] || baseType) + '[]'
  }
  return labels[type] || type
}

const getTypeBadgeClass = (type) => {
  const typeMap = {
    'string': 'type-badge-string',
    'number': 'type-badge-number',
    'boolean': 'type-badge-bool',
    'object': 'type-badge-json',
    'array': 'type-badge-json',
    'null': 'bg-secondary text-textMuted',
    'undefined': 'bg-secondary text-textMuted',
    'relation': 'type-badge-relation'
  }
  // Handle array types
  if (type?.endsWith('[]')) {
    const baseType = type.slice(0, -2)
    return typeMap[baseType] || 'bg-secondary text-textMuted'
  }
  return typeMap[type] || 'bg-secondary text-textMuted'
}

const getTypeDotColor = (type) => {
  const colorMap = {
    'string': 'bg-orange',
    'number': 'bg-yellow',
    'boolean': 'bg-red',
    'object': 'bg-blue',
    'array': 'bg-blue',
    'null': 'bg-muted',
    'relation': 'bg-purple'
  }
  if (type?.endsWith('[]')) {
    const baseType = type.slice(0, -2)
    return colorMap[baseType] || 'bg-muted'
  }
  return colorMap[type] || 'bg-muted'
}
</script>

<style scoped>
.generic-node {
  @apply bg-surface border border-border shadow-card min-w-[250px] max-w-[350px];
}

.generic-header {
  @apply px-4 py-3 border-b border-border bg-secondary/30;
}

.generic-row {
  @apply px-4 py-2 hover:bg-secondary/50 transition-colors;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
