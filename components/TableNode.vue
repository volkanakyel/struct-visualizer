<template>
  <div class="table-node-clean group">
    <!-- Header -->
    <div class="table-header-clean flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="section-number opacity-60">//{{ String(nodeIndex).padStart(3, '0') }}</span>
        <span class="font-semibold text-primary tracking-tight">{{ data.name }}</span>
      </div>
      <GripVertical class="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-move" />
    </div>

    <!-- Columns -->
    <div class="divide-y divide-border">
      <div
        v-for="(column, index) in data.columns"
        :key="index"
        class="table-row-clean flex items-center justify-between relative group/row"
      >
        <div class="flex items-center gap-2">
          <span class="text-sm font-mono text-primary">{{ column.name }}</span>
          <span
            v-if="column.isPrimaryKey"
            class="px-1 py-0.5 text-[10px] font-mono font-medium bg-yellow/10 text-yellow rounded"
          >
            PK
          </span>
        </div>

        <div class="flex items-center gap-2">
          <!-- Relation indicator -->
          <template v-if="column.type === 'relation' && column.relatedCollection">
            <span class="text-muted text-xs">→</span>
            <span class="text-xs font-mono text-purple">{{ column.relatedCollection }}</span>
          </template>
          
          <!-- Type color dot -->
          <span 
            :class="['w-2 h-2 rounded-full shrink-0', getTypeDotColor(column.type)]"
            :title="column.type"
          ></span>
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

    <!-- Footer with column count -->
    <div class="px-4 py-2 border-t border-border bg-secondary/50 flex items-center justify-between">
      <span class="text-[10px] font-mono text-muted uppercase tracking-wider">
        {{ data.columns.length }} fields
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

// Generate a consistent index based on table name
const nodeIndex = computed(() => {
  let hash = 0
  for (let i = 0; i < props.data.name.length; i++) {
    hash = ((hash << 5) - hash) + props.data.name.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash % 100) + 1
})

const uniqueTypes = computed(() => {
  return [...new Set(props.data.columns.map(c => c.type))]
})

const getTypeDotColor = (type) => {
  const colorMap = {
    'int': 'bg-yellow',
    'number': 'bg-yellow',
    'varchar': 'bg-orange',
    'text': 'bg-orange',
    'datetime': 'bg-green',
    'date': 'bg-green',
    'autodate': 'bg-green',
    'json': 'bg-blue',
    'relation': 'bg-purple',
    'url': 'bg-orange',
    'bool': 'bg-red',
    'boolean': 'bg-red'
  }
  return colorMap[type.toLowerCase()] || 'bg-muted'
}
</script>
